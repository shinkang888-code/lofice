"""Vercel serverless entry — re-exports FastAPI app from main.py."""
import sys
from pathlib import Path

_ROOT = Path(__file__).resolve().parent.parent
if str(_ROOT) not in sys.path:
    sys.path.insert(0, str(_ROOT))

from main import app  # noqa: F401
