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
    repliesCount: 3,
    createdAt: '26/05/2026 às 14:32',
    replies: [
      { id: 'r-1', authorName: 'Rômulo Nascimento', authorRole: 'admin', content: 'Marcos, para 15 L/ha com calda oleosa, configure o atomizador rotativo do P100PRO para gotas médias de 130 a 150 micras (rotação em torno de 12.000 RPM). Isso garante penetração excelente no baixeiro sem derivar em ventos normais (até 8 km/h). Evite gotas muito finas para caldas com óleo mineral pesado.', createdAt: '26/05/2026 às 16:15' },
      { id: 'r-2', authorName: 'Célio Nascimento', authorRole: 'admin', content: 'Lembrando de ajustar a altura de voo para 3.5 metros sobre a cultura para o Downwash trabalhar de forma ideal na dispersão da névoa. Faça um teste prévio de compatibilidade física da calda no solo!', createdAt: '26/05/2026 às 17:40' },
      { id: 'r-2b', authorName: 'Fernanda Costa', authorRole: 'premium', content: 'Tive problema com espuma justamente por misturar adjuvante oleoso sem checar a compatibilidade. Perdi 20 litros de calda. Agora faço o teste de jarra sempre antes de ir a campo!', createdAt: '26/05/2026 às 18:22' }
    ]
  },
  {
    id: 't-2',
    category: 'Dúvidas Técnicas',
    title: 'Legislação MAPA e ANAC: Registro de Operador Rural',
    content: 'Amigos, para operar com drones de pulverização em minha própria fazenda, eu preciso emitir o certificado de operador aeroagrícola no MAPA mesmo se a área for própria? Ou apenas a homologação da ANAC já é suficiente?',
    authorName: 'Adilson Souza',
    authorRole: 'free',
    repliesCount: 2,
    createdAt: '25/05/2026 às 10:15',
    replies: [
      { id: 'r-3', authorName: 'Rômulo Nascimento', authorRole: 'admin', content: 'Olá Adilson! Sim, de acordo com a Portaria 298 do MAPA, todo aplicador com drone agrícola (Classe 3 - mais de 25kg) precisa de registro, mesmo operando em área própria. Você deve ter o curso de piloto aplicador agrícola e cadastrar sua fazenda como operadora privada. ANAC homologa a aeronave, o MAPA regula a aplicação. Não deixe de fazer o registro para evitar multas pesadas!', createdAt: '25/05/2026 às 12:40' },
      { id: 'r-3b', authorName: 'Carlos Eduardo', authorRole: 'premium', content: 'Confirmo! Passei por fiscalização do MAPA no Mato Grosso sem o certificado e quase fui multado em R$15.000. Fiz o curso aqui da ECR e regularizei tudo em menos de 30 dias. Vale muito a pena!', createdAt: '25/05/2026 às 14:05' }
    ]
  },
  {
    id: 't-3',
    category: 'Calibração & Bicos',
    title: 'DJI T40 vs XAG P100PRO: qual compensa mais para soja no cerrado?',
    content: 'Estou na dúvida entre o DJI Agras T40 e o XAG P100PRO para aplicar em lavoura de 3.200 ha de soja no Mato Grosso. Alguém aqui já usou os dois? Qual tem menor custo de manutenção e melhor autonomia de voo com carregamento pesado?',
    authorName: 'Roberto Almeida',
    authorRole: 'premium',
    repliesCount: 4,
    createdAt: '24/05/2026 às 08:45',
    replies: [
      { id: 'r-4', authorName: 'Rômulo Nascimento', authorRole: 'admin', content: 'Roberto, ambos são excelentes. O T40 tem IA de detecção de terreno e sistema de radar de rotor que facilita o trabalho em relevos. O P100PRO tem custo de bateria menor a longo prazo e peças de reposição mais acessíveis no Brasil. Para 3.200 ha, recomendo trabalhar com 2 aeronaves de qualquer marca — garante operação mesmo com manutenção de uma delas.', createdAt: '24/05/2026 às 10:20' },
      { id: 'r-5', authorName: 'Sandro Santos', authorRole: 'premium', content: 'Tenho o T40 há 8 meses. Já fiz mais de 6.200 ha. A manutenção é cara sim, mas o suporte técnico da DJI no Brasil melhorou muito. A principal vantagem é a integração com o DJI Pilot 2 que automatiza bastante o planejamento de voo.', createdAt: '24/05/2026 às 11:35' },
      { id: 'r-6', authorName: 'Ana Paula Mendes', authorRole: 'premium', content: 'Aqui no Paraná optei pelo P100PRO. O sistema de filtragem de calda é superior e a vedação dos bicos dura muito mais. Para soja sem muito relevo, ele performa excelente.', createdAt: '24/05/2026 às 14:10' },
      { id: 'r-7', authorName: 'Célio Nascimento', authorRole: 'admin', content: 'Dica prática: peça uma demonstração no campo com a fazenda em mãos. A performance real com 40L de calda e vento de 6 km/h é bem diferente dos specs técnicos do catálogo.', createdAt: '24/05/2026 às 16:00' }
    ]
  },
  {
    id: 't-4',
    category: 'Negócios & Campo',
    title: 'Como precificar o hectare de pulverização com drone para entrar no mercado?',
    content: 'Sou piloto certificado há 3 meses e tenho um T40. Quero começar a oferecer serviços para produtores da minha região (Triângulo Mineiro). Qual a média cobrada por hectare e como faço para apresentar uma proposta profissional?',
    authorName: 'Juliana Ferreira',
    authorRole: 'premium',
    repliesCount: 3,
    createdAt: '23/05/2026 às 15:20',
    replies: [
      { id: 'r-8', authorName: 'Rômulo Nascimento', authorRole: 'admin', content: 'Juliana, o preço médio no Triângulo Mineiro em 2026 está entre R$22 a R$38 por hectare dependendo da cultura e dificuldade de acesso. Para entrar no mercado, R$24-R$28/ha é competitivo. NUNCA cobre abaixo do custo operacional. Calcule primeiro seu custo por hora de voo: bateria, desgaste, combustível do gerador.', createdAt: '23/05/2026 às 17:00' },
      { id: 'r-9', authorName: 'Marcos Rezende', authorRole: 'premium', content: 'Monte uma planilha de custo: depreciação do drone (vida útil ~800h), custo de bateria por ciclo, combustível do gerador (média 1L/h), mão de obra de apoio e seguro. Isso te dá o piso. Eu cobro R$29/ha em Uberaba e tenho fila de espera.', createdAt: '23/05/2026 às 19:45' },
      { id: 'r-10', authorName: 'Rodrigo Ramos', authorRole: 'premium', content: 'Apresente sempre o relatório de aplicação após o serviço: horário, área coberta, clima e mapa do talhão. Isso mostra profissionalismo e fideliza o produtor. O próprio software de missão já gera tudo isso automaticamente.', createdAt: '24/05/2026 às 07:30' }
    ]
  },
  {
    id: 't-5',
    category: 'Dúvidas Técnicas',
    title: 'Erro no SARPAS: DECEA não aprova plano de voo próximo a aeródromo',
    content: 'Tentei registrar um plano de voo no SARPAS para uma fazenda a 12 km do aeroporto municipal. O sistema rejeitou automaticamente citando zona de proteção de aeródromo. Como resolver? O produtor está urgente e a janela de pulverização fecha em 2 dias.',
    authorName: 'Adilson Souza',
    authorRole: 'free',
    repliesCount: 2,
    createdAt: '22/05/2026 às 20:10',
    replies: [
      { id: 'r-11', authorName: 'Rômulo Nascimento', authorRole: 'admin', content: 'Para áreas em raio de 10km de aeródromo, você precisa protocolar uma ATO (Autorização de Tráfego Operacional) diretamente no DECEA via e-mail. O processo leva 1 a 3 dias úteis. A alternativa emergencial é contato direto com a torre do aeródromo para autorização verbal documentada — depende do porte do aeroporto.', createdAt: '22/05/2026 às 21:50' },
      { id: 'r-12', authorName: 'Sandro Santos', authorRole: 'premium', content: 'Passei por isso em Uberlândia. Liguei para a torre do aeroporto local e expliquei a situação. Liberaram por rádio com condicionantes de horário (fora do horário de pouso/decolagem). Guarde o registro do contato por escrito!', createdAt: '22/05/2026 às 23:15' }
    ]
  },
  {
    id: 't-6',
    category: 'Negócios & Campo',
    title: 'Primeiro mês como prestador de serviço: resultados reais',
    content: 'Pessoal, quero compartilhar os resultados do meu primeiro mês oficial prestando serviço de pulverização com drone. Finalizei 287 ha em 18 dias de trabalho efetivo. Vou detalhar os números para ajudar quem está começando!',
    authorName: 'Carlos Eduardo',
    authorRole: 'premium',
    repliesCount: 3,
    createdAt: '19/05/2026 às 08:00',
    replies: [
      { id: 'r-13', authorName: 'Carlos Eduardo', authorRole: 'premium', content: '📊 NÚMEROS: 287 ha aplicados • Ticket médio: R$26,50/ha • Faturamento bruto: R$7.605,50 • Custos operacionais: R$1.840,00 • Resultado líquido: R$5.765,50. Drone: DJI T40. Média diária: 16 ha/dia com 2 baterias em rodízio + gerador 5kW.', createdAt: '19/05/2026 às 08:30' },
      { id: 'r-14', authorName: 'Juliana Ferreira', authorRole: 'premium', content: 'Carlos, muito obrigada! Isso é extremamente útil. Uma dúvida: os 16 ha/dia foram em área contínua ou com deslocamento entre fazendas? O tempo de logística é o que mais me preocupa.', createdAt: '19/05/2026 às 10:15' },
      { id: 'r-15', authorName: 'Rômulo Nascimento', authorRole: 'admin', content: 'Excelente resultado para o primeiro mês! Dentro da curva esperada. Com o tempo você vai otimizar as rotas e chegar facilmente a 25-30 ha/dia com planejamento eficiente de missão. Parabéns pelo início profissional!', createdAt: '19/05/2026 às 12:00' }
    ]
  },
  {
    id: 't-7',
    category: 'Calibração & Bicos',
    title: 'Como configurar o NDVI corretamente no Pix4D para lavoura de cana?',
    content: 'Terminei o mapeamento multiespectral da minha área de cana-de-açúcar. No Pix4D, ao gerar o mapa NDVI, os valores estão todos na faixa de 0.72 a 0.81 — parece alto demais para uma área que tem manchas de deficiência visível a olho nu. Estou errando em alguma calibração?',
    authorName: 'Fernanda Costa',
    authorRole: 'premium',
    repliesCount: 2,
    createdAt: '21/05/2026 às 09:30',
    replies: [
      { id: 'r-16', authorName: 'Rômulo Nascimento', authorRole: 'admin', content: 'Fernanda, o problema mais comum é a calibração da placa de reflectância. Você fotografou a placa ANTES de decolar e DEPOIS da missão, com condições iguais de luz? Se a calibração for feita com o sol em ângulo diferente, o Pix4D distorce os valores. No menu: Processing Options > Index Calculator > confirme que aplicou a calibração radiométrica.', createdAt: '21/05/2026 às 11:15' },
      { id: 'r-17', authorName: 'Ana Paula Mendes', authorRole: 'premium', content: 'Também pode ser reflexo de palha sobre o solo. A cana em rebrota tem o índice mascarado. Experimente calcular o EVI (Enhanced Vegetation Index) como complemento — ele é menos sensível ao solo exposto.', createdAt: '21/05/2026 às 13:40' }
    ]
  },
  {
    id: 't-8',
    category: 'Dúvidas Técnicas',
    title: 'Vale a pena contratar o seguro RETA para drones agrícolas?',
    content: 'O seguro RETA é obrigatório para operar com drones acima de 250g pela ANAC. Mas além da obrigação legal, ele realmente cobre bem em caso de acidente? Alguém aqui já precisou acionar?',
    authorName: 'Rodrigo Ramos',
    authorRole: 'premium',
    repliesCount: 2,
    createdAt: '20/05/2026 às 16:00',
    replies: [
      { id: 'r-18', authorName: 'Rômulo Nascimento', authorRole: 'admin', content: 'O seguro RETA é essencial e vai além da exigência legal. Tivemos um caso onde o drone teve falha de ESC e caiu em área de pivô central. O seguro cobriu 100% dos danos ao equipamento de irrigação (R$18.400). A franquia foi baixa. Contrate com seguradora especializada em aviação, não com seguro genérico!', createdAt: '20/05/2026 às 18:20' },
      { id: 'r-19', authorName: 'Sandro Santos', authorRole: 'premium', content: 'Tenho o RETA há 2 anos pela Tokio Marine Agro. R$1.680/ano para R$200.000 de cobertura. Já vi um colega acionar após colisão com linha de alta tensão em SP. Pagou tudo. Essencial para operar com profissionalismo.', createdAt: '20/05/2026 às 20:10' }
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
