@echo off
setlocal

set JAVA_HOME=C:\Program Files\Android\Android Studio\jbr
set ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk
set ANDROID_SDK_ROOT=%ANDROID_HOME%

cd /d "%~dp0.."

echo [1/3] Next.js build + Capacitor sync...
call npm run android:build
if errorlevel 1 exit /b 1

echo [2/3] Gradle APK build...
cd android
call gradlew.bat assembleDebug --no-daemon
if errorlevel 1 exit /b 1
cd ..

echo [3/3] Creating ZIP packages...
powershell -ExecutionPolicy Bypass -File "%~dp0package-releases.ps1"

echo Done!
pause
