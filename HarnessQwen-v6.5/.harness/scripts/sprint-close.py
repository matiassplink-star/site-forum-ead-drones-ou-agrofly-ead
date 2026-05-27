#!/usr/bin/env python3
"""
Fecha sprint: marca sprint.status=done, atualiza 00-index.json, avanca current.txt.

Uso:
    python3 .harness/scripts/sprint-close.py <sprint-file> [<proxima-sprint-file>|DONE]

Onde:
    <sprint-file>          = sprint que esta fechando (ex: 00-bootstrap-dx.json)
    <proxima-sprint-file>  = proximo arquivo para current.txt (opcional)
                             Se nao informado, o script tenta achar a proxima
                             sprint pending no 00-index.json.
                             Se a sprint que fecha era a ultima, passe "DONE".

Pre-requisitos:
- Todas as features da sprint devem estar com status=done.
- Caso contrario, aborta com mensagem clara.

Output:
    SPRINT FECHADA OK
    current.txt -> <proximo>
"""
import json
import sys


def main() -> int:
    if len(sys.argv) not in (2, 3):
        print("uso: sprint-close.py <sprint-file> [<proxima-sprint-file>|DONE]", file=sys.stderr)
        return 2

    sprint_file = sys.argv[1]
    sprint_path = f".harness/sprints/{sprint_file}"

    with open(sprint_path, encoding="utf-8") as f:
        sprint = json.load(f)

    # Valida que todas as features estao done
    not_done = [f["id"] for f in sprint["features"] if f["status"] != "done"]
    if not_done:
        print(f"ABORTA: features ainda nao done: {not_done}", file=sys.stderr)
        return 1

    # Marca sprint done
    sprint["status"] = "done"
    with open(sprint_path, "w", encoding="utf-8") as f:
        json.dump(sprint, f, indent=2, ensure_ascii=False)
        f.write("\n")

    # Atualiza 00-index.json
    index_path = ".harness/sprints/00-index.json"
    with open(index_path, encoding="utf-8") as f:
        index = json.load(f)

    found = False
    for s in index["sprints"]:
        if s["file"] == sprint_file:
            s["status"] = "done"
            found = True
            break
    if not found:
        print(f"ABORTA: sprint {sprint_file} nao encontrada em 00-index.json", file=sys.stderr)
        return 1

    with open(index_path, "w", encoding="utf-8") as f:
        json.dump(index, f, indent=2, ensure_ascii=False)
        f.write("\n")

    # Determina proximo
    if len(sys.argv) == 3:
        proximo = sys.argv[2]
    else:
        pending = [s for s in index["sprints"] if s["status"] == "pending"]
        if not pending:
            proximo = "DONE"
        else:
            pending.sort(key=lambda x: x["index"])
            proximo = pending[0]["file"]

    with open(".harness/current.txt", "w", encoding="utf-8") as f:
        f.write(proximo + "\n")

    print("SPRINT FECHADA OK")
    print(f"current.txt -> {proximo}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
