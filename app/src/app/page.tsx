"use client";

import React from 'react';
import Navbar from '@/components/ecr/Navbar';
import Hero from '@/components/ecr/Hero';
import Challenge from '@/components/ecr/Challenge';
import ROICalculator from '@/components/ecr/ROICalculator';
import Solution from '@/components/ecr/Solution';
import Method from '@/components/ecr/Method';
import School from '@/components/ecr/School';
import Contact from '@/components/ecr/Contact';
import Footer from '@/components/ecr/Footer';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-brand-black text-white font-sans overflow-x-hidden relative selection:bg-brand-green selection:text-white scroll-smooth">
      
      {/* ── GRID DE FUNDO TECNOLÓGICO DA LAVOURA ── */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-45" 
        style={{
          backgroundImage: `
            linear-gradient(rgba(46, 125, 50, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(46, 125, 50, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }} 
        aria-hidden="true"
      />

      {/* ── ELEMENTOS DE RADAR E TELEMETRIA AÉREA ── */}
      <div className="absolute top-0 left-0 w-full h-[800px] pointer-events-none overflow-hidden opacity-20 z-0" aria-hidden="true">
        <svg width="100%" height="100%">
          <path d="M-100 200 L1200 600 M500 -100 L1600 400" stroke="#1565C0" strokeWidth="0.5" strokeDasharray="5 5" />
          <circle cx="85%" cy="350" r="220" stroke="#2E7D32" strokeWidth="0.5" fill="none" />
          <circle cx="85%" cy="350" r="140" stroke="#2E7D32" strokeWidth="0.5" strokeDasharray="3 3" fill="none" />
          <path d="M100 150 A50 50 0 0 1 200 150" stroke="#FFA000" strokeWidth="0.7" fill="none" />
        </svg>
      </div>

      {/* ── GLOW PRINCIPAL NO TOPO ── */}
      <div 
        className="fixed top-[-250px] left-[50%] -translate-x-[50%] w-[1000px] h-[600px] bg-[radial-gradient(ellipse,rgba(46,125,50,0.12)_0%,transparent_70%)] pointer-events-none z-0" 
        aria-hidden="true" 
      />

      {/* ── BARRA DE NAVEGAÇÃO SUPERIOR FIXA ── */}
      <Navbar />

      {/* ── CONTEÚDO ORQUESTRADO COM Z-INDEX 10 ── */}
      <div className="relative z-10 flex flex-col min-h-screen justify-between pt-16">
        
        {/* Seção Hero */}
        <Hero />

        {/* Seção Desafio */}
        <Challenge />

        {/* Seção Calculadora Interativa de ROI */}
        <ROICalculator />

        {/* Seção A Solução & Vortex */}
        <Solution />

        {/* Seção Nosso Método & Equipe */}
        <Method />

        {/* Seção A Escola & Planos Acadêmicos */}
        <School />

        {/* Seção Contato & WhatsApp */}
        <Contact />

        {/* Rodapé da Plataforma */}
        <Footer />

      </div>
    </main>
  );
}
