#!/usr/bin/env python3
"""
Valida os 3 marcadores de fechamento de sprint:
1. sprint.status == 'done'
2. todas as features da sprint == 'done'
3. 00-index.json marca a sprint como 'done'
4. current.txt NAO aponta mais para essa sprint (avancou ou DONE)

Uso:
    python3 .harness/scripts/gate-sprint-closed.py <sprint-file>

Exit:
    0 = SPRINT FECHADA OK
    1 = algum marcador falhou
"""
import json
import sys


def main() -> int:
    if len(sys.argv) != 2:
        print("uso: gate-sprint-closed.py <sprint-file>", file=sys.stderr)
        return 2

    sprint_file = sys.argv[1]
    sprint_path = f".harness/sprints/{sprint_file}"

    with open(sprint_path, encoding="utf-8") as f:
        sprint = json.load(f)

    if sprint["status"] != "done":
        print(f"FAIL: sprint.status={sprint['status']} (esperado: done)", file=sys.stderr)
        return 1

    not_done = [x["id"] for x in sprint["features"] if x["status"] != "done"]
    if not_done:
        print(f"FAIL: features ainda nao done: {not_done}", file=sys.stderr)
        return 1

    with open(".harness/sprints/00-index.json", encoding="utf-8") as f:
        index = json.load(f)

    entry = next((s for s in index["sprints"] if s["file"] == sprint_file), None)
    if entry is None:
        print(f"FAIL: {sprint_file} nao esta em 00-index.json", file=sys.stderr)
        return 1
    if entry["status"] != "done":
        print(f"FAIL: 00-index.json marca {sprint_file} como {entry['status']}", file=sys.stderr)
        return 1

    current = open(".harness/current.txt", encoding="utf-8").read().strip()
    if current == sprint_file:
        print(f"FAIL: current.txt nao avancou (ainda aponta para {sprint_file})", file=sys.stderr)
        return 1

    print("SPRINT FECHADA OK")
    print(f"current.txt agora: {current}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
