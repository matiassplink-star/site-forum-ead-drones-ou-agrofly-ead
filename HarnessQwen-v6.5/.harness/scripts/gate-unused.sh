#!/usr/bin/env bash
# gate-unused.sh — v6.4
#
# Roda tsc em modo strict (noUnusedLocals + noUnusedParameters) APENAS
# nos arquivos passados como argumento. Pega unused imports/vars CEDO,
# antes do tsc -b final coletar tudo em massa.
#
# Causa raiz v6.3: 5 erros de unused imports/vars so apareceram no
# typecheck final, depois de 64 features prontas. Gate por arquivo
# pega ao fim de cada feature.
#
# Uso:
#   bash .harness/scripts/gate-unused.sh <file.ts> [<file.ts> ...]
#
# Exit 0 = OK. Exit 1 = unused encontrado. Exit 2 = tsc nao instalado.

set -euo pipefail

if [[ $# -eq 0 ]]; then
  echo "Uso: gate-unused.sh <file.ts> [<file.ts> ...]" >&2
  exit 2
fi

if ! command -v npx > /dev/null 2>&1; then
  echo "GATE_UNUSED=FAIL: npx nao encontrado" >&2
  exit 2
fi

GATE_LOG="/tmp/harness/gate-unused.log"
mkdir -p /tmp/harness/
: > "$GATE_LOG"

ALL_OK=1

for FILE in "$@"; do
  if [[ ! -f "$FILE" ]]; then
    echo "GATE_UNUSED=FAIL: arquivo nao existe: $FILE" >> "$GATE_LOG"
    ALL_OK=0
    continue
  fi

  # tsc isolado por arquivo. --skipLibCheck pra ignorar erros em libs externas.
  # Flags strict de unused.
  if ! timeout 30 npx tsc --noEmit \
      --strict \
      --noUnusedLocals \
      --noUnusedParameters \
      --skipLibCheck \
      --esModuleInterop \
      --moduleResolution node \
      --target ES2022 \
      --module CommonJS \
      "$FILE" 2>> "$GATE_LOG"; then
    ALL_OK=0
  fi
done

if [[ $ALL_OK -eq 1 ]]; then
  echo "GATE_UNUSED=OK"
  exit 0
fi

echo "GATE_UNUSED=FAIL"
# Filtra so erros de unused (TS6133, TS6196) pra reduzir noise
grep -E "error TS(6133|6196):" "$GATE_LOG" || cat "$GATE_LOG"
exit 1
