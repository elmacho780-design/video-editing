"""Deterministic agent/MCP caller tests. No model or service credentials needed.

Run with PYTHONPATH=src:. python -m pytest tests/test_web_research.py
"""
import asyncio
import json
import uuid
from contextlib import asynccontextmanager
from types import SimpleNamespace
from unittest.mock import AsyncMock, patch

import httpx
import pytest
from langchain_core.language_models.chat_models import BaseChatModel
from langchain_core.messages import AIMessage, HumanMessage, ToolMessage
from langchain_core.outputs import ChatGeneration, ChatResult
import langchain_mcp_adapters.sessions as sessions

from open_storyline import agent as agent_module
from open_storyline.agent import ClientContext, build_agent
from open_storyline.config import Settings, load_settings
from open_storyline.mcp.hooks.node_interceptors import ToolInterceptor
from open_storyline.mcp.web_research import USER_AGENT
from open_storyline.storage.agent_memory import ArtifactStore


class ResearchModel(BaseChatModel):
    """Scripted model: validates tool messages without remote model inference."""

    @property
    def _llm_type(self):
        return "scripted-research-test"

    def bind_tools(self, tools, **kwargs):
        return self

    def _generate(self, messages, stop=None, run_manager=None, **kwargs):
        start = max(i for i, m in enumerate(messages) if isinstance(m, HumanMessage))
        actions = messages[start].content.split(",")
        outputs = [m for m in messages[start:] if isinstance(m, ToolMessage)]
        if len(outputs) < len(actions):
            action = actions[len(outputs)]
            if action == "local":
                args = {}
                name = "storyline_local_noop"
            elif action == "fetch":
                args = {"urls": ["https://example.org/source"]}
                name = "parallel_web_fetch"
            else:
                args = {"objective": action, "search_queries": ["video research facts"]}
                name = "parallel_web_search"
            # A model cannot select or rotate the trusted conversation ID.
            if name.startswith("parallel_"):
                args["session_id"] = "model-supplied-id"
            response = AIMessage(content="", tool_calls=[{
                "name": name, "args": args, "id": str(uuid.uuid4()), "type": "tool_call",
            }])
        else:
            # Result consumption: both blocks, URLs, excerpts and errors reach the model.
            response = AIMessage(content=json.dumps([m.content for m in outputs]))
        return ChatResult(generations=[ChatGeneration(message=response)])


class MCPFixture:
    def __init__(self):
        self.requests = []
        self.calls = []
        self.started = asyncio.Event()
        self.discovery_error = False

    async def respond(self, request):
        body = json.loads(request.content) if request.content else {}
        self.requests.append((request, body))
        if request.method != "POST":
            return httpx.Response(405)
        if "id" not in body:
            return httpx.Response(202)
        method = body["method"]
        if method == "initialize":
            result = {"protocolVersion": body["params"]["protocolVersion"],
                      "capabilities": {"tools": {}}, "serverInfo": {"name": "fixture", "version": "1"}}
        elif method == "tools/list":
            if self.discovery_error and request.url.host != "127.0.0.1":
                return httpx.Response(503, text="research unavailable")
            tools = []
            if request.url.host == "127.0.0.1":
                tools.append({"name": "local_noop", "inputSchema": {"type": "object"}})
            if request.url.host != "127.0.0.1":
                for name, fields, required in [
                    ("web_search", {"objective": {"type": "string"}, "search_queries": {"type": "array", "items": {"type": "string"}}}, ["objective", "search_queries"]),
                    ("web_fetch", {"urls": {"type": "array", "items": {"type": "string"}}}, ["urls"]),
                ]:
                    tools.append({"name": name, "description": "Research reference material",
                                  "inputSchema": {"type": "object", "properties": {**fields, "session_id": {"type": "string"}}, "required": required}})
                tools.append({"name": "unexpected_tool", "inputSchema": {"type": "object"}})
            result = {"tools": tools}
        elif method == "tools/call" and request.url.host == "127.0.0.1":
            args = body["params"]["arguments"]
            assert args["artifact_id"] and args["lang"]
            assert "session_id" not in args
            assert request.headers["x-storyline-session-id"] == "private-storyline-session"
            result = {"content": [{"type": "text", "text": json.dumps({
                "artifact_id": args["artifact_id"], "isError": False, "summary": "local media result",
                "tool_excute_result": {},
            })}]}
        elif method == "tools/call":
            params = body["params"]
            self.calls.append(params)
            objective = params["arguments"].get("objective")
            if objective == "timeout":
                raise httpx.ReadTimeout("fixture read timed out", request=request)
            if objective == "cancel":
                self.started.set()
                await asyncio.Event().wait()
            if objective in {"error", "quota"}:
                result = {"isError": True, "content": [{"type": "text", "text": "quota reached" if objective == "quota" else "research failed"}]}
            else:
                result = {"isError": False, "content": [
                    {"type": "text", "text": "Source: https://example.org/source"},
                    {"type": "text", "text": "Verified research excerpt"},
                ], "structuredContent": {"url": "https://example.org/source"}}
        else:
            raise AssertionError(method)
        return httpx.Response(200, json={"jsonrpc": "2.0", "id": body["id"], "result": result})

    @asynccontextmanager
    async def installed(self):
        original = sessions.streamablehttp_client

        def factory(headers=None, timeout=None, auth=None):
            return httpx.AsyncClient(headers=headers, timeout=timeout, auth=auth,
                                     transport=httpx.MockTransport(self.respond))

        def connection(*args, **kwargs):
            return original(*args, **kwargs, httpx_client_factory=factory)

        with patch.object(sessions, "streamablehttp_client", connection):
            yield self


def configuration(tmp_path, **web):
    cfg = load_settings("config.toml")
    cfg.llm.model = cfg.vlm.model = "scripted-test"
    cfg.llm.base_url = cfg.vlm.base_url = "https://model.invalid/v1"
    cfg.llm.api_key = cfg.vlm.api_key = "isolated-test-key"
    cfg.project.outputs_dir = tmp_path / "outputs"
    cfg.project.media_dir = tmp_path / "media"
    cfg.web_research = cfg.web_research.model_copy(update=web)
    return cfg


async def make_agent(cfg, tmp_path):
    store = ArtifactStore(tmp_path, "local-artifact-session")
    with patch.object(agent_module, "validate_api_key", AsyncMock()), \
         patch.object(agent_module, "ChatOpenAI", return_value=ResearchModel()), \
         patch.object(agent_module, "load_skills", AsyncMock(return_value=[])):
        agent, manager = await build_agent(cfg, "private-storyline-session", store,
                                          tool_interceptors=[ToolInterceptor.inject_media_content_before,
                                                             ToolInterceptor.save_media_content_after])
    context = ClientContext(cfg=cfg, session_id="private-storyline-session", media_dir=str(tmp_path),
                            bgm_dir=str(tmp_path), outputs_dir=str(tmp_path), node_manager=manager,
                            chat_model_key="scripted-test", pexels_api_key="private-pexels-key")
    return agent, context


async def invoke(agent, context, actions, messages=None):
    return await agent.ainvoke({"messages": [*(messages or []), HumanMessage(content=actions)]}, context=context)


@pytest.mark.asyncio
async def test_actual_agent_default_search_fetch_followup_and_isolation(tmp_path, monkeypatch):
    monkeypatch.setenv("PARALLEL_API_KEY", "must-not-be-used")
    monkeypatch.setenv("PEXELS_API_KEY", "must-stay-local")
    cfg = configuration(tmp_path)
    # Older configs without the new section receive the usable no-key default.
    data = cfg.model_dump(exclude={"web_research": True, "project": {"blobs_dir"}})
    assert Settings.model_validate(data).web_research.enabled
    fixture = MCPFixture()
    async with fixture.installed():
        agent, context = await make_agent(cfg, tmp_path)
        first = await invoke(agent, context, "search,fetch")
        followup = await invoke(agent, context, "search", first["messages"])
        assert "Verified research excerpt" in followup["messages"][-1].content
        assert "https://example.org/source" in first["messages"][-1].content
        first_id = context.web_research_session_id
        assert str(uuid.UUID(first_id)) == first_id
        assert {c["arguments"]["session_id"] for c in fixture.calls} == {first_id}
        assert len(first["messages"][2].content) == 2
        assert first["messages"][2].artifact["structured_content"]["url"] == "https://example.org/source"
        # Same cached tools, two independent conversations, interleaved execution.
        other = ClientContext(**{k: v for k, v in context.__dict__.items() if k != "web_research_session_id"})
        await asyncio.gather(invoke(agent, context, "search,fetch"), invoke(agent, other, "search,fetch"))
        ids = [c["arguments"]["session_id"] for c in fixture.calls]
        assert ids.count(first_id) == 5
        assert ids.count(other.web_research_session_id) == 2
        assert first_id != other.web_research_session_id
    for request, body in fixture.requests:
        if request.url.host == "127.0.0.1":
            continue
        assert str(request.url) == "https://search.parallel.ai/mcp"
        assert request.headers["user-agent"] == USER_AGENT
        assert "authorization" not in request.headers
        assert "x-storyline-session-id" not in request.headers
        assert "private-storyline-session" not in request.content.decode()
        assert "private-pexels-key" not in request.content.decode()
        assert request.extensions["timeout"]["read"] == 30.0
        if body.get("method") == "tools/call":
            assert not {"artifact_id", "lang", "artifacts_dir", "inputs"} & body["params"]["arguments"].keys()
    assert context.pexels_api_key == "private-pexels-key"


@pytest.mark.asyncio
async def test_disable_and_explicit_connection_choices(tmp_path):
    fixture = MCPFixture()
    async with fixture.installed():
        cfg = configuration(tmp_path, enabled=False)
        agent, ctx = await make_agent(cfg, tmp_path)
        result = await invoke(agent, ctx, "local")
        assert "local media result" in result["messages"][-1].content
        assert all(r.url.host == "127.0.0.1" for r, _ in fixture.requests)
        fixture.requests.clear()
        cfg = configuration(tmp_path, url="https://custom.example/mcp", timeout=7.0,
                            headers={"Authorization": "Bearer explicit-key", "X-Custom": "chosen", "user-agent": "replace-me"})
        agent, ctx = await make_agent(cfg, tmp_path)
        await invoke(agent, ctx, "search,fetch")
    remote = [r for r, _ in fixture.requests if r.url.host != "127.0.0.1"]
    assert remote
    for request in remote:
        assert str(request.url) == "https://custom.example/mcp"
        assert request.headers["authorization"] == "Bearer explicit-key"
        assert request.headers["x-custom"] == "chosen"
        assert request.headers["user-agent"] == USER_AGENT
        assert request.extensions["timeout"]["read"] == 7.0


@pytest.mark.asyncio
async def test_errors_timeout_quota_retry_and_cancellation(tmp_path):
    fixture = MCPFixture()
    async with fixture.installed():
        agent, ctx = await make_agent(configuration(tmp_path), tmp_path)
        for action in ["error", "timeout", "quota", "search"]:
            result = await invoke(agent, ctx, action)
            if action != "search":
                assert result["messages"][2].additional_kwargs["isError"] is True
                assert "Tool call failed" in result["messages"][-1].content
            else:
                assert "Verified research excerpt" in result["messages"][-1].content
        task = asyncio.create_task(invoke(agent, ctx, "cancel"))
        await asyncio.wait_for(fixture.started.wait(), timeout=5)
        task.cancel()
        with pytest.raises(asyncio.CancelledError):
            await task
        assert {c["arguments"]["session_id"] for c in fixture.calls} == {ctx.web_research_session_id}
        await invoke(agent, ctx, "search")
        assert fixture.calls[-1]["arguments"]["session_id"] == ctx.web_research_session_id
        fixture.discovery_error = True
        # Remote discovery failure leaves a usable local agent.
        local_agent, local_ctx = await make_agent(configuration(tmp_path), tmp_path)
        local_result = await invoke(local_agent, local_ctx, "local")
        assert "local media result" in local_result["messages"][-1].content


@pytest.mark.asyncio
async def test_web_chat_persist_clear_and_legacy_session(tmp_path):
    import agent_fastapi as web
    cfg = configuration(tmp_path)
    session = web.ChatSession("chat-one", cfg)
    # Exercise real ensure_agent context creation (model setup and discovery only mocked).
    with patch.object(web, "build_agent", AsyncMock(return_value=(object(), object()))):
        await session.ensure_agent()
    before = session.client_context.web_research_session_id
    assert before == session.web_research_session_id
    session.save_state_atomic()
    restored = web.ChatSession.load_from_state("chat-one", cfg)
    assert restored.web_research_session_id == before
    store = SimpleNamespace(get_or_404=AsyncMock(return_value=session), save_session_state=AsyncMock())
    with patch.object(web.app.state, "sessions", store, create=True), patch.object(web.app.state, "cfg", cfg, create=True):
        await web.clear_session_chat("chat-one")
    assert session.web_research_session_id != before
    assert session.client_context.web_research_session_id == session.web_research_session_id
    # Same cached agent/tools receive the new context identity after reset.
    fixture = MCPFixture()
    async with fixture.installed():
        agent, _ = await make_agent(cfg, tmp_path)
        session.client_context.node_manager = SimpleNamespace(kind_to_node_ids={})
        await invoke(agent, session.client_context, "search")
    assert fixture.calls[0]["arguments"]["session_id"] == session.web_research_session_id
    state = session.dump_state()
    state.pop("web_research_session_id")
    from pathlib import Path
    Path(session.state_file_path()).write_text(json.dumps(state))
    legacy = web.ChatSession.load_from_state("chat-one", cfg)
    assert str(uuid.UUID(legacy.web_research_session_id)) == legacy.web_research_session_id
    assert legacy.web_research_session_id != session.web_research_session_id
