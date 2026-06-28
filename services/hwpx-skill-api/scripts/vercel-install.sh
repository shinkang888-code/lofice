#!/usr/bin/env bash
set -euo pipefail
if [ ! -f hwpx-skill/scripts/md2hwpx.py ]; then
  git clone --depth 1 https://github.com/shinkang888-code/hwpx-skill.git hwpx-skill || {
    echo "WARN: hwpx-skill clone failed — API runs degraded until skill scripts are present" >&2
    exit 0
  }
fi
