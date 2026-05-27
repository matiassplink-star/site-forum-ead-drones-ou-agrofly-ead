#!/usr/bin/env python3
"""
Atualiza status + timestamp de UMA feature em UM sprint.

Uso:
    python3 .harness/scripts/feat-status.py <sprint-file> <feat-id> <status>

Onde:
    <sprint-file> = nome do arquivo em .harness/sprints/ (ex: 00-bootstrap-dx.json)
    <feat-id>     = id da feature (ex: feat-001)
    <status>      = pending | in-progress | done

Comportamento:
- status=in-progress: define startedAt=now() (ISO 8601 UTC). completedAt fica null.
- status=done: define completedAt=now(). startedAt deve ja existir; se nao, define agora tambem.
- status=pending: reseta startedAt e completedAt para null.

Output:
    OK feat-NNN -> <status>
    (ou exit != 0 com erro)
"""
import json
import sys
from datetime import datetime, timezone


def now_iso() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.000Z")


def main() -> int:
    if len(sys.argv) != 4:
        print("uso: feat-status.py <sprint-file> <feat-id> <status>", file=sys.stderr)
        return 2

    sprint_file, feat_id, new_status = sys.argv[1], sys.argv[2], sys.argv[3]
    if new_status not in ("pending", "in-progress", "done"):
        print(f"status invalido: {new_status}", file=sys.stderr)
        return 2

    path = f".harness/sprints/{sprint_file}"
    with open(path, encoding="utf-8") as f:
        d = json.load(f)

    feat = next((x for x in d["features"] if x["id"] == feat_id), None)
    if feat is None:
        print(f"feature {feat_id} nao encontrada em {sprint_file}", file=sys.stderr)
        return 2

    feat["status"] = new_status
    ts = now_iso()
    if new_status == "in-progress":
        feat["startedAt"] = ts
        feat["completedAt"] = None
    elif new_status == "done":
        if not feat.get("startedAt"):
            feat["startedAt"] = ts
        feat["completedAt"] = ts
    elif new_status == "pending":
        feat["startedAt"] = None
        feat["completedAt"] = None

    with open(path, "w", encoding="utf-8") as f:
        json.dump(d, f, indent=2, ensure_ascii=False)
        f.write("\n")

    print(f"OK {feat_id} -> {new_status}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
