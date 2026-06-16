$root = Split-Path $PSScriptRoot -Parent
$releases = Join-Path $root "releases"
$version = "1.2.0"
$apkSrc = Join-Path $root "android\app\build\outputs\apk\debug\app-debug.apk"

if (-not (Test-Path $apkSrc)) {
  Write-Error "APK not found. Run build first: scripts\build-android.bat"
  exit 1
}

# Android APK copy
$apkDest = Join-Path $releases "lofice-Android-$version.apk"
Copy-Item $apkSrc $apkDest -Force
Write-Host "Created: $apkDest"

# Android ZIP
$androidDir = Join-Path $releases "android-package"
New-Item -ItemType Directory -Path $androidDir -Force | Out-Null
Copy-Item $apkSrc (Join-Path $androidDir "lofice.apk") -Force
Copy-Item (Join-Path $releases "android\INSTALL.txt") (Join-Path $androidDir "INSTALL.txt") -Force
$androidZip = Join-Path $releases "lofice-Android-$version.zip"
if (Test-Path $androidZip) { Remove-Item $androidZip -Force }
Compress-Archive -Path "$androidDir\*" -DestinationPath $androidZip -CompressionLevel Optimal
Write-Host "Created: $androidZip"

# Windows ZIP
$exeSrc = Join-Path $root "dist\lofice-Setup-$version.exe"
if (Test-Path $exeSrc) {
  $windowsDir = Join-Path $releases "windows-package"
  New-Item -ItemType Directory -Path $windowsDir -Force | Out-Null
  Copy-Item $exeSrc (Join-Path $windowsDir "lofice-Setup-$version.exe") -Force
  Copy-Item (Join-Path $releases "windows\INSTALL.txt") (Join-Path $windowsDir "INSTALL.txt") -Force
  $windowsZip = Join-Path $releases "lofice-Windows-$version.zip"
  if (Test-Path $windowsZip) { Remove-Item $windowsZip -Force }
  Compress-Archive -Path "$windowsDir\*" -DestinationPath $windowsZip -CompressionLevel Optimal
  Write-Host "Created: $windowsZip"
}

Get-ChildItem $releases -Filter "lofice-*" | ForEach-Object {
  Write-Host ("  {0} ({1:N1} MB)" -f $_.Name, ($_.Length / 1MB))
}
