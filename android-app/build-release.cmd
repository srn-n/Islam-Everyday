@echo off
rem Builds the signed Play Store bundle: IslamEveryday-<version>.aab in this folder.
rem Needs: Node.js, Android Studio (its JDK and Android SDK), the website in ..\IslamEverydayWeb, and keys\ (see README).
setlocal
cd /d "%~dp0"
if not exist keys\keystore.properties ( echo keys\keystore.properties is missing. Copy your keys folder back first. & exit /b 1 )
if not defined JAVA_HOME if exist "C:\Program Files\Android\Android Studio\jbr\bin\java.exe" set "JAVA_HOME=C:\Program Files\Android\Android Studio\jbr"
if not defined ANDROID_HOME if exist "%LOCALAPPDATA%\Android\Sdk" set "ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk"
if not defined JAVA_HOME ( echo Install Android Studio, or set JAVA_HOME to a JDK 21. & exit /b 1 )
if not defined ANDROID_HOME ( echo Open Android Studio once so it installs the Android SDK, or set ANDROID_HOME. & exit /b 1 )
call npm install --no-audit --no-fund || exit /b 1
call npm run sync || exit /b 1
pushd android
call gradlew.bat --no-daemon clean bundleRelease || ( popd & exit /b 1 )
popd
for /f "tokens=2 delims== " %%v in ('findstr /r /c:"^ *versionName " android\app\build.gradle') do set "VN=%%~v"
copy /y android\app\build\outputs\bundle\release\app-release.aab "IslamEveryday-%VN%.aab" >nul || exit /b 1
echo.
echo Done: IslamEveryday-%VN%.aab  (signed with your upload key; upload it in Play Console)
