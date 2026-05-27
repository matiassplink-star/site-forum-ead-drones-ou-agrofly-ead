# AgroFly Academy — Cursos e Comunidade de Drones Agrícolas

## What This Is

Plataforma completa de educação online e comunidade de membros dedicada ao mercado de **Drones na Área Agrícola (AgroFly Academy)**. Contém página de vendas integrada, área de cursos com vídeos de treinamento (YouTube embed), fórum de discussão comunitário de alta performance e biblioteca de materiais para download (PDFs e planilhas de plano de voo). A plataforma é construída com Next.js 14, Supabase (banco de dados, autenticação e arquivos) e Mercado Pago, com planos de acesso Free e Premium (mensal e vitalício).

## Core Value

Membros do agronegócio têm acesso imediato a treinamentos especializados de voo, pulverização e mapeamento NDVI, integrando aprendizado de elite com uma comunidade ativa no fórum com o menor atrito operacional possível.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

(None yet — ship to validate)

### Active

**Página de Vendas (Landing Page)**
- [ ] Landing page com identidade "Eco-Tech" (cinza escuro, verde foliar e ouro safra)
- [ ] Componentes interativos premium usando **Aceternity UI** (efeitos de luz e grades) e **Magic UI** (textos animados)
- [ ] Tabela comparativa e clara dos planos (Free vs. Premium)
- [ ] Checkout integrado ao Mercado Pago para assinatura mensal recorrente e pagamento único (acesso vitalício)
- [ ] SEO otimizado para o agronegócio brasileiro (PT-BR)

**Autenticação e Controle de Acesso (RBAC)**
- [ ] Cadastro e login via Supabase Auth integrado
- [ ] Arquitetura de segurança no banco de dados estilo **NextBase** (Row Level Security - RLS) protegendo dados e conteúdos
- [ ] Regras de acesso baseadas em perfil (`free`, `premium`, `admin`)
- [ ] Painel (Dashboard) interativo para o membro após o login

**Área de Cursos Agrícolas**
- [ ] Listagem de cursos organizados em trilhas (Mapeamento NDVI, Pulverização Prática, Legislação)
- [ ] Player de vídeo integrado responsivo (YouTube Embed)
- [ ] Controle de acesso: aulas básicas free liberadas, aulas técnicas avançadas restritas para assinantes Premium
- [ ] Progresso de aulas salvas no Supabase (marcação automática de aula assistida)
- [ ] Sistema simples de geração de certificados de conclusão em PDF

**Fórum da Comunidade (Discussbase-style)**
- [ ] Fórum estruturado com categorias (ex: Pulverização, Mapeamento, Dúvidas de Equipamentos)
- [ ] Criação de tópicos e respostas (Markdown simplificado para membros)
- [ ] Schema otimizado baseado no projeto open-source **discussbase** (Supabase + Next.js) para máxima performance de queries
- [ ] Moderação ágil de tópicos e respostas pelo painel administrativo

**Transmissões ao Vivo (Lives)**
- [ ] Página de lives exclusivas (embed do YouTube Live) com aviso programado de novos eventos
- [ ] Controle de acesso para lives exclusivas de membros Premium

**Biblioteca de Materiais**
- [ ] Upload de planilhas de calibração de bicos de drone e manuais PDF (Supabase Storage)
- [ ] Downloads protegidos via políticas de Storage do Supabase (materiais exclusivos vs. free)

**Gateway de Pagamento (Mercado Pago)**
- [ ] Integração segura com o SDK/API do Mercado Pago
- [ ] Webhook resiliente: ativação imediata do plano `premium` no Supabase e reversão automática em caso de cancelamento/inadimplência
- [ ] Histórico simples de faturamento na conta do usuário

**Painel Admin**
- [ ] Painel administrativo (`/admin`) restrito a usuários com a role `admin`
- [ ] Gerenciamento de cursos, upload de materiais e moderação direta de tópicos do fórum

### Out of Scope

- Hosting próprio de arquivos de vídeo — integração direta do YouTube para economizar tokens, custos de infraestrutura e performance
- Desenvolvimento de app mobile nativo na v1 — layout web 100% responsivo e otimizado para celulares resolve o MVP
- Gateway de pagamento internacional — foco exclusivo no mercado brasileiro via Mercado Pago

## Context

- **Stack de UI Premium**: Next.js 14+ (App Router), Tailwind CSS, Framer Motion, Aceternity UI, Magic UI, Shadcn/UI
- **Backend & Banco de dados**: Supabase PostgreSQL + Auth + Storage com políticas rígidas de Row Level Security (RLS) inspiradas no modelo **NextBase**
- **Arquitetura do Fórum**: Estrutura otimizada baseada no open-source **discussbase** para consultas relacionais rápidas
- **Vídeos**: YouTube Embed (aulas gravadas e transmissões ao vivo)
- **Integração de Pagamento**: Mercado Pago com webhooks seguros protegidos por assinatura de payload

## Constraints

- **Stack**: Next.js + Supabase + Mercado Pago (imposto pelo escopo do projeto)
- **Design System**: Uso estrito de componentes de código aberto premium (Aceternity/Magic UI/Shadcn) para reduzir o consumo de tokens na geração de código personalizado
- **Segurança**: RLS ativado em todas as tabelas sensíveis do banco de dados (não expor dados de assinantes)
- **Idioma**: Exclusivo em Português do Brasil (PT-BR)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Next.js 14 App Router | Velocidade de carregamento (SSR) e facilidade de deploy na Vercel | — Pending |
| Supabase + RLS | Banco de dados relacional robusto com autenticação e políticas de segurança nativas | — Pending |
| Discussbase DB Schema | Estrutura de fórum open-source testada que economiza tempo de desenvolvimento e evita bugs | — Pending |
| Aceternity & Magic UI | Garante o efeito "WOW" visual com componentes de código aberto prontos, economizando tokens de chat | — Pending |
| Mercado Pago Webhooks | Automação total de liberação de assinaturas sem intervenção humana | — Pending |

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
*Last updated: 2026-05-27 after AgroFly Academy rebranding*
