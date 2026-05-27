"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import ECRDronesLogo from '@/components/ECRDronesLogo';
import { 
  getUserSession, setUserSession, getCompletedLessons, 
  toggleLessonCompleted, getAdminLessons, UserSession, AdminLesson 
} from '@/lib/mockAuth';
import { 
  ArrowLeft, CheckCircle2, Lock, PlayCircle, BookOpen, Clock, 
  CheckSquare, Square, ChevronRight, X, Sparkles, Award, Star, Compass
} from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  youtubeId: string;
  duration: string;
  desc: string;
  isPremium: boolean;
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

  // Aulas estáticas base por curso
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

  useEffect(() => {
    const activeSession = getUserSession();
    if (!activeSession) {
      router.push('/auth');
      return;
    }
    
    // Bloqueia acesso se usuário free tentar entrar em curso premium
    const isPremiumCourse = courseId === 'mapeamento' || courseId === 'pulverizacao';
    if (isPremiumCourse && activeSession.role === 'free') {
      setSession(activeSession);
      setShowCheckoutModal(true);
      return;
    }

    setSession(activeSession);

    // Carrega progresso
    setCompletedLessons(getCompletedLessons());

    // Consolida aulas (estáticas + dinâmicas do admin)
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

    if (totalLessons.length > 0) {
      setActiveLesson(totalLessons[0]);
    }

    setLoading(false);
  }, [courseId, router]);

  const handleLessonSelect = (lesson: Lesson) => {
    setActiveLesson(lesson);
  };

  const handleToggleComplete = (lessonId: string) => {
    const wasCompleted = toggleLessonCompleted(lessonId);
    setCompletedLessons(getCompletedLessons());
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
      // Recarrega a página para inicializar os cursos liberados
      window.location.reload();
    }, 2000);
  };

  if (showCheckoutModal) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="relative bg-zinc-950 border border-brand-amber/40 shadow-[0_0_40px_rgba(245,127,23,0.12)] max-w-md w-full p-8 rounded-2xl space-y-6">
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-brand-amber" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-brand-amber" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-brand-amber" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-brand-amber" />

          {successUpgrade ? (
            <div className="text-center py-8 space-y-4 animate-scale-up">
              <div className="w-16 h-16 bg-brand-green/20 border border-brand-green/50 text-brand-green rounded-full flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(46,125,50,0.2)]">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-white">Upgrade Concluído!</h3>
              <p className="text-xs text-zinc-400 font-mono">
                Sua conta foi atualizada para <span className="text-brand-green font-bold">PREMIUM</span> na hora.
              </p>
              <p className="text-[10px] text-zinc-500 tracking-widest font-mono uppercase animate-pulse">LIBERANDO ACESSO GERAL...</p>
            </div>
          ) : (
            <>
              <div className="space-y-2 text-center">
                <div className="w-12 h-12 bg-brand-amber/10 border border-brand-amber/30 text-brand-amber rounded-xl flex items-center justify-center mx-auto">
                  <Lock className="w-6 h-6 animate-bounce" />
                </div>
                <h3 className="text-lg font-bold text-white">Acesso Restrito</h3>
                <p className="text-xs text-zinc-400">
                  Esta trilha é reservada a alunos <span className="text-brand-amber font-semibold">Premium Elite</span> da ECR Drones.
                </p>
              </div>

              <div className="space-y-3 bg-zinc-900/40 border border-zinc-850 p-4 rounded-xl">
                <span className="text-[9px] font-mono text-brand-amber tracking-widest uppercase font-bold">O QUE VOCÊ TERÁ ACESSO:</span>
                <ul className="space-y-1.5 text-xs text-zinc-300">
                  <li className="flex items-center gap-1.5">✔ Aulas práticas detalhadas (NDVI + Calibração)</li>
                  <li className="flex items-center gap-1.5">✔ Fórum técnico de caldas com instrutores</li>
                  <li className="flex items-center gap-1.5">✔ Downloads ilimitados de manuais</li>
                  <li className="flex items-center gap-1.5">✔ Certificado Nacional de Voo Homologado</li>
                </ul>
              </div>

              <div className="space-y-3 border-t border-zinc-900 pt-4">
                <button
                  onClick={handleSimulatedUpgrade}
                  className="w-full bg-brand-amber hover:bg-brand-amber-dark border border-brand-amber/40 hover:border-brand-amber/80 text-brand-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(245,127,23,0.1)]"
                >
                  <Sparkles className="w-4 h-4 text-brand-black animate-pulse" />
                  Ativar Conta Premium (Simular)
                </button>
                <button
                  onClick={() => router.push('/cursos')}
                  className="w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-850 text-white py-2 rounded-lg text-xs transition-colors"
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

  if (loading || !activeLesson) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono">
        <div className="flex flex-col items-center gap-4">
          <span className="w-10 h-10 border-4 border-brand-green border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-brand-green tracking-widest uppercase animate-pulse">Sincronizando Player...</p>
        </div>
      </div>
    );
  }

  const courseTitle = courseId === 'introducao' 
    ? 'Introdução aos Drones no Agro' 
    : courseId === 'mapeamento' 
      ? 'Mapeamento Aéreo e NDVI' 
      : 'Pulverização Autônoma Avançada';

  const isCurrentCompleted = completedLessons.includes(activeLesson.id);

  return (
    <div className="min-h-screen bg-black text-white relative flex flex-col font-sans overflow-x-hidden selection:bg-brand-green selection:text-white">
      
      {/* ── GRID DE FUNDO OPERACIONAL ── */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-15" 
        style={{
          backgroundImage: `
            linear-gradient(rgba(46, 125, 50, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(46, 125, 50, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }} 
        aria-hidden="true"
      />

      {/* ── NAVBAR SUPERIOR ── */}
      <header className="relative z-10 border-b border-zinc-900 bg-zinc-950/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/cursos" className="p-2 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-850 hover:border-zinc-700 text-zinc-400 hover:text-white transition-all cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="h-6 w-px bg-zinc-900" />
            <span className="text-xs font-mono font-bold text-brand-green uppercase tracking-wider">{courseTitle}</span>
          </div>

          <div className="flex items-center gap-3">
            <ECRDronesLogo version={5} size={30} />
          </div>
        </div>
      </header>

      {/* ── CONTEÚDO PRINCIPAL (DOUBLES COLUNAS) ── */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 grid md:grid-cols-12 gap-8 items-start">
        
        {/* COLUNA ESQUERDA: PLAYER E CONTEÚDO PRINCIPAL (8/12 colunas) */}
        <section className="md:col-span-8 space-y-6">
          
          {/* PLAYER DE VÍDEO DO YOUTUBE PREMIUM */}
          <div className="relative bg-zinc-950 border border-zinc-900 p-2 rounded-2xl overflow-hidden group shadow-[0_0_30px_rgba(46,125,50,0.02)]">
            {/* Cantoneiras HUD */}
            <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t border-l border-brand-green" />
            <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t border-r border-brand-green" />
            <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b border-l border-brand-green" />
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b border-r border-brand-green" />

            {/* EMBED YOUTUBE RESPONSIVO */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${activeLesson.youtubeId}?autoplay=0&rel=0&modestbranding=1`}
                title={activeLesson.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0 select-none"
              />
            </div>
          </div>

          {/* DETALHES DA AULA SELECIONADA */}
          <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl space-y-4 relative">
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-zinc-850" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-zinc-850" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[9px] font-mono text-zinc-500 tracking-widest uppercase">MÓDULO DE VOOS • TELEMETRIA</span>
                <h2 className="text-xl font-bold text-white tracking-tight">{activeLesson.title}</h2>
                <div className="flex items-center gap-3 text-[10px] font-mono text-zinc-400">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-zinc-500" /> {activeLesson.duration}</span>
                  <span className="h-3 w-px bg-zinc-800" />
                  <span className="text-brand-green">SESSÃO CRIPTOGRAFADA</span>
                </div>
              </div>

              {/* BOTÃO "CONCLUIR AULA" INTEGRADO AO LOCALSTORAGE */}
              <button
                onClick={() => handleToggleComplete(activeLesson.id)}
                className={`flex items-center gap-2 font-bold text-xs px-5 py-3 rounded-xl border transition-all cursor-pointer ${
                  isCurrentCompleted 
                    ? 'bg-brand-green/10 border-brand-green/30 text-brand-green shadow-[0_0_15px_rgba(46,125,50,0.08)]' 
                    : 'bg-zinc-900 border-zinc-850 hover:border-brand-green/50 text-white'
                }`}
              >
                {isCurrentCompleted ? (
                  <>
                    <CheckSquare className="w-4 h-4 text-brand-green animate-scale-up" />
                    Aula Concluída
                  </>
                ) : (
                  <>
                    <Square className="w-4 h-4 text-zinc-500 hover:text-brand-green transition-colors" />
                    Marcar como Concluída
                  </>
                )}
              </button>
            </div>

            <div className="h-px bg-zinc-900" />

            <div className="space-y-2">
              <h4 className="text-[10px] font-mono text-brand-amber uppercase tracking-wider">PRESCRICAO DE CONTEUDO E OBJETIVOS</h4>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                {activeLesson.desc}
              </p>
            </div>
          </div>

        </section>

        {/* COLUNA DIREITA: GRADE DE AULAS (4/12 colunas) */}
        <section className="md:col-span-4 bg-zinc-950 border border-zinc-900 rounded-2xl p-4 space-y-4 relative">
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-zinc-850" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-zinc-850" />

          <div className="space-y-1 pb-3 border-b border-zinc-900">
            <span className="text-[9px] font-mono text-brand-green tracking-widest uppercase block">GRADE OPERACIONAL</span>
            <h3 className="text-xs font-bold text-white">Conteúdo do Curso</h3>
            <p className="text-[9px] text-zinc-500 font-mono">
              {lessons.filter(l => completedLessons.includes(l.id)).length} de {lessons.length} aulas finalizadas
            </p>
          </div>

          {/* LISTA COMPLETA DE AULAS */}
          <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-800">
            {lessons.map((lesson, index) => {
              const isSelected = activeLesson.id === lesson.id;
              const isCompleted = completedLessons.includes(lesson.id);

              return (
                <div
                  key={lesson.id}
                  onClick={() => handleLessonSelect(lesson)}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all duration-300 ${
                    isSelected 
                      ? 'bg-zinc-900/60 border-brand-green/40 shadow-[0_0_15px_rgba(46,125,50,0.03)]' 
                      : 'bg-zinc-950 border-zinc-900/50 hover:border-zinc-850 hover:bg-zinc-900/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Número/Ícone */}
                    <div className={`w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center text-[10px] font-mono font-bold ${
                      isSelected 
                        ? 'bg-brand-green/20 text-brand-green border border-brand-green/30' 
                        : isCompleted 
                          ? 'bg-zinc-900 text-brand-green' 
                          : 'bg-zinc-900 text-zinc-500'
                    }`}>
                      {index + 1}
                    </div>

                    <div className="space-y-0.5">
                      <p className={`text-xs font-bold leading-tight ${isSelected ? 'text-brand-green' : 'text-white'}`}>
                        {lesson.title}
                      </p>
                      <span className="text-[9px] font-mono text-zinc-500 block">
                        Duração: {lesson.duration}
                      </span>
                    </div>
                  </div>

                  {/* Badge de Check Concluído */}
                  {isCompleted && (
                    <CheckCircle2 className="w-4 h-4 text-brand-green flex-shrink-0 animate-scale-up" />
                  )}
                </div>
              );
            })}
          </div>

        </section>

      </main>

      {/* ── FOOTER ── */}
      <footer className="mt-16 border-t border-zinc-900 bg-zinc-950/45 py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center">
          <div className="flex items-center gap-3 justify-center">
            <ECRDronesLogo version={5} size={25} />
            <span className="text-[10px] font-mono text-zinc-500">ECR DRONES • SALA DE AULAS MVP</span>
          </div>
          <p className="text-[10px] font-mono text-zinc-650">
            Player integrado com YouTube de altíssima fidelidade.
          </p>
        </div>
      </footer>

    </div>
  );
}
