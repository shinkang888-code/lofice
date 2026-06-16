#!/usr/bin/env python3
"""hwpx-skill FastAPI — HWP/HWPX 생성·변환·읽기·편집 + AI 오케스트레이션."""

from __future__ import annotations

import base64
import json
import os
import subprocess
import sys
import tempfile
from pathlib import Path
from typing import Any, Optional

import httpx
import uvicorn
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

SKILL_DIR = Path(os.environ.get("HWPX_SKILL_DIR", Path(__file__).resolve().parent / "hwpx-skill"))
SCRIPTS = SKILL_DIR / "scripts"
TEMPLATES = SKILL_DIR / "templates"

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "").strip()
OPENAI_BASE_URL = os.environ.get("OPENAI_BASE_URL", "https://api.openai.com/v1").rstrip("/")
OPENAI_MODEL = os.environ.get("OPENAI_MODEL", "gpt-4o-mini")

app = FastAPI(title="hwpx-skill API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def skill_ready() -> bool:
    return SCRIPTS.is_dir() and (SCRIPTS / "md2hwpx.py").is_file()


def require_skill() -> None:
    if not skill_ready():
        raise HTTPException(
            status_code=503,
            detail=f"hwpx-skill scripts not found at {SKILL_DIR}. Set HWPX_SKILL_DIR.",
        )


def run_cmd(args: list[str], *, cwd: Optional[Path] = None) -> subprocess.CompletedProcess[str]:
    proc = subprocess.run(
        [sys.executable, *args],
        cwd=str(cwd or SKILL_DIR),
        capture_output=True,
        text=True,
        check=False,
    )
    if proc.returncode != 0:
        err = (proc.stderr or proc.stdout or "script failed").strip()
        raise HTTPException(status_code=500, detail=err[:2000])
    return proc


def finalize_hwpx(path: Path) -> None:
    run_cmd([str(SCRIPTS / "fix_namespaces.py"), str(path)])
    finalize = SCRIPTS / "finalize_hwpx.py"
    if finalize.is_file():
        run_cmd([str(finalize), str(path), "--strip-linesegarray", "--layout"])


def read_bytes(path: Path) -> bytes:
    return path.read_bytes()


async def save_upload(upload: UploadFile, dest: Path) -> None:
    data = await upload.read()
    if not data:
        raise HTTPException(status_code=400, detail="empty file")
    dest.write_bytes(data)


class AiChatRequest(BaseModel):
    message: str = Field(..., min_length=1)
    template: str = Field("report", description="report|gonmun|minutes|proposal|government|base")
    document_text: Optional[str] = None
    file_base64: Optional[str] = None
    file_name: Optional[str] = None


class MarkdownCreateRequest(BaseModel):
    markdown: str
    template: str = "report"
    title: str = "문서"
    creator: str = "lofice"


class CloneFormRequest(BaseModel):
    replacements: dict[str, str] = Field(default_factory=dict)
    file_base64: str
    file_name: str = "template.hwpx"


@app.get("/health")
def health() -> dict[str, Any]:
    return {
        "status": "ok" if skill_ready() else "degraded",
        "skill_dir": str(SKILL_DIR),
        "skill_ready": skill_ready(),
        "ai_enabled": bool(OPENAI_API_KEY),
        "workflows": ["A", "B", "C", "E", "F", "G", "H", "I", "J"],
    }


@app.post("/extract")
async def extract_text(
    file: UploadFile = File(...),
    format: str = Form("plain"),
) -> dict[str, Any]:
    require_skill()
    suffix = Path(file.filename or "doc.hwpx").suffix.lower()
    if suffix not in {".hwpx", ".hwp"}:
        raise HTTPException(status_code=400, detail="only .hwpx or .hwp supported")

    with tempfile.TemporaryDirectory() as tmp:
        tmp_path = Path(tmp)
        src = tmp_path / f"input{suffix}"
        await save_upload(file, src)

        hwpx_path = src
        if suffix == ".hwp":
            hwpx_path = tmp_path / "converted.hwpx"
            run_cmd([str(SCRIPTS / "convert_hwp.py"), str(src), "-o", str(hwpx_path)])

        args = [str(SCRIPTS / "text_extract.py"), str(hwpx_path)]
        if format == "markdown":
            args += ["--format", "markdown"]
        proc = run_cmd(args)
        return {"text": proc.stdout, "format": format}


@app.post("/convert")
async def convert_hwp(file: UploadFile = File(...)) -> dict[str, str]:
    require_skill()
    with tempfile.TemporaryDirectory() as tmp:
        tmp_path = Path(tmp)
        src = tmp_path / "input.hwp"
        out = tmp_path / "output.hwpx"
        await save_upload(file, src)
        run_cmd([str(SCRIPTS / "convert_hwp.py"), str(src), "-o", str(out)])
        finalize_hwpx(out)
        return {
            "file_name": (file.filename or "document.hwp").rsplit(".", 1)[0] + ".hwpx",
            "data_base64": base64.b64encode(read_bytes(out)).decode(),
        }


@app.post("/create/markdown")
async def create_from_markdown(body: MarkdownCreateRequest) -> dict[str, str]:
    require_skill()
    with tempfile.TemporaryDirectory() as tmp:
        tmp_path = Path(tmp)
        md_path = tmp_path / "input.md"
        out = tmp_path / "output.hwpx"
        md_path.write_text(body.markdown, encoding="utf-8")

        args = [
            str(SCRIPTS / "md2hwpx.py"),
            str(md_path),
            "-o",
            str(out),
            "--template",
            body.template,
            "--title",
            body.title,
            "--creator",
            body.creator,
        ]
        run_cmd(args)
        finalize_hwpx(out)
        return {
            "file_name": f"{body.title}.hwpx",
            "data_base64": base64.b64encode(read_bytes(out)).decode(),
        }


@app.post("/clone-form")
async def clone_form(body: CloneFormRequest) -> dict[str, str]:
    require_skill()
    with tempfile.TemporaryDirectory() as tmp:
        tmp_path = Path(tmp)
        src = tmp_path / body.file_name
        out = tmp_path / "cloned.hwpx"
        map_path = tmp_path / "map.json"
        src.write_bytes(base64.b64decode(body.file_base64))
        map_path.write_text(json.dumps(body.replacements, ensure_ascii=False), encoding="utf-8")

        run_cmd([str(SCRIPTS / "clone_form.py"), str(src), str(out), "--map", str(map_path)])
        finalize_hwpx(out)
        base = Path(body.file_name).stem
        return {
            "file_name": f"{base}_edited.hwpx",
            "data_base64": base64.b64encode(read_bytes(out)).decode(),
        }


@app.post("/analyze")
async def analyze_form(file: UploadFile = File(...)) -> dict[str, Any]:
    require_skill()
    with tempfile.TemporaryDirectory() as tmp:
        tmp_path = Path(tmp)
        src = tmp_path / (file.filename or "template.hwpx")
        await save_upload(file, src)
        proc = run_cmd([str(SCRIPTS / "clone_form.py"), "--analyze", str(src)])
        texts: list[str] = []
        for line in proc.stdout.splitlines():
            if line.strip().startswith("[") and "]" in line:
                part = line.split("]", 1)[-1].strip()
                if part:
                    texts.append(part)
        return {"analysis": proc.stdout, "texts": texts}


async def call_llm(system: str, user: str) -> dict[str, Any]:
    if not OPENAI_API_KEY:
        raise HTTPException(status_code=503, detail="OPENAI_API_KEY not configured on server")

    payload = {
        "model": OPENAI_MODEL,
        "messages": [
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
        "response_format": {"type": "json_object"},
        "temperature": 0.3,
    }
    async with httpx.AsyncClient(timeout=120.0) as client:
        res = await client.post(
            f"{OPENAI_BASE_URL}/chat/completions",
            headers={"Authorization": f"Bearer {OPENAI_API_KEY}"},
            json=payload,
        )
    if res.status_code >= 400:
        raise HTTPException(status_code=502, detail=f"LLM error: {res.text[:500]}")
    content = res.json()["choices"][0]["message"]["content"]
    return json.loads(content)


AI_SYSTEM = """You are hwpx-skill orchestrator for Korean HWPX documents.
Return JSON only with keys:
- workflow: one of A,B,C,E,F,G,H (A=markdown to hwpx, B=template placeholder replace, C=edit existing, E=read only, F=clone form, G=official document, H=hwp convert)
- template: report|gonmun|minutes|proposal|government|base
- title: document title
- markdown: full markdown body when workflow is A or G
- replacements: object old->new strings when workflow is B or F
- reply: short Korean explanation for the user

Follow hwpx-skill rules: prefer clone_form for forms with tables/images; use markdown generation for new reports."""


@app.post("/ai/chat")
async def ai_chat(body: AiChatRequest) -> dict[str, Any]:
    require_skill()

    context_parts = [f"User request: {body.message}", f"Preferred template: {body.template}"]
    if body.document_text:
        context_parts.append(f"Current document text:\n{body.document_text[:12000]}")

    plan = await call_llm(AI_SYSTEM, "\n\n".join(context_parts))
    workflow = str(plan.get("workflow", "A")).upper()
    reply = str(plan.get("reply", "문서를 생성했습니다."))
    template = str(plan.get("template", body.template))
    title = str(plan.get("title", "AI 문서"))

    result: dict[str, Any] = {"reply": reply, "workflow": workflow, "plan": plan}

    if workflow == "E":
        return result

    if workflow == "H" and body.file_base64:
        with tempfile.TemporaryDirectory() as tmp:
            tmp_path = Path(tmp)
            src = tmp_path / (body.file_name or "input.hwp")
            out = tmp_path / "output.hwpx"
            src.write_bytes(base64.b64decode(body.file_base64))
            run_cmd([str(SCRIPTS / "convert_hwp.py"), str(src), "-o", str(out)])
            finalize_hwpx(out)
            result["file_name"] = Path(body.file_name or "document.hwp").stem + ".hwpx"
            result["data_base64"] = base64.b64encode(read_bytes(out)).decode()
        return result

    if workflow in {"B", "F"} and body.file_base64:
        replacements = plan.get("replacements") or {}
        if not isinstance(replacements, dict):
            replacements = {}
        cloned = await clone_form(
            CloneFormRequest(
                file_base64=body.file_base64,
                file_name=body.file_name or "template.hwpx",
                replacements={str(k): str(v) for k, v in replacements.items()},
            )
        )
        result.update(cloned)
        return result

    markdown = plan.get("markdown")
    if not isinstance(markdown, str) or not markdown.strip():
        markdown = f"# {title}\n\n{body.message}"

    created = await create_from_markdown(
        MarkdownCreateRequest(markdown=markdown, template=template, title=title, creator="lofice AI")
    )
    result.update(created)
    return result


def main() -> None:
    host = os.environ.get("HWPX_SKILL_HOST", "0.0.0.0")
    port = int(os.environ.get("HWPX_SKILL_PORT", "8100"))
    print(f"hwpx-skill API on http://{host}:{port} (skill_dir={SKILL_DIR}, ai={bool(OPENAI_API_KEY)})")
    uvicorn.run(app, host=host, port=port)


if __name__ == "__main__":
    main()
