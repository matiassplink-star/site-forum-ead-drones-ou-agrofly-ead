"use client";
import React, { useState, useEffect } from 'react';
import ECRDronesLogo from '@/components/ECRDronesLogo';
import Link from 'next/link';
import { MessageSquare } from 'lucide-react';


export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Monitora o scroll da página para ajustar o visual da Navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: "#desafio", label: "O Desafio" },
    { href: "#solucao", label: "A Solução" },
    { href: "#calculadora", label: "Simular Lucro" },
    { href: "#metodo", label: "Método Operacional" },
    { href: "#escola", label: "A Escola" },
    { href: "#contato", label: "Fale Conosco" },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    const targetElement = document.querySelector(href);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b ${
        scrolled 
          ? 'py-3 bg-brand-black/90 backdrop-blur-lg border-brand-green/20 shadow-lg' 
          : 'py-5 bg-brand-black/50 backdrop-blur-sm border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        
        {/* GRUPO ESQUERDA: LOGO + LINKS DE NAVEGAÇÃO */}
        <div className="flex items-center gap-4 lg:gap-6 xl:gap-8">
          {/* LOGO */}
          <a 
            href="#" 
            onClick={(e) => handleLinkClick(e, '#')} 
            className="flex items-center focus-visible:outline-2 focus-visible:outline-brand-green rounded-lg shrink-0"
            aria-label="Ir para o topo da página ECR Drones"
          >
            <div className="filter drop-shadow-[0_0_10px_rgba(255,255,255,0.35)] brightness-125 contrast-105">
              <ECRDronesLogo version={3} size={36} showTagline={false} />
            </div>
          </a>

          {/* DESKTOP NAV LINKS */}
          <div className="hidden lg:flex items-center gap-3 lg:gap-4 xl:gap-5">
            {navLinks.map((link) => (
              <a 
                key={link.href}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-brand-gray hover:text-brand-green font-semibold text-[11px] xl:text-xs uppercase tracking-wider transition-all duration-300 focus-visible:outline-2 focus-visible:outline-brand-green rounded-sm px-1 py-0.5 whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* DESKTOP CTA BUTTONS (DIREITA) */}
        <div className="hidden lg:flex items-center gap-3 xl:gap-4 shrink-0">
          <Link 
            href="/auth" 
            className="text-brand-gray hover:text-white text-[11px] xl:text-xs font-bold uppercase tracking-wider px-2.5 py-2 transition-all focus-visible:outline-2 focus-visible:outline-brand-green rounded-lg whitespace-nowrap flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 bg-brand-green rounded-full animate-pulse" />
            Área do Aluno
          </Link>
          <a 
            href="#contato" 
            onClick={(e) => handleLinkClick(e, '#contato')}
            className="bg-brand-amber hover:bg-brand-amber/90 text-brand-black text-[11px] xl:text-xs font-black uppercase tracking-wider px-4 xl:px-5 py-2.5 xl:py-3 rounded-lg shadow-[0_0_20px_rgba(245,127,23,0.3)] transition-all duration-300 hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-brand-amber whitespace-nowrap flex items-center gap-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5 text-brand-black" />
            Falar com Piloto
          </a>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex lg:hidden items-center justify-center p-2 text-brand-gray hover:text-white transition-all focus-visible:outline-2 focus-visible:outline-brand-green rounded-lg"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label={isOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            )}
          </svg>
        </button>

      </div>

      {/* MOBILE NAV OVERLAY */}
      <div 
        id="mobile-menu"
        className={`lg:hidden fixed top-[60px] left-0 w-full h-[calc(100vh-60px)] bg-brand-black/95 backdrop-blur-xl border-t border-brand-green/10 transition-all duration-300 ease-out-expo flex flex-col justify-between p-8 z-40 ${
          isOpen ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 translate-x-full pointer-events-none'
        }`}
      >
        <div className="flex flex-col gap-6 mt-4">
          {navLinks.map((link) => (
            <a 
              key={link.href}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className="text-brand-gray hover:text-brand-green font-heading text-lg font-bold uppercase tracking-wider transition-all duration-300 py-2 border-b border-white/5 focus-visible:outline-2 focus-visible:outline-brand-green"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex flex-col gap-4 mb-16">
          <a 
            href="#contato" 
            onClick={(e) => handleLinkClick(e, '#contato')}
            className="w-full text-center text-brand-gray hover:text-white text-sm font-bold uppercase tracking-wider py-3 border border-white/10 rounded-xl transition-all"
          >
            Solicitar Orçamento
          </a>
          <a 
            href="#contato" 
            onClick={(e) => handleLinkClick(e, '#contato')}
            className="w-full text-center bg-brand-amber hover:bg-brand-amber/90 text-brand-black text-sm font-black uppercase tracking-wider py-4 rounded-xl shadow-[0_0_20px_rgba(245,127,23,0.3)] transition-all duration-300 flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4 text-brand-black" />
            Falar com Piloto (WhatsApp)
          </a>
        </div>
      </div>
    </nav>
  );
}
