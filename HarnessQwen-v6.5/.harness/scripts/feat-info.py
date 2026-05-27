#!/usr/bin/env python3
"""
Imprime SOMENTE as informacoes da feature atual de uma sprint.
Evita o agente reler o JSON inteiro do sprint quando so precisa de UMA feature.

Uso:
    python3 .harness/scripts/feat-info.py <sprint-file> [<feat-id>]

Se <feat-id> omitido: imprime a primeira feature com status=pending OR in-progress.

Output (formato amigavel ao agente):
    === FEATURE feat-NNN ===
    title: <...>
    status: <...>
    description: <...>
    specLines: <range>
    files:
      - <path> (lines: <range>)
    acceptanceCriteria:
      1. <...>
      2. <...>
    hints:
      - <...>
    verification.grepMustMatch:
      - <regex>
    verification.grepMustNotMatch:
      - <regex>
    verification.grepFiles:
      - <path>
    verification.smoke: <command or none>
"""
import json
import sys


def main() -> int:
    if len(sys.argv) not in (2, 3):
        print("uso: feat-info.py <sprint-file> [<feat-id>]", file=sys.stderr)
        return 2

    sprint_file = sys.argv[1]
    path = f".harness/sprints/{sprint_file}"
    with open(path, encoding="utf-8") as f:
        d = json.load(f)

    if len(sys.argv) == 3:
        feat_id = sys.argv[2]
        feat = next((x for x in d["features"] if x["id"] == feat_id), None)
    else:
        # Primeira nao-done
        feat = next((x for x in d["features"] if x["status"] != "done"), None)

    if feat is None:
        print("NENHUMA FEATURE PENDENTE")
        return 0

    print(f"=== FEATURE {feat['id']} ===")
    print(f"title: {feat.get('title', '')}")
    print(f"status: {feat['status']}")
    print(f"startedAt: {feat.get('startedAt')}")
    print(f"completedAt: {feat.get('completedAt')}")
    print(f"description: {feat.get('description', '')}")
    print(f"specLines: {feat.get('specLines', '')}")
    print("files:")
    for entry in feat.get("files", []):
        print(f"  - {entry['file']} (lines: {entry.get('lines', 'new')})")
    print("acceptanceCriteria:")
    for i, c in enumerate(feat.get("acceptanceCriteria", []), 1):
        print(f"  {i}. {c}")
    print("hints:")
    for h in feat.get("hints", []):
        print(f"  - {h}")
    ver = feat.get("verification", {})
    print(f"verification.typecheck: {ver.get('typecheck', False)}")
    print(f"verification.parseable: {ver.get('parseable', True)}")
    if ver.get("grepMustMatch"):
        print("verification.grepMustMatch:")
        for r in ver["grepMustMatch"]:
            print(f"  - {r}")
    if ver.get("grepMustNotMatch"):
        print("verification.grepMustNotMatch:")
        for r in ver["grepMustNotMatch"]:
            print(f"  - {r}")
    if ver.get("grepFiles"):
        print("verification.grepFiles:")
        for fp in ver["grepFiles"]:
            print(f"  - {fp}")
    if ver.get("dependencies"):
        print("verification.dependencies:")
        for dep in ver["dependencies"]:
            print(f"  - {dep['package']} (in {dep['manifest']})")
    smoke = ver.get("smoke")
    if smoke:
        print(f"verification.smoke.command: {smoke.get('command', '')}")
        print(f"verification.smoke.timeoutSeconds: {smoke.get('timeoutSeconds', 10)}")
        print(f"verification.smoke.expectedExitCode: {smoke.get('expectedExitCode', 0)}")
        print(f"verification.smoke.executedBy: {smoke.get('executedBy', 'agent')}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
