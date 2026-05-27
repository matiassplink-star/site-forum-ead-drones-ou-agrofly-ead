#!/usr/bin/env bash
# gate-positive.sh — v6.4
#
# Verifica que cada PATTERN aparece em PELO MENOS UM dos FILES.
# Semantica: OR cross-files (nao AND).
#
# Uso:
#   bash .harness/scripts/gate-positive.sh <sprint-file> <feat-id>
#
# Le verification.grepMustMatch + verification.grepFiles do JSON da feature.
# Output: 1 linha "GATE_POSITIVE=OK" ou "GATE_POSITIVE=FAIL\n<misses>".
# Exit 0 = OK, exit 1 = FAIL.

set -euo pipefail

SPRINT_FILE="${1:?uso: gate-positive.sh <sprint-file> <feat-id>}"
FEAT_ID="${2:?uso: gate-positive.sh <sprint-file> <feat-id>}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SPRINTS_DIR="$(dirname "$SCRIPT_DIR")/sprints"
SPRINT_PATH="$SPRINTS_DIR/$SPRINT_FILE"

if [[ ! -f "$SPRINT_PATH" ]]; then
  echo "GATE_POSITIVE=FAIL"
  echo "ERR: sprint nao encontrada: $SPRINT_PATH"
  exit 1
fi

# Extrai patterns + files via python3 (parsing JSON)
read -r PATTERNS_RAW FILES_RAW <<< "$(python3 -c "
import json, sys
data = json.load(open('$SPRINT_PATH'))
feat = next((f for f in data.get('features', []) if f['id'] == '$FEAT_ID'), None)
if not feat:
    sys.exit(2)
v = feat.get('verification', {})
patterns = v.get('grepMustMatch', [])
files = v.get('grepFiles', [])
# join com NUL nao funciona em bash facil — usa | como separador (improvavel em regex)
print('|'.join(patterns), end=' ')
print('|'.join(files))
" 2>/dev/null)"

if [[ -z "$PATTERNS_RAW" || -z "$FILES_RAW" ]]; then
  echo "GATE_POSITIVE=OK"
  echo "(sem patterns ou files declarados — gate skip)"
  exit 0
fi

IFS='|' read -ra PATTERNS <<< "$PATTERNS_RAW"
IFS='|' read -ra FILES <<< "$FILES_RAW"

GATE_LOG="/tmp/harness/gate-positive-${FEAT_ID}.log"
mkdir -p /tmp/harness/
: > "$GATE_LOG"
ALL_OK=1

for PATTERN in "${PATTERNS[@]}"; do
  FOUND=0
  for FILE in "${FILES[@]}"; do
    if [[ -f "$FILE" ]] && timeout 10 grep -qE "$PATTERN" "$FILE" 2>/dev/null; then
      FOUND=1
      break
    fi
  done
  if [[ $FOUND -eq 0 ]]; then
    echo "MISS: padrao '$PATTERN' nao encontrado em nenhum de [${FILES[*]}]" >> "$GATE_LOG"
    ALL_OK=0
  fi
done

if [[ $ALL_OK -eq 1 ]]; then
  echo "GATE_POSITIVE=OK"
  exit 0
else
  echo "GATE_POSITIVE=FAIL"
  cat "$GATE_LOG"
  exit 1
fi
