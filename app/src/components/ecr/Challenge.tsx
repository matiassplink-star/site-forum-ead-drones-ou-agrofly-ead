"use client";

import React from 'react';

export default function Challenge() {
  return (
    <section id="desafio" className="py-24 px-6 bg-brand-black border-y border-brand-green/10 relative overflow-hidden">
      
      {/* Detalhe de fundo de radar de varredura topográfica */}
      <div className="absolute left-[5%] bottom-[-50px] w-[300px] h-[300px] pointer-events-none opacity-5" aria-hidden="true">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-brand-green">
          <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="0.5" />
          <path d="M50 5 L50 95 M5 50 L95 50" stroke="currentColor" strokeWidth="0.3" />
          <path d="M50 50 L80 20" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Cabeçalho de Seção com contraste de pesos */}
        <div className="text-center mb-20">
          <span className="text-brand-amber font-heading font-black text-xs uppercase tracking-[0.2em] block mb-3">
            // DIAGNÓSTICO DE AMORTECIMENTO OPERACIONAL
          </span>
          <h2 className="font-heading text-3xl md:text-5xl font-black mt-2 mb-6 text-white uppercase leading-tight">
            A Corrida Contra o Tempo na Safra
          </h2>
          <p className="text-brand-gray/90 max-w-2xl mx-auto text-base leading-relaxed font-sans font-light">
            &ldquo;Cada safra é uma corrida contra o tempo, onde o lucro é decidido nos detalhes.&rdquo; Pequenas falhas no manejo de pulverização geram prejuízos invisíveis acumulados que corroem a margem da fazenda.
          </p>
        </div>

        {/* ── BENTO GRID ASSIMÉTRICO DE SINALIZAÇÃO Eco-Tech ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          
          {/* CARD 1 (LARGURA 2/3) - AMASSAMENTO INVISÍVEL */}
          <div className="lg:col-span-2 bg-[#1A3C1F]/15 border border-brand-green/20 rounded-3xl p-8 md:p-10 flex flex-col justify-between hover:border-brand-green/45 transition-all duration-350 relative overflow-hidden group">
            {/* Decoração técnica HUD nas bordas */}
            <div className="absolute top-3 right-4 font-mono text-[8px] text-brand-green/40 uppercase tracking-widest" aria-hidden="true">
              SYS_LOSS_METRIC // 0.03
            </div>
            
            <div>
              <div className="text-4xl mb-6" role="img" aria-label="Trator danificando plantas">🚜</div>
              <h3 className="font-heading text-2xl font-black text-white mb-4 uppercase tracking-wide group-hover:text-brand-green transition-colors duration-300">
                O Desperdício Invisível do Amassamento
              </h3>
              <p className="text-sm md:text-base text-brand-gray leading-relaxed font-sans font-light mb-6">
                Ao entrar na lavoura com tratores e pulverizadores pesados, o produtor literalmente esmaga as plantas sob os rodados. Estatisticamente, perde-se de <strong className="text-white font-semibold">2% a 4% da área produtiva total</strong>. Em uma propriedade de 1.000 hectares plantados, isso representa adubar e cuidar de até <strong className="text-brand-amber font-semibold">40 hectares</strong> que serão jogados fora e jamais colhidos.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-brand-green/10 pt-6 mt-4 gap-4">
              <div className="flex items-baseline gap-2 font-heading">
                <span className="text-5xl font-black text-brand-amber leading-none">0%</span>
                <span className="text-xs uppercase text-brand-gray font-bold tracking-wider leading-none">Amassamento com ECR Drones</span>
              </div>
              <div className="text-[10px] font-mono uppercase text-brand-amber bg-brand-amber/10 px-3 py-1.5 rounded border border-brand-amber/25 tracking-wider self-start sm:self-center">
                AMASSAMENTO ZERO = LUCRO DIRETO NO SILO
              </div>
            </div>
          </div>

          {/* CARD 2 (LARGURA 1/3) - JANELAS CLIMÁTICAS */}
          <div className="bg-[#1A3C1F]/10 border border-brand-green/15 rounded-3xl p-6 md:p-8 flex flex-col justify-between hover:border-brand-green/45 transition-all duration-350 relative group">
            <div className="absolute top-3 right-4 font-mono text-[8px] text-brand-blue-sky/50 uppercase tracking-widest" aria-hidden="true">
              TIME_STAMP // GAP
            </div>
            
            <div>
              <div className="text-4xl mb-6" role="img" aria-label="Relógio">⏱️</div>
              <h3 className="font-heading text-xl font-bold text-white mb-4 uppercase tracking-wide group-hover:text-brand-green transition-colors duration-300">
                Janelas Climáticas
              </h3>
              <p className="text-xs md:text-sm text-brand-gray leading-relaxed font-sans font-light">
                O tempo ideal de aplicação é curto e imprevisível. Atrasos de 24 a 48 horas podem comprometer a eficácia de tratamentos críticos contra pragas agressivas como a ferrugem asiática.
              </p>
            </div>
            
            <div className="border-t border-white/5 pt-4 mt-6 text-[10px] font-mono uppercase text-brand-blue-sky tracking-wider">
              Atrasos comprometem a eficácia
            </div>
          </div>

          {/* CARD 3 (LARGURA 1/3) - LOGÍSTICA DE INSUMOS */}
          <div className="bg-[#1A3C1F]/10 border border-brand-green/15 rounded-3xl p-6 md:p-8 flex flex-col justify-between hover:border-brand-green/45 transition-all duration-350 relative group">
            <div className="absolute top-3 right-4 font-mono text-[8px] text-brand-blue-sky/50 uppercase tracking-widest" aria-hidden="true">
              CHEM_LOSS_RATE // HIGH
            </div>
            
            <div>
              <div className="text-4xl mb-6" role="img" aria-label="Saco de dinheiro">💰</div>
              <h3 className="font-heading text-xl font-bold text-white mb-4 uppercase tracking-wide group-hover:text-brand-green transition-colors duration-300">
                Logística de Insumos
              </h3>
              <p className="text-xs md:text-sm text-brand-gray leading-relaxed font-sans font-light">
                Defensivos representam uma grande parcela do custo. Pulverização tratorizada exige logística pesada de água (150 a 200 L/ha), causando compactação do solo e escorrimento foliar excessivo para a terra.
              </p>
            </div>
            
            <div className="border-t border-white/5 pt-4 mt-6 text-[10px] font-mono uppercase text-brand-blue-sky tracking-wider">
              10 a 15 L/ha com drone
            </div>
          </div>

          {/* CARD 4 (LARGURA 2/3) - INEFICIÊNCIA DO BAIXEIRO & DOWNWASH */}
          <div className="lg:col-span-2 bg-[#1A3C1F]/15 border border-brand-green/20 rounded-3xl p-8 md:p-10 flex flex-col justify-between hover:border-brand-green/45 transition-all duration-350 relative overflow-hidden group">
            <div className="absolute top-3 right-4 font-mono text-[8px] text-brand-green/40 uppercase tracking-widest" aria-hidden="true">
              VORTEX_SYS // downwash
            </div>
            
            <div>
              <div className="text-4xl mb-6" role="img" aria-label="Gota de água caindo na folha">💧</div>
              <h3 className="font-heading text-2xl font-black text-white mb-4 uppercase tracking-wide group-hover:text-brand-green transition-colors duration-300">
                A Ineficiência do &ldquo;Baixeiro&rdquo; e o Efeito Downwash
              </h3>
              <p className="text-sm md:text-base text-brand-gray leading-relaxed font-sans font-light mb-6">
                Muitas vezes, a pulverização tratorizada convencional não consegue fazer com que a névoa penetre na densa folhagem das plantas, deixando a parte de baixo (o baixeiro) totalmente vulnerável a pragas. A ECR Drones resolve isso fisicamente: o potente fluxo de vento descendente das hélices (<strong className="text-brand-blue-sky font-semibold">Downwash</strong>) abre a massa de folhas, forçando a névoa de defensivo de forma tridimensional até o baixeiro da planta.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-brand-green/10 pt-6 mt-4 gap-4">
              <div className="flex items-baseline gap-2 font-heading">
                <span className="text-5xl font-black text-brand-blue-sky leading-none">360°</span>
                <span className="text-xs uppercase text-brand-gray font-bold tracking-wider leading-none">Cobertura Foliar Uniforme</span>
              </div>
              <div className="text-[10px] font-mono uppercase text-brand-green bg-brand-green/10 px-3 py-1.5 rounded border border-brand-green/25 tracking-wider self-start sm:self-center">
                PENETRAÇÃO FOLIAR FÍSICA INCONTESTÁVEL
              </div>
            </div>
          </div>

        </div>

        <div className="mt-14 text-center text-xs sm:text-sm font-bold text-brand-green/80 italic border-t border-brand-green/10 pt-6 font-sans">
          Conclusão: Continuar no modelo convencional é aceitar perdas que a tecnologia moderna de elevação já eliminou. Protegemos seu solo enquanto operamos de cima.
        </div>

      </div>
    </section>
  );
}
