"use client";

import React from 'react';
import ECRDronesLogo from '@/components/ECRDronesLogo';

export default function Footer() {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetElement = document.querySelector(href);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="border-t border-brand-green/10 bg-brand-black px-6 py-12 text-center text-xs text-brand-gray relative z-10">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-6">
        
        {/* Logo isolada no rodapé */}
        <a 
          href="#" 
          onClick={(e) => handleScroll(e, '#')}
          className="scale-90 opacity-80 hover:opacity-100 transition-all rounded-lg focus-visible:outline-2 focus-visible:outline-brand-green"
          aria-label="Voltar para o topo da página"
        >
          <ECRDronesLogo version={5} size={45} />
        </a>

        <div className="font-sans">
          <p className="font-bold text-white mb-2 text-sm font-heading tracking-widest uppercase">
            ECR DRONES — Escola de Capacitação Rural & Serviços de Pulverização
          </p>
          <p className="leading-relaxed max-w-lg mx-auto text-xs">
            Unindo a robustez do campo com a precisão aeroespacial. Responsabilidade agronômica rígida e exatidão centimétrica digital. Terra + Tecnologia + Elevação.
          </p>
        </div>

        <div className="border-t border-brand-green/5 pt-6 w-full flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-sans">
          <div>
            © 2026 ECR Drones. Todos os direitos reservados. Operações aeroagrícolas regulamentadas em conformidade com as normas ANAC e DECEA.
          </div>
          <div className="flex gap-4">
            <a href="#contato" onClick={(e) => handleScroll(e, '#contato')} className="hover:underline hover:text-white transition-all">Termos de Uso</a>
            <a href="#contato" onClick={(e) => handleScroll(e, '#contato')} className="hover:underline hover:text-white transition-all">Privacidade</a>
            <a href="#contato" onClick={(e) => handleScroll(e, '#contato')} className="hover:underline hover:text-white transition-all">Suporte Agronômico</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
