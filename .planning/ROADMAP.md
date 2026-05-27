# ROADMAP.md — EduMembros

## Milestone 1: MVP — Plataforma Funcional Completa

**Objetivo:** Ter uma plataforma completamente funcional com página de vendas, autenticação, área de cursos, fórum, lives, materiais e pagamentos integrados. Pronta para receber os primeiros membros pagantes.

**Estado:** 🟡 Em andamento

---

### Phase 1 — Fundação do Projeto (Next.js + Supabase Setup)

**Goal:** Inicializar o projeto Next.js com estrutura de pastas, configurar Supabase (Auth, DB, Storage), definir schema do banco de dados e configurar variáveis de ambiente.

**Deliverables:**
- Projeto Next.js 14+ criado com App Router e TypeScript
- Supabase conectado (Auth + PostgreSQL + Storage)
- Schema do banco: `users`, `plans`, `subscriptions`, `courses`, `lessons`, `forum_categories`, `forum_topics`, `forum_replies`, `materials`, `live_events`
- Middleware de proteção de rotas (free vs. premium)
- `.env.local` com todas as variáveis
- Estrutura de pastas organizada

**Status:** ⬜ Not started

---

### Phase 2 — Design System e Landing Page

**Goal:** Criar o design system da plataforma (cores, tipografia, componentes) e a landing page de vendas completa com todas as seções.

**Deliverables:**
- Design system: tokens de cor (azul/cinza corporativo), tipografia, botões, cards, badges
- Landing page com seções:
  - Hero com CTA forte
  - O que você vai aprender
  - Benefícios (free vs. premium)
  - Depoimentos de alunos
  - Comparativo de planos (tabela free vs. pago)
  - FAQ
  - Rodapé com links e política
- Totalmente responsiva (mobile-first)
- SEO: meta tags, OG tags, título e descrição

**Status:** ⬜ Not started
**Depends on:** Phase 1

---

### Phase 3 — Autenticação e Área do Membro

**Goal:** Implementar fluxo completo de autenticação com Supabase Auth e criar o dashboard do membro.

**Deliverables:**
- Páginas: Login, Cadastro, Recuperar senha, Confirmar email
- Dashboard do membro (após login)
- Perfil editável (nome, foto, bio)
- Lógica de role: `free` vs. `premium`
- Redirecionamento pós-login para dashboard
- Proteção de rotas premium com middleware

**Status:** ⬜ Not started
**Depends on:** Phase 1, Phase 2

---

### Phase 4 — Área de Cursos e Vídeos (YouTube)

**Goal:** Criar a área de cursos completa com player do YouTube integrado, progresso de aulas e controle de acesso (free vs. premium).

**Deliverables:**
- Listagem de cursos com thumbnail e badges (free/premium)
- Página de curso: descrição, módulos, aulas
- Player YouTube embed responsivo
- Controle de acesso: aulas free liberadas para todos, aulas premium bloqueadas com CTA de upgrade
- Marcar aulas como assistidas (progresso salvo no Supabase)
- Geração de certificado de conclusão (PDF simples)
- Admin: criar/editar cursos e aulas pelo painel

**Status:** ⬜ Not started
**Depends on:** Phase 3

---

### Phase 5 — Fórum da Comunidade

**Goal:** Implementar o fórum de discussão entre membros com categorias, tópicos e respostas.

**Deliverables:**
- Listagem de categorias do fórum
- Listagem e criação de tópicos
- Replies com suporte a formatação básica (Markdown)
- Notificações por email de respostas (via Supabase Edge Functions ou Resend)
- Moderação: deletar tópico/reply (admin)
- Paginação de tópicos e replies

**Status:** ⬜ Not started
**Depends on:** Phase 3

---

### Phase 6 — Lives ao Vivo e Materiais para Download

**Goal:** Criar a área de transmissões ao vivo (YouTube Live embed) e biblioteca de materiais para download (PDFs, planilhas).

**Deliverables:**
- Página de lives: live atual + agenda de próximas lives
- Embed YouTube Live com chat (se disponível)
- Badge "AO VIVO" quando em transmissão
- Lives premium marcadas com controle de acesso
- Biblioteca de materiais: listagem com thumbnail e descrição
- Download direto (Supabase Storage para arquivos protegidos)
- Materiais free vs. premium com bloqueio e CTA

**Status:** ⬜ Not started
**Depends on:** Phase 3

---

### Phase 7 — Gateway de Pagamento (Mercado Pago)

**Goal:** Integrar o Mercado Pago com suporte a assinatura mensal recorrente e pagamento único vitalício, com webhook para ativação automática de acesso premium.

**Deliverables:**
- Integração Mercado Pago SDK/API
- Plano mensal: checkout de assinatura recorrente
- Plano vitalício: pagamento único
- Webhook handler: ativar/desativar `premium` no Supabase automaticamente
- Página de sucesso e falha de pagamento
- Histórico de pagamentos no perfil do membro
- Cancelamento de assinatura pelo membro

**Status:** ⬜ Not started
**Depends on:** Phase 3

---

### Phase 8 — Painel Admin

**Goal:** Criar painel administrativo para gerenciar toda a plataforma: usuários, cursos, fórum, lives e materiais.

**Deliverables:**
- Rota `/admin` protegida por role `admin`
- Dashboard admin: métricas (membros, receita, cursos, tópicos)
- CRUD de cursos e aulas
- CRUD de materiais (upload para Supabase Storage)
- Gerenciamento de usuários (ver plano, forçar upgrade/downgrade)
- Moderação do fórum (deletar tópicos/replies)
- Criação e edição de eventos de lives

**Status:** ⬜ Not started
**Depends on:** Phase 4, Phase 5, Phase 6, Phase 7

---

### Phase 9 — Polimento, SEO e Preparação para Deploy

**Goal:** Ajustes finais de UX/UI, otimizações de performance, SEO avançado e preparação do ambiente de produção para deploy em VPS ou Vercel.

**Deliverables:**
- Otimização de imagens e lazy loading
- SEO: sitemap.xml, robots.txt, Open Graph, Schema markup
- Testes end-to-end dos fluxos críticos (cadastro → pagamento → acesso premium)
- Variáveis de ambiente para produção
- Documentação de deploy (README)
- Configuração de domínio e HTTPS

**Status:** ⬜ Not started
**Depends on:** Phase 8

---

## Backlog (Pós MVP)

### 999.1 — Sistema de Notificações In-App
Push notifications dentro da plataforma para novos tópicos, replies e lives.

### 999.2 — Sistema de Afiliados
Programa de afiliados com links rastreáveis e comissões automáticas.

### 999.3 — App Mobile (PWA)
Transformar a plataforma em PWA para instalação no celular.

### 999.4 — Múltiplos Instrutores
Suporte para criação de cursos por múltiplos professores com seus próprios painéis.

### 999.5 — Gamificação
Sistema de pontos, badges e ranking por participação no fórum e conclusão de cursos.

---

*Last updated: 2026-05-27 after initialization*
