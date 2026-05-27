"use client";

import React from 'react';
import { COURSES, ACADEMIC_PLANS } from '@/data/constants';

export default function School() {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetElement = document.querySelector(href);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="escola" className="py-24 px-6 max-w-6xl mx-auto border-t border-brand-green/10 overflow-visible">
      
      {/* Cabeçalho de Seção */}
      <div className="text-center mb-20">
        <span className="text-brand-green font-heading font-black text-xs uppercase tracking-[0.2em] block mb-3">
          // CAPACITAÇÃO E TECNOLOGIA RURAL
        </span>
        <h2 className="font-heading text-3xl md:text-5xl font-black mt-2 mb-6 text-white uppercase">
          A Escola de Capacitação Rural
        </h2>
        <p className="text-brand-gray/90 max-w-2xl mx-auto text-base leading-relaxed font-sans font-light">
          Formamos operadores de elite com quem atua no campo de verdade todos os dias. Uma formação técnica profissionalizante que une solo e altitude.
        </p>
      </div>

      {/* ── BENTO GRID DE CURSOS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-24">
        
        {/* Bloco 1 (1/3): Curso de Entrada Grátis */}
        <div className="bg-[#1A3C1F]/5 border border-brand-green/10 rounded-3xl p-6 md:p-8 flex flex-col justify-between hover:border-brand-green/30 transition-all duration-300 relative group">
          <div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-4xl" role="img" aria-label="Ícone de alvo">🎯</span>
              <span className="text-[8px] font-mono font-medium text-brand-green uppercase bg-brand-green/10 px-2.5 py-1 rounded border border-brand-green/20" role="status">
                Acesso de Entrada
              </span>
            </div>
            
            <h3 className="font-heading text-xl font-bold text-white mb-3 group-hover:text-brand-green transition-all duration-300 uppercase tracking-wide">
              {COURSES[0].title}
            </h3>
            
            <p className="text-xs md:text-sm text-brand-gray leading-relaxed mb-6 font-sans font-light">
              {COURSES[0].desc}
            </p>
          </div>

          <div>
            <div className="text-[10px] font-mono text-brand-gray/80 mb-4 flex items-center gap-1.5 border-t border-white/5 pt-4">
              <span>📹</span>
              <span>{COURSES[0].duration}</span>
            </div>
            <a 
              href="#planos" 
              onClick={(e) => handleScroll(e, '#planos')}
              className="block text-center w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all focus-visible:outline-2 focus-visible:outline-white"
            >
              Começar Grátis
            </a>
          </div>
        </div>

        {/* Bloco 2 (2/3 LARGURA): Trilhas Avançadas Integradas (Bento Grid Destaque) */}
        <div className="lg:col-span-2 bg-[#1A3C1F]/15 border border-brand-green/25 rounded-3xl p-8 flex flex-col justify-between hover:border-brand-green/45 transition-all duration-300 relative overflow-hidden group">
          {/* Decorações HUD */}
          <div className="absolute top-3 right-4 font-mono text-[8px] text-brand-amber/40 uppercase tracking-widest" aria-hidden="true">
            ACAD_TRACK // HIGH_CAPACITY_OPERATIONS
          </div>

          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-4xl" role="img" aria-label="Globo e Gota">🗺️ 💧</span>
              <span className="text-[8px] font-mono font-medium text-brand-amber uppercase bg-brand-amber/10 px-2.5 py-1 rounded border border-brand-amber/20" role="status">
                Trilhas Técnicas Profissionais
              </span>
            </div>

            <h3 className="font-heading text-2xl font-black text-white mb-6 uppercase tracking-wide group-hover:text-brand-green transition-colors duration-300">
              Formações Avançadas de Elite
            </h3>

            {/* Colunas Internas das duas formações */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
              <div className="border-r border-white/5 pr-0 md:pr-6">
                <h4 className="font-heading text-sm font-bold text-white mb-2 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-blue-sky" />
                  Mapeamento Aéreo e NDVI
                </h4>
                <p className="text-xs text-brand-gray leading-relaxed font-light">
                  Aprenda a planejar voos autônomos, processar imagens multiespectrais e gerar mapas NDVI profissionais no Pix4D e QGIS para prescrever taxas variáveis precisas.
                </p>
              </div>
              <div>
                <h4 className="font-heading text-sm font-bold text-white mb-2 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-amber" />
                  Pulverização Autônoma
                </h4>
                <p className="text-xs text-brand-gray leading-relaxed font-light">
                  Operação de drones pesados (XAG P100PRO), calibração profissional de bicos rotativos, controle dinâmico de deriva e manuseio seguro de geradores e baterias.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-brand-green/10 pt-6 mt-6 gap-4">
            <span className="text-[10px] font-mono text-brand-gray/80 flex items-center gap-1.5">
              <span>📹</span>
              <span>32 Aulas Completas • 14 horas de Treinamento Técnico</span>
            </span>
            <a 
              href="#planos" 
              onClick={(e) => handleScroll(e, '#planos')}
              className="w-full sm:w-auto bg-brand-amber hover:bg-brand-amber/90 text-brand-black font-extrabold text-xs uppercase tracking-wider px-6 py-3 rounded-lg shadow-[0_0_20px_rgba(245,127,23,0.3)] transition-all duration-300 hover:scale-[1.02]"
            >
              Matricular na Formação
            </a>
          </div>
        </div>

      </div>

      {/* ── SEÇÃO DE PLANOS ACADÊMICOS REIMAGINADOS ── */}
      <div id="planos" className="max-w-6xl mx-auto pt-4">
        <h3 className="font-heading text-2xl md:text-3xl font-black text-center mb-14 text-white uppercase tracking-wide">
          Planos de Acesso Acadêmicos
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {ACADEMIC_PLANS.map((plan, idx) => (
            <div 
              key={idx} 
              className={`bg-brand-black border rounded-3xl p-8 flex flex-col justify-between min-h-[500px] transition-all duration-300 relative ${
                plan.featured 
                  ? 'bg-gradient-to-b from-[#1A3C1F]/45 to-brand-black border-brand-amber shadow-[0_0_50px_rgba(245,127,23,0.15)] hover:scale-[1.01]' 
                  : plan.name.includes('Fórum')
                    ? 'border-brand-blue-sky/35 hover:border-brand-blue-sky/50'
                    : 'border-brand-green/10 hover:border-brand-green/20'
              }`}
            >
              {plan.badge && (
                <div 
                  className="absolute top-[-13px] left-[50%] -translate-x-[50%] bg-brand-amber text-brand-black font-mono font-black text-[8px] px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg border border-brand-gold/30"
                  aria-hidden="true"
                >
                  // {plan.badge}
                </div>
              )}

              <div>
                <span className={`text-[10px] font-mono font-bold uppercase tracking-widest block mb-1 ${
                  plan.featured 
                    ? 'text-brand-amber' 
                    : plan.name.includes('Fórum')
                      ? 'text-brand-blue-sky'
                      : 'text-brand-gray'
                }`}>
                  {plan.name.includes('Completa') ? 'CURSO COMPLETO TÉCNICO' : plan.name.includes('Fórum') ? 'ASSINATURA OPERACIONAL' : 'ACESSO DE INTRODUÇÃO'}
                </span>
                
                <h4 className="font-heading text-3xl md:text-4xl font-black text-white mt-2 mb-2">
                  {plan.price}
                  {plan.periodText && (
                    <span className="text-xs text-brand-gray font-normal font-sans tracking-normal">
                      {plan.periodText}
                    </span>
                  )}
                </h4>
                
                <p className="text-xs text-brand-gray mb-8 font-sans font-light">
                  {plan.desc}
                </p>

                {/* Lista de recursos com ícone customizado */}
                <div className="flex flex-col gap-4 text-xs md:text-sm text-brand-gray font-sans" aria-label={`Recursos do plano ${plan.name}`}>
                  {plan.features.map((feature, featureIdx) => (
                    <div key={featureIdx} className="flex gap-3 items-start font-light">
                      <span className={`font-mono text-xs shrink-0 select-none ${
                        plan.featured 
                          ? 'text-brand-amber' 
                          : plan.name.includes('Fórum')
                            ? 'text-brand-blue-sky'
                            : 'text-brand-green'
                      }`} aria-hidden="true">
                        [✓]
                      </span>
                      <span className="text-white/80">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <a 
                href="#contato" 
                onClick={(e) => handleScroll(e, '#contato')}
                className={`block text-center w-full py-4 mt-10 rounded-xl font-bold transition-all text-xs uppercase tracking-wider ${
                  plan.featured
                    ? 'bg-brand-amber hover:bg-brand-amber/90 text-brand-black shadow-[0_0_30px_rgba(245,127,23,0.35)] focus-visible:outline-brand-amber'
                    : plan.name.includes('Fórum')
                      ? 'bg-brand-blue-sky hover:bg-brand-blue-sky/90 text-white focus-visible:outline-brand-blue-sky'
                      : 'bg-white/5 border border-white/10 hover:bg-white/10 text-white focus-visible:outline-white'
                }`}
              >
                {plan.btnText}
              </a>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
