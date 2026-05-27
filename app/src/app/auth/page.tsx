"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ECRDronesLogo from '@/components/ECRDronesLogo';
import { setUserSession, clearUserSession, getUserSession } from '@/lib/mockAuth';
import { Shield, Sparkles, User, Award, Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Limpa sessões antigas ao entrar na tela de login
  useEffect(() => {
    clearUserSession();
  }, []);

  const handleSimulatedLogin = (role: 'free' | 'premium' | 'admin') => {
    setLoading(true);
    setErrorMessage('');

    setTimeout(() => {
      if (role === 'free') {
        setUserSession({
          name: 'Piloto Iniciante (Grátis)',
          email: 'iniciante@ecrdrones.com.br',
          role: 'free',
        });
      } else if (role === 'premium') {
        setUserSession({
          name: 'Marcos Rezende (Premium)',
          email: 'marcos.rezende@agro.com.br',
          role: 'premium',
        });
      } else if (role === 'admin') {
        setUserSession({
          name: 'Rômulo Nascimento (Admin)',
          email: 'romulo@ecrdrones.com.br',
          role: 'admin',
        });
      }
      router.push('/dashboard');
    }, 800);
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);
    // Simula login de formulário como Premium por padrão para manter a dinâmica funcional
    setTimeout(() => {
      setUserSession({
        name: 'Aluno Matriculado',
        email: email,
        role: 'premium',
      });
      router.push('/dashboard');
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-black text-white relative flex items-center justify-center p-4 overflow-hidden select-none">
      
      {/* ── GRID DE FUNDO TELEMÉTRICO ── */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-25" 
        style={{
          backgroundImage: `
            linear-gradient(rgba(46, 125, 50, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(46, 125, 50, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '45px 45px',
        }} 
        aria-hidden="true"
      />

      {/* ── GLOWS DE RADAR HUD ── */}
      <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] bg-[radial-gradient(ellipse,rgba(46,125,50,0.06)_0%,transparent_70%)] pointer-events-none z-0" aria-hidden="true" />
      <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] bg-[radial-gradient(ellipse,rgba(245,127,23,0.04)_0%,transparent_70%)] pointer-events-none z-0" aria-hidden="true" />

      {/* ── TELEMETRIA AÉREA DE DECORAÇÃO ── */}
      <div className="absolute inset-0 pointer-events-none opacity-20 z-0 flex items-center justify-center">
        <svg width="90%" height="90%" viewBox="0 0 1000 600" className="w-full h-full max-w-5xl">
          <circle cx="500" cy="300" r="280" stroke="#2E7D32" strokeWidth="0.5" strokeDasharray="5 5" fill="none" />
          <circle cx="500" cy="300" r="180" stroke="#2E7D32" strokeWidth="0.5" fill="none" />
          <circle cx="500" cy="300" r="80" stroke="#F57F17" strokeWidth="0.5" strokeDasharray="3 3" fill="none" />
          <path d="M150 300 H850 M500 50 V550" stroke="#2E7D32" strokeWidth="0.3" />
          {/* Marcadores de Ângulo de Voo */}
          <path d="M480 150 H520 M480 450 H520 M490 200 H510 M490 400 H510" stroke="#2E7D32" strokeWidth="1" />
          <text x="530" y="154" fill="#2E7D32" className="text-[10px] font-mono">ALT 45M</text>
          <text x="530" y="454" fill="#2E7D32" className="text-[10px] font-mono">ALT -45M</text>
        </svg>
      </div>

      {/* ── PAINEL CENTRAL DE AUTENTICAÇÃO (GLASSMORPHISM) ── */}
      <div className="relative z-10 w-full max-w-4xl grid md:grid-cols-12 gap-8 items-stretch">
        
        {/* LADO ESQUERDO: APRESENTAÇÃO OPERACIONAL */}
        <div className="md:col-span-5 bg-zinc-950/75 border border-zinc-800/80 backdrop-blur-xl p-8 rounded-2xl flex flex-col justify-between relative overflow-hidden group">
          {/* Cantoneiras HUD */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-brand-green" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-zinc-800" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-zinc-800" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-brand-amber" />

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <ECRDronesLogo version={5} size={38} />
              <div className="h-6 w-px bg-zinc-800" />
              <span className="text-xs font-mono text-brand-green tracking-widest uppercase">SYS: ACTIVE</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold font-heading text-white tracking-tight">
                Plataforma de <br />
                <span className="text-brand-amber">Capacitação Rural</span>
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Bem-vindo ao centro de telemetria operacional da ECR Drones. Faça o login para simular acessos a cursos, lives e fórum dinâmico.
              </p>
            </div>
          </div>

          {/* Dados operacionais úteis para simulação no campo */}
          <div className="mt-8 space-y-4 border-t border-zinc-900 pt-6">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-zinc-500">CONEXÃO:</span>
              <span className="text-brand-green">100% LOCAL (ESTÁTICA)</span>
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-zinc-500">SESSÃO:</span>
              <span className="text-brand-amber">LOCALSTORAGE PERSISTIDO</span>
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-zinc-500">MOCK SUPABASE:</span>
              <span className="text-zinc-400">DESATIVADO (MVP MODE)</span>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-[10px] text-zinc-500 font-mono text-center">
              ECR DRONES © {new Date().getFullYear()} • Versão 2.1
            </p>
          </div>
        </div>

        {/* LADO DIREITO: FORMULÁRIO E BOTOES DE MOCK */}
        <div className="md:col-span-7 bg-zinc-950/85 border border-brand-green/30 shadow-[0_0_35px_rgba(46,125,50,0.06)] backdrop-blur-xl p-8 rounded-2xl flex flex-col justify-between relative">
          
          {/* Cantoneiras HUD */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-brand-green" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-brand-green" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-brand-green" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-brand-green" />

          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-xl font-bold font-heading text-white">Central de Acesso</h3>
              <p className="text-xs text-zinc-400">Entre na sua conta ou use os atalhos de simulação comerciais.</p>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-950/35 border border-red-900/50 rounded-lg text-xs text-red-400 font-mono">
                {errorMessage}
              </div>
            )}

            {/* SEÇÃO DE LOGIN RÁPIDO (COMERCIAL) */}
            <div className="space-y-3 bg-zinc-900/40 border border-zinc-800/80 p-4 rounded-xl relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-brand-amber font-semibold tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-brand-amber animate-pulse" />
                  ATALHOS DE SIMULAÇÃO (COMERCIAL)
                </span>
                <span className="text-[9px] font-mono text-zinc-500">DICA: USE PARA MOSTRAR AO CLIENTE</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                
                {/* BOTÃO GRÁTIS */}
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleSimulatedLogin('free')}
                  className="bg-zinc-950/80 hover:bg-zinc-900 border border-zinc-800 hover:border-brand-green/60 p-3 rounded-lg text-center transition-all duration-300 group cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-zinc-900 flex items-center justify-center mx-auto mb-2 text-zinc-400 group-hover:text-brand-green transition-colors">
                    <User className="w-4 h-4" />
                  </div>
                  <p className="text-[11px] font-bold text-white mb-0.5">Gratuito</p>
                  <span className="text-[8px] font-mono text-zinc-500 group-hover:text-brand-green/75">Role: Free</span>
                </button>

                {/* BOTÃO PREMIUM */}
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleSimulatedLogin('premium')}
                  className="bg-brand-amber/5 hover:bg-brand-amber/10 border border-brand-amber/20 hover:border-brand-amber/70 p-3 rounded-lg text-center transition-all duration-300 group cursor-pointer shadow-[0_0_15px_rgba(245,127,23,0.03)]"
                >
                  <div className="w-7 h-7 rounded-full bg-brand-amber/10 flex items-center justify-center mx-auto mb-2 text-brand-amber group-hover:scale-105 transition-all">
                    <Award className="w-4 h-4" />
                  </div>
                  <p className="text-[11px] font-bold text-brand-amber mb-0.5">Premium</p>
                  <span className="text-[8px] font-mono text-brand-amber/70">Completo</span>
                </button>

                {/* BOTÃO ADMIN */}
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleSimulatedLogin('admin')}
                  className="bg-zinc-950/80 hover:bg-zinc-900 border border-zinc-800 hover:border-brand-blue-sky/60 p-3 rounded-lg text-center transition-all duration-300 group cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-zinc-900 flex items-center justify-center mx-auto mb-2 text-zinc-400 group-hover:text-brand-blue-sky transition-colors">
                    <Shield className="w-4 h-4" />
                  </div>
                  <p className="text-[11px] font-bold text-white mb-0.5">Admin</p>
                  <span className="text-[8px] font-mono text-zinc-500 group-hover:text-brand-blue-sky/75">Gerencial</span>
                </button>

              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-900"></div>
              </div>
              <span className="relative bg-zinc-950 px-3 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                Ou credenciais manuais
              </span>
            </div>

            {/* FORMULÁRIO MANUAL */}
            <form onSubmit={handleManualLogin} className="space-y-4">
              
              {/* CAMPO DE E-MAIL */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-zinc-400 tracking-wider uppercase block">
                  E-mail do Operador
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    disabled={loading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="exemplo@agro.com.br"
                    className="w-full bg-zinc-900/60 border border-zinc-800/80 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-brand-green/80 focus:ring-1 focus:ring-brand-green/80 transition-all font-mono"
                  />
                </div>
              </div>

              {/* CAMPO DE SENHA */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-mono text-zinc-400 tracking-wider uppercase block">
                    Senha de Prescrição
                  </label>
                  <span className="text-[10px] text-zinc-500 font-mono hover:text-brand-amber transition-colors cursor-pointer">
                    Esqueceu a chave?
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    disabled={loading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-zinc-900/60 border border-zinc-800/80 rounded-lg pl-10 pr-10 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-brand-green/80 focus:ring-1 focus:ring-brand-green/80 transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* BOTÃO ENTRAR */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-green hover:bg-brand-green-dark border border-brand-green/40 hover:border-brand-green/80 text-white font-bold text-sm py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer shadow-[0_0_20px_rgba(46,125,50,0.12)] disabled:opacity-50"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Autenticar Equipamento
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>

          </div>

          <div className="mt-8 text-center">
            <span className="text-[10px] text-zinc-500 font-mono">
              Não possui chave de acesso?{' '}
              <span className="text-brand-green hover:underline cursor-pointer" onClick={() => handleSimulatedLogin('free')}>
                Comece gratuitamente
              </span>
            </span>
          </div>

        </div>

      </div>

    </main>
  );
}
