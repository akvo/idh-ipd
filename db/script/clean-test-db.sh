#!/usr/bin/env bash
#shellcheck disable=SC2039

set -euo pipefail

psql --user ipd --no-align --list | \
    awk -F'|' '/^test/ {print $1}' | \
    while read -r dbname
    do
	psql --user ipd --dbname idh_ipd -c "DROP DATABASE ${dbname}"
    done

echo "Done"
