#!/usr/bin/env python3
"""
gate-import-resolve.py - v6.4

Valida que cada `from '<path>'` ou `require('<path>')` em arquivos TS
resolve para arquivo existente no disco.

Causa raiz v6.3: `from '../../../shared/types'` em seed.ts apontava
para fora do projeto (raiz tinha so 2 niveis ate shared). tsc capturou
mas demorou — gate antes do typecheck pega instantaneo.

Uso:
    python3 .harness/scripts/gate-import-resolve.py <file-or-dir> [<file> ...]

Exit 0 = todos resolvem. Exit 1 = pelo menos um nao resolve.
Pula imports de pacotes npm (sem ./ ou ../).
"""

import sys
import re
from pathlib import Path


def find_ts_files(target: Path) -> list[Path]:
    if target.is_file() and target.suffix in {'.ts', '.tsx'}:
        return [target]
    if target.is_dir():
        return [
            f for f in target.rglob('*.ts')
            if not f.name.endswith('.d.ts')
            and 'node_modules' not in f.parts
            and 'dist' not in f.parts
        ]
    return []


def extract_imports(file_path: Path) -> list[tuple[int, str]]:
    """Retorna [(line_no, import_path), ...] de imports relativos."""
    try:
        lines = file_path.read_text(encoding='utf-8').splitlines()
    except (OSError, UnicodeDecodeError):
        return []

    out = []
    patterns = [
        re.compile(r"""(?:import|export).*?\bfrom\s+['"](\.\.?/[^'"]+)['"]"""),
        re.compile(r"""require\(\s*['"](\.\.?/[^'"]+)['"]\s*\)"""),
    ]
    for i, line in enumerate(lines, 1):
        for pat in patterns:
            for m in pat.finditer(line):
                out.append((i, m.group(1)))
    return out


def resolve_import(from_file: Path, import_path: str) -> Path | None:
    """Resolve import path relativo a from_file. Retorna Path se existe."""
    base = from_file.parent
    target = (base / import_path).resolve()

    # Tenta exato + .ts + .tsx + /index.ts
    candidates = [
        target,
        target.with_suffix('.ts'),
        target.with_suffix('.tsx'),
        target.with_suffix('.d.ts'),
        target.with_suffix('.json'),
        target / 'index.ts',
        target / 'index.tsx',
        target / 'index.d.ts',
    ]
    for c in candidates:
        if c.is_file():
            return c
    return None


def main():
    if len(sys.argv) < 2:
        print('Uso: gate-import-resolve.py <file-or-dir> [<file> ...]', file=sys.stderr)
        sys.exit(2)

    files = []
    for arg in sys.argv[1:]:
        files.extend(find_ts_files(Path(arg)))

    if not files:
        print('GATE_IMPORT_RESOLVE=OK (nenhum arquivo TS)')
        sys.exit(0)

    fails = []
    total = 0

    for f in files:
        for line_no, imp in extract_imports(f):
            total += 1
            resolved = resolve_import(f, imp)
            if resolved is None:
                fails.append((str(f), line_no, imp))

    if not fails:
        print(f'GATE_IMPORT_RESOLVE=OK ({total} imports validados em {len(files)} arquivos)')
        sys.exit(0)

    print('GATE_IMPORT_RESOLVE=FAIL')
    for f, line, imp in fails:
        print(f"  UNRESOLVED: {f}:{line} -> '{imp}'")
    sys.exit(1)


if __name__ == '__main__':
    main()
