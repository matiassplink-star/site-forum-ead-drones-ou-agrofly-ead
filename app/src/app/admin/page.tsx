"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ECRDronesLogo from '@/components/ECRDronesLogo';
import { 
  getUserSession, getAdminLessons, addAdminLesson, 
  clearUserSession, UserSession, AdminLesson 
} from '@/lib/mockAuth';
import { 
  ArrowLeft, ShieldAlert, Plus, BookOpen, Send, CheckCircle2, 
  Trash2, Cpu, HardDrive, ShieldCheck, Compass, AlertTriangle, Eye,
  MessageSquare, Edit2, Users, FileText, Check, Settings, Search, RefreshCw, LogOut, X, Award
} from 'lucide-react';

interface Lesson {
  id: string;
  courseId: string;
  title: string;
  youtubeId: string;
  duration: string;
  desc: string;
  isPremium: boolean;
  isBase?: boolean;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

interface Student {
  id: string;
  name: string;
  email: string;
  role: 'free' | 'premium' | 'admin';
  progress: Record<string, number>; // courseId -> percent completed
  completedLessons: string[];
  quizGrades: Record<string, string>; // lessonId -> grade text (e.g. "2/2")
  avatar: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  // Tabs do Painel Admin
  const [activeTab, setActiveTab] = useState<'aulas' | 'provas' | 'alunos'>('aulas');

  // ────────────────────────────────────────
  // ESTADOS: GERENCIAMENTO DE AULAS
  // ────────────────────────────────────────
  const [lessonsList, setLessonsList] = useState<Lesson[]>([]);
  const [courseFilter, setCourseFilter] = useState<string>('todos');
  
  // Cadastrar nova aula
  const [title, setTitle] = useState('');
  const [newCourseId, setNewCourseId] = useState('introducao');
  const [youtubeId, setYoutubeId] = useState('');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');

  // Editar aula
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editYoutubeId, setEditYoutubeId] = useState('');
  const [editDuration, setEditDuration] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCourseId, setEditCourseId] = useState('introducao');

  // ────────────────────────────────────────
  // ESTADOS: GERENCIAMENTO DE PROVAS/QUIZZES
  // ────────────────────────────────────────
  const [quizLessonId, setQuizLessonId] = useState<string>('');
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([
    { question: '', options: ['', '', ''], correctIndex: 0 },
    { question: '', options: ['', '', ''], correctIndex: 0 }
  ]);

  // ────────────────────────────────────────
  // ESTADOS: ACOMPANHAMENTO DE ALUNOS
  // ────────────────────────────────────────
  const [students, setStudents] = useState<Student[]>([]);
  const [searchStudent, setSearchStudent] = useState<string>('');
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);

  const [successMessage, setSuccessMessage] = useState('');

  // AULAS BÁSICAS DO PORTAL (Mapeadas de page.tsx do curso para permitir CRUD mockado)
  const STATIC_LESSONS_BASE = [
    // introducao
    { id: 'introducao-l-1', courseId: 'introducao', title: 'O Panorama dos Drones no Agronegócio Brasileiro', youtubeId: 'e74v1J-sM20', duration: '15 min', desc: 'Conheça o crescimento exponencial do mercado de pulverização aérea, as principais culturas beneficiadas e os modelos de negócios ativos no país hoje.', isPremium: false, isBase: true },
    { id: 'introducao-l-2', courseId: 'introducao', title: 'Regulamentação Aeronáutica ANAC (RBAC 94)', youtubeId: 'mO_K53iZfQ8', duration: '22 min', desc: 'Entenda os requisitos regulamentares da ANAC para voar aeronaves Classe 3 (mais de 25kg), cadastro de pilotos, seguro RETA obrigatório e como evitar sanções administrativas.', isPremium: false, isBase: true },
    { id: 'introducao-l-3', courseId: 'introducao', title: 'Regras do DECEA e Cadastro SARPAS', youtubeId: 'Wz9jKx4x3qY', duration: '18 min', desc: 'Aprenda a cadastrar seus drones e pilotos no portal SARPAS do DECEA e solicitar janelas de espaço aéreo operacional com agilidade técnica antes das aplicações de campo.', isPremium: false, isBase: true },
    { id: 'introducao-l-4', courseId: 'introducao', title: 'Principais Oportunidades Comerciais no Campo', youtubeId: '3H4a7g-S48s', duration: '25 min', desc: 'Análise detalhada sobre custos operacionais de voo, taxas médias cobradas por hectare, negociação com grandes produtores e estratégias de entrada no mercado agro.', isPremium: false, isBase: true },
    // mapeamento
    { id: 'mapeamento-l-1', courseId: 'mapeamento', title: 'Conceitos de Fotogrametria e Resolução Espacial GSD', youtubeId: 'Q21Z9r1_v70', duration: '20 min', desc: 'Descubra a ciência da fotogrametria aérea aplicada no agro, cálculo da resolução do pixel em solo (GSD) e a importância do overlap (sobreposição de fotos) para ortomosaicos perfeitos.', isPremium: true, isBase: true },
    { id: 'mapeamento-l-2', courseId: 'mapeamento', title: 'Planejamento de Voo Autônomo e Altura de Voo', youtubeId: 'n0t7J7v4bF4', duration: '18 min', desc: 'Passo a passo prático de como criar planos de varredura tridimensional utilizando softwares de telemetria autônoma e definindo a sobreposição ideal de imagens multiespectrais.', isPremium: true, isBase: true },
    { id: 'mapeamento-l-3', courseId: 'mapeamento', title: 'Processamento de Imagens e Mosaico no Pix4D', youtubeId: 'x9J7H-K1_j4', duration: '30 min', desc: 'Aprenda a importar fotos brutas no Pix4D Mapper, alinhar câmeras, calibrar sensores multiespectrais com placas de reflectância e gerar ortomosaicos de alta definição.', isPremium: true, isBase: true },
    { id: 'mapeamento-l-4', courseId: 'mapeamento', title: 'Análise de Índices de Vegetação NDVI no QGIS', youtubeId: 'eE04p4f9z1Y', duration: '28 min', desc: 'Abra ortomosaicos multiespectrais no QGIS, utilize a calculadora raster para extrair bandas vermelha e infravermelha, gere mapas de índice NDVI e crie zonas de prescrição de pulverização variada.', isPremium: true, isBase: true },
    // pulverizacao
    { id: 'pulverizacao-l-1', courseId: 'pulverizacao', title: 'Anatomia e Calibração dos Drones de Pulverização', youtubeId: 'c00iNpxp17g', duration: '25 min', desc: 'Estudo prático dos sistemas de fluxo, bombas de pressão e atomizadores rotativos de drones pesados como o DJI T40/T50 e o XAG P100 Pro.', isPremium: true, isBase: true },
    { id: 'pulverizacao-l-2', courseId: 'pulverizacao', title: 'Escolha e Ajustes de Bicos e Atomizadores', youtubeId: 'd6y7Z-P5w_k', duration: '22 min', desc: 'Aprenda a escolher o tamanho ideal de gotas (médias a grossas) dependendo do produto químico, ajustando a vazão em litros por minuto e rotação do disco para máxima deposição de calda.', isPremium: true, isBase: true },
    { id: 'pulverizacao-l-3', courseId: 'pulverizacao', title: 'Controle de Derivas sob Diferentes Condições de Vento', youtubeId: 't7J6f4Y2x7o', duration: '20 min', desc: 'Técnicas essenciais de meteorologia prática: medição de vento com termoanemômetro, umidade relativa mínima do ar operacional e como reajustar faixas de segurança no Downwash.', isPremium: true, isBase: true },
    { id: 'pulverizacao-l-4', courseId: 'pulverizacao', title: 'Prescrição Tridimensional e Downwash no Solo', youtubeId: '9oJ7L4y2bF4', duration: '32 min', desc: 'Compreenda a física do fluxo de ar descendente (Downwash) empurrando as gotas para o interior da folhagem da cultura, evitando derivas mecânicas e aplicando em terrenos de alta declividade.', isPremium: true, isBase: true }
  ];

  // QUIZ DATA ESTÁTICO PADRÃO
  const QUIZ_DATA_DEFAULT: Record<string, QuizQuestion[]> = {
    'introducao-l-1': [
      { question: 'Qual o principal benefício da pulverização com drone em relação ao trator convencional?', options: ['Capacidade do tanque maior', 'Eliminação do amassamento da cultura e compactação', 'Sem necessidade de baterias'], correctIndex: 1 },
      { question: 'O mercado de drones agrícolas no Brasil está em qual cenário?', options: ['Estagnação por falta de suporte', 'Forte expansão em soja, milho e cana', 'Proibição total em lavouras'], correctIndex: 1 }
    ],
    'introducao-l-2': [
      { question: 'Segundo a ANAC RBAC 94, drones Classe 3 (acima de 25 kg) exigem:', options: ['Cadastro simplificado', 'Habilitação, registro e seguro RETA obrigatório', 'Nenhum requisito legal'], correctIndex: 1 },
      { question: 'O seguro obrigatório aeronáutico para danos a terceiros chama-se:', options: ['Seguro DPVAT', 'Seguro Rural', 'Seguro RETA'], correctIndex: 2 }
    ]
  };

  useEffect(() => {
    const activeSession = getUserSession();
    if (!activeSession) {
      router.push('/auth');
      return;
    }
    setSession(activeSession);

    // Valida se o usuário é ADMIN
    if (activeSession.role !== 'admin') {
      setAuthorized(false);
      setLoading(false);
      return;
    }

    setAuthorized(true);

    // 1. Carrega Aulas (Mescla as Estáticas com as do LocalStorage)
    loadAllLessons();

    // 2. Carrega Alunos
    loadAllStudents();

    setLoading(false);
  }, [router]);

  // Carrega e atualiza a lista geral de aulas
  const loadAllLessons = () => {
    // Carrega overrides do localStorage
    const deletedBaseIds = JSON.parse(localStorage.getItem('ecr_deleted_base_lessons') || '[]');
    const editedBaseLessons = JSON.parse(localStorage.getItem('ecr_edited_base_lessons') || '[]');
    const adminLessons = getAdminLessons();

    // Aplica filtros e edições nas aulas base
    const baseProcessed: Lesson[] = STATIC_LESSONS_BASE
      .filter(l => !deletedBaseIds.includes(l.id))
      .map(l => {
        const override = editedBaseLessons.find((o: any) => o.id === l.id);
        if (override) {
          return { ...l, ...override };
        }
        return l;
      });

    const adminProcessed: Lesson[] = adminLessons.map(l => ({
      id: l.id,
      courseId: l.courseId,
      title: l.title,
      youtubeId: l.youtubeId,
      duration: l.duration,
      desc: l.description,
      isPremium: l.isPremium,
      isBase: false
    }));

    const merged = [...baseProcessed, ...adminProcessed];
    setLessonsList(merged);

    // Define aula ativa de quiz se vazia
    if (merged.length > 0 && !quizLessonId) {
      setQuizLessonId(merged[0].id);
    }
  };

  // Carrega e atualiza a lista de alunos (com dados mockados no localStorage)
  const loadAllStudents = () => {
    const stored = localStorage.getItem('ecr_admin_students');
    if (stored) {
      setStudents(JSON.parse(stored));
    } else {
      const mockStudents: Student[] = [
        { id: 's-1', name: 'Carlos Rezende Silva', email: 'carlos.rezende@fazendanova.com.br', role: 'premium', progress: { introducao: 100, mapeamento: 50, pulverizacao: 0 }, completedLessons: ['introducao-l-1', 'introducao-l-2', 'introducao-l-3', 'introducao-l-4', 'mapeamento-l-1', 'mapeamento-l-2'], quizGrades: { 'introducao-l-1': '2/2', 'introducao-l-2': '2/2', 'mapeamento-l-1': '2/2' }, avatar: 'CR' },
        { id: 's-2', name: 'Marta Souza Barros', email: 'marta.agro@outlook.com', role: 'free', progress: { introducao: 25, mapeamento: 0, pulverizacao: 0 }, completedLessons: ['introducao-l-1'], quizGrades: { 'introducao-l-1': '2/2' }, avatar: 'MB' },
        { id: 's-3', name: 'Lucas Alencar Piloto', email: 'lucas.drones@gmail.com', role: 'premium', progress: { introducao: 100, mapeamento: 100, pulverizacao: 75 }, completedLessons: ['introducao-l-1', 'introducao-l-2', 'introducao-l-3', 'introducao-l-4', 'mapeamento-l-1', 'mapeamento-l-2', 'mapeamento-l-3', 'mapeamento-l-4', 'pulverizacao-l-1', 'pulverizacao-l-2', 'pulverizacao-l-3'], quizGrades: { 'introducao-l-1': '2/2', 'introducao-l-2': '2/2', 'mapeamento-l-1': '2/2', 'mapeamento-l-2': '2/2', 'pulverizacao-l-1': '2/2' }, avatar: 'LA' },
        { id: 's-4', name: 'Fernanda Costa Mendes', email: 'fernanda.agrofly@gmail.com', role: 'premium', progress: { introducao: 100, mapeamento: 100, pulverizacao: 100 }, completedLessons: ['introducao-l-1', 'introducao-l-2', 'introducao-l-3', 'introducao-l-4', 'mapeamento-l-1', 'mapeamento-l-2', 'mapeamento-l-3', 'mapeamento-l-4', 'pulverizacao-l-1', 'pulverizacao-l-2', 'pulverizacao-l-3', 'pulverizacao-l-4'], quizGrades: { 'introducao-l-1': '2/2', 'introducao-l-2': '2/2', 'mapeamento-l-1': '2/2', 'mapeamento-l-2': '2/2', 'pulverizacao-l-1': '2/2', 'pulverizacao-l-2': '2/2', 'pulverizacao-l-3': '2/2', 'pulverizacao-l-4': '2/2' }, avatar: 'FM' }
      ];
      localStorage.setItem('ecr_admin_students', JSON.stringify(mockStudents));
      setStudents(mockStudents);
    }
  };

  // Carrega as perguntas do quiz ao selecionar a aula no dropdown
  useEffect(() => {
    if (!quizLessonId) return;

    const customQuizKey = `custom_quiz_${quizLessonId}`;
    const savedCustomQuiz = localStorage.getItem(customQuizKey);
    
    if (savedCustomQuiz) {
      setQuizQuestions(JSON.parse(savedCustomQuiz));
    } else {
      const fallback = QUIZ_DATA_DEFAULT[quizLessonId] || [
        { question: 'Pergunta avaliativa padrão 1 para a aula?', options: ['Opção incorreta A', 'Opção correta B (Selecione esta)', 'Opção incorreta C'], correctIndex: 1 },
        { question: 'Pergunta avaliativa padrão 2 para a aula?', options: ['Opção correta A (Selecione esta)', 'Opção incorreta B', 'Opção incorreta C'], correctIndex: 0 }
      ];
      setQuizQuestions(fallback);
    }
  }, [quizLessonId]);

  // ────────────────────────────────────────
  // AÇÕES: AULAS
  // ────────────────────────────────────────

  const handleCreateLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !youtubeId || !duration) return;

    const newLesson: Omit<AdminLesson, 'id'> = {
      courseId: newCourseId,
      title,
      youtubeId,
      duration: `${duration} min`,
      description: description || 'Esta é uma aula adicional integrada dinamicamente via painel administrativo para fins de testes do MVP.',
      isPremium: newCourseId !== 'introducao'
    };

    addAdminLesson(newLesson);
    loadAllLessons();
    
    setTitle('');
    setYoutubeId('');
    setDuration('');
    setDescription('');

    triggerSuccessNotification('Nova aula cadastrada e integrada com sucesso!');
  };

  const handleStartEdit = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setEditTitle(lesson.title);
    setEditYoutubeId(lesson.youtubeId);
    setEditDuration(lesson.duration.replace(' min', ''));
    setEditDescription(lesson.desc);
    setEditCourseId(lesson.courseId);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLesson) return;

    const updatedData = {
      id: editingLesson.id,
      courseId: editCourseId,
      title: editTitle,
      youtubeId: editYoutubeId,
      duration: `${editDuration} min`,
      desc: editDescription,
      isPremium: editCourseId !== 'introducao'
    };

    if (editingLesson.isBase) {
      // Salva edições em aulas estáticas
      const editedBaseLessons = JSON.parse(localStorage.getItem('ecr_edited_base_lessons') || '[]');
      const index = editedBaseLessons.findIndex((l: any) => l.id === editingLesson.id);
      if (index > -1) {
        editedBaseLessons[index] = updatedData;
      } else {
        editedBaseLessons.push(updatedData);
      }
      localStorage.setItem('ecr_edited_base_lessons', JSON.stringify(editedBaseLessons));
    } else {
      // Salva edições em aulas extras (admin)
      const adminLessons = getAdminLessons();
      const index = adminLessons.findIndex(l => l.id === editingLesson.id);
      if (index > -1) {
        adminLessons[index] = {
          id: editingLesson.id,
          courseId: editCourseId,
          title: editTitle,
          youtubeId: editYoutubeId,
          duration: `${editDuration} min`,
          description: editDescription,
          isPremium: editCourseId !== 'introducao'
        };
        localStorage.setItem('ecr_new_lessons', JSON.stringify(adminLessons));
      }
    }

    setEditingLesson(null);
    loadAllLessons();
    triggerSuccessNotification('Aula editada e salva com sucesso!');
  };

  const handleDeleteLesson = (lessonId: string, isBase?: boolean) => {
    if (!confirm('Deseja realmente remover esta aula?')) return;

    if (isBase) {
      // Adiciona na lista de base deletadas
      const deletedBaseIds = JSON.parse(localStorage.getItem('ecr_deleted_base_lessons') || '[]');
      if (!deletedBaseIds.includes(lessonId)) {
        deletedBaseIds.push(lessonId);
      }
      localStorage.setItem('ecr_deleted_base_lessons', JSON.stringify(deletedBaseIds));
    } else {
      // Remove da lista de admin lessons
      const adminLessons = getAdminLessons();
      const filtered = adminLessons.filter(l => l.id !== lessonId);
      localStorage.setItem('ecr_new_lessons', JSON.stringify(filtered));
    }

    loadAllLessons();
    triggerSuccessNotification('Aula deletada com sucesso!');
  };

  // ────────────────────────────────────────
  // AÇÕES: PROVAS/QUIZZES
  // ────────────────────────────────────────

  const handleQuizQuestionChange = (qIdx: number, val: string) => {
    const updated = [...quizQuestions];
    updated[qIdx].question = val;
    setQuizQuestions(updated);
  };

  const handleQuizOptionChange = (qIdx: number, oIdx: number, val: string) => {
    const updated = [...quizQuestions];
    updated[qIdx].options[oIdx] = val;
    setQuizQuestions(updated);
  };

  const handleQuizCorrectIndexChange = (qIdx: number, val: number) => {
    const updated = [...quizQuestions];
    updated[qIdx].correctIndex = val;
    setQuizQuestions(updated);
  };

  const handleSaveQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizLessonId) return;

    localStorage.setItem(`custom_quiz_${quizLessonId}`, JSON.stringify(quizQuestions));
    triggerSuccessNotification('Prova avaliativa salva e integrada com sucesso!');
  };

  // ────────────────────────────────────────
  // AÇÕES: ALUNOS
  // ────────────────────────────────────────

  const handleToggleStudentRole = (studentId: string) => {
    const updated = students.map(s => {
      if (s.id === studentId) {
        const newRole: 'free' | 'premium' = s.role === 'free' ? 'premium' : 'free';
        return {
          ...s,
          role: newRole,
          name: newRole === 'premium' ? s.name.replace(' (Grátis)', '') + ' (Premium)' : s.name.replace(' (Premium)', '') + ' (Grátis)'
        };
      }
      return s;
    });
    setStudents(updated);
    localStorage.setItem('ecr_admin_students', JSON.stringify(updated));
    triggerSuccessNotification('Nível de acesso do aluno atualizado!');
    
    // Atualiza modal se estiver aberto
    if (viewingStudent && viewingStudent.id === studentId) {
      setViewingStudent(updated.find(s => s.id === studentId) || null);
    }
  };

  const handleResetStudentProgress = (studentId: string) => {
    if (!confirm('Deseja zerar todo o progresso de aulas e notas deste aluno?')) return;
    
    const updated = students.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          progress: { introducao: 0, mapeamento: 0, pulverizacao: 0 },
          completedLessons: [],
          quizGrades: {}
        };
      }
      return s;
    });
    setStudents(updated);
    localStorage.setItem('ecr_admin_students', JSON.stringify(updated));
    triggerSuccessNotification('Progresso do aluno zerado com sucesso!');

    if (viewingStudent && viewingStudent.id === studentId) {
      setViewingStudent(updated.find(s => s.id === studentId) || null);
    }
  };

  // Auxiliares
  const triggerSuccessNotification = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const filteredLessons = lessonsList.filter(l => {
    if (courseFilter === 'todos') return true;
    return l.courseId === courseFilter;
  });

  const filteredStudents = students.filter(s => {
    return s.name.toLowerCase().includes(searchStudent.toLowerCase()) || 
           s.email.toLowerCase().includes(searchStudent.toLowerCase());
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] text-zinc-900 flex items-center justify-center font-mono">
        <div className="flex flex-col items-center gap-4">
          <span className="w-10 h-10 border-4 border-brand-green border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-brand-green tracking-widest uppercase animate-pulse">Sincronizando Sistema...</p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] text-zinc-950 relative flex items-center justify-center p-4">
        <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(rgba(239, 68, 68, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(239, 68, 68, 0.4) 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
        <div className="relative bg-white border border-red-200/80 shadow-lg max-w-md w-full p-8 rounded-2xl text-center space-y-6 animate-scale-up">
          <div className="w-16 h-16 bg-red-50 border border-red-200 text-red-500 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8 animate-pulse" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-zinc-900 tracking-tight leading-tight">Acesso Negado</h3>
            <p className="text-xs font-mono text-zinc-500 font-semibold uppercase">Exige autorização "SYS ADMIN"</p>
          </div>
          <p className="text-sm text-zinc-650 leading-relaxed">
            Sua conta atual ({session?.name}) possui perfil limitado e não pode acessar as configurações da grade curricular. Utilize o login para entrar como Administrador.
          </p>
          <div className="space-y-2 pt-2">
            <Link href="/dashboard" className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer text-xs">
              <ArrowLeft className="w-4 h-4" /> Voltar ao Dashboard
            </Link>
            <Link href="/auth" className="w-full bg-red-50 hover:bg-red-100 text-red-650 border border-red-200 font-bold py-2 rounded-lg flex items-center justify-center gap-1 transition-all text-xs">
              Trocar de Perfil (Login)
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-zinc-950 relative flex flex-col font-sans overflow-x-hidden selection:bg-brand-green selection:text-white">
      
      {/* ── GRID DE FUNDO OPERACIONAL CLARO ── */}
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

      {/* ── NAVBAR SUPERIOR INTEGRADA CLARA ── */}
      <header className="relative z-10 border-b border-zinc-200 bg-white/95 backdrop-blur-xl shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 rounded bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-650 hover:text-zinc-900 transition-all cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="h-6 w-px bg-zinc-200" />
            <ECRDronesLogo version={3} size={38} showTagline={false} />
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/5514999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-brand-green/20 text-brand-green text-xs font-bold transition-all shadow-sm cursor-pointer mr-2"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Suporte Whatsapp</span>
            </a>

            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-zinc-900">{session?.name}</p>
              <p className="text-xs font-mono text-brand-blue-sky font-bold uppercase">ADMINISTRADOR</p>
            </div>
            <span className="px-2.5 py-1 rounded bg-blue-50 border border-brand-blue-sky/30 text-xs font-mono text-brand-blue-sky uppercase font-bold shadow-sm">
              ⚙️ SYS ADMIN
            </span>
          </div>
        </div>
      </header>

      {/* ── CONTEÚDO PRINCIPAL ── */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* HEADER DO PAINEL */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-mono text-brand-blue-sky tracking-wider uppercase flex items-center gap-1.5 font-bold">
              <ShieldAlert className="w-4 h-4 text-brand-blue-sky animate-pulse" />
              PAINEL ADMINISTRATIVO DO OPERADOR EAD
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 font-heading">
              Cabine de <span className="text-brand-blue-sky">Controle Acadêmico</span>
            </h1>
            <p className="text-sm text-zinc-600 max-w-2xl leading-relaxed">
              Gerencie a grade curricular das trilhas de voo, configure as provas teóricas de avaliação e acompanhe a conclusão e nota de cada piloto cadastrado.
            </p>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={loadAllLessons} 
              className="p-2.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-650 cursor-pointer shadow-sm transition-all"
              title="Sincronizar Banco"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {successMessage && (
          <div className="p-3.5 bg-brand-green/10 border border-brand-green/30 rounded-xl text-xs text-brand-green font-mono flex items-center gap-2 animate-scale-up font-bold shadow-sm">
            <ShieldCheck className="w-4 h-4 text-brand-green" />
            {successMessage}
          </div>
        )}

        {/* ── NAVEGAÇÃO DE ABAS DO PAINEL ── */}
        <div className="flex border-b border-zinc-250 bg-white p-2.5 rounded-2xl shadow-sm gap-2">
          <button
            onClick={() => setActiveTab('aulas')}
            className={`px-5 py-3 rounded-xl text-xs font-bold font-heading transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'aulas'
                ? 'bg-brand-blue-sky text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Gerenciar Aulas
          </button>

          <button
            onClick={() => setActiveTab('provas')}
            className={`px-5 py-3 rounded-xl text-xs font-bold font-heading transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'provas'
                ? 'bg-brand-blue-sky text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
            }`}
          >
            <FileText className="w-4 h-4" />
            Configurar Provas / Quizzes
          </button>

          <button
            onClick={() => setActiveTab('alunos')}
            className={`px-5 py-3 rounded-xl text-xs font-bold font-heading transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'alunos'
                ? 'bg-brand-blue-sky text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
            }`}
          >
            <Users className="w-4 h-4" />
            Acompanhamento de Alunos
          </button>
        </div>

        {/* ──────────────────────────────────────────────────────── */}
        {/* ABA 1: GERENCIAR AULAS */}
        {/* ──────────────────────────────────────────────────────── */}
        {activeTab === 'aulas' && (
          <div className="grid md:grid-cols-12 gap-8 items-start animate-fade-in">
            {/* Esquerda: Lista de Aulas e Filtros */}
            <div className="md:col-span-7 space-y-4">
              <div className="bg-white border border-zinc-200 p-6 rounded-2xl space-y-4 shadow-sm">
                <div className="flex justify-between items-center flex-wrap gap-4 pb-3 border-b border-zinc-150">
                  <h3 className="text-sm font-bold text-zinc-950 font-heading uppercase">Grade de Videoaulas Cadastradas</h3>
                  <select
                    value={courseFilter}
                    onChange={(e) => setCourseFilter(e.target.value)}
                    className="bg-zinc-50 border border-zinc-200 text-xs font-mono py-1 px-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-blue-sky cursor-pointer font-bold"
                  >
                    <option value="todos">Todos os Cursos</option>
                    <option value="introducao">Introdução aos Drones</option>
                    <option value="mapeamento">Mapeamento NDVI</option>
                    <option value="pulverizacao">Pulverização Avançada</option>
                  </select>
                </div>

                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {filteredLessons.map((lesson) => (
                    <div key={lesson.id} className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100/50 transition-colors flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-bold text-zinc-900 leading-tight">{lesson.title}</p>
                          {lesson.isBase ? (
                            <span className="px-1.5 py-0.5 rounded bg-zinc-200 text-zinc-500 font-mono text-[9px] font-bold">BASE</span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded bg-brand-blue-sky/10 text-brand-blue-sky font-mono text-[9px] font-bold border border-brand-blue-sky/20">EXTRA</span>
                          )}
                        </div>
                        <div className="flex gap-3 text-[10px] font-mono text-zinc-500 uppercase font-semibold">
                          <span>Curso: <strong className="text-zinc-700">{lesson.courseId}</strong></span>
                          <span>Duração: <strong className="text-zinc-700">{lesson.duration}</strong></span>
                          <span>ID: {lesson.youtubeId}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleStartEdit(lesson)}
                          className="p-2 rounded bg-white hover:bg-zinc-100 text-zinc-500 border border-zinc-200 cursor-pointer transition-colors"
                          title="Editar Aula"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteLesson(lesson.id, lesson.isBase)}
                          className="p-2 rounded bg-white hover:bg-red-50 text-red-500 border border-zinc-200 hover:border-red-200 cursor-pointer transition-colors"
                          title="Remover Aula"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {filteredLessons.length === 0 && (
                    <div className="text-center py-10 font-mono text-xs text-zinc-400 italic">
                      Nenhuma aula encontrada para o curso selecionado.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Direita: Modos Formulário (Adicionar / Editar) */}
            <div className="md:col-span-5 space-y-4">
              
              {/* FORMULÁRIO DE EDIÇÃO (APARECE SE ATIVO) */}
              {editingLesson ? (
                <form onSubmit={handleSaveEdit} className="bg-white border-2 border-brand-amber/40 p-6 rounded-2xl space-y-4 relative shadow-md animate-scale-up">
                  <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-brand-amber" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-brand-amber" />

                  <div className="flex justify-between items-center pb-2 border-b border-zinc-150">
                    <span className="text-xs font-mono text-brand-amber uppercase tracking-wider font-bold">✎ EDITAR DADOS DA AULA</span>
                    <button 
                      type="button" 
                      onClick={() => setEditingLesson(null)} 
                      className="p-1 rounded hover:bg-zinc-150 text-zinc-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-zinc-550 font-bold uppercase">Título da Videoaula</label>
                    <input
                      type="text"
                      required
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:border-brand-amber focus:ring-1 focus:ring-brand-amber"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-zinc-550 font-bold uppercase">Duração (Minutos)</label>
                      <input
                        type="number"
                        required
                        value={editDuration}
                        onChange={(e) => setEditDuration(e.target.value)}
                        className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2.5 text-sm text-zinc-900 font-mono focus:outline-none focus:border-brand-amber"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-zinc-550 font-bold uppercase">Curso</label>
                      <select
                        value={editCourseId}
                        onChange={(e) => setEditCourseId(e.target.value)}
                        className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2.5 text-sm text-zinc-800 focus:outline-none focus:border-brand-amber font-mono"
                      >
                        <option value="introducao">Introdução (Grátis)</option>
                        <option value="mapeamento">Mapeamento (Premium)</option>
                        <option value="pulverizacao">Pulverização (Premium)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-zinc-550 font-bold uppercase">Código ID do Vídeo (YouTube)</label>
                    <input
                      type="text"
                      required
                      value={editYoutubeId}
                      onChange={(e) => setEditYoutubeId(e.target.value)}
                      className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2.5 text-sm text-zinc-900 font-mono focus:outline-none focus:border-brand-amber"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-zinc-550 font-bold uppercase">Prescrição e Metas de Aprendizado</label>
                    <textarea
                      rows={3}
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="w-full bg-white border border-zinc-200 rounded-lg p-3 text-sm text-zinc-900 focus:outline-none focus:border-brand-amber"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingLesson(null)}
                      className="w-1/3 bg-zinc-100 hover:bg-zinc-200 text-zinc-500 font-bold text-xs py-3 rounded-lg cursor-pointer transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 bg-brand-amber hover:bg-brand-amber/90 text-brand-black font-extrabold text-xs py-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
                    >
                      <Check className="w-4 h-4 text-brand-black" />
                      Salvar Alterações
                    </button>
                  </div>
                </form>
              ) : (
                /* FORMULÁRIO DE CADASTRO */
                <form onSubmit={handleCreateLesson} className="bg-white border border-brand-blue-sky/30 p-6 rounded-2xl space-y-4 relative shadow-sm">
                  <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-brand-blue-sky" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-brand-blue-sky" />

                  <div className="flex justify-between items-center pb-2 border-b border-zinc-150">
                    <span className="text-xs font-mono text-brand-blue-sky uppercase tracking-wider font-bold">INTEGRAR NOVA AULA</span>
                    <span className="text-xs font-mono text-zinc-400 font-medium">CADASTRO</span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-zinc-550 font-bold uppercase">Título da Videoaula</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ex: Calibração de Bombas DJI T40"
                      className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-brand-blue-sky focus:ring-1 focus:ring-brand-blue-sky"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-zinc-550 font-bold uppercase">Duração (Minutos)</label>
                      <input
                        type="number"
                        required
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        placeholder="Ex: 25"
                        className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2.5 text-sm text-zinc-900 font-mono focus:outline-none focus:border-brand-blue-sky"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-zinc-550 font-bold uppercase">Curso</label>
                      <select
                        value={newCourseId}
                        onChange={(e) => setNewCourseId(e.target.value)}
                        className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2.5 text-sm text-zinc-800 focus:outline-none focus:border-brand-blue-sky font-mono"
                      >
                        <option value="introducao">Introdução (Grátis)</option>
                        <option value="mapeamento">Mapeamento (Premium)</option>
                        <option value="pulverizacao">Pulverização (Premium)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-zinc-550 font-bold uppercase">Código ID do Vídeo (YouTube)</label>
                    <input
                      type="text"
                      required
                      value={youtubeId}
                      onChange={(e) => setYoutubeId(e.target.value)}
                      placeholder="Ex: c00iNpxp17g"
                      className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2.5 text-sm text-zinc-900 font-mono focus:outline-none focus:border-brand-blue-sky"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-zinc-550 font-bold uppercase">Prescrição e Metas de Aprendizado</label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Descreva resumidamente os tópicos abordados..."
                      className="w-full bg-white border border-zinc-200 rounded-lg p-3 text-sm text-zinc-900 focus:outline-none focus:border-brand-blue-sky"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-brand-blue-sky hover:bg-brand-blue-sky/90 text-white font-extrabold text-xs py-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Salvar Aula na Grade
                  </button>
                </form>
              )}

            </div>
          </div>
        )}

        {/* ──────────────────────────────────────────────────────── */}
        {/* ABA 2: CONFIGURAR PROVAS */}
        {/* ──────────────────────────────────────────────────────── */}
        {activeTab === 'provas' && (
          <form onSubmit={handleSaveQuiz} className="bg-white border border-zinc-200 p-6 rounded-2xl space-y-6 shadow-sm animate-fade-in">
            <div className="flex justify-between items-center flex-wrap gap-4 pb-3 border-b border-zinc-150">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-zinc-950 font-heading uppercase">Modificar Provas e Questionários</h3>
                <p className="text-xs text-zinc-500 font-sans">Selecione uma aula na grade e altere as perguntas da prova avaliativa correspondente.</p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-zinc-550 font-bold uppercase block">Aula para Editar Prova</label>
                <select
                  value={quizLessonId}
                  onChange={(e) => setQuizLessonId(e.target.value)}
                  className="bg-zinc-50 border border-zinc-200 text-xs font-mono py-2 px-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-blue-sky cursor-pointer font-bold"
                >
                  {lessonsList.map(l => (
                    <option key={l.id} value={l.id}>
                      [{l.courseId.substring(0,3).toUpperCase()}] {l.title.substring(0, 35)}...
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* QUESTÕES */}
            <div className="space-y-6">
              {quizQuestions.map((q, qIdx) => (
                <div key={qIdx} className="bg-zinc-50 border border-zinc-150 p-5 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
                    <span className="text-xs font-mono text-brand-blue-sky uppercase tracking-wider font-bold">QUESTÃO {qIdx + 1}</span>
                    <div className="flex items-center gap-2">
                      <label className="text-[10px] font-mono text-zinc-500 font-bold uppercase">Opção Correta:</label>
                      <select
                        value={q.correctIndex}
                        onChange={(e) => handleQuizCorrectIndexChange(qIdx, parseInt(e.target.value, 10))}
                        className="bg-white border border-zinc-200 text-xs font-mono py-0.5 px-2 rounded cursor-pointer font-bold"
                      >
                        <option value={0}>Opção A (0)</option>
                        <option value={1}>Opção B (1)</option>
                        <option value={2}>Opção C (2)</option>
                      </select>
                    </div>
                  </div>

                  {/* Enunciado */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-zinc-550 font-bold uppercase">Enunciado da Pergunta</label>
                    <input
                      type="text"
                      required
                      value={q.question}
                      onChange={(e) => handleQuizQuestionChange(qIdx, e.target.value)}
                      placeholder="Qual o diâmetro médio de gotas ideal para ventos moderados?"
                      className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:border-brand-blue-sky focus:ring-1 focus:ring-brand-blue-sky"
                    />
                  </div>

                  {/* Opções */}
                  <div className="grid gap-3 sm:grid-cols-3">
                    {q.options.map((option, oIdx) => (
                      <div key={oIdx} className="space-y-1.5">
                        <label className="text-xs font-mono text-zinc-550 font-bold uppercase block">
                          Opção {oIdx === 0 ? 'A' : oIdx === 1 ? 'B' : 'C'}
                        </label>
                        <input
                          type="text"
                          required
                          value={option}
                          onChange={(e) => handleQuizOptionChange(qIdx, oIdx, e.target.value)}
                          placeholder={`Alternativa ${oIdx + 1}`}
                          className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:border-brand-blue-sky"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="bg-brand-blue-sky hover:bg-brand-blue-sky/90 text-white font-extrabold text-xs px-6 py-3.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
              >
                <ShieldCheck className="w-4 h-4 text-white" />
                Salvar Prova da Aula no Servidor
              </button>
            </div>
          </form>
        )}

        {/* ──────────────────────────────────────────────────────── */}
        {/* ABA 3: ACOMPANHAMENTO DE ALUNOS */}
        {/* ──────────────────────────────────────────────────────── */}
        {activeTab === 'alunos' && (
          <div className="bg-white border border-zinc-200 p-6 rounded-2xl space-y-4 shadow-sm animate-fade-in">
            <div className="flex justify-between items-center flex-wrap gap-4 pb-3 border-b border-zinc-150">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-zinc-950 font-heading uppercase">Acompanhamento e Notas de Alunos</h3>
                <p className="text-xs text-zinc-500 font-sans">Monitore a conclusão de cada aluno da ECR Drones, juntamente com suas notas em cada prova de lição.</p>
              </div>

              {/* Busca */}
              <div className="relative max-w-xs w-full">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchStudent}
                  onChange={(e) => setSearchStudent(e.target.value)}
                  placeholder="Buscar por nome ou e-mail..."
                  className="w-full bg-zinc-50 border border-zinc-250 rounded-xl pl-9 pr-4 py-2 text-xs text-zinc-900 focus:outline-none focus:border-brand-blue-sky"
                />
              </div>
            </div>

            {/* TABELA DE ALUNOS */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-200 text-zinc-550 uppercase font-mono tracking-wider bg-zinc-50/50">
                    <th className="p-3 font-bold">Piloto</th>
                    <th className="p-3 font-bold">Perfil</th>
                    <th className="p-3 font-bold text-center">Aulas Assistidas</th>
                    <th className="p-3 font-bold">Progresso por Trilha</th>
                    <th className="p-3 font-bold text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-150">
                  {filteredStudents.map((student) => {
                    const totalLessonsCount = STATIC_LESSONS_BASE.length + getAdminLessons().length;
                    const completionRate = student.completedLessons.length;
                    
                    return (
                      <tr key={student.id} className="hover:bg-zinc-50/30 transition-colors">
                        <td className="p-3 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 text-[10px] font-bold font-mono text-zinc-650 flex items-center justify-center">
                            {student.avatar}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-zinc-900 block leading-tight">{student.name}</span>
                            <span className="text-[10px] font-mono text-zinc-450 block">{student.email}</span>
                          </div>
                        </td>
                        <td className="p-3 font-mono">
                          {student.role === 'premium' ? (
                            <span className="px-2 py-0.5 rounded bg-amber-50 border border-brand-amber/30 text-brand-amber font-bold">
                              👑 PREMIUM
                            </span>
                          ) : student.role === 'admin' ? (
                            <span className="px-2 py-0.5 rounded bg-blue-50 border border-brand-blue-sky/30 text-brand-blue-sky font-bold">
                              ⚙️ ADMIN
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-zinc-500 font-bold">
                              FREE USER
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-center font-mono font-bold text-zinc-800">
                          {completionRate} de {totalLessonsCount}
                        </td>
                        <td className="p-3 space-y-1 font-mono text-[9px] font-bold text-zinc-500">
                          <div className="flex gap-2">
                            <span>INTRO: <strong className="text-zinc-800">{student.progress.introducao}%</strong></span>
                            <span>MAP: <strong className="text-zinc-800">{student.progress.mapeamento}%</strong></span>
                            <span>PULV: <strong className="text-zinc-800">{student.progress.pulverizacao}%</strong></span>
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => setViewingStudent(student)}
                              className="p-1.5 rounded bg-zinc-50 hover:bg-zinc-100 text-zinc-600 border border-zinc-200 cursor-pointer transition-all text-[10px] font-bold"
                              title="Visualizar Boletim Técnico"
                            >
                              Ver Boletim
                            </button>
                            <button
                              onClick={() => handleToggleStudentRole(student.id)}
                              className="p-1.5 rounded bg-zinc-50 hover:bg-amber-50 text-brand-amber border border-zinc-200 hover:border-brand-amber/20 cursor-pointer transition-all"
                              title="Alternar Premium"
                            >
                              👑
                            </button>
                            <button
                              onClick={() => handleResetStudentProgress(student.id)}
                              className="p-1.5 rounded bg-zinc-50 hover:bg-red-50 text-red-500 border border-zinc-200 hover:border-red-200 cursor-pointer transition-all"
                              title="Zerar Progresso"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredStudents.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-8 font-mono text-xs text-zinc-400 italic">
                        Nenhum aluno encontrado correspondente à busca.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* ──────────────────────────────────────────────────────── */}
      {/* MODAL: BOLETIM / DETALHES DO ALUNO */}
      {/* ──────────────────────────────────────────────────────── */}
      {viewingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="relative bg-white border border-zinc-200 shadow-xl max-w-xl w-full p-6 rounded-2xl space-y-6 text-zinc-950 animate-scale-up">
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-brand-blue-sky" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-brand-blue-sky" />

            <button
              onClick={() => setViewingStudent(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Cabeçalho Boletim */}
            <div className="flex gap-4 items-center pb-4 border-b border-zinc-150">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-brand-blue-sky/20 text-brand-blue-sky flex items-center justify-center text-base font-bold font-mono">
                {viewingStudent.avatar}
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] font-mono text-zinc-400 tracking-wider uppercase font-bold">Boletim Técnico Operacional</span>
                <h3 className="text-base font-extrabold text-zinc-900 leading-tight">{viewingStudent.name}</h3>
                <p className="text-xs font-mono text-zinc-500 font-semibold">{viewingStudent.email} • Perfil: {viewingStudent.role.toUpperCase()}</p>
              </div>
            </div>

            {/* Detalhes de Progresso */}
            <div className="grid sm:grid-cols-3 gap-3">
              <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3.5 text-center space-y-1">
                <span className="text-[10px] font-mono text-zinc-400 block uppercase">Introdução</span>
                <span className="text-sm font-bold text-zinc-900 font-mono">{viewingStudent.progress.introducao}%</span>
              </div>
              <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3.5 text-center space-y-1">
                <span className="text-[10px] font-mono text-zinc-400 block uppercase">Mapeamento NDVI</span>
                <span className="text-sm font-bold text-zinc-900 font-mono">{viewingStudent.progress.mapeamento}%</span>
              </div>
              <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3.5 text-center space-y-1">
                <span className="text-[10px] font-mono text-zinc-400 block uppercase">Pulverização</span>
                <span className="text-sm font-bold text-zinc-900 font-mono">{viewingStudent.progress.pulverizacao}%</span>
              </div>
            </div>

            {/* Notas e Avaliações */}
            <div className="space-y-3.5">
              <span className="text-xs font-mono text-brand-blue-sky uppercase tracking-wider font-bold block">
                📋 NOTAS DE PROVAS E AVALIAÇÕES RESOLVIDAS
              </span>

              <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3 max-h-[180px] overflow-y-auto pr-1 space-y-2">
                {Object.keys(viewingStudent.quizGrades).length === 0 ? (
                  <p className="text-xs text-zinc-450 italic text-center py-4 font-mono">Nenhum quiz resolvido por este aluno ainda.</p>
                ) : (
                  Object.entries(viewingStudent.quizGrades).map(([lessonId, grade]) => {
                    const lessonName = STATIC_LESSONS_BASE.find(l => l.id === lessonId)?.title || lessonId;
                    return (
                      <div key={lessonId} className="flex justify-between items-center text-xs font-mono p-2 bg-white rounded-lg border border-zinc-150 shadow-sm">
                        <span className="text-zinc-800 font-semibold truncate max-w-[320px]" title={lessonName}>{lessonName}</span>
                        <span className="px-2 py-0.5 bg-emerald-50 text-brand-green border border-brand-green/20 rounded font-bold">{grade} Acertos</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Aulas Assistidas Checklist */}
            <div className="space-y-2.5">
              <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider font-bold block">
                ✔ HISTÓRICO DE CONTEÚDO CONCLUÍDO ({viewingStudent.completedLessons.length} Aulas)
              </span>

              <div className="max-h-[140px] overflow-y-auto pr-1 grid sm:grid-cols-2 gap-2 text-xs">
                {STATIC_LESSONS_BASE.map(l => {
                  const completed = viewingStudent.completedLessons.includes(l.id);
                  return (
                    <div key={l.id} className="flex items-center gap-2 p-1.5 bg-zinc-50/50 rounded border border-zinc-150">
                      {completed ? (
                        <CheckCircle2 className="w-4 h-4 text-brand-green" />
                      ) : (
                        <div className="w-4 h-4 border border-zinc-300 rounded-full" />
                      )}
                      <span className="text-zinc-700 truncate max-w-[170px]" title={l.title}>{l.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ações Rápidas */}
            <div className="flex gap-2 border-t border-zinc-150 pt-4 justify-end">
              <button
                onClick={() => setViewingStudent(null)}
                className="bg-zinc-100 hover:bg-zinc-200 text-zinc-650 font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer"
              >
                Fechar Boletim
              </button>
              <button
                onClick={() => handleToggleStudentRole(viewingStudent.id)}
                className="bg-brand-blue-sky hover:bg-brand-blue-sky/90 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer shadow-sm"
              >
                {viewingStudent.role === 'free' ? 'Promover a Premium' : 'Rebaixar a Free'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="mt-16 border-t border-zinc-200 bg-white py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center">
          <div className="flex items-center gap-3 justify-center">
            <ECRDronesLogo version={5} size={25} />
            <span className="text-xs font-mono text-zinc-450 font-bold uppercase">ECR DRONES • PAINEL ADMINISTRATIVO MVP</span>
          </div>
          <p className="text-xs font-mono text-zinc-550">
            Módulo local de controle estrutural, notas e conteúdos.
          </p>
        </div>
      </footer>

    </div>
  );
}
