# msoffice-crypt API (선택)

[herumi/msoffice](https://github.com/shinkang888-code/msoffice) `msoffice-crypt.exe`를 FastAPI로 래핑합니다.
Electron/Windows에서 네이티브 MS-OFFCRYPTO와 동일한 결과가 필요할 때 사용합니다.

lofice 기본은 **브라우저 `officecrypto-tool`** (클라이언트)입니다.

## 빌드 (Windows)

```bat
git clone https://github.com/herumi/cybozulib
git clone https://github.com/herumi/msoffice
cd msoffice
mk.bat
```

`bin/msoffice-crypt.exe` 경로를 환경 변수로 지정:

```bash
set MSOFFICE_CRYPT_BIN=C:\work\msoffice\bin\msoffice-crypt.exe
pip install -r requirements.txt
python main.py
```

```bash
NEXT_PUBLIC_MSOFFICE_CRYPTO_URL=http://localhost:8200
```

## 엔드포인트

- `POST /decrypt` — file, password
- `POST /encrypt` — file, password, enc_mode (0=AES128, 1=AES256)
