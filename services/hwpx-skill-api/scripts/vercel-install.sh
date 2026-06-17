#!/usr/bin/env bash
set -euo pipefail
if [ ! -f hwpx-skill/scripts/md2hwpx.py ]; then
  git clone --depth 1 https://github.com/shinkang888-code/hwpx-skill.git hwpx-skill
fi
