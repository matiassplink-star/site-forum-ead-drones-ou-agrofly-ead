"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ECRDronesLogo from '@/components/ECRDronesLogo';
import { getUserSession, clearUserSession, getCompletedLessons, UserSession, getAdminLessons } from '@/lib/mockAuth';
import { 
  Play, BookOpen, MessageSquare, Download, Tv, ShieldAlert, 
  LogOut, GraduationCap, CheckCircle2, AlertCircle, ArrowRight,
  TrendingUp, Award, Calendar, Compass
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
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono">
        <div className="flex flex-col items-center gap-4">
          <span className="w-10 h-10 border-4 border-brand-green border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-brand-green tracking-widest uppercase animate-pulse">Sincronizando Telemetria...</p>
        </div>
      </div>
    );
  }

  const progressPercent = Math.min(100, Math.round((completedCount / totalLessons) * 100));

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
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[radial-gradient(ellipse,rgba(46,125,50,0.08)_0%,transparent_70%)] pointer-events-none z-0" aria-hidden="true" />

      {/* ── NAVBAR SUPERIOR INTEGRADA ── */}
      <header className="relative z-10 border-b border-zinc-900 bg-zinc-950/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="cursor-pointer">
              <ECRDronesLogo version={3} size={40} showTagline={false} />
            </Link>
            <div className="h-6 w-px bg-zinc-900 hidden sm:block" />
            <span className="text-[10px] font-mono text-zinc-500 hidden sm:block tracking-wider">PORTAL OPERACIONAL DO ALUNO</span>
          </div>

          <div className="flex items-center gap-4">
            {/* INFORMAÇÃO DO USUÁRIO LOGADO */}
            <div className="text-right hidden md:block">
              <p className="text-xs font-bold text-white">{session.name}</p>
              <p className="text-[10px] font-mono text-zinc-400">{session.email}</p>
            </div>

            {/* BADGE DE ROLE (PERFIL) */}
            <div className="flex items-center">
              {session.role === 'free' && (
                <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                  Acesso Gratuito
                </span>
              )}
              {session.role === 'premium' && (
                <span className="px-2.5 py-1 rounded bg-brand-amber/10 border border-brand-amber/30 text-[10px] font-mono text-brand-amber uppercase tracking-widest shadow-[0_0_15px_rgba(245,127,23,0.1)] font-semibold">
                  👑 PREMIUM ELITE
                </span>
              )}
              {session.role === 'admin' && (
                <span className="px-2.5 py-1 rounded bg-brand-blue-sky/10 border border-brand-blue-sky/30 text-[10px] font-mono text-brand-blue-sky uppercase tracking-widest shadow-[0_0_15px_rgba(21,101,192,0.1)] font-semibold">
                  ⚙️ ADMINISTRADOR
                </span>
              )}
            </div>

            {/* BOTÃO LOGOUT */}
            <button
              onClick={handleLogout}
              className="p-2 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-850 hover:border-red-900/50 text-zinc-400 hover:text-red-400 transition-all duration-300 cursor-pointer"
              title="Desconectar Equipamento"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ── CONTEÚDO PRINCIPAL ── */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* BANNER DE BOAS VINDAS COM TELEMETRIA */}
        <section className="bg-zinc-950 border border-zinc-900/90 p-6 rounded-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-brand-green" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-brand-amber" />

          <div className="space-y-3 max-w-2xl">
            <span className="text-[10px] font-mono text-brand-green tracking-widest uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-brand-green rounded-full animate-ping" />
              SISTEMA INTEGRADO OPERACIONAL ATIVO
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Olá, <span className="text-brand-amber">{session.name.split(' ')[0]}</span>!
            </h1>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Você está na cabine de telemetria da ECR Drones. Gerencie seu aprendizado operacional agrícola de precisão, faça download de manuais técnicos homologados do MAPA e tire dúvidas de pulverização com operadores reais de todo o Brasil.
            </p>
          </div>

          {/* PAINEL DE PROGRESSO CIRCULAR / BARRA */}
          <div className="bg-zinc-900/40 border border-zinc-850 p-4 rounded-xl flex items-center gap-4 min-w-[260px] relative">
            <div className="w-12 h-12 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="flex-1 space-y-1.5">
              <div className="flex justify-between items-baseline">
                <span className="text-[10px] font-mono text-zinc-400">SEU PROGRESSO</span>
                <span className="text-xs font-mono font-bold text-brand-green">{progressPercent}%</span>
              </div>
              <div className="h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-900">
                <div 
                  className="h-full bg-brand-green rounded-full shadow-[0_0_10px_rgba(46,125,50,0.5)] transition-all duration-1000"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-[9px] font-mono text-zinc-500 tracking-wider">
                {completedCount} DE {totalLessons} LIÇÕES CONCLUÍDAS
              </p>
            </div>
          </div>
        </section>

        {/* ── BENTO GRID PRINCIPAL ── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* CARD 1: CURSOS & TRILHAS (2/3 de largura no desktop se combinado) */}
          <div className="md:col-span-2 bg-zinc-950 border border-zinc-900 p-6 rounded-2xl flex flex-col justify-between relative group hover:border-brand-green/40 transition-all duration-300">
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-brand-green" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-brand-green" />
            
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-lg bg-brand-green/10 flex items-center justify-center text-brand-green">
                  <BookOpen className="w-5 h-5" />
                </div>
                {session.role === 'free' && (
                  <span className="text-[9px] font-mono bg-red-950/40 border border-red-900/40 text-red-400 px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                    <AlertCircle className="w-2.5 h-2.5" /> 2 Cursos Bloqueados
                  </span>
                )}
                {(session.role === 'premium' || session.role === 'admin') && (
                  <span className="text-[9px] font-mono bg-brand-green/10 border border-brand-green/30 text-brand-green px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5" /> Acesso Completo Liberado
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  Trilhas Operacionais de Campo
                  <ArrowRight className="w-4 h-4 text-zinc-650 group-hover:text-brand-green group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-xs text-zinc-400">
                  Estude as técnicas aeronáuticas rurais, processamento de NDVI de alta definição no QGIS e pulverização prática sem riscos de deriva com os drones P100PRO e DJI T40/T50.
                </p>
              </div>

              {/* Lista compacta de Trilhas */}
              <div className="grid sm:grid-cols-3 gap-3 pt-3 border-t border-zinc-900/60">
                <div className="bg-zinc-900/30 border border-zinc-850 p-3 rounded-xl space-y-1">
                  <span className="text-[9px] font-mono text-brand-green uppercase tracking-widest font-bold">1. INTRODUÇÃO</span>
                  <p className="text-xs font-bold text-white">Drones no Agro</p>
                  <p className="text-[9px] font-mono text-zinc-500">Gratuito • 8 Aulas</p>
                </div>
                <div className="bg-zinc-900/30 border border-zinc-850 p-3 rounded-xl space-y-1 relative">
                  {session.role === 'free' && <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center text-[10px] font-mono text-brand-amber">🔒 BLOQUEADO</div>}
                  <span className="text-[9px] font-mono text-brand-blue-sky uppercase tracking-widest font-bold">2. ANÁLISE NDVI</span>
                  <p className="text-xs font-bold text-white">Mapeamento Aéreo</p>
                  <p className="text-[9px] font-mono text-zinc-500">Premium • 14 Aulas</p>
                </div>
                <div className="bg-zinc-900/30 border border-zinc-850 p-3 rounded-xl space-y-1 relative">
                  {session.role === 'free' && <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center text-[10px] font-mono text-brand-amber">🔒 BLOQUEADO</div>}
                  <span className="text-[9px] font-mono text-brand-amber uppercase tracking-widest font-bold">3. APLICAÇÃO</span>
                  <p className="text-xs font-bold text-white">Pulverização</p>
                  <p className="text-[9px] font-mono text-zinc-500">Premium • 18 Aulas</p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Link href="/cursos" className="w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-850 hover:border-brand-green/30 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer">
                Acessar Sala de Aulas
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* CARD 2: LIVES & AGENDAS */}
          <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl flex flex-col justify-between relative group hover:border-brand-amber/40 transition-all duration-300">
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-brand-amber" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-brand-amber" />
            
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-lg bg-brand-amber/10 flex items-center justify-center text-brand-amber">
                  <Tv className="w-5 h-5 animate-pulse" />
                </div>
                <span className="text-[9px] font-mono bg-brand-amber/10 border border-brand-amber/30 text-brand-amber px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1 font-semibold">
                  ● AGENDADO
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  Transmissões ao Vivo
                  <ArrowRight className="w-4 h-4 text-zinc-650 group-hover:text-brand-amber group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-xs text-zinc-400">
                  Participe de mentorias operacionais ao vivo com os gestores da ECR Drones, tirando suas dúvidas de campo e calibração de caldas complexas em tempo real.
                </p>
              </div>

              <div className="p-3 bg-zinc-900/30 border border-zinc-850 rounded-xl flex items-center gap-3">
                <Calendar className="w-5 h-5 text-brand-amber" />
                <div>
                  <p className="text-xs font-bold text-white">Quarta Técnica com Rômulo</p>
                  <p className="text-[9px] font-mono text-zinc-500">Hoje às 19:30 • YouTube Live</p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Link href="/lives" className="w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-850 hover:border-brand-amber/30 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer">
                Sintonizar Live
                <Tv className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* CARD 3: FÓRUM & DISCUSSBASE */}
          <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl flex flex-col justify-between relative group hover:border-brand-blue-sky/40 transition-all duration-300">
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-brand-blue-sky" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-brand-blue-sky" />
            
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-lg bg-brand-blue-sky/10 flex items-center justify-center text-brand-blue-sky">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <span className="text-[9px] font-mono bg-brand-blue-sky/10 border border-brand-blue-sky/30 text-brand-blue-sky px-2 py-0.5 rounded uppercase tracking-wider font-semibold">
                  Comunidade Ativa
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  Fórum de Operadores
                  <ArrowRight className="w-4 h-4 text-zinc-650 group-hover:text-brand-blue-sky group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-xs text-zinc-400">
                  Troque experiências reais de voo, compartilhe receitas de calda, calibração de bicos de atomizadores rotativos e obtenha soluções para problemas no solo.
                </p>
              </div>

              <div className="space-y-2 text-[11px] font-mono text-zinc-500 border-t border-zinc-900/60 pt-3">
                <div className="flex justify-between">
                  <span>Tópico mais ativo:</span>
                  <span className="text-white font-bold truncate max-w-[120px]">Calibração de Bicos</span>
                </div>
                <div className="flex justify-between">
                  <span>Respostas hoje:</span>
                  <span className="text-brand-green font-bold">+14 respostas</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Link href="/forum" className="w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-850 hover:border-brand-blue-sky/30 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer">
                Entrar no Fórum
                <MessageSquare className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* CARD 4: CENTRAL DE DOWNLOADS (BIBLIOTECA) */}
          <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl flex flex-col justify-between relative group hover:border-brand-green/40 transition-all duration-300">
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-brand-green" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-brand-green" />
            
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-lg bg-brand-green/10 flex items-center justify-center text-brand-green">
                  <Download className="w-5 h-5" />
                </div>
                {session.role === 'free' && (
                  <span className="text-[9px] font-mono bg-zinc-900 border border-zinc-850 text-zinc-400 px-2 py-0.5 rounded">
                    Limite: 3 downloads
                  </span>
                )}
                {(session.role === 'premium' || session.role === 'admin') && (
                  <span className="text-[9px] font-mono bg-brand-green/10 border border-brand-green/30 text-brand-green px-2 py-0.5 rounded uppercase font-semibold">
                    Ilimitado
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  Biblioteca Técnica
                  <ArrowRight className="w-4 h-4 text-zinc-650 group-hover:text-brand-green group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-xs text-zinc-400">
                  Tenha acesso aos manuais oficiais da ANAC, cartilhas de calibração de bicos agrícolas da XAG/DJI e planilhas integradas de cálculo de vazão.
                </p>
              </div>

              <div className="p-3 bg-zinc-900/30 border border-zinc-850 rounded-xl text-center">
                <span className="text-[10px] font-mono text-zinc-500 block mb-0.5">ARQUIVO EM DESTAQUE</span>
                <p className="text-xs font-bold text-white">Manual DJI T40/P100 Pro.pdf</p>
              </div>
            </div>

            <div className="pt-6">
              <Link href="/biblioteca" className="w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-850 hover:border-brand-green/30 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer">
                Acessar Downloads
                <Download className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* CARD CONDICIONAL: PAINEL ADMIN OU CARD PRODUTIVIDADE */}
          {(session.role === 'admin') ? (
            <div className="bg-zinc-950 border border-brand-blue-sky/30 shadow-[0_0_25px_rgba(21,101,192,0.05)] p-6 rounded-2xl flex flex-col justify-between relative group hover:border-brand-blue-sky/60 transition-all duration-300">
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-brand-blue-sky" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-brand-blue-sky" />
              
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-lg bg-brand-blue-sky/20 flex items-center justify-center text-brand-blue-sky">
                    <ShieldAlert className="w-5 h-5 animate-pulse" />
                  </div>
                  <span className="text-[9px] font-mono bg-brand-blue-sky/15 border border-brand-blue-sky/30 text-brand-blue-sky px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                    SYS ADMIN
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                    Painel do Administrador
                    <ArrowRight className="w-4 h-4 text-zinc-650 group-hover:text-brand-blue-sky group-hover:translate-x-1 transition-all" />
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Ferramenta exclusiva de demonstração. Adicione novas aulas na grade curricular dos alunos e faça o upload simulado de novos materiais em tempo real.
                  </p>
                </div>

                <div className="space-y-1.5 text-[10px] font-mono text-zinc-500 bg-zinc-900/30 p-3 rounded-xl border border-zinc-900">
                  <div className="flex justify-between text-brand-blue-sky">
                    <span>STATUS SISTEMA:</span>
                    <span>100% OPERANTE</span>
                  </div>
                  <div className="flex justify-between">
                    <span>AULAS EXTRAS CRIADAS:</span>
                    <span className="text-white font-bold">{totalLessons - 12} aulas</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Link href="/admin" className="w-full bg-brand-blue-sky hover:bg-brand-blue-sky/90 border border-brand-blue-sky/30 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer">
                  Acessar Painel Admin
                  <ShieldAlert className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl flex flex-col justify-between relative group hover:border-brand-amber/40 transition-all duration-300">
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-brand-amber" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-brand-amber" />
              
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-lg bg-brand-amber/10 flex items-center justify-center text-brand-amber">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] font-mono bg-zinc-900 border border-zinc-850 text-zinc-400 px-2 py-0.5 rounded">
                    Mercado do Agro
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                    Estatísticas de Produtividade
                  </h3>
                  <p className="text-xs text-zinc-400">
                    A operação certificada de drones reduz o desperdício de insumos no baixeiro da cultura em até 40%, além de otimizar a velocidade de pulverização para 20 hectares por hora.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center pt-3 border-t border-zinc-900/60">
                  <div className="bg-zinc-900/20 p-2 rounded-lg">
                    <span className="text-xs font-mono font-bold text-brand-green">+30%</span>
                    <p className="text-[8px] font-mono text-zinc-500 uppercase">PRODUTIVIDADE</p>
                  </div>
                  <div className="bg-zinc-900/20 p-2 rounded-lg">
                    <span className="text-xs font-mono font-bold text-brand-amber">R$ 8.500</span>
                    <p className="text-[8px] font-mono text-zinc-500 uppercase">SALÁRIO MÉDIO</p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Link href="/#roi-calculator" className="w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-850 hover:border-brand-amber/30 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer">
                  Simular ROI de Voo
                  <TrendingUp className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

        </section>

      </main>

      {/* ── FOOTER DO PORTAL ── */}
      <footer className="mt-16 border-t border-zinc-900 bg-zinc-950/45 py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center">
          <div className="flex items-center gap-3 justify-center">
            <ECRDronesLogo version={5} size={25} />
            <span className="text-[10px] font-mono text-zinc-500">ECR DRONES • PORTAL DO ALUNO MVP</span>
          </div>
          <p className="text-[10px] font-mono text-zinc-650">
            Aplicações aeronáuticas agrícolas de alta precisão. Desenvolvido para demonstração comercial offline.
          </p>
          <div className="flex gap-4 text-[10px] font-mono text-brand-green">
            <span className="hover:underline cursor-pointer">Termos de Uso</span>
            <span className="hover:underline cursor-pointer">Política de Voo</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
