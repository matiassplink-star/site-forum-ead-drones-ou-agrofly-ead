"use client";

import React from 'react';

export default function Hero() {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetElement = document.querySelector(href);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="px-6 pt-24 pb-20 md:pt-40 md:pb-32 max-w-6xl mx-auto text-center relative z-10 overflow-visible">
      
      {/* ── GRAFISMO HUD AEROESPACIAL DE PRECISÃO (ESQUERDA) ── */}
      <div 
        className="hidden lg:block absolute left-[-80px] top-[150px] w-[200px] h-[200px] pointer-events-none opacity-25"
        aria-hidden="true"
      >
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-brand-green">
          {/* Círculo graduado HUD */}
          <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
          <circle cx="50" cy="50" r="25" stroke="currentColor" strokeWidth="0.5" />
          {/* Linhas de Mira cruzadas */}
          <line x1="10" y1="50" x2="40" y2="50" stroke="currentColor" strokeWidth="0.5" />
          <line x1="60" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="0.5" />
          <line x1="50" y1="10" x2="50" y2="40" stroke="currentColor" strokeWidth="0.5" />
          <line x1="50" y1="60" x2="50" y2="90" stroke="currentColor" strokeWidth="0.5" />
          {/* Coordenadas HUD */}
          <text x="5" y="15" fill="currentColor" fontSize="6" fontFamily="monospace">LAT: 18.9102° S</text>
          <text x="5" y="25" fill="currentColor" fontSize="6" fontFamily="monospace">LON: 48.2755° W</text>
          <text x="5" y="35" fill="currentColor" fontSize="6" fontFamily="monospace">ALT: 3.5m (RTK)</text>
        </svg>
      </div>

      {/* ── GRAFISMO HUD AEROESPACIAL DE FLUXO (DIREITA) ── */}
      <div 
        className="hidden lg:block absolute right-[-80px] top-[150px] w-[200px] h-[200px] pointer-events-none opacity-25"
        aria-hidden="true"
      >
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-brand-blue-sky">
          {/* Gráfico de vetor de Downwash */}
          <path d="M10 20 C20 40 20 60 50 80 C80 60 80 40 90 20" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
          <circle cx="50" cy="80" r="3" fill="#FFA000" />
          {/* Grid de escaneamento HUD */}
          <line x1="20" y1="30" x2="80" y2="30" stroke="currentColor" strokeWidth="0.5" />
          <line x1="30" y1="40" x2="70" y2="40" stroke="currentColor" strokeWidth="0.5" />
          <line x1="40" y1="50" x2="60" y2="50" stroke="currentColor" strokeWidth="0.5" />
          {/* Telemetria */}
          <text x="55" y="85" fill="currentColor" fontSize="6" fontFamily="monospace">FLOW: 15 L/HA</text>
          <text x="55" y="93" fill="currentColor" fontSize="6" fontFamily="monospace">SPD: 22 KM/H</text>
        </svg>
      </div>

      {/* Glow de neblina de pulverização dinâmico */}
      <div 
        className="absolute inset-0 top-[20%] -translate-y-1/2 w-full h-[350px] bg-[radial-gradient(ellipse,rgba(46,125,50,0.18)_0%,transparent_60%)] pointer-events-none z-0" 
        aria-hidden="true"
      />
      <div 
        className="absolute inset-0 top-[25%] -translate-y-1/2 w-[700px] h-[250px] mx-auto bg-[radial-gradient(ellipse,rgba(245,127,23,0.06)_0%,transparent_70%)] pointer-events-none z-0" 
        aria-hidden="true"
      />

      <div className="relative z-10">
        {/* Badge AgroTech com micro-animações requintadas */}
        <div 
          className="inline-flex items-center gap-2 bg-[#1A3C1F]/40 border border-brand-green/30 px-5 py-2.5 rounded-full mb-8 text-brand-green font-bold text-xs uppercase tracking-widest backdrop-blur-md"
          role="status"
          aria-label="Status do serviço: Pulverização de precisão e capacitação ativa"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-amber opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-amber"></span>
          </span>
          <span className="text-[10px] sm:text-xs font-mono font-medium text-white/90">TURMAS ABERTAS 2026</span>
        </div>

        {/* Headline Principal de Impacto Absoluto */}
        <h1 className="font-heading text-4xl sm:text-7xl md:text-[5.5rem] font-black tracking-tight leading-[0.9] mb-8 text-white uppercase select-none">
          Domine a Tecnologia da<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green via-brand-blue-sky to-brand-amber font-black italic">
            Elevação no Campo
          </span>
        </h1>

        {/* Slogan & Conceito Central com Respiro */}
        <div 
          className="flex justify-center items-center gap-8 mb-10 text-brand-gray font-heading font-medium tracking-[0.25em] text-xs md:text-sm uppercase"
          aria-label="Conceito da marca: Terra, Tecnologia e Elevação"
        >
          <span className="hover:text-brand-green transition-colors duration-300">Terra</span>
          <span className="w-1.5 h-1.5 rounded-full bg-brand-blue-sky" aria-hidden="true" />
          <span className="hover:text-brand-blue-sky transition-colors duration-300">Tecnologia</span>
          <span className="w-1.5 h-1.5 rounded-full bg-brand-amber" aria-hidden="true" />
          <span className="hover:text-brand-amber transition-colors duration-300">Elevação</span>
        </div>

        {/* Descrição em formato editorial limpo */}
        <p className="text-base md:text-xl text-brand-gray/90 max-w-3xl mx-auto leading-relaxed mb-12 font-sans font-light">
          A <strong className="text-white font-semibold">ECR Drones</strong> une a solidez rústica do campo com a precisão aeroespacial. Entregamos o serviço de <strong className="text-white font-semibold">Pulverização Flutuante de Alta Capacidade</strong> e formamos a próxima geração de operadores profissionais com a nossa <strong className="text-white font-semibold">Escola de Capacitação Rural</strong>.
        </p>

        {/* Botões CTA Duplo premium com focos */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-5 max-w-lg mx-auto">
          <a 
            href="#calculadora" 
            onClick={(e) => handleScroll(e, '#calculadora')}
            className="w-full sm:flex-1 bg-brand-amber hover:bg-brand-amber/90 text-brand-black font-extrabold text-sm uppercase tracking-wider py-4.5 rounded-xl shadow-[0_0_35px_rgba(245,127,23,0.3)] transition-all duration-300 hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-brand-amber active:scale-[0.98]"
          >
            🚁 Contratar Pulverização
          </a>
          <a 
            href="#escola" 
            onClick={(e) => handleScroll(e, '#escola')}
            className="w-full sm:flex-1 bg-[#1A3C1F]/60 hover:bg-[#1A3C1F]/80 border border-brand-green/30 text-white font-extrabold text-sm uppercase tracking-wider py-4.5 rounded-xl transition-all duration-300 hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-brand-green active:scale-[0.98]"
          >
            🎓 Estudar na Escola
          </a>
        </div>
      </div>

    </header>
  );
}
