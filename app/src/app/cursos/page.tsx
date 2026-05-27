"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ECRDronesLogo from '@/components/ECRDronesLogo';
import { getUserSession, setUserSession, UserSession } from '@/lib/mockAuth';
import { 
  ArrowLeft, BookOpen, Clock, Lock, Unlock, PlayCircle, Sparkles, 
  CheckCircle, ChevronRight, X, ShieldAlert, Award, Star, Compass, MessageSquare
} from 'lucide-react';

interface CourseData {
  id: string;
  title: string;
  desc: string;
  duration: string;
  lessonsCount: number;
  badge: string;
  isPremium: boolean;
  emoji: string;
  colorClass: string;
  borderColorClass: string;
}

export default function CursosPage() {
  const router = useRouter();
  const [session, setSession] = useState<UserSession | null>(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedCourseTitle, setSelectedCourseTitle] = useState('');
  const [successUpgrade, setSuccessUpgrade] = useState(false);

  useEffect(() => {
    const activeSession = getUserSession();
    if (!activeSession) {
      router.push('/auth');
      return;
    }
    setSession(activeSession);
  }, [router]);

  if (!session) {
    return null;
  }

  const COURSES_LIST: CourseData[] = [
    {
      id: 'introducao',
      title: 'Introdução aos Drones no Agro',
      desc: 'Entenda os modelos de drones, legislação aeronáutica da ANAC/DECEA e cenários comerciais de voo no Brasil.',
      duration: '3 horas',
      lessonsCount: 4,
      badge: 'Gratuito',
      isPremium: false,
      emoji: '🎯',
      colorClass: 'text-brand-green bg-brand-green/10',
      borderColorClass: 'border-zinc-200/80 hover:border-brand-green/40 bg-white hover:shadow-sm',
    },
    {
      id: 'mapeamento',
      title: 'Mapeamento Aéreo e NDVI',
      desc: 'Aprenda a planejar voos autônomos de escaneamento, processar imagens multiespectrais e gerar mapas de biomassa NDVI.',
      duration: '6 horas',
      lessonsCount: 4,
      badge: 'Exclusivo Premium',
      isPremium: true,
      emoji: '🗺️',
      colorClass: 'text-brand-blue-sky bg-brand-blue-sky/10',
      borderColorClass: 'border-zinc-200/80 hover:border-brand-blue-sky/40 bg-white hover:shadow-sm',
    },
    {
      id: 'pulverizacao',
      title: 'Pulverização Autônoma Avançada',
      desc: 'Operação de drones pesados (XAG P100 e DJI T40), calibração profissional de bicos, controle de deriva e misturas de caldas.',
      duration: '8 horas',
      lessonsCount: 4,
      badge: 'Exclusivo Premium',
      isPremium: true,
      emoji: '💧',
      colorClass: 'text-brand-amber bg-brand-amber/10',
      borderColorClass: 'border-zinc-200/80 hover:border-brand-amber/40 bg-white hover:shadow-sm',
    }
  ];

  const handleCourseAccess = (course: CourseData) => {
    if (course.isPremium && session.role === 'free') {
      setSelectedCourseTitle(course.title);
      setShowCheckoutModal(true);
    } else {
      router.push(`/cursos/${course.id}`);
    }
  };

  const handleSimulatedUpgrade = () => {
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
    }, 2500);
  };

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

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[radial-gradient(ellipse,rgba(46,125,50,0.03)_0%,transparent_70%)] pointer-events-none z-0" aria-hidden="true" />

      {/* ── NAVBAR SUPERIOR CLARA ── */}
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
            {/* BOTÃO FALAR COM PILOTO */}
            <a
              href="https://wa.me/5514999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-brand-green/20 text-brand-green text-xs font-bold transition-all duration-300 shadow-sm cursor-pointer mr-2"
              title="Falar com Piloto (WhatsApp)"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Falar com Piloto</span>
            </a>

            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-zinc-900">{session.name}</p>
              <p className="text-xs font-mono text-zinc-600 uppercase font-semibold">ROLE: {session.role}</p>
            </div>
            {session.role === 'free' && (
              <span className="px-2.5 py-1 rounded bg-zinc-100 border border-zinc-200 text-xs font-mono text-zinc-650 uppercase font-semibold">FREE USER</span>
            )}
            {session.role === 'premium' && (
              <span className="px-2.5 py-1 rounded bg-amber-50 border border-brand-amber/30 text-xs font-mono text-brand-amber uppercase font-bold">👑 PREMIUM</span>
            )}
            {session.role === 'admin' && (
              <span className="px-2.5 py-1 rounded bg-blue-50 border border-brand-blue-sky/30 text-xs font-mono text-brand-blue-sky uppercase font-bold">⚙️ ADMIN</span>
            )}
          </div>
        </div>
      </header>

      {/* ── CONTEÚDO PRINCIPAL CLARO ── */}
      <main className="relative z-10 flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* CABEÇALHO DA PÁGINA */}
        <div className="space-y-2">
          <span className="text-xs font-mono text-brand-green tracking-wider uppercase flex items-center gap-1.5 font-bold">
            <Compass className="w-4 h-4 text-brand-green animate-spin-slow" />
            TRILHAS ACADÊMICAS DE OPERADORES
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 font-heading">
            Trilhas de <span className="text-brand-green">Capacitação</span>
          </h1>
          <p className="text-sm text-zinc-600 max-w-2xl leading-relaxed">
            Selecione a trilha operacional recomendada para o seu nível de capacitação rural. Os cursos avançados cobrem as técnicas completas exigidas pelas portarias regulatórias do MAPA e da ANAC.
          </p>
        </div>

        {/* LISTAGEM DE CURSOS EM CARDS CLAROS E MODERNOS */}
        <div className="grid gap-6">
          {COURSES_LIST.map((course) => {
            const isLocked = course.isPremium && session.role === 'free';
            
            return (
              <div 
                key={course.id}
                onClick={() => handleCourseAccess(course)}
                className={`bg-white border ${course.borderColorClass} p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden group cursor-pointer transition-all duration-300 shadow-sm`}
              >
                {/* Cantoneiras HUD */}
                <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-zinc-200 group-hover:border-zinc-400 transition-colors" />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-zinc-200 group-hover:border-zinc-400 transition-colors" />

                <div className="flex items-start gap-4 flex-1">
                  {/* Ícone Redondo */}
                  <div className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-2xl ${course.colorClass}`}>
                    {course.emoji}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-bold text-zinc-900 tracking-tight group-hover:text-brand-green font-heading transition-colors">
                        {course.title}
                      </h3>
                      
                      {/* Badge */}
                      {isLocked ? (
                        <span className="px-2.5 py-1 rounded bg-amber-50 border border-brand-amber/20 text-xs font-mono text-brand-amber uppercase tracking-wider flex items-center gap-1 font-bold">
                          <Lock className="w-3 h-3" /> EXCLUSIVO PREMIUM
                        </span>
                      ) : (
                        <span className={`px-2.5 py-1 rounded text-xs font-mono uppercase tracking-wider font-bold ${
                          course.isPremium 
                            ? 'bg-emerald-50 border border-brand-green/20 text-brand-green' 
                            : 'bg-zinc-150 border border-zinc-200 text-zinc-500'
                        }`}>
                          {course.isPremium ? '★ LIBERADO PREMIUM' : 'GRATUITO'}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-zinc-600 leading-relaxed max-w-2xl">
                      {course.desc}
                    </p>

                    <div className="flex gap-4 text-xs font-mono text-zinc-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-zinc-400" /> {course.duration} de carga
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4 text-zinc-400" /> {course.lessonsCount} Módulos
                      </span>
                    </div>
                  </div>
                </div>

                {/* BOTÃO */}
                <div className="flex-shrink-0">
                  {isLocked ? (
                    <button
                      type="button"
                      className="w-full md:w-auto bg-brand-amber hover:bg-brand-amber/90 text-brand-black font-bold text-xs px-5 py-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      Desbloquear Trilha
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="w-full md:w-auto bg-zinc-900 hover:bg-brand-green text-white font-bold text-xs px-5 py-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                    >
                      <PlayCircle className="w-3.5 h-3.5 text-brand-green group-hover:text-white transition-colors" />
                      Iniciar Aulas
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </main>

      {/* MODAL DE CHECKOUT UPGRADE (COMERCIAL) */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="relative bg-white border border-zinc-200 shadow-xl max-w-md w-full p-8 rounded-2xl space-y-6 text-zinc-950">
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-brand-amber" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-brand-amber" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-brand-amber" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-brand-amber" />

            <button
              onClick={() => !successUpgrade && setShowCheckoutModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-500 hover:text-zinc-900 transition-colors"
              disabled={successUpgrade}
            >
              <X className="w-4 h-4" />
            </button>

            {successUpgrade ? (
              <div className="text-center py-8 space-y-4 animate-scale-up text-zinc-950">
                <div className="w-16 h-16 bg-emerald-50 border border-brand-green/30 text-brand-green rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold font-heading">Upgrade Concluído!</h3>
                <p className="text-sm text-zinc-600 font-mono">
                  Sessão atualizada para <span className="text-brand-green font-bold">PREMIUM ELITE</span>.
                </p>
                <p className="text-xs text-zinc-400 tracking-widest font-mono uppercase animate-pulse">LIBERANDO TRILHA...</p>
              </div>
            ) : (
              <>
                <div className="space-y-2 text-center">
                  <div className="w-12 h-12 bg-amber-50 border border-brand-amber/20 text-brand-amber rounded-xl flex items-center justify-center mx-auto">
                    <Award className="w-6 h-6 animate-bounce" />
                  </div>
                  <h3 className="text-xl font-bold font-heading">Desbloquear Área de Elite</h3>
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    O curso <span className="text-brand-amber font-semibold">"{selectedCourseTitle}"</span> exige uma conta Premium.
                  </p>
                </div>

                <div className="space-y-3 bg-zinc-50 border border-zinc-200 p-4 rounded-xl">
                  <span className="text-xs font-mono text-brand-amber tracking-wider uppercase font-bold block mb-1">VANTAGENS PREMIUM INCLUSAS:</span>
                  <ul className="space-y-2 text-sm text-zinc-650">
                    <li className="flex items-start gap-2">
                      <span className="text-brand-green text-sm flex-shrink-0">✔</span>
                      Acesso completo às trilhas de Mapeamento NDVI & Pulverização Avançada.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-green text-sm flex-shrink-0">✔</span>
                      Fórum técnico de caldas com suporte de instrutores de campo.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-green text-sm flex-shrink-0">✔</span>
                      Certificação Nacional Homologada e downloads ilimitados.
                    </li>
                  </ul>
                </div>

                <div className="flex items-baseline justify-between border-t border-zinc-150 pt-4">
                  <div>
                    <span className="text-xs font-mono text-zinc-500 uppercase block">VALOR INVESTIMENTO</span>
                    <span className="text-xl font-bold text-zinc-900">R$ 1.497,00</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs bg-brand-green/10 text-brand-green px-2.5 py-1 rounded font-mono uppercase font-bold block text-center">GRÁTIS NO MVP</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={handleSimulatedUpgrade}
                    className="w-full bg-brand-amber hover:bg-brand-amber/90 text-brand-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm text-sm"
                  >
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    Ativar Conta Premium (Simular)
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="mt-16 border-t border-zinc-200 bg-white py-8 relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center">
          <div className="flex items-center gap-3 justify-center">
            <ECRDronesLogo version={5} size={25} />
            <span className="text-xs font-mono text-zinc-500 font-bold uppercase">ECR DRONES • PORTAL DO ALUNO</span>
          </div>
          <p className="text-xs font-mono text-zinc-550">
            Aplicações dinâmicas simuladas com local storage.
          </p>
        </div>
      </footer>

    </div>
  );
}
