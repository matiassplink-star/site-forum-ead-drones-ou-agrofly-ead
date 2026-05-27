#!/usr/bin/env python3
"""
Valida que arquivos do files[] de uma feature com lines='new' realmente existem.

Uso:
    python3 .harness/scripts/gate-paths.py <sprint-file> <feat-id>

Exit:
    0 = PATHS OK
    1 = arquivos faltando
"""
import json
import os
import sys


def main() -> int:
    if len(sys.argv) != 3:
        print("uso: gate-paths.py <sprint-file> <feat-id>", file=sys.stderr)
        return 2

    sprint_file, feat_id = sys.argv[1], sys.argv[2]
    path = f".harness/sprints/{sprint_file}"
    with open(path, encoding="utf-8") as f:
        d = json.load(f)

    feat = next((x for x in d["features"] if x["id"] == feat_id), None)
    if feat is None:
        print(f"FAIL: feature {feat_id} nao encontrada", file=sys.stderr)
        return 1

    missing = [
        x["file"]
        for x in feat.get("files", [])
        if x.get("lines") == "new" and not os.path.exists(x["file"])
    ]
    if missing:
        print(f"FAIL: ARQUIVOS FALTANDO: {missing}", file=sys.stderr)
        return 1

    print("PATHS OK")
    return 0


if __name__ == "__main__":
    sys.exit(main())
