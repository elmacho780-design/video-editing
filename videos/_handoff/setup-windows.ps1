# HML video studio: set up a Windows 11 PC for Claude Code video work.
# Safe to re-run: every step checks first. Run in PowerShell from the repo folder:
#   powershell -ExecutionPolicy Bypass -File videos\_handoff\setup-windows.ps1
$ErrorActionPreference = 'Continue'
function Step($m) { Write-Host "`n== $m" -ForegroundColor Cyan }
function Have($c) { [bool](Get-Command $c -ErrorAction SilentlyContinue) }

Step '1/5 System tools (Git, Node.js LTS, Python 3.12, ffmpeg)'
$tools = @(@{c='git'; id='Git.Git'}, @{c='node'; id='OpenJS.NodeJS.LTS'}, @{c='python'; id='Python.Python.3.12'}, @{c='ffmpeg'; id='Gyan.FFmpeg'})
foreach ($t in $tools) {
  if (Have $t.c) { Write-Host "  ok   $($t.c)" }
  elseif (Have 'winget') { Write-Host "  install $($t.id)"; winget install -e --id $t.id --accept-source-agreements --accept-package-agreements --scope user }
  else { Write-Host "  MISSING $($t.c): winget is not available on this PC; install it by hand" -ForegroundColor Yellow }
}
Write-Host '  If anything was just installed, close and reopen PowerShell, then run this script again.'

Step '2/5 Claude Code plugins'
if (Have 'claude') {
  claude plugin marketplace add lemomo-ai/lemo-opuscar
  claude plugin install lemo-opuscar@lemolab
  claude plugin marketplace add heygen-com/hyperframes
  claude plugin install hyperframes@hyperframes
} else { Write-Host '  The claude CLI is not on PATH: install the plugins from inside Claude Code with the same commands.' -ForegroundColor Yellow }

Step '3/5 Skills (motion design, three.js)'
if (Have 'npx') { npx -y skills add LottieFiles/motion-design-skill; npx -y skills add cloudai-x/threejs-skills }

Step '4/5 Lemo-Opuscar film library in ~/lemo-opuscar'
$lib = Join-Path $HOME 'lemo-opuscar'
if (-not (Test-Path $lib)) { git clone --depth 1 https://github.com/lemomo-ai/lemo-opuscar.git $lib } else { git -C $lib pull --ff-only }
$bash = (Get-Command bash -ErrorAction SilentlyContinue).Source
if (-not $bash) { $bash = 'C:\Program Files\Git\bin\bash.exe' }
if (Test-Path $bash) {
  Push-Location $lib
  & $bash -lc 'sh plugin/skills/lemo-opuscar/scripts/setup.sh deps && sh plugin/skills/lemo-opuscar/scripts/setup.sh deps music && sh plugin/skills/lemo-opuscar/scripts/setup.sh deps voice'
  & $bash -lc 'sh tools/fetch.sh instruments vsco2ce && sh tools/fetch.sh instruments vcsl'
  Pop-Location
} else { Write-Host '  Git Bash not found: run the library setup from WSL instead (see CLAUDE.md section 4).' -ForegroundColor Yellow }

Step '5/5 GPU check'
Write-Host '  Ask Claude: "render one still from any Lemo-Opuscar style demo and confirm WebGL is on the GPU, not software rendering".'
Write-Host '  If it reports software rendering, set LEMO_ANGLE=d3d11 and retry.'
Write-Host "`nDone. Library: $lib" -ForegroundColor Green
