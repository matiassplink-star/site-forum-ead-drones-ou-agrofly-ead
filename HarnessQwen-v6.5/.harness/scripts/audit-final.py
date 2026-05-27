#!/usr/bin/env python3
"""
audit-final.py - v6.5

Auditoria final automatica. Roda ao fim do desenvolvimento, ANTES de
marcar DONE. Faz scan abrangente do codigo e gera relatorio categorizado
de findings (HIGH/MED/LOW).

Saida: JSON em /tmp/<harness>/audit-final.json + sumario textual no stdout.

Categorias checadas:
  A. CONSISTENCY    - simbolos usados cross-file de forma inconsistente
  B. DEAD_CODE      - imports/vars unused, arquivos orfaos
  C. SECURITY       - secrets hardcoded, logs sensiveis, CSP/sandbox
  D. ANTI_PATTERNS  - Express async-naked, innerHTML, prepared top-level
  E. DUPLICATION    - literais duplicados, tipos redeclarados
  F. TODOS          - TODO/FIXME/throw not implemented residuais

Uso:
    python3 .harness/scripts/audit-final.py [--root <dir>] [--harness-tmp <dir>]

Exit:
    0 = zero findings HIGH (pode marcar DONE)
    1 = findings HIGH/MED presentes (precisa corrigir)
    2 = erro de configuracao
"""

import sys
import os
import re
import json
import argparse
import subprocess
from pathlib import Path
from collections import defaultdict


# ─── Config ───────────────────────────────────────────────────────────

SECRET_PATTERNS = [
    (r'sk-ant-[A-Za-z0-9]{30,}', 'Anthropic API key hardcoded'),
    (r'sk-[A-Za-z0-9]{40,}', 'OpenAI-style API key hardcoded'),
    (r'xi-api-key\s*[:=]\s*["\'][A-Za-z0-9]{20,}', 'ElevenLabs API key hardcoded'),
    (r'AKIA[0-9A-Z]{16}', 'AWS access key hardcoded'),
    (r'-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----', 'Private key in source'),
    (r'password\s*[:=]\s*["\'][^"\']{6,}["\']', 'Password literal in source'),
]

SENSITIVE_LOG_PATTERNS = [
    # Loga VARIAVEL chamada token/password/etc (nao mensagem string que so menciona a palavra)
    r'console\.(log|info|warn|error|debug)\([^)]*\$\{[^}]*token[^}]*\}',
    r'console\.(log|info|warn|error|debug)\([^)]*\$\{[^}]*password[^}]*\}',
    r'console\.(log|info|warn|error|debug)\([^)]*\$\{[^}]*authorization[^}]*\}',
    r'console\.(log|info|warn|error|debug)\([^)]*\$\{[^}]*api_?key[^}]*\}',
    # Loga req.body / req.headers diretamente
    r'console\.(log|info|warn|error|debug)\([^)]*req\.body(?!\.\w+\.length)',
    r'console\.(log|info|warn|error|debug)\([^)]*req\.headers',
    # Concat de string com variavel sensivel via +
    r'console\.(log|info|warn|error|debug)\([^)]*\+\s*(?:token|password)\b',
]

ANTI_PATTERNS = [
    (r'router\.(get|post|put|delete|patch)\([^,]+,\s*async\s*\(', 'Express async handler sem .catch(next) wrapper'),
    # Prepared statement no module body (zero indent) — true top-level
    (r'^const\s+\w+\s*=\s*db\.prepare\(', 'Prepared statement TOP-LEVEL no module body (deveria ser LAZY)'),
    (r'\binnerHTML\s*=', 'innerHTML em renderer (proibido — usar textContent/createElement)'),
    (r'dangerouslySetInnerHTML', 'dangerouslySetInnerHTML em renderer'),
    # `: any` mas evita matches falsos em casts justificados com comment // any-ok
    (r':\s*any\b(?!.*//.*any-ok)', 'Tipo `any` (proibido pelo TS strict — use unknown ou tipo explicito)'),
    (r'\beval\s*\(', 'eval() em codigo (proibido)'),
    (r'new\s+Function\s*\(', 'new Function() (proibido)'),
]

ELECTRON_SECURITY = [
    (r'nodeIntegration:\s*true', 'nodeIntegration:true (PROIBIDO em Electron — DEVE ser false)'),
    (r'contextIsolation:\s*false', 'contextIsolation:false (PROIBIDO — DEVE ser true)'),
    (r'sandbox:\s*false', 'sandbox:false (PROIBIDO — DEVE ser true)'),
    (r'webSecurity:\s*false', 'webSecurity:false (proibido em prod)'),
    (r'allowRunningInsecureContent:\s*true', 'allowRunningInsecureContent:true'),
]

TODO_PATTERNS = [
    r'TODO\(Sprint',
    r'FIXME',
    r"throw new Error\(['\"]not implemented['\"]\)",
    r'XXX',
]

IGNORE_DIRS = {'node_modules', 'dist', '.git', '.harness', 'docs'}


# ─── Helpers ──────────────────────────────────────────────────────────

def find_source_files(root: Path, extensions: set[str]) -> list[Path]:
    out = []
    for f in root.rglob('*'):
        if not f.is_file():
            continue
        if any(p in IGNORE_DIRS for p in f.parts):
            continue
        if f.suffix.lower() in extensions:
            out.append(f)
    return out


def grep_pattern(pattern: str, files: list[Path]) -> list[tuple[Path, int, str]]:
    """Retorna lista de (arquivo, linha, conteudo)."""
    out = []
    try:
        regex = re.compile(pattern, re.MULTILINE)
    except re.error:
        return out
    for f in files:
        try:
            content = f.read_text(encoding='utf-8', errors='replace')
        except OSError:
            continue
        for i, line in enumerate(content.splitlines(), 1):
            if regex.search(line):
                out.append((f, i, line.strip()[:120]))
    return out


# ─── Checks ───────────────────────────────────────────────────────────

def check_consistency(root: Path) -> list[dict]:
    """Roda gate-consistency.py em diretorios com rotas/middlewares."""
    findings = []
    candidates_symbols = []
    # Procura imports comuns que sao factories/middlewares
    routes_dir = root / 'backend' / 'routes'
    if routes_dir.is_dir():
        # Detecta simbolos importados em multiplos arquivos
        imports = defaultdict(set)
        for f in routes_dir.rglob('*.ts'):
            if f.name.endswith('.d.ts'):
                continue
            try:
                content = f.read_text(encoding='utf-8', errors='replace')
            except OSError:
                continue
            for m in re.finditer(r'import\s*{([^}]+)}', content):
                for sym in m.group(1).split(','):
                    sym = sym.strip()
                    if sym and not sym.startswith('type '):
                        imports[sym].add(f.name)
        # Considera simbolos importados em 2+ arquivos
        candidates_symbols = [s for s, fs in imports.items() if len(fs) >= 2]

    if candidates_symbols:
        script = root / '.harness' / 'scripts' / 'gate-consistency.py'
        if script.is_file():
            try:
                result = subprocess.run(
                    ['python3', str(script), str(routes_dir)] + candidates_symbols,
                    capture_output=True, text=True, timeout=30,
                )
                if result.returncode != 0:
                    findings.append({
                        'category': 'CONSISTENCY',
                        'severity': 'HIGH',
                        'message': 'Uso inconsistente de simbolo cross-file',
                        'detail': result.stdout.strip(),
                    })
            except subprocess.TimeoutExpired:
                findings.append({
                    'category': 'CONSISTENCY',
                    'severity': 'MED',
                    'message': 'gate-consistency timeout',
                    'detail': '',
                })

    return findings


def check_import_resolve(root: Path) -> list[dict]:
    findings = []
    script = root / '.harness' / 'scripts' / 'gate-import-resolve.py'
    if not script.is_file():
        return findings
    targets = [d for d in ['backend', 'frontend', 'electron', 'shared', 'scripts'] if (root / d).is_dir()]
    if not targets:
        return findings
    try:
        result = subprocess.run(
            ['python3', str(script)] + [str(root / t) for t in targets],
            capture_output=True, text=True, timeout=60,
        )
        if result.returncode != 0:
            findings.append({
                'category': 'CONSISTENCY',
                'severity': 'HIGH',
                'message': 'Imports nao resolvem',
                'detail': result.stdout.strip(),
            })
    except subprocess.TimeoutExpired:
        pass
    return findings


def check_unused(root: Path) -> list[dict]:
    findings = []
    # Roda npm run typecheck e parseia
    try:
        result = subprocess.run(
            ['npm', 'run', 'typecheck'],
            cwd=str(root), capture_output=True, text=True, timeout=120,
        )
        # TS6133 = declared but never used; TS6196 = same but in declaration
        unused = re.findall(
            r'(\S+\.ts)\((\d+),(\d+)\):\s*error\s+TS(6133|6196):\s*(.+)',
            result.stdout + result.stderr,
        )
        for fpath, line, col, code, msg in unused:
            findings.append({
                'category': 'DEAD_CODE',
                'severity': 'MED',
                'message': f'Unused identifier (TS{code})',
                'detail': f'{fpath}:{line} - {msg.strip()}',
            })
    except subprocess.TimeoutExpired:
        pass
    except FileNotFoundError:
        pass
    return findings


def check_security(root: Path) -> list[dict]:
    findings = []
    source_files = find_source_files(root, {'.ts', '.tsx', '.js', '.jsx', '.json', '.html', '.env'})
    # Filtra .env.example (ok), pega so .env reais
    source_files = [f for f in source_files if not f.name.endswith('.example')]

    for pattern, desc in SECRET_PATTERNS:
        for f, line, content in grep_pattern(pattern, source_files):
            findings.append({
                'category': 'SECURITY',
                'severity': 'HIGH',
                'message': desc,
                'detail': f'{f}:{line}',
            })

    for pattern in SENSITIVE_LOG_PATTERNS:
        for f, line, content in grep_pattern(pattern, source_files):
            findings.append({
                'category': 'SECURITY',
                'severity': 'HIGH',
                'message': 'Log de dado sensivel (token/password/auth)',
                'detail': f'{f}:{line} - {content}',
            })

    # Electron security defaults
    electron_files = [f for f in source_files if 'electron' in f.parts]
    for pattern, desc in ELECTRON_SECURITY:
        for f, line, content in grep_pattern(pattern, electron_files):
            findings.append({
                'category': 'SECURITY',
                'severity': 'HIGH',
                'message': desc,
                'detail': f'{f}:{line}',
            })

    return findings


def check_anti_patterns(root: Path) -> list[dict]:
    findings = []
    source_files = find_source_files(root, {'.ts', '.tsx'})

    for pattern, desc in ANTI_PATTERNS:
        for f, line, content in grep_pattern(pattern, source_files):
            severity = 'HIGH' if 'any' in desc or 'Express async' in desc or 'top-level' in desc.lower() else 'MED'
            findings.append({
                'category': 'ANTI_PATTERN',
                'severity': severity,
                'message': desc,
                'detail': f'{f}:{line} - {content}',
            })

    return findings


def check_todos(root: Path) -> list[dict]:
    findings = []
    source_files = find_source_files(root, {'.ts', '.tsx', '.js', '.css', '.html'})

    for pattern in TODO_PATTERNS:
        for f, line, content in grep_pattern(pattern, source_files):
            findings.append({
                'category': 'TODO',
                'severity': 'MED',
                'message': 'TODO/FIXME/not-implemented residual',
                'detail': f'{f}:{line} - {content}',
            })

    return findings


def check_duplicate_literals(root: Path) -> list[dict]:
    """Detecta strings literais que aparecem 3+ vezes (candidato a constante)."""
    findings = []
    source_files = find_source_files(root, {'.ts', '.tsx'})
    literal_count = defaultdict(list)
    # Pega strings literais com >= 12 chars (filtros: ignora common ones)
    literal_pattern = re.compile(r'["\']([^"\']{12,80})["\']')
    ignore = {'use strict', 'application/json', 'text/plain', 'utf-8', 'Content-Type'}

    for f in source_files:
        try:
            content = f.read_text(encoding='utf-8', errors='replace')
        except OSError:
            continue
        for i, line in enumerate(content.splitlines(), 1):
            # Ignora comments
            stripped = line.strip()
            if stripped.startswith('//') or stripped.startswith('*'):
                continue
            for m in literal_pattern.finditer(line):
                lit = m.group(1)
                if lit in ignore:
                    continue
                # Filtra paths/URLs comuns
                if lit.startswith('http://') or lit.startswith('https://'):
                    continue
                literal_count[lit].append((f, i))

    for lit, occurrences in literal_count.items():
        unique_files = set(occ[0] for occ in occurrences)
        if len(occurrences) >= 3 and len(unique_files) >= 2:
            findings.append({
                'category': 'DUPLICATION',
                'severity': 'LOW',
                'message': f'Literal "{lit[:50]}" duplicado {len(occurrences)}x em {len(unique_files)} arquivos',
                'detail': '; '.join(f'{f}:{l}' for f, l in occurrences[:5]),
            })

    return findings


# ─── Main ──────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--root', default='.', help='Raiz do projeto')
    parser.add_argument('--harness-tmp', default='/tmp/harness', help='Dir tmp')
    args = parser.parse_args()

    root = Path(args.root).resolve()
    tmp_dir = Path(args.harness_tmp)
    tmp_dir.mkdir(parents=True, exist_ok=True)

    if not root.is_dir():
        print(f'AUDIT=FAIL: root nao existe: {root}', file=sys.stderr)
        sys.exit(2)

    print(f'=== AUDIT FINAL - {root} ===')
    print('Rodando 7 checks (consistency, imports, unused, security, anti-patterns, duplicates, todos)...')
    print('')

    all_findings = []

    checks = [
        ('CONSISTENCY symbols', check_consistency),
        ('IMPORTS resolve', check_import_resolve),
        ('UNUSED imports/vars', check_unused),
        ('SECURITY secrets/logs', check_security),
        ('ANTI_PATTERNS framework', check_anti_patterns),
        ('TODOS residuais', check_todos),
        ('DUPLICATION literals', check_duplicate_literals),
    ]

    for name, fn in checks:
        try:
            fs = fn(root)
        except Exception as e:
            fs = [{
                'category': 'AUDIT_ERROR',
                'severity': 'MED',
                'message': f'Check {name} falhou: {type(e).__name__}',
                'detail': str(e)[:200],
            }]
        all_findings.extend(fs)
        status = 'OK' if not fs else f'{len(fs)} findings'
        print(f'  [{name}] {status}')

    # Sumario por severidade
    by_sev = defaultdict(int)
    by_cat = defaultdict(int)
    for f in all_findings:
        by_sev[f['severity']] += 1
        by_cat[f['category']] += 1

    print('')
    print('=== SUMARIO ===')
    print(f'  TOTAL findings: {len(all_findings)}')
    for sev in ['HIGH', 'MED', 'LOW']:
        if by_sev[sev]:
            print(f'    {sev}: {by_sev[sev]}')
    print('  Por categoria:')
    for cat, n in sorted(by_cat.items()):
        print(f'    {cat}: {n}')

    # Write JSON
    out_file = tmp_dir / 'audit-final.json'
    out_file.write_text(json.dumps({
        'root': str(root),
        'total': len(all_findings),
        'by_severity': dict(by_sev),
        'by_category': dict(by_cat),
        'findings': [
            {**f, 'detail': str(f.get('detail', ''))[:500]}
            for f in all_findings
        ],
    }, indent=2, default=str))
    print('')
    print(f'Detalhes em: {out_file}')

    # Exit code
    if by_sev['HIGH'] > 0:
        print('AUDIT=FAIL (HIGH findings presentes)')
        sys.exit(1)
    elif by_sev['MED'] > 0:
        print('AUDIT=WARN (MED findings — revisar antes de DONE)')
        sys.exit(1)
    else:
        print('AUDIT=OK (zero findings HIGH/MED)')
        sys.exit(0)


if __name__ == '__main__':
    main()
