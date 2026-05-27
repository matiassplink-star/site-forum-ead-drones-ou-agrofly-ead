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

      {/* Glow radial superior suave */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[radial-gradient(ellipse,rgba(46,125,50,0.03)_0%,transparent_70%)] pointer-events-none z-0" aria-hidden="true" />

      {/* ── NAVBAR SUPERIOR INTEGRADA CLARA ── */}
      <header className="relative z-10 border-b border-zinc-200 bg-white/95 backdrop-blur-xl shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 rounded bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-500 hover:text-zinc-900 transition-all cursor-pointer">
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
              <p className="text-xs font-mono text-zinc-550 font-bold uppercase">ROLE: {session.role}</p>
            </div>
            {session.role === 'free' && (
              <span className="px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-xs font-mono text-zinc-500 uppercase font-semibold">FREE USER</span>
            )}
            {session.role === 'premium' && (
              <span className="px-2 py-0.5 rounded bg-amber-50 border border-brand-amber/30 text-xs font-mono text-brand-amber uppercase font-bold">👑 PREMIUM</span>
            )}
            {session.role === 'admin' && (
              <span className="px-2 py-0.5 rounded bg-blue-50 border border-brand-blue-sky/30 text-xs font-mono text-brand-blue-sky uppercase font-bold">⚙️ ADMIN</span>
            )}
          </div>
        </div>
      </header>

      {/* ── CONTEÚDO PRINCIPAL ── */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 grid md:grid-cols-12 gap-8 items-stretch">
        
        {/* COLUNA ESQUERDA: TRANSMISSÃO DO YOUTUBE (8/12 colunas) */}
        <section className="md:col-span-8 flex flex-col justify-between gap-6">
          
          {/* PLAYER DA LIVE TRANSMISSÃO */}
          <div className="relative bg-white border border-zinc-200/80 p-2 rounded-2xl overflow-hidden group shadow-sm">
            {/* Cantoneiras HUD */}
            <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t border-l border-zinc-300" />
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b border-r border-zinc-300" />

            {/* STATUS LIVE AO VIVO */}
            <div className="absolute top-4 left-4 z-25 bg-red-650/95 border border-red-500/30 rounded px-2.5 py-1 flex items-center gap-2 backdrop-blur-md shadow-sm">
              <span className="w-2 h-2 bg-white rounded-full animate-ping" />
              <span className="text-[10px] font-mono font-bold text-white tracking-wider">● AO VIVO</span>
            </div>

            {/* ESPECTADORES */}
            <div className="absolute top-4 right-4 z-25 bg-white/90 border border-zinc-250 rounded-lg px-2.5 py-1 flex items-center gap-1.5 backdrop-blur-md text-zinc-800 shadow-xs font-semibold">
              <Users className="w-3.5 h-3.5 text-zinc-500" />
              <span className="text-xs font-mono">{spectators} em sintonia</span>
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
          <div className="bg-white border border-zinc-200/80 p-6 rounded-2xl space-y-4 relative shadow-sm">
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-zinc-200" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-zinc-200" />

            <div className="space-y-1.5">
              <span className="text-xs font-mono text-zinc-450 block font-bold">MENTORIA AO VIVO OPERACIONAL</span>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight leading-tight">Voo de Pulverização: Calibração de Caldas e Bicos</h2>
              <div className="flex items-center gap-3 text-xs font-mono text-zinc-500 font-medium">
                <span className="text-brand-amber font-bold">Instrutor: Rômulo Nascimento</span>
                <span className="h-3 w-px bg-zinc-250" />
                <span className="text-brand-green font-bold">SINAL CRIPTOGRAFADO ATIVO</span>
              </div>
            </div>

            <div className="h-px bg-zinc-150" />

            <p className="text-sm text-zinc-650 leading-relaxed font-sans">
              Nesta mentoria técnica de campo, debateremos as melhores práticas para calibração de atomizadores rotativos e bicos centrífugos em drones pesados, respondendo perguntas técnicas sobre misturas de defensivos para soja e cana-de-açúcar diretamente no chat.
            </p>
          </div>

        </section>

        {/* COLUNA DIREITA: CHAT DE ALUNOS DINÂMICO (4/12 colunas) */}
        <section className="md:col-span-4 bg-white border border-zinc-200/80 rounded-2xl flex flex-col justify-between relative overflow-hidden h-[540px] md:h-auto shadow-sm">
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-zinc-200" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-zinc-200" />

          {/* Cabeçalho do Chat */}
          <div className="p-4 border-b border-zinc-200 space-y-1 bg-white/95 z-20 shadow-2xs">
            <span className="text-[10px] font-mono text-brand-green tracking-widest uppercase block font-bold">SALA DE BATE-PAPO</span>
            <h3 className="text-xs sm:text-sm font-bold text-zinc-900">Chat dos Pilotos</h3>
          </div>

          {/* Lista de Mensagens do Chat */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 scrollbar-thin scrollbar-thumb-zinc-250 bg-zinc-50/50">
            {chatMessages.map((msg) => (
              <div key={msg.id} className="space-y-1 text-xs sm:text-sm animate-scale-up">
                <div className="flex items-center justify-between text-[10px] font-mono font-semibold">
                  <div className="flex items-center gap-1.5">
                    <span className={`font-bold ${
                      msg.role === 'admin' 
                        ? 'text-brand-blue-sky' 
                        : msg.role === 'premium' 
                          ? 'text-brand-amber' 
                          : 'text-zinc-650'
                    }`}>
                      {msg.name}
                    </span>
                    {msg.role === 'admin' && (
                      <span className="px-1 py-0.1 rounded bg-brand-blue-sky/10 border border-brand-blue-sky/30 text-[7px] font-mono text-brand-blue-sky font-bold">ADMIN</span>
                    )}
                    {msg.role === 'premium' && (
                      <span className="px-1 py-0.1 rounded bg-brand-amber/10 border border-brand-amber/30 text-[7px] font-mono text-brand-amber font-bold">PREMIUM</span>
                    )}
                  </div>
                  <span className="text-zinc-400 font-medium">{msg.time}</span>
                </div>
                <p className="text-zinc-800 pl-2 border-l border-zinc-200 leading-relaxed font-sans text-xs sm:text-sm">
                  {msg.text}
                </p>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Campo de Entrada de Mensagem */}
          <form onSubmit={handleSendMsg} className="p-3 border-t border-zinc-200 bg-white z-20">
            <div className="relative">
              <input
                type="text"
                required
                value={userMsg}
                onChange={(e) => setUserMsg(e.target.value)}
                placeholder="Pergunte ao Rômulo Nascimento..."
                className="w-full bg-white border border-zinc-200 rounded-xl pl-3 pr-10 py-2.5 text-xs sm:text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-brand-amber focus:ring-1 focus:ring-brand-amber transition-all font-sans"
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-brand-amber hover:text-brand-amber/80 transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>

        </section>

      </main>

      {/* ── FOOTER ── */}
      <footer className="mt-16 border-t border-zinc-200 bg-white py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center">
          <div className="flex items-center gap-3 justify-center">
            <ECRDronesLogo version={5} size={25} />
            <span className="text-xs font-mono text-zinc-450">ECR DRONES • LIVE STREAMING MVP</span>
          </div>
          <p className="text-xs font-mono text-zinc-550">
            Chat interativo e espectroscopia de público simulada.
          </p>
        </div>
      </footer>

    </div>
  );
}
