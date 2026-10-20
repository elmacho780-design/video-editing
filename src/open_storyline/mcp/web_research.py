"""Web research tools, isolated from Storyline's media artifact interceptors."""
import logging
from datetime import timedelta

from langchain_mcp_adapters.client import MultiServerMCPClient

from open_storyline.config import WebResearchConfig

logger = logging.getLogger(__name__)
USER_AGENT = "FireRed-OpenStoryline (https://github.com/FireRedTeam/FireRed-OpenStoryline)"


async def _conversation_context(request, handler):
    # The client/tools can be reused across chats. Identity belongs to the caller's
    # conversation, never to the connection or a model-supplied tool argument.
    context = getattr(request.runtime, "context", None)
    if context is None:
        raise ValueError("Web research tools require a ClientContext")
    args = {**request.args, "session_id": context.web_research_session_id}
    return await handler(request.override(args=args))


async def load_web_research_tools(cfg: WebResearchConfig):
    if not cfg.enabled:
        return []

    # Do not inherit environment credentials or send local media/session headers.
    headers = {k: v for k, v in cfg.headers.items() if k.lower() != "user-agent"}
    headers["User-Agent"] = USER_AGENT
    client = MultiServerMCPClient(
        {"parallel": {
            "transport": "streamable-http",
            "url": cfg.url,
            "headers": headers,
            "timeout": timedelta(seconds=cfg.timeout),
            "sse_read_timeout": timedelta(seconds=cfg.timeout),
        }},
        tool_interceptors=[_conversation_context],
        tool_name_prefix=True,
    )
    try:
        tools = await client.get_tools()
    except Exception:
        # A remote research outage must not prevent local video editing. Calls
        # after discovery still surface errors through the agent's middleware.
        logger.warning("Web research is unavailable; continuing with local tools.")
        return []
    return [tool for tool in tools if tool.name in {"parallel_web_search", "parallel_web_fetch"}]
