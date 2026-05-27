# START HERE — passo a passo para iniciar um novo projeto

> Tempo estimado: 30-90min de preparacao (depende da complexidade da SPEC) + ~2-3h de execucao do `/develop` para projeto de 60 features.

---

## Pre-requisitos

| Item | Versao minima | Como instalar |
|------|---------------|---------------|
| Node.js | 20+ | `nvm install 20` ou pacote do SO |
| Python | 3.11+ | pacote do SO (Ubuntu 24+ ja vem) |
| Cline (extensao VSCode) | mais recente | Extensions marketplace |
| LM Studio | mais recente | https://lmstudio.ai |
| Qwen 27B+ (modelo) | Q5_K_M ou maior | LM Studio model browser |
| GPU | 32GB VRAM recomendado | (RTX 4090/5090, A5000+) |

**Antes de comecar:** leia `docs/CLINE-SETUP.md` e aplique TODAS as configs obrigatorias do Cline (Background Exec, Yolo, timeout 30s, etc). Sem isso, o workflow trava.

---

## Passo 0: Copiar harness pro projeto novo

```bash
# Defina onde o projeto vai morar
PROJ=~/Desktop/MeuProjetoNovo

# Crie a pasta e copie o harness
mkdir -p "$PROJ"
cp -r ~/Desktop/HarnessQwen-v6.5/.clinerules         "$PROJ"/
cp -r ~/Desktop/HarnessQwen-v6.5/.harness            "$PROJ"/
cp -r ~/Desktop/HarnessQwen-v6.5/docs                "$PROJ"/
cp -r ~/Desktop/HarnessQwen-v6.5/templates           "$PROJ"/

cd "$PROJ"

# Crie .harness/current.txt (vazio por enquanto)
echo "" > .harness/current.txt

# Cria pasta tmp pro harness
mkdir -p /tmp/harness/
```

---

## Passo 1: Escrever a SPEC.md

A SPEC e a fonte de verdade. Tudo que o agent precisa pra implementar vem dela.

```bash
cp templates/SPEC-TEMPLATE.md SPEC.md
# edite SPEC.md no seu editor favorito
```

**O que DEVE estar na SPEC** (minimo):

1. **Resumo do produto:** problema, publico-alvo, pitch, stack, user stories
2. **Schema de dados** (se aplicavel): tabelas, colunas, indices, RLS
3. **Backend** (se aplicavel): endpoints, middlewares, integracoes externas
4. **Frontend** (se aplicavel): rotas, componentes, estados, tokens visuais
5. **Security:** auth flow, env vars, CSP, redaction de logs
6. **§1.5 Idioma/convencoes globais:** pt-BR ou en-US? Imports relativos vs alias? Caracteres proibidos (em-dash etc).
7. **§1.6 Diretorios sagrados:** o que NAO tocar (node_modules, .git, design lockado, .harness/sprints/00-index.json)
8. **§1.7 Cwd canonico:** raiz do repo. NUNCA `cd subdir/`.
9. **§3.7 Tipos compartilhados (TS):** lista canonica de tipos exportados de `shared/types.ts`. Front/back/main IMPORTAM destes. Proibido redeclarar.
10. **§3.8 Constantes cross-sprint:** valores usados em > 1 sprint, definidos UMA VEZ.

**O que NAO deve estar na SPEC:** instrucoes de como implementar feature por feature (isso vai nas sprints).

---

## Passo 2: Quebrar em sprints

```bash
# Para cada area funcional (auth, DB, integracao, UI, etc), crie uma sprint:
cp templates/SPRINT-TEMPLATE.md .harness/sprints/00-bootstrap.json
cp templates/SPRINT-TEMPLATE.md .harness/sprints/01-fundacao.json
cp templates/SPRINT-TEMPLATE.md .harness/sprints/02-db-layer.json
# ... etc
```

**Regra de ouro:** cada sprint tem 4-7 features. Cada feature toca 1-5 arquivos.

**Pattern recomendado de sprints:**

| Indice | Sprint | O que faz |
|--------|--------|-----------|
| 00 | bootstrap-dx | Configs IDE (.gitignore, .editorconfig, .vscode, prettier, eslint). SEM typecheck. |
| 01 | fundacao | `package.json` com TODAS as deps + `@types/*` upfront + tsconfigs + `shared/types.ts` canonico. Roda `npm install`. |
| 02 | db-layer | Schema, migrations, repositories (se aplicavel) |
| 03 | auth-backend | Login/logout, middleware authGuard, errorHandler. **Smoke incremental aqui** (anti-acumulo) |
| 04+ | integracoes/rotas/features | Conforme arquitetura |
| N-1 | smoke-fullstack | Typecheck + build + opcional boot test |
| **N** | **final-review** | **Sprint Review Final (template v6.5) — OBRIGATORIO** |

**Sprint Review Final (Ultima sprint):**

```bash
# Copie o template
NEXT_N=99  # ou qualquer que seja sua TOTAL_SPRINTS
cp .harness/sprints/REVIEW-TEMPLATE.json .harness/sprints/${NEXT_N}-final-review.json
# Edite o index dentro do JSON pra bater com NEXT_N
```

---

## Passo 3: Criar `00-index.json`

Lista TODAS as sprints na ordem de execucao.

```json
{
  "projectName": "<NOME-DO-PROJETO>",
  "specPath": "SPEC.md",
  "totalSprints": <N>,
  "schemaVersion": 3,
  "description": "<1-3 linhas resumo>",
  "sprints": [
    {
      "index": 0,
      "file": "00-bootstrap.json",
      "name": "Sprint 00 - ...",
      "status": "pending",
      "featuresCount": 4,
      "notes": "<opcional>"
    },
    ...
  ]
}
```

---

## Passo 4: Preencher tokens nos `.clinerules/`

Edite `.clinerules/clinerules.md` e `.clinerules/workflows/develop.md`:

1. Localize a tabela "Tokens"
2. Substitua cada `<TOKEN>` pelo valor real do projeto
3. **§8 do clinerules:** REESCREVA com os invariantes do SEU projeto (5-10 bullets)
4. Verifique nenhum placeholder sobrou:
   ```bash
   grep -nE '<[A-Z_]+>' .clinerules/clinerules.md .clinerules/workflows/develop.md
   # Deve retornar ZERO matches (ou apenas em codigo de exemplo dentro de ```)
   ```

---

## Passo 5: Setar `current.txt`

```bash
echo "00-bootstrap.json" > .harness/current.txt
```

---

## Passo 6: Validar estrutura ANTES de rodar

```bash
# Estrutura existe?
test -d .clinerules && test -d .harness/sprints && test -d .harness/scripts && test -f SPEC.md && echo "STRUCT OK"

# Sprints parseaveis?
python3 -c "
import json, os
for f in sorted(os.listdir('.harness/sprints')):
    if not f.endswith('.json'): continue
    try:
        data = json.load(open(f'.harness/sprints/{f}'))
        print(f'  {f}: idx={data.get(\"index\", \"?\")} features={len(data.get(\"features\", []))}')
    except Exception as e:
        print(f'  {f}: ERROR {e}')
"

# Scripts executaveis?
chmod +x .harness/scripts/*.sh .harness/scripts/*.py
ls .harness/scripts/ | wc -l  # deve ser 16

# Status geral
python3 .harness/scripts/sprint-status.py
```

---

## Passo 7: Rodar o `/develop`

No Cline:

1. Confirma configs (`docs/CLINE-SETUP.md`)
2. Confirma LM Studio rodando com modelo carregado
3. Digite `/develop`
4. Acompanhe pela UI do Cline (output de cada feature)

**Tempo estimado:** ~2-3h pra projeto de 60 features.

**Se travar:** veja `docs/LICOES-v6.3.md` → Classe G (context overflow) + Classe H (infra).

---

## Passo 8: Pos-DONE

Quando `current.txt == "DONE"`:

1. **Rode o `audit-final.py` manual:**
   ```bash
   python3 .harness/scripts/audit-final.py
   # Veja findings HIGH em /tmp/harness/audit-final.json
   ```
2. **Sprint Review Final** ja deve ter rodado (sprint N) e fechado HIGH=0.
3. **Validacao manual no browser** (se tem UI): `<RUN_CMD>` e olhe.
4. **Bugs visuais:** correcao manual ou nova sprint dedicada.

---

## Checklist pre-execucao final

- [ ] Cline em **Background Exec** mode (NAO VS Code Terminal)
- [ ] Cline Yolo Mode ON, Auto Compact ON, Double-Check ON
- [ ] Shell integration timeout = 30s
- [ ] LM Studio com modelo Qwen 27B+ carregado, context window >= 128k
- [ ] `nvidia-smi` mostra VRAM livre suficiente
- [ ] SPEC.md escrita com sections 1-9 minimas
- [ ] Sprints 00 a N-1 (implementacao) + N (Review Final) criadas
- [ ] `00-index.json` lista todas as sprints
- [ ] `current.txt` aponta pra primeira sprint
- [ ] `.clinerules/` com tokens preenchidos + §8 reescrita
- [ ] Zero placeholders `<...>` em `.clinerules/`
- [ ] `mkdir -p /tmp/harness/` ja foi feito
- [ ] Scripts `.harness/scripts/*` com `chmod +x`
