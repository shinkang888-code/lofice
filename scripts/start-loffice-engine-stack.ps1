# Loffice Desktop + Engine + Collabora 일괄 기동 (고객 납품용)
$ErrorActionPreference = "Stop"
$lofficeRoot = if ($env:LOFFICE_ENGINE_ROOT) { $env:LOFFICE_ENGINE_ROOT } else { "C:\cursor\Loffice" }

Write-Host "=== Loffice Desktop Stack ===" -ForegroundColor Cyan
Write-Host "Engine root: $lofficeRoot"

if (-not (Test-Path $lofficeRoot)) {
  Write-Error "Loffice engine repo not found: $lofficeRoot"
}

Set-Location $lofficeRoot
Write-Host "[1/2] Docker Collabora..." -ForegroundColor Yellow
docker compose up -d

Write-Host "[2/2] Engine server (9982)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$lofficeRoot'; npm run dev:engine"

Write-Host ""
Write-Host "Done. Desktop app: Settings -> Engine URL http://127.0.0.1:9982" -ForegroundColor Green
Write-Host "Health: http://127.0.0.1:9982/health" -ForegroundColor Green
