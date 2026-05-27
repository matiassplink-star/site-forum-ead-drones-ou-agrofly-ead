"use client";

import React from 'react';

export default function Contact() {
  return (
    <section id="contato" className="py-20 px-6 bg-brand-forest/5 border-t border-brand-green/20 relative overflow-hidden">
      
      {/* Luz ambiente azulada para quebrar a monotonia */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(21,101,192,0.03)_0%,transparent_70%)] pointer-events-none z-0" 
        aria-hidden="true" 
      />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        
        {/* Cabeçalho */}
        <span className="text-brand-amber font-extrabold text-xs uppercase tracking-widest block mb-2">Orçamento Sem Compromisso</span>
        <h2 className="font-heading text-3xl md:text-5xl font-black text-white mb-4">Vamos Fechar Essa Parceria?</h2>
        <p className="text-brand-gray max-w-2xl mx-auto text-sm md:text-base leading-relaxed mb-12 font-sans">
          Fale diretamente com os fundadores e especialistas da <strong className="text-white font-semibold">ECR DRONES</strong> e receba uma proposta técnica personalizada e dimensionada para sua propriedade.
        </p>

        {/* Cartões de Contato Direto */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-2xl mx-auto items-stretch">
          
          {/* Celular / Whatsapp */}
          <div className="bg-brand-black border border-brand-green/20 rounded-2xl p-6 text-center hover:border-brand-green/50 transition-all duration-300 flex flex-col justify-center min-h-[180px] group">
            <div className="text-4xl mb-3" role="img" aria-label="Telefone verde">📞</div>
            <h4 className="font-heading font-bold text-white mb-1 group-hover:text-brand-green transition-all">Telefone / WhatsApp</h4>
            
            <a 
              href="https://wa.me/5534988056752"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-amber font-heading font-black text-xl md:text-2xl mt-2 tracking-wide block hover:underline focus-visible:outline-2 focus-visible:outline-brand-amber rounded-sm px-1"
              aria-label="Chamar Célio Nascimento no WhatsApp: 0 3 4 9 8 8 0 5 6 7 5 2"
            >
              034 9.8805-6752
            </a>
            
            <div className="text-[10px] text-brand-gray mt-2 uppercase font-semibold font-sans">
              Célio Nascimento — Gestor e Piloto
            </div>
          </div>

          {/* Próximos Passos */}
          <div className="bg-brand-black border border-brand-green/20 rounded-2xl p-6 text-left hover:border-brand-green/50 transition-all duration-300 flex flex-col justify-between min-h-[180px] font-sans">
            <div>
              <h4 className="font-heading font-bold text-white mb-2 flex items-center gap-2 text-sm">
                <span className="w-2 h-2 rounded-full bg-brand-green" aria-hidden="true" />
                Próximo Passo para Orçamento:
              </h4>
              <p className="text-xs text-brand-gray leading-relaxed">
                Envie dados básicos da sua lavoura como: tamanho da área total (hectares), cultura, número de aplicações planejadas e vazão média. Agendamos uma visita técnica no local sem custos adicionais.
              </p>
            </div>
            <div className="text-[10px] text-brand-amber font-black uppercase tracking-wider mt-4">
              💡 <strong className="text-brand-amber font-bold">ECR DRONES</strong> — Tecnologia de precisão para proteger sua lavoura e maximizar seu resultado
            </div>
          </div>

        </div>

        {/* CTA direto para WhatsApp */}
        <a 
          href="https://wa.me/5534988056752"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-brand-amber hover:bg-brand-amber/90 text-brand-black font-extrabold text-sm uppercase tracking-wider px-8 py-4 rounded-xl shadow-[0_0_30px_rgba(245,127,23,0.35)] transition-all duration-300 hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-brand-amber"
        >
          💬 Solicitar Orçamento via WhatsApp
        </a>

      </div>
    </section>
  );
}
