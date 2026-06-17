#!/usr/bin/env python3
"""python-office 배치 API — Phase 2 (poexcel/poword/poppt 래퍼)"""

from __future__ import annotations

import base64
import os
import tempfile
from pathlib import Path
from typing import Any

import uvicorn
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="lofice python-office API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, Any]:
    try:
        import office  # noqa: F401
        office_ok = True
    except ImportError:
        office_ok = False
    return {"status": "ok", "python_office": office_ok, "features": ["ppt-to-pdf", "excel-info"]}


@app.post("/convert/ppt-to-pdf")
async def ppt_to_pdf(file: UploadFile = File(...)) -> dict[str, str]:
    suffix = Path(file.filename or "doc.pptx").suffix.lower()
    if suffix not in {".ppt", ".pptx", ".pptm"}:
        raise HTTPException(status_code=400, detail="only ppt/pptx/pptm")
    data = await file.read()
    if not data:
        raise HTTPException(status_code=400, detail="empty file")

    try:
        from office.api import ppt
    except ImportError:
        raise HTTPException(status_code=503, detail="python-office not installed")

    with tempfile.TemporaryDirectory() as tmp:
        src = Path(tmp) / f"input{suffix}"
        dst = Path(tmp) / "output.pdf"
        src.write_bytes(data)
        try:
            ppt.ppt2pdf(str(src), str(dst))
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e)[:500]) from e
        if not dst.is_file():
            raise HTTPException(status_code=500, detail="conversion failed")
        return {
            "file_name": Path(file.filename or "slides").stem + ".pdf",
            "data_base64": base64.b64encode(dst.read_bytes()).decode(),
            "format": "pdf",
        }


@app.post("/analyze/excel")
async def analyze_excel(file: UploadFile = File(...)) -> dict[str, Any]:
    suffix = Path(file.filename or "book.xlsx").suffix.lower()
    if suffix not in {".xls", ".xlsx", ".xlsm", ".csv"}:
        raise HTTPException(status_code=400, detail="only excel formats")
    data = await file.read()
    if not data:
        raise HTTPException(status_code=400, detail="empty file")

    try:
        import openpyxl
    except ImportError:
        raise HTTPException(status_code=503, detail="openpyxl not installed")

    with tempfile.TemporaryDirectory() as tmp:
        src = Path(tmp) / f"input{suffix}"
        src.write_bytes(data)
        wb = openpyxl.load_workbook(src, read_only=True, data_only=True)
        sheets = []
        for name in wb.sheetnames:
            ws = wb[name]
            sheets.append({"name": name, "max_row": ws.max_row, "max_column": ws.max_column})
        wb.close()
        return {"sheet_count": len(sheets), "sheets": sheets}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", "8300")))
