#!/usr/bin/env bash
# gate-negative.sh — v6.4
#
# Verifica que nenhum PATTERN aparece em NENHUM dos FILES.
# Semantica: NOT EXISTS cross-files.
#
# Uso:
#   bash .harness/scripts/gate-negative.sh <sprint-file> <feat-id>
#
# Le verification.grepMustNotMatch + verification.grepFiles do JSON.
# Output: 1 linha "GATE_NEGATIVE=OK" ou "GATE_NEGATIVE=FAIL\n<hits>".
# Exit 0 = OK, exit 1 = FAIL.

set -euo pipefail

SPRINT_FILE="${1:?uso: gate-negative.sh <sprint-file> <feat-id>}"
FEAT_ID="${2:?uso: gate-negative.sh <sprint-file> <feat-id>}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SPRINTS_DIR="$(dirname "$SCRIPT_DIR")/sprints"
SPRINT_PATH="$SPRINTS_DIR/$SPRINT_FILE"

if [[ ! -f "$SPRINT_PATH" ]]; then
  echo "GATE_NEGATIVE=FAIL"
  echo "ERR: sprint nao encontrada: $SPRINT_PATH"
  exit 1
fi

read -r PATTERNS_RAW FILES_RAW <<< "$(python3 -c "
import json, sys
data = json.load(open('$SPRINT_PATH'))
feat = next((f for f in data.get('features', []) if f['id'] == '$FEAT_ID'), None)
if not feat:
    sys.exit(2)
v = feat.get('verification', {})
patterns = v.get('grepMustNotMatch', [])
files = v.get('grepFiles', [])
print('|'.join(patterns), end=' ')
print('|'.join(files))
" 2>/dev/null)"

if [[ -z "$PATTERNS_RAW" || -z "$FILES_RAW" ]]; then
  echo "GATE_NEGATIVE=OK"
  echo "(sem patterns negativos — gate skip)"
  exit 0
fi

IFS='|' read -ra PATTERNS <<< "$PATTERNS_RAW"
IFS='|' read -ra FILES <<< "$FILES_RAW"

GATE_LOG="/tmp/harness/gate-negative-${FEAT_ID}.log"
mkdir -p /tmp/harness/
: > "$GATE_LOG"
ALL_OK=1

for PATTERN in "${PATTERNS[@]}"; do
  for FILE in "${FILES[@]}"; do
    if [[ -f "$FILE" ]] && timeout 10 grep -qE "$PATTERN" "$FILE" 2>/dev/null; then
      echo "HIT (proibido): padrao '$PATTERN' encontrado em $FILE" >> "$GATE_LOG"
      ALL_OK=0
    fi
  done
done

if [[ $ALL_OK -eq 1 ]]; then
  echo "GATE_NEGATIVE=OK"
  exit 0
else
  echo "GATE_NEGATIVE=FAIL"
  cat "$GATE_LOG"
  exit 1
fi
