# Cline Rules — instancia v6.5

Regras carregadas todo turno pelo Cline. INVARIANTES. As regras 1-25 sao GENERICAS (vale qualquer projeto). A secao 8 ("Invariantes do projeto") e o UNICO bloco especifico do projeto — preenchido com poucos bullets nao-duplicados da SPEC.

**Changelog:**
- **v6.5** (template review): adicionada §25 (Sprint Review Final obrigatoria). Script `audit-final.py` faz scan categorizado (7 classes: CONSISTENCY/DEAD_CODE/SECURITY/ANTI_PATTERN/DUPLICATION/TODO). Template `.harness/sprints/REVIEW-TEMPLATE.json` com 5 features de revisao. Roda APOS sprints de implementacao, ANTES do DONE. Compensa limitacao cognitiva de LLM medio que nao consegue revisar 60+ arquivos simultaneamente.
- **v6.4** (post-Jarvis2): adicionada §24 (patterns Express + factory functions) + §23.g (gates como scripts em arquivo). 5 scripts novos em `.harness/scripts/`: gate-positive.sh, gate-negative.sh, gate-consistency.py, gate-import-resolve.py, gate-unused.sh. Veja `docs/LICOES-v6.3.md` para lista completa de bugs e fixes.
- **v6.3** (Jarvis2): pre-flight typecheck por sprint, postInstall gate, timeouts obrigatorios, context budget alarm, smoke movido pra sprint 03.
- **v6.2** (Chess): helper scripts em `.harness/scripts/`, AC localizados por feature, smoke executedBy:workflow.

Procedimentos operacionais (sprints, harness) moram em `.clinerules/workflows/develop.md` (mesma estrutura, instancia do WORKFLOW-TEMPLATE).

---

## Tokens preenchidos (substitui placeholders globais)

> ⚠️ **PREENCHA ESTE BLOCO ANTES DE RODAR `/develop` NO PROJETO NOVO.**
> Cada token vira valor REAL deste projeto especifico.

Em todo o restante deste documento, o token entre `<>` significa o valor real abaixo:

| Token | Valor real (PREENCHA) | Exemplo |
|-------|----------------------|---------|
| `<PROJECT_NAME>` | `<NOME-DO-PROJETO>` | `meu-app` |
| `<CWD_PATH>` | `<CAMINHO-ABSOLUTO-DA-RAIZ-DO-REPO>` | `/home/<user>/Desktop/MeuApp/` |
| `<TYPECHECK_CMD>` | `<COMANDO-DE-TYPECHECK>` | `npm run typecheck` ou `pnpm typecheck` ou `bun run typecheck` |
| `<TYPECHECK_NOTE>` | `<NOTAS-SOBRE-TYPECHECK-DESTE-PROJETO>` | Ex: "monorepo com 3 tsconfigs; `tsc -b` encadeia todos via project references" |
| `<TYPECHECK_GREP>` | `grep -c "error TS"` | (TypeScript) |
| `<DB_FILE_PATH>` | `<PATH-DO-DB-OU-OMITIR>` | `backend/db/client.ts` se usa SQLite; OMITIR se nao tem DB |
| `<TYPES_DIR>` | `<PATH-DOS-TIPOS-CANONICOS>` | `shared/types.ts` (fonte canonica importada por front+back) |
| `<SHELL>` | `bash` (zsh compativel) | (Linux/Mac) |
| `<TMP_DIR>` | `/tmp/harness/` | (deixe assim — generico) |
| `<HARNESS_DIR>` | `.harness/` | (deixe assim — generico) |
| `<SPEC_PATH>` | `SPEC.md` | (deixe assim) |
| `<RUN_CMD>` | `<COMANDO-PRA-RODAR-O-APP>` | `npm run dev` |
| `<DESIGN_DIR>` | `design/` ou OMITIR | OMITIR se nao tem design lockado |
| `<TOTAL_SPRINTS>` | `<N>` (numero total de sprints) | `12` |

**Apos preencher:** verifique que nao sobrou placeholder `<...>` no resto do documento (busca: `grep -n '<[A-Z_]*>'  .clinerules/clinerules.md`).

---

## Helper scripts em .harness/scripts/ (v6.1 — USE SEMPRE)

Em vez de re-ler o sprint JSON inteiro a cada operacao (anti-pattern v6.0, desperdicio de contexto), use os scripts:

| Script | Quando usar |
|--------|-------------|
| `feat-context.py <sprint> [feat-id]` | **PRIMEIRO comando ao iniciar feature.** Imprime contexto COMPLETO: info da feature + SPEC.md no range exato + conteudo dos arquivos. Substitui `read_file` em sprint JSON + SPEC + arquivos. |
| `feat-info.py <sprint> [feat-id]` | Info SO da feature, sem SPEC. Use so quando ja tem contexto recente. |
| `feat-status.py <sprint> <feat-id> <status>` | Marcar feature in-progress ou done. Atualiza timestamps automaticamente. NAO use `write_to_file` no sprint JSON pra isso. |
| `sprint-close.py <sprint>` | Fechar sprint (3 operacoes em 1: marca done, atualiza index, avanca current.txt). |
| `sprint-status.py` | Ver status geral de todas sprints. |
| `gate-lifecycle.py <sprint>` | Valida ≤1 in-progress + done tem completedAt. |
| `gate-anti-empty.py <sprint> <feat-id>` | Valida campos do JSON nao foram esvaziados. |
| `gate-paths.py <sprint> <feat-id>` | Valida arquivos de `files[]` com `lines:"new"` existem. |
| `gate-idempotency.py` | Valida sprints anteriores fechadas. |
| `gate-sprint-closed.py <sprint>` | Valida 3 marcadores verdes pos-fechamento. |

Detalhes em `.clinerules/workflows/develop.md`. **Regra dura:** se voce ESTA tentando fazer `read_file <sprint>.json` + `write_to_file <sprint>.json` so pra mudar status/timestamp, voce esta no anti-pattern. Use `feat-status.py`.

---

## 0. Pre-flight (rode UMA vez no inicio da sessao)

ANTES de qualquer feature, valide que as ferramentas que o workflow vai usar
existem no PATH (Linux / zsh / bash — UNICO shell suportado neste projeto):

```bash
which pnpm uv node python3 git grep curl
node --version    # >= 20
python3 --version # >= 3.11
```

Se algum comando esperado retornar vazio/erro: **PARE e reporte ao humano**.
Nao prossiga "esperando dar certo". Comando ausente vira exit 127 silencioso
em runtime e voce marca features como done sem ter rodado nada.

**Comando `python` (sem o 3) NAO EXISTE neste sistema (Ubuntu 24+).** SEMPRE
use `python3`. Mesmo dentro de heredocs e scripts inline.

Tambem valide que o(s) comando(s) de typecheck retornam output esperado (nao
zero bytes silencioso) rodando uma vez sem editar nada.

## 0a. Bootstrap framework-specific

Alguns frameworks requerem arquivos GERADOS antes de typecheck/build funcionar.
Se nao existirem, o tsc/mypy reporta erros falsos cascade que parecem do seu
codigo mas sao do framework nao-bootstrapado.

Se o projeto usa um destes, garanta que o arquivo existe ANTES de marcar feat-001
como done:

| Framework | Arquivo | Como gerar |
|-----------|---------|-----------|
| Next.js | `next-env.d.ts` na raiz do app | `npx next build` ou criar manual com `/// <reference types="next" />\n/// <reference types="next/image-types/global" />` |
| Vite + TS | `vite-env.d.ts` em `src/` | Geralmente Vite gera no scaffold; se faltar, criar com `/// <reference types="vite/client" />` |
| Astro | `.astro/types.d.ts` | `astro sync` |
| SvelteKit | `.svelte-kit/` | `svelte-kit sync` |
| Remix | `remix.env.d.ts` | Geralmente do scaffold |

Veja `templates/stack-quirks.md` (se existir) pra lista mais completa.

## 0a-bis. Path placement gate (anti-pasta-no-lugar-errado)

**REGRA DURA:** caminhos em `files[]` de cada feature sao SEMPRE relativos a
raiz do projeto. NUNCA corte prefixos. NUNCA use `cd <subdir>` antes de criar
arquivos da feature — sempre passe o path completo da raiz para o
`write_to_file`.

Falha tipica: `files[]` lista `<modulo>/<sub>/__init__.py`, agente faz `cd
<modulo>` e cria com path `<sub>/__init__.py`. Se o cwd era a raiz (esqueceu
o cd) ou o cwd ja era outro, o arquivo termina no lugar errado.

Forma segura: passe o path COMPLETO ao tool de escrita, ex.
`<modulo>/<sub>/__init__.py`. Mantenha o cwd na raiz do projeto.

**Gate mecanico (execute apos terminar a implementacao da feature, antes de
qualquer marcacao de done):**

```bash
python3 -c "
import json, os
SPRINT='<arquivo-da-sprint-em-.harness/sprints/>'
FEAT='<feat-NNN>'
d = json.load(open(f'.harness/sprints/{SPRINT}'))
feat = next(f for f in d['features'] if f['id']==FEAT)
missing = [x['file'] for x in feat['files'] if x.get('lines')=='new' and not os.path.exists(x['file'])]
assert not missing, f'ARQUIVOS FALTANDO: {missing}'
print('PATHS OK')
"
```

Se retornar `ARQUIVOS FALTANDO: [...]`, voce criou no lugar errado. Procure
onde criou (`find . -name "<basename>"`) e mova com `mv`, NAO apague e recrie.

## 0b. Post-write parseability gate (anti-truncamento forte)

Modelos pequenos truncam arquivos grandes durante `write_to_file` quando o stream do LLM e cortado. A regra 3 ja manda "ler ultimas 20 linhas", mas modelo pequeno nao julga coerencia confiavelmente. **Solucao: rode o parser nativo da linguagem como gate mecanico.** Parsers nao mentem.

**Apos cada `write_to_file` ou `replace_in_file`, rode o parser correspondente ao formato do arquivo.** Exit code != 0 ou exception = arquivo corrompido/truncado. Reverta com `git checkout <arquivo>` e refaca.

Tabela de comandos por extensao (use o que se aplica ao arquivo editado):

| Extensao | Comando de parse |
|---|---|
| `.json` | `python3 -c "import json; json.load(open(r'<arquivo>'))"` |
| `.jsonc` / `.json5` | `python3 -c "import json5; json5.load(open(r'<arquivo>'))"` (ou validar como json se nao tem comentario) |
| `.yaml` / `.yml` | `python3 -c "import yaml; yaml.safe_load(open(r'<arquivo>'))"` |
| `.toml` | `python3 -c "import tomllib; tomllib.load(open(r'<arquivo>','rb'))"` (Python 3.11+) |
| `.py` | `python3 -m py_compile <arquivo>` |
| `.ts` / `.tsx` | `npx tsc --noEmit --jsx preserve --module esnext --target esnext <arquivo>` (sintatico rapido) |
| `.js` / `.mjs` / `.cjs` | `node --check <arquivo>` |
| `.html` | (sem parser de stdlib; pular ou usar `tidy -e`) |
| `.md` / `.txt` | (sem parser; pular) |

Para JSONs do harness (sprints, index, project-config), o parse e **obrigatorio**: arquivo invalido bloqueia o proximo turno do agente.

Para JSON de configs do projeto (`package.json`, `tsconfig.json`, `pyproject.toml`), idem.

**Padrao de uso por turno (bash/zsh, Linux):**

```bash
python3 -c "import json; json.load(open('$FILE'))" || { echo "PARSE FAIL"; exit 1; }
```

Se o parse falha:
1. **Nao reescreva por cima.** Pode estar com 11119 bytes de 12500 esperados; escrever de novo pode truncar de novo.
2. `git checkout <arquivo>` (reverte para o ultimo commit)
3. Reescreva. Se truncar de novo, troque para `replace_in_file` cirurgico, ou divida em duas writes menores.
4. Se truncar 2x seguidas no mesmo arquivo: PARE e reporte.

## 0c. Post-write import-resolution gate (linguagens tipadas)

**Parseability so checa SINTAXE.** Imports quebrados, nomes nao definidos,
modulos nao instalados, ou falhas de pacote (faltando `__init__.py`) PASSAM no
parseability gate. Resultado: agente entrega N arquivos com import quebrado e
so descobre no fim quando roda type-check do projeto inteiro.

**Apos cada `write_to_file` em arquivo de linguagem tipada (Python, TS, etc.),
rode o type-checker do stack** — restrito ao arquivo editado quando possivel,
ou ao projeto inteiro como fallback:

| Linguagem | Comando arquivo-only (preferido) | Fallback |
|---|---|---|
| Python | `<TYPECHECK_CMD> --follow-imports=silent <arquivo>` | `<TYPECHECK_CMD>` projeto inteiro |
| TS / TSX | `<TYPECHECK_CMD>` (TS exige tsconfig — geralmente projeto inteiro) | idem |

Substitua `<TYPECHECK_CMD>` pelo comando documentado no `develop.md` do projeto.

Exit != 0 = imports nao resolvem OU tipos basicos quebrados. Investigar nesta
ordem:
1. O modulo importado existe (arquivo ou pacote)?
2. Se for pacote: existe `__init__.py` em todos os niveis ate o modulo?
3. O nome importado realmente e exportado?
4. A dependencia esta declarada no manifest (regra 12)?

**NAO** mascare adicionando `# type: ignore` ou `// @ts-ignore` para silenciar
— corrija a causa raiz.

## 0d. Post-write Unicode gate (anti em-dash e smart quotes)

A regra 8 (invariantes do projeto) tipicamente proibe em-dash `—` e smart
quotes em texto. Mas SPECs e documentos copiados ao codigo frequentemente tem
esses caracteres. Modelo pequeno copia literal e introduz silenciosamente.

**Apos cada `write_to_file`, rode:**

```bash
grep -nP '[\x{2010}-\x{2015}\x{2018}-\x{201F}]' <arquivo> && {
  echo "PROIBIDO: en-dash, em-dash, smart quote ou afim em <arquivo>"
  exit 1
} || echo "UNICODE OK"
```

Se aparecer hit: subistitua os caracteres por hifen `-` e aspas retas `"` e
`'`. Sem excecao para "copia literal de SPEC".

Pular esta regra se o invariante 8 do seu projeto explicitamente permite
em-dash.

## 1. TypeScript / Tipos

- Zero erro novo. Arquivos que voce tocou saem com zero erro em
  `<TYPECHECK_CMD>`. "Pre-existente no arquivo" nao e desculpa se voce editou.
- IMPORTANTE: confirme que `<TYPECHECK_CMD>` realmente checa o que voce editou.
  Em projetos com `tsconfig` raiz usando project references e `files: []`,
  rodar `tsc --noEmit` na raiz processa ZERO arquivos e da exit 0 falso. Se for
  o caso, `<TYPECHECK_CMD>` deve ser ajustado pra rodar todos os subprojetos.
  `<TYPECHECK_NOTE>`
- **Validacao de exit code obrigatoria** (bash/zsh — UNICO shell suportado):
  ```bash
  <TYPECHECK_CMD> > /tmp/harness/check.txt 2>&1; echo "Exit: $?"
  ```
  Se exit != 0 mas o arquivo de output esta VAZIO: o comando nao rodou
  (provavelmente command-not-found, exit 127). Pare e reporte. **NUNCA interprete "sem output" como "sem erros" sem checar o exit code.**
- Proibido: `// @ts-ignore`, `// @ts-expect-error`, `// @ts-nocheck`, `as any`,
  `as unknown as X` para silenciar, `any` novo (implicito ou explicito), `!`
  non-null novo que silencia erro, `declare` para fingir simbolo.
- Se precisar suprimir, voce nao resolveu. Resolva.

## 2. Sem placeholder no codigo

- Proibido nos arquivos editados:
  - `TODO(Sprint`, `TODO:` sem owner ou link, `// implementar depois`
  - `throw new Error('not implemented')`
  - Stub vazio retornando `undefined`
  - Strings "por enquanto", "sera implementado depois", "placeholder"
  - Comentarios `// FIXME` sem link pra issue
- Se nao sabe implementar, nao entregue. Pare e reporte no chat.

## 2a. Proibido esvaziar campos de feature/sprint JSON

Quando voce edita JSON de sprint pra atualizar `status`/`startedAt`/
`completedAt`, voce DEVE preservar todos os outros campos da feature como
estavam.

**Especificamente PROIBIDO:**
- Apagar items de `acceptanceCriteria[]` ou deixar a lista vazia (`[]`)
- Apagar items de `hints[]`
- Apagar items de `files[]`
- Reduzir `description` pra string trivial tipo "Endpoints de threads."
- Apagar items de `verification.grepMustMatch[]` ou `verification.grepFiles[]`

**Por que isso importa:** a regra 4 (self-review) manda emitir evidencia POR
CRITERIO. Se voce esvazia a lista, nao tem o que evidenciar e voce escapa do
gate sem fazer o trabalho. Esse e um atalho conhecido. Esta proibido.

Se voce esta editando o JSON e percebeu que vai fazer write_to_file inteiro,
SEMPRE re-leia o arquivo completo antes da escrita e copie ipsis litteris
todos os campos que NAO precisam mudar. So toque em `status`, `startedAt`,
`completedAt`. Mais nada.

## 3. Integridade pos-edicao (anti-truncamento)

Sintoma comum: `write_to_file` em arquivo grande, o stream do LLM e cortado, o
arquivo fica truncado no meio de uma string ou expressao. O agente pensa que
escreveu tudo.

Regra:

1. Apos cada `write_to_file` ou `replace_in_file`, releia as ULTIMAS 20 linhas
   do arquivo editado.
2. Confirme:
   - Ultimo caractere coerente (`}`, `;`, `)`, ou newline final esperado pro
     formato do arquivo)
   - Nenhuma string/identificador cortado no meio (sem caracteres orfaos como
     `fs.r` ou `import { Foo` sem fechamento)
3. Para arquivos > 50KB: rode tambem o equivalente a `tail -c 200 <arquivo>`
   pra confirmar bytes finais. Cache do editor pode mascarar o estado real.
4. Se detectar truncamento: `git checkout <arquivo>` e refaca a edicao.
5. Se o mesmo arquivo truncar duas vezes seguidas: PARE e reporte. Pode ser
   bug de escrita, contexto estourado, ou stream interrompido.

## 3a. Escolha entre write_to_file e replace_in_file

**Para sprint JSONs (v6.1 — NOVA REGRA):** NUNCA faca `read_file` + `write_to_file` do sprint inteiro pra mudar status/timestamp. Use SEMPRE os helper scripts em `.harness/scripts/`:

- `python3 .harness/scripts/feat-status.py <sprint> <feat-id> <status>` — atualiza status + timestamp.
- `python3 .harness/scripts/sprint-close.py <sprint>` — fecha sprint + atualiza index + avanca current.txt.

Scripts evitam que voce releia/regerere o JSON inteiro a cada operacao (anti-pattern v6.0 — desperdicio de contexto + risco de transcricao errada de campos). Veja tambem `feat-info.py` para ler APENAS a feature atual sem precisar abrir o JSON da sprint.

**Para outros arquivos:**

- Para mudancas PONTUAIS em JSON pequeno NAO-sprint (configs do projeto como `package.json`, `tsconfig.json`) (<500 linhas): `write_to_file` com o arquivo inteiro reescrito. Releia, troque os campos, escreva de volta.
- Para edicoes em codigo > 500 linhas: `replace_in_file` e preferido.
- Para arquivos > 50KB (~1500+ linhas): NAO use `write_to_file`. Stream tende a truncar. Use `replace_in_file` cirurgico.
- Se o primeiro `replace_in_file` falhar (diff rejeitado), NAO tente o mesmo diff. Releia e use `write_to_file` (se pequeno) ou re-formule.
- Regra dura: se a mesma edicao falhar 2x com `replace_in_file`, pare e reporte.

## 4. Self-review obrigatoria antes de marcar done

Apos passar gates mecanicos (typecheck + grep), ANTES de marcar status como
`done` em qualquer feature:

1. Releia INTEIRO cada arquivo editado. Sem range.
2. Para cada item em `acceptanceCriteria` da feature, emita no chat uma linha:
   `Criterio: "<texto>" | Evidencia: <arquivo>:<linha>, <snippet>. Status: atendido.`
   Se nao consegue citar arquivo e linha concretos, o criterio NAO esta
   atendido. Volte e implemente.
3. Checklist de consistencia (Sim/Nao no chat):
   - Imports orfaos (simbolo importado sem uso)?
   - Simbolo usado sem import?
   - Se mudou DB schema em `<DB_FILE_PATH>`: migration nova foi criada (proximo
     numero) E adicionada ao array de migrations?
   - Se mudou interface em `<TYPES_DIR>`: consumidores ainda tipam sem erro?
   - Se mudou contrato cross-camada (IPC, REST, eventos): handler + caller
     foram atualizados em SINCRONIA? (Caso contrario o campo novo e
     silenciosamente perdido em runtime.)
4. Diff review: rode equivalente a `git diff --stat` e `git diff -- <arquivo>`.
   A mudanca e o minimo necessario? Sem ruido de formatacao, sem CRLF flip
   global, sem reordenacao gratuita? Se tem ruido: `git checkout` e refaca.
5. Segundo typecheck: `<TYPECHECK_CMD>` confirmando zero erro novo em arquivo
   do diff.

So depois de tudo isso: `status: "done"`, `completedAt: "<ISO8601>"`.

Sem contador de tentativas. Voce sempre entrega. Se a self-review falha,
conserte e rode de novo.

## 5. Honestidade

- Nao marque `done` sem self-review completa no chat, com evidencia citada por
  criterio.
- Nao invente linhas, simbolos, APIs. Se citou linha N, confirme abrindo o
  arquivo.
- Nao alegue "typecheck passou" sem ter rodado. Reporte exit code ou cole o
  head do output.
- Nao reuse evidencia ("igual ao criterio anterior"). Cada criterio tem
  evidencia propria.

## 6. Ambiente / Shell

**Shell: bash (zsh-compativel) em Linux.** UNICO shell suportado neste projeto. NAO use cmd.exe, PowerShell, fish ou outros — comandos abaixo presumem bash/zsh.

**Cwd canonico: raiz do repo** (`/home/breno-lionlab/Desktop/Jarviss`). NUNCA `cd subdir/`. Use `npm -w <workspace> run <script>` da raiz.

**Comandos padrao** (memorize estes — sao TODOS os que voce precisa):

| Acao | Comando |
|------|---------|
| Buscar literal | `grep -F "<texto>" <arquivo>` |
| Buscar regex | `grep -E "<regex>" <arquivo>` |
| Buscar regex Perl (Unicode) | `grep -P "<regex>" <arquivo>` |
| Contar matches | `grep -c -F "<texto>" <arquivo>` |
| Buscar recursivo (sem node_modules) | `grep -rn "<texto>" <dir> --include="*.ts" --exclude-dir=node_modules` |
| Ler arquivo | `cat <arquivo>` / `head -n N <arquivo>` / `tail -n N <arquivo>` |
| Achar arquivo | `find . -name "<nome>" -not -path "*/node_modules/*"` |
| Deletar | `rm <arquivo>` / `rm -rf <dir>` |
| Copiar | `cp <origem> <destino>` |
| Redirect com stderr | `<cmd> > <arquivo> 2>&1` |
| Capturar exit code | `<cmd>; echo "Exit: $?"` |
| Paths | sempre forward slash `/` |
| Python | sempre `python3` (NAO `python`) |

**Git:** `git diff`, `git diff --stat`, `git diff -- <arquivo>`, `git checkout <arquivo>`, `git status`, `git log --oneline`.

**Node:** `npx <comando>`, `node <script>`, `npm run <script>`, `npm -w <workspace> run <script>`.

NAO use comandos com sintaxe Windows: `where`, `findstr`, `type`, `del`, `copy /Y`, `%errorlevel%`, `2>nul`. Nao funcionam.

## 7. Escopo (critico para economia de contexto)

- Toque APENAS em arquivos listados em `files[]` da feature atual. Se descobrir
  que precisa tocar mais, PARE, reporte e aguarde decisao do humano.
- Leia `specLines` EXATAMENTE. Se o JSON diz `"17-53"`, leia apenas as linhas
  17 ate 53. NAO leia a SPEC inteira. NAO leia "17-1016" ou range maior.
- Leia o range `lines` de cada arquivo EXATAMENTE. Se diz `"1-200"`, nao leia
  "1-327". Excecao unica: na self-review (passo 1 da regra 4), leitura
  integral e obrigatoria.
- Quebrar esses ranges estoura o contexto e trava a sprint. Respeite.
- Nao abra sprint diferente da apontada por `.harness/current.txt`.
- Nao modifique arquivos legacy ou de auditoria (registrar quais sao no
  proprio clinerules quando for o caso).

## 8. Invariantes do projeto (PREENCHA — mini-instancia)

> ⚠️ **REESCREVA ESTA SECAO INTEIRA pro novo projeto.**
> Esta e a UNICA secao especifica do projeto. Resto do doc e generico.

**Princípio:** Maior parte das invariantes do projeto deve estar na SPEC (idioma, stack, schemas DB, endpoints, error codes, auth flow, security). Para evitar duplicacao (e drift entre clinerules e SPEC), aqui ficam APENAS os invariantes operacionais que VOCE quer no contexto a CADA turno do Cline.

**Exemplo (substitua pelos do seu projeto):**

1. **Cwd canonico:** raiz do repo (`<PROJECT_NAME>/`). NUNCA `cd <subdir>/`. Use `<RUN_CMD>` da raiz.

2. **[Exemplo se tem design lockado]** Design lock e NORMATIVO. A pasta `<DESIGN_DIR>` contem artifact + contract + brief. Renderer DEVE seguir tokens e componentes do contract. PROIBIDO inventar tela/componente fora.

3. **[Exemplo se Electron]** Electron security defaults sao DUROS. Toda BrowserWindow: `contextIsolation: true`, `nodeIntegration: false`, `sandbox: true`. APIs expostas APENAS via `contextBridge`.

4. **[Exemplo se backend local]** Sidecar bind 127.0.0.1 APENAS. NUNCA `0.0.0.0`. Porta aleatoria injetada via contextBridge/env.

5. **API keys APENAS de process.env.** ZERO literal de chave no codigo. Redaction obrigatoria em logs.

6. **Tipos de contrato em arquivo unico canonico (e.g. `<TYPES_DIR>`).** Frontend/backend/main process IMPORTAM destes tipos. PROIBIDO redeclarar.

7. **Demais invariantes:** consulte `<SPEC_PATH>` (fonte canonica).

---

**Apague esses exemplos e escreva os do seu projeto. Mantenha entre 5-10 bullets — alem disso vira ruido.**

## 9. Autopilot / Workflow

Quando estiver rodando um workflow procedural (ex: `/develop`):

- Nao peca confirmacao entre features ou sprints. Prossiga.
- Nao pergunte "devo prosseguir?". Prossiga.
- **NUNCA pause para validacao visual / manual / "abre o browser e me diz se isso esta legal".** Bugs visuais sao tratados pelo humano APOS a ULTIMA sprint fechar. Gates mecanicos (typecheck + parseable + grepMustMatch + smoke executedBy:workflow) sao a UNICA fonte de PASS/FAIL.
- Se uma sprint mencionar componentes visuais, design tokens ou animacoes: implemente conforme AC e siga em frente. Se gates passam, marca done.
- Unica parada voluntaria: `current.txt == "DONE"` (todas as sprints terminaram).
- Paradas nao-voluntarias permitidas:
  - Erro de infraestrutura (typecheck nao executa, JSON corrompido, arquivo
    faltando, truncamento recorrente)
  - Mesma feature falhar gates 3x seguidas
  - Feature precisa tocar arquivo fora do `files[]` declarado

Em qualquer parada nao-voluntaria, reporte estado completo no chat e aguarde
humano.

## 10. Single source of truth para contratos cross-cutting

Um **contrato cross-cutting** e qualquer estrutura que precisa ser identica em mais de um lugar do codigo: schemas de eventos, formato de mensagens entre processos, tipos compartilhados back/front, payloads REST, formato de envelope de IPC, enum de status, etc.

**Regra dura: cada contrato cross-cutting tem UMA, e apenas UMA, fonte canonica.** Os outros lugares ou (a) IMPORTAM dessa fonte, ou (b) referenciam ela por anchor (`ver SPEC §3.5`) e nao redeclaram nada.

**PROIBIDO:** redeclarar (mesmo simplificado, mesmo "para referencia rapida") nomes, enums, ou campos de um contrato em mais de um arquivo. Toda vez que voce escrever uma lista de strings que ja existe em outro lugar com qualquer outro nome, voce esta criando o cenario classico de drift.

Exemplos de drift que ja aconteceu:
- 10 nomes de eventos numa lista em `clinerules.md` + 10 nomes em `SPEC.md`. Backend leu spec, frontend leu clinerules. 7 dos 10 ficaram com nomes diferentes silenciosamente.
- 8 status de pedido enumerados em `STATUSES.md` e tambem hardcoded em `useStore.ts` e em `models/Order.py`. Mudaram um, esqueceram dois.
- Schema de payload IPC tipado em 3 lugares (handler, preload, caller). Adicionaram campo num so. Outros dois ignoraram em runtime.

**Como evitar:**

1. Quando ler a SPEC, **note os contratos cross-cutting**. Tipicos: schemas de eventos/mensagens, enums de estado, payloads de chamadas entre camadas.
2. Para cada um, identifique a **fonte canonica** (quem define o contrato).
3. **Os outros lugares importam ou citam.** Nao redeclaram.
4. Quando uma sprint listar `crossCutting: ["X"]` em metadados (ver SPRINT-TEMPLATE), trate como aviso: tudo que voce edita relacionado a `X` precisa estar consistente com a fonte canonica `X`.
5. Antes de marcar feature como done que mexe em `crossCutting`, faca **diff mecanico de campos vs fonte canonica**. Toda divergencia precisa ser deliberada.

**Gate mecanico de diff (obrigatorio quando feature toca `crossCutting`):**

Voce DEVE emitir no chat, antes de marcar a feature como done:

```
Cross-cutting check: <id-do-contrato>
Fonte canonica: <arquivo:linhas>
Arquivos editados nesta feature relacionados ao contrato:
  - <arquivo1>: campos definidos = [campo_a, campo_b, ...]
  - <arquivo2>: campos definidos = [campo_a, campo_b, ...]
Campos da fonte canonica = [campo_a, campo_b, ...]
Diff: <ZERO divergencias> OU <lista das divergencias com justificativa>
```

Sem essa lista emitida no chat, a feature NAO esta done. NAO basta dizer
"verifiquei e bate" — voce deve enumerar campo por campo.

Exemplo de check rigoroso (substitua pelo seu contrato — generico):

```
Cross-cutting check: <id-do-contrato>
Fonte canonica: <arquivo-de-spec>:<linhas>
Arquivos editados:
  - <arquivo-emissor>: lista os identificadores definidos (ex: nomes de
    eventos, campos de payload, valores de enum)
  - <arquivo-consumidor>: lista os mesmos identificadores como ele os
    consome
Identificadores canonicos enumerados:
  - <id1>: <esperado> -> <emissor>: OK / DIVERGE em ...
  - <id2>: <esperado> -> <consumidor>: OK / DIVERGE em ...
Diff: ZERO divergencias.
```

Em codigo: prefira **gerar tipos a partir da fonte canonica** quando possivel (ex: gerar TS types de schema OpenAPI; importar enum Python para JSON schema; etc) em vez de manter copias paralelas.

## 11. Verificacao de API antes de chamar

Antes de chamar metodo, atributo ou funcao de uma biblioteca de terceiro que voce **nao tem certeza absoluta** que existe na versao instalada, **VALIDE**.

Padroes seguros:
- Importou e usa imediatamente: confirme que o import nao deu erro (parser passa).
- Chamou metodo que nao reconhece de cabeca: rode no shell `python3 -c "import M; print('METODO' in dir(M.Classe))"` ou `node -e "console.log('m' in require('lib').Cls.prototype)"` para confirmar.
- Em duvida, abra a doc oficial da versao especifica que esta no manifest do projeto (`package.json`/`pyproject.toml`). Versoes mais antigas frequentemente tem APIs renomeadas.

Anti-pattern conhecido: chamar `obj.delete_config(...)` quando o metodo na versao real e `delete_thread`. mypy/tsc nao pegam isso quando o tipo e `Any`. Em runtime, `AttributeError`. **Valide antes de codar, nao depois quando produto quebra.**

Se voce inventou metodo, **corrija imediatamente** e nao continue a feature ate confirmar. Esse e um dos vetores mais sorrateiros de bug do harness.

## 12. Dependencias declaradas batem com importadas

Antes de marcar feature como done que adicionou import de pacote externo:

1. Confira que o pacote esta declarado no manifest do projeto:
   - JS/TS: `package.json` em `dependencies` ou `devDependencies`
   - Python: `pyproject.toml [project.dependencies]` ou `requirements.txt`
   - Rust: `Cargo.toml`
   - Go: `go.mod`
2. Se nao esta, ADICIONE antes de marcar done. Nao deixe import quebrado.
3. Versionamento: pin com `^` (caret) em JS, `>=` em Python, conforme convencao do projeto.

Comando de verificacao tipica (bash/zsh — UNICO shell suportado):

```bash
grep -F "react-markdown" package.json    # JS/TS — em workspace correto
grep -F "fastapi" pyproject.toml          # Python
```

Se grep retorna vazio mas codigo importa: voce tem um import quebrado. `npm install`/`uv sync` vai falhar. Se ja rodou e nao falhou, e porque o package esta em cache mas nao no lockfile - alguem mais cedo ou tarde quebra.

## 13. Async/sync: nao misture com hack de event loop

Se voce esta escrevendo uma funcao **sincrona** que vai ser chamada de dentro de um event loop async (ex: callback de framework, tool wrapper de LLM, hook de runtime), **declare a funcao como `async def`**. Nao tente "salvar" usando `asyncio.new_event_loop()` + `run_until_complete()` - isso da `RuntimeError: This event loop is already running` no primeiro hit.

Anti-pattern (PROIBIDO):

```python
@tool
def my_tool(arg: str) -> str:                    # sync function
    loop = asyncio.new_event_loop()              # NAO
    return loop.run_until_complete(real_async_impl(arg))  # NAO
```

Correto:

```python
@tool
async def my_tool(arg: str) -> str:              # async function
    return await real_async_impl(arg)
```

A maioria dos frameworks modernos (LangChain, FastAPI, Anthropic SDK, etc.) aceitam tools/handlers async nativamente. Use isso. Se voce realmente PRECISA de bridge sync/async (raro), use `anyio.from_thread.run` ou similar - nao crie loop novo.

Mesma regra inversa: **nao chame codigo async de funcao sync top-level rodando dentro de outro async**. Sempre `await`.

## 14. Lifecycle por feature (ciclo completo antes da proxima — REGRA DURA)

A ordem de execucao prescrita pelo workflow nao e sugestao. **Quebra-la e
violacao do harness.**

Para cada feature `feat-NNN`, complete o ciclo abaixo **antes** de comecar a
feat-NNN+1. NAO significa parar entre features — significa **fechar o ciclo
de uma antes de abrir o da proxima**.

1. Marca `status="in-progress"` + `startedAt=<ISO8601>` no JSON da sprint.
   **Salva imediatamente.**
2. Implementa.
3. Roda gates mecanicos (parseability, import-resolution, unicode, typecheck,
   grep, smoke).
4. Faz self-review COMPLETA citando evidencia por criterio.
5. Marca `status="done"` + `completedAt=<ISO8601>` no JSON da sprint.
   **Salva imediatamente.**
6. **Prossegue IMEDIATAMENTE para feat-NNN+1** (volta ao passo 1) — sem
   pedir confirmacao, sem reportar "feature done, aguardando". Continuar
   e o default.

Gerenciamento de contexto/tokens e responsabilidade do harness do agente
(Cline ou similar), NAO sua. Nao avalie consumo, nao peca compact, nao
reporte uso de tokens. Nao pare voluntariamente entre features ou entre
sprints — so pare por causas externas (gate falhou 3x, infraestrutura
quebrada, arquivo fora de escopo, JSON corrompido).

**PROIBIDO:**
- Implementar feat-002 enquanto feat-001 esta `in-progress`.
- Fazer self-review em batch de varias features.
- Marcar varias features `done` de uma vez sem ter passado pelos gates de
  cada uma individualmente.
- Reportar "todas as features prontas" quando o JSON nao reflete (auto-mentira).
- Parar voluntariamente entre features ou entre sprints (com excecao das
  causas externas listadas acima).
- Avaliar consumo de tokens/contexto e reportar para o humano.
- Pedir `/compact` ou similar — gerenciamento de contexto e do harness do
  agente, nao seu.

**Gate mecanico exigido antes de comecar feat-NNN+1 (e antes de qualquer
edicao de implementacao da N+1):**

```bash
python3 -c "
import json
SPRINT='<arquivo-da-sprint>'
d = json.load(open(f'.harness/sprints/{SPRINT}'))
in_prog = [f['id'] for f in d['features'] if f['status']=='in-progress']
assert len(in_prog) <= 1, f'Mais de uma feature in-progress: {in_prog}'
done_no_completed = [f['id'] for f in d['features'] if f['status']=='done' and not f.get('completedAt')]
assert not done_no_completed, f'Done sem completedAt: {done_no_completed}'
print('LIFECYCLE OK')
"
```

Quando termina a ULTIMA feature da sprint, executa a sequencia de fechamento
(workflow secao "Fim de sprint") **antes de tocar qualquer arquivo da proxima
sprint**: marcar `sprint.status=done`, atualizar `00-index.json`, sobrescrever
`current.txt`. Esses 3 marcadores juntos = sprint fechada. Sem os 3, a sprint
NAO esta fechada.

## 15. Honestidade reforcada — citacao de output mecanico

Regra 5 ja exige nao alegar "typecheck passou" sem ter rodado. Reforco:

**Quando o self-review cita "typecheck zero erro" (mypy, tsc, cargo check, go
vet, etc.) como evidencia, voce DEVE colar literalmente:**
- O comando exato que rodou (com cwd se relevante)
- O exit code recebido
- As ultimas 3 linhas do output

**Exemplo aceito (formato — substitua pelo comando do seu stack):**
```
Criterio: typecheck zero erro novo em arquivos do diff
Evidencia:
  $ <TYPECHECK_CMD> > /tmp/check.txt 2>&1
  $ echo $? -> 0
  $ tail -3 /tmp/check.txt
  <ultimas 3 linhas literais>
Status: atendido.
```

**Nao aceito:**
```
Criterio: typecheck zero erro
Evidencia: typecheck exit 0
Status: atendido.
```
(Sem comando, sem exit code, sem tail. Pode estar mentindo. Esta proibido.)

A mesma regra vale para qualquer evidencia que cite saida de comando: testes,
linter, build, smoke gate. Cite o comando + exit code + tail/head do output.

## 16. Property name e contrato (anti-drift entre arquivos)

Quando codigo de um arquivo acessa propriedade/metodo de objeto definido em OUTRO arquivo, o NOME e contrato. Modelos pequenos confundem nomes parecidos e quebram silenciosamente.

**Casos classicos:**
- `err.statusCode` (campo de Error custom) vs `err.status` (nome do Response nativo). Confunde os dois -> toda logica de erro quebra silenciosamente, build passa.
- `m.seed()` (export real do modulo) vs `m.runSeed()` (nome inventado no script importador). TypeError em runtime.
- `data.matchId` (campo da response) vs `data.id` (nome generico). Undefined access.

**Regra:**
- AC que envolver acesso a propriedade/metodo de objeto externo DEVE listar o nome EXATO.
- Antes de fazer `obj.PROP` ou `m.FN()` em arquivo novo, confirme via grep:
  ```bash
  grep -E "export.*<PROP>|<PROP>\s*[:=(]" <arquivo_fonte>
  ```
- Match esperado. Sem match: voce inventou o nome — corrija ANTES de continuar.

`verification.grepMustMatch` deve incluir o nome EXATO da propriedade quando o AC mencionar.

## 17. State que depende de migration: init lazy

Em qualquer projeto que tem step de inicializacao (migration de DB, fetch de config remota, build de cache), evite inicializar state em TOP-LEVEL de modulo que depende desse step ja ter rodado.

**Padrao errado (anti-pattern):**
```typescript
// repository.ts
const stmtFind = db.prepare('SELECT * FROM users WHERE id = ?');
//                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// EXECUTA no momento do `import`. Se a tabela `users` nao existe ainda
// (DB virgem antes da migration rodar), CRASH no startup.
```

**Padrao correto (lazy):**
```typescript
let _stmtFind: ReturnType<typeof db.prepare> | null = null;
function getStmtFind() {
  if (!_stmtFind) _stmtFind = db.prepare('SELECT * FROM users WHERE id = ?');
  return _stmtFind;
}

export function findById(id: string): User | undefined {
  // strict TS: better-sqlite3 retorna unknown, cast obrigatorio
  return getStmtFind().get(id) as User | undefined;
  //                                ^^^^^^^^^^^^^^^^^^^
  //                                Cast NAO opcional em strict mode.
}
```

Aplica a: prepared statements SQL, fetch sincronos de schema remoto, etc.

`verification.grepMustNotMatch` em arquivos de DB layer:
- `^const stmt[A-Z][a-zA-Z]*\\s*=\\s*db\\.prepare` (detecta top-level prepare)

## 18. Anti-pattern de coerce em parsers (Zod, Joi, etc)

`z.coerce.boolean()` em Zod aplica `Boolean(value)`. Em JS, qualquer string nao-vazia e truthy:
```typescript
z.coerce.boolean().parse("false");  // true (string "false" e truthy!)
z.coerce.boolean().parse("0");      // true
z.coerce.boolean().parse("");       // false (string vazia)
```

`.env` com `COOKIE_SECURE=false` vira `env.COOKIE_SECURE === true`. **Bug grave** em flags de seguranca.

**Padrao seguro:**
```typescript
COOKIE_SECURE: z.enum(['true', 'false']).transform(v => v === 'true').default('false')
```

`z.coerce.number()` tem armadilha mais leve: `z.coerce.number().parse("abc") === NaN`. Para validar de verdade: `.pipe(z.number())` ou `.refine(n => !isNaN(n))`.

`verification.grepMustNotMatch`: `["z\\.coerce\\.boolean\\(\\)"]` em features que parseiam env/query.

## 19. Anti-debug helpers em codigo de producao

PROIBIDO em arquivos da pasta de aplicacao:
- `console.log/debug/trace` em loop quente (OK em scripts de teste/smoke/CLI, marcado com `import.meta.env.DEV` em frontend)
- Three.js helpers: `gridHelper`, `axesHelper`, `cameraHelper`
- `debugger;`
- Pretty-printers de log em prod (`pino-pretty` deve ser so DEV)

**Gate pre-done** (workflow Gate 1.7):
```bash
grep -E 'console\\.(log|debug|trace)\\(|gridHelper|axesHelper|cameraHelper|debugger;' <arquivo>
```

Match nao-justificado em arquivo de producao -> remova. Em script CLI/smoke, ok.

## 20. Schema declarativo vs validacao real (gotcha de frameworks)

Alguns frameworks (Fastify e classico) usam JSON Schema para validar request. Se voce passar um schema Zod onde JSON Schema e esperado, o framework aceita silenciosamente e NAO valida (schema decorativo).

**Padrao:**
- OU integre via plugin oficial do framework (ex: `fastify-type-provider-zod`).
- OU faca `Schema.parse(req.body)` manualmente na handler.
- NUNCA misture: schema declarativo Zod + parse manual = codigo morto + drift de tipos entre `<{ Body: ... }>` literal e tipo inferido do Zod.

Aplica a: Fastify, Hono, NestJS sem class-validator, frameworks similares.

## 21. NAO chame `attempt_completion` ate o pipeline terminar

`attempt_completion` encerra a TASK do Cline. No autopilot `/develop`, so pode ser chamado quando `<HARNESS_DIR>/current.txt == "DONE"`.

Entre features (mesma sprint): nada de ferramenta de encerramento — continue o loop.

Entre sprints (sprint fechada, proxima a iniciar): **NUNCA use `<new_task>` nem `<attempt_completion>` nem `<ask_followup_question>`**. Os 3 param o autopilot e pedem aprovacao humana (mesmo em Yolo mode — comportamento built-in do Cline).

**O que fazer entre sprints:**
1. Sobrescreva `<HARNESS_DIR>/current.txt` com nome da proxima sprint.
2. No proximo uso de ferramenta, leia o JSON da nova sprint.
3. Inicie feat-001 dela imediatamente, mesmo turno, sem mensagem solo de "Sprint X concluida".

Output de chat entre features/sprints deve ser MINIMO. Mensagem solo sem ferramenta = fim do turno.

## 22. Honestidade sobre exit codes (anti-mentira no gate)

Reforco da regra 5. Quando rodar um gate (typecheck, build, smoke, linter):

1. Capture exit code: `<cmd>; echo "Exit: $?"`
2. **Exit 127** (command not found) e EXIT ERROR, NAO sucesso. PARE. Comando ausente, alguma dependencia nao foi instalada.
3. **Exit 124** (timeout) e EXIT ERROR. Comando travou. NAO retry cego — investigue.
4. **Exit 0 com output vazio** em comando que deveria gerar output (typecheck que processa N arquivos): comando NAO rodou. PARE.
5. **Exit != 0 mas marcado como done**: auto-mentira. PROIBIDO.

O workflow deve REEXECUTAR gates dinamicos (postInstall, smoke, typecheck pos-feature) por conta propria apos marcar done. Veja `verification.smoke.executedBy: workflow` e `verification.postInstall`.

Em caso de duvida sobre se o comando rodou: rode `ls -la <arquivo_de_output>` e confirme tamanho > 0 + data recente.

## 23. Guardrails v6.3 — anti-deadlock + context budget

**(a) Timeout obrigatorio em TODO comando externo.** Sem excecao. Default por categoria:
- gates de leitura/grep: `timeout 10`
- typecheck / lint / build curtos: `timeout 90`
- npm install: `timeout 300`
- electron-rebuild: `timeout 180`
- smoke backend / fullstack: `timeout 60` (definido em verification.smoke.timeoutSeconds)

Sem timeout, comando trava = deadlock do agent. Aconteceu na v6.2 (5h paralisado em grep gigante).

**(b) Gates grep usam `-q` (quiet) — NUNCA dump de linhas matched.**

PROIBIDO: `grep -F "X" file && grep -F "Y" file && grep -F "Z" file` (despeja N linhas matched cada vez, sobrecarrega contexto).

PERMITIDO: `grep -qE "X" file && grep -qE "Y" file && echo OK || echo FAIL`. Output: 2-4 caracteres.

**(c) Output bruto vai pra arquivo, nao chat.**

PROIBIDO: `cmd 2>&1 | head -200` no chat.

PERMITIDO: `cmd > /tmp/harness/<step>.log 2>&1; tail -20 /tmp/harness/<step>.log`. Sempre tail/head pequeno apos redirect.

**(d) Context budget alarm (anti-deadlock).**

Se voce sente que o contexto esta cheio (`> 85%` da janela), PARE e peca `/compact`. Nao gere mais turnos. Sintomas:
- respostas curtas / truncadas
- esquecer instrucoes recentes
- repetir comando ja executado

Travamento por context overflow e silencioso e mortal. Prevenir > consertar.

**(e) `npm install` apos QUALQUER mudanca em `package.json`.**

Se uma feature adicionar/remover entry em deps/devDeps, o workflow DEVE rodar `timeout 300 npm install` ANTES do proximo typecheck. Senao, imports falham e cascateia 50+ erros TS. Foi a causa raiz da falha v6.2.

**(f) Pre-flight typecheck no inicio de cada sprint (>= sprint 02).**

Workflow roda `npm run typecheck` ANTES da feat-001. Se `BASELINE_ERRORS > 0`, ABORTA sprint. Garante que nao herdamos sujeira da sprint anterior.

**(g) Gates como SCRIPTS em arquivo (v6.4 — anti-heredoc-flood).**

Causa raiz v6.3: gates inline com loops bash multi-line (`for PATTERN in ...; do for FILE in ...; do ... done; done`) geram tokens `for>`, `for for>`, `for for then>` no output que IGNORAVELMENTE estouram o contexto. Trava 5h documentada.

PROIBIDO: bash heredoc multi-line embutido em comando.
OBRIGATORIO: gates declarativos chamam scripts dedicados:

```bash
bash .harness/scripts/gate-positive.sh <sprint> <feat>   # grepMustMatch (OR semantics)
bash .harness/scripts/gate-negative.sh <sprint> <feat>   # grepMustNotMatch (NOT semantics)
bash .harness/scripts/gate-unused.sh <file1.ts> [...]    # noUnusedLocals per-file
python3 .harness/scripts/gate-import-resolve.py <file>   # valida from '...' paths
python3 .harness/scripts/gate-consistency.py <dir> <sym1> [sym2]  # detecta uso cross-file inconsistente
```

Output de cada gate: UMA linha (`GATE_X=OK` ou `GATE_X=FAIL\n<detalhes>`). Zero flood.

## 24. Patterns Express + factory functions (v6.4 obrigatorio)

Causa raiz v6.3: `authGuard` foi escrito como FACTORY (`function authGuard(db) { return (req, res, next) => {...} }`), mas em 3 rotas foi passado como `authGuard,` (sem chamar). Express recebeu a factory como middleware → factory chamada com `(req, res, next)` → retornou outra funcao → next() NUNCA chamado → request travou indefinidamente. Cliente HTTP fica esperando ate timeout.

**Regras duras:**

**(a) Factory middlewares DEVEM ser documentadas em SPEC + AC.**

Quando uma funcao retorna outra funcao (closure-based factory), AC deve mencionar EXPLICITAMENTE:
> "X e uma factory que recebe Y. Chame como `X(Y)`, nao como `X`."

Em todo lugar onde o factory e usado, a chamada deve ser CONSISTENTE.

**(b) Async handlers do Express 4 SEMPRE wrapper com `.catch(next)`.**

PROIBIDO em rotas Express:
```typescript
router.post('/x', async (req, res) => {
  await runStuff();  // se throw -> request NUNCA responde
  res.json(result);
});
```

OBRIGATORIO um dos 3 patterns:
```typescript
// Pattern 1: wrapper inline
router.post('/x', (req, res, next) => {
  (async (): Promise<void> => {
    await runStuff();
    res.json(result);
  })().catch(next);
});

// Pattern 2: helper asyncHandler
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
router.post('/x', asyncHandler(async (req, res) => {...}));

// Pattern 3: middleware express-async-errors no top de server.ts
import 'express-async-errors';
router.post('/x', async (req, res) => {...});  // auto-wrapped
```

Grep gate: `grep -nE 'router\.(get|post|put|delete|patch)\([^,]+,\s*async \(' backend/routes/*.ts` deve dar 0 matches OU todos cobertos por asyncHandler/express-async-errors importado.

**(c) Middleware chain SEMPRE termina em `next()` ou `res.send/json/end()`.**

Middleware que faz `if X return; else Y;` sem chamar next() OU res.end() = request orfao.

**(d) Cross-file consistency check.**

Toda feature que USA simbolo importado em 2+ arquivos deve passar:
```bash
python3 .harness/scripts/gate-consistency.py <dir> <symbol>
```

Se o gate detectar uso inconsistente (e.g. `authGuard` passed-uncalled vs `authGuard(getDb())`), FAIL — corrigir todos pro mesmo padrao.

## 25. Sprint Review Final obrigatoria (v6.5)

Causa raiz: LLM medio NAO consegue revisar 60+ arquivos simultaneamente. Decisao tomada em arquivo N nao influencia arquivo N+10. Resultado: bugs sutis sobrevivem ate o smoke final (ou prod) mesmo com gates per-feature ativos.

Fix: PIPELINE de sprints SEMPRE termina com uma **Sprint Review Final** dedicada. Template em `.harness/sprints/REVIEW-TEMPLATE.json`. Cada feature dessa sprint consome UMA categoria de findings de `audit-final.py` e aplica correcao.

**Categorias auditadas (audit-final.py):**

| Categoria | O que detecta | Severidade tipica |
|-----------|---------------|-------------------|
| `CONSISTENCY` | Simbolo usado de jeitos diferentes em arquivos diferentes; imports que nao resolvem | HIGH |
| `DEAD_CODE` | Imports/vars nao usados (TS6133/TS6196); arquivos orfaos | MED |
| `SECURITY` | API keys hardcoded; logs com token/password/auth; defaults Electron inseguros; CSP fraco | HIGH |
| `ANTI_PATTERN` | Express 4 async naked; prepared stmt top-level; innerHTML; `: any`; eval | HIGH/MED |
| `DUPLICATION` | Literais duplicados em ≥3 arquivos (candidatos a constante) | LOW |
| `TODO` | TODO/FIXME/throw not-implemented residuais | MED |

**Regra dura:** zero findings `HIGH` antes do DONE. `MED` tolerados apenas com justificativa documentada. `LOW` sao opcionais.

**Como pular review (NAO recomendado):** projetos muito pequenos (< 20 features) podem opcionalmente pular. Em todos os outros casos, e obrigatoria.

**Adicionar ao seu pipeline:**

```bash
cp .harness/sprints/REVIEW-TEMPLATE.json .harness/sprints/<N>-final-review.json
# Edite "index" no JSON
# Adicione entrada no 00-index.json incrementando totalSprints
```
