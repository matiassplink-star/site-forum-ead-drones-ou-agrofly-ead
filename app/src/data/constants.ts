// Constantes de Dados Estáticos da ECR Drones

export interface MethodStep {
  step: string;
  title: string;
  desc: string;
}

export interface TeamMember {
  name: string;
  role: string;
  desc: string;
  avatar: string;
  borderClass: string;
}

export interface Course {
  title: string;
  desc: string;
  duration: string;
  badge: string;
  badgeStyle: string;
  btnText: string;
  btnStyle: string;
  emoji: string;
}

export interface AcademicPlan {
  name: string;
  price: string;
  periodText?: string;
  desc: string;
  features: string[];
  btnText: string;
  btnStyle: string;
  badge?: string;
  featured?: boolean;
}

export interface ComparativeIndicator {
  indicator: string;
  conventional: string;
  ecr: string;
}

// 1. Passos do Método de Trabalho
export const METHOD_STEPS: MethodStep[] = [
  {
    step: '01',
    title: 'Planejamento e Mapeamento',
    desc: 'Mapeamos previamente a propriedade com drone de escaneamento, identificando obstáculos e gerando um plano operacional com precisão centimétrica.'
  },
  {
    step: '02',
    title: 'Calibração Conforme Recomendação',
    desc: 'Calibramos o equipamento conforme a recomendação técnica de cada defensivo, ajustando tamanho de gotas, vazão e parâmetros específicos de voo.'
  },
  {
    step: '03',
    title: 'Apoio em Solo Organizado',
    desc: 'Mantemos uma equipe de suporte organizada em solo para reabastecimento ultrarrápido de calda e troca de baterias, maximizando as janelas operacionais.'
  }
];

// 2. Equipe Técnica Operacional
export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Rômulo Nascimento',
    role: 'Gestão Técnica Especializada',
    desc: 'Planejamento baseado nas condições reais da lavoura, calibração e telemetria de aplicação.',
    avatar: '👨‍🌾',
    borderClass: 'border-brand-green'
  },
  {
    name: 'Célio Nascimento',
    role: 'Gestor e Piloto',
    desc: 'Comando operacional das aeronaves, controle de voo em campo e apoio logístico.',
    avatar: '👨‍✈️',
    borderClass: 'border-brand-blue-sky'
  }
];

// 3. Cursos da Escola de Capacitação Rural
export const COURSES: Course[] = [
  {
    title: 'Introdução aos Drones no Agro',
    desc: 'Entenda os modelos de drone, legislação da ANAC e DECEA, conceitos aeronáuticos e cenários comerciais no Brasil.',
    duration: '8 Aulas • 3 horas',
    badge: 'Gratuito',
    badgeStyle: 'bg-brand-green/25 text-brand-green border-brand-green/30',
    btnText: 'Começar Curso Grátis',
    btnStyle: 'bg-white/5 border border-white/10 hover:bg-white/10 text-white',
    emoji: '🎯'
  },
  {
    title: 'Mapeamento Aéreo e NDVI',
    desc: 'Aprenda a planejar voos autônomos, processar imagens multiespectrais e gerar mapas NDVI no Pix4D e QGIS.',
    duration: '14 Aulas • 6 horas',
    badge: 'Incluso na Formação',
    badgeStyle: 'bg-brand-blue-sky/25 text-brand-blue-sky border-brand-blue-sky/30',
    btnText: 'Ver Planos Abaixo',
    btnStyle: 'bg-brand-blue-sky hover:bg-brand-blue-sky/90 text-white',
    emoji: '🗺️'
  },
  {
    title: 'Pulverização Autônoma Avançada',
    desc: 'Operação de drones pesados, calibração profissional de bicos, controle de derivas e manuseio prático de baterias.',
    duration: '18 Aulas • 8 horas',
    badge: 'Incluso na Formação',
    badgeStyle: 'bg-brand-amber/25 text-brand-amber border-brand-amber/30',
    btnText: 'Ver Planos Abaixo',
    btnStyle: 'bg-brand-amber hover:bg-brand-amber/90 text-brand-black shadow-[0_0_20px_rgba(245,127,23,0.3)]',
    emoji: '💧'
  }
];

// 4. Planos Acadêmicos
export const ACADEMIC_PLANS: AcademicPlan[] = [
  {
    name: 'Gratuito',
    price: 'R$ 0,00',
    desc: 'Acesso vitalício para introdução agro',
    features: [
      'Curso introdutório básico de drones',
      'Participação básica no fórum',
      'Newsletters técnicas semanais do agro',
      '3 materiais para download'
    ],
    btnText: 'Cadastrar Grátis',
    btnStyle: 'bg-white/5 border border-white/10 hover:bg-white/10 text-white'
  },
  {
    name: 'Fórum & Comunidade',
    price: 'R$ 97,90',
    periodText: ' / mês',
    desc: 'Comunidade operacional ativa',
    features: [
      'Acesso ilimitado ao Fórum de Operadores de Elite',
      'Suporte técnico direto da comunidade profissional',
      'Lives mensais exclusivas com Rômulo Nascimento',
      'Downloads ilimitados de boletins técnicos',
      'Ideal para troca de caldas e calibrações'
    ],
    btnText: 'Assinar Fórum →',
    btnStyle: 'bg-brand-blue-sky hover:bg-brand-blue-sky/90 text-white'
  },
  {
    name: 'Formação Completa',
    price: 'R$ 1.497,00',
    desc: 'Pagamento único — Acesso Vitalício',
    features: [
      'Todos os cursos avançados (NDVI + Pulverização)',
      'Suporte direto de 12 meses com instrutores de campo',
      'Certificado oficial de conclusão com validade nacional',
      '1 Ano de acesso gratuito à Comunidade/Fórum incluso',
      'Acesso a atualizações vitalícias das videoaulas'
    ],
    btnText: 'Comprar Formação →',
    btnStyle: 'bg-brand-amber hover:bg-brand-amber/90 text-brand-black shadow-[0_0_30px_rgba(245,127,23,0.35)]',
    badge: 'Formação de Elite',
    featured: true
  }
];

// 5. Indicadores Comparativos (Tabela)
export const COMPARATIVE_INDICATORS: ComparativeIndicator[] = [
  {
    indicator: 'Perda por amassamento',
    conventional: '2,5% a 4% da área produtiva',
    ecr: '0% (Voo Livre)'
  },
  {
    indicator: 'Compactação do solo',
    conventional: 'Alta compactação física',
    ecr: 'Zero Compactação'
  },
  {
    indicator: 'Consumo de água',
    conventional: '150 a 200 L/ha',
    ecr: '10 a 15 L/ha'
  },
  {
    indicator: 'Acesso a áreas difíceis',
    conventional: 'Limitado por inclinação/atolamentos',
    ecr: '100% de Acesso'
  },
  {
    indicator: 'Velocidade de aplicação',
    conventional: 'Variável de acordo com o terreno',
    ecr: '10 a 50 km/hora (Consistente)'
  },
  {
    indicator: 'Risco de deriva',
    conventional: 'Médio',
    ecr: 'Controlado sob prescrição'
  }
];
