"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ECRDronesLogo from '@/components/ECRDronesLogo';
import { getUserSession, UserSession } from '@/lib/mockAuth';
import {
  ArrowLeft, Briefcase, Plus, Users, FileText, ClipboardList,
  Printer, Trash2, Edit2, Check, X, ChevronDown, Lock, Phone,
  Mail, MapPin, Wheat, Search, Download, Star
} from 'lucide-react';

// ─── TIPOS ────────────────────────────────────────────────────────────────────

type ClientStatus = 'Novo Lead' | 'Proposta Enviada' | 'Fechado' | 'Perdido';

interface Client {
  id: string;
  name: string;
  farm: string;
  culture: string;
  ha: number;
  phone: string;
  city: string;
  email: string;
  status: ClientStatus;
  createdAt: string;
  pricePerHa: number;
  notes: string;
}

// ─── STORAGE ──────────────────────────────────────────────────────────────────

const CRM_KEY = 'ecr_crm_clients';

function getClients(): Client[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(CRM_KEY) || '[]'); } catch { return []; }
}

function saveClients(clients: Client[]) {
  if (typeof window !== 'undefined') localStorage.setItem(CRM_KEY, JSON.stringify(clients));
}

const STATUS_COLORS: Record<ClientStatus, string> = {
  'Novo Lead': 'bg-blue-50 border-blue-200 text-blue-700',
  'Proposta Enviada': 'bg-amber-50 border-brand-amber/30 text-brand-amber',
  'Fechado': 'bg-emerald-50 border-brand-green/30 text-brand-green',
  'Perdido': 'bg-red-50 border-red-200 text-red-600',
};

// ─── CONTRATOS MOCK ───────────────────────────────────────────────────────────

const CONTRACTS = [
  {
    id: 'c1',
    title: 'Contrato de Prestação de Serviço de Pulverização Agrícola',
    description: 'Contrato padrão para serviços de pulverização com drone em área de terceiros. Inclui cláusulas de responsabilidade operacional, pagamento e garantia de resultado.',
    pages: 3,
    icon: '🌱',
    content: `CONTRATO DE PRESTAÇÃO DE SERVIÇO DE PULVERIZAÇÃO AGRÍCOLA COM DRONE

CONTRATANTE: [NOME DO PRODUTOR RURAL]
CPF/CNPJ: [CPF ou CNPJ]
Endereço: [ENDEREÇO DA PROPRIEDADE]
Cidade/UF: [CIDADE - UF]

CONTRATADA: [NOME DO PILOTO / EMPRESA]
CPF/CNPJ: [CPF ou CNPJ]
Registro ANAC: [NÚMERO DO REGISTRO]
Telefone: [TELEFONE]

CLÁUSULA 1 — OBJETO DO CONTRATO
A CONTRATADA se compromete a realizar aplicação aérea de defensivos agrícolas via VANT (Veículo Aéreo Não Tripulado) na propriedade rural do CONTRATANTE, denominada [NOME DA FAZENDA], no município de [MUNICÍPIO-UF], conforme especificações técnicas acordadas.

CLÁUSULA 2 — ÁREA E PRODUTO
Área total: [NÚMERO] hectares de [CULTURA AGRÍCOLA]
Produto a aplicar: [NOME DO DEFENSIVO / CDA]
Volume de calda: [LITROS] L/ha
Número de aplicações: [NÚMERO]

CLÁUSULA 3 — PREÇO E PAGAMENTO
Valor unitário por hectare: R$ [VALOR]/ha
Valor total estimado: R$ [TOTAL]
Forma de pagamento: [PIX / BOLETO / DINHEIRO]
Vencimento: [DATA]

CLÁUSULA 4 — RESPONSABILIDADES
A CONTRATADA é responsável pela calibração dos equipamentos, segurança do voo e cumprimento das normas da ANAC/MAPA. O CONTRATANTE é responsável por fornecer local seguro para operação, produto a aplicar e acesso à propriedade.

CLÁUSULA 5 — FORO
Fica eleito o foro da comarca de [CIDADE-UF] para dirimir eventuais litígios.

[CIDADE], [DATA]

_________________________           _________________________
CONTRATANTE                          CONTRATADA
[NOME DO PRODUTOR]                   [NOME DO PILOTO]`
  },
  {
    id: 'c2',
    title: 'Termo de Responsabilidade Operacional (ANAC/MAPA)',
    description: 'Documento obrigatório que declara conformidade com as normas aeronáuticas e de aplicação de defensivos agrícolas. Indispensável para voos em áreas fiscalizadas.',
    pages: 2,
    icon: '📋',
    content: `TERMO DE RESPONSABILIDADE E CONFORMIDADE OPERACIONAL
Aplicação Aérea com VANT — Portaria MAPA 298/2019 e RBAC-E nº 94 ANAC

Eu, [NOME DO PILOTO RESPONSÁVEL], portador do CPF nº [CPF], detentor do Certificado de Piloto Remotamente Pilotado de Aeronave (CPPR) nº [NÚMERO], declaro para os devidos fins de direito que:

1. DECLARAÇÃO DE CONFORMIDADE ANAC
O VANT utilizado nesta operação, modelo [MODELO DO DRONE], nº de série [NÚMERO DE SÉRIE], encontra-se devidamente homologado junto à ANAC sob o código [CÓDIGO DE HOMOLOGAÇÃO], com seguro RETA vigente (Apólice nº [NÚMERO DA APÓLICE]).

2. DECLARAÇÃO DE CONFORMIDADE MAPA
Esta operação de aplicação de defensivos agrícolas está sendo realizada em conformidade com a Portaria MAPA nº 298/2019, tendo o operador o registro ativo de Aplicador Aéreo Agrícola (AAA) sob o nº [NÚMERO DO REGISTRO MAPA].

3. PRODUTO APLICADO
Defensivo: [NOME DO PRODUTO]
Registro no MAPA: [NÚMERO DO REGISTRO]
Receituário Agronômico: [NÚMERO / RESPONSÁVEL TÉCNICO]
Dose aplicada: [DOSE] mL ou g/ha

4. CONDIÇÕES METEOROLÓGICAS NO MOMENTO DA APLICAÇÃO
Temperatura: [TEMPERATURA]°C   Umidade relativa: [UR]%
Velocidade do vento: [VELOCIDADE] km/h   Direção: [DIREÇÃO]

5. RESPONSABILIDADE CIVIL
O signatário assume integral responsabilidade pelos danos causados a terceiros, ao ambiente e às culturas vizinhas em decorrência de qualquer desvio de procedimento operacional.

[MUNICÍPIO], [DATA E HORA]

Assinatura do Piloto Responsável: _________________________
[NOME COMPLETO — CRM/CREA do RT se aplicável]`
  },
  {
    id: 'c3',
    title: 'Contrato de Parceria Comercial (Indicação de Área)',
    description: 'Contrato para parcerias com agrônomos, cooperativas ou corretores que indicam áreas de pulverização. Estipula comissão e responsabilidades de cada parte.',
    pages: 2,
    icon: '🤝',
    content: `CONTRATO DE PARCERIA COMERCIAL — INDICAÇÃO DE SERVIÇOS DE PULVERIZAÇÃO

PARTE 1 (OPERADOR/PILOTO): [NOME DO PILOTO]
CPF/CNPJ: [CPF ou CNPJ]   Tel: [TELEFONE]

PARTE 2 (PARCEIRO INDICADOR): [NOME DO PARCEIRO]
CPF/CNPJ: [CPF ou CNPJ]   Área de atuação: [REGIÃO/CIDADES]
Profissão/Cargo: [AGRÔNOMO / COOPERATIVA / CORRETOR RURAL]

OBJETO
A PARTE 2 se compromete a indicar clientes produtores rurais interessados nos serviços de aplicação aérea da PARTE 1, em troca de comissão sobre o faturamento bruto das operações fechadas.

COMISSIONAMENTO
Percentual de comissão: [X]% sobre o valor bruto da operação fechada.
Forma de pagamento: Transferência bancária em até [X] dias após o recebimento da PARTE 1.
Dados bancários PARTE 2: Banco [BANCO] • Ag [AGÊNCIA] • CC [CONTA] • PIX: [CHAVE PIX]

RESPONSABILIDADES
A PARTE 2 não é responsável pela execução do serviço, segurança operacional ou resultado agronômico. A PARTE 1 mantém integral autonomia técnica e operacional sobre as missões de voo.

VIGÊNCIA
Este contrato vigora por [PERÍODO], podendo ser renovado por mútuo acordo entre as partes.

RESCISÃO
Qualquer das partes pode rescindir o contrato com aviso prévio de [X] dias, sem penalidades, salvo comissões de operações já firmadas.

[CIDADE], [DATA]

_________________________       _________________________
PARTE 1 — PILOTO                 PARTE 2 — PARCEIRO
[NOME]                           [NOME]`
  }
];

// ─── COMPONENTE PRINCIPAL ────────────────────────────────────────────────────

export default function NegocioPage() {
  const router = useRouter();
  const [session, setSession] = useState<UserSession | null>(null);
  const [activeTab, setActiveTab] = useState<'crm' | 'orcamento' | 'contratos'>('crm');

  // CRM states
  const [clients, setClients] = useState<Client[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('Todos');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [selectedClientForQuote, setSelectedClientForQuote] = useState<Client | null>(null);

  // Form states
  const emptyForm = { name: '', farm: '', culture: '', ha: 0, phone: '', city: '', email: '', status: 'Novo Lead' as ClientStatus, pricePerHa: 27, notes: '' };
  const [form, setForm] = useState(emptyForm);

  // Orçamento states
  const [quoteData, setQuoteData] = useState({
    pilotName: '', pilotPhone: '', pilotCpf: '', pilotCity: '',
    clientName: '', farmName: '', culture: '', ha: 0, priceHa: 27, applications: 1,
    paymentMethod: 'PIX', date: new Date().toLocaleDateString('pt-BR'), notes: ''
  });

  // Contract state
  const [expandedContract, setExpandedContract] = useState<string | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const s = getUserSession();
    if (!s) { router.push('/auth'); return; }
    if (s.role === 'free') { setSession(s); return; }
    setSession(s);
    const stored = getClients();
    if (stored.length === 0) {
      // Seed com 3 clientes de demo
      const demo: Client[] = [
        { id: 'demo-1', name: 'José Augusto Ferreira', farm: 'Fazenda Santa Luzia', culture: 'Soja', ha: 320, phone: '(34) 99812-3456', city: 'Uberaba-MG', email: 'jose@fazenda.com', status: 'Fechado', createdAt: '15/05/2026', pricePerHa: 28, notes: 'Cliente fiel, paga em PIX no mesmo dia.' },
        { id: 'demo-2', name: 'Mariana Couto Rezende', farm: 'Sítio Boa Esperança', culture: 'Milho', ha: 85, phone: '(34) 98745-9012', city: 'Prata-MG', email: 'mariana@sitio.com', status: 'Proposta Enviada', createdAt: '20/05/2026', pricePerHa: 26, notes: 'Aguardando resposta do marido para fechar.' },
        { id: 'demo-3', name: 'Rodrigo Pinheiro Lima', farm: 'Fazenda Boa Vista', culture: 'Cana', ha: 540, phone: '(14) 97634-5678', city: 'Jaú-SP', email: 'rodrigo@bvista.agr', status: 'Novo Lead', createdAt: '25/05/2026', pricePerHa: 32, notes: 'Indicado por agrônomo parceiro. Grande potencial.' },
      ];
      saveClients(demo);
      setClients(demo);
    } else {
      setClients(stored);
    }
  }, [router]);

  if (!session) return null;

  // ── BLOQUEIO FREE ──────────────────────────────────────────────────────────
  if (session.role === 'free') {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center text-center p-8 font-sans">
        <div className="max-w-md space-y-6">
          <div className="w-20 h-20 bg-amber-50 border-2 border-brand-amber/30 rounded-full flex items-center justify-center mx-auto">
            <Lock className="w-10 h-10 text-brand-amber" />
          </div>
          <h1 className="text-2xl font-black text-zinc-900 font-heading">Acesso Exclusivo Premium</h1>
          <p className="text-sm text-zinc-500 leading-relaxed">
            O módulo <strong className="text-violet-600">Meu Negócio</strong> — CRM, Orçamentos em PDF e Modelos de Contrato — é exclusivo para alunos <strong className="text-brand-amber">Premium</strong>.
          </p>
          <Link href="/cursos" className="inline-flex items-center gap-2 bg-brand-amber hover:bg-brand-amber/90 text-brand-black font-bold px-6 py-3 rounded-xl transition-all">
            <Star className="w-4 h-4" /> Fazer Upgrade Premium
          </Link>
          <Link href="/dashboard" className="block text-xs text-zinc-400 hover:text-zinc-700 underline transition-colors">
            Voltar ao Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // ── HANDLERS CRM ───────────────────────────────────────────────────────────
  const handleSaveClient = () => {
    if (!form.name || !form.city) return;
    let updated: Client[];
    if (editingClient) {
      updated = clients.map(c => c.id === editingClient.id ? { ...c, ...form } : c);
    } else {
      const newClient: Client = {
        ...form,
        id: `c-${Date.now()}`,
        createdAt: new Date().toLocaleDateString('pt-BR'),
      };
      updated = [newClient, ...clients];
    }
    saveClients(updated);
    setClients(updated);
    setForm(emptyForm);
    setShowForm(false);
    setEditingClient(null);
  };

  const handleDelete = (id: string) => {
    const updated = clients.filter(c => c.id !== id);
    saveClients(updated);
    setClients(updated);
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setForm({ name: client.name, farm: client.farm, culture: client.culture, ha: client.ha, phone: client.phone, city: client.city, email: client.email, status: client.status, pricePerHa: client.pricePerHa, notes: client.notes });
    setShowForm(true);
  };

  const handleOpenQuote = (client: Client) => {
    setSelectedClientForQuote(client);
    setQuoteData(q => ({ ...q, clientName: client.name, farmName: client.farm, culture: client.culture, ha: client.ha, priceHa: client.pricePerHa }));
    setActiveTab('orcamento');
  };

  const filteredClients = clients
    .filter(c => filterStatus === 'Todos' || c.status === filterStatus)
    .filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.city.toLowerCase().includes(search.toLowerCase()));

  const handlePrintQuote = () => window.print();
  const handlePrintContract = (content: string) => {
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`<html><head><title>Contrato</title><style>body{font-family:Arial,sans-serif;font-size:13px;line-height:1.7;padding:40px;max-width:800px;margin:auto;color:#111;white-space:pre-wrap;}</style></head><body>${content.replace(/\n/g, '<br/>')}</body></html>`);
    win.document.close();
    win.print();
  };

  const qTotal = quoteData.ha * quoteData.priceHa * quoteData.applications;

  const tabs = [
    { id: 'crm', label: 'CRM de Clientes', icon: <Users className="w-4 h-4" />, count: clients.length },
    { id: 'orcamento', label: 'Gerar Orçamento', icon: <FileText className="w-4 h-4" /> },
    { id: 'contratos', label: 'Modelos de Contrato', icon: <ClipboardList className="w-4 h-4" />, count: 3 },
  ] as const;

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-zinc-950 flex flex-col font-sans overflow-x-hidden">

      {/* CSS de impressão */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          body { background: white !important; }
          .print-area { padding: 20px; font-family: Arial, sans-serif; }
        }
        .print-only { display: none; }
      `}</style>

      {/* HEADER */}
      <header className="no-print relative z-10 border-b border-zinc-200 bg-white/95 backdrop-blur-xl shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 rounded bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-500 hover:text-zinc-900 transition-all cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="h-6 w-px bg-zinc-200" />
            <ECRDronesLogo version={3} size={34} showTagline={false} />
            <div>
              <span className="text-[10px] font-mono text-zinc-400 block tracking-wider hidden sm:block">MEU NEGÓCIO</span>
              <span className="text-xs font-bold text-violet-600 hidden sm:block">Business Tools Premium</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-zinc-900">{session.name}</p>
              <p className="text-[10px] font-mono text-zinc-400 uppercase">{session.email}</p>
            </div>
            <span className="px-2 py-0.5 rounded bg-violet-50 border border-violet-200 text-[10px] font-mono text-violet-600 uppercase font-bold">✦ PREMIUM</span>
          </div>
        </div>
      </header>

      <main className="no-print flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* TÍTULO */}
        <div className="space-y-1">
          <span className="text-[10px] font-mono text-violet-600 tracking-widest uppercase flex items-center gap-1.5 font-bold">
            <Briefcase className="w-3.5 h-3.5" /> CENTRAL DE GESTÃO DO NEGÓCIO
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 font-heading">
            Meu <span className="text-violet-600">Negócio</span>
          </h1>
          <p className="text-xs text-zinc-500">Gerencie seus clientes, gere orçamentos profissionais em PDF e acesse modelos de contrato prontos para assinar.</p>
        </div>

        {/* ABAS */}
        <div className="flex gap-2 border-b border-zinc-200 pb-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-bold transition-all border-b-2 -mb-px cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-violet-600 text-violet-600'
                  : 'border-transparent text-zinc-500 hover:text-zinc-900'
              }`}
            >
              {tab.icon}
              {tab.label}
              {'count' in tab && <span className="bg-zinc-100 text-zinc-500 text-[9px] font-mono px-1.5 py-0.5 rounded-full">{tab.count}</span>}
            </button>
          ))}
        </div>

        {/* ── ABA: CRM ── */}
        {activeTab === 'crm' && (
          <div className="space-y-4">

            {/* Stats rápidas */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(['Novo Lead', 'Proposta Enviada', 'Fechado', 'Perdido'] as ClientStatus[]).map(s => (
                <div key={s} className="bg-white border border-zinc-200/80 p-3 rounded-xl text-center shadow-sm">
                  <span className="text-xl font-black text-zinc-900">{clients.filter(c => c.status === s).length}</span>
                  <p className="text-[9px] font-mono text-zinc-400 mt-0.5 uppercase">{s}</p>
                </div>
              ))}
            </div>

            {/* Barra de ações */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {['Todos', 'Novo Lead', 'Proposta Enviada', 'Fechado', 'Perdido'].map(s => (
                  <button key={s} onClick={() => setFilterStatus(s)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${filterStatus === s ? 'bg-violet-600 text-white' : 'bg-white border border-zinc-200 text-zinc-500 hover:text-zinc-900'}`}>
                    {s}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                  <input placeholder="Buscar cliente..." value={search} onChange={e => setSearch(e.target.value)}
                    className="pl-8 pr-3 py-2 text-xs border border-zinc-200 rounded-lg w-full sm:w-48 focus:outline-none focus:border-violet-400 transition-all bg-white" />
                </div>
                <button onClick={() => { setShowForm(true); setEditingClient(null); setForm(emptyForm); }}
                  className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs px-3 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap shadow-sm">
                  <Plus className="w-3.5 h-3.5" /> Novo Cliente
                </button>
              </div>
            </div>

            {/* FORMULÁRIO */}
            {showForm && (
              <div className="bg-white border border-violet-200 p-6 rounded-2xl shadow-sm space-y-4 relative">
                <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-violet-400" />
                <div className="flex justify-between items-center pb-2 border-b border-zinc-100">
                  <span className="text-xs font-mono text-violet-600 font-bold uppercase">
                    {editingClient ? 'Editar Cliente' : 'Cadastrar Novo Cliente'}
                  </span>
                  <button onClick={() => { setShowForm(false); setEditingClient(null); }} className="text-zinc-400 hover:text-zinc-700 cursor-pointer"><X className="w-4 h-4" /></button>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { label: 'Nome Completo *', key: 'name', placeholder: 'Nome do produtor' },
                    { label: 'Fazenda / Propriedade', key: 'farm', placeholder: 'Nome da fazenda' },
                    { label: 'Cultura Principal', key: 'culture', placeholder: 'Soja, milho, cana...' },
                    { label: 'Cidade - UF *', key: 'city', placeholder: 'Ex: Uberaba-MG' },
                    { label: 'Telefone / WhatsApp', key: 'phone', placeholder: '(00) 90000-0000' },
                    { label: 'E-mail', key: 'email', placeholder: 'email@fazenda.com' },
                  ].map(f => (
                    <div key={f.key} className="space-y-1">
                      <label className="text-[10px] font-mono text-zinc-500 font-bold uppercase">{f.label}</label>
                      <input type="text" placeholder={f.placeholder} value={(form as any)[f.key]}
                        onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                        className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 transition-all bg-white" />
                    </div>
                  ))}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-zinc-500 font-bold uppercase">Área Estimada (ha)</label>
                    <input type="number" min={0} value={form.ha} onChange={e => setForm(p => ({ ...p, ha: +e.target.value }))}
                      className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 transition-all bg-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-zinc-500 font-bold uppercase">Preço/ha (R$)</label>
                    <input type="number" min={0} value={form.pricePerHa} onChange={e => setForm(p => ({ ...p, pricePerHa: +e.target.value }))}
                      className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 transition-all bg-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-zinc-500 font-bold uppercase">Status</label>
                    <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as ClientStatus }))}
                      className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-violet-400 transition-all bg-white">
                      {['Novo Lead', 'Proposta Enviada', 'Fechado', 'Perdido'].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-500 font-bold uppercase">Observações</label>
                  <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                    rows={2} placeholder="Anotações sobre o cliente, negociação em andamento..."
                    className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-violet-400 transition-all bg-white resize-none" />
                </div>
                <button onClick={handleSaveClient}
                  className="bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm flex items-center gap-2">
                  <Check className="w-3.5 h-3.5" /> {editingClient ? 'Salvar Alterações' : 'Cadastrar Cliente'}
                </button>
              </div>
            )}

            {/* LISTAGEM DE CLIENTES */}
            {filteredClients.length === 0 ? (
              <div className="text-center py-12 bg-white border border-zinc-200 rounded-2xl text-zinc-400 text-sm">
                Nenhum cliente encontrado.
              </div>
            ) : (
              <div className="grid gap-3">
                {filteredClients.map(client => (
                  <div key={client.id} className="bg-white border border-zinc-200/80 p-5 rounded-2xl shadow-sm hover:border-violet-200 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-10 h-10 bg-violet-50 border border-violet-100 rounded-xl flex items-center justify-center text-violet-600 font-black text-sm flex-shrink-0">
                          {client.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="text-sm font-bold text-zinc-900">{client.name}</h3>
                            <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border font-bold uppercase ${STATUS_COLORS[client.status]}`}>
                              {client.status}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-3 text-[10px] font-mono text-zinc-400">
                            {client.farm && <span className="flex items-center gap-1"><Wheat className="w-3 h-3" />{client.farm}</span>}
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{client.city}</span>
                            {client.ha > 0 && <span className="text-zinc-600 font-bold">{client.ha} ha de {client.culture}</span>}
                            {client.pricePerHa > 0 && <span className="text-violet-600 font-bold">R${client.pricePerHa}/ha</span>}
                            {client.ha > 0 && client.pricePerHa > 0 && (
                              <span className="text-brand-green font-bold">≈ {(client.ha * client.pricePerHa).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 })}</span>
                            )}
                          </div>
                          {client.notes && <p className="text-[10px] text-zinc-400 mt-1 italic truncate max-w-md">{client.notes}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button onClick={() => handleOpenQuote(client)}
                          className="flex items-center gap-1 bg-brand-green hover:bg-brand-green/90 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg transition-all cursor-pointer">
                          <FileText className="w-3 h-3" /> Orçamento
                        </button>
                        <button onClick={() => handleEdit(client)}
                          className="p-1.5 rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-500 cursor-pointer transition-all">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(client.id)}
                          className="p-1.5 rounded-lg border border-red-100 bg-red-50 hover:bg-red-100 text-red-400 cursor-pointer transition-all">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── ABA: ORÇAMENTO ── */}
        {activeTab === 'orcamento' && (
          <div className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Formulário do orçamento */}
              <div className="bg-white border border-zinc-200/80 p-6 rounded-2xl shadow-sm space-y-4 relative">
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-violet-400" />
                <span className="text-[10px] font-mono text-violet-600 font-bold uppercase block">DADOS DO ORÇAMENTO</span>

                <div className="space-y-3">
                  <p className="text-[10px] font-mono text-zinc-400 font-bold uppercase border-b border-zinc-100 pb-1">Seus Dados (Piloto/Empresa)</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      { label: 'Seu Nome Completo', key: 'pilotName', placeholder: 'Nome do piloto' },
                      { label: 'Seu Telefone', key: 'pilotPhone', placeholder: '(00) 90000-0000' },
                      { label: 'Seu CPF/CNPJ', key: 'pilotCpf', placeholder: '000.000.000-00' },
                      { label: 'Sua Cidade - UF', key: 'pilotCity', placeholder: 'Uberaba-MG' },
                    ].map(f => (
                      <div key={f.key} className="space-y-1">
                        <label className="text-[10px] font-mono text-zinc-500 font-bold uppercase">{f.label}</label>
                        <input type="text" placeholder={f.placeholder} value={(quoteData as any)[f.key]}
                          onChange={e => setQuoteData(q => ({ ...q, [f.key]: e.target.value }))}
                          className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-violet-400 transition-all bg-white" />
                      </div>
                    ))}
                  </div>

                  <p className="text-[10px] font-mono text-zinc-400 font-bold uppercase border-b border-zinc-100 pb-1 mt-4">Dados do Cliente e Serviço</p>
                  {selectedClientForQuote && (
                    <div className="bg-violet-50 border border-violet-100 rounded-lg px-3 py-2 text-[10px] font-mono text-violet-600">
                      ✓ Dados carregados do CRM: <strong>{selectedClientForQuote.name}</strong>
                      <button onClick={() => setSelectedClientForQuote(null)} className="ml-2 underline cursor-pointer">limpar</button>
                    </div>
                  )}
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      { label: 'Nome do Cliente', key: 'clientName', placeholder: 'Nome do produtor' },
                      { label: 'Nome da Fazenda', key: 'farmName', placeholder: 'Fazenda São João' },
                      { label: 'Cultura', key: 'culture', placeholder: 'Soja, milho, cana...' },
                      { label: 'Data do Orçamento', key: 'date', placeholder: 'DD/MM/AAAA' },
                    ].map(f => (
                      <div key={f.key} className="space-y-1">
                        <label className="text-[10px] font-mono text-zinc-500 font-bold uppercase">{f.label}</label>
                        <input type="text" placeholder={f.placeholder} value={(quoteData as any)[f.key]}
                          onChange={e => setQuoteData(q => ({ ...q, [f.key]: e.target.value }))}
                          className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-violet-400 transition-all bg-white" />
                      </div>
                    ))}
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-zinc-500 font-bold uppercase">Área (hectares)</label>
                      <input type="number" min={0} value={quoteData.ha} onChange={e => setQuoteData(q => ({ ...q, ha: +e.target.value }))}
                        className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-violet-400 transition-all bg-white" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-zinc-500 font-bold uppercase">Preço/ha (R$)</label>
                      <input type="number" min={0} value={quoteData.priceHa} onChange={e => setQuoteData(q => ({ ...q, priceHa: +e.target.value }))}
                        className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-violet-400 transition-all bg-white" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-zinc-500 font-bold uppercase">Nº de Aplicações</label>
                      <input type="number" min={1} value={quoteData.applications} onChange={e => setQuoteData(q => ({ ...q, applications: +e.target.value }))}
                        className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-violet-400 transition-all bg-white" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-zinc-500 font-bold uppercase">Pagamento</label>
                      <select value={quoteData.paymentMethod} onChange={e => setQuoteData(q => ({ ...q, paymentMethod: e.target.value }))}
                        className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-violet-400 transition-all bg-white">
                        {['PIX', 'Boleto', 'Transferência', 'Cheque', 'À vista (dinheiro)'].map(p => <option key={p}>{p}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-zinc-500 font-bold uppercase">Observações / Condições</label>
                    <textarea rows={2} value={quoteData.notes} onChange={e => setQuoteData(q => ({ ...q, notes: e.target.value }))}
                      placeholder="Prazo de validade, condições climáticas, horário de operação..."
                      className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-violet-400 transition-all bg-white resize-none" />
                  </div>
                </div>
              </div>

              {/* Preview do orçamento */}
              <div className="space-y-3">
                <div ref={printRef} className="bg-white border-2 border-zinc-200 p-6 rounded-2xl shadow-sm print-area" id="quote-preview">
                  {/* Header do orçamento */}
                  <div className="border-b-2 border-zinc-900 pb-4 mb-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-black text-zinc-900 tracking-tight">ORÇAMENTO DE SERVIÇO</h2>
                        <p className="text-xs text-zinc-500 font-mono">Pulverização Agrícola com Drone</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-mono text-zinc-400">Data: <strong className="text-zinc-900">{quoteData.date}</strong></p>
                        <p className="text-[10px] font-mono text-zinc-400 mt-0.5">Nº: ORC-{Date.now().toString().slice(-6)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Dados do piloto */}
                  <div className="grid grid-cols-2 gap-6 mb-5">
                    <div className="space-y-1">
                      <p className="text-[9px] font-mono text-zinc-400 uppercase font-bold">PRESTADOR DE SERVIÇO</p>
                      <p className="text-sm font-bold text-zinc-900">{quoteData.pilotName || '[SEU NOME]'}</p>
                      <p className="text-[10px] font-mono text-zinc-500">{quoteData.pilotCpf || 'CPF/CNPJ'}</p>
                      <p className="text-[10px] font-mono text-zinc-500">{quoteData.pilotPhone || 'Telefone'}</p>
                      <p className="text-[10px] font-mono text-zinc-500">{quoteData.pilotCity || 'Cidade-UF'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-mono text-zinc-400 uppercase font-bold">CLIENTE / CONTRATANTE</p>
                      <p className="text-sm font-bold text-zinc-900">{quoteData.clientName || '[NOME DO CLIENTE]'}</p>
                      <p className="text-[10px] font-mono text-zinc-500">{quoteData.farmName || 'Nome da Fazenda'}</p>
                    </div>
                  </div>

                  {/* Tabela de itens */}
                  <table className="w-full text-xs mb-5 border-collapse">
                    <thead>
                      <tr className="bg-zinc-900 text-white">
                        <th className="text-left p-2 font-mono">DESCRIÇÃO DO SERVIÇO</th>
                        <th className="text-right p-2 font-mono">QTD</th>
                        <th className="text-right p-2 font-mono">UNITÁRIO</th>
                        <th className="text-right p-2 font-mono">TOTAL</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-zinc-200">
                        <td className="p-2 text-zinc-700">
                          Pulverização aérea com drone — {quoteData.culture || 'Cultura'}<br />
                          <span className="text-[10px] text-zinc-400">Local: {quoteData.farmName || 'Fazenda'} • {quoteData.applications}x aplicação(ões)</span>
                        </td>
                        <td className="p-2 text-right font-mono">{quoteData.ha} ha</td>
                        <td className="p-2 text-right font-mono">R$ {quoteData.priceHa},00</td>
                        <td className="p-2 text-right font-mono font-bold">{(quoteData.ha * quoteData.priceHa).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                      </tr>
                      {quoteData.applications > 1 && (
                        <tr className="border-b border-zinc-200">
                          <td className="p-2 text-zinc-500 text-[10px]">Aplicações adicionais ({quoteData.applications - 1}x)</td>
                          <td className="p-2 text-right font-mono text-zinc-500">{quoteData.ha} ha</td>
                          <td className="p-2 text-right font-mono text-zinc-500">R$ {quoteData.priceHa},00</td>
                          <td className="p-2 text-right font-mono text-zinc-500">{(quoteData.ha * quoteData.priceHa * (quoteData.applications - 1)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot>
                      <tr className="bg-zinc-50">
                        <td colSpan={3} className="p-2 font-black text-sm text-right">VALOR TOTAL</td>
                        <td className="p-2 text-right font-black text-base text-zinc-900">{qTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                      </tr>
                    </tfoot>
                  </table>

                  {/* Pagamento e observações */}
                  <div className="grid grid-cols-2 gap-4 text-xs mb-5">
                    <div className="bg-zinc-50 p-3 rounded-lg">
                      <p className="font-mono text-zinc-400 text-[9px] uppercase">Forma de pagamento</p>
                      <p className="font-bold text-zinc-900 mt-0.5">{quoteData.paymentMethod}</p>
                    </div>
                    {quoteData.notes && (
                      <div className="bg-zinc-50 p-3 rounded-lg">
                        <p className="font-mono text-zinc-400 text-[9px] uppercase">Observações</p>
                        <p className="text-zinc-700 mt-0.5 text-[10px]">{quoteData.notes}</p>
                      </div>
                    )}
                  </div>

                  {/* Assinaturas */}
                  <div className="grid grid-cols-2 gap-8 pt-6 border-t border-zinc-200 mt-4 text-[10px] font-mono text-zinc-400 text-center">
                    <div>
                      <div className="h-10 border-b border-zinc-400 mb-1" />
                      <p>{quoteData.pilotName || 'Prestador do Serviço'}</p>
                    </div>
                    <div>
                      <div className="h-10 border-b border-zinc-400 mb-1" />
                      <p>{quoteData.clientName || 'Contratante / Cliente'}</p>
                    </div>
                  </div>
                  <p className="text-center text-[9px] font-mono text-zinc-300 mt-4">Gerado via ECR Drones Business Tools • {new Date().getFullYear()}</p>
                </div>

                <button onClick={handlePrintQuote}
                  className="w-full bg-zinc-900 hover:bg-brand-green text-white font-bold text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm">
                  <Printer className="w-4 h-4" /> Imprimir / Salvar como PDF
                </button>
                <p className="text-center text-[10px] font-mono text-zinc-400">Use Ctrl+P → "Salvar como PDF" para exportar</p>
              </div>
            </div>
          </div>
        )}

        {/* ── ABA: CONTRATOS ── */}
        {activeTab === 'contratos' && (
          <div className="space-y-4">
            <p className="text-xs text-zinc-500 max-w-2xl">
              Modelos de contrato profissionais prontos para usar. Preencha os campos em <span className="bg-yellow-100 text-yellow-800 font-bold px-1 rounded">[COLCHETES]</span> com seus dados antes de imprimir.
            </p>
            {CONTRACTS.map(contract => (
              <div key={contract.id} className="bg-white border border-zinc-200/80 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-zinc-50 border border-zinc-200 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                      {contract.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-zinc-900">{contract.title}</h3>
                      <p className="text-[10px] text-zinc-400 mt-0.5 leading-relaxed max-w-lg">{contract.description}</p>
                      <span className="text-[9px] font-mono text-zinc-400 mt-1 block">{contract.pages} páginas • Editável</span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => setExpandedContract(expandedContract === contract.id ? null : contract.id)}
                      className="flex items-center gap-1.5 border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 font-bold text-xs px-3 py-2 rounded-lg transition-all cursor-pointer">
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandedContract === contract.id ? 'rotate-180' : ''}`} />
                      Visualizar
                    </button>
                    <button onClick={() => handlePrintContract(contract.content)}
                      className="flex items-center gap-1.5 bg-zinc-900 hover:bg-brand-green text-white font-bold text-xs px-3 py-2 rounded-lg transition-all cursor-pointer shadow-sm">
                      <Printer className="w-3.5 h-3.5" /> Imprimir
                    </button>
                  </div>
                </div>

                {expandedContract === contract.id && (
                  <div className="border-t border-zinc-200 bg-zinc-50 p-6">
                    <pre className="text-xs text-zinc-700 leading-relaxed whitespace-pre-wrap font-mono max-h-80 overflow-y-auto">
                      {contract.content.replace(/\[([^\]]+)\]/g, '[$1]')}
                    </pre>
                    <p className="text-[10px] font-mono text-zinc-400 mt-3">
                      💡 Os campos em <span className="bg-yellow-100 text-yellow-700 px-1 rounded">[COLCHETES]</span> devem ser preenchidos antes de assinar.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </main>

      <footer className="no-print mt-16 border-t border-zinc-200 bg-white py-6 relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4 text-center">
          <ECRDronesLogo version={5} size={24} />
          <p className="text-[10px] font-mono text-zinc-400">ECR DRONES • Business Tools Premium — Dados armazenados localmente no seu navegador.</p>
        </div>
      </footer>
    </div>
  );
}
