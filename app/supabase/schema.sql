-- ============================================================
--  AgroFly Academy — Schema Principal do Banco de Dados
--  Supabase PostgreSQL
--  Execute este script no SQL Editor do Supabase
-- ============================================================

-- ============================================================
-- EXTENSÕES NECESSÁRIAS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "unaccent"; -- para busca em PT-BR sem acentos

-- ============================================================
-- TABELA: profiles
-- Extende auth.users do Supabase com dados do perfil
-- Roles: free | premium | admin
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name     TEXT,
  avatar_url    TEXT,
  bio           TEXT,
  role          TEXT NOT NULL DEFAULT 'free' CHECK (role IN ('free', 'premium', 'admin')),
  premium_since TIMESTAMPTZ,
  premium_until TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger para criar perfil automaticamente ao cadastrar usuário
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- TABELA: subscriptions
-- Histórico de assinaturas e pagamentos do Mercado Pago
-- ============================================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  mercadopago_payment_id TEXT,
  plan_type             TEXT NOT NULL CHECK (plan_type IN ('monthly', 'lifetime')),
  status                TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'cancelled', 'failed')),
  amount_paid           NUMERIC(10, 2),
  started_at            TIMESTAMPTZ,
  expires_at            TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABELA: courses
-- Trilhas de cursos de drones agrícolas
-- ============================================================
CREATE TABLE IF NOT EXISTS public.courses (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title         TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  description   TEXT,
  thumbnail_url TEXT,
  is_premium    BOOLEAN NOT NULL DEFAULT false,
  is_published  BOOLEAN NOT NULL DEFAULT false,
  position      INTEGER NOT NULL DEFAULT 0, -- para ordenar na grade
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABELA: lessons
-- Aulas individuais de cada curso (vídeos do YouTube)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.lessons (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id       UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  description     TEXT,
  youtube_video_id TEXT NOT NULL, -- somente o ID do vídeo (ex: dQw4w9WgXcQ)
  duration_seconds INTEGER,       -- duração em segundos para exibir no card
  is_premium      BOOLEAN NOT NULL DEFAULT false,
  is_published    BOOLEAN NOT NULL DEFAULT false,
  position        INTEGER NOT NULL DEFAULT 0, -- ordenação dentro do curso
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABELA: lesson_progress
-- Progresso dos alunos em cada aula
-- ============================================================
CREATE TABLE IF NOT EXISTS public.lesson_progress (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id       UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  is_completed    BOOLEAN NOT NULL DEFAULT false,
  last_watched_at TIMESTAMPTZ,
  UNIQUE (user_id, lesson_id) -- cada aluno tem um progresso por aula
);

-- ============================================================
-- TABELA: forum_categories
-- Categorias do fórum (ex: Pulverização, Mapeamento NDVI)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.forum_categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  icon        TEXT, -- nome do ícone Lucide
  position    INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABELA: forum_topics
-- Tópicos criados pelos membros no fórum
-- ============================================================
CREATE TABLE IF NOT EXISTS public.forum_topics (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES public.forum_categories(id) ON DELETE CASCADE,
  author_id   UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  content     TEXT NOT NULL,
  is_pinned   BOOLEAN NOT NULL DEFAULT false,  -- admin pode fixar tópicos
  is_locked   BOOLEAN NOT NULL DEFAULT false,  -- admin pode bloquear respostas
  views       INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABELA: forum_replies
-- Respostas aos tópicos do fórum
-- ============================================================
CREATE TABLE IF NOT EXISTS public.forum_replies (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id   UUID NOT NULL REFERENCES public.forum_topics(id) ON DELETE CASCADE,
  author_id  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content    TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABELA: materials
-- Materiais para download (PDFs, planilhas de calibração)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.materials (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title        TEXT NOT NULL,
  description  TEXT,
  file_path    TEXT NOT NULL, -- caminho no Supabase Storage
  file_size    INTEGER,       -- tamanho em bytes
  file_type    TEXT,          -- 'pdf' | 'xlsx' | etc.
  thumbnail_url TEXT,
  is_premium   BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT false,
  downloads    INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABELA: live_events
-- Agenda de transmissões ao vivo no YouTube
-- ============================================================
CREATE TABLE IF NOT EXISTS public.live_events (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title            TEXT NOT NULL,
  description      TEXT,
  youtube_video_id TEXT,          -- ID do YouTube Live
  scheduled_at     TIMESTAMPTZ NOT NULL,
  is_premium       BOOLEAN NOT NULL DEFAULT false,
  is_live          BOOLEAN NOT NULL DEFAULT false, -- true quando em transmissão
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABELA: audit_log
-- Registro de ações administrativas críticas
-- ============================================================
CREATE TABLE IF NOT EXISTS public.audit_log (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id    UUID REFERENCES public.profiles(id),
  action      TEXT NOT NULL, -- ex: 'activate_premium', 'delete_topic'
  target_type TEXT,          -- ex: 'user', 'topic'
  target_id   UUID,
  details     JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ÍNDICES DE PERFORMANCE
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON public.lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user_id ON public.lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson_id ON public.lesson_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_forum_topics_category_id ON public.forum_topics(category_id);
CREATE INDEX IF NOT EXISTS idx_forum_topics_created_at ON public.forum_topics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_forum_replies_topic_id ON public.forum_replies(topic_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- ============================================================
-- BUSCA DE TEXTO COMPLETO (Full Text Search) em PT-BR
-- ============================================================
ALTER TABLE public.forum_topics
  ADD COLUMN IF NOT EXISTS search_vector TSVECTOR
  GENERATED ALWAYS AS (
    to_tsvector('portuguese', coalesce(title, '') || ' ' || coalesce(content, ''))
  ) STORED;

CREATE INDEX IF NOT EXISTS idx_forum_topics_search ON public.forum_topics USING GIN(search_vector);

ALTER TABLE public.courses
  ADD COLUMN IF NOT EXISTS search_vector TSVECTOR
  GENERATED ALWAYS AS (
    to_tsvector('portuguese', coalesce(title, '') || ' ' || coalesce(description, ''))
  ) STORED;

CREATE INDEX IF NOT EXISTS idx_courses_search ON public.courses USING GIN(search_vector);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) — Segurança por linha
-- ============================================================

-- Habilitar RLS em todas as tabelas sensíveis
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- PROFILES: usuário vê apenas o próprio perfil; admin vê todos
CREATE POLICY "Usuário vê o próprio perfil"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Usuário atualiza o próprio perfil"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- SUBSCRIPTIONS: usuário vê apenas as próprias assinaturas
CREATE POLICY "Usuário vê as próprias assinaturas"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- LESSON_PROGRESS: usuário gerencia apenas o próprio progresso
CREATE POLICY "Usuário lê o próprio progresso"
  ON public.lesson_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuário salva o próprio progresso"
  ON public.lesson_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuário atualiza o próprio progresso"
  ON public.lesson_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- FORUM_TOPICS: qualquer autenticado lê; autor edita o próprio; admin deleta
CREATE POLICY "Membros leem tópicos do fórum"
  ON public.forum_topics FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Membros criam tópicos"
  ON public.forum_topics FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Autor edita o próprio tópico"
  ON public.forum_topics FOR UPDATE
  USING (auth.uid() = author_id);

-- FORUM_REPLIES: mesma lógica dos tópicos
CREATE POLICY "Membros leem respostas"
  ON public.forum_replies FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Membros criam respostas"
  ON public.forum_replies FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Autor edita a própria resposta"
  ON public.forum_replies FOR UPDATE
  USING (auth.uid() = author_id);

-- AUDIT_LOG: somente admins leem
CREATE POLICY "Somente admin lê o audit log"
  ON public.audit_log FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================
-- DADOS INICIAIS — Categorias do Fórum
-- ============================================================
INSERT INTO public.forum_categories (name, slug, description, icon, position) VALUES
  ('Pulverização Agrícola', 'pulverizacao', 'Dúvidas sobre calibração de bicos, caldas e técnicas de pulverização', 'Droplets', 1),
  ('Mapeamento e NDVI', 'mapeamento-ndvi', 'Discussões sobre mapeamento aéreo, sensores multiespectrais e análise de safra', 'Map', 2),
  ('Drones e Equipamentos', 'drones-equipamentos', 'Modelos de drones, manutenção, baterias e acessórios', 'Cpu', 3),
  ('Legislação e ANAC', 'legislacao-anac', 'Regulamentação de voo, habilitação e documentação', 'FileText', 4),
  ('Negócios e Precificação', 'negocios', 'Como precificar serviços, fechar contratos e expandir a empresa', 'TrendingUp', 5),
  ('Dúvidas Gerais', 'duvidas-gerais', 'Espaço aberto para qualquer dúvida da comunidade', 'HelpCircle', 6)
ON CONFLICT (slug) DO NOTHING;
