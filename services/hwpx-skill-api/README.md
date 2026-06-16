# hwpx-skill API

[jkf87/hwpx-skill](https://github.com/jkf87/hwpx-skill) Python 스크립트를 FastAPI로 감싼 lofice용 백엔드.

## 설치

```bash
git clone https://github.com/jkf87/hwpx-skill.git
cd hancom/services/hwpx-skill-api
pip install -r requirements.txt

# HWP→HWPX 변환용 (선택)
pip install pyhwp5 olefile --break-system-packages

export HWPX_SKILL_DIR=/path/to/hwpx-skill
export OPENAI_API_KEY=sk-...   # AI 채팅용 (선택)
python main.py
```

## Docker

```bash
export HWPX_SKILL_REPO=/path/to/hwpx-skill
docker compose up -d
```

기본 포트: **8100**

## 엔드포인트

| Method | Path | 설명 |
|--------|------|------|
| GET | `/health` | 상태·AI 사용 가능 여부 |
| POST | `/extract` | HWP/HWPX 텍스트 추출 |
| POST | `/convert` | HWP → HWPX |
| POST | `/create/markdown` | 마크다운 → HWPX |
| POST | `/clone-form` | 양식 복제·치환 |
| POST | `/analyze` | 양식 구조 분석 |
| POST | `/ai/chat` | AI 워크플로우 오케스트레이션 |

lofice `.env.local`:

```
NEXT_PUBLIC_HWPX_SKILL_URL=http://localhost:8100
```
