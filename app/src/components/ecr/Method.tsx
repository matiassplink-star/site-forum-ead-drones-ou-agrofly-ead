"use client";

import React from 'react';
import { METHOD_STEPS, TEAM_MEMBERS } from '@/data/constants';

export default function Method() {
  return (
    <section id="metodo" className="py-20 px-6 bg-brand-black/50 border-t border-brand-green/10">
      <div className="max-w-6xl mx-auto">
        
        {/* Cabeçalho de Seção */}
        <div className="text-center mb-16">
          <span className="text-brand-green font-extrabold text-xs uppercase tracking-widest">Segurança e Rigor Técnico</span>
          <h2 className="font-heading text-3xl md:text-5xl font-black mt-2 mb-4 text-white">Nosso Método de Trabalho</h2>
          <p className="text-brand-gray max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Não vendemos apenas voos — entregamos proteção de lavoura com responsabilidade técnica rigorosa e transparência em cada hectare trabalhado.
          </p>
        </div>

        {/* Passos do Método de Trabalho */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {METHOD_STEPS.map((item, idx) => (
            <div 
              key={idx} 
              className="bg-brand-forest/5 border border-brand-green/15 rounded-2xl p-6 md:p-8 relative group hover:border-brand-green/45 transition-all duration-300"
            >
              <div 
                className="font-heading text-5xl font-black text-brand-green/20 absolute top-4 right-6 group-hover:text-brand-green/40 transition-all duration-300"
                aria-hidden="true"
              >
                {item.step}
              </div>
              <h3 className="font-heading text-lg font-bold text-white mb-3 mt-4 group-hover:text-brand-green transition-all duration-300">
                {item.title}
              </h3>
              <p className="text-xs md:text-sm text-brand-gray leading-relaxed font-sans">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Equipe Operacional */}
        <div className="mt-16 bg-brand-forest/10 border border-brand-green/20 rounded-2xl p-6 md:p-10">
          <h3 className="font-heading text-2xl font-black text-center mb-10 text-white">
            Operadores Especializados ECR Drones
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-3xl mx-auto">
            {TEAM_MEMBERS.map((member, idx) => (
              <div 
                key={idx} 
                className="flex gap-4 items-center bg-brand-black/60 p-5 rounded-xl border border-brand-green/10 hover:border-brand-green/30 transition-all duration-300"
              >
                <div 
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl border shrink-0 bg-brand-black`}
                  style={{ borderColor: member.name.includes('Rômulo') ? 'var(--color-brand-green)' : 'var(--color-brand-blue-sky)' }}
                  role="img"
                  aria-label={`Avatar estilizado de ${member.name}`}
                >
                  {member.avatar}
                </div>
                <div className="font-sans">
                  <h4 className="font-heading text-lg font-bold text-white leading-tight">
                    {member.name}
                  </h4>
                  <p 
                    className={`text-[10px] font-bold uppercase tracking-wider mb-1 mt-0.5`}
                    style={{ color: member.name.includes('Rômulo') ? 'var(--color-brand-green)' : 'var(--color-brand-blue-sky)' }}
                  >
                    {member.role}
                  </p>
                  <p className="text-xs text-brand-gray leading-relaxed">
                    {member.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
