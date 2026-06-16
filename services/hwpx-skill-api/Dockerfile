FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends curl git && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY main.py .

ENV HWPX_SKILL_DIR=/app/hwpx-skill
ENV HWPX_SKILL_HOST=0.0.0.0
ENV HWPX_SKILL_PORT=8100

EXPOSE 8100

CMD ["python", "main.py"]
