#!/usr/bin/env python3
"""
gate-consistency.py - v6.4

Detecta uso INCONSISTENTE de simbolos importados entre arquivos.
Causa raiz v6.3: `authGuard` chamado como `authGuard,` em 3 rotas
mas `authGuard(getDb())` em 2 outras. Bug invisivel ao typecheck.

Uso:
    python3 .harness/scripts/gate-consistency.py <root-dir> <symbol> [<symbol> ...]

Exemplo:
    python3 .harness/scripts/gate-consistency.py backend/routes authGuard validate

Procura por padroes:
    SYMBOL(args)   <- chamada com args
    SYMBOL,        <- referenciado sem call (passado direto)
    SYMBOL)        <- ultimo arg de chamada (sem ())
    SYMBOL\\s*$    <- referenciado em linha sozinho

Se um simbolo aparece em arquivos com PADROES DIFERENTES (call vs no-call),
reporta inconsistencia.

Exit 0 = consistente. Exit 1 = inconsistencia detectada.
"""

import sys
import os
import re
from pathlib import Path


def find_ts_files(root: Path):
    """Retorna lista de arquivos .ts (nao .d.ts) sob root."""
    return [
        f for f in root.rglob('*.ts')
        if not f.name.endswith('.d.ts')
        and 'node_modules' not in f.parts
        and 'dist' not in f.parts
    ]


def detect_usage(file_path: Path, symbol: str) -> list[str]:
    """
    Retorna list de tipos de uso encontrados.
    Possiveis: 'imported', 'called', 'passed-uncalled'
    """
    try:
        content = file_path.read_text(encoding='utf-8')
    except (OSError, UnicodeDecodeError):
        return []

    usages = []

    # Eh importado?
    if re.search(rf'\bimport\s*{{[^}}]*\b{re.escape(symbol)}\b', content):
        usages.append('imported')
    elif re.search(rf"\bimport\s+\*\s+as\s+\w+\s+from", content):
        # talvez via namespace; nao tratamos
        pass

    # Chamada com args: symbol(...) onde nao eh parte de outro identificador
    if re.search(rf'(?<![A-Za-z0-9_]){re.escape(symbol)}\s*\(', content):
        usages.append('called')

    # Passado SEM chamada: aparece como argumento ou em array sem ()
    # patterns: `, symbol,`  `, symbol)`  `[symbol,`  `[symbol]`  `(symbol,`  `(symbol)`
    # mas EXCLUI casos onde tem () depois
    matches = re.findall(
        rf'(?<![A-Za-z0-9_]){re.escape(symbol)}(?![A-Za-z0-9_(])',
        content
    )
    if matches:
        # filtra contextos onde aparece como middleware passado
        # Heuristica: se aparece em routes (router.X(...)), e SEM (), eh "passed-uncalled"
        for m in re.finditer(
            rf'router\.\w+\([^)]*?(?<![A-Za-z0-9_]){re.escape(symbol)}(?![A-Za-z0-9_(])',
            content,
            re.DOTALL
        ):
            usages.append('passed-uncalled-in-route')
            break

    return usages


def main():
    if len(sys.argv) < 3:
        print('Uso: gate-consistency.py <root-dir> <symbol> [<symbol> ...]', file=sys.stderr)
        sys.exit(2)

    root = Path(sys.argv[1])
    symbols = sys.argv[2:]

    if not root.exists():
        print(f'GATE_CONSISTENCY=FAIL: root nao existe: {root}', file=sys.stderr)
        sys.exit(1)

    files = find_ts_files(root)
    all_ok = True

    for symbol in symbols:
        by_usage_kind = {}  # usage_kind -> [files]

        for f in files:
            usages = detect_usage(f, symbol)
            if 'imported' not in usages:
                continue  # so importadores importam

            # Determina padrao primario
            if 'called' in usages and 'passed-uncalled-in-route' in usages:
                kind = 'mixed-in-same-file'
            elif 'called' in usages:
                kind = 'called'
            elif 'passed-uncalled-in-route' in usages:
                kind = 'passed-uncalled'
            else:
                kind = 'imported-only'

            by_usage_kind.setdefault(kind, []).append(str(f))

        kinds_active = [k for k, fs in by_usage_kind.items() if fs and k != 'imported-only']

        if len(kinds_active) > 1:
            all_ok = False
            print(f"INCONSISTENCY: simbolo '{symbol}' usado com padroes diferentes:")
            for k in kinds_active:
                print(f"  [{k}] em:")
                for f in by_usage_kind[k]:
                    print(f"    - {f}")

    if all_ok:
        print('GATE_CONSISTENCY=OK')
        sys.exit(0)
    else:
        print('GATE_CONSISTENCY=FAIL')
        sys.exit(1)


if __name__ == '__main__':
    main()
