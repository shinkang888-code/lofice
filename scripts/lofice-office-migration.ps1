#requires -version 5.1
<#
.SYNOPSIS
  Office → lofice 마이그레이션 헬퍼 (msoffice-removal-tool 패턴)
.PARAMETER InstallLofice
  Office365 대신 lofice 설치 URL을 엽니다
.PARAMETER UseSetupRemoval
  SaRA 대신 Office Setup 제거 방식
.PARAMETER Force
  확인 없이 진행
.PARAMETER RunAgain
  Stage 무시하고 처음부터
.PARAMETER LoficeOnly
  Office 제거 없이 lofice 안내만
#>
Param(
  [switch]$InstallLofice = $True,
  [switch]$UseSetupRemoval = $False,
  [switch]$Force = $False,
  [switch]$RunAgain = $False,
  [switch]$LoficeOnly = $False,
  [switch]$SuppressReboot = $True
)

$StageReg = "HKCU:\Software\lofice\Migration"
$LoficeUrl = "https://lofice-one.vercel.app/migrate/"

function Set-LoficeStage([int]$Value) {
  if (-not (Test-Path $StageReg)) { New-Item -Path $StageReg -Force | Out-Null }
  Set-ItemProperty -Path $StageReg -Name "CurrentStage" -Value $Value -Force
}

function Get-LoficeStage {
  if (Test-Path $StageReg) { return [int](Get-ItemProperty $StageReg).CurrentStage }
  return 0
}

function Stop-OfficeProcess {
  foreach ($n in @("winword","excel","powerpnt","outlook","onenote","msaccess","mspub","visio","teams")) {
    Get-Process -Name $n -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
  }
}

function Invoke-OfficeRemoval {
  $repo = "https://raw.githubusercontent.com/shinkang888-code/msoffice-removal-tool/main/msoffice-removal-tool.ps1"
  $script = Join-Path $env:TEMP "msoffice-removal-tool.ps1"
  Write-Host "Downloading msoffice-removal-tool ..."
  Invoke-WebRequest -Uri $repo -OutFile $script -UseBasicParsing
  $args = @("-ExecutionPolicy", "Bypass", "-File", $script)
  if ($UseSetupRemoval) { $args += "-UseSetupRemoval" }
  if ($Force) { $args += "-Force" }
  if ($SuppressReboot) { $args += "-SuppressReboot" }
  & powershell @args
  Set-LoficeStage 2
}

function Open-LoficeInstall {
  Start-Process $LoficeUrl
  if ($InstallLofice) { Start-Process "https://lofice-one.vercel.app/" }
  Set-LoficeStage 4
}

Write-Host "lofice Office Migration Helper"

if (-not $Force -and -not $LoficeOnly) {
  if ((Read-Host "Remove Microsoft Office? (y/n)") -ne "y") { exit 1 }
}

$stage = if ($RunAgain) { 0 } else { Get-LoficeStage }

if ($LoficeOnly) { Open-LoficeInstall; exit 0 }

switch ($stage) {
  0 { Stop-OfficeProcess; Invoke-OfficeRemoval; Open-LoficeInstall }
  { $_ -lt 4 } { if ($stage -lt 2) { Invoke-OfficeRemoval }; Open-LoficeInstall }
  default { Write-Host "Complete. Use -RunAgain to restart."; Open-LoficeInstall }
}
