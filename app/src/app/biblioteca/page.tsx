"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ECRDronesLogo from '@/components/ECRDronesLogo';
import { getUserSession, setUserSession, UserSession } from '@/lib/mockAuth';
import { 
  ArrowLeft, Download, FileText, Lock, Sparkles, CheckCircle2, 
  X, ShieldAlert, Award, Compass, FileSpreadsheet, ShieldCheck,
  ChevronRight, MessageSquare
} from 'lucide-react';

interface Material {
  id: string;
  title: string;
  type: 'pdf' | 'xlsx';
  size: string;
  downloads: number;
  isPremium: boolean;
  desc: string;
}

export default function BibliotecaPage() {
  const router = useRouter();
  const [session, setSession] = useState<UserSession | null>(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedMaterialTitle, setSelectedMaterialTitle] = useState('');
  const [successUpgrade, setSuccessUpgrade] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadedIds, setDownloadedIds] = useState<string[]>([]);

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

  // Lista de materiais do MVP
  const MATERIALS: Material[] = [
    {
      id: 'm-1',
      title: 'Cartilha Regulatória de Drones MAPA (Portaria 298)',
      type: 'pdf',
      size: '2.4 MB',
      downloads: 489,
      isPremium: false,
      desc: 'Regulamento oficial completo do MAPA que dispõe sobre as regras operacionais para aplicação aérea de agrotóxicos com drones em solo nacional.',
    },
    {
      id: 'm-2',
      title: 'Manual de Pilotagem Básica de Multirotores ECR',
      type: 'pdf',
      size: '3.8 MB',
      downloads: 612,
      isPremium: false,
      desc: 'Nosso manual prático com comandos de voo em campo, procedimentos pré e pós-voo, checklists de segurança e manutenção básica preventiva das hélices.',
    },
    {
      id: 'm-3',
      title: 'Planilha de Cálculo de Calibração de Vazão de Caldas',
      type: 'xlsx',
      size: '1.5 MB',
      downloads: 382,
      isPremium: true,
      desc: 'Planilha inteligente automatizada em Excel. Insira a largura da faixa, velocidade de voo e taxa desejada (L/ha) para obter a calibração exata de RPM dos atomizadores.',
    },
    {
      id: 'm-4',
      title: 'Tabela Técnica de Bicos Centrífugos e Gotas (XAG & DJI)',
      type: 'pdf',
      size: '2.1 MB',
      downloads: 245,
      isPremium: true,
      desc: 'Tabela comparativa cruzando tamanho de gotas em micras, rotação centrífuga dos atomizadores e deposição de calda ideal por bico para evitar derivas mecânicas.',
    },
    {
      id: 'm-5',
      title: 'Planilha de Viabilidade Comercial e ROI do Drone Agrícola',
      type: 'xlsx',
      size: '1.8 MB',
      downloads: 512,
      isPremium: true,
      desc: 'Ferramenta definitiva para calcular custos operacionais (baterias, combustível, equipe), faturamento bruto por hectare cobrado e tempo médio de retorno do investimento no drone.',
    }
  ];

  const handleDownload = (material: Material) => {
    if (material.isPremium && session.role === 'free') {
      setSelectedMaterialTitle(material.title);
      setShowCheckoutModal(true);
      return;
    }

    // Inicia simulação de download
    setDownloadingId(material.id);
    setDownloadProgress(0);

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setDownloadingId(null);
            setDownloadedIds((prevList) => [...prevList, material.id]);
          }, 800);
          return 100;
        }
        return prev + 25; // Incremente de 25% por pulso
      });
    }, 150);
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
    }, 2000);
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
      <main className="relative z-10 flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* CABEÇALHO DA PÁGINA */}
        <div className="space-y-2">
          <span className="text-xs font-mono text-brand-green tracking-widest uppercase flex items-center gap-1.5 font-bold">
            <Compass className="w-3.5 h-3.5 text-brand-green animate-spin-slow" />
            BIBLIOTECA TÉCNICA E PLANILHAS HOMOLOGADAS ECR
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 font-heading">
            Central de <span className="text-brand-green">Downloads</span>
          </h1>
          <p className="text-sm text-zinc-650 max-w-2xl leading-relaxed font-sans">
            Faça download dos manuais regulatórios oficiais e planilhas técnicas de calibração desenvolvidas pelos instrutores da ECR Drones para acelerar seus trabalhos em campo. Toda a simulação roda em tempo real no navegador.
          </p>
        </div>

        {/* GRADE DE DOCUMENTOS */}
        <div className="grid gap-6">
          {MATERIALS.map((material) => {
            const isLocked = material.isPremium && session.role === 'free';
            const isDownloading = downloadingId === material.id;
            const isDownloaded = downloadedIds.includes(material.id);

            return (
              <div 
                key={material.id}
                className="bg-white border border-zinc-200/80 p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden group hover:border-brand-green/30 hover:shadow-md transition-all duration-300 shadow-sm"
              >
                <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-zinc-200" />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-zinc-200" />

                <div className="flex items-start gap-4 flex-1">
                  {/* Ícone por Tipo */}
                  <div className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-xl bg-zinc-100 border border-zinc-200 ${
                    material.type === 'xlsx' ? 'text-brand-green' : 'text-brand-amber'
                  }`}>
                    {material.type === 'xlsx' ? <FileSpreadsheet className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm sm:text-base font-bold text-zinc-900 tracking-tight leading-tight">
                        {material.title}
                      </h3>

                      {/* Badges */}
                      {isLocked ? (
                        <span className="px-2 py-0.5 rounded bg-amber-50 border border-brand-amber/30 text-[9px] font-mono text-brand-amber uppercase tracking-wider flex items-center gap-1 font-bold">
                          <Lock className="w-2.5 h-2.5" /> EXCLUSIVO PREMIUM
                        </span>
                      ) : (
                        <span className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider font-bold ${
                          material.isPremium 
                            ? 'bg-emerald-50 border border-brand-green/20 text-brand-green' 
                            : 'bg-zinc-100 border border-zinc-200 text-zinc-500'
                        }`}>
                          {material.isPremium ? 'PREMIUM' : 'GRATUITO'}
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-zinc-650 leading-relaxed font-sans">
                      {material.desc}
                    </p>

                    <div className="flex gap-4 text-xs font-mono text-zinc-450 font-medium">
                      <span>TAMANHO: <span className="text-zinc-800 font-bold">{material.size}</span></span>
                      <span>FORMATO: <span className="text-zinc-800 font-bold uppercase">{material.type}</span></span>
                      <span>DOWNLOADS: <span className="text-zinc-500 font-bold">{material.downloads + (isDownloaded ? 1 : 0)}</span></span>
                    </div>
                  </div>
                </div>

                {/* CONTROLE DE DOWNLOADS SIMULADO */}
                <div className="flex-shrink-0 w-full sm:w-auto">
                  {isLocked ? (
                    <button
                      onClick={() => handleDownload(material)}
                      className="w-full bg-brand-amber hover:bg-brand-amber/90 text-brand-black font-extrabold text-xs px-5 py-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      Desbloquear Arquivo
                    </button>
                  ) : isDownloading ? (
                    <div className="w-full sm:w-[160px] bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl space-y-1.5 shadow-2xs">
                      <div className="flex justify-between text-[9px] font-mono text-brand-green font-bold">
                        <span>BAIXANDO...</span>
                        <span>{downloadProgress}%</span>
                      </div>
                      <div className="h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-brand-green rounded-full transition-all duration-150"
                          style={{ width: `${downloadProgress}%` }}
                        />
                      </div>
                    </div>
                  ) : isDownloaded ? (
                    <div className="w-full sm:w-[160px] bg-emerald-50 border border-brand-green/30 p-2.5 rounded-xl text-center text-brand-green font-mono text-xs flex items-center justify-center gap-1.5 animate-scale-up font-bold">
                      <ShieldCheck className="w-4 h-4 text-brand-green" />
                      DOWNLOAD OK!
                    </div>
                  ) : (
                    <button
                      onClick={() => handleDownload(material)}
                      className="w-full bg-zinc-900 hover:bg-brand-green border border-zinc-800 text-white font-extrabold text-xs px-5 py-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5 text-brand-green group-hover:text-white transition-colors" />
                      Baixar Material
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </main>

      {/* ── MODAL DE CHECKOUT SIMULADO (UPGRADE DE CONTA) ── */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          
          <div className="relative bg-white border border-zinc-200 shadow-xl max-w-lg w-full p-8 rounded-2xl space-y-6 text-zinc-950">
            
            {/* Cantoneiras HUD do Modal */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-brand-amber" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-brand-amber" />

            {/* BOTÃO FECHAR */}
            <button
              onClick={() => !successUpgrade && setShowCheckoutModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-zinc-150 hover:bg-zinc-200 border border-zinc-200 text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
              disabled={successUpgrade}
            >
              <X className="w-4 h-4" />
            </button>

            {successUpgrade ? (
              <div className="text-center py-8 space-y-4 animate-scale-up">
                <div className="w-16 h-16 bg-emerald-50 border border-brand-green/30 text-brand-green rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 font-heading">Upgrade Concluído!</h3>
                <p className="text-xs text-zinc-550 font-mono">
                  Sessão atualizada para <span className="text-brand-green font-bold">PREMIUM ELITE</span> com sucesso.
                </p>
                <p className="text-[10px] text-zinc-400 tracking-widest font-mono uppercase animate-pulse">LIBERANDO ARQUIVO DE ELITE...</p>
              </div>
            ) : (
              <>
                {/* CABEÇALHO DO MODAL */}
                <div className="space-y-2 text-center">
                  <div className="w-12 h-12 bg-amber-50 border border-brand-amber/20 text-brand-amber rounded-xl flex items-center justify-center mx-auto">
                    <Lock className="w-6 h-6 animate-bounce" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 tracking-tight font-heading">Desbloquear Download de Elite</h3>
                  <p className="text-xs sm:text-sm text-zinc-650 leading-relaxed">
                    O material <span className="text-brand-amber font-semibold">"{selectedMaterialTitle}"</span> é exclusivo de operadores Premium da ECR Drones.
                  </p>
                </div>

                {/* VANTAGENS DO PREMIUM */}
                <div className="space-y-3 bg-zinc-50 border border-zinc-200 p-4 rounded-xl">
                  <span className="text-[10px] font-mono text-brand-amber tracking-widest uppercase font-bold block mb-1">MATERIAIS OPERACIONAIS PREMIUM:</span>
                  <ul className="space-y-2 text-xs text-zinc-650 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="text-brand-green text-sm flex-shrink-0">✔</span>
                      Planilha automática Excel de Calibração de bicos e RPM.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-green text-sm flex-shrink-0">✔</span>
                      Planilha comercial Excel para simular faturamento e ROI em solo.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-green text-sm flex-shrink-0">✔</span>
                      Tabelas comparativas de micras, gotas e controle de deriva.
                    </li>
                  </ul>
                </div>

                {/* DETALHE DE PREÇO */}
                <div className="flex items-baseline justify-between border-t border-zinc-200 pt-4">
                  <div>
                    <span className="text-[10px] font-mono text-zinc-400 uppercase block">VALOR INVESTIMENTO</span>
                    <span className="text-xl font-bold text-zinc-900">R$ 1.497,00</span>
                    <span className="text-[10px] text-zinc-550"> pagamento único</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-mono text-brand-green block">PREÇO DO MVP DE SIMULAÇÃO</span>
                    <span className="text-[9px] bg-brand-green/10 text-brand-green px-2 py-0.5 rounded font-mono uppercase tracking-wider font-bold">100% GRÁTIS HOJE</span>
                  </div>
                </div>

                {/* BOTÃO DE UPGRADE SIMULADO */}
                <div className="space-y-2">
                  <button
                    onClick={handleSimulatedUpgrade}
                    className="w-full bg-brand-amber hover:bg-brand-amber/90 text-brand-black font-extrabold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm text-sm"
                  >
                    <Sparkles className="w-4 h-4 text-brand-black animate-pulse" />
                    Ativar Conta Premium de Elite (Simular)
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <p className="text-[9px] font-mono text-zinc-400 text-center uppercase tracking-wide">
                    DICA DE VENDA: Faça o upgrade na hora para liberar os arquivos na frente do cliente!
                  </p>
                </div>
              </>
            )}

          </div>

        </div>
      )}

      {/* ── FOOTER ── */}
      <footer className="mt-16 border-t border-zinc-200 bg-white py-8 relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center">
          <div className="flex items-center gap-3 justify-center">
            <ECRDronesLogo version={5} size={25} />
            <span className="text-xs font-mono text-zinc-450">ECR DRONES • CENTRAL DE DOWNLOADS MVP</span>
          </div>
          <p className="text-xs font-mono text-zinc-500">
            Aplicações aeronáuticas agrícolas de alta precisão.
          </p>
        </div>
      </footer>

    </div>
  );
}
