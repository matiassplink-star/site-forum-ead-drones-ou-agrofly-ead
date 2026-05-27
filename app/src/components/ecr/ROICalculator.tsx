"use client";

import React, { useState, useMemo } from 'react';
import { formatCurrency, formatNumber } from '@/lib/format';

export default function ROICalculator() {
  // ── ESTADOS DA CALCULADORA INTERATIVA DE ROI ──
  const [areaHectares, setAreaHectares] = useState(500);
  const [produtividadeSacas, setProdutividadeSacas] = useState(90);
  const [precoSaca, setPrecoSaca] = useState(115);

  // Parâmetros fixos do cálculo comercial
  const perdaAmassamentoPercentual = 0.03; // perda média de 3% por trator
  const economiaAguaPorHa = 185 - 12.5; // trator (150-200, média 185) vs drone (10-15, média 12.5)

  // Cálculos dinâmicos memorizados para máxima performance
  const sacasGanhas = useMemo(() => {
    return Math.round(areaHectares * produtividadeSacas * perdaAmassamentoPercentual);
  }, [areaHectares, produtividadeSacas]);

  const ganhoFinanceiroTotal = useMemo(() => {
    return sacasGanhas * precoSaca;
  }, [sacasGanhas, precoSaca]);

  const economiaAguaLitros = useMemo(() => {
    return Math.round(areaHectares * economiaAguaPorHa);
  }, [areaHectares]);

  // Cálculo das porcentagens de preenchimento para visual premium dos sliders
  const areaPercent = useMemo(() => ((areaHectares - 50) / (3000 - 50)) * 100, [areaHectares]);
  const prodPercent = useMemo(() => ((produtividadeSacas - 40) / (120 - 40)) * 100, [produtividadeSacas]);
  const precoPercent = useMemo(() => ((precoSaca - 90) / (160 - 90)) * 100, [precoSaca]);

  return (
    <section id="calculadora" className="py-20 px-6 bg-gradient-to-b from-brand-black to-brand-forest/10 relative overflow-hidden">
      
      {/* Luz ambiente de fundo decorativa */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(245,127,23,0.04)_0%,transparent_70%)] pointer-events-none z-0" 
        aria-hidden="true" 
      />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Cabeçalho de Seção */}
        <div className="text-center mb-12">
          <span className="text-brand-amber font-extrabold text-xs uppercase tracking-widest">Estudo de Caso & Simulador de Retorno</span>
          <h2 className="font-heading text-3xl md:text-5xl font-black mt-2 mb-4 text-white">O Impacto nos Números da Sua Fazenda</h2>
          <p className="text-brand-gray max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Ajuste a calculadora abaixo e simule o ganho real estimado ao eliminar o amassamento das trilhas de trator na sua propriedade.
          </p>
        </div>

        {/* Bloco da Calculadora */}
        <div className="bg-brand-black border-2 border-brand-amber/40 rounded-3xl p-6 md:p-10 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Controles deslizantes (Hectares, Produtividade, Preço da saca) */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            
            {/* Tamanho da Área */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-baseline font-heading">
                <label htmlFor="range-area" className="text-sm font-bold text-white cursor-pointer">
                  Área de Cultivo:
                </label>
                <span className="text-xl font-black text-brand-green" aria-live="polite">
                  {formatNumber(areaHectares)} Hectares
                </span>
              </div>
              <input
                id="range-area"
                type="range"
                min="50"
                max="3000"
                step="50"
                value={areaHectares}
                onChange={(e) => setAreaHectares(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer outline-none transition-all duration-150 focus-visible:ring-2 focus-visible:ring-brand-green"
                style={{
                  background: `linear-gradient(to right, var(--color-brand-green) 0%, var(--color-brand-green) ${areaPercent}%, rgba(46, 125, 50, 0.15) ${areaPercent}%, rgba(46, 125, 50, 0.15) 100%)`
                }}
                aria-valuemin={50}
                aria-valuemax={3000}
                aria-valuenow={areaHectares}
              />
              <div className="flex justify-between text-[10px] text-brand-gray font-semibold" aria-hidden="true">
                <span>50 ha</span>
                <span>1.500 ha</span>
                <span>3.000 ha</span>
              </div>
            </div>

            {/* Produtividade Soja */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-baseline font-heading">
                <label htmlFor="range-produtividade" className="text-sm font-bold text-white cursor-pointer">
                  Produtividade de Soja Esperada:
                </label>
                <span className="text-xl font-black text-brand-blue-sky" aria-live="polite">
                  {produtividadeSacas} Sacas / ha
                </span>
              </div>
              <input
                id="range-produtividade"
                type="range"
                min="40"
                max="120"
                step="5"
                value={produtividadeSacas}
                onChange={(e) => setProdutividadeSacas(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer outline-none transition-all duration-150 focus-visible:ring-2 focus-visible:ring-brand-blue-sky"
                style={{
                  background: `linear-gradient(to right, var(--color-brand-blue-sky) 0%, var(--color-brand-blue-sky) ${prodPercent}%, rgba(21, 101, 192, 0.15) ${prodPercent}%, rgba(21, 101, 192, 0.15) 100%)`
                }}
                aria-valuemin={40}
                aria-valuemax={120}
                aria-valuenow={produtividadeSacas}
              />
              <div className="flex justify-between text-[10px] text-brand-gray font-semibold" aria-hidden="true">
                <span>40 sc/ha</span>
                <span>80 sc/ha</span>
                <span>120 sc/ha</span>
              </div>
            </div>

            {/* Preço de Venda da Saca */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-baseline font-heading">
                <label htmlFor="range-preco" className="text-sm font-bold text-white cursor-pointer">
                  Preço da Saca de Soja (Estimado):
                </label>
                <span className="text-xl font-black text-brand-amber" aria-live="polite">
                  {formatCurrency(precoSaca)} / Saco
                </span>
              </div>
              <input
                id="range-preco"
                type="range"
                min="90"
                max="160"
                step="5"
                value={precoSaca}
                onChange={(e) => setPrecoSaca(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer outline-none transition-all duration-150 focus-visible:ring-2 focus-visible:ring-brand-amber"
                style={{
                  background: `linear-gradient(to right, var(--color-brand-amber) 0%, var(--color-brand-amber) ${precoPercent}%, rgba(245, 127, 23, 0.15) ${precoPercent}%, rgba(245, 127, 23, 0.15) 100%)`
                }}
                aria-valuemin={90}
                aria-valuemax={160}
                aria-valuenow={precoSaca}
              />
              <div className="flex justify-between text-[10px] text-brand-gray font-semibold" aria-hidden="true">
                <span>R$ 90,00</span>
                <span>R$ 125,00</span>
                <span>R$ 160,00</span>
              </div>
            </div>

          </div>

          {/* Resultados Dinâmicos */}
          <div className="lg:col-span-6 bg-brand-forest/10 border border-brand-green/35 rounded-2xl p-6 md:p-8 flex flex-col justify-between min-h-[340px] relative">
            
            <div className="absolute top-2 right-2 font-mono text-[9px] text-brand-gray/50 uppercase" aria-hidden="true">
              SIM_ID: ECR-{areaHectares}
            </div>

            <div>
              <span className="text-[10px] font-black text-brand-green uppercase tracking-widest block mb-1">
                Ganho Estimado com Amassamento Zero (3%)
              </span>
              
              {/* Sacas Recuperadas */}
              <div className="my-4">
                <div className="font-heading text-5xl md:text-6xl font-black text-white leading-none" aria-live="polite">
                  {formatNumber(sacasGanhas)} <span className="text-lg font-bold text-brand-green">Sacas</span>
                </div>
                <div className="text-xs text-brand-gray mt-1 font-sans">Colheita extra garantida direto no seu silo.</div>
              </div>

              {/* Impacto Financeiro Retorno */}
              <div className="bg-brand-black/50 border border-brand-amber/35 rounded-xl p-4 my-4">
                <div className="text-[9px] uppercase font-black text-brand-amber tracking-wider" aria-hidden="true">Retorno Financeiro Direto</div>
                <div className="font-heading text-3xl font-black text-brand-amber" aria-live="polite">
                  {formatCurrency(ganhoFinanceiroTotal)}
                </div>
                <div className="text-[10px] text-brand-gray mt-0.5 font-sans">Impacto financeiro com preço base de {formatCurrency(precoSaca)} o sc.</div>
              </div>
            </div>

            {/* Métricas de Economia Operacional */}
            <div className="grid grid-cols-2 gap-4 border-t border-brand-green/10 pt-4 text-xs font-sans">
              <div>
                <div className="text-brand-gray uppercase font-semibold text-[10px]" aria-hidden="true">Economia de Água</div>
                <div className="font-heading text-white font-extrabold text-sm mt-0.5" aria-live="polite">
                  {formatNumber(economiaAguaLitros)} Litros
                </div>
              </div>
              <div>
                <div className="text-brand-gray uppercase font-semibold text-[10px]" aria-hidden="true">Eficiência Operacional</div>
                <div className="font-heading text-white font-extrabold text-sm mt-0.5">
                  10 a 30 ha/h
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Parâmetro Estudo de Caso Real */}
        <div className="mt-8 text-center text-xs text-brand-gray leading-relaxed border-t border-white/5 pt-6 max-w-2xl mx-auto font-sans">
          <strong>Estudo de Caso Oficial:</strong> Comparação direta em soja em área de <strong>500 hectares</strong>. Eliminar <strong>3%</strong> de amassamento recupera <strong>1.350 sacas</strong> na colheita, gerando <strong>{formatCurrency(155250)}</strong> de ganho financeiro direto (preço saca {formatCurrency(115)}).
        </div>

      </div>
    </section>
  );
}
