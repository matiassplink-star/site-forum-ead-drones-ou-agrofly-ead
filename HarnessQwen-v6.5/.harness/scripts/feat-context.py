#!/usr/bin/env python3
"""
Imprime CONTEXTO COMPLETO de UMA feature em UM comando:
1. Info da feature (title, AC, hints, verification)
2. Conteudo da SPEC.md no range `specLines` exato
3. Para cada arquivo de `files[]` com `lines` (nao "new"), tambem imprime
   o conteudo no range (se o arquivo ja existir)

Substitui:
- `read_file <sprint>.json` (sprint inteiro)
- `read_file SPEC.md` (com offset/limit calculado manualmente)
- `read_file <arquivo>` (para cada entrada em files[])

Uso:
    python3 .harness/scripts/feat-context.py <sprint-file> [<feat-id>]

Se <feat-id> omitido: pega primeira feature pending.

REGRA DURA do agente (clinerules v6.1):
- Voce DEVE usar este script ANTES de implementar QUALQUER feature.
- O range da SPEC retornado e a UNICA parte da SPEC que voce deve consultar.
- NAO leia SPEC.md fora do range retornado por este script.
- NAO leia o sprint JSON inteiro — toda info que voce precisa esta aqui.
"""
import json
import os
import sys


def read_range(path: str, range_spec: str) -> str:
    """
    Le um arquivo no range '<start>-<end>' (1-indexed inclusive).
    Aceita ranges multiplos separados por virgula: '10-20,50-70'.
    """
    if not os.path.exists(path):
        return f"(ARQUIVO NAO EXISTE: {path})"

    try:
        with open(path, encoding="utf-8") as f:
            lines = f.readlines()
    except Exception as e:
        return f"(ERRO ao ler {path}: {e})"

    if not range_spec or range_spec == "new":
        return "(arquivo nao precisa ser lido — sera criado nesta feature)"

    parts = []
    for rng in range_spec.split(","):
        rng = rng.strip()
        if "-" in rng:
            a, b = rng.split("-")
            start, end = int(a), int(b)
        else:
            start = end = int(rng)
        # 1-indexed: lines[0] e linha 1
        chunk = lines[start - 1 : end]
        parts.append(f"--- linhas {start}-{end} ---\n" + "".join(chunk))

    return "\n".join(parts)


def main() -> int:
    if len(sys.argv) not in (2, 3):
        print("uso: feat-context.py <sprint-file> [<feat-id>]", file=sys.stderr)
        return 2

    sprint_file = sys.argv[1]
    sprint_path = f".harness/sprints/{sprint_file}"
    with open(sprint_path, encoding="utf-8") as f:
        d = json.load(f)

    if len(sys.argv) == 3:
        feat_id = sys.argv[2]
        feat = next((x for x in d["features"] if x["id"] == feat_id), None)
    else:
        feat = next((x for x in d["features"] if x["status"] != "done"), None)

    if feat is None:
        print("NENHUMA FEATURE PENDENTE NESTA SPRINT.")
        return 0

    # === BLOCO 1: info da feature ===
    print("=" * 70)
    print(f"FEATURE {feat['id']}: {feat.get('title', '')}")
    print("=" * 70)
    print(f"sprint: {sprint_file}")
    print(f"status: {feat['status']}")
    if feat.get("startedAt"):
        print(f"startedAt: {feat['startedAt']}")
    if feat.get("completedAt"):
        print(f"completedAt: {feat['completedAt']}")
    print()
    print("DESCRIPTION:")
    print(f"  {feat.get('description', '')}")
    print()
    print("FILES:")
    for entry in feat.get("files", []):
        print(f"  - {entry['file']} (lines: {entry.get('lines', 'new')})")
    print()
    print("ACCEPTANCE CRITERIA:")
    for i, c in enumerate(feat.get("acceptanceCriteria", []), 1):
        print(f"  {i}. {c}")
    print()
    print("HINTS:")
    for h in feat.get("hints", []):
        print(f"  - {h}")
    print()

    ver = feat.get("verification", {})
    print("VERIFICATION:")
    print(f"  typecheck: {ver.get('typecheck', False)}")
    print(f"  parseable: {ver.get('parseable', True)}")
    if ver.get("grepMustMatch"):
        print("  grepMustMatch:")
        for r in ver["grepMustMatch"]:
            print(f"    - {r}")
    if ver.get("grepMustNotMatch"):
        print("  grepMustNotMatch:")
        for r in ver["grepMustNotMatch"]:
            print(f"    - {r}")
    if ver.get("grepFiles"):
        print("  grepFiles:")
        for fp in ver["grepFiles"]:
            print(f"    - {fp}")
    if ver.get("dependencies"):
        print("  dependencies:")
        for dep in ver["dependencies"]:
            print(f"    - {dep['package']} (manifest: {dep['manifest']})")
    smoke = ver.get("smoke")
    if smoke:
        print("  smoke:")
        print(f"    command: {smoke.get('command', '')}")
        print(f"    timeoutSeconds: {smoke.get('timeoutSeconds', 10)}")
        print(f"    expectedExitCode: {smoke.get('expectedExitCode', 0)}")
        print(f"    executedBy: {smoke.get('executedBy', 'agent')}")
    print()

    # === BLOCO 2: SPEC no range exato ===
    print("=" * 70)
    print(f"SPEC.md (specLines: {feat.get('specLines', '')})")
    print("=" * 70)
    spec_path = d.get("specPath") or "SPEC.md"
    # Se 00-index.json define specPath ao inves do sprint individual, fallback:
    if not os.path.exists(spec_path):
        # tenta achar via 00-index
        try:
            with open(".harness/sprints/00-index.json", encoding="utf-8") as f:
                idx = json.load(f)
            spec_path = idx.get("specPath", "SPEC.md")
        except Exception:
            spec_path = "SPEC.md"
    print(read_range(spec_path, feat.get("specLines", "")))
    print()

    # === BLOCO 3: conteudo de cada arquivo de files[] (se ja existe) ===
    for entry in feat.get("files", []):
        file_path = entry["file"]
        lines = entry.get("lines", "new")
        print("=" * 70)
        print(f"FILE: {file_path} (lines: {lines})")
        print("=" * 70)
        if lines == "new":
            print("(arquivo NAO existe ainda — sera criado nesta feature)")
            if os.path.exists(file_path):
                print(f"AVISO: arquivo ja existe no disco — feature deveria recria-lo? Verifique.")
        else:
            print(read_range(file_path, lines))
        print()

    return 0


if __name__ == "__main__":
    sys.exit(main())
