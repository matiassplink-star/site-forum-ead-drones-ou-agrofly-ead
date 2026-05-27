# HarnessQwen v6.5 — Template de Workflow para Desenvolvimento com Cline + Qwen Local

> Template generico e stack-agnostic para desenvolver projetos com Cline (VSCode extension) + LLM local (Qwen 27B+ via LM Studio).
> Resultado de 3 ciclos de evolucao (v6.2 → v6.3 → v6.4 → v6.5) e ~5 projetos reais.

## O que tem aqui

```
HarnessQwen-v6.5/
├── README.md                            ← voce esta aqui
├── START-HERE.md                        ← passo a passo CONCRETO de inicio
├── .clinerules/
│   ├── clinerules.md                    ← regras autoloaded a cada turno do Cline
│   └── workflows/
│       └── develop.md                   ← workflow autoloaded com /develop
├── .harness/
│   ├── scripts/                         ← 16 scripts (gates, lifecycle, audit)
│   │   ├── feat-context.py              ← v6.1: contexto completo de 1 feature em 1 cmd
│   │   ├── feat-info.py / feat-status.py / sprint-status.py / sprint-close.py
│   │   ├── gate-anti-empty.py / gate-idempotency.py / gate-lifecycle.py
│   │   ├── gate-paths.py / gate-sprint-closed.py
│   │   ├── gate-positive.sh / gate-negative.sh    ← v6.4: greps OR/NOT semantics
│   │   ├── gate-unused.sh                          ← v6.4: pega TS6133 cedo
│   │   ├── gate-consistency.py                     ← v6.4: cross-file consistency
│   │   ├── gate-import-resolve.py                  ← v6.4: valida import paths
│   │   └── audit-final.py                          ← v6.5: scan abrangente pre-DONE
│   └── sprints/
│       └── REVIEW-TEMPLATE.json         ← v6.5: Sprint Review Final template
├── docs/
│   ├── LICOES-v6.3.md                   ← memoria institucional (genericas)
│   └── CLINE-SETUP.md                   ← configs obrigatorias do Cline + LM Studio
└── templates/                           ← templates ORIGINAIS do harness
    ├── SPEC-TEMPLATE.md
    ├── SPRINT-TEMPLATE.md
    ├── CLINERULES-TEMPLATE.md
    └── WORKFLOW-TEMPLATE.md
```

## Versao atual: v6.5

| Versao | Principais ganhos | Causa raiz |
|--------|-------------------|------------|
| **v6.5** | Sprint Review Final (`audit-final.py`) + 7 categorias | LLM medio nao revisa 60+ arquivos simultaneo — categorizacao incremental |
| **v6.4** | Gates como scripts em arquivo + 5 novos gates | Heredoc inline floodava contexto = trava 5h |
| **v6.3** | Pre-flight typecheck, timeouts, postInstall, context budget alarm | Bugs sutis acumulando 5 sprints + trava por context overflow |
| **v6.2** | Helper scripts em `.harness/scripts/` | Re-leitura de sprint JSON a cada operacao desperdicava contexto |

Leia `docs/LICOES-v6.3.md` pra historia completa + classes de bug por categoria.

## Como usar (3 passos)

### 1. Copie pra raiz do novo projeto

```bash
PROJ=~/Desktop/MeuProjetoNovo
mkdir -p "$PROJ"
cp -r ~/Desktop/HarnessQwen-v6.5/.clinerules         "$PROJ"/
cp -r ~/Desktop/HarnessQwen-v6.5/.harness            "$PROJ"/
cp -r ~/Desktop/HarnessQwen-v6.5/docs                "$PROJ"/
cp -r ~/Desktop/HarnessQwen-v6.5/templates           "$PROJ"/
```

### 2. Preencha o que e do projeto

Veja `START-HERE.md` pro passo a passo detalhado. Resumo:

1. **`.clinerules/clinerules.md`** — preencher tokens + §8 invariantes do projeto
2. **`.clinerules/workflows/develop.md`** — preencher tokens
3. **`SPEC.md`** — escrever conforme `templates/SPEC-TEMPLATE.md`
4. **`.harness/sprints/00-index.json`** — listar todas as sprints
5. **`.harness/sprints/NN-<nome>.json`** — escrever cada sprint conforme `templates/SPRINT-TEMPLATE.md`
6. **`.harness/current.txt`** — escrever nome da primeira sprint (e.g. `00-bootstrap.json`)

### 3. Rode `/develop`

No Cline (com Yolo + Background Exec ON — veja `docs/CLINE-SETUP.md`), digite `/develop`. Workflow roda autopilot ate `.harness/current.txt == "DONE"`.

## Quando NAO usar este harness

- Projeto trivial (< 10 features) — overhead nao compensa
- Stack nao suportada por Qwen (Rust, Zig, idiomas exoticos)
- Dados ultra-sensiveis que nao podem nem rodar local (precisa de provider auditavel)
- Codigo critico de producao (auth, payment, infra) — pagar API premium e mais seguro

## Stack support

Funciona out-of-box com:
- ✅ TypeScript / JavaScript (Node.js, Electron, Vite, Next.js, Express, Fastify)
- ✅ Python (FastAPI, Django, scripts)
- ✅ Bun / Deno (com ajustes de comandos)
- ⚠️ Outros (Go, Rust, etc) — adapte os gates de typecheck/lint
