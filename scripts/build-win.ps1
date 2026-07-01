# Windows NSIS installer (sets TEMP for makensis)
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$tmp = Join-Path $root ".tmp"
$cache = Join-Path $root ".electron-cache"
New-Item -ItemType Directory -Force -Path $tmp, $cache | Out-Null
$env:TEMP = $tmp
$env:TMP = $tmp
$env:ELECTRON_CACHE = $cache
Set-Location $root
npm run build:electron
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
npx electron-builder --win
exit $LASTEXITCODE
