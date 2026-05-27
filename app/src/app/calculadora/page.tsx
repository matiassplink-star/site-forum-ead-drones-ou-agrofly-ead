"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ECRDronesLogo from '@/components/ECRDronesLogo';
import { getUserSession, UserSession } from '@/lib/mockAuth';
import { ArrowLeft, Calculator, TrendingUp, DollarSign, Target, RefreshCw } from 'lucide-react';

export default function CalculadoraPage() {
  const router = useRouter();
  const [session, setSession] = useState<UserSession | null>(null);

  // Inputs
  const [haPerDia, setHaPerDia] = useState(16);
  const [precoHa, setPrecoHa] = useState(27);
  const [diasMes, setDiasMes] = useState(20);
  const [custoMes, setCustoMes] = useState(2200);

  useEffect(() => {
    const s = getUserSession();
    if (!s) { router.push('/auth'); return; }
    setSession(s);
  }, [router]);

  if (!session) return null;

  // Cálculos
  const haMes = haPerDia * diasMes;
  const faturamentoBruto = haMes * precoHa;
  const lucroLiquido = faturamentoBruto - custoMes;
  const lucroAnual = lucroLiquido * 12;
  const roi = custoMes > 0 ? ((lucroLiquido / custoMes) * 100).toFixed(0) : '0';
  const margemLiquida = faturamentoBruto > 0 ? ((lucroLiquido / faturamentoBruto) * 100).toFixed(0) : '0';

  // Para gráfico de barras comparativo (% relativo ao maior)
  const maxVal = Math.max(faturamentoBruto, custoMes, lucroLiquido > 0 ? lucroLiquido : 0);
  const pctBruto = maxVal > 0 ? (faturamentoBruto / maxVal) * 100 : 0;
  const pctCusto = maxVal > 0 ? (custoMes / maxVal) * 100 : 0;
  const pctLucro = maxVal > 0 && lucroLiquido > 0 ? (lucroLiquido / maxVal) * 100 : 0;

  const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 });

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-zinc-950 relative flex flex-col font-sans overflow-x-hidden selection:bg-brand-green selection:text-white">
      
      {/* GRID FUNDO */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(rgba(46, 125, 50, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(46, 125, 50, 0.4) 1px, transparent 1px)`, backgroundSize: '40px 40px' }} aria-hidden="true" />

      {/* HEADER */}
      <header className="relative z-10 border-b border-zinc-200 bg-white/95 backdrop-blur-xl shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 rounded bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-500 hover:text-zinc-900 transition-all cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="h-6 w-px bg-zinc-200" />
            <ECRDronesLogo version={3} size={34} showTagline={false} />
            <span className="text-[10px] font-mono text-zinc-400 hidden sm:block tracking-wider">CALCULADORA DE ROI</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-zinc-900">{session.name}</p>
              <p className="text-[10px] font-mono text-zinc-400 uppercase">PILOTO OPERADOR</p>
            </div>
            {session.role === 'premium' && <span className="px-2 py-0.5 rounded bg-amber-50 border border-brand-amber/30 text-[10px] font-mono text-brand-amber uppercase font-bold">👑 PREMIUM</span>}
            {session.role === 'admin' && <span className="px-2 py-0.5 rounded bg-blue-50 border border-brand-blue-sky/30 text-[10px] font-mono text-brand-blue-sky uppercase font-bold">⚙️ ADMIN</span>}
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

        {/* TÍTULO */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono text-brand-green tracking-widest uppercase flex items-center gap-1.5 font-bold">
            <Calculator className="w-3.5 h-3.5" />
            SIMULADOR DE RENTABILIDADE OPERACIONAL
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 font-heading">
            Calculadora de <span className="text-brand-amber">ROI de Voo</span>
          </h1>
          <p className="text-xs text-zinc-500 max-w-2xl leading-relaxed">
            Simule o faturamento, lucro líquido e retorno do seu negócio de pulverização com drone. Ajuste os valores abaixo e veja os resultados em tempo real.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">

          {/* PAINEL DE INPUTS */}
          <div className="bg-white border border-zinc-200/80 p-6 rounded-2xl shadow-sm space-y-6 relative">
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-brand-green" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-brand-green" />

            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <span className="text-xs font-mono text-brand-green uppercase tracking-wider font-bold">PARÂMETROS DA OPERAÇÃO</span>
              <button
                onClick={() => { setHaPerDia(16); setPrecoHa(27); setDiasMes(20); setCustoMes(2200); }}
                className="flex items-center gap-1 text-[10px] font-mono text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" /> resetar
              </button>
            </div>

            {/* Slider: Ha por dia */}
            <div className="space-y-3">
              <div className="flex justify-between items-baseline">
                <label className="text-xs font-mono text-zinc-500 font-bold uppercase">Hectares por Dia</label>
                <span className="text-lg font-black text-zinc-900 font-mono">{haPerDia} ha</span>
              </div>
              <input type="range" min={5} max={60} step={1} value={haPerDia} onChange={e => setHaPerDia(+e.target.value)}
                className="w-full h-2 bg-zinc-200 rounded-full appearance-none cursor-pointer accent-brand-green" />
              <div className="flex justify-between text-[9px] font-mono text-zinc-400">
                <span>5 ha (iniciante)</span><span>30 ha (médio)</span><span>60 ha (expert)</span>
              </div>
            </div>

            {/* Slider: Preço por ha */}
            <div className="space-y-3">
              <div className="flex justify-between items-baseline">
                <label className="text-xs font-mono text-zinc-500 font-bold uppercase">Preço por Hectare</label>
                <span className="text-lg font-black text-zinc-900 font-mono">R$ {precoHa}</span>
              </div>
              <input type="range" min={15} max={55} step={1} value={precoHa} onChange={e => setPrecoHa(+e.target.value)}
                className="w-full h-2 bg-zinc-200 rounded-full appearance-none cursor-pointer accent-brand-green" />
              <div className="flex justify-between text-[9px] font-mono text-zinc-400">
                <span>R$15 (mínimo)</span><span>R$30 (médio)</span><span>R$55 (premium)</span>
              </div>
            </div>

            {/* Slider: Dias trabalhados no mês */}
            <div className="space-y-3">
              <div className="flex justify-between items-baseline">
                <label className="text-xs font-mono text-zinc-500 font-bold uppercase">Dias Trabalhados / Mês</label>
                <span className="text-lg font-black text-zinc-900 font-mono">{diasMes} dias</span>
              </div>
              <input type="range" min={8} max={26} step={1} value={diasMes} onChange={e => setDiasMes(+e.target.value)}
                className="w-full h-2 bg-zinc-200 rounded-full appearance-none cursor-pointer accent-brand-amber" />
              <div className="flex justify-between text-[9px] font-mono text-zinc-400">
                <span>8 dias</span><span>16 dias</span><span>26 dias</span>
              </div>
            </div>

            {/* Input: Custo operacional */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-zinc-500 font-bold uppercase">Custo Operacional Mensal (R$)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm font-bold">R$</span>
                <input
                  type="number" min={0} max={20000} step={100}
                  value={custoMes}
                  onChange={e => setCustoMes(+e.target.value)}
                  className="w-full bg-white border border-zinc-200 rounded-lg pl-9 pr-3 py-2.5 text-sm font-mono font-bold text-zinc-900 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all"
                />
              </div>
              <p className="text-[9px] font-mono text-zinc-400">Inclua: bateria + combustível + manutenção + seguro + mão de obra</p>
            </div>
          </div>

          {/* PAINEL DE RESULTADOS */}
          <div className="space-y-4">

            {/* KPIs principais */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-zinc-200/80 p-5 rounded-2xl shadow-sm relative">
                <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-brand-green" />
                <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">Hectares / Mês</span>
                <span className="text-2xl font-black text-zinc-900 font-mono">{haMes.toLocaleString('pt-BR')}</span>
                <p className="text-[9px] font-mono text-zinc-400 mt-0.5">ha aplicados</p>
              </div>
              <div className="bg-white border border-zinc-200/80 p-5 rounded-2xl shadow-sm relative">
                <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-brand-amber" />
                <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">Margem Líquida</span>
                <span className={`text-2xl font-black font-mono ${+margemLiquida >= 0 ? 'text-brand-green' : 'text-red-500'}`}>{margemLiquida}%</span>
                <p className="text-[9px] font-mono text-zinc-400 mt-0.5">do faturamento</p>
              </div>
            </div>

            {/* Resultado financeiro principal */}
            <div className="bg-white border border-zinc-200/80 p-6 rounded-2xl shadow-sm space-y-4 relative">
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-brand-amber" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-brand-amber" />
              <span className="text-[10px] font-mono text-brand-amber uppercase tracking-wider font-bold">RESULTADO FINANCEIRO MENSAL</span>

              <div className="space-y-3">
                {/* Faturamento bruto */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-zinc-500">Faturamento Bruto</span>
                    <span className="font-bold text-zinc-900">{fmt(faturamentoBruto)}</span>
                  </div>
                  <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-green rounded-full transition-all duration-500" style={{ width: `${pctBruto}%` }} />
                  </div>
                </div>

                {/* Custo operacional */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-zinc-500">(-) Custo Operacional</span>
                    <span className="font-bold text-red-500">- {fmt(custoMes)}</span>
                  </div>
                  <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                    <div className="h-full bg-red-400 rounded-full transition-all duration-500" style={{ width: `${pctCusto}%` }} />
                  </div>
                </div>

                {/* Linha divisória */}
                <div className="border-t border-zinc-200 pt-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-bold text-zinc-700">Lucro Líquido Mensal</span>
                    <span className={`text-xl font-black font-mono ${lucroLiquido >= 0 ? 'text-brand-green' : 'text-red-500'}`}>
                      {fmt(lucroLiquido)}
                    </span>
                  </div>
                  {pctLucro > 0 && (
                    <div className="h-2.5 bg-zinc-100 rounded-full overflow-hidden mt-2">
                      <div className="h-full bg-gradient-to-r from-brand-green to-emerald-400 rounded-full transition-all duration-700" style={{ width: `${pctLucro}%` }} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ROI Anual */}
            <div className={`p-5 rounded-2xl border shadow-sm relative ${lucroLiquido >= 0 ? 'bg-emerald-50 border-brand-green/30' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider block">PROJEÇÃO ANUAL</span>
                  <span className={`text-3xl font-black font-mono ${lucroLiquido >= 0 ? 'text-brand-green' : 'text-red-500'}`}>
                    {fmt(lucroAnual)}
                  </span>
                  <p className="text-[10px] font-mono text-zinc-400 mt-0.5">lucro líquido em 12 meses</p>
                </div>
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-[10px] font-black font-mono ${lucroLiquido >= 0 ? 'bg-brand-green' : 'bg-red-400'}`}>
                  ROI<br />{roi}%
                </div>
              </div>
            </div>

            {/* Dica de mercado */}
            <div className="bg-white border border-zinc-200/80 p-4 rounded-xl text-xs font-mono text-zinc-500 space-y-1 shadow-sm">
              <span className="text-[9px] text-brand-amber font-bold uppercase tracking-wider block">★ BENCHMARK DE MERCADO 2026</span>
              <p>• Operador iniciante (0-1 ano): R$3.000 – R$5.500/mês</p>
              <p>• Operador intermediário (1-3 anos): R$5.500 – R$9.000/mês</p>
              <p>• Operador sênior (&gt;3 anos + 2 drones): R$9.000 – R$18.000/mês</p>
            </div>

          </div>
        </div>
      </main>

      <footer className="mt-16 border-t border-zinc-200 bg-white py-6 relative z-10">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between gap-4 text-center">
          <ECRDronesLogo version={5} size={24} />
          <p className="text-[10px] font-mono text-zinc-400">ECR DRONES • Calculadora ROI — Valores simulados para planejamento operacional.</p>
        </div>
      </footer>
    </div>
  );
}
