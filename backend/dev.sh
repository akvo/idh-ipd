#!/usr/bin/env bash
set -eu
pip install --upgrade pip
pip install --cache-dir=.pip -r requirements.txt
pip check

alembic upgrade head

uvicorn main:app --reload --port 5000
