"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ECRDronesLogo from '@/components/ECRDronesLogo';
import { getUserSession, clearUserSession, getCompletedLessons, UserSession, getAdminLessons } from '@/lib/mockAuth';
import { 
  Play, BookOpen, MessageSquare, Download, Tv, ShieldAlert, 
  LogOut, GraduationCap, CheckCircle2, AlertCircle, ArrowRight,
  TrendingUp, Award, Calendar, Compass, Briefcase, Lock, Calculator
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<UserSession | null>(null);
  const [completedCount, setCompletedCount] = useState(0);
  const [totalLessons, setTotalLessons] = useState(12); // 12 aulas base padrão
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const activeSession = getUserSession();
    if (!activeSession) {
      router.push('/auth');
      return;
    }
    setSession(activeSession);
    
    // Calcula progresso real
    const completed = getCompletedLessons();
    setCompletedCount(completed.length);
    
    // Aulas totais = 12 base + criadas por admin
    const newLessons = getAdminLessons();
    setTotalLessons(12 + newLessons.length);
    
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    clearUserSession();
    router.push('/auth');
  };

  if (loading || !session) {
    return (
      <div className="min-h-screen bg-zinc-50 text-zinc-900 flex items-center justify-center font-mono text-sm">
        <div className="flex flex-col items-center gap-4">
          <span className="w-10 h-10 border-4 border-brand-green border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-brand-green tracking-wider uppercase animate-pulse font-semibold">Sincronizando Telemetria...</p>
        </div>
      </div>
    );
  }

  const progressPercent = Math.min(100, Math.round((completedCount / totalLessons) * 100));

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

      {/* Glow radial superior suave */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[radial-gradient(ellipse,rgba(46,125,50,0.03)_0%,transparent_70%)] pointer-events-none z-0" aria-hidden="true" />

      {/* ── NAVBAR SUPERIOR INTEGRADA CLARA ── */}
      <header className="relative z-10 border-b border-zinc-200/80 bg-white/90 backdrop-blur-xl shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="cursor-pointer">
              <ECRDronesLogo version={3} size={40} showTagline={false} />
            </Link>
            <div className="h-6 w-px bg-zinc-200 hidden sm:block" />
            <span className="text-xs font-mono text-zinc-500 hidden sm:block tracking-wider font-semibold">PORTAL DO ALUNO</span>
          </div>

          <div className="flex items-center gap-4">
            {/* INFORMAÇÃO DO USUÁRIO LOGADO */}
            <div className="text-right hidden md:block">
              <p className="text-xs font-bold text-zinc-900">{session.name}</p>
              <p className="text-xs font-mono text-zinc-500 font-semibold">{session.email}</p>
            </div>

            {/* BADGE DE PERFIL */}
            <div className="flex items-center">
              {session.role === 'free' && (
                <span className="px-2.5 py-1 rounded bg-zinc-100 border border-zinc-200 text-xs font-mono text-zinc-500 uppercase tracking-wider font-semibold">
                  Acesso Gratuito
                </span>
              )}
              {session.role === 'premium' && (
                <span className="px-2.5 py-1 rounded bg-amber-50 border border-brand-amber/30 text-xs font-mono text-brand-amber uppercase tracking-wider shadow-sm font-bold">
                  👑 PREMIUM ELITE
                </span>
              )}
              {session.role === 'admin' && (
                <span className="px-2.5 py-1 rounded bg-blue-50 border border-brand-blue-sky/30 text-xs font-mono text-brand-blue-sky uppercase tracking-wider shadow-sm font-bold">
                  ⚙️ ADMINISTRADOR
                </span>
              )}
            </div>

            {/* BOTÃO FALAR COM PILOTO (WHATSAPP DE MOCK) */}
            <a
              href="https://wa.me/5514999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-brand-green/20 text-brand-green text-xs font-bold transition-all duration-300 shadow-sm cursor-pointer"
              title="Falar com Piloto (WhatsApp)"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Falar com Piloto</span>
            </a>

            {/* BOTÃO LOGOUT */}
            <button
              onClick={handleLogout}
              className="p-2 rounded bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 hover:border-red-200 text-zinc-500 hover:text-red-500 transition-all duration-300 cursor-pointer"
              title="Desconectar"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ── CONTEÚDO PRINCIPAL ── */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* BANNER DE BOAS VINDAS CLEAN */}
        <section className="bg-white border border-zinc-200/80 shadow-sm p-6 rounded-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-brand-green" />
          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-brand-amber" />

          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-mono text-brand-green tracking-wider uppercase flex items-center gap-1.5 font-bold">
              <span className="w-1.5 h-1.5 bg-brand-green rounded-full animate-ping" />
              SISTEMA ACADÊMICO OPERACIONAL ATIVO
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight font-heading">
              Olá, <span className="text-brand-green">{session.name.split(' ')[0]}</span>!
            </h1>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Bem-vindo à cabine de aprendizado operacional da ECR Drones. Gerencie seu progresso nas trilhas agrícolas, acesse manuais homologados do MAPA e tire dúvidas de pulverização no fórum com operadores reais do campo.
            </p>
          </div>

          {/* PROGRESSO */}
          <div className="bg-zinc-50 border border-zinc-150 p-4 rounded-xl flex items-center gap-4 min-w-[260px] relative">
            <div className="w-12 h-12 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="flex-1 space-y-1.5">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-mono text-zinc-500 font-semibold">SEU PROGRESSO</span>
                <span className="text-sm font-mono font-bold text-brand-green">{progressPercent}%</span>
              </div>
              <div className="h-2 bg-zinc-200 rounded-full overflow-hidden border border-zinc-300/40">
                <div 
                  className="h-full bg-brand-green rounded-full transition-all duration-1000 shadow-sm"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-xs font-mono text-zinc-500 tracking-wider">
                {completedCount} DE {totalLessons} LIÇÕES CONCLUÍDAS
              </p>
            </div>
          </div>
        </section>

        {/* ── BENTO GRID PRINCIPAL CLEAN ── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* CARD 1: CURSOS & TRILHAS (2/3 de largura) */}
          <div className="md:col-span-2 bg-white border border-zinc-200/80 shadow-sm p-6 rounded-2xl flex flex-col justify-between relative group hover:border-brand-green/40 hover:shadow-md transition-all duration-300">
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-brand-green" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-brand-green" />
            
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-lg bg-brand-green/10 flex items-center justify-center text-brand-green">
                  <BookOpen className="w-5 h-5" />
                </div>
                {session.role === 'free' && (
                  <span className="text-xs font-mono bg-red-50 border border-red-200 text-red-600 px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1 font-semibold">
                    <AlertCircle className="w-2.5 h-2.5" /> 2 Cursos Travados
                  </span>
                )}
                {(session.role === 'premium' || session.role === 'admin') && (
                  <span className="text-xs font-mono bg-brand-green/10 border border-brand-green/30 text-brand-green px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-2.5 h-2.5" /> Acesso Total Liberado
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-zinc-900 font-heading tracking-tight flex items-center gap-2">
                  Trilhas Operacionais de Campo
                  <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-brand-green group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-sm text-zinc-650">
                  Estude as técnicas aeronáuticas rurais, processamento de NDVI de alta definição no QGIS e pulverização prática sem riscos de deriva com os drones P100PRO e DJI T40/T50.
                </p>
              </div>

              {/* Lista compacta de Trilhas */}
              <div className="grid sm:grid-cols-3 gap-3 pt-3 border-t border-zinc-100">
                <div className="bg-zinc-50 border border-zinc-150 p-3 rounded-xl space-y-1">
                  <span className="text-xs font-mono text-brand-green uppercase tracking-wider font-bold">1. INTRODUÇÃO</span>
                  <p className="text-sm font-bold text-zinc-900">Drones no Agro</p>
                  <p className="text-xs font-mono text-zinc-500">Gratuito • 4 Aulas</p>
                </div>
                <div className="bg-zinc-50 border border-zinc-150 p-3 rounded-xl space-y-1 relative">
                  {session.role === 'free' && <div className="absolute inset-0 bg-white/85 rounded-xl flex items-center justify-center text-xs font-mono text-brand-amber font-bold">🔒 PREMIUM</div>}
                  <span className="text-xs font-mono text-brand-blue-sky uppercase tracking-wider font-bold">2. ANÁLISE NDVI</span>
                  <p className="text-sm font-bold text-zinc-900">Mapeamento Aéreo</p>
                  <p className="text-xs font-mono text-zinc-500">Premium • 4 Aulas</p>
                </div>
                <div className="bg-zinc-50 border border-zinc-150 p-3 rounded-xl space-y-1 relative">
                  {session.role === 'free' && <div className="absolute inset-0 bg-white/85 rounded-xl flex items-center justify-center text-xs font-mono text-brand-amber font-bold">🔒 PREMIUM</div>}
                  <span className="text-xs font-mono text-brand-amber uppercase tracking-wider font-bold">3. APLICAÇÃO</span>
                  <p className="text-sm font-bold text-zinc-900">Pulverização</p>
                  <p className="text-xs font-mono text-zinc-500">Premium • 4 Aulas</p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Link href="/cursos/introducao" className="w-full bg-zinc-900 hover:bg-brand-green border border-zinc-800 text-white font-bold text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm">
                Acessar Sala de Aulas
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* CARD 2: LIVES & AGENDAS */}
          <div className="bg-white border border-zinc-200/80 shadow-sm p-6 rounded-2xl flex flex-col justify-between relative group hover:border-brand-amber/40 hover:shadow-md transition-all duration-300">
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-brand-amber" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-brand-amber" />
            
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-lg bg-brand-amber/10 flex items-center justify-center text-brand-amber">
                  <Tv className="w-5 h-5 animate-pulse" />
                </div>
                <span className="text-xs font-mono bg-brand-amber/10 border border-brand-amber/30 text-brand-amber px-2 py-0.5 rounded uppercase tracking-wider font-bold">
                  ● TRANSMISSÃO
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-zinc-900 font-heading tracking-tight flex items-center gap-2">
                  Transmissões ao Vivo
                  <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-brand-amber group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-sm text-zinc-650">
                  Participe de mentorias operacionais ao vivo com os instrutores da ECR Drones, tirando suas dúvidas sobre bicos e caldas centrífugas complexas na hora.
                </p>
              </div>

              <div className="p-3 bg-zinc-50 border border-zinc-150 rounded-xl flex items-center gap-3">
                <Calendar className="w-5 h-5 text-brand-amber" />
                <div>
                  <p className="text-sm font-bold text-zinc-900 leading-tight">Quarta Técnica com Rômulo</p>
                  <p className="text-xs font-mono text-zinc-500 mt-0.5">Hoje às 19:30 • YouTube Live</p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Link href="/lives" className="w-full bg-zinc-900 hover:bg-brand-amber border border-zinc-800 text-white font-bold text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer">
                Sintonizar Live
                <Tv className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* CARD 3: FÓRUM & DISCUSSBASE */}
          <div className="bg-white border border-zinc-200/80 shadow-sm p-6 rounded-2xl flex flex-col justify-between relative group hover:border-brand-blue-sky/40 hover:shadow-md transition-all duration-300">
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-brand-blue-sky" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-brand-blue-sky" />
            
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-lg bg-brand-blue-sky/10 flex items-center justify-center text-brand-blue-sky">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono bg-brand-blue-sky/10 border border-brand-blue-sky/30 text-brand-blue-sky px-2 py-0.5 rounded uppercase font-bold">
                  Comunidade
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-zinc-900 font-heading tracking-tight flex items-center gap-2">
                  Fórum de Operadores
                  <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-brand-blue-sky group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-sm text-zinc-655">
                  Troque experiências reais de voo, compartilhe receitas de calda, calibração de bicos de atomizadores rotativos e obtenha soluções para problemas no solo.
                </p>
              </div>

              <div className="space-y-1 text-xs font-mono text-zinc-500 border-t border-zinc-100 pt-3">
                <div className="flex justify-between">
                  <span>Tópico mais ativo:</span>
                  <span className="text-zinc-900 font-bold">Calibração de Bicos</span>
                </div>
                <div className="flex justify-between">
                  <span>Respostas hoje:</span>
                  <span className="text-brand-green font-bold">+14 respostas</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Link href="/forum" className="w-full bg-zinc-900 hover:bg-brand-blue-sky border border-zinc-800 text-white font-bold text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer">
                Entrar no Fórum
                <MessageSquare className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* CARD 4: CENTRAL DE DOWNLOADS */}
          <div className="bg-white border border-zinc-200/80 shadow-sm p-6 rounded-2xl flex flex-col justify-between relative group hover:border-brand-green/40 hover:shadow-md transition-all duration-300">
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-brand-green" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-brand-green" />
            
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-lg bg-brand-green/10 flex items-center justify-center text-brand-green">
                  <Download className="w-5 h-5" />
                </div>
                {session.role === 'free' && (
                  <span className="text-xs font-mono bg-zinc-100 border border-zinc-200 text-zinc-550 px-2 py-0.5 rounded">
                    Limite: 3 downloads
                  </span>
                )}
                {(session.role === 'premium' || session.role === 'admin') && (
                  <span className="text-xs font-mono bg-brand-green/10 border border-brand-green/30 text-brand-green px-2 py-0.5 rounded uppercase font-bold">
                    Ilimitado
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-zinc-900 font-heading tracking-tight flex items-center gap-2">
                  Biblioteca Técnica
                  <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-brand-green group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-sm text-zinc-655">
                  Tenha acesso aos manuais oficiais da ANAC, cartilhas de calibração de bicos agrícolas da XAG/DJI e planilhas integradas de cálculo de vazão.
                </p>
              </div>

              <div className="p-3 bg-zinc-50 border border-zinc-150 rounded-xl text-center">
                <span className="text-xs font-mono text-zinc-500 block mb-0.5">ARQUIVO EM DESTAQUE</span>
                <p className="text-sm font-bold text-zinc-900 leading-tight">Manual DJI T40/P100 Pro.pdf</p>
              </div>
            </div>

            <div className="pt-6">
              <Link href="/biblioteca" className="w-full bg-zinc-900 hover:bg-brand-green border border-zinc-800 text-white font-bold text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer">
                Acessar Downloads
                <Download className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* CARD CONDICIONAL: ADMIN OU ESTATÍSTICA DE MERCADO */}
          {(session.role === 'admin') ? (
            <div className="bg-white border border-brand-blue-sky/30 shadow-sm p-6 rounded-2xl flex flex-col justify-between relative group hover:border-brand-blue-sky/60 hover:shadow-md transition-all duration-300">
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-brand-blue-sky" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-brand-blue-sky" />
              
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-lg bg-brand-blue-sky/20 flex items-center justify-center text-brand-blue-sky">
                    <ShieldAlert className="w-5 h-5 animate-pulse" />
                  </div>
                  <span className="text-xs font-mono bg-brand-blue-sky/15 border border-brand-blue-sky/30 text-brand-blue-sky px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                    SYS ADMIN
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-zinc-900 font-heading tracking-tight flex items-center gap-2">
                    Painel do Administrador
                    <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-brand-blue-sky group-hover:translate-x-1 transition-all" />
                  </h3>
                  <p className="text-sm text-zinc-650">
                    Ferramenta exclusiva de demonstração. Adicione novas aulas na grade curricular dos alunos e faça o upload simulado de novos materiais em tempo real.
                  </p>
                </div>

                <div className="space-y-1 text-xs font-mono text-zinc-550 bg-zinc-50 p-3 rounded-xl border border-zinc-150">
                  <div className="flex justify-between text-brand-blue-sky font-semibold">
                    <span>STATUS SISTEMA:</span>
                    <span>100% OPERANTE</span>
                  </div>
                  <div className="flex justify-between">
                    <span>AULAS EXTRAS CRIADAS:</span>
                    <span className="text-zinc-900 font-bold">{totalLessons - 12} aulas</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Link href="/admin" className="w-full bg-brand-blue-sky hover:bg-brand-blue-sky/90 border border-brand-blue-sky/30 text-white font-bold text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm">
                  Acessar Painel Admin
                  <ShieldAlert className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-zinc-200/80 shadow-sm p-6 rounded-2xl flex flex-col justify-between relative group hover:border-brand-amber/40 hover:shadow-md transition-all duration-300">
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-brand-amber" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-brand-amber" />
              
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-lg bg-brand-amber/10 flex items-center justify-center text-brand-amber">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono bg-zinc-100 border border-zinc-200 text-zinc-500 px-2 py-0.5 rounded">
                    Mercado do Agro
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-zinc-900 font-heading tracking-tight flex items-center gap-2">
                    Estatísticas de Produtividade
                  </h3>
                  <p className="text-sm text-zinc-650">
                    A operação certificada de drones reduz o desperdício de insumos no baixeiro da cultura em até 40%, além de otimizar a velocidade de pulverização para 20 hectares por hora.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center pt-3 border-t border-zinc-100">
                  <div className="bg-zinc-50 p-2.5 rounded-lg">
                    <span className="text-sm font-mono font-bold text-brand-green">+30%</span>
                    <p className="text-xs font-mono text-zinc-550 uppercase">PRODUTIVIDADE</p>
                  </div>
                  <div className="bg-zinc-50 p-2.5 rounded-lg">
                    <span className="text-sm font-mono font-bold text-brand-amber">R$ 8.500</span>
                    <p className="text-xs font-mono text-zinc-550 uppercase">SALÁRIO MÉDIO</p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Link href="/calculadora" className="w-full bg-zinc-900 hover:bg-brand-amber border border-zinc-800 text-white font-bold text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer">
                  Abrir Calculadora ROI
                  <Calculator className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

          {/* CARD 6: MEU NEGÓCIO (PREMIUM ONLY) */}
          <div className={`md:col-span-2 bg-white border shadow-sm p-6 rounded-2xl flex flex-col justify-between relative group transition-all duration-300 ${
            (session.role === 'premium' || session.role === 'admin')
              ? 'border-violet-200/80 hover:border-violet-400/40 hover:shadow-md'
              : 'border-zinc-200/80 hover:border-zinc-300'
          }`}>
            <div className={`absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 ${
              (session.role === 'premium' || session.role === 'admin') ? 'border-violet-400' : 'border-zinc-300'
            }`} />
            <div className={`absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 ${
              (session.role === 'premium' || session.role === 'admin') ? 'border-violet-400' : 'border-zinc-300'
            }`} />

            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  (session.role === 'premium' || session.role === 'admin') ? 'bg-violet-50 text-violet-600' : 'bg-zinc-100 text-zinc-400'
                }`}>
                  <Briefcase className="w-5 h-5" />
                </div>
                {session.role === 'free' ? (
                  <span className="text-xs font-mono bg-amber-50 border border-brand-amber/30 text-brand-amber px-2 py-0.5 rounded uppercase font-bold flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" /> Exclusivo Premium
                  </span>
                ) : (
                  <span className="text-xs font-mono bg-violet-50 border border-violet-200 text-violet-600 px-2 py-0.5 rounded uppercase font-bold">
                    ✦ BUSINESS TOOLS
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-zinc-900 font-heading tracking-tight flex items-center gap-2">
                  Meu Negócio
                  <ArrowRight className={`w-4 h-4 transition-all ${
                    (session.role === 'premium' || session.role === 'admin')
                      ? 'text-zinc-400 group-hover:text-violet-500 group-hover:translate-x-1'
                      : 'text-zinc-300'
                  }`} />
                </h3>
                <p className="text-sm text-zinc-650">
                  CRM de clientes, gerador de orçamentos em PDF e modelos de contrato de prestação de serviço. Gerencie sua empresa de drones diretamente aqui.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-zinc-100">
                <div className="bg-zinc-50 border border-zinc-150 p-3 rounded-lg text-center">
                  <span className="text-base">👥</span>
                  <p className="text-xs font-mono text-zinc-550 mt-0.5">CRM</p>
                </div>
                <div className="bg-zinc-50 border border-zinc-150 p-3 rounded-lg text-center">
                  <span className="text-base">📄</span>
                  <p className="text-xs font-mono text-zinc-550 mt-0.5">Orçamento PDF</p>
                </div>
                <div className="bg-zinc-50 border border-zinc-150 p-3 rounded-lg text-center">
                  <span className="text-base">📋</span>
                  <p className="text-xs font-mono text-zinc-550 mt-0.5">Contratos</p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              {(session.role === 'premium' || session.role === 'admin') ? (
                <Link href="/negocio" className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm">
                  <Briefcase className="w-3.5 h-3.5" />
                  Abrir Meu Negócio
                </Link>
              ) : (
                <Link href="/cursos" className="w-full bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-500 font-bold text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer">
                  <Lock className="w-3.5 h-3.5" />
                  Fazer Upgrade para Premium
                </Link>
              )}
            </div>
          </div>

        </section>

      </main>

      {/* ── FOOTER DO PORTAL CLARO ── */}
      <footer className="mt-16 border-t border-zinc-200 bg-white py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center">
          <div className="flex items-center gap-3 justify-center">
            <ECRDronesLogo version={5} size={25} />
            <span className="text-xs font-mono text-zinc-550 font-bold uppercase">ECR DRONES • PORTAL DO ALUNO</span>
          </div>
          <p className="text-xs font-mono text-zinc-550">
            Aplicações aeronáuticas agrícolas de alta precisão.
          </p>
          <div className="flex gap-4 text-xs font-mono text-brand-green font-semibold">
            <span className="hover:underline cursor-pointer">Termos de Uso</span>
            <span className="hover:underline cursor-pointer">Política de Voo</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
