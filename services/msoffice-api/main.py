"""msoffice-crypt.exe FastAPI wrapper — optional native MS-OFFCRYPTO."""
from __future__ import annotations

import os
import subprocess
import tempfile
from pathlib import Path

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response

app = FastAPI(title="lofice msoffice API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

CRYPT_BIN = os.environ.get("MSOFFICE_CRYPT_BIN", "msoffice-crypt.exe")


def _run_crypt(mode: str, password: str, src: Path, dst: Path, enc_mode: str | None) -> None:
    args = [CRYPT_BIN]
    if mode == "encrypt":
        args.extend(["-e", "-p", password])
        if enc_mode == "0":
            args.extend(["-encMode", "0"])
        elif enc_mode == "1":
            args.extend(["-encMode", "1"])
    else:
        args.extend(["-d", "-p", password])
    args.extend([str(src), str(dst)])
    proc = subprocess.run(args, capture_output=True, text=True)
    if proc.returncode == 3:
        raise HTTPException(status_code=400, detail="비밀번호가 올바르지 않습니다.")
    if proc.returncode == 1:
        raise HTTPException(status_code=400, detail="지원하지 않는 형식입니다.")
    if proc.returncode == 2:
        raise HTTPException(status_code=400, detail="이미 암호화/복호화된 상태입니다.")
    if proc.returncode != 0:
        raise HTTPException(status_code=500, detail=proc.stderr or proc.stdout or "msoffice-crypt 실패")


@app.get("/health")
def health():
    return {"ok": True, "bin": CRYPT_BIN}


@app.post("/decrypt")
async def decrypt(file: UploadFile = File(...), password: str = Form(...)):
    with tempfile.TemporaryDirectory() as tmp:
        src = Path(tmp) / (file.filename or "input.office")
        dst = Path(tmp) / "out.office"
        src.write_bytes(await file.read())
        _run_crypt("decrypt", password, src, dst, None)
        return Response(content=dst.read_bytes(), media_type="application/octet-stream")


@app.post("/encrypt")
async def encrypt(
    file: UploadFile = File(...),
    password: str = Form(...),
    enc_mode: str = Form("1"),
):
    with tempfile.TemporaryDirectory() as tmp:
        src = Path(tmp) / (file.filename or "input.office")
        dst = Path(tmp) / "out.office"
        src.write_bytes(await file.read())
        _run_crypt("encrypt", password, src, dst, enc_mode)
        return Response(content=dst.read_bytes(), media_type="application/octet-stream")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", "8200")))
