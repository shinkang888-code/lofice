# Office-PowerPoint-MCP-Server API (lofice)

[Office-PowerPoint-MCP-Server](https://github.com/shinkang888-code/Office-PowerPoint-MCP-Server) python-pptx 기능을 FastAPI로 래핑합니다.

## 설치

```bash
cd services/ppt-mcp-api
pip install -r requirements.txt

# 선택: 원본 템플릿 JSON
curl -L -o slide_layout_templates.json \
  https://raw.githubusercontent.com/shinkang888-code/Office-PowerPoint-MCP-Server/main/slide_layout_templates.json
export PPT_MCP_DIR=.

python main.py
```

```bash
NEXT_PUBLIC_PPT_MCP_URL=http://localhost:8300
OPENAI_API_KEY=sk-...   # auto-generate / GPT Generator (선택)
PEXELS_API_KEY=...      # 슬라이드 이미지 (선택)
```

## 엔드포인트

| MCP Tool | REST |
|----------|------|
| extract_presentation_text | POST /extract-text |
| create_presentation_from_templates | POST /create-from-templates |
| list_slide_templates | GET /templates |
| auto_generate_presentation | POST /auto-generate |
| powerpoint gem AI outline | POST /ai-deck |
| GPT Generator (Python Project) | POST /generator/generate |
| GPT outline JSON | POST /generator/outline |

lofice 기본은 **브라우저 클라이언트** (`src/lib/pptMcp/*`) — API 없이도 템플릿 생성·텍스트 추출 가능.
