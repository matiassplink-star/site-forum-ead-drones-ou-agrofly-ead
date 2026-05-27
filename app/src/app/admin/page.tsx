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
  MessageSquare
} from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  // Estados do Formulário de Nova Aula
  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState('introducao');
  const [youtubeId, setYoutubeId] = useState('');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');
  
  // Aulas extras criadas
  const [adminLessons, setAdminLessons] = useState<AdminLesson[]>([]);
  const [successMessage, setSuccessMessage] = useState('');

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
    setAdminLessons(getAdminLessons());
    setLoading(false);
  }, [router]);

  const handleCreateLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !youtubeId || !duration) return;

    const newLesson: Omit<AdminLesson, 'id'> = {
      courseId,
      title,
      youtubeId,
      duration: `${duration} min`,
      description: description || 'Esta é uma aula adicional integrada dinamicamente via painel administrativo para fins de testes do MVP.',
      isPremium: courseId !== 'introducao' // Cursos premium exigem premium
    };

    addAdminLesson(newLesson);
    setAdminLessons(getAdminLessons());
    
    // Limpa campos
    setTitle('');
    setYoutubeId('');
    setDuration('');
    setDescription('');

    setSuccessMessage('Nova aula integrada ao banco de dados com sucesso!');
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  const handleClearLessons = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ecr_new_lessons');
      setAdminLessons([]);
    }
  };

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

  // INTERCEPTOR DE SEGURANÇA SE NÃO FOR ADMIN
  if (!authorized) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] text-zinc-950 relative flex items-center justify-center p-4">
        
        {/* GRID DE FUNDO DE ALERTA CLARO */}
        <div 
          className="absolute inset-0 pointer-events-none z-0 opacity-[0.03]" 
          style={{
            backgroundImage: `
              linear-gradient(rgba(239, 68, 68, 0.4) 1px, transparent 1px),
              linear-gradient(90deg, rgba(239, 68, 68, 0.4) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }} 
          aria-hidden="true"
        />

        <div className="relative bg-white border border-red-200/80 shadow-lg max-w-md w-full p-8 rounded-2xl space-y-6 text-center z-10 animate-scale-up">
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-red-500" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-red-500" />

          <div className="w-16 h-16 bg-red-50 border border-red-200 text-red-500 rounded-full flex items-center justify-center mx-auto shadow-sm">
            <AlertTriangle className="w-8 h-8 animate-pulse" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-zinc-900 tracking-tight leading-tight">Acesso Negado</h3>
            <p className="text-xs font-mono text-zinc-550 font-semibold uppercase">
              O módulo administrativo <span className="text-red-650 font-bold">(/admin)</span> exige autorização de nível "SYS ADMIN".
            </p>
          </div>

          <p className="text-xs sm:text-sm text-zinc-650 leading-relaxed font-sans">
            Sua conta atual ({session?.name}) possui perfil limitado e não pode acessar as configurações da grade curricular. Utilize o login para entrar como Administrador.
          </p>

          <div className="space-y-2 pt-2">
            <Link 
              href="/dashboard"
              className="w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-850 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer text-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Dashboard
            </Link>
            <Link 
              href="/auth"
              className="w-full bg-red-50 hover:bg-red-100 border border-red-200 text-red-650 font-bold py-2 rounded-lg flex items-center justify-center gap-1 transition-all text-xs"
            >
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

      {/* Glow radial superior suave */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[radial-gradient(ellipse,rgba(21,101,192,0.03)_0%,transparent_70%)] pointer-events-none z-0" aria-hidden="true" />

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
              <p className="text-xs font-bold text-zinc-900">{session?.name}</p>
              <p className="text-xs font-mono text-brand-blue-sky font-bold uppercase">ROLE: {session?.role}</p>
            </div>
            <span className="px-2.5 py-1 rounded bg-blue-50 border border-brand-blue-sky/30 text-xs font-mono text-brand-blue-sky uppercase tracking-widest font-bold shadow-sm">
              ⚙️ SYS ADMIN
            </span>
          </div>
        </div>
      </header>

      {/* ── CONTEÚDO PRINCIPAL ── */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 grid md:grid-cols-12 gap-8 items-start">
        
        {/* COLUNA ESQUERDA: CADASTRAR NOVA AULA (7/12 colunas) */}
        <section className="md:col-span-7 space-y-6">
          
          <div className="space-y-2">
            <span className="text-xs font-mono text-brand-blue-sky tracking-widest uppercase flex items-center gap-1.5 font-bold">
              <Compass className="w-3.5 h-3.5 text-brand-blue-sky animate-spin-slow" />
              INTEGRAÇÃO SISTÊMICA DE DADOS DE CURSOS
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 font-heading">
              Painel de <span className="text-brand-blue-sky">Administração</span>
            </h1>
            <p className="text-sm text-zinc-650 leading-relaxed font-sans">
              Adicione videoaulas adicionais na grade de cursos em tempo real para demonstrar ao seu cliente o fluxo de sincronização dinâmica baseada no `localStorage` do navegador.
            </p>
          </div>

          {successMessage && (
            <div className="p-3.5 bg-brand-green/10 border border-brand-green/30 rounded-xl text-xs text-brand-green font-mono flex items-center gap-2 animate-scale-up font-bold shadow-sm">
              <ShieldCheck className="w-4 h-4 text-brand-green" />
              {successMessage}
            </div>
          )}

          {/* FORMULÁRIO DE CADASTRO */}
          <form onSubmit={handleCreateLesson} className="bg-white border border-brand-blue-sky/30 p-6 rounded-2xl space-y-4 relative shadow-sm hover:shadow-md transition-all duration-300">
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-brand-blue-sky" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-brand-blue-sky" />

            <div className="flex justify-between items-center pb-2 border-b border-zinc-150">
              <span className="text-xs font-mono text-brand-blue-sky uppercase tracking-wider font-bold">INTEGRAR NOVA AULA</span>
              <span className="text-xs font-mono text-zinc-400 font-medium">MOCK SERVER MODE</span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {/* TÍTULO */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-zinc-550 font-bold uppercase">Título da Videoaula</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Regulagem de Vazão DJI T40"
                  className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-450 focus:outline-none focus:border-brand-blue-sky focus:ring-1 focus:ring-brand-blue-sky transition-all"
                />
              </div>

              {/* CURSO DESTINO */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-zinc-550 font-bold uppercase">Curso de Destino</label>
                <select
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2.5 text-sm text-zinc-800 focus:outline-none focus:border-brand-blue-sky focus:ring-1 focus:ring-brand-blue-sky transition-all font-mono"
                >
                  <option value="introducao">Introdução aos Drones no Agro (Grátis)</option>
                  <option value="mapeamento">Mapeamento Aéreo e NDVI (Premium)</option>
                  <option value="pulverizacao">Pulverização Autônoma Avançada (Premium)</option>
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {/* YOUTUBE ID */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-zinc-550 font-bold uppercase">Código YouTube (ID do Vídeo)</label>
                <input
                  type="text"
                  required
                  value={youtubeId}
                  onChange={(e) => setYoutubeId(e.target.value)}
                  placeholder="Ex: c00iNpxp17g"
                  className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-450 focus:outline-none focus:border-brand-blue-sky focus:ring-1 focus:ring-brand-blue-sky transition-all font-mono"
                />
              </div>

              {/* DURAÇÃO */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-zinc-550 font-bold uppercase">Duração (Minutos)</label>
                <input
                  type="number"
                  required
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="Ex: 25"
                  className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-450 focus:outline-none focus:border-brand-blue-sky focus:ring-1 focus:ring-brand-blue-sky transition-all font-mono"
                />
              </div>
            </div>

            {/* DESCRIÇÃO */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-550 font-bold uppercase">Prescrição e Metas de Aprendizado</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva resumidamente os tópicos abordados nesta aula de demonstração..."
                className="w-full bg-white border border-zinc-200 rounded-lg p-3 text-sm text-zinc-900 placeholder-zinc-450 focus:outline-none focus:border-brand-blue-sky focus:ring-1 focus:ring-brand-blue-sky transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-brand-blue-sky hover:bg-brand-blue-sky/90 border border-brand-blue-sky/10 text-white font-extrabold text-xs py-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Salvar Aula no Servidor (Simular)
            </button>
          </form>

        </section>

        {/* COLUNA DIREITA: ESTATÍSTICAS E AULAS ADICIONADAS (5/12 colunas) */}
        <section className="md:col-span-5 space-y-6">
          
          {/* TELEMETRIA DE SISTEMA */}
          <div className="bg-white border border-zinc-200/80 p-6 rounded-2xl space-y-4 relative shadow-sm">
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-zinc-250" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-zinc-250" />

            <div className="space-y-1">
              <span className="text-xs font-mono text-zinc-450 block font-bold">ESTADO DO HARDWARE DE SIMULAÇÃO</span>
              <h3 className="text-xs sm:text-sm font-bold text-zinc-900 uppercase tracking-wider">Métricas de Conexão</h3>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-zinc-150 font-mono">
              <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-200/80 flex items-center gap-3">
                <Cpu className="w-5 h-5 text-brand-blue-sky" />
                <div>
                  <span className="text-xs font-bold text-zinc-900">12%</span>
                  <p className="text-[9px] text-zinc-450 font-bold uppercase">CPU PROCESS</p>
                </div>
              </div>
              <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-200/80 flex items-center gap-3">
                <HardDrive className="w-5 h-5 text-brand-green" />
                <div>
                  <span className="text-xs font-bold text-zinc-900">LOCAL</span>
                  <p className="text-[9px] text-zinc-450 font-bold uppercase">BANCO DADOS</p>
                </div>
              </div>
            </div>
          </div>

          {/* LISTAGEM DE AULAS ADICIONADAS */}
          <div className="bg-white border border-zinc-200/80 p-6 rounded-2xl space-y-4 relative shadow-sm">
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-zinc-250" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-zinc-250" />

            <div className="flex justify-between items-center pb-2 border-b border-zinc-150">
              <div className="space-y-0.5">
                <span className="text-xs font-mono text-zinc-450 block font-bold">DADOS DE PERSISTÊNCIA</span>
                <h3 className="text-xs sm:text-sm font-bold text-zinc-900 uppercase tracking-wider">Aulas Extras Criadas</h3>
              </div>

              {adminLessons.length > 0 && (
                <button
                  onClick={handleClearLessons}
                  className="text-xs font-mono text-red-600 border border-red-200 hover:bg-red-50 px-2.5 py-1 rounded-xl transition-all cursor-pointer font-bold"
                >
                  Limpar Todas
                </button>
              )}
            </div>

            {adminLessons.length === 0 ? (
              <div className="text-center py-8 text-zinc-400 font-mono text-xs italic">
                Nenhuma aula integrada manualmente ainda.
              </div>
            ) : (
              <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                {adminLessons.map((lesson) => (
                  <div key={lesson.id} className="bg-zinc-50 border border-zinc-200 p-3 rounded-xl flex items-center justify-between gap-3 text-xs sm:text-sm font-mono">
                    <div className="space-y-1">
                      <p className="text-zinc-900 font-bold truncate max-w-[150px]">{lesson.title}</p>
                      <div className="flex gap-2 text-[9px] text-zinc-500 font-semibold uppercase">
                        <span>Curso: {lesson.courseId}</span>
                        <span>{lesson.duration}</span>
                      </div>
                    </div>

                    <Link 
                      href={`/cursos/${lesson.courseId}`}
                      className="p-1.5 bg-white hover:bg-zinc-50 border border-zinc-200 hover:border-brand-green/30 text-brand-green rounded-lg transition-all"
                      title="Assistir Aula"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

        </section>

      </main>

      {/* ── FOOTER ── */}
      <footer className="mt-16 border-t border-zinc-200 bg-white py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center">
          <div className="flex items-center gap-3 justify-center">
            <ECRDronesLogo version={5} size={25} />
            <span className="text-xs font-mono text-zinc-450">ECR DRONES • PAINEL ADMINISTRATIVO MVP</span>
          </div>
          <p className="text-xs font-mono text-zinc-550">
            Módulo local de controle estrutural e de conteúdos.
          </p>
        </div>
      </footer>

    </div>
  );
}
