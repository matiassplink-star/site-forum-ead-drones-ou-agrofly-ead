// Utilitários de Gerenciamento de Estado Local e Mock de Autenticação

export type UserRole = 'free' | 'premium' | 'admin';

export interface UserSession {
  name: string;
  email: string;
  role: UserRole;
}

export interface ForumReply {
  id: string;
  authorName: string;
  authorRole: UserRole;
  content: string;
  createdAt: string;
}

export interface ForumTopic {
  id: string;
  category: string;
  title: string;
  content: string;
  authorName: string;
  authorRole: UserRole;
  repliesCount: number;
  createdAt: string;
  replies?: ForumReply[];
}

export interface AdminLesson {
  id: string;
  courseId: string;
  title: string;
  youtubeId: string;
  duration: string;
  description: string;
  isPremium: boolean;
}

// Chaves do LocalStorage
const SESSION_KEY = 'ecr_user_session';
const PROGRESS_KEY = 'ecr_completed_lessons';
const TOPICS_KEY = 'ecr_forum_topics';
const NEW_LESSONS_KEY = 'ecr_new_lessons';

// ── SISTEMA DE SESSÃO ──

export function getUserSession(): UserSession | null {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(SESSION_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data) as UserSession;
  } catch {
    return null;
  }
}

export function setUserSession(session: UserSession): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearUserSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SESSION_KEY);
}

// ── PROGRESSO DE AULAS ──

export function getCompletedLessons(): string[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(PROGRESS_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data) as string[];
  } catch {
    return [];
  }
}

export function isLessonCompleted(lessonId: string): boolean {
  const completed = getCompletedLessons();
  return completed.includes(lessonId);
}

export function toggleLessonCompleted(lessonId: string): boolean {
  if (typeof window === 'undefined') return false;
  const completed = getCompletedLessons();
  const index = completed.indexOf(lessonId);
  
  if (index > -1) {
    completed.splice(index, 1); // Remove
  } else {
    completed.push(lessonId); // Adiciona
  }
  
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(completed));
  return index === -1; // Retorna se foi marcado como concluído (true) ou desmarcado (false)
}

// ── FÓRUM LOCAL (discussbase-mock) ──

const MOCK_INITIAL_TOPICS: ForumTopic[] = [
  {
    id: 't-1',
    category: 'Calibração & Bicos',
    title: 'Qual bico usar para vazão de 15L/ha com calda oleosa em soja?',
    content: 'Olá pessoal! Estou iniciando as aplicações com o XAG P100PRO em área de soja e preciso fazer aplicação de calda oleosa. Qual o bico centrífugo atomizador ideal e a rotação que vocês recomendam para evitar deriva e ter boa cobertura?',
    authorName: 'Marcos Rezende',
    authorRole: 'premium',
    repliesCount: 2,
    createdAt: '26/05/2026 às 14:32',
    replies: [
      {
        id: 'r-1',
        authorName: 'Rômulo Nascimento',
        authorRole: 'admin',
        content: 'Marcos, para 15 L/ha com calda oleosa, configure o atomizador rotativo do P100PRO para gotas médias de 130 a 150 micras (rotação em torno de 12.000 RPM). Isso garante penetração excelente no baixeiro sem derivar em ventos normais (até 8 km/h). Evite gotas muito finas para caldas com óleo mineral pesado.',
        createdAt: '26/05/2026 às 16:15'
      },
      {
        id: 'r-2',
        authorName: 'Célio Nascimento',
        authorRole: 'admin',
        content: 'Lembrando de ajustar a altura de voo para 3.5 metros sobre a cultura para o Downwash trabalhar de forma ideal na dispersão da névoa. Faça um teste prévio de compatibilidade física da calda no solo!',
        createdAt: '26/05/2026 às 17:40'
      }
    ]
  },
  {
    id: 't-2',
    category: 'Dúvidas Técnicas',
    title: 'Legislação MAPA e ANAC: Registro de Operador Rural',
    content: 'Amigos, para operar com drones de pulverização em minha própria fazenda, eu preciso emitir o certificado de operador aeroagrícola no MAPA mesmo se a área for própria? Ou apenas a homologação da ANAC já é suficiente?',
    authorName: 'Adilson Souza',
    authorRole: 'free',
    repliesCount: 1,
    createdAt: '25/05/2026 às 10:15',
    replies: [
      {
        id: 'r-3',
        authorName: 'Rômulo Nascimento',
        authorRole: 'admin',
        content: 'Olá Adilson! Sim, de acordo com a Portaria 298 do MAPA, todo aplicador com drone agrícola (Classe 3 - mais de 25kg) precisa de registro, mesmo operando em área própria. Você deve ter o curso de piloto aplicador agrícola (como nossa formação!) e cadastrar sua fazenda como operadora privada. ANAC homologa a aeronave, o MAPA regula a aplicação. Não deixe de fazer o registro para evitar multas pesadas!',
        createdAt: '25/05/2026 às 12:40'
      }
    ]
  }
];

export function getForumTopics(): ForumTopic[] {
  if (typeof window === 'undefined') return MOCK_INITIAL_TOPICS;
  const data = localStorage.getItem(TOPICS_KEY);
  if (!data) {
    localStorage.setItem(TOPICS_KEY, JSON.stringify(MOCK_INITIAL_TOPICS));
    return MOCK_INITIAL_TOPICS;
  }
  try {
    return JSON.parse(data) as ForumTopic[];
  } catch {
    return MOCK_INITIAL_TOPICS;
  }
}

export function saveForumTopics(topics: ForumTopic[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOPICS_KEY, JSON.stringify(topics));
}

export function addForumTopic(category: string, title: string, content: string): ForumTopic | null {
  const session = getUserSession();
  if (!session) return null;
  
  const topics = getForumTopics();
  const newTopic: ForumTopic = {
    id: `t-${Date.now()}`,
    category,
    title,
    content,
    authorName: session.name,
    authorRole: session.role,
    repliesCount: 0,
    createdAt: new Date().toLocaleDateString('pt-BR') + ' às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    replies: []
  };
  
  topics.unshift(newTopic);
  saveForumTopics(topics);
  return newTopic;
}

export function addForumReply(topicId: string, content: string): ForumReply | null {
  const session = getUserSession();
  if (!session) return null;
  
  const topics = getForumTopics();
  const topicIndex = topics.findIndex(t => t.id === topicId);
  if (topicIndex === -1) return null;
  
  const newReply: ForumReply = {
    id: `r-${Date.now()}`,
    authorName: session.name,
    authorRole: session.role,
    content,
    createdAt: new Date().toLocaleDateString('pt-BR') + ' às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  };
  
  if (!topics[topicIndex].replies) {
    topics[topicIndex].replies = [];
  }
  
  topics[topicIndex].replies!.push(newReply);
  topics[topicIndex].repliesCount = topics[topicIndex].replies!.length;
  
  saveForumTopics(topics);
  return newReply;
}

// ── CRIAÇÃO DE AULAS ADMIN ──

export function getAdminLessons(): AdminLesson[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(NEW_LESSONS_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data) as AdminLesson[];
  } catch {
    return [];
  }
}

export function addAdminLesson(lesson: Omit<AdminLesson, 'id'>): AdminLesson {
  const newLessons = getAdminLessons();
  const createdLesson: AdminLesson = {
    ...lesson,
    id: `al-${Date.now()}`
  };
  newLessons.push(createdLesson);
  if (typeof window !== 'undefined') {
    localStorage.setItem(NEW_LESSONS_KEY, JSON.stringify(newLessons));
  }
  return createdLesson;
}
