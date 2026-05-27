/**
 * Tipos TypeScript do banco de dados AgroFly Academy
 * Gerado manualmente com base no schema.sql
 * Em produção, usar: npx supabase gen types typescript --project-id SEU_ID > src/lib/supabase/types.ts
 */

export type Role = 'free' | 'premium' | 'admin'
export type PlanType = 'monthly' | 'lifetime'
export type SubscriptionStatus = 'pending' | 'active' | 'cancelled' | 'failed'

export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  bio: string | null
  role: Role
  premium_since: string | null
  premium_until: string | null
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  user_id: string
  mercadopago_payment_id: string | null
  plan_type: PlanType
  status: SubscriptionStatus
  amount_paid: number | null
  started_at: string | null
  expires_at: string | null
  created_at: string
}

export interface Course {
  id: string
  title: string
  slug: string
  description: string | null
  thumbnail_url: string | null
  is_premium: boolean
  is_published: boolean
  position: number
  created_at: string
  updated_at: string
  // Relacionamentos opcionais (quando consultados com JOIN)
  lessons?: Lesson[]
}

export interface Lesson {
  id: string
  course_id: string
  title: string
  description: string | null
  youtube_video_id: string
  duration_seconds: number | null
  is_premium: boolean
  is_published: boolean
  position: number
  created_at: string
  // Relacionamentos opcionais
  progress?: LessonProgress
}

export interface LessonProgress {
  id: string
  user_id: string
  lesson_id: string
  is_completed: boolean
  last_watched_at: string | null
}

export interface ForumCategory {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  position: number
  created_at: string
  // Contagens (quando consultadas com COUNT)
  topics_count?: number
}

export interface ForumTopic {
  id: string
  category_id: string
  author_id: string
  title: string
  content: string
  is_pinned: boolean
  is_locked: boolean
  views: number
  created_at: string
  updated_at: string
  // Relacionamentos opcionais
  author?: Profile
  category?: ForumCategory
  replies_count?: number
}

export interface ForumReply {
  id: string
  topic_id: string
  author_id: string
  content: string
  created_at: string
  updated_at: string
  // Relacionamentos opcionais
  author?: Profile
}

export interface Material {
  id: string
  title: string
  description: string | null
  file_path: string
  file_size: number | null
  file_type: string | null
  thumbnail_url: string | null
  is_premium: boolean
  is_published: boolean
  downloads: number
  created_at: string
}

export interface LiveEvent {
  id: string
  title: string
  description: string | null
  youtube_video_id: string | null
  scheduled_at: string
  is_premium: boolean
  is_live: boolean
  created_at: string
}
