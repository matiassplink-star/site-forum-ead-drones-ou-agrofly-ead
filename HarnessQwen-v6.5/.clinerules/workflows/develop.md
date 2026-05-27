# /develop — Sprint autopilot v6.5 (Sprint Review Final + gates-em-scripts + Express patterns)

Workflow procedural de execução de sprints. **Arquitetura v6.1+**: o agente NÃO re-lê o sprint JSON inteiro a cada operação. Usa **helper scripts** em `.harness/scripts/`.

Regras invariantes (TS strict, escopo, lifecycle, Express patterns, factory functions, Sprint Review Final, etc) em `.clinerules/clinerules.md` (autoloaded).

## v6.5 — Mudancas vs v6.4

1. **Sprint Review Final OBRIGATORIA** ao fim do pipeline. Template em `.harness/sprints/REVIEW-TEMPLATE.json`. 5 features que consomem `audit-final.py` por categoria (CONSISTENCY, DEAD_CODE, SECURITY, ANTI_PATTERN, DUPLICATION+TODO). Causa raiz: LLM medio nao consegue revisar 60+ arquivos simultaneamente — revisao categorizada por classe permite revisao focada.
2. **Script `audit-final.py`** novo: scan abrangente (7 checks) que gera report categorizado em `/tmp/harness/audit-final.json`.
3. **Encerramento (DONE)** so e permitido se `audit-final.py` retornar zero findings HIGH.

## v6.4 — Mudancas vs v6.3

1. **Gates passam a ser SCRIPTS DEDICADOS** em vez de bash heredoc inline. Causa raiz v6.3: heredoc multi-line floodou contexto com `for>`, `for for>`, etc → trava 5h. Agora: `bash .harness/scripts/gate-X.sh <args>` retorna 1 linha.
2. **Novo gate `consistency`**: detecta uso cross-file inconsistente de simbolos (e.g. `authGuard` vs `authGuard()`). Causa raiz v6.3: 3 rotas Express travaram porque factory foi passada sem chamar.
3. **Novo gate `import-resolve`**: valida que cada `from '<path>'` aponta pra arquivo existente. Causa raiz v6.3: `'../../../shared/types'` errado em seed.ts.
4. **Novo gate `unused`**: roda tsc isolado por arquivo com `noUnusedLocals + noUnusedParameters`. Pega cedo, antes do typecheck final massivo.
5. **Express async handler**: regra explicita anti-async-naked (veja clinerules §24.b).

## v6.3 — Guardrails herdados (causa raiz: deadlock 5h + 50 erros TS escondidos)

1. **TODO comando externo tem `timeout N`.** Sem excecao. Default `timeout 90` para gates, `timeout 300` para `npm install`, `timeout 180` para `electron-rebuild`. Se estourar timeout, e ERRO — mata, reporta, max 3 retry.
2. **Gates grep usam `-q` (quiet).** NUNCA `grep "X" file` direto (dump as linhas matched no contexto). Sempre via scripts dedicados (v6.4).
3. **Output bruto de comando vai pra ARQUIVO,** nunca direto no chat. `cmd > /tmp/harness/<step>.log 2>&1` e ler `tail -20` do arquivo.
4. **Pre-flight typecheck no INICIO de cada sprint** (a partir da sprint 02). Aborta sprint se ja tem erro acumulado.
5. **`npm install` automatico apos cada sprint que mudou `package.json`.** Sem isso, imports falham e gate-typecheck dispara cascata.
6. **Context budget alarm.** Se `tokens_used / context_window > 0.85`, workflow pausa e pede /compact manual ANTES de gerar mais turno. Previne deadlock.
7. **`postInstall` gate**: features que tocam `package.json` ou rodam `electron-rebuild` declaram comando + timeout + expected exit code. Workflow executa como gate.

---

## Tokens deste projeto (PREENCHA)

> ⚠️ PREENCHA antes de rodar `/develop`. Veja tambem `.clinerules/clinerules.md` (tokens completos la).

| Token | Valor (PREENCHA) | Exemplo |
|-------|------------------|---------|
| `<PROJECT_NAME>` | `<NOME>` | `meu-app` |
| `<CWD_PATH>` | `<CAMINHO-ABSOLUTO>` | `/home/<user>/Desktop/MeuApp` |
| `<TYPECHECK_CMD>` | `<COMANDO>` | `npm run typecheck` |
| `<TYPECHECK_GREP>` | `grep -c "error TS"` | (TypeScript) |
| `<SHELL>` | `bash` | (Linux/Mac) |
| `<TMP_DIR>` | `/tmp/harness/` | (generico) |
| `<HARNESS_DIR>` | `.harness/` | (generico) |
| `<SPEC_PATH>` | `SPEC.md` | (generico) |
| `<TOTAL_SPRINTS>` | `<N>` | `12` (ate `<N-1>-nome-da-ultima-sprint`) |

Cwd canônico: raiz do repo (`<CWD_PATH>`).

---

## Helper scripts disponíveis (.harness/scripts/)

**Use SEMPRE estes scripts em vez de manipular JSON da sprint manualmente.** Cada um lê/escreve só o necessário. Reduz drasticamente leituras de contexto.

| Script | Uso | O que faz |
|--------|-----|-----------|
| `feat-context.py <sprint-file> [feat-id]` | **USAR ESTE — não outro.** Contexto COMPLETO de UMA feature em 1 comando. | Imprime: (1) info da feature (title/AC/hints/verification), (2) conteúdo da SPEC.md no range `specLines` exato, (3) conteúdo dos arquivos de `files[]` no range indicado. Substitui `read_file` em sprint JSON + SPEC + arquivos da feature. |
| `feat-info.py <sprint-file> [feat-id]` | Info SÓ da feature (sem SPEC nem arquivos) | Use só quando você JÁ TEM o contexto da SPEC fresco. Caso contrário, use `feat-context.py`. |
| `feat-status.py <sprint-file> <feat-id> <status>` | Mudar status de UMA feature | Atualiza status + startedAt/completedAt automaticamente. NÃO precisa re-ler o JSON. |
| `sprint-close.py <sprint-file> [proxima\|DONE]` | Fechar sprint | Marca sprint.status=done + atualiza 00-index.json + avança current.txt. 3 operações em 1 comando. |
| `sprint-status.py` | Status geral | Lista TODAS as sprints com done/total. Não argumento. |
| `gate-lifecycle.py <sprint-file>` | Gate lifecycle | Valida ≤1 in-progress + done tem completedAt. |
| `gate-anti-empty.py <sprint-file> <feat-id>` | Gate anti-esvaziamento | Valida campos do JSON não foram esvaziados. |
| `gate-paths.py <sprint-file> <feat-id>` | Gate path placement | Valida arquivos de `files[]` com `lines:"new"` existem. |
| `gate-idempotency.py` | Gate idempotência | Valida sprints anteriores fechadas individualmente. |
| `gate-sprint-closed.py <sprint-file>` | Gate fim de sprint | Valida 3 marcadores verdes pós-fechamento. |
| **`gate-positive.sh <sprint> <feat>` (v6.4)** | Gate grep positivo (OR cross-files) | Cada `grepMustMatch` deve estar em PELO MENOS UM dos `grepFiles`. Output 1 linha. |
| **`gate-negative.sh <sprint> <feat>` (v6.4)** | Gate grep negativo (NOT cross-files) | Nenhum `grepMustNotMatch` em nenhum dos `grepFiles`. Output 1 linha. |
| **`gate-unused.sh <file.ts> [...]` (v6.4)** | Gate unused imports/vars por arquivo | tsc --noUnusedLocals/Parameters isolado. Pega ANTES do tsc -b final. |
| **`gate-import-resolve.py <file>` (v6.4)** | Gate import resolver | Valida que cada `from '<path>'` resolve pra arquivo existente. |
| **`gate-consistency.py <dir> <sym> [...]` (v6.4)** | Gate consistency cross-file | Detecta uso inconsistente de simbolo (e.g. `authGuard` vs `authGuard()`). |
| **`audit-final.py [--root .]` (v6.5)** | Auditoria final pre-DONE | Scan abrangente (7 categorias). Gera report categorizado em `/tmp/harness/audit-final.json`. Consumido pela Sprint Review Final. |

**Importante:** quando precisar marcar feature como in-progress ou done, use `feat-status.py`. **NUNCA** faça `read_file` da sprint inteira + `write_to_file` da sprint inteira só pra mudar status. Esse é o anti-pattern v6 que estamos eliminando.

---

# /develop — Sprint autopilot

Executa TODAS as features de TODAS as sprints em sequência, sem pausar. Única saída voluntária: `.harness/current.txt == "DONE"`.

## Setup (1 vez por sessão)

### Setup 0: Pré-flight

```bash
mkdir -p /tmp/harness/
which node npm git python3 grep curl
node --version    # >= 20
test -d .harness/sprints && test -f .harness/current.txt && test -f SPEC.md && echo "HARNESS OK"
```

### Setup 1: Estado geral

```bash
python3 .harness/scripts/sprint-status.py
```

Output mostra current.txt + status de cada sprint. Identifica a sprint atual.

Se current.txt == `DONE`: pipeline concluído, vá pra Encerramento.

### Setup 2: Idempotência

```bash
python3 .harness/scripts/gate-idempotency.py
```

Se falhar (`SPRINTS INCOMPLETAS`): NÃO comece. Volte e feche a sprint anterior antes.

### Setup 3: Pre-flight typecheck (v6.3 — OBRIGATORIO a partir da Sprint 02, ANTES de qualquer feat)

```bash
timeout 90 npm run typecheck > /tmp/harness/typecheck_baseline.txt 2>&1
EXIT=$?
if [[ $EXIT -eq 127 ]]; then
  echo "FATAL: typecheck retornou 127 (tooling ausente). PARE."
  exit 1
fi
if [[ $EXIT -eq 124 ]]; then
  echo "FATAL: typecheck excedeu 90s. PARE."
  exit 1
fi
ERROR_COUNT=$(grep -c "error TS" /tmp/harness/typecheck_baseline.txt || echo 0)
echo "BASELINE_ERRORS=$ERROR_COUNT"
if [[ $ERROR_COUNT -gt 0 ]]; then
  echo "FATAL v6.3: $ERROR_COUNT erros TS herdados da sprint anterior. NAO comece nova sprint."
  echo "=== tail typecheck_baseline.txt ==="
  tail -30 /tmp/harness/typecheck_baseline.txt
  exit 1
fi
```

**Sprints 00 e 01 nao rodam Setup 3** (Sprint 01 feat-001 cria `package.json` + `npm install` inicial; nao ha node_modules ainda).

**A partir da sprint 02, BASELINE_ERRORS=0 e PRE-CONDICAO. Se != 0, PARE e reporte humano.**

### Setup 4: Anti-artefato

```bash
find . -maxdepth 2 -type f -size +1k -name '.[a-z]' -not -path '*/node_modules/*' -not -path '*/.git/*' 2>/dev/null
```

Retornou algo? Investigue (heredoc mal-formado de run anterior). Remova se for lixo.

---

## Loop de features

Para cada feature pending na sprint atual:

### A. Início — UM ÚNICO comando entrega TODO o contexto

**1. Pegue contexto COMPLETO da feature:**
```bash
python3 .harness/scripts/feat-context.py <sprint-atual>
```

Output deste comando contém:
- Info da feature (title, AC, hints, verification.grepMustMatch/NotMatch/smoke)
- **Conteúdo da SPEC.md no range `specLines` exato** — auto-extraído
- Conteúdo dos arquivos de `files[]` no range indicado (ou "novo" se não existe)

**É TUDO que você precisa pra implementar.** PROIBIDO ler SPEC.md fora deste range. PROIBIDO ler o sprint JSON inteiro.

**2. Marque in-progress:**
```bash
python3 .harness/scripts/feat-status.py <sprint-atual> <feat-id> in-progress
```

Saída: `OK feat-NNN -> in-progress`. Script atualiza startedAt automaticamente.

**Tudo que você precisa pra começar a implementação está no output do passo 1.** Pule direto pra implementação (passo B.5).

### B. Implementação

5. Implemente seguindo `acceptanceCriteria` + `hints`. Aplique as 22 regras do clinerules.

6. **Após cada `write_to_file`/`replace_in_file`:**

   - **Gate 1 (parseabilidade):** parser nativo do formato (`python3 -c "import json; json.load(...)"` para JSON, `npx tsc --noEmit <arquivo>` para TS, `node --check <arquivo>` para JS).
   - **Gate 1.5 (import resolution):** se TS, `npm run typecheck` ou `npx tsc --noEmit -p server/tsconfig.json` (escopo do workspace).
   - **Gate 1.6 (Unicode):** `grep -nP '[\x{2010}-\x{2015}\x{2018}-\x{201F}]' <arquivo>`. Match = em-dash proibido.
   - **Gate 1.7 (anti-debug):** `grep -E 'console\.(log|debug|trace)\(|gridHelper|debugger;' <arquivo>`. Match não justificado → remova.
   - **Gate 2 (bytes finais):** releia últimas 20 linhas. Arquivos > 50KB: `tail -c 200`. Truncado → `git checkout` e refaça.

7. **Após TODOS os writes da feature, valide paths:**
```bash
python3 .harness/scripts/gate-paths.py <sprint-atual> <feat-id>
```

### C. Gates mecanicos (v6.3 — todos com timeout + grep -q)

8. **Typecheck pos-implementacao (timeout 90s OBRIGATORIO):**
```bash
timeout 90 npm run typecheck > /tmp/harness/typecheck_current.txt 2>&1
EXIT=$?
if [[ $EXIT -eq 127 ]]; then echo "FATAL: 127 (tooling). PARE."; exit 1; fi
if [[ $EXIT -eq 124 ]]; then echo "FATAL: typecheck travou >90s. PARE."; exit 1; fi
NEW_ERRORS=$(grep -c "error TS" /tmp/harness/typecheck_current.txt || echo 0)
echo "NEW_ERRORS=$NEW_ERRORS (baseline=$ERROR_COUNT)"
```
**NEW_ERRORS deve ser <= BASELINE_ERRORS. Se > baseline, ERRO — corrigir antes de continuar.**

9. **Grep positivo (`verification.grepMustMatch`)** — script dedicado v6.4:

```bash
timeout 60 bash .harness/scripts/gate-positive.sh <sprint-atual> <feat-id>
```
Output: `GATE_POSITIVE=OK` OU `GATE_POSITIVE=FAIL` + lista de misses. Exit 0/1.

Semantica: cada pattern de `grepMustMatch` deve aparecer em PELO MENOS UM dos `grepFiles`. NAO precisa estar em todos.

10. **Grep negativo (`verification.grepMustNotMatch`)** — script dedicado v6.4:

```bash
timeout 60 bash .harness/scripts/gate-negative.sh <sprint-atual> <feat-id>
```
Output: `GATE_NEGATIVE=OK` OU `GATE_NEGATIVE=FAIL` + lista de hits proibidos. Exit 0/1.

Semantica: nenhum pattern de `grepMustNotMatch` pode aparecer em NENHUM dos `grepFiles`.

10.5. **Gate unused (v6.4)** — pega imports/vars unused CEDO, antes do tsc -b final:

```bash
timeout 60 bash .harness/scripts/gate-unused.sh <files-modificados-na-feature.ts>
```
Output: `GATE_UNUSED=OK` OU `GATE_UNUSED=FAIL` + erros TS6133/TS6196. Exit 0/1.

10.6. **Gate import-resolve (v6.4)** — valida que cada `from '...'` aponta pra arquivo existente:

```bash
timeout 30 python3 .harness/scripts/gate-import-resolve.py <files-modificados-na-feature>
```
Output: `GATE_IMPORT_RESOLVE=OK (N imports)` OU lista de imports unresolved. Exit 0/1.

10.7. **Gate consistency cross-file (v6.4)** — quando a feature TOCA simbolo usado em multiplos arquivos:

```bash
timeout 30 python3 .harness/scripts/gate-consistency.py <dir> <symbol1> [<symbol2> ...]
```
Exemplo: `python3 .harness/scripts/gate-consistency.py backend/routes authGuard validate`. Detecta uso inconsistente (chamado vs nao chamado, etc). Exit 0/1.

**Quando rodar consistency:** sempre que a feature criar OU modificar rotas Express, ou OUTRO simbolo de middleware/factory usado em multiplos arquivos.

### D. Gates dinamicos (v6.3 — postInstall + smoke, executados pelo workflow)

11a. **postInstall (NOVO v6.3)** — se `verification.postInstall` da feature presente:

```bash
PI_CMD="<verification.postInstall.command>"
PI_TIMEOUT_DEFAULT=300  # postInstall e tipicamente npm install / electron-rebuild
echo "=== POST-INSTALL ==="
echo "$PI_CMD"
bash -c "$PI_CMD" > /tmp/harness/postinstall.log 2>&1
PI_EXIT=$?
echo "POST_INSTALL_EXIT=$PI_EXIT (expected <verification.postInstall.expectExitCode>)"
echo "=== tail (last 20 lines) ==="
tail -20 /tmp/harness/postinstall.log
```

**Se PI_EXIT != expected, feature FALHA. Reportar e parar. Max 3 retry.**
**Output bruto NUNCA vai pro chat — so o tail -20.**

11b. **Smoke** — se `verification.smoke.executedBy: "workflow"`:

```bash
SMOKE_CMD="<verification.smoke.command>"
TIMEOUT="<verification.smoke.timeoutSeconds>"  # default 60
EXPECTED="<verification.smoke.expectExitCode>"

timeout ${TIMEOUT}s bash -c "$SMOKE_CMD" > /tmp/harness/smoke.log 2>&1
SMOKE_EXIT=$?

echo "=== SMOKE COMMAND ==="
echo "$SMOKE_CMD"
echo "=== SMOKE EXIT ==="
echo "$SMOKE_EXIT (expected $EXPECTED)"
echo "=== SMOKE OUTPUT (tail -20) ==="
tail -20 /tmp/harness/smoke.log
```

**Se SMOKE_EXIT != EXPECTED:**
- Feature NAO esta done. NAO marque done.
- Investigue, corrija, repita. Max 3 tentativas mesma causa.

**SE timeout (exit=124):** comando travou. NAO retry cego. Investigue se nao e deadlock do LM Studio.

### E. Self-review (clinerules regra 4)

12. Releia cada arquivo editado INTEIRO.

13. Para cada `acceptanceCriteria`, emita no chat:
```
Critério: "<texto>" | Evidência: <arquivo>:<linha>, <snippet>. Status: atendido.
```

14. Checklist (Sim/Não):
- Imports órfãos?
- Símbolo usado sem import?
- Mudou DB schema → migration nova?
- Mudou tipo compartilhado → consumidores OK?
- Tocou crossCutting → diff feito?
- Pkg externo → manifest atualizado?
- Property externa → nome verificado (regra 16)?
- Constante cross-sprint → importada (regra 17)?

15. Segundo typecheck: zero erro novo.

### F. Fechamento da feature

16. **Gate lifecycle:**
```bash
python3 .harness/scripts/gate-lifecycle.py <sprint-atual>
```

17. **Sleep 5s (anti-timestamp-colidido):**
```bash
sleep 5
```

18. **Marca done:**
```bash
python3 .harness/scripts/feat-status.py <sprint-atual> <feat-id> done
```
Script atualiza completedAt automaticamente.

19. **Gate anti-esvaziamento:**
```bash
python3 .harness/scripts/gate-anti-empty.py <sprint-atual> <feat-id>
```

20. **Atualiza baseline:**
```bash
cp /tmp/harness/typecheck_current.txt /tmp/harness/typecheck_baseline.txt
```

21. **Próxima feature na mesma sprint** — volte ao passo A.1. Use `feat-context.py <sprint>` sem feat-id para pegar contexto da próxima pending automaticamente.

### G. Se algo falhou

- Gate falhou: conserte, rode de novo. Max 3 tentativas mesma causa.
- Self-review apontou buraco: volte ao passo B.5. Max 3.
- Infra quebrada (typecheck 127, JSON corrompido, truncamento recorrente): PARE, reporte, aguarde humano.

---

## Fim de sprint

Quando todas features `done`:

**1. Feche a sprint:**
```bash
python3 .harness/scripts/sprint-close.py <sprint-fechando>
```

Script faz 3 coisas em 1: marca sprint.status=done + atualiza 00-index.json + avança current.txt (detecta próxima pending automaticamente).

**2. Valide os 3 marcadores:**
```bash
python3 .harness/scripts/gate-sprint-closed.py <sprint-fechando>
```

Output: `SPRINT FECHADA OK` + `current.txt agora: <proxima>`.

**3. Se current.txt agora != "DONE":** continue IMEDIATAMENTE no mesmo turno com a próxima sprint:
- `python3 .harness/scripts/feat-context.py <nova-sprint>` (pega contexto de feat-001 dela)
- Volte ao "Loop de features" passo A.2 (marcar in-progress)

**NUNCA** entre sprints:
- `<attempt_completion>` (encerra task)
- `<new_task>` (pede aprovação humana)
- `<ask_followup_question>` (para autopilot)
- Mensagem solo no chat sem ferramenta (fim de turno)

**4. Se current.txt == "DONE":** vá pra "Encerramento".

---

## Encerramento (current.txt == DONE)

**1. Audit Final (v6.5 — OBRIGATORIO antes de attempt_completion):**
```bash
timeout 120 python3 .harness/scripts/audit-final.py > /tmp/harness/audit-final.log 2>&1
AUDIT_EXIT=$?
echo "AUDIT_EXIT=$AUDIT_EXIT (0=OK, 1=WARN/FAIL, 2=erro config)"
echo "=== AUDIT SUMARIO ==="
tail -30 /tmp/harness/audit-final.log
```

**Regras:**
- Se `AUDIT_EXIT == 0`: zero findings HIGH/MED. Pode prosseguir.
- Se `AUDIT_EXIT == 1` E so tem findings LOW: documentar em release notes, prosseguir.
- Se `AUDIT_EXIT == 1` E tem HIGH/MED: **NAO marca DONE**. Volte pra Sprint Review Final ou abra uma sprint de correcao.

**2. Cleanup:**
```bash
rm -f /tmp/harness/typecheck_*.txt /tmp/harness/smoke*.txt /tmp/harness/preflight-*.txt
find . -maxdepth 2 -type f -size +1k -name '.[a-z]' -not -path '*/node_modules/*' -not -path '*/.git/*'
```

**3. Sumário no chat (enxuto):**
- Sprints concluídas: N/N (incluindo Sprint Review Final)
- Features concluídas: K
- Smoke gates passados: M/M
- Audit findings: HIGH=0 MED=X LOW=Y

**4. AGORA SIM emita `<attempt_completion>` com o sumário.** Único momento permitido.

---

## Regras do autopilot

- Zero confirmação intermediária entre features ou sprints.
- Output entre features: MÍNIMO. Cabeçalho "feat-NNN iniciando" + self-review + cabeçalho "feat-NNN done".
- Não resuma progresso a cada sprint. Só no Encerramento.
- Não refatore fora do escopo. Se necessário, registre 1 linha ("refactor mínimo em X por razão Y") e siga.
- Não abra próxima sprint sem 3 marcadores verdes (`gate-sprint-closed.py`).

---

## Anti-patterns (NÃO repetir)

### Re-ler sprint JSON inteiro pra mudar status (anti-pattern v6.0)
**Sintoma:** modelo faz `read_file <sprint>.json` + `write_to_file <sprint>.json` só pra alterar `status: pending → in-progress`.

**Fix v6.1:** use `feat-status.py`. 1 comando vs 2 operações grandes de I/O.

### Smoke marcado done sem rodar (auto-mentira)
**Fix:** smoke com `executedBy: "workflow"` é executado pelo workflow (passo D.11), não pelo modelo.

### Auto-condense desincroniza JSON
**Fix:** Setup 2 (`gate-idempotency.py`) detecta antes de iniciar nova sprint.

### `tsc: not found` interpretado como sucesso
**Fix:** Setup 3 e passo C.8 abortam em exit 127.

### Artefato `.h` na raiz (heredoc mal-formado)
**Fix:** Setup 4 detecta. NUNCA fazer redirect `> .x` quando você quer um arquivo de script.

### Mensagem solo no chat entre sprints
**Fix:** entre fechar sprint e abrir próxima, o ÚNICO output no chat é a chamada do próximo script (`feat-context.py`). Sem despedidas.
