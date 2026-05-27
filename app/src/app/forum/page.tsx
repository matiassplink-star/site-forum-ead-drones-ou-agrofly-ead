"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ECRDronesLogo from '@/components/ECRDronesLogo';
import { 
  getUserSession, getForumTopics, addForumTopic, 
  addForumReply, ForumTopic, ForumReply, UserSession 
} from '@/lib/mockAuth';
import { 
  ArrowLeft, MessageSquare, Plus, MessageCircle, User, 
  Send, Calendar, Star, Compass, Filter, Sparkles 
} from 'lucide-react';

export default function ForumPage() {
  const router = useRouter();
  const [session, setSession] = useState<UserSession | null>(null);
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [selectedFilter, setSelectedFilter] = useState('Todos');
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(null);
  
  // Estados de Criação de Tópico
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Calibração & Bicos');
  const [newContent, setNewContent] = useState('');
  const [showNewTopicForm, setShowNewTopicForm] = useState(false);

  // Estado de Criação de Resposta
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    const activeSession = getUserSession();
    if (!activeSession) {
      router.push('/auth');
      return;
    }
    setSession(activeSession);
    setTopics(getForumTopics());
  }, [router]);

  if (!session) {
    return null;
  }

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;

    const topic = addForumTopic(newCategory, newTitle, newContent);
    if (topic) {
      setTopics(getForumTopics());
      setNewTitle('');
      setNewContent('');
      setShowNewTopicForm(false);
    }
  };

  const handleCreateReply = (e: React.FormEvent, topicId: string) => {
    e.preventDefault();
    if (!replyContent) return;

    const reply = addForumReply(topicId, replyContent);
    if (reply) {
      setTopics(getForumTopics());
      setReplyContent('');
    }
  };

  const filteredTopics = selectedFilter === 'Todos'
    ? topics
    : topics.filter(t => t.category === selectedFilter);

  const categories = ['Todos', 'Calibração & Bicos', 'Dúvidas Técnicas', 'Negócios & Campo'];

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
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 grid md:grid-cols-12 gap-8 items-start">
        
        {/* COLUNA ESQUERDA: LISTAGEM DE TÓPICOS E CRIAÇÃO (8/12 colunas) */}
        <section className="md:col-span-8 space-y-6">
          
          {/* APRESENTAÇÃO DO FÓRUM */}
          <div className="space-y-2">
            <span className="text-xs font-mono text-brand-green tracking-widest uppercase flex items-center gap-1.5 font-bold">
              <Compass className="w-3.5 h-3.5 text-brand-green animate-spin-slow" />
              CENTRAL DE DISCUSSÃO OPERACIONAL DA LAVOURA
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 font-heading">
              Fórum de <span className="text-brand-blue-sky">Operadores de Elite</span>
            </h1>
            <p className="text-sm text-zinc-650 leading-relaxed max-w-2xl font-sans">
              Tire dúvidas técnicas de bicos, controle de deriva, receitas de caldas complexas e compartilhe problemas no solo com pilotos reais em campo. Toda a persistência é simulada localmente.
            </p>
          </div>

          {/* FILTRO DE CATEGORIAS E BOTÃO DE NOVO TÓPICO */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white border border-zinc-200/80 p-4 rounded-2xl relative shadow-sm">
            <div className="flex flex-wrap gap-2 items-center">
              <Filter className="w-4 h-4 text-zinc-450 mr-1" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedFilter(cat)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedFilter === cat 
                      ? 'bg-brand-blue-sky border border-brand-blue-sky/10 text-white shadow-sm' 
                      : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-900 border border-zinc-200/40'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowNewTopicForm(!showNewTopicForm)}
              className="w-full sm:w-auto bg-brand-green hover:bg-brand-green/90 border border-brand-green/10 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Criar Tópico
            </button>
          </div>

          {/* FORMULÁRIO DE NOVO TÓPICO (CONDICIONAL) */}
          {showNewTopicForm && (
            <form onSubmit={handleCreateTopic} className="bg-white border border-brand-green/30 p-6 rounded-2xl space-y-4 relative shadow-sm animate-scale-up">
              <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-brand-green" />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-brand-green" />

              <div className="flex justify-between items-center pb-2 border-b border-zinc-150">
                <span className="text-xs font-mono text-brand-green uppercase tracking-wider font-bold">ABRIR NOVA DISCUSSÃO</span>
                <button 
                  type="button" 
                  onClick={() => setShowNewTopicForm(false)}
                  className="text-zinc-450 hover:text-zinc-800 text-xs font-mono font-bold"
                >
                  CANCELAR
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-550 font-bold uppercase">Título do Tópico</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Ex: Como calibrar bico XAG para deriva mínima"
                    className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-brand-blue-sky focus:ring-1 focus:ring-brand-blue-sky transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-550 font-bold uppercase">Categoria</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-800 focus:outline-none focus:border-brand-blue-sky focus:ring-1 focus:ring-brand-blue-sky transition-all font-mono"
                  >
                    <option value="Calibração & Bicos">Calibração & Bicos</option>
                    <option value="Dúvidas Técnicas">Dúvidas Técnicas</option>
                    <option value="Negócios & Campo">Negócios & Campo</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-zinc-550 font-bold uppercase">Mensagem Descritiva</label>
                <textarea
                  required
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Descreva detalhadamente o problema ou a dica que deseja compartilhar com a comunidade rural..."
                  className="w-full bg-white border border-zinc-200 rounded-lg p-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-brand-blue-sky focus:ring-1 focus:ring-brand-blue-sky transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-brand-green hover:bg-brand-green/90 border border-brand-green/10 text-white font-extrabold text-xs py-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                Publicar no Fórum
              </button>
            </form>
          )}

          {/* LISTAGEM DE DISCUSSÕES */}
          <div className="space-y-4">
            {filteredTopics.length === 0 ? (
              <div className="text-center py-12 border border-zinc-250 rounded-2xl bg-white shadow-sm">
                <MessageSquare className="w-8 h-8 text-zinc-300 mx-auto mb-3" />
                <p className="text-sm text-zinc-550 font-medium">Nenhum tópico encontrado nesta categoria.</p>
              </div>
            ) : (
              filteredTopics.map((topic) => {
                const isExpanded = expandedTopicId === topic.id;

                return (
                  <div 
                    key={topic.id}
                    className={`bg-white border rounded-2xl p-6 space-y-4 relative overflow-hidden transition-all duration-300 shadow-sm ${
                      isExpanded ? 'border-brand-blue-sky/40 shadow-md' : 'border-zinc-200/80 hover:border-zinc-300'
                    }`}
                  >
                    <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-zinc-200" />
                    
                    {/* Linha de Cabeçalho do Tópico */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-xs font-mono text-zinc-650 uppercase font-semibold">
                          {topic.category}
                        </span>
                        <span className="text-xs font-mono text-zinc-500">
                          Postado por: <span className="text-zinc-800 font-bold">{topic.authorName}</span>
                        </span>
                        
                        {/* Autor Badge */}
                        {topic.authorRole === 'admin' && (
                          <span className="px-1.5 py-0.2 rounded bg-brand-blue-sky/10 border border-brand-blue-sky/30 text-[9px] font-mono text-brand-blue-sky font-bold uppercase">ADMIN</span>
                        )}
                        {topic.authorRole === 'premium' && (
                          <span className="px-1.5 py-0.2 rounded bg-brand-amber/10 border border-brand-amber/30 text-[9px] font-mono text-brand-amber font-bold uppercase">PREMIUM</span>
                        )}
                      </div>

                      <span className="text-xs font-mono text-zinc-450 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {topic.createdAt}
                      </span>
                    </div>

                    {/* Título & Mensagem */}
                    <div className="space-y-2">
                      <h3 
                        onClick={() => setExpandedTopicId(isExpanded ? null : topic.id)}
                        className="text-base sm:text-lg font-bold text-zinc-900 tracking-tight hover:text-brand-blue-sky transition-colors cursor-pointer"
                      >
                        {topic.title}
                      </h3>
                      <p className="text-sm text-zinc-700 leading-relaxed font-sans">
                        {topic.content}
                      </p>
                    </div>

                    {/* Barra Inferior com Contagem de Respostas e Botão Expandir */}
                    <div className="flex justify-between items-center pt-3 border-t border-zinc-150 text-xs font-mono font-semibold">
                      <span className="text-zinc-500 flex items-center gap-1.5">
                        <MessageCircle className="w-4 h-4 text-brand-blue-sky" />
                        <span className="text-zinc-900 font-bold">{topic.repliesCount}</span> respostas da comunidade
                      </span>

                      <button
                        onClick={() => setExpandedTopicId(isExpanded ? null : topic.id)}
                        className="text-brand-blue-sky hover:underline cursor-pointer flex items-center gap-1 font-bold"
                      >
                        {isExpanded ? 'Ocultar Respostas ▲' : 'Visualizar Discussão ▼'}
                      </button>
                    </div>

                    {/* AREA EXPANDIDA: RESPOSTAS E NOVO FORMULÁRIO DE RESPOSTA */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-zinc-150 space-y-4 animate-scale-up">
                        
                        {/* Lista de Respostas */}
                        <div className="space-y-3 pl-4 border-l border-zinc-200">
                          {(!topic.replies || topic.replies.length === 0) ? (
                            <p className="text-xs font-mono text-zinc-400 italic">Ainda não há respostas para esta discussão. Seja o primeiro a responder!</p>
                          ) : (
                            topic.replies.map((reply) => (
                              <div key={reply.id} className="bg-zinc-50 border border-zinc-200 p-4 rounded-xl space-y-2 relative shadow-2xs">
                                <div className="flex items-center justify-between gap-2 text-xs font-mono">
                                  <div className="flex items-center gap-1.5">
                                    <div className="w-5 h-5 bg-zinc-200 border border-zinc-300 rounded-full flex items-center justify-center text-[9px] text-zinc-550">
                                      👤
                                    </div>
                                    <span className="text-zinc-800 font-bold">{reply.authorName}</span>
                                    {reply.authorRole === 'admin' && (
                                      <span className="px-1 py-0.1 rounded bg-brand-blue-sky/10 border border-brand-blue-sky/30 text-[8px] font-mono text-brand-blue-sky font-bold">ADMIN</span>
                                    )}
                                    {reply.authorRole === 'premium' && (
                                      <span className="px-1 py-0.1 rounded bg-brand-amber/10 border border-brand-amber/30 text-[8px] font-mono text-brand-amber font-bold">PREMIUM</span>
                                    )}
                                  </div>
                                  <span className="text-zinc-450 font-medium">{reply.createdAt}</span>
                                </div>
                                <p className="text-sm text-zinc-700 leading-relaxed font-sans pl-6">
                                  {reply.content}
                                </p>
                              </div>
                            ))
                          )}
                        </div>

                        {/* Formulário de Resposta */}
                        <form onSubmit={(e) => handleCreateReply(e, topic.id)} className="pl-4 space-y-3">
                          <div className="space-y-1.5">
                            <label className="text-xs font-mono text-zinc-500 font-bold uppercase block">Responder a discussão</label>
                            <div className="relative">
                              <input
                                type="text"
                                required
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder="Digite sua resposta técnica ou sugestão operacional..."
                                className="w-full bg-white border border-zinc-200 rounded-lg pl-3 pr-10 py-2.5 text-xs sm:text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-brand-blue-sky focus:ring-1 focus:ring-brand-blue-sky transition-all font-sans"
                              />
                              <button
                                type="submit"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-brand-blue-sky hover:text-brand-blue-sky/80 transition-colors cursor-pointer"
                              >
                                <Send className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </form>

                      </div>
                    )}

                  </div>
                );
              })
            )}
          </div>

        </section>

        {/* COLUNA DIREITA: INFORMAÇÕES DO GRUPO (4/12 colunas) */}
        <section className="md:col-span-4 space-y-6">
          
          {/* PAINEL: OPERADORES ATIVOS */}
          <div className="bg-white border border-zinc-200/80 p-6 rounded-2xl space-y-4 relative shadow-sm">
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-zinc-250" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-zinc-250" />

            <div className="space-y-1">
              <span className="text-xs font-mono text-zinc-450 block font-bold">TELEMETRIA SOCIAL</span>
              <h3 className="text-xs sm:text-sm font-bold text-zinc-900 uppercase tracking-wider">Operadores Conectados</h3>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-zinc-150 text-center font-mono">
              <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-200/80">
                <span className="text-lg font-bold text-brand-green">148</span>
                <p className="text-[9px] text-zinc-450 font-bold uppercase">Pilotos Ativos</p>
              </div>
              <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-200/80">
                <span className="text-lg font-bold text-brand-blue-sky">24h</span>
                <p className="text-[9px] text-zinc-450 font-bold uppercase">Suporte Campo</p>
              </div>
            </div>

            {/* Listinha de Dicas Rápidas */}
            <div className="space-y-3 pt-3 border-t border-zinc-150">
              <span className="text-xs font-mono text-brand-amber uppercase tracking-wider font-bold block">★ CÓDIGO OPERACIONAL</span>
              <div className="text-xs text-zinc-700 leading-relaxed space-y-2 font-mono font-medium">
                <p>● Altura mínima de voo: 3.5 metros sobre o topo.</p>
                <p>● Vento operacional ideal: Entre 2 e 8 km/h.</p>
                <p>● Evite caldas oleosas sob sol forte acima de 32°C.</p>
              </div>
            </div>
          </div>

          {/* PAINEL: REGULAÇÃO MAPA */}
          <div className="bg-white border border-zinc-200/80 p-6 rounded-2xl space-y-4 relative overflow-hidden group shadow-sm">
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-brand-amber" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-brand-amber" />

            <div className="space-y-2">
              <span className="px-2 py-0.5 rounded bg-amber-50 border border-brand-amber/30 text-[9px] font-mono text-brand-amber uppercase font-bold tracking-wider inline-block">
                Regulamentação MAPA
              </span>
              <h4 className="text-xs sm:text-sm font-bold text-zinc-900 tracking-tight">Portaria 298: Registro Operador Rural</h4>
              <p className="text-xs text-zinc-650 leading-relaxed font-sans">
                Todo aplicador de drone agrícola precisa cadastrar a atividade e emitir o certificado técnico de piloto aeroagrícola para evitar multas regulatórias severas.
              </p>
            </div>

            <Link href="/cursos" className="w-full bg-zinc-900 hover:bg-brand-amber border border-zinc-800 text-white hover:text-zinc-950 font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer">
              Fazer Curso de Piloto Aplicador
              <Sparkles className="w-3.5 h-3.5 text-brand-amber" />
            </Link>
          </div>

        </section>

      </main>

      {/* ── FOOTER ── */}
      <footer className="mt-16 border-t border-zinc-200 bg-white py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center">
          <div className="flex items-center gap-3 justify-center">
            <ECRDronesLogo version={5} size={25} />
            <span className="text-xs font-mono text-zinc-450">ECR DRONES • COMUNIDADE DISCUSSBASE</span>
          </div>
          <p className="text-xs font-mono text-zinc-500">
            Aplicações dinâmicas simuladas com local storage.
          </p>
        </div>
      </footer>

    </div>
  );
}
