#!/usr/bin/env python3
"""
Valida lifecycle de uma sprint:
- No maximo 1 feature com status=in-progress
- Toda feature com status=done tem completedAt nao-null

Uso:
    python3 .harness/scripts/gate-lifecycle.py <sprint-file>

Exit:
    0 = LIFECYCLE OK
    1 = violacao detectada
"""
import json
import sys


def main() -> int:
    if len(sys.argv) != 2:
        print("uso: gate-lifecycle.py <sprint-file>", file=sys.stderr)
        return 2

    path = f".harness/sprints/{sys.argv[1]}"
    with open(path, encoding="utf-8") as f:
        d = json.load(f)

    in_prog = [x["id"] for x in d["features"] if x["status"] == "in-progress"]
    if len(in_prog) > 1:
        print(f"FAIL: mais de uma feature in-progress: {in_prog}", file=sys.stderr)
        return 1

    done_no_completed = [
        x["id"]
        for x in d["features"]
        if x["status"] == "done" and not x.get("completedAt")
    ]
    if done_no_completed:
        print(f"FAIL: done sem completedAt: {done_no_completed}", file=sys.stderr)
        return 1

    print("LIFECYCLE OK")
    return 0


if __name__ == "__main__":
    sys.exit(main())
