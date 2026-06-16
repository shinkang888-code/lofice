# Android 앱 설정 가이드
# `npx cap add android` 실행 후 아래 설정을 적용하세요.

## 1. 파일 열기 Intent (AndroidManifest.xml)

`android/app/src/main/AndroidManifest.xml`의 `<activity>` 태그 안에 추가:

```xml
<intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:mimeType="application/hwp" />
    <data android:mimeType="application/x-hwp" />
    <data android:mimeType="application/vnd.openxmlformats-officedocument.wordprocessingml.document" />
    <data android:mimeType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" />
    <data android:mimeType="application/pdf" />
    <data android:mimeType="text/plain" />
    <data android:scheme="content" />
    <data android:scheme="file" />
</intent-filter>
<intent-filter>
    <action android:name="android.intent.action.SEND" />
    <category android:name="android.intent.category.DEFAULT" />
    <data android:mimeType="*/*" />
</intent-filter>
```

## 2. 권한 (AndroidManifest.xml)

```xml
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.INTERNET" />
```

## 3. 앱 아이콘

`public/logo.svg`를 Android Studio Image Asset Studio로 PNG 변환 후 적용

## 4. 빌드 명령

```bash
npm run build
npx cap sync android
npx cap open android
```

Android Studio: Build > Build Bundle(s) / APK(s) > Build APK(s)

## 5. APK 설치

생성된 APK: `android/app/build/outputs/apk/debug/app-debug.apk`
