# ROADMAP.md — AgroFly Academy

## Milestone 1: MVP — Plataforma Funcional Completa

**Objetivo:** Ter a plataforma AgroFly Academy completamente funcional, com design ultra-premium ("Eco-Tech"), página de vendas interativa, área de membros protegida com cursos do YouTube, fórum rápido, downloads de materiais e checkout do Mercado Pago ativo.

**Estado:** 🟡 Em andamento

---

### Phase 1 — Fundação do Projeto e Banco de Dados (Next.js + Supabase Setup)

**Goal:** Inicializar o projeto Next.js com TypeScript, configurar a estrutura de pastas e implementar a arquitetura de banco de dados robusta e segura estilo **NextBase** (RLS) e **discussbase** (Fórum).

**Deliverables:**
- Projeto Next.js 14+ criado com App Router e TypeScript
- Supabase conectado (Auth + PostgreSQL + Storage)
- Modelagem de Tabelas e Relações no Supabase:
  - `profiles` (estilo NextBase para gerenciar roles `free`, `premium`, `admin`)
  - `courses` & `lessons` (trilhas de cursos de drones e vídeos do YouTube)
  - `lessons_progress` (salvamento de progresso de aulas assistidas)
  - `forum_categories`, `forum_topics`, `forum_replies` (schema otimizado estilo **discussbase**)
  - `materials` (manuais PDF e tabelas de calibração)
- Configuração de políticas de segurança Row Level Security (RLS) para proteger conteúdo pago
- Middleware do Next.js configurado para proteção de rotas

**Status:** ⬜ Not started

---

### Phase 2 — Design System Premium e Landing Page (Eco-Tech)

**Goal:** Instalar e configurar as bibliotecas visuais premium (**Aceternity UI**, **Magic UI** e **Shadcn/UI**) e criar a landing page de vendas moderna e animada para o mercado do agronegócio.

**Deliverables:**
- Instalação e setup de pacotes: Tailwind CSS, Framer Motion, Radix UI e Shadcn/UI
- Configuração dos arquivos de componentes e estilos para **Aceternity UI** e **Magic UI**
- Desenvolvimento da Landing Page do **AgroFly Academy** com seções interativas:
  - Seção Hero de alto impacto (efeito de grade ou partículas tecnológicas)
  - O que são drones agrícolas (fotos/vídeos e depoimentos premium)
  - Trilhas de Aprendizagem (Pulverização avançada, Mapeamento NDVI, Legislação)
  - Comparativo de planos (tabela Free vs. Premium de alto contraste)
  - FAQ interativo (acordeão estilizado da Shadcn/UI)
  - Botão de inscrição com micro-animação (efeito shiny/brilhante)
- SEO totalmente otimizado para o nicho de agronegócio nacional

**Status:** ⬜ Not started
**Depends on:** Phase 1

---

### Phase 3 — Autenticação e Área do Membro

**Goal:** Implementar fluxo completo de autenticação seguro com Supabase Auth e dashboard do aluno estruturado.

**Deliverables:**
- Páginas de Auth (Login, Cadastro, Recuperar senha) com design consistente de vidro (Glassmorphism)
- Redirecionamento baseado na role do usuário (`free`, `premium` ou `admin`)
- Página de Dashboard do Membro (área logada inicial) com boas-vindas, trilhas sugeridas e atalhos rápidos
- Tela de Perfil do usuário para edição de foto, nome e alteração de senha
- Middleware ativo validando sessões e bloqueando invasões em rotas premium

**Status:** ⬜ Not started
**Depends on:** Phase 1, Phase 2

---

### Phase 4 — Área de Cursos de Drone (YouTube Embed)

**Goal:** Criar a área de cursos completa com player de vídeo do YouTube responsivo, progresso de aulas e controle de liberação de conteúdo.

**Deliverables:**
- Grade de cursos mostrando badges de "Gratuito" ou "Exclusivo Premium"
- Página de curso: descrição detalhada, cronograma de módulos e lista de aulas
- Player YouTube Embed otimizado, sem botões de distração
- Salvamento automático de progresso (botão "Concluir Aula" atualizando Supabase PostgreSQL)
- Controle de acesso rígido por RLS: se o usuário `free` tentar acessar aula `premium`, exibir tela de bloqueio convidativa para assinatura
- Gerador automático de certificado de conclusão simples (PDF client-side)

**Status:** ⬜ Not started
**Depends on:** Phase 3

---

### Phase 5 — Fórum da Comunidade (Discussbase Performance)

**Goal:** Criar o fórum de discussões entre membros para dúvidas de campo, calibrações de drone e negócios, usando o schema otimizado do **discussbase**.

**Deliverables:**
- Visualização de categorias do fórum com contagem de tópicos e postagens recentes
- Tela de criação de tópicos com suporte a formatação de texto simples
- Sistema de respostas (threads) rápido e paginado
- Moderação nativa: botão para excluir mensagens (restrito a usuários `admin`)
- Relação segura de posts: apenas o autor original pode editar seu próprio tópico/resposta (políticas de RLS validadas no Supabase)

**Status:** ⬜ Not started
**Depends on:** Phase 3

---

### Phase 6 — Lives ao Vivo e Biblioteca de Arquivos

**Goal:** Área de aulas ao vivo integrando YouTube Live e downloads de arquivos essenciais (planilhas de vazão de bico, manuais de drones DJI/XAG).

**Deliverables:**
- Seção de Lives: embed de transmissão ao vivo do YouTube com cronômetro para o próximo evento agrícola
- Chat da live integrado
- Central de Downloads: grade de arquivos para download (PDFs e planilhas)
- Downloads controlados: materiais avançados de pulverização restritos a membros premium no Supabase Storage

**Status:** ⬜ Not started
**Depends on:** Phase 3

---

### Phase 7 — Gateway de Pagamento (Mercado Pago)

**Goal:** Integração completa do Mercado Pago para vendas de planos de forma 100% automatizada e webhook seguro de ativação.

**Deliverables:**
- Integração com a API/SDK do Mercado Pago
- Checkout Pro ou checkout transparente para Plano Mensal (recorrente) e Plano Vitalício (pagamento único)
- Criação do Webhook Route em Next.js para escutar eventos de pagamento aprovado, pendente ou cancelado
- Lógica de sincronização: ao confirmar o pagamento, mudar a role do usuário no Supabase de `free` para `premium` imediatamente
- Tela amigável de Sucesso e Falha de pagamento

**Status:** ⬜ Not started
**Depends on:** Phase 3

---

### Phase 8 — Painel Admin Completo

**Goal:** Painel administrativo protegido para gestão total da plataforma de drones.

**Deliverables:**
- Rota `/admin` protegida rigidamente por middleware (role `admin`)
- Dashboard executivo: total de assinantes premium, faturamento mensal estimado, tópicos criados no fórum
- Formulário simples para criação/edição de novos cursos e upload de aulas
- Painel para upload de novos arquivos PDF e planilhas na central de downloads
- Área de gerenciamento de membros para habilitar ou remover acessos premium manualmente

**Status:** ⬜ Not started
**Depends on:** Phase 4, Phase 5, Phase 6, Phase 7

---

### Phase 9 — Otimização, SEO Programático e Deploy

**Goal:** Polimento estético, otimização de velocidade de carregamento, SEO agro-segmentado e deploy final na Vercel ou VPS.

**Deliverables:**
- Otimização de imagens da landing page (formatos .webp leves)
- SEO técnico: sitemap.xml, robots.txt, tags Open Graph para WhatsApp e redes sociais
- Testes robustos de segurança do Supabase Auth e RLS
- Setup de variáveis de ambiente de produção
- Deploy final integrado e funcional na Vercel (ou VPS) conectado ao banco Supabase definitivo

**Status:** ⬜ Not started
**Depends on:** Phase 8

---

## Backlog (Pós MVP)

### 999.1 — Sistema de Notificações In-App
Push notifications dentro da plataforma para novos tópicos, replies e lives de drones.

### 999.2 — Painel de Calculadora de Pulverização
Calculadora interativa na web para o piloto de drone calcular a vazão ideal baseada no vento e velocidade do drone.

### 999.3 — Programa de Afiliados
Sistema para alunos premium recomendarem a plataforma e receberem comissão recorrente automaticamente.
---

*Last updated: 2026-05-27 after AgroFly Academy rebranding*

