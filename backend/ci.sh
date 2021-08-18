#!/usr/bin/env bash
pytest

if [[ -z "${SKIP_MIGRATION}" ]]; then
    alembic upgrade head
fi

python main.py
