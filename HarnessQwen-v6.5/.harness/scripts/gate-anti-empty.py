#!/usr/bin/env python3
"""
Valida que campos da feature nao foram esvaziados durante edicao do JSON.

Uso:
    python3 .harness/scripts/gate-anti-empty.py <sprint-file> <feat-id>

Verifica:
    - acceptanceCriteria >= 2
    - hints >= 1
    - files >= 1
    - description nao vazia

Exit:
    0 = ANTI-ESVAZIAMENTO OK
    1 = algum campo esvaziado
"""
import json
import sys


def main() -> int:
    if len(sys.argv) != 3:
        print("uso: gate-anti-empty.py <sprint-file> <feat-id>", file=sys.stderr)
        return 2

    sprint_file, feat_id = sys.argv[1], sys.argv[2]
    path = f".harness/sprints/{sprint_file}"
    with open(path, encoding="utf-8") as f:
        d = json.load(f)

    feat = next((x for x in d["features"] if x["id"] == feat_id), None)
    if feat is None:
        print(f"FAIL: feature {feat_id} nao encontrada", file=sys.stderr)
        return 1

    if len(feat.get("acceptanceCriteria", [])) < 2:
        print("FAIL: CRITERIOS ESVAZIADOS (< 2)", file=sys.stderr)
        return 1
    if len(feat.get("hints", [])) < 1:
        print("FAIL: HINTS ESVAZIADO", file=sys.stderr)
        return 1
    if len(feat.get("files", [])) < 1:
        print("FAIL: FILES ESVAZIADO", file=sys.stderr)
        return 1
    if not feat.get("description", "").strip():
        print("FAIL: DESCRIPTION ESVAZIADA", file=sys.stderr)
        return 1

    print("ANTI-ESVAZIAMENTO OK")
    return 0


if __name__ == "__main__":
    sys.exit(main())
