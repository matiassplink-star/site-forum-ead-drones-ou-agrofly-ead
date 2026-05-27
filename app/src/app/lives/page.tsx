"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ECRDronesLogo from '@/components/ECRDronesLogo';
import { getUserSession, UserSession } from '@/lib/mockAuth';
import { 
  ArrowLeft, Tv, Users, MessageSquare, Send, Calendar, 
  Sparkles, Award, Star, Compass, Clock, Play 
} from 'lucide-react';

interface ChatMessage {
  id: string;
  name: string;
  role: 'free' | 'premium' | 'admin';
  text: string;
  time: string;
}

const MOCK_NAMES = [
  'Carlos Eduardo', 'Ana Paula Mendes', 'Roberto Almeida', 
  'Fernanda Costa', 'Adilson Souza', 'Marcos Rezende',
  'Juliana Ferreira', 'Rodrigo Ramos', 'Sandro Santos'
];

const MOCK_MESSAGES = [
  'Qual rotação você recomenda para gota média na soja?',
  'Essa calibração serve para calda oleosa também?',
  'O Downwash do T40 é impressionante no campo!',
  'Consegui economizar 42% de água na minha primeira aplicação física!',
  'Rômulo, qual a altura ideal de voo com vento de 6 km/h?',
  'Comprei a formação ontem e as aulas práticas são excelentes!',
  'O curso de piloto aeroagrícola mudou o patamar da minha empresa.',
  'Qual bico centrífugo usar para 15L/ha?',
  'A homologação no MAPA demorou quantos dias para vocês?',
  'Boa noite pessoal, sintonia operacional ativa aqui de Sorriso-MT!'
];

export default function LivesPage() {
  const router = useRouter();
  const [session, setSession] = useState<UserSession | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userMsg, setUserMsg] = useState('');
  const [spectators, setSpectators] = useState(132);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Carrega sessão
  useEffect(() => {
    const activeSession = getUserSession();
    if (!activeSession) {
      router.push('/auth');
      return;
    }
    setSession(activeSession);

    // Inicializa chat com algumas mensagens mockadas
    const initialMsgs: ChatMessage[] = [
      {
        id: 'msg-1',
        name: 'Carlos Eduardo',
        role: 'premium',
        text: 'Boa noite Rômulo! Excelente início de transmissão!',
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      },
      {
        id: 'msg-2',
        name: 'Ana Paula Mendes',
        role: 'premium',
        text: 'Sintonia operacional de Sorriso-MT ativa!',
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      }
    ];
    setChatMessages(initialMsgs);
  }, [router]);

  // Efeito de Chat Dinâmico (simula novas mensagens a cada 4 segundos)
  useEffect(() => {
    if (chatMessages.length === 0) return;

    const interval = setInterval(() => {
      // Sorteia um nome e uma mensagem
      const randomName = MOCK_NAMES[Math.floor(Math.random() * MOCK_NAMES.length)];
      const randomText = MOCK_MESSAGES[Math.floor(Math.random() * MOCK_MESSAGES.length)];
      const roles: ('free' | 'premium')[] = ['free', 'premium'];
      const randomRole = roles[Math.floor(Math.random() * roles.length)];

      const newMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        name: randomName,
        role: randomRole,
        text: randomText,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages((prev) => [...prev, newMsg]);

      // Oscila espectadores fictícios
      setSpectators((prev) => prev + Math.floor(Math.random() * 5) - 2);
    }, 4500);

    return () => clearInterval(interval);
  }, [chatMessages]);

  // Rola o chat para o final ao receber mensagens
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  if (!session) {
    return null;
  }

  const handleSendMsg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userMsg) return;

    const newMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      name: session.name.split(' ')[0],
      role: session.role,
      text: userMsg,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setUserMsg('');
  };

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

      {/* Glow radial superior */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[radial-gradient(ellipse,rgba(46,125,50,0.06)_0%,transparent_70%)] pointer-events-none z-0" aria-hidden="true" />

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
            {session.role === 'free' && (
              <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[9px] font-mono text-zinc-400 uppercase">FREE USER</span>
            )}
            {session.role === 'premium' && (
              <span className="px-2 py-0.5 rounded bg-brand-amber/10 border border-brand-amber/30 text-[9px] font-mono text-brand-amber uppercase font-semibold">👑 PREMIUM</span>
            )}
            {session.role === 'admin' && (
              <span className="px-2 py-0.5 rounded bg-brand-blue-sky/10 border border-brand-blue-sky/30 text-[9px] font-mono text-brand-blue-sky uppercase font-semibold">⚙️ ADMIN</span>
            )}
          </div>
        </div>
      </header>

      {/* ── CONTEÚDO PRINCIPAL ── */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 grid md:grid-cols-12 gap-8 items-stretch">
        
        {/* COLUNA ESQUERDA: TRANSMISSÃO DO YOUTUBE (8/12 colunas) */}
        <section className="md:col-span-8 flex flex-col justify-between gap-6">
          
          {/* PLAYER DA LIVE TRANSMISSÃO */}
          <div className="relative bg-zinc-950 border border-brand-amber/20 p-2 rounded-2xl overflow-hidden group shadow-[0_0_35px_rgba(245,127,23,0.02)]">
            {/* Cantoneiras HUD */}
            <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t border-l border-brand-amber" />
            <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t border-r border-brand-amber" />
            <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b border-l border-brand-amber" />
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b border-r border-brand-amber" />

            {/* STATUS LIVE AO VIVO */}
            <div className="absolute top-4 left-4 z-25 bg-red-950/80 border border-red-900/60 rounded px-2.5 py-1 flex items-center gap-2 backdrop-blur-md shadow-[0_0_15px_rgba(239,68,68,0.25)]">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
              <span className="text-[10px] font-mono font-bold text-red-400 tracking-wider">● AO VIVO</span>
            </div>

            {/* ESPECTADORES */}
            <div className="absolute top-4 right-4 z-25 bg-zinc-950/80 border border-zinc-800 rounded px-2 py-1 flex items-center gap-1.5 backdrop-blur-md">
              <Users className="w-3.5 h-3.5 text-zinc-400" />
              <span className="text-[9px] font-mono text-white font-bold">{spectators} em sintonia</span>
            </div>

            {/* VIDEO REAL DO DRONE AGRICOLA VOANDO E PULVERIZANDO */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
              <iframe
                src="https://www.youtube.com/embed/e74v1J-sM20?autoplay=0&rel=0&modestbranding=1"
                title="Mentoria Operacional de Voo da ECR Drones"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0 select-none"
              />
            </div>
          </div>

          {/* DETALHES DA LIVE */}
          <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl space-y-4 relative">
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-zinc-850" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-zinc-850" />

            <div className="space-y-1">
              <span className="text-[9px] font-mono text-zinc-550 block">MENTORIA AO VIVO OPERACIONAL</span>
              <h2 className="text-xl font-bold text-white tracking-tight">Voo de Pulverização: Calibração de Caldas e Bicos</h2>
              <div className="flex items-center gap-3 text-[10px] font-mono text-zinc-400">
                <span className="text-brand-amber font-semibold">Instrutor: Rômulo Nascimento</span>
                <span className="h-3 w-px bg-zinc-800" />
                <span className="text-brand-green">SINAL CRIPTOGRAFADO ATIVO</span>
              </div>
            </div>

            <div className="h-px bg-zinc-900" />

            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Nesta mentoria técnica de campo, debateremos as melhores práticas para calibração de atomizadores rotativos e bicos centrífugos em drones pesados, respondendo perguntas técnicas sobre misturas de defensivos para soja e cana-de-açúcar diretamente no chat.
            </p>
          </div>

        </section>

        {/* COLUNA DIREITA: CHAT DE ALUNOS DINÂMICO (4/12 colunas) */}
        <section className="md:col-span-4 bg-zinc-950 border border-zinc-900 rounded-2xl flex flex-col justify-between relative overflow-hidden h-[540px] md:h-auto">
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-zinc-850" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-zinc-850" />

          {/* Cabeçalho do Chat */}
          <div className="p-4 border-b border-zinc-900 space-y-1 bg-zinc-950/90 z-20">
            <span className="text-[9px] font-mono text-brand-green tracking-widest uppercase block">SALA DE BATE-PAPO</span>
            <h3 className="text-xs font-bold text-white">Chat dos Pilotos</h3>
          </div>

          {/* Lista de Mensagens do Chat */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 scrollbar-thin scrollbar-thumb-zinc-850">
            {chatMessages.map((msg) => (
              <div key={msg.id} className="space-y-1 text-xs animate-scale-up">
                <div className="flex items-center justify-between text-[9px] font-mono">
                  <div className="flex items-center gap-1">
                    <span className={`font-bold ${
                      msg.role === 'admin' 
                        ? 'text-brand-blue-sky' 
                        : msg.role === 'premium' 
                          ? 'text-brand-amber' 
                          : 'text-zinc-400'
                    }`}>
                      {msg.name}
                    </span>
                    {msg.role === 'admin' && (
                      <span className="px-1 py-0.1 rounded bg-brand-blue-sky/10 border border-brand-blue-sky/30 text-[6px] font-mono text-brand-blue-sky font-bold">ADMIN</span>
                    )}
                    {msg.role === 'premium' && (
                      <span className="px-1 py-0.1 rounded bg-brand-amber/10 border border-brand-amber/30 text-[6px] font-mono text-brand-amber font-bold">PREMIUM</span>
                    )}
                  </div>
                  <span className="text-zinc-650">{msg.time}</span>
                </div>
                <p className="text-zinc-300 pl-2 border-l border-zinc-900 leading-relaxed font-sans">
                  {msg.text}
                </p>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Campo de Entrada de Mensagem */}
          <form onSubmit={handleSendMsg} className="p-3 border-t border-zinc-900 bg-zinc-950/95 z-20">
            <div className="relative">
              <input
                type="text"
                required
                value={userMsg}
                onChange={(e) => setUserMsg(e.target.value)}
                placeholder="Pergunte ao Rômulo Nascimento..."
                className="w-full bg-zinc-900 border border-zinc-850 rounded-xl pl-3 pr-10 py-2.5 text-xs text-white placeholder-zinc-550 focus:outline-none focus:border-brand-amber/80 transition-all font-sans"
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-brand-amber hover:text-white transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

        </section>

      </main>

      {/* ── FOOTER ── */}
      <footer className="mt-16 border-t border-zinc-900 bg-zinc-950/45 py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center">
          <div className="flex items-center gap-3 justify-center">
            <ECRDronesLogo version={5} size={25} />
            <span className="text-[10px] font-mono text-zinc-500">ECR DRONES • LIVE STREAMING MVP</span>
          </div>
          <p className="text-[10px] font-mono text-zinc-650">
            Chat interativo e espectroscopia de público simulada.
          </p>
        </div>
      </footer>

    </div>
  );
}
