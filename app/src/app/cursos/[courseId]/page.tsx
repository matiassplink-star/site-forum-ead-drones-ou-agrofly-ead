"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import ECRDronesLogo from '@/components/ECRDronesLogo';
import { 
  getUserSession, setUserSession, getCompletedLessons, 
  toggleLessonCompleted, getAdminLessons, UserSession 
} from '@/lib/mockAuth';
import { 
  ArrowLeft, CheckCircle2, Lock, PlayCircle, BookOpen, Clock, 
  CheckSquare, Square, ChevronRight, X, Sparkles, Award, Star, Compass, MessageSquare,
  Send, Trash2, FileText, Download, Play, FastForward, Shield, Check, HelpCircle, ChevronDown, ChevronUp
} from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  youtubeId: string;
  duration: string;
  desc: string;
  isPremium: boolean;
}

interface ForumComment {
  id: string;
  author: string;
  role: string;
  avatar: string;
  text: string;
  date: string;
  upvotes: number;
  userUpvoted?: boolean;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export default function SalaDeAulaPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;

  const [session, setSession] = useState<UserSession | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [successUpgrade, setSuccessUpgrade] = useState(false);

  // Player & Config
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [autoplayNext, setAutoplayNext] = useState<boolean>(true);
  
  // XP & Gamificação
  const [userXP, setUserXP] = useState<number>(0);
  const [xpAnimation, setXpAnimation] = useState<string | null>(null);

  // Notas (Seção sanfona)
  const [notesOpen, setNotesOpen] = useState<boolean>(false);
  const [currentNotes, setCurrentNotes] = useState<string>('');
  const [notesStatus, setNotesStatus] = useState<'salvo' | 'salvando' | ''>('');

  // Downloads (Seção sanfona)
  const [downloadsOpen, setDownloadsOpen] = useState<boolean>(false);
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);

  // Fórum / Comentários Permanente
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [newCommentText, setNewCommentText] = useState<string>('');

  // Prova / Quiz (Bloqueado por padrão, libera ao finalizar a aula)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0); 
  const [quizPassed, setQuizPassed] = useState<boolean>(false);

  // Certificado
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Dados das Aulas Estáticas
  const STATIC_LESSONS: Record<string, Omit<Lesson, 'id'>[]> = {
    introducao: [
      {
        title: 'O Panorama dos Drones no Agronegócio Brasileiro',
        youtubeId: 'e74v1J-sM20',
        duration: '15 min',
        desc: 'Conheça o crescimento exponencial do mercado de pulverização aérea, as principais culturas beneficiadas e os modelos de negócios ativos no país hoje.',
        isPremium: false,
      },
      {
        title: 'Regulamentação Aeronáutica ANAC (RBAC 94)',
        youtubeId: 'mO_K53iZfQ8',
        duration: '22 min',
        desc: 'Entenda os requisitos regulamentares da ANAC para voar aeronaves Classe 3 (mais de 25kg), cadastro de pilotos, seguro RETA obrigatório e como evitar sanções administrativas.',
        isPremium: false,
      },
      {
        title: 'Regras do DECEA e Cadastro SARPAS',
        youtubeId: 'Wz9jKx4x3qY',
        duration: '18 min',
        desc: 'Aprenda a cadastrar seus drones e pilotos no portal SARPAS do DECEA e solicitar janelas de espaço aéreo operacional com agilidade técnica antes das aplicações de campo.',
        isPremium: false,
      },
      {
        title: 'Principais Oportunidades Comerciais no Campo',
        youtubeId: '3H4a7g-S48s',
        duration: '25 min',
        desc: 'Análise detalhada sobre custos operacionais de voo, taxas médias cobradas por hectare, negociação com grandes produtores e estratégias de entrada no mercado agro.',
        isPremium: false,
      }
    ],
    mapeamento: [
      {
        title: 'Conceitos de Fotogrametria e Resolução Espacial GSD',
        youtubeId: 'Q21Z9r1_v70',
        duration: '20 min',
        desc: 'Descubra a ciência da fotogrametria aérea aplicada no agro, cálculo da resolução do pixel em solo (GSD) e a importância do overlap (sobreposição de fotos) para ortomosaicos perfeitos.',
        isPremium: true,
      },
      {
        title: 'Planejamento de Voo Autônomo e Altura de Voo',
        youtubeId: 'n0t7J7v4bF4',
        duration: '18 min',
        desc: 'Passo a passo prático de como criar planos de varredura tridimensional utilizando softwares de telemetria autônoma e definindo a sobreposição ideal de imagens multiespectrais.',
        isPremium: true,
      },
      {
        title: 'Processamento de Imagens e Mosaico no Pix4D',
        youtubeId: 'x9J7H-K1_j4',
        duration: '30 min',
        desc: 'Aprenda a importar fotos brutas no Pix4D Mapper, alinhar câmeras, calibrar sensores multiespectrais com placas de reflectância e gerar ortomosaicos de alta definição.',
        isPremium: true,
      },
      {
        title: 'Análise de Índices de Vegetação NDVI no QGIS',
        youtubeId: 'eE04p4f9z1Y',
        duration: '28 min',
        desc: 'Abra ortomosaicos multiespectrais no QGIS, utilize a calculadora raster para extrair bandas vermelha e infravermelha, gere mapas de índice NDVI e crie zonas de prescrição de pulverização variada.',
        isPremium: true,
      }
    ],
    pulverizacao: [
      {
        title: 'Anatomia e Calibração dos Drones de Pulverização',
        youtubeId: 'c00iNpxp17g',
        duration: '25 min',
        desc: 'Estudo prático dos sistemas de fluxo, bombas de pressão e atomizadores rotativos de drones pesados como o DJI T40/T50 e o XAG P100 Pro.',
        isPremium: true,
      },
      {
        title: 'Escolha e Ajustes de Bicos e Atomizadores',
        youtubeId: 'd6y7Z-P5w_k',
        duration: '22 min',
        desc: 'Aprenda a escolher o tamanho ideal de gotas (médias a grossas) dependendo do produto químico, ajustando a vazão em litros por minuto e rotação do disco para máxima deposição de calda.',
        isPremium: true,
      },
      {
        title: 'Controle de Derivas sob Diferentes Condições de Vento',
        youtubeId: 't7J6f4Y2x7o',
        duration: '20 min',
        desc: 'Técnicas essenciais de meteorologia prática: medição de vento com termoanemômetro, umidade relativa mínima do ar operacional e como reajustar faixas de segurança no Downwash.',
        isPremium: true,
      },
      {
        title: 'Prescrição Tridimensional e Downwash no Solo',
        youtubeId: '9oJ7L4y2bF4',
        duration: '32 min',
        desc: 'Compreenda a física do fluxo de ar descendente (Downwash) empurrando as gotas para o interior da folhagem da cultura, evitando derivas mecânicas e aplicando em terrenos de alta declividade.',
        isPremium: true,
      }
    ]
  };

  // MOCK DE QUIZZES / PROVAS POR AULA
  const QUIZ_DATA: Record<string, QuizQuestion[]> = {
    'introducao-l-1': [
      {
        question: 'Qual o principal benefício da pulverização com drone em relação ao trator convencional?',
        options: ['Capacidade do tanque de calda maior', 'Eliminação completa do amassamento da cultura e compactação do solo', 'Voo sem necessidade de pilhas/baterias'],
        correctIndex: 1
      },
      {
        question: 'O mercado de aviação de drones agrícolas no Brasil está em qual cenário?',
        options: ['Estagnação por falta de culturas compatíveis', 'Forte expansão, especialmente em soja, milho, cana e pastagem', 'Proibição total em lavouras de exportação'],
        correctIndex: 1
      }
    ],
    'introducao-l-2': [
      {
        question: 'Segundo o regulamento RBAC 94 da ANAC, drones de pulverização comercial (Classe 3, acima de 25 kg de PMD) exigem:',
        options: ['Cadastro SISANT simplificado', 'Habilitação de piloto, registro do drone e seguro RETA obrigatório', 'Nenhum requisito legal por voar baixo'],
        correctIndex: 1
      },
      {
        question: 'O seguro obrigatório de responsabilidade civil aeronáutico para danos a terceiros chama-se:',
        options: ['Seguro DPVAT', 'Seguro Rural Agrícola', 'Seguro RETA'],
        correctIndex: 2
      }
    ],
    'introducao-l-3': [
      {
        question: 'Qual a utilidade prática do sistema SARPAS do DECEA?',
        options: ['Comprar defensivos agrícolas com desconto', 'Solicitar e obter autorização de acesso ao espaço aéreo para voos', 'Calibrar o sinal GPS do receptor RTK'],
        correctIndex: 1
      },
      {
        question: 'Ao planejar um voo de drone agro, o operador deve requisitar autorização no DECEA com qual antecedência recomendada?',
        options: ['Pelo menos algumas horas antes da decolagem via janelas reguladas', 'Nenhuma, se a fazenda for de propriedade privada', '3 meses antes de começar a plantar'],
        correctIndex: 0
      }
    ],
    'introducao-l-4': [
      {
        question: 'Qual a faixa de preço médio cobrada por hectare pulverizado no mercado brasileiro atual?',
        options: ['R$ 5,00 a R$ 10,00', 'R$ 80,00 a R$ 180,00 dependendo da cultura e logística', 'R$ 600,00 a R$ 900,00'],
        correctIndex: 1
      },
      {
        question: 'Para demonstrar viabilidade comercial a um produtor de grãos, o principal argumento é:',
        options: ['O design futurista do drone ECR Drones', 'O ganho produtivo pelo fim do amassamento das plantas', 'A velocidade de voo acima de 120 km/h'],
        correctIndex: 1
      }
    ],
    'mapeamento-l-1': [
      {
        question: 'O que representa o parâmetro GSD (Ground Sample Distance) no mapeamento aéreo?',
        options: ['A distância do drone até o controle remoto', 'O tamanho real no solo representado por cada pixel da imagem', 'A quantidade de fotos tiradas por minuto'],
        correctIndex: 1
      },
      {
        question: 'Para conseguir um GSD menor (mais detalhes e alta resolução por pixel), o operador deve:',
        options: ['Aumentar a altura do voo', 'Reduzir a altura de voo operacional', 'Aumentar a velocidade lateral do drone'],
        correctIndex: 1
      }
    ],
    'mapeamento-l-2': [
      {
        question: 'Qual a sobreposição longitudinal (overlap) recomendada para ortomosaicos de precisão?',
        options: ['20% a 30%', '50% a 60%', '75% a 85%'],
        correctIndex: 2
      },
      {
        question: 'Em voos multiespectrais, a variação do relevo exige qual funcionalidade do software de telemetria?',
        options: ['Terrain Following (Acompanhamento ativo de terreno)', 'Modo esporte livre', 'Apenas radar frontal desativado'],
        correctIndex: 0
      }
    ],
    'mapeamento-l-3': [
      {
        question: 'Para que serve a placa de reflectância radiométrica tirada em solo antes do voo?',
        options: ['Garantir que a câmera está bem encaixada', 'Calibrar a variação de luz solar e obter valores NDVI absolutos e confiáveis', 'Proteger as lentes contra detritos'],
        correctIndex: 1
      },
      {
        question: 'O resultado do processamento fotogramétrico no Pix4D que corrige as distorções de relevo é o:',
        options: ['Mapa vetorial de estradas', 'Ortomosaico métrico georreferenciado', 'Arquivo de áudio da missão'],
        correctIndex: 1
      }
    ],
    'mapeamento-l-4': [
      {
        question: 'O índice NDVI baseia-se em qual comportamento da vegetação saudável?',
        options: ['Absorver muito infravermelho próximo e refletir vermelho', 'Refletir intensamente o infravermelho próximo e absorver o vermelho visível', 'Refletir toda a luz visível branca'],
        correctIndex: 1
      },
      {
        question: 'No QGIS, qual módulo faz a álgebra de bandas para gerar o mapa NDVI final?',
        options: ['Calculadora Raster', 'Criador de Vetores', 'Plugin Google Maps'],
        correctIndex: 0
      }
    ],
    'pulverizacao-l-1': [
      {
        question: 'Qual a função do atomizador rotativo em drones como o DJI T40 e XAG P100?',
        options: ['Filtrar resíduos de calda do tanque', 'Ajustar eletronicamente o tamanho das gotas variando a rotação do prato centrífugo', 'Misturar a calda no tanque em tempo real'],
        correctIndex: 1
      },
      {
        question: 'Qual a conduta ideal para estender a vida útil das baterias agrícolas inteligentes?',
        options: ['Carregar imediatamente após o pouso enquanto estão quentes', 'Armazenar em tensão de storage (~50%) e evitar descarga total ou sobrecarga prolongada', 'Guardá-las descarregadas por longos meses'],
        correctIndex: 1
      }
    ],
    'pulverizacao-l-2': [
      {
        question: 'Qual a taxa de aplicação de calda por hectare usual na pulverização com drones no Brasil?',
        options: ['100 a 250 Litros/ha', '1 a 3 Litros/ha', '10 a 20 Litros/ha (baixo volume com gotas calibradas)'],
        correctIndex: 2
      },
      {
        question: 'Para aplicar inseticidas sistêmicos sob brisa suave, qual tamanho de gota é o mais seguro?',
        options: ['Gotas finas (névoa de 80 micras)', 'Gotas médias a grossas (150 a 250 micras) para evitar deriva', 'Gotas gigantescas de 800 micras'],
        correctIndex: 1
      }
    ],
    'pulverizacao-l-3': [
      {
        question: 'A velocidade do vento operacional limite para pulverização aérea segura com drone agrícola é de:',
        options: ['Até 12 a 15 km/h (ventos moderados)', 'Até 45 km/h', 'Operar apenas com calmaria absoluta (vento zero)'],
        correctIndex: 0
      },
      {
        question: 'A aplicação com vento zero absoluto (calmaria total) é contraindicada porque:',
        options: ['Impede o drone de decolar de forma segura', 'Pode causar inversão térmica e deixar a névoa flutuando em suspensão, gerando deriva invisível', 'Descarrega a bateria mais rápido'],
        correctIndex: 1
      }
    ],
    'pulverizacao-l-4': [
      {
        question: 'O efeito "Downwash" gerado pelas hélices dos drones pesados auxilia na:',
        options: ['Limpeza automática do bocal de recarga', 'Deposição forçada das gotas dentro da folhagem da planta (canopy)', 'Otimização do GPS para decolagem automática'],
        correctIndex: 1
      },
      {
        question: 'Em declividades acentuadas, o que garante a altura de voo constante de 3m sobre as copas?',
        options: ['Habilidade manual extrema do operador', 'Radar de acompanhamento altimétrico ativo (Terrain Following)', 'A bússola magnética externa'],
        correctIndex: 1
      }
    ]
  };

  // MOCK DE COMENTÁRIOS DO FÓRUM POR AULA
  const MOCK_COMMENTS: Record<string, ForumComment[]> = {
    'introducao-l-1': [
      { id: 'c-1', author: 'Roberto Santos', role: 'Aluno Premium', avatar: 'RS', text: 'Muito boa essa aula introdutória! Aqui no interior de SP o cultivo de cana está absorvendo muitos pilotos com drone T40.', date: 'Há 2 dias', upvotes: 5 },
      { id: 'c-2', author: 'Rômulo Nascimento', role: 'Instrutor Chefe', avatar: 'RN', text: 'Exato, Roberto! O rendimento operacional na cana chega a impressionar e o retorno do investimento é muito rápido se planejado corretamente.', date: 'Há 1 dia', upvotes: 9 }
    ],
    'introducao-l-2': [
      { id: 'c-3', author: 'Fernanda Lima', role: 'Aluna', avatar: 'FL', text: 'Essa aula sobre a ANAC tirou todas as minhas dúvidas. O seguro RETA é obrigatório mesmo se eu voar apenas na minha própria fazenda?', date: 'Há 3 dias', upvotes: 2 },
      { id: 'c-4', author: 'Rômulo Nascimento', role: 'Instrutor Chefe', avatar: 'RN', text: 'Sim, Fernanda! A legislação da ANAC RBAC-94 exige o seguro RETA para qualquer operação aérea de drones de uso profissional (pulverização), mesmo dentro de propriedade privada.', date: 'Há 2 dias', upvotes: 7 }
    ],
    'introducao-l-3': [
      { id: 'c-5', author: 'João Pedro', role: 'Aluno Premium', avatar: 'JP', text: 'No portal SARPAS, a liberação de voo tem sido rápida para vocês? Aqui na minha região às vezes demora um pouco.', date: 'Há 4 dias', upvotes: 1 },
      { id: 'c-6', author: 'Célio Nascimento', role: 'Instrutor', avatar: 'CN', text: 'João, se você enviar o plano usando os parâmetros de janelas automáticas (voos em espaço aéreo não restrito e abaixo de 40m de altura), a aprovação é imediata em 90% das vezes pelo algoritmo do DECEA!', date: 'Há 3 dias', upvotes: 6 }
    ],
    'introducao-l-4': [
      { id: 'c-7', author: 'Gustavo Nogueira', role: 'Aluno', avatar: 'GN', text: 'Qual planilha de custo vocês recomendam para começar a cobrar do produtor rural?', date: 'Há 5 dias', upvotes: 3 },
      { id: 'c-8', author: 'Rômulo Nascimento', role: 'Instrutor Chefe', avatar: 'RN', text: 'Gustavo, veja na seção "Material de Apoio" abaixo! Anexei uma planilha de custos operacionais e margem de lucro ideal para iniciantes.', date: 'Há 4 dias', upvotes: 12 }
    ]
  };

  // Carrega configurações, XP e dados da aula ao carregar ou trocar de lição
  useEffect(() => {
    const activeSession = getUserSession();
    if (!activeSession) {
      router.push('/auth');
      return;
    }
    
    const isPremiumCourse = courseId === 'mapeamento' || courseId === 'pulverizacao';
    if (isPremiumCourse && activeSession.role === 'free') {
      setSession(activeSession);
      setShowCheckoutModal(true);
      return;
    }

    setSession(activeSession);

    // Progresso de aulas concluídas
    const completed = getCompletedLessons();
    setCompletedLessons(completed);

    // XP
    const savedXP = localStorage.getItem('user_xp');
    if (savedXP) {
      setUserXP(parseInt(savedXP, 10));
    } else {
      localStorage.setItem('user_xp', '150'); 
      setUserXP(150);
    }

    // Carrega grade de aulas
    const baseLessons = STATIC_LESSONS[courseId] || [];
    const baseLessonsWithIds = baseLessons.map((l, idx) => ({
      ...l,
      id: `${courseId}-l-${idx + 1}`
    }));

    const adminLessons = getAdminLessons().filter(l => l.courseId === courseId);
    const adminLessonsWithIds = adminLessons.map(l => ({
      id: l.id,
      title: l.title,
      youtubeId: l.youtubeId,
      duration: l.duration,
      desc: l.description,
      isPremium: l.isPremium
    }));

    const totalLessons = [...baseLessonsWithIds, ...adminLessonsWithIds];
    setLessons(totalLessons);

    // Define aula ativa se não houver
    if (totalLessons.length > 0 && !activeLesson) {
      setActiveLesson(totalLessons[0]);
    }

    setLoading(false);
  }, [courseId, router]);

  // Sincroniza dados específicos da aula ativa (Notas, Fórum, Quiz)
  useEffect(() => {
    if (!activeLesson) return;

    // 1. Carrega Notas
    const savedNotes = localStorage.getItem(`notes_${courseId}_${activeLesson.id}`) || '';
    setCurrentNotes(savedNotes);
    setNotesStatus('');

    // 2. Carrega Fórum da Aula (Comentários)
    const forumKey = `forum_comments_${courseId}_${activeLesson.id}`;
    const savedComments = localStorage.getItem(forumKey);
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    } else {
      const mockInitial = MOCK_COMMENTS[activeLesson.id] || [
        { id: 'c-init-1', author: 'Piloto Agrícola Lucas', role: 'Operador Certificado', avatar: 'PL', text: 'Essa aula aborda pontos vitais da operação de campo. Configurei meu drone exatamente assim e a deposição melhorou muito.', date: 'Há 1 dia', upvotes: 4 },
        { id: 'c-init-2', author: 'Eduardo Costa', role: 'Aluno', avatar: 'EC', text: 'Alguém mais está aplicando com vento moderado? O sensor de fluxo respondeu super bem.', date: 'Há 12 horas', upvotes: 2 }
      ];
      setComments(mockInitial);
      localStorage.setItem(forumKey, JSON.stringify(mockInitial));
    }

    // 3. Carrega estado do Quiz (Prova)
    const quizKey = `quiz_completed_${courseId}_${activeLesson.id}`;
    const quizCompleted = localStorage.getItem(quizKey) === 'true';
    setQuizSubmitted(quizCompleted);
    if (quizCompleted) {
      setQuizPassed(true);
      setQuizScore(2);
      const customQuizKey = `custom_quiz_${activeLesson.id}`;
      const savedCustomQuiz = localStorage.getItem(customQuizKey);
      const questions = (savedCustomQuiz ? JSON.parse(savedCustomQuiz) : (QUIZ_DATA[activeLesson.id] || [])) as { question: string; options: string[]; correctIndex: number }[];
      const answers: Record<number, number> = {};
      questions.forEach((q, idx) => {
        answers[idx] = q.correctIndex;
      });
      setSelectedAnswers(answers);
    } else {
      setSelectedAnswers({});
      setQuizPassed(false);
      setQuizScore(0);
    }

  }, [activeLesson, courseId]);

  // XP & Patente
  const getLevelInfo = (xp: number) => {
    if (xp < 250) return { title: 'Cadete de Voo 🛩️', max: 250, percent: Math.round((xp / 250) * 100) };
    if (xp < 600) return { title: 'Operador Assistente 🚜', max: 600, percent: Math.round(((xp - 250) / 350) * 100) };
    if (xp < 1200) return { title: 'Piloto de Aplicação 💧', max: 1200, percent: Math.round(((xp - 600) / 600) * 100) };
    return { title: 'Comandante de Operações 👑', max: 9999, percent: 100 };
  };

  const currentLevel = getLevelInfo(userXP);

  const addXP = (amount: number) => {
    const newXP = userXP + amount;
    setUserXP(newXP);
    localStorage.setItem('user_xp', newXP.toString());
    setXpAnimation(`+${amount} XP`);
    setTimeout(() => setXpAnimation(null), 3000);
  };

  const handleLessonSelect = (lesson: Lesson) => {
    setActiveLesson(lesson);
  };

  // Alterar velocidade do vídeo
  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: 'setPlaybackRate', args: [speed, true] }),
        '*'
      );
    }
  };

  // Conclusão e Autoplay
  const handleToggleComplete = (lessonId: string) => {
    const isNowCompleted = toggleLessonCompleted(lessonId);
    const updated = getCompletedLessons();
    setCompletedLessons(updated);

    if (isNowCompleted) {
      // Ganha XP por concluir aula
      const xpKey = `xp_earned_lesson_${lessonId}`;
      if (localStorage.getItem(xpKey) !== 'true') {
        addXP(50);
        localStorage.setItem(xpKey, 'true');
      }

      // Autoplay: vai para a próxima se tiver
      if (autoplayNext && activeLesson) {
        const currentIndex = lessons.findIndex(l => l.id === activeLesson.id);
        if (currentIndex > -1 && currentIndex < lessons.length - 1) {
          setTimeout(() => {
            setActiveLesson(lessons[currentIndex + 1]);
          }, 1500);
        }
      }
    }
  };

  // Salvar Notas
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!activeLesson) return;
    const val = e.target.value;
    setCurrentNotes(val);
    setNotesStatus('salvando');
    localStorage.setItem(`notes_${courseId}_${activeLesson.id}`, val);
    
    setTimeout(() => {
      setNotesStatus('salvo');
    }, 800);
  };

  const downloadNotes = () => {
    if (!activeLesson) return;
    const element = document.createElement("a");
    const file = new Blob([currentNotes], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Anotacoes_${courseId}_Aula_${activeLesson.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Enviar Dúvida / Comentário (Fórum Permanente)
  const handleSendComment = () => {
    if (!newCommentText.trim() || !activeLesson || !session) return;

    const newComment: ForumComment = {
      id: `c-${Date.now()}`,
      author: session.name,
      role: session.role === 'admin' ? 'Instrutor' : session.role === 'premium' ? 'Membro Premium' : 'Aluno',
      avatar: session.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2),
      text: newCommentText,
      date: 'Agora mesmo',
      upvotes: 0
    };

    const updated = [newComment, ...comments];
    setComments(updated);
    setNewCommentText('');
    localStorage.setItem(`forum_comments_${courseId}_${activeLesson.id}`, JSON.stringify(updated));

    // Resposta simulada do instrutor automaticamente
    setTimeout(() => {
      const responseComment: ForumComment = {
        id: `c-reply-${Date.now()}`,
        author: 'Rômulo Nascimento',
        role: 'Instrutor Chefe ECR',
        avatar: 'RN',
        text: `Olá ${session.name.split(' ')[0]}! Excelente pergunta. No contexto de pulverização e planejamento agro, sempre considere essa variável no campo. Continue firme nos estudos!`,
        date: 'Alguns instantes atrás',
        upvotes: 2
      };
      setComments(prev => [responseComment, ...prev]);
      localStorage.setItem(`forum_comments_${courseId}_${activeLesson.id}`, JSON.stringify([responseComment, ...updated]));
    }, 2500);
  };

  const handleUpvoteComment = (commentId: string) => {
    if (!activeLesson) return;
    const updated = comments.map(c => {
      if (c.id === commentId) {
        const isUpvoted = !c.userUpvoted;
        return {
          ...c,
          upvotes: isUpvoted ? c.upvotes + 1 : c.upvotes - 1,
          userUpvoted: isUpvoted
        };
      }
      return c;
    });
    setComments(updated);
    localStorage.setItem(`forum_comments_${courseId}_${activeLesson.id}`, JSON.stringify(updated));
  };

  // Responder Quiz / Prova
  const handleQuizOptionSelect = (qIdx: number, oIdx: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [qIdx]: oIdx
    }));
  };

  const handleSubmitQuiz = () => {
    if (!activeLesson) return;
    const customQuizKey = `custom_quiz_${activeLesson.id}`;
    const savedCustomQuiz = localStorage.getItem(customQuizKey);
    const questions = (savedCustomQuiz ? JSON.parse(savedCustomQuiz) : (QUIZ_DATA[activeLesson.id] || [])) as { question: string; options: string[]; correctIndex: number }[];
    if (questions.length === 0) return;

    let correct = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correct++;
      }
    });

    setQuizScore(correct);
    setQuizSubmitted(true);

    if (correct === questions.length) {
      setQuizPassed(true);
      const quizKey = `quiz_completed_${courseId}_${activeLesson.id}`;
      if (localStorage.getItem(quizKey) !== 'true') {
        addXP(100);
        localStorage.setItem(quizKey, 'true');
      }
    } else {
      setQuizPassed(false);
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizPassed(false);
    setQuizScore(0);
  };

  // Simular downloads
  const startSimulatedDownload = (fileName: string) => {
    setDownloadingFile(fileName);
    setDownloadProgress(5);
    
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setDownloadingFile(null), 1000);
          
          const element = document.createElement("a");
          const file = new Blob([`Arquivo técnico: ${fileName}\n\nECR Drones Escola de Operadores - Material de Apoio Homologado.`], {type: 'text/plain'});
          element.href = URL.createObjectURL(file);
          element.download = fileName;
          document.body.appendChild(element);
          element.click();
          document.body.removeChild(element);

          return 100;
        }
        return prev + Math.floor(Math.random() * 25) + 10;
      });
    }, 200);
  };

  const handleSimulatedUpgrade = () => {
    if (!session) return;
    const updatedSession: UserSession = {
      ...session,
      name: session.name.replace('(Grátis)', '(Premium)'),
      role: 'premium',
    };
    setUserSession(updatedSession);
    setSession(updatedSession);
    setSuccessUpgrade(true);

    setTimeout(() => {
      setSuccessUpgrade(false);
      setShowCheckoutModal(false);
      window.location.reload();
    }, 2000);
  };

  if (showCheckoutModal) {
    return (
      <div className="min-h-screen bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="relative bg-white border border-zinc-200 shadow-xl max-w-md w-full p-8 rounded-2xl space-y-6 text-zinc-950 animate-scale-up">
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-brand-amber" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-brand-amber" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-brand-amber" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-brand-amber" />

          {successUpgrade ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-50 border border-brand-green/30 text-brand-green rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold font-heading">Upgrade Concluído!</h3>
              <p className="text-sm text-zinc-600 font-mono">
                Sua conta foi atualizada para <span className="text-brand-green font-bold">PREMIUM</span> na hora.
              </p>
              <p className="text-xs text-zinc-400 tracking-widest font-mono uppercase animate-pulse">LIBERANDO ACESSO GERAL...</p>
            </div>
          ) : (
            <>
              <div className="space-y-2 text-center">
                <div className="w-12 h-12 bg-amber-50 border border-brand-amber/20 text-brand-amber rounded-xl flex items-center justify-center mx-auto">
                  <Lock className="w-6 h-6 animate-bounce" />
                </div>
                <h3 className="text-lg font-bold font-heading">Acesso Restrito</h3>
                <p className="text-sm text-zinc-650 leading-relaxed">
                  Esta trilha é reservada a alunos <span className="text-brand-amber font-semibold">Premium Elite</span> da ECR Drones.
                </p>
              </div>

              <div className="space-y-3 bg-zinc-50 border border-zinc-200 p-4 rounded-xl">
                <span className="text-xs font-mono text-brand-amber tracking-widest uppercase font-bold block mb-1">O QUE VOCÊ TERÁ ACESSO:</span>
                <ul className="space-y-1.5 text-sm text-zinc-700">
                  <li className="flex items-center gap-1.5">✔ Aulas práticas detalhadas (NDVI + Calibração)</li>
                  <li className="flex items-center gap-1.5">✔ Fórum técnico de caldas com instrutores</li>
                  <li className="flex items-center gap-1.5">✔ Downloads ilimitados de manuais</li>
                  <li className="flex items-center gap-1.5">✔ Certificado Nacional de Voo Homologado</li>
                </ul>
              </div>

              <div className="space-y-3 border-t border-zinc-150 pt-4">
                <button
                  onClick={handleSimulatedUpgrade}
                  className="w-full bg-brand-amber hover:bg-brand-amber/90 text-brand-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm text-sm"
                >
                  <Sparkles className="w-4 h-4 text-brand-black animate-pulse" />
                  Ativar Conta Premium (Simular)
                </button>
                <button
                  onClick={() => router.push('/cursos')}
                  className="w-full bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-500 py-2 rounded-lg text-sm transition-colors"
                >
                  Voltar para Trilhas Livres
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  if (loading || !activeLesson || !session) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] text-zinc-900 flex items-center justify-center font-mono">
        <div className="flex flex-col items-center gap-4">
          <span className="w-10 h-10 border-4 border-brand-green border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-brand-green tracking-widest uppercase animate-pulse">Sincronizando Player...</p>
        </div>
      </div>
    );
  }

  const courseTitle = courseId === 'introducao' 
    ? 'Introdução aos Drones no Agro' 
    : courseId === 'mapeamento' 
      ? 'Mapeamento Aéreo e NDVI' 
      : 'Pulverização Autônoma Avançada';

  const courseHours = courseId === 'introducao' ? '3 Horas' : courseId === 'mapeamento' ? '6 Horas' : '8 Horas';

  // Verifica se a trilha foi 100% concluída
  const courseLessonsIds = lessons.map(l => l.id);
  const isCourseCompleted = courseLessonsIds.length > 0 && courseLessonsIds.every(id => completedLessons.includes(id));
  const isCurrentCompleted = completedLessons.includes(activeLesson.id);

  // Parâmetros técnicos simulados variando por aula
  const getTechnicalParams = (lessonId: string) => {
    if (lessonId.includes('introducao')) {
      return { downwash: 'N/A', altitude: 'Visual Line of Sight (VLOS)', speed: 'Manual/Livre', calda: 'Água Pura (Calibração)' };
    }
    if (lessonId.includes('mapeamento')) {
      return { downwash: 'Baixo (Sustentação)', altitude: '50m a 80m (GSD 2.5cm)', speed: '8.0 m/s a 10.0 m/s', calda: 'N/A (Sensores Ópticos)' };
    }
    if (lessonId.includes('l-1')) {
      return { downwash: 'Máximo (T40 / P100)', altitude: '3.0m a 3.5m', speed: '6.5 m/s', calda: 'Herbicida Dessecante' };
    }
    if (lessonId.includes('l-2')) {
      return { downwash: 'Médio-Alto', altitude: '3.2m', speed: '7.0 m/s', calda: 'Inseticida + Adjuvante Óleo' };
    }
    return { downwash: 'Dinâmico', altitude: '3.0m sobre dossel', speed: '6.0 m/s constante', calda: 'Fungicida Sistêmico' };
  };

  const techParams = getTechnicalParams(activeLesson.id);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-zinc-950 relative flex flex-col font-sans overflow-x-hidden selection:bg-brand-green selection:text-white">
      
      {/* ── GRID DE FUNDO OPERACIONAL SUAVE ── */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]" 
        style={{
          backgroundImage: `
            linear-gradient(rgba(46, 125, 50, 0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(46, 125, 50, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }} 
        aria-hidden="true"
      />

      {/* ANIMAÇÃO DE XP FLUTUANTE */}
      {xpAnimation && (
        <div className="fixed top-24 right-8 bg-brand-green text-white font-bold px-5 py-2.5 rounded-full text-sm shadow-lg z-50 flex items-center gap-1.5 animate-scale-up border border-brand-green/20 animate-bounce">
          <Sparkles className="w-4 h-4 text-brand-amber animate-pulse" />
          <span>{xpAnimation}</span>
        </div>
      )}

      {/* ── NAVBAR SUPERIOR CLARA COM XP ── */}
      <header className="relative z-10 border-b border-zinc-200 bg-white/95 backdrop-blur-xl shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/cursos" className="p-2 rounded bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-650 hover:text-zinc-900 transition-all cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="h-6 w-px bg-zinc-200" />
            <div className="flex flex-col">
              <span className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest">Curso Operacional</span>
              <span className="text-sm font-bold text-zinc-900 font-heading">{courseTitle}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest font-bold">Patente ECR Drones</span>
              <span className="text-sm font-bold text-brand-green flex items-center gap-1">
                {currentLevel.title}
              </span>
            </div>

            <div className="bg-zinc-50 border border-zinc-200 px-3.5 py-2 rounded-xl flex items-center gap-3">
              <div className="flex flex-col">
                <span className="text-xs font-mono text-zinc-500 font-bold block">PONTOS XP: <span className="text-zinc-900">{userXP}</span></span>
                <div className="w-24 h-1.5 bg-zinc-200 rounded-full mt-1 overflow-hidden">
                  <div className="h-full bg-brand-green rounded-full transition-all duration-500" style={{ width: `${currentLevel.percent}%` }} />
                </div>
              </div>
              <div className="w-8 h-8 bg-brand-green/10 rounded-lg flex items-center justify-center text-brand-green text-sm font-mono font-bold">
                Lvl
              </div>
            </div>

            <ECRDronesLogo version={5} size={32} />
          </div>
        </div>
      </header>

      {/* ── CONTEÚDO PRINCIPAL ── */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 grid md:grid-cols-12 gap-8 items-start">
        
        {/* COLUNA ESQUERDA: PLAYER E CONTEÚDO PRINCIPAL (8/12 colunas) */}
        <section className="md:col-span-8 space-y-6">
          
          {/* PLAYER DE VÍDEO COMPLETO E CLEAN */}
          <div className="bg-white border border-zinc-200 p-2 rounded-2xl overflow-hidden shadow-sm">
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
              <iframe
                ref={iframeRef}
                src={`https://www.youtube.com/embed/${activeLesson.youtubeId}?autoplay=0&rel=0&modestbranding=1&enablejsapi=1`}
                title={activeLesson.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0 select-none"
              />

              {playbackSpeed !== 1 && (
                <div className="absolute top-4 left-4 bg-black/75 backdrop-blur-sm border border-white/20 text-white font-mono text-xs px-2.5 py-1.5 rounded-lg pointer-events-none">
                  Velocidade: {playbackSpeed}x
                </div>
              )}
            </div>

            {/* BARRA DE CONTROLES DO PLAYER */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-zinc-50 rounded-xl mt-2 border border-zinc-200">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-mono text-zinc-500 uppercase font-bold mr-1">Velocidade:</span>
                {[0.75, 1, 1.25, 1.5, 2].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => handleSpeedChange(speed)}
                    className={`px-3 py-1.5 text-xs font-mono rounded font-semibold cursor-pointer transition-all ${
                      playbackSpeed === speed
                        ? 'bg-brand-green text-white shadow-sm'
                        : 'bg-zinc-200 text-zinc-650 hover:bg-zinc-300'
                    }`}
                  >
                    {speed === 1 ? 'Padrão' : `${speed}x`}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-zinc-650 font-medium">
                  <input
                    type="checkbox"
                    checked={autoplayNext}
                    onChange={(e) => setAutoplayNext(e.target.checked)}
                    className="rounded border-zinc-300 text-brand-green focus:ring-brand-green cursor-pointer"
                  />
                  <span>Autoplay Próxima Aula</span>
                </label>
              </div>
            </div>
          </div>

          {/* DETALHES DE TEXTO DA AULA */}
          <div className="bg-white border border-zinc-200 p-6 rounded-2xl space-y-4 relative shadow-sm">
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-zinc-200" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-zinc-200" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-mono text-zinc-500 tracking-widest uppercase block font-bold">MÓDULO DE APRENDIZADO • CAMPO</span>
                <h2 className="text-2xl font-bold text-zinc-900 font-heading tracking-tight">{activeLesson.title}</h2>
                <div className="flex items-center gap-3 text-xs font-mono text-zinc-500">
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-zinc-500" /> {activeLesson.duration}</span>
                  <span className="h-3 w-px bg-zinc-200" />
                  <span className="text-brand-green font-semibold uppercase">Curso Homologado ECR</span>
                </div>
              </div>

              {/* BOTÃO "CONCLUIR AULA" */}
              <button
                onClick={() => handleToggleComplete(activeLesson.id)}
                className={`flex items-center justify-center gap-2 font-bold text-sm px-6 py-3.5 rounded-xl border transition-all cursor-pointer ${
                  isCurrentCompleted 
                    ? 'bg-emerald-50 border-brand-green/30 text-brand-green shadow-sm' 
                    : 'bg-zinc-900 border-zinc-800 hover:bg-brand-green hover:border-brand-green text-white'
                }`}
              >
                {isCurrentCompleted ? (
                  <>
                    <CheckSquare className="w-5 h-5 text-brand-green animate-scale-up" />
                    Aula Concluída
                  </>
                ) : (
                  <>
                    <Square className="w-5 h-5 text-zinc-400 transition-colors" />
                    Marcar como Concluída
                  </>
                )}
              </button>
            </div>

            <div className="h-px bg-zinc-150" />

            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-mono text-brand-amber uppercase tracking-wider font-bold">Resumo Técnico</h4>
                <p className="text-sm text-zinc-700 leading-relaxed font-sans mt-1">
                  {activeLesson.desc}
                </p>
              </div>

              {/* Parâmetros técnicos simulados */}
              <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5 space-y-3">
                <span className="text-xs font-mono text-brand-green tracking-widest uppercase font-bold block">
                  ⚙️ CONFIGURAÇÃO DE VOO (TÉCNICA DE CAMPO)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-zinc-550 block uppercase">Efeito Downwash</span>
                    <span className="text-sm font-bold text-zinc-900">{techParams.downwash}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-zinc-550 block uppercase">Altura de Voo</span>
                    <span className="text-sm font-bold text-zinc-900">{techParams.altitude}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-zinc-550 block uppercase">Velocidade de Trabalho</span>
                    <span className="text-sm font-bold text-zinc-900">{techParams.speed}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-zinc-550 block uppercase">Calda Recomendada</span>
                    <span className="text-sm font-bold text-zinc-900">{techParams.calda}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 📝 SEÇÃO DA PROVA (DESBLOQUEIA AO FINALIZAR A AULA) */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-4 relative shadow-sm">
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-zinc-200" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-zinc-200" />

            <div className="flex items-center justify-between pb-3 border-b border-zinc-150">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-brand-green/10 text-brand-green flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-950">Prova de Avaliação da Aula</h3>
                  <p className="text-xs font-mono text-zinc-500 uppercase">Validação de Conhecimento Técnico</p>
                </div>
              </div>

              {isCurrentCompleted ? (
                <span className="bg-emerald-50 border border-brand-green/30 text-brand-green text-xs font-mono uppercase font-bold px-2 py-1 rounded flex items-center gap-1 shadow-sm">
                  🔓 Desbloqueada (+100 XP)
                </span>
              ) : (
                <span className="bg-zinc-100 border border-zinc-200 text-zinc-500 text-xs font-mono uppercase font-bold px-2 py-1 rounded flex items-center gap-1">
                  🔒 Bloqueada
                </span>
              )}
            </div>

            {!isCurrentCompleted ? (
              <div className="py-10 flex flex-col items-center justify-center text-center space-y-2 bg-zinc-50/50 border border-zinc-200/50 rounded-xl">
                <Lock className="w-10 h-10 text-zinc-350 animate-pulse" />
                <h4 className="text-sm font-bold text-zinc-650">Prova Bloqueada</h4>
                <p className="text-xs text-zinc-500 max-w-md px-4">
                  Assista ao vídeo da lição e clique no botão <span className="text-zinc-800 font-bold">"Marcar como Concluída"</span> acima para liberar as perguntas da prova avaliativa.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {(() => {
                  const customQuizKey = `custom_quiz_${activeLesson.id}`;
                  const savedCustomQuiz = typeof window !== 'undefined' ? localStorage.getItem(customQuizKey) : null;
                  const questions = (savedCustomQuiz ? JSON.parse(savedCustomQuiz) : (QUIZ_DATA[activeLesson.id] || [])) as { question: string; options: string[]; correctIndex: number }[];
                  if (questions.length === 0) {
                    return (
                      <p className="text-sm text-zinc-550 italic py-4 text-center">
                        Nenhuma prova cadastrada para esta aula.
                      </p>
                    );
                  }

                  return (
                    <div className="space-y-6 animate-scale-up">
                      {questions.map((q, qIdx) => (
                        <div key={qIdx} className="space-y-2 border-b border-zinc-150 pb-4 last:border-b-0">
                          <p className="text-sm font-bold text-zinc-900 flex items-start gap-1.5">
                            <span className="w-6 h-6 rounded bg-zinc-100 border border-zinc-200 flex items-center justify-center text-xs font-mono shrink-0">{qIdx + 1}</span>
                            {q.question}
                          </p>
                          <div className="grid gap-2 pl-7">
                            {q.options.map((option, oIdx) => {
                              const isSelected = selectedAnswers[qIdx] === oIdx;
                              const isCorrect = q.correctIndex === oIdx;
                              
                              return (
                                <button
                                  key={oIdx}
                                  onClick={() => handleQuizOptionSelect(qIdx, oIdx)}
                                  className={`p-3.5 rounded-xl border text-left text-sm font-semibold cursor-pointer transition-all ${
                                    quizSubmitted
                                      ? isCorrect
                                        ? 'bg-emerald-50 border-brand-green/40 text-brand-green font-bold'
                                        : isSelected
                                          ? 'bg-red-50 border-red-250 text-red-600'
                                          : 'bg-white border-zinc-200 text-zinc-400'
                                      : isSelected
                                        ? 'bg-brand-green/5 border-brand-green text-brand-green font-bold shadow-sm'
                                        : 'bg-white border-zinc-200 hover:bg-zinc-50 text-zinc-750'
                                  }`}
                                >
                                  <span className="font-mono mr-1">{oIdx === 0 ? 'A)' : oIdx === 1 ? 'B)' : 'C)'}</span> {option}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}

                      <div className="pt-2 flex justify-between items-center gap-4 flex-wrap">
                        {quizSubmitted ? (
                          <div className="flex items-center gap-3 flex-wrap">
                            {quizPassed ? (
                              <div className="bg-emerald-50 border border-brand-green/30 text-brand-green rounded-xl p-3.5 flex items-center gap-2 text-sm shadow-sm">
                                <CheckCircle2 className="w-5 h-5 text-brand-green" />
                                <div>
                                  <p className="font-bold">Aprovado! (100% de Acertos)</p>
                                  <p className="text-xs font-mono text-zinc-550">+100 XP Creditado ao seu perfil</p>
                                </div>
                              </div>
                            ) : (
                              <div className="bg-amber-50 border border-amber-250 text-amber-800 rounded-xl p-3.5 flex items-center gap-2 text-sm">
                                <HelpCircle className="w-5 h-5 text-amber-600 animate-bounce" />
                                <div>
                                  <p className="font-bold">Pontuação: {quizScore}/2 acertos</p>
                                  <p className="text-xs font-mono text-zinc-550">É necessário obter 100% de acertos. Estude o conteúdo e tente novamente!</p>
                                </div>
                              </div>
                            )}
                            <button
                              onClick={handleResetQuiz}
                              className="px-5 py-2.5 border border-zinc-200 text-zinc-650 hover:bg-zinc-100 hover:text-zinc-800 rounded-xl text-xs font-bold transition-all cursor-pointer bg-white shadow-sm"
                            >
                              Tentar Novamente
                            </button>
                          </div>
                        ) : (
                          <>
                            <span className="text-xs font-mono text-zinc-500 uppercase font-semibold">Responda a todas as questões para finalizar</span>
                            <button
                              onClick={handleSubmitQuiz}
                              disabled={Object.keys(selectedAnswers).length < questions.length}
                              className="bg-zinc-950 hover:bg-brand-green text-white font-bold text-xs px-6 py-3 rounded-xl disabled:opacity-50 cursor-pointer transition-all shadow-sm"
                            >
                              Enviar Prova da Aula
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>

          {/* 💬 ÁREA DE COMENTÁRIOS E PERGUNTAS (PERMANENTE) */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-6 relative shadow-sm">
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-zinc-200" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-zinc-200" />

            <div className="space-y-1 pb-3 border-b border-zinc-150 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-zinc-950 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-brand-green" />
                  Área de Comentários e Dúvidas
                </h3>
                <p className="text-xs font-mono text-zinc-500 uppercase">Pergunte, colabore e tire suas dúvidas técnicas</p>
              </div>
              <span className="bg-zinc-100 border border-zinc-250 text-zinc-650 text-xs font-mono px-2 py-1 rounded-full font-bold">
                {comments.length} mensagens
              </span>
            </div>

            {/* Envio de Comentários */}
            <div className="flex gap-3 items-start bg-zinc-50 border border-zinc-200 p-4 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-brand-green/10 border border-brand-green/20 text-brand-green flex items-center justify-center text-sm font-bold font-mono shrink-0 shadow-inner">
                {session?.name ? session.name.substring(0, 2).toUpperCase() : 'AL'}
              </div>
              <div className="flex-1 space-y-2">
                <textarea
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="Escreva sua pergunta ou observação sobre esta lição..."
                  className="w-full border border-zinc-250 rounded-xl p-3.5 text-xs text-zinc-900 focus:outline-none focus:border-brand-green/50 focus:ring-1 focus:ring-brand-green/30 bg-white resize-none h-24 leading-relaxed"
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleSendComment}
                    disabled={!newCommentText.trim()}
                    className="bg-brand-green hover:bg-brand-green/90 text-white font-bold text-xs px-5 py-3 rounded-xl flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Enviar Pergunta
                  </button>
                </div>
              </div>
            </div>

            {/* Feed de Comentários */}
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {comments.map((comment) => (
                <div key={comment.id} className="p-4 rounded-xl border border-zinc-150 space-y-2 bg-white shadow-sm hover:shadow transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-bold font-mono text-zinc-650 border border-zinc-200">
                        {comment.avatar}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-zinc-900 block leading-tight">{comment.author}</span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                          comment.role.includes('Instrutor') 
                            ? 'bg-brand-green/10 text-brand-green border border-brand-green/20' 
                            : comment.role.includes('Premium') 
                              ? 'bg-amber-50 text-brand-amber border border-brand-amber/20' 
                              : 'bg-zinc-100 text-zinc-500 border border-zinc-200'
                        }`}>
                          {comment.role}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-zinc-405">{comment.date}</span>
                  </div>
                  
                  <p className="text-sm text-zinc-700 leading-relaxed pl-10">
                    {comment.text}
                  </p>
                  
                  <div className="pl-10 pt-1 flex items-center gap-4">
                    <button
                      onClick={() => handleUpvoteComment(comment.id)}
                      className={`flex items-center gap-1 text-xs font-mono cursor-pointer transition-colors ${
                        comment.userUpvoted ? 'text-brand-green font-bold' : 'text-zinc-500 hover:text-zinc-755'
                      }`}
                    >
                      ▲ {comment.upvotes} {comment.upvotes === 1 ? 'Útil' : 'Úteis'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 📝 SEÇÃO SANFONA: ANOTAÇÕES DE AULA */}
          <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
            <button
              onClick={() => setNotesOpen(!notesOpen)}
              className="w-full px-6 py-4 flex items-center justify-between bg-zinc-50 hover:bg-zinc-100/50 border-b border-zinc-200/50 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2 text-zinc-950 font-bold text-sm">
                <FileText className="w-4.5 h-4.5 text-brand-green" />
                <span>📝 Bloco de Anotações da Lição</span>
                {currentNotes.trim().length > 0 && (
                  <span className="w-1.5 h-1.5 bg-brand-green rounded-full animate-pulse" />
                )}
              </div>
              {notesOpen ? <ChevronUp className="w-4.5 h-4.5 text-zinc-450" /> : <ChevronDown className="w-4.5 h-4.5 text-zinc-450" />}
            </button>

            {notesOpen && (
              <div className="p-6 space-y-4 animate-scale-up">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-zinc-500 font-sans">
                    Suas anotações personalizadas são salvas localmente neste navegador.
                  </span>
                  <div className="flex items-center gap-2">
                    {notesStatus === 'salvando' && (
                      <span className="text-xs font-mono text-zinc-400 animate-pulse">Salvando...</span>
                    )}
                    {notesStatus === 'salvo' && (
                      <span className="text-xs font-mono text-brand-green flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Salvo!</span>
                    )}
                    <button
                      onClick={downloadNotes}
                      disabled={!currentNotes.trim()}
                      className="p-2.5 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-650 cursor-pointer disabled:opacity-50 transition-colors"
                      title="Baixar anotações (.txt)"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <textarea
                  value={currentNotes}
                  onChange={handleNotesChange}
                  placeholder="Escreva livremente aqui insights, parâmetros de bicos, rotações e dicas operacionais importantes desta aula..."
                  className="w-full border border-zinc-200 rounded-xl p-4 text-sm text-zinc-800 focus:outline-none focus:border-brand-green/50 focus:ring-1 focus:ring-brand-green/30 bg-yellow-50/10 font-sans resize-none h-48 leading-relaxed"
                />
              </div>
            )}
          </div>

          {/* 📁 SEÇÃO SANFONA: MATERIAL DE APOIO */}
          <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
            <button
              onClick={() => setDownloadsOpen(!downloadsOpen)}
              className="w-full px-6 py-4 flex items-center justify-between bg-zinc-50 hover:bg-zinc-100/50 border-b border-zinc-200/50 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2 text-zinc-950 font-bold text-sm">
                <Download className="w-4.5 h-4.5 text-brand-green" />
                <span>📁 Downloads e Materiais de Apoio</span>
              </div>
              {downloadsOpen ? <ChevronUp className="w-4.5 h-4.5 text-zinc-450" /> : <ChevronDown className="w-4.5 h-4.5 text-zinc-450" />}
            </button>

            {downloadsOpen && (
              <div className="p-6 space-y-4 animate-scale-up">
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { name: 'Checklist_Seguranca_Pre_Voo_ECR.txt', label: 'Checklist Pré-Voo de Segurança', format: 'TXT', size: '2.4 KB' },
                    { name: 'Tabela_Calibracao_Bicos_Centrifugos.txt', label: 'Tabela de Bicos e Rotações', format: 'TXT', size: '3.8 KB' },
                    { name: 'Normativo_ANAC_RBAC_94_Resumo.txt', label: 'Resumo Regulatório ANAC RBAC-94', format: 'TXT', size: '12 KB' },
                    { name: 'Guia_Mistura_Caldas_Antideriva.txt', label: 'Guia ECR de Misturas de Calda', format: 'TXT', size: '8.5 KB' }
                  ].map((file, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl border border-zinc-150 flex items-center justify-between gap-4 bg-zinc-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-brand-green/10 text-brand-green flex items-center justify-center font-mono font-bold text-xs">
                          {file.format}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-zinc-950 block leading-tight">{file.label}</span>
                          <span className="text-xs font-mono text-zinc-500">{file.size}</span>
                        </div>
                      </div>

                      {downloadingFile === file.name ? (
                        <div className="flex flex-col items-end gap-1 w-20">
                          <span className="text-xs font-mono text-brand-green font-bold">{downloadProgress}%</span>
                          <div className="w-full h-1 bg-zinc-200 rounded-full overflow-hidden">
                            <div className="h-full bg-brand-green" style={{ width: `${downloadProgress}%` }} />
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => startSimulatedDownload(file.name)}
                          className="bg-white hover:bg-zinc-100 text-zinc-700 border border-zinc-250 p-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </section>

        {/* COLUNA DIREITA: GRADE DE AULAS CLARA (4/12 colunas) */}
        <section className="md:col-span-4 space-y-6">

          {/* BANNER DE CERTIFICADO DISPONÍVEL (SURGE SE 100% CONCLUÍDO) */}
          {isCourseCompleted ? (
            <div className="bg-[linear-gradient(135deg,#FFF9C4_0%,#FFF59D_100%)] border border-yellow-350 rounded-2xl p-5 space-y-4 relative shadow-md animate-bounce-subtle text-zinc-950">
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-brand-amber" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-brand-amber" />
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-amber/20 text-brand-amber flex items-center justify-center flex-shrink-0 animate-pulse">
                  <Award className="w-6 h-6 text-brand-black" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-mono text-brand-amber uppercase tracking-widest font-extrabold block">Requisito Aprovado</span>
                  <h4 className="text-sm font-extrabold font-heading">Trilha Concluída!</h4>
                  <p className="text-xs text-zinc-700 leading-relaxed font-sans">
                    Você concluiu e passou em todas as provas e aulas da trilha. Seu certificado de capacitação operacional está disponível.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowCertificateModal(true)}
                className="w-full bg-brand-amber hover:bg-brand-amber/90 text-brand-black font-extrabold text-xs py-3.5 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-brand-black" />
                Emitir Certificado Operacional
              </button>
            </div>
          ) : (
            <div className="bg-white border border-zinc-200 rounded-2xl p-4 space-y-3 relative shadow-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-brand-green" />
                <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block font-bold">Certificação de Piloto</span>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed font-sans">
                Conclua todas as <strong>{lessons.length} aulas</strong> desta trilha de capacitação rural para liberar o seu certificado homologado de pulverização.
              </p>
              <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-brand-green rounded-full transition-all duration-500" 
                  style={{ width: `${Math.round((completedLessons.filter(id => courseLessonsIds.includes(id)).length / lessons.length) * 100)}%` }} 
                />
              </div>
              <div className="flex justify-between items-center text-xs font-mono text-zinc-500 font-bold">
                <span>PROGRESSO</span>
                <span>{completedLessons.filter(id => courseLessonsIds.includes(id)).length} / {lessons.length} AULAS</span>
              </div>
            </div>
          )}

          {/* LISTA COMPLETA DE AULAS */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-4 space-y-4 relative shadow-sm">
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-zinc-150" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-zinc-150" />

            <div className="space-y-1 pb-3 border-b border-zinc-150">
              <span className="text-xs font-mono text-brand-green tracking-widest uppercase block font-bold">GRADE DE AULAS</span>
              <h3 className="text-sm font-extrabold text-zinc-900">Módulos de Estudo</h3>
              <p className="text-xs text-zinc-655 font-mono font-medium">
                {completedLessons.filter(id => courseLessonsIds.includes(id)).length} de {lessons.length} aulas finalizadas
              </p>
            </div>

            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-300">
              {lessons.map((lesson, index) => {
                const isSelected = activeLesson.id === lesson.id;
                const isCompleted = completedLessons.includes(lesson.id);

                return (
                  <div
                    key={lesson.id}
                    onClick={() => handleLessonSelect(lesson)}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all duration-300 ${
                      isSelected 
                        ? 'bg-zinc-50 border-brand-green/45 shadow-sm' 
                        : 'bg-white border-zinc-200/60 hover:bg-zinc-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-mono font-bold ${
                        isSelected 
                          ? 'bg-brand-green/10 text-brand-green border border-brand-green/20' 
                          : isCompleted 
                            ? 'bg-zinc-100 text-brand-green' 
                            : 'bg-zinc-100 text-zinc-500'
                      }`}>
                        {index + 1}
                      </div>

                      <div className="space-y-0.5 flex-1">
                        <p className={`text-xs font-bold leading-tight ${isSelected ? 'text-brand-green' : 'text-zinc-900'}`}>
                          {lesson.title}
                        </p>
                        <span className="text-xs font-mono text-zinc-500 block">
                          Duração: {lesson.duration}
                        </span>
                      </div>
                    </div>

                    {isCompleted && (
                      <CheckCircle2 className="w-4 h-4 text-brand-green flex-shrink-0 animate-scale-up" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </section>

      </main>

      {/* FOOTER */}
      <footer className="mt-16 border-t border-zinc-200 bg-white py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center">
          <div className="flex items-center gap-3 justify-center">
            <ECRDronesLogo version={5} size={25} />
            <span className="text-xs font-mono text-zinc-500 font-bold uppercase">ECR DRONES • SALA DE AULAS</span>
          </div>
          <p className="text-xs font-mono text-zinc-500">
            Aplicações dinâmicas simuladas com local storage.
          </p>
        </div>
      </footer>

      {/* ── MODAL DO CERTIFICADO ── */}
      {showCertificateModal && session && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <style jsx global>{`
            @media print {
              body * {
                visibility: hidden !important;
              }
              #print-certificate, #print-certificate * {
                visibility: visible !important;
              }
              #print-certificate {
                position: fixed !important;
                left: 0 !important;
                top: 0 !important;
                width: 297mm !important;
                height: 210mm !important;
                margin: 0 !important;
                padding: 1.5cm !important;
                background: white !important;
                border: 8px double #d4af37 !important;
                box-sizing: border-box !important;
                z-index: 9999999 !important;
                display: flex !important;
                flex-direction: column !important;
                justify-content: space-between !important;
              }
              .no-print {
                display: none !important;
              }
            }
          `}</style>

          <div className="relative bg-zinc-950 border border-zinc-800 shadow-2xl max-w-4xl w-full p-6 rounded-2xl space-y-6 text-white no-print">
            <button
              onClick={() => setShowCertificateModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1 text-center">
              <h3 className="text-lg font-bold font-heading text-brand-amber">Visualização do Certificado</h3>
              <p className="text-sm text-zinc-450">
                Seu documento de capacitação técnica foi gerado digitalmente. Clique em imprimir para gerar o PDF ou enviar para a impressora.
              </p>
            </div>

            {/* BOX DO CERTIFICADO */}
            <div 
              id="print-certificate" 
              className="bg-white text-zinc-950 border-[10px] border-double border-yellow-600 p-8 rounded-lg relative overflow-hidden flex flex-col justify-between aspect-[1.41] shadow-inner text-center font-serif"
            >
              <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-yellow-600" />
              <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-yellow-600" />
              <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-yellow-600" />
              <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-yellow-600" />

              <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none">
                <Compass className="w-80 h-80" />
              </div>

              <div className="space-y-2 relative z-10 flex flex-col items-center">
                <ECRDronesLogo version={3} size={42} showTagline={false} />
                <span className="text-xs font-sans font-bold tracking-widest text-zinc-500 uppercase block mt-1">
                  Escola de Operadores Aeroagrícolas ECR Drones
                </span>
                <div className="h-0.5 w-1/3 bg-[linear-gradient(90deg,transparent_0%,#d4af37_50%,transparent_100%)]" />
              </div>

              <div className="space-y-1 relative z-10 my-4">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 uppercase font-heading">
                  Certificado de Capacitação Técnica
                </h1>
                <p className="text-xs text-zinc-500 font-sans italic">
                  Concedido nos termos das diretrizes regulatórias vigentes da ANAC e MAPA.
                </p>
              </div>

              <div className="space-y-4 relative z-10 px-6 sm:px-12">
                <p className="text-sm sm:text-base text-zinc-800 leading-relaxed font-sans">
                  Certificamos para os devidos fins legais que o operador rural e piloto aeroagrícola cadastrado sob o nome de <strong className="text-zinc-950 text-base sm:text-lg border-b border-zinc-400 pb-0.5 px-2">{session.name.replace('(Grátis)', '').replace('(Premium)', '')}</strong>, concluiu com aproveitamento técnico exemplar a trilha de formação profissional avançada em <strong className="text-brand-green font-bold">{courseTitle}</strong>, ministrada digitalmente por esta instituição de ensino com carga horária total avaliada em <span className="font-bold">{courseHours}</span>.
                </p>
              </div>

              <div className="grid grid-cols-3 items-end gap-4 relative z-10 pt-4 border-t border-zinc-200/80 font-sans mt-4">
                <div className="text-left space-y-1 flex flex-col justify-end">
                  <div className="w-14 h-14 border border-zinc-300 p-1 bg-white flex items-center justify-center rounded">
                    <div className="grid grid-cols-5 gap-0.5 w-full h-full opacity-80">
                      {[...Array(25)].map((_, i) => (
                        <div key={i} className={`w-full h-full ${Math.random() > 0.45 ? 'bg-black' : 'bg-transparent'}`} />
                      ))}
                    </div>
                  </div>
                  <span className="text-xs font-mono text-zinc-500 uppercase tracking-tight block">
                    CÓDIGO DE AUTENTICIDADE<br />
                    ECR-CERT-{courseId.substring(0,3).toUpperCase()}-{Math.floor(100000 + Math.random() * 900000)}
                  </span>
                </div>

                <div className="flex justify-center relative -top-2">
                  <div className="w-14 h-14 bg-gradient-to-tr from-yellow-600 to-yellow-400 text-white rounded-full flex flex-col items-center justify-center shadow-md border-4 border-white font-heading font-extrabold text-[8px] tracking-tighter select-none">
                    <span>HOMOLOGADO</span>
                    <span className="text-[6px] tracking-widest text-yellow-100 uppercase">ANAC MAPA</span>
                  </div>
                </div>

                <div className="text-right space-y-1 flex flex-col items-end">
                  <div className="h-6 flex items-end">
                    <span className="font-serif italic text-xs text-zinc-700 tracking-wider font-bold">Rômulo Nascimento</span>
                  </div>
                  <div className="h-px w-28 bg-zinc-300" />
                  <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest font-bold">
                    Instrutor Responsável
                  </span>
                </div>
              </div>

            </div>

            {/* Botões do Modal */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 border-t border-zinc-800 pt-4 no-print">
              <button
                onClick={() => setShowCertificateModal(false)}
                className="bg-zinc-800 hover:bg-zinc-750 text-zinc-300 font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer"
              >
                Fechar
              </button>
              
              <button
                onClick={() => window.print()}
                className="bg-brand-amber hover:bg-brand-amber/90 text-brand-black font-extrabold text-xs px-5 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Download className="w-3.5 h-3.5 text-brand-black" />
                Imprimir ou Salvar PDF
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Icone customizado auxiliar para o botão de anotações
function EditNotesIcon() {
  return (
    <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}
