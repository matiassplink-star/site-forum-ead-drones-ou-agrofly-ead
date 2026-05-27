#!/usr/bin/env python3
"""
Mostra o status resumido de TODAS as sprints (uma linha por sprint).

Uso:
    python3 .harness/scripts/sprint-status.py

Util pra agente saber onde esta no pipeline sem ler todos os JSONs.

Output:
    current.txt: <arquivo>

    sprint                                          status      done/total
    -------------------------------------------------------------------
    00-bootstrap-dx.json                            pending     0/4
    01-fundacao.json                                pending     0/7
    ...
"""
import glob
import json
import sys


def main() -> int:
    try:
        current = open(".harness/current.txt", encoding="utf-8").read().strip()
    except Exception:
        current = "(missing)"
    print(f"current.txt: {current}")
    print()
    print(f"{'sprint':<50} {'status':<12} done/total")
    print("-" * 75)

    for f in sorted(glob.glob(".harness/sprints/*.json")):
        name = f.split("/")[-1]
        if name == "00-index.json":
            continue
        with open(f, encoding="utf-8") as fp:
            d = json.load(fp)
        done = sum(1 for x in d["features"] if x["status"] == "done")
        total = len(d["features"])
        marker = " <-- atual" if name == current else ""
        print(f"{name:<50} {d['status']:<12} {done}/{total}{marker}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
