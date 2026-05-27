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
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 grid md:grid-cols-12 gap-8 items-start">
        
        {/* COLUNA ESQUERDA: LISTAGEM DE TÓPICOS E CRIAÇÃO (8/12 colunas) */}
        <section className="md:col-span-8 space-y-6">
          
          {/* APRESENTAÇÃO DO FÓRUM */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono text-brand-green tracking-widest uppercase flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-brand-green animate-spin-slow" />
              CENTRAL DE DISCUSSÃO OPERACIONAL DA LAVOURA
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-white font-heading">
              Fórum de <span className="text-brand-blue-sky">Operadores de Elite</span>
            </h1>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Tire dúvidas técnicas de bicos, controle de deriva, receitas de caldas complexas e compartilhe problemas no solo com pilotos reais em campo. Toda a persistência é simulada localmente.
            </p>
          </div>

          {/* FILTRO DE CATEGORIAS E BOTÃO DE NOVO TÓPICO */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-zinc-950 border border-zinc-900 p-4 rounded-xl relative">
            <div className="flex flex-wrap gap-2 items-center">
              <Filter className="w-3.5 h-3.5 text-zinc-500 mr-1" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedFilter === cat 
                      ? 'bg-brand-blue-sky border border-brand-blue-sky/30 text-white shadow-[0_0_15px_rgba(21,101,192,0.15)]' 
                      : 'bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-white border border-zinc-900 hover:border-zinc-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowNewTopicForm(!showNewTopicForm)}
              className="w-full sm:w-auto bg-brand-green hover:bg-brand-green-dark border border-brand-green/30 hover:border-brand-green/70 text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Criar Tópico
            </button>
          </div>

          {/* FORMULÁRIO DE NOVO TÓPICO (CONDICIONAL) */}
          {showNewTopicForm && (
            <form onSubmit={handleCreateTopic} className="bg-zinc-950 border border-brand-green/30 p-6 rounded-2xl space-y-4 relative animate-scale-up">
              <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-brand-green" />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-brand-green" />

              <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
                <span className="text-[10px] font-mono text-brand-green uppercase tracking-wider font-bold">ABRIR NOVA DISCUSSÃO</span>
                <button 
                  type="button" 
                  onClick={() => setShowNewTopicForm(false)}
                  className="text-zinc-550 hover:text-white text-xs font-mono"
                >
                  CANCELAR
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-zinc-400 uppercase">Título do Tópico</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Ex: Como calibrar bico XAG para deriva mínima"
                    className="w-full bg-zinc-900 border border-zinc-850 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-brand-blue-sky/80 transition-all font-sans"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-zinc-400 uppercase">Categoria</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-850 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-blue-sky/80 transition-all font-mono"
                  >
                    <option value="Calibração & Bicos">Calibração & Bicos</option>
                    <option value="Dúvidas Técnicas">Dúvidas Técnicas</option>
                    <option value="Negócios & Campo">Negócios & Campo</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-zinc-400 uppercase">Mensagem Descritiva</label>
                <textarea
                  required
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Descreva detalhadamente o problema ou a dica que deseja compartilhar com a comunidade rural..."
                  className="w-full bg-zinc-900 border border-zinc-850 rounded-lg p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-brand-blue-sky/80 transition-all font-sans"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-brand-green hover:bg-brand-green-dark border border-brand-green/30 text-white font-bold text-xs py-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(46,125,50,0.1)]"
              >
                <Send className="w-3.5 h-3.5" />
                Publicar no Fórum
              </button>
            </form>
          )}

          {/* LISTAGEM DE DISCUSSÕES */}
          <div className="space-y-4">
            {filteredTopics.length === 0 ? (
              <div className="text-center py-12 border border-zinc-900 rounded-2xl bg-zinc-950/45">
                <MessageSquare className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
                <p className="text-xs text-zinc-550">Nenhum tópico encontrado nesta categoria.</p>
              </div>
            ) : (
              filteredTopics.map((topic) => {
                const isExpanded = expandedTopicId === topic.id;

                return (
                  <div 
                    key={topic.id}
                    className={`bg-zinc-950 border rounded-2xl p-6 space-y-4 relative overflow-hidden transition-all duration-300 ${
                      isExpanded ? 'border-brand-blue-sky/40 shadow-[0_0_20px_rgba(21,101,192,0.02)]' : 'border-zinc-900 hover:border-zinc-850'
                    }`}
                  >
                    <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-zinc-900" />
                    
                    {/* Linha de Cabeçalho do Tópico */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-850 text-[8px] font-mono text-zinc-400 uppercase font-semibold">
                          {topic.category}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-500">
                          Postado por: <span className="text-white font-bold">{topic.authorName}</span>
                        </span>
                        
                        {/* Autor Badge */}
                        {topic.authorRole === 'admin' && (
                          <span className="px-1.5 py-0.2 rounded bg-brand-blue-sky/10 border border-brand-blue-sky/30 text-[7px] font-mono text-brand-blue-sky font-semibold uppercase">ADMIN</span>
                        )}
                        {topic.authorRole === 'premium' && (
                          <span className="px-1.5 py-0.2 rounded bg-brand-amber/10 border border-brand-amber/30 text-[7px] font-mono text-brand-amber font-semibold uppercase">PREMIUM</span>
                        )}
                      </div>

                      <span className="text-[9px] font-mono text-zinc-550 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {topic.createdAt}
                      </span>
                    </div>

                    {/* Título & Mensagem */}
                    <div className="space-y-2">
                      <h3 
                        onClick={() => setExpandedTopicId(isExpanded ? null : topic.id)}
                        className="text-base font-bold text-white tracking-tight hover:text-brand-blue-sky transition-colors cursor-pointer"
                      >
                        {topic.title}
                      </h3>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        {topic.content}
                      </p>
                    </div>

                    {/* Barra Inferior com Contagem de Respostas e Botão Expandir */}
                    <div className="flex justify-between items-center pt-3 border-t border-zinc-900/60 text-[11px] font-mono">
                      <span className="text-zinc-500 flex items-center gap-1.5">
                        <MessageCircle className="w-4 h-4 text-brand-blue-sky" />
                        <span className="text-white font-bold">{topic.repliesCount}</span> respostas da comunidade
                      </span>

                      <button
                        onClick={() => setExpandedTopicId(isExpanded ? null : topic.id)}
                        className="text-brand-blue-sky hover:underline cursor-pointer flex items-center gap-1"
                      >
                        {isExpanded ? 'Ocultar Respostas ▲' : 'Visualizar Discussão ▼'}
                      </button>
                    </div>

                    {/* AREA EXPANDIDA: RESPOSTAS E NOVO FORMULÁRIO DE RESPOSTA */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-zinc-900 space-y-4 animate-scale-up">
                        
                        {/* Lista de Respostas */}
                        <div className="space-y-3 pl-4 border-l border-zinc-900">
                          {(!topic.replies || topic.replies.length === 0) ? (
                            <p className="text-[10px] font-mono text-zinc-650 italic">Ainda não há respostas para esta discussão. Seja o primeiro a responder!</p>
                          ) : (
                            topic.replies.map((reply) => (
                              <div key={reply.id} className="bg-zinc-900/30 border border-zinc-850 p-4 rounded-xl space-y-2 relative">
                                <div className="flex items-center justify-between gap-2 text-[9px] font-mono">
                                  <div className="flex items-center gap-1.5">
                                    <div className="w-5 h-5 bg-zinc-950 border border-zinc-800 rounded-full flex items-center justify-center text-[9px] text-zinc-400">
                                      👤
                                    </div>
                                    <span className="text-white font-bold">{reply.authorName}</span>
                                    {reply.authorRole === 'admin' && (
                                      <span className="px-1 py-0.1 rounded bg-brand-blue-sky/10 border border-brand-blue-sky/30 text-[6px] font-mono text-brand-blue-sky font-bold">ADMIN</span>
                                    )}
                                    {reply.authorRole === 'premium' && (
                                      <span className="px-1 py-0.1 rounded bg-brand-amber/10 border border-brand-amber/30 text-[6px] font-mono text-brand-amber font-bold">PREMIUM</span>
                                    )}
                                  </div>
                                  <span className="text-zinc-550">{reply.createdAt}</span>
                                </div>
                                <p className="text-xs text-zinc-300 leading-relaxed font-sans pl-6">
                                  {reply.content}
                                </p>
                              </div>
                            ))
                          )}
                        </div>

                        {/* Formulário de Resposta */}
                        <form onSubmit={(e) => handleCreateReply(e, topic.id)} className="pl-4 space-y-3">
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-mono text-zinc-500 uppercase block">Responder a discussão</label>
                            <div className="relative">
                              <input
                                type="text"
                                required
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder="Digite sua resposta técnica ou sugestão operacional..."
                                className="w-full bg-zinc-900 border border-zinc-850 rounded-lg pl-3 pr-10 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-brand-blue-sky/80 transition-all font-sans"
                              />
                              <button
                                type="submit"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-brand-blue-sky hover:text-white transition-colors cursor-pointer"
                              >
                                <Send className="w-3.5 h-3.5" />
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
          <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl space-y-4 relative">
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-zinc-850" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-zinc-850" />

            <div className="space-y-1">
              <span className="text-[9px] font-mono text-zinc-550 block">TELEMETRIA SOCIAL</span>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Operadores Conectados</h3>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-zinc-900/60 text-center font-mono">
              <div className="bg-zinc-900/20 p-3 rounded-lg border border-zinc-900">
                <span className="text-base font-bold text-brand-green">148</span>
                <p className="text-[8px] text-zinc-550 uppercase">Pilotos Ativos</p>
              </div>
              <div className="bg-zinc-900/20 p-3 rounded-lg border border-zinc-900">
                <span className="text-base font-bold text-brand-blue-sky">24h</span>
                <p className="text-[8px] text-zinc-550 uppercase">Suporte Campo</p>
              </div>
            </div>

            {/* Listinha de Dicas Rápidas */}
            <div className="space-y-3 pt-3 border-t border-zinc-900/60">
              <span className="text-[9px] font-mono text-brand-amber uppercase tracking-wider font-bold block">★ CÓDIGO OPERACIONAL</span>
              <div className="text-[10px] text-zinc-400 leading-relaxed space-y-2 font-mono">
                <p>● Altura mínima de voo: 3.5 metros sobre o topo.</p>
                <p>● Vento operacional ideal: Entre 2 e 8 km/h.</p>
                <p>● Evite caldas oleosas sob sol forte acima de 32°C.</p>
              </div>
            </div>
          </div>

          {/* PAINEL: MOCK ADVERTISMENT OU REGULAÇÃO MAPA */}
          <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl space-y-4 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-brand-amber" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-brand-amber" />

            <div className="space-y-2">
              <span className="px-2 py-0.5 rounded bg-brand-amber/10 border border-brand-amber/30 text-[7px] font-mono text-brand-amber uppercase font-bold tracking-wider inline-block">
                Regulamentação MAPA
              </span>
              <h4 className="text-xs font-bold text-white tracking-tight">Portaria 298: Registro Operador Rural</h4>
              <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                Todo aplicador de drone agrícola precisa cadastrar a atividade e emitir o certificado técnico de piloto aeroagrícola para evitar multas.
              </p>
            </div>

            <Link href="/cursos" className="w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-850 hover:border-brand-amber/30 text-white font-bold text-[10px] py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer">
              Fazer Curso de Piloto Aplicador
              <Sparkles className="w-3.5 h-3.5 text-brand-amber" />
            </Link>
          </div>

        </section>

      </main>

      {/* ── FOOTER ── */}
      <footer className="mt-16 border-t border-zinc-900 bg-zinc-950/45 py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center">
          <div className="flex items-center gap-3 justify-center">
            <ECRDronesLogo version={5} size={25} />
            <span className="text-[10px] font-mono text-zinc-500">ECR DRONES • COMUNIDADE DISCUSSBASE</span>
          </div>
          <p className="text-[10px] font-mono text-zinc-650">
            Aplicações dinâmicas simuladas com local storage.
          </p>
        </div>
      </footer>

    </div>
  );
}
