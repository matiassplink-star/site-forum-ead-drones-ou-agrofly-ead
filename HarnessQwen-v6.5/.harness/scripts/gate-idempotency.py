#!/usr/bin/env python3
"""
Valida idempotencia do harness: sprints anteriores DEVEM estar fechadas
individualmente quando o index marca elas como done.

Uso:
    python3 .harness/scripts/gate-idempotency.py

Detecta sintoma do anti-pattern: auto-condense do harness do agente
avancou current.txt sem fechar JSON de uma sprint anterior.

Exit:
    0 = SPRINTS ANTERIORES OK
    1 = SPRINTS INCOMPLETAS
"""
import glob
import json
import sys


def main() -> int:
    problems = []

    # Cada sprint individual: se nao e pending pura, deve estar 100% done
    for f in sorted(glob.glob(".harness/sprints/*.json")):
        if "00-index" in f:
            continue
        with open(f, encoding="utf-8") as fp:
            d = json.load(fp)
        statuses = set(x["status"] for x in d["features"])
        if d["status"] == "pending" and statuses == {"pending"}:
            continue  # sprint nao iniciada — OK
        if d["status"] != "done" or statuses != {"done"}:
            problems.append((f.split("/")[-1], d["status"], statuses))

    # Cross-check com index
    with open(".harness/sprints/00-index.json", encoding="utf-8") as fp:
        index = json.load(fp)

    for s in index["sprints"]:
        if s["status"] == "done":
            sprint_path = f'.harness/sprints/{s["file"]}'
            with open(sprint_path, encoding="utf-8") as fp:
                d = json.load(fp)
            if d["status"] != "done":
                problems.append((s["file"], f"INDEX=done mas SPRINT={d['status']}", None))

    if problems:
        print("SPRINTS INCOMPLETAS:", file=sys.stderr)
        for p in problems:
            print(f"  {p}", file=sys.stderr)
        return 1

    print("SPRINTS ANTERIORES OK")
    return 0


if __name__ == "__main__":
    sys.exit(main())
