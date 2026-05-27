# EduMembros — Plataforma de Cursos e Comunidade

## What This Is

Plataforma completa de educação online e comunidade de membros, com página de vendas integrada, área de cursos com vídeos do YouTube, fórum de discussão entre membros, e dois planos de acesso (free e pago). O site é construído com Next.js, Supabase como backend e Mercado Pago como gateway de pagamento, voltado para um público misto de educação online no Brasil.

## Core Value

Membros pagantes têm acesso total a cursos, fórum e lives — entregando uma experiência premium de aprendizado em comunidade com o menor atrito possível de cadastro e pagamento.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

(None yet — ship to validate)

### Active

<!-- Current scope. Building toward these. -->

**Página de Vendas (Landing Page)**
- [ ] Landing page profissional com seções: hero, benefícios, depoimentos, planos, FAQ e CTA
- [ ] Apresentação clara dos dois planos (Free e Pago)
- [ ] Checkout integrado com Mercado Pago (assinatura mensal e pagamento único/vitalício)
- [ ] SEO otimizado para PT-BR

**Autenticação e Membros**
- [ ] Cadastro e login com Supabase Auth (email/senha e OAuth)
- [ ] Dois tipos de conta: Free e Premium (assinante pago)
- [ ] Perfil de membro editável
- [ ] Dashboard do membro após login

**Área de Cursos**
- [ ] Listagem de cursos com thumbnail e descrição
- [ ] Player de vídeo integrado do YouTube (embed)
- [ ] Cursos free: aulas liberadas para todos os membros
- [ ] Cursos pagos: apenas para assinantes Premium
- [ ] Progresso de aulas (marcar como assistida)
- [ ] Certificados de conclusão de curso

**Fórum da Comunidade**
- [ ] Fórum com categorias/tópicos
- [ ] Criar e responder tópicos (todos os membros)
- [ ] Moderação básica (admin)
- [ ] Notificações de resposta

**Lives / Transmissões ao Vivo**
- [ ] Página de lives com embed do YouTube Live
- [ ] Agendamento e aviso de próximas lives
- [ ] Lives exclusivas para Premium (quando aplicável)

**Materiais para Download**
- [ ] Upload e download de PDFs e planilhas
- [ ] Materiais free vs. exclusivos para Premium

**Gateway de Pagamento (Mercado Pago)**
- [ ] Assinatura mensal recorrente
- [ ] Pagamento único (vitalício)
- [ ] Webhook para ativar/desativar acesso Premium automaticamente
- [ ] Página de sucesso e falha de pagamento

**Admin**
- [ ] Painel admin para gerenciar usuários, cursos e fórum
- [ ] Upload de materiais e criação de cursos

### Out of Scope

- App mobile nativo — plataforma web responsiva é suficiente para v1
- Sistema de afiliados — complexidade desnecessária para v1
- Múltiplos idiomas — 100% PT-BR conforme definido
- Hospedagem de vídeo própria — YouTube integrado é a escolha (custo e simplicidade)

## Context

- **Stack**: Next.js 14+ (App Router), Supabase (Auth + DB + Storage), Mercado Pago SDK, Tailwind CSS ou Vanilla CSS
- **Vídeos**: Todos hospedados no YouTube, integrados via embed (evita custo de CDN)
- **Banco de dados**: Supabase PostgreSQL — usuários, cursos, fórum, planos
- **Hospedagem**: Desenvolvimento local → VPS ou Vercel (a decidir)
- **Idioma**: 100% PT-BR
- **Público**: Misto (iniciantes, profissionais e empreendedores) — educação online

## Constraints

- **Stack**: Next.js + Supabase — definido pelo usuário, sem alteração
- **Vídeos**: Apenas YouTube embed — sem uploads diretos de vídeo
- **Pagamentos**: Apenas Mercado Pago — gateway escolhido para o mercado brasileiro
- **Idioma**: PT-BR exclusivo — sem internacionalização na v1
- **Acesso**: Controle de acesso baseado em roles Supabase (free vs. premium)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Next.js (App Router) | SSR nativo + ótimo suporte Vercel + ecosystem maduro | — Pending |
| Supabase | Backend completo (Auth + DB + Storage) sem servidor próprio | — Pending |
| Mercado Pago | Melhor suporte para pagamentos recorrentes no Brasil | — Pending |
| YouTube embed | Custo zero de hosting de vídeo, familiar para os usuários | — Pending |
| Dois planos (Free + Premium) | Funil de conversão: free atrai, premium monetiza | — Pending |

## Evolution

Este documento evolui a cada transição de fase e milestone.

**Após cada fase** (via `/gsd-transition`):
1. Requisitos invalidados? → Mover para Out of Scope com motivo
2. Requisitos validados? → Mover para Validated com referência da fase
3. Novos requisitos surgiram? → Adicionar em Active
4. Decisões a registrar? → Adicionar em Key Decisions
5. "What This Is" ainda preciso? → Atualizar se houver drift

**Após cada milestone** (via `/gsd-complete-milestone`):
1. Revisão completa de todas as seções
2. Verificar Core Value — ainda é a prioridade certa?
3. Auditar Out of Scope — os motivos ainda são válidos?

---
*Last updated: 2026-05-27 after initialization*
