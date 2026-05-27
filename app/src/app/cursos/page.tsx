"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ECRDronesLogo from '@/components/ECRDronesLogo';
import { getUserSession, setUserSession, UserSession } from '@/lib/mockAuth';
import { 
  ArrowLeft, BookOpen, Clock, Lock, Unlock, PlayCircle, Sparkles, 
  CheckCircle, ChevronRight, X, ShieldAlert, Award, Star, Compass
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

  // Cursos estáticos enriquecidos para o MVP
  const COURSES_LIST: CourseData[] = [
    {
      id: 'introducao',
      title: 'Introdução aos Drones no Agro',
      desc: 'Entenda os modelos de drones, legislação aeronáutica da ANAC/DECEA e cenários comerciais de voo no Brasil.',
      duration: '3 horas',
      lessonsCount: 4, // 4 aulas base
      badge: 'Gratuito',
      isPremium: false,
      emoji: '🎯',
      colorClass: 'text-brand-green bg-brand-green/10',
      borderColorClass: 'border-brand-green/20 hover:border-brand-green/50',
    },
    {
      id: 'mapeamento',
      title: 'Mapeamento Aéreo e NDVI',
      desc: 'Aprenda a planejar voos autônomos de escaneamento, processar imagens multiespectrais e gerar mapas de biomassa NDVI.',
      duration: '6 horas',
      lessonsCount: 4, // 4 aulas base
      badge: 'Exclusivo Premium',
      isPremium: true,
      emoji: '🗺️',
      colorClass: 'text-brand-blue-sky bg-brand-blue-sky/10',
      borderColorClass: 'border-brand-blue-sky/20 hover:border-brand-blue-sky/50',
    },
    {
      id: 'pulverizacao',
      title: 'Pulverização Autônoma Avançada',
      desc: 'Operação de drones pesados (XAG P100 e DJI T40), calibração profissional de bicos, controle de deriva e misturas de caldas.',
      duration: '8 horas',
      lessonsCount: 4, // 4 aulas base
      badge: 'Exclusivo Premium',
      isPremium: true,
      emoji: '💧',
      colorClass: 'text-brand-amber bg-brand-amber/10',
      borderColorClass: 'border-brand-amber/20 hover:border-brand-amber/50 shadow-[0_0_20px_rgba(245,127,23,0.02)]',
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
    // Altera a sessão para Premium localmente
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
    <div className="min-h-screen bg-black text-white relative flex flex-col font-sans overflow-x-hidden selection:bg-brand-green selection:text-white">
      
      {/* ── GRID DE FUNDO OPERACIONAL ── */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-20" 
        style={{
          backgroundImage: `
            linear-gradient(rgba(46, 125, 50, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(46, 125, 50, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }} 
        aria-hidden="true"
      />

      {/* Glow radial superior */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[radial-gradient(ellipse,rgba(46,125,50,0.07)_0%,transparent_70%)] pointer-events-none z-0" aria-hidden="true" />

      {/* ── NAVBAR SUPERIOR ── */}
      <header className="relative z-10 border-b border-zinc-900 bg-zinc-950/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-850 hover:border-zinc-700 text-zinc-400 hover:text-white transition-all cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="h-6 w-px bg-zinc-900" />
            <ECRDronesLogo version={3} size={38} showTagline={false} />
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-white">{session.name}</p>
              <p className="text-[9px] font-mono text-zinc-500 uppercase">ROLE: {session.role}</p>
            </div>
            
            {/* BADGE DE PERFIL */}
            {session.role === 'free' && (
              <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[9px] font-mono text-zinc-400 uppercase tracking-wider">
                FREE USER
              </span>
            )}
            {session.role === 'premium' && (
              <span className="px-2 py-0.5 rounded bg-brand-amber/10 border border-brand-amber/30 text-[9px] font-mono text-brand-amber uppercase tracking-wider font-semibold">
                👑 PREMIUM
              </span>
            )}
            {session.role === 'admin' && (
              <span className="px-2 py-0.5 rounded bg-brand-blue-sky/10 border border-brand-blue-sky/30 text-[9px] font-mono text-brand-blue-sky uppercase tracking-wider font-semibold">
                ⚙️ ADMIN
              </span>
            )}
          </div>
        </div>
      </header>

      {/* ── CONTEÚDO PRINCIPAL ── */}
      <main className="relative z-10 flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* CABEÇALHO DA PÁGINA */}
        <div className="space-y-3">
          <span className="text-[10px] font-mono text-brand-green tracking-widest uppercase flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-brand-green animate-spin-slow" />
            TRILHAS ACADÊMICAS DE OPERADORES DE ELITE
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-white font-heading">
            Trilhas de <span className="text-brand-green">Capacitação</span>
          </h1>
          <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
            Selecione a trilha operacional recomendada para o seu nível de capacitação rural. Os cursos avançados cobrem as técnicas completas exigidas pelas portarias regulatórias do MAPA e da ANAC.
          </p>
        </div>

        {/* LISTAGEM DE CURSOS EM FORMATO BENTO / CARDS PREMIUM */}
        <div className="grid gap-6">
          {COURSES_LIST.map((course) => {
            const isLocked = course.isPremium && session.role === 'free';
            
            return (
              <div 
                key={course.id}
                onClick={() => handleCourseAccess(course)}
                className={`bg-zinc-950 border ${course.borderColorClass} p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden group cursor-pointer transition-all duration-300`}
              >
                {/* Cantoneiras HUD */}
                <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-zinc-800 group-hover:border-zinc-500 transition-colors" />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-zinc-800 group-hover:border-zinc-500 transition-colors" />

                <div className="flex items-start gap-4 flex-1">
                  {/* Ícone Redondo */}
                  <div className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-2xl ${course.colorClass}`}>
                    {course.emoji}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-brand-green transition-colors">
                        {course.title}
                      </h3>
                      
                      {/* Badge do Curso */}
                      {isLocked ? (
                        <span className="px-2 py-0.5 rounded bg-brand-amber/10 border border-brand-amber/30 text-[8px] font-mono text-brand-amber uppercase tracking-wider flex items-center gap-1 font-semibold">
                          <Lock className="w-2.5 h-2.5" /> EXCLUSIVO PREMIUM
                        </span>
                      ) : (
                        <span className={`px-2 py-0.5 rounded text-[8px] font-mono uppercase tracking-wider font-semibold ${
                          course.isPremium 
                            ? 'bg-brand-green/10 border border-brand-green/30 text-brand-green' 
                            : 'bg-zinc-900 border border-zinc-800 text-zinc-400'
                        }`}>
                          {course.isPremium ? '★ LIBERADO PREMIUM' : 'GRATUITO'}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed max-w-2xl">
                      {course.desc}
                    </p>

                    <div className="flex gap-4 text-[10px] font-mono text-zinc-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {course.duration} de carga
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" /> {course.lessonsCount} Módulos Integrados
                      </span>
                    </div>
                  </div>
                </div>

                {/* BOTÃO DE ACESSO OU BLOQUEIO */}
                <div className="flex-shrink-0">
                  {isLocked ? (
                    <button
                      type="button"
                      className="w-full md:w-auto bg-brand-amber hover:bg-brand-amber-dark border border-brand-amber/30 hover:border-brand-amber/60 text-brand-black font-bold text-xs px-5 py-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(245,127,23,0.1)]"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      Desbloquear Trilha
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="w-full md:w-auto bg-zinc-900 hover:bg-brand-green border border-zinc-850 hover:border-brand-green/60 text-white hover:text-white font-bold text-xs px-5 py-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
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

      {/* ── MODAL DE CHECKOUT COMERCIAL SIMULADO (UPGRADE DE CONTA) ── */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          
          <div className="relative bg-zinc-950 border border-brand-amber/40 shadow-[0_0_40px_rgba(245,127,23,0.08)] max-w-lg w-full p-8 rounded-2xl space-y-6">
            
            {/* Cantoneiras HUD do Modal */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-brand-amber" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-brand-amber" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-brand-amber" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-brand-amber" />

            {/* BOTÃO FECHAR */}
            <button
              onClick={() => !successUpgrade && setShowCheckoutModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-zinc-900 border border-zinc-850 text-zinc-500 hover:text-white transition-colors cursor-pointer"
              disabled={successUpgrade}
            >
              <X className="w-4 h-4" />
            </button>

            {successUpgrade ? (
              <div className="text-center py-8 space-y-4 animate-scale-up">
                <div className="w-16 h-16 bg-brand-green/20 border border-brand-green/50 text-brand-green rounded-full flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(46,125,50,0.2)]">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-white">Upgrade Concluído!</h3>
                <p className="text-xs text-zinc-400 font-mono">
                  Sessão atualizada para <span className="text-brand-green font-bold">PREMIUM ELITE</span> com sucesso.
                </p>
                <p className="text-[10px] text-zinc-500 tracking-widest font-mono uppercase animate-pulse">LIBERANDO ACESSO GERAL...</p>
              </div>
            ) : (
              <>
                {/* CABEÇALHO DO MODAL */}
                <div className="space-y-2 text-center">
                  <div className="w-12 h-12 bg-brand-amber/10 border border-brand-amber/30 text-brand-amber rounded-xl flex items-center justify-center mx-auto">
                    <Award className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight">Desbloquear Área de Elite</h3>
                  <p className="text-xs text-zinc-400">
                    O curso <span className="text-brand-amber font-semibold">"{selectedCourseTitle}"</span> exige uma conta Premium.
                  </p>
                </div>

                {/* VANTAGENS DO PREMIUM */}
                <div className="space-y-3 bg-zinc-900/40 border border-zinc-850 p-4 rounded-xl">
                  <span className="text-[9px] font-mono text-brand-amber tracking-widest uppercase font-bold">VANTAGENS PREMIUM INCLUSAS:</span>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    <li className="flex items-start gap-2">
                      <span className="text-brand-green text-sm flex-shrink-0">✔</span>
                      Acesso completo às trilhas de Mapeamento NDVI & Pulverização Avançada.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-green text-sm flex-shrink-0">✔</span>
                      Participação ilimitada no Fórum de Operadores de Campo.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-green text-sm flex-shrink-0">✔</span>
                      Central de downloads ilimitada (manuais oficiais e planilhas de bicos).
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-green text-sm flex-shrink-0">✔</span>
                      Certificação Oficial Homologada com validade comercial nacional.
                    </li>
                  </ul>
                </div>

                {/* DETALHE DE PREÇO */}
                <div className="flex items-baseline justify-between border-t border-zinc-900 pt-4">
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block">VALOR INVESTIMENTO</span>
                    <span className="text-xl font-bold text-white">R$ 1.497,00</span>
                    <span className="text-[10px] text-zinc-400"> vitalício</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-brand-green block">PREÇO DO MVP DE SIMULAÇÃO</span>
                    <span className="text-[10px] bg-brand-green/10 text-brand-green px-2 py-0.5 rounded font-mono uppercase tracking-wider font-bold">100% GRÁTIS HOJE</span>
                  </div>
                </div>

                {/* BOTÃO DE UPGRADE SIMULADO */}
                <div className="space-y-2">
                  <button
                    onClick={handleSimulatedUpgrade}
                    className="w-full bg-brand-amber hover:bg-brand-amber-dark border border-brand-amber/40 hover:border-brand-amber/80 text-brand-black font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_20px_rgba(245,127,23,0.15)] text-sm"
                  >
                    <Sparkles className="w-4 h-4 text-brand-black animate-pulse" />
                    Ativar Conta Premium de Elite (Simular)
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <p className="text-[9px] font-mono text-zinc-500 text-center uppercase tracking-wide">
                    DICA DE VENDA: Mostre ao seu cliente a ativação instantânea em tempo real!
                  </p>
                </div>
              </>
            )}

          </div>

        </div>
      )}

      {/* ── FOOTER ── */}
      <footer className="mt-16 border-t border-zinc-900 bg-zinc-950/45 py-8 relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center">
          <div className="flex items-center gap-3 justify-center">
            <ECRDronesLogo version={5} size={25} />
            <span className="text-[10px] font-mono text-zinc-500">ECR DRONES • TRILHAS OPERACIONAIS MVP</span>
          </div>
          <p className="text-[10px] font-mono text-zinc-650">
            Acesso didático controlado por perfis de simulação local.
          </p>
        </div>
      </footer>

    </div>
  );
}
