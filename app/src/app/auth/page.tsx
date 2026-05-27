"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ECRDronesLogo from '@/components/ECRDronesLogo';
import { setUserSession, getUserSession } from '@/lib/mockAuth';
import { Shield, Sparkles, User, Award, Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Verifica se já tem sessão ativa — redireciona para o dashboard
  useEffect(() => {
    const existingSession = getUserSession();
    if (existingSession) {
      router.replace('/dashboard');
    }
  }, [router]);

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
    <main className="min-h-screen bg-[#F8F9FA] text-zinc-950 relative flex items-center justify-center p-4 overflow-hidden select-none font-sans">
      
      {/* ── GRID DE FUNDO TELEMÉTRICO CLARO ── */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.03]" 
        style={{
          backgroundImage: `
            linear-gradient(rgba(46, 125, 50, 0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(46, 125, 50, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '45px 45px',
        }} 
        aria-hidden="true"
      />

      {/* ── GLOWS SUPER SUAVES ── */}
      <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] bg-[radial-gradient(ellipse,rgba(46,125,50,0.03)_0%,transparent_70%)] pointer-events-none z-0" aria-hidden="true" />
      <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] bg-[radial-gradient(ellipse,rgba(245,127,23,0.02)_0%,transparent_70%)] pointer-events-none z-0" aria-hidden="true" />

      {/* ── TELEMETRIA AÉREA DE DECORAÇÃO SUAVE ── */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] z-0 flex items-center justify-center">
        <svg width="90%" height="90%" viewBox="0 0 1000 600" className="w-full h-full max-w-5xl">
          <circle cx="500" cy="300" r="280" stroke="#2E7D32" strokeWidth="1" strokeDasharray="5 5" fill="none" />
          <circle cx="500" cy="300" r="180" stroke="#2E7D32" strokeWidth="1" fill="none" />
          <circle cx="500" cy="300" r="80" stroke="#F57F17" strokeWidth="1" strokeDasharray="3 3" fill="none" />
          <path d="M150 300 H850 M500 50 V550" stroke="#2E7D32" strokeWidth="0.5" />
          <path d="M480 150 H520 M480 450 H520 M490 200 H510 M490 400 H510" stroke="#2E7D32" strokeWidth="1" />
          <text x="530" y="154" fill="#2E7D32" className="text-xs font-mono font-bold">ALT 45M</text>
          <text x="530" y="454" fill="#2E7D32" className="text-xs font-mono font-bold">ALT -45M</text>
        </svg>
      </div>

      {/* ── PAINEL CENTRAL DE AUTENTICAÇÃO CLEAN ── */}
      <div className="relative z-10 w-full max-w-4xl grid md:grid-cols-12 gap-8 items-stretch">
        
        {/* LADO ESQUERDO: APRESENTAÇÃO OPERACIONAL */}
        <div className="md:col-span-5 bg-white border border-zinc-200/80 shadow-sm p-8 rounded-2xl flex flex-col justify-between relative overflow-hidden group">
          {/* Cantoneiras HUD */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-brand-green" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-brand-amber" />

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <ECRDronesLogo version={5} size={38} />
              <div className="h-6 w-px bg-zinc-200" />
              <span className="text-xs font-mono text-brand-green tracking-widest uppercase font-bold">SYS: ACTIVE</span>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-bold font-heading text-zinc-900 tracking-tight leading-tight">
                Plataforma de <br />
                <span className="text-brand-green">Capacitação Rural</span>
              </h2>
              <p className="text-sm text-zinc-600 leading-relaxed font-sans">
                Bem-vindo ao portal operacional da ECR Drones. Entre para simular seus treinamentos técnicos, mentorias ao vivo e participar do fórum de caldas com instrutores e pilotos.
              </p>
            </div>
          </div>

          {/* Dados operacionais úteis para simulação no campo */}
          <div className="mt-8 space-y-4 border-t border-zinc-150 pt-6">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-400 font-medium">CONEXÃO:</span>
              <span className="text-brand-green font-bold">100% LOCAL (ESTÁTICA)</span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-400 font-medium">SESSÃO:</span>
              <span className="text-brand-amber font-bold">LOCALSTORAGE PERSISTIDO</span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-400 font-medium">MOCK SUPABASE:</span>
              <span className="text-zinc-500 font-bold">DESATIVADO (MVP)</span>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-xs text-zinc-400 font-mono text-center">
              ECR DRONES © {new Date().getFullYear()} • Versão 2.1
            </p>
          </div>
        </div>

        {/* LADO DIREITO: FORMULÁRIO E BOTOES DE MOCK */}
        <div className="md:col-span-7 bg-white border border-zinc-200/80 shadow-[0_4px_25px_rgba(46,125,50,0.04)] p-8 rounded-2xl flex flex-col justify-between relative">
          
          {/* Cantoneiras HUD */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-brand-green" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-brand-green" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-brand-green" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-brand-green" />

          <div className="space-y-6">
            <div className="space-y-1.5">
              <h3 className="text-xl font-bold font-heading text-zinc-900">Central de Acesso</h3>
              <p className="text-sm text-zinc-500">Acesse sua conta de operador ou use um atalho rápido comercial.</p>
            </div>

            {errorMessage && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-650 font-mono font-medium">
                ⚠️ {errorMessage}
              </div>
            )}

            {/* SEÇÃO DE LOGIN RÁPIDO (COMERCIAL) */}
            <div className="space-y-3 bg-zinc-50 border border-zinc-200 p-4 rounded-xl relative">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                <span className="text-[10px] font-mono text-brand-green font-bold tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-brand-green animate-pulse" />
                  ATALHOS DE SIMULAÇÃO COMERCIAL
                </span>
                <span className="text-[9px] font-mono text-zinc-400 font-medium">IDEAL PARA DEMONSTRAÇÕES</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                
                {/* BOTÃO GRÁTIS */}
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleSimulatedLogin('free')}
                  className="bg-white hover:bg-zinc-50 border border-zinc-200 hover:border-brand-green/60 p-3 rounded-lg text-center transition-all duration-300 group cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-zinc-100 flex items-center justify-center mx-auto mb-2 text-zinc-500 group-hover:bg-brand-green/10 group-hover:text-brand-green transition-colors">
                    <User className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-bold text-zinc-800 mb-0.5">Gratuito</p>
                  <span className="text-[9px] font-mono text-zinc-400 group-hover:text-brand-green font-semibold">Grátis</span>
                </button>

                {/* BOTÃO PREMIUM */}
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleSimulatedLogin('premium')}
                  className="bg-amber-50/40 hover:bg-amber-50 border border-brand-amber/20 hover:border-brand-amber/60 p-3 rounded-lg text-center transition-all duration-300 group cursor-pointer shadow-sm"
                >
                  <div className="w-7 h-7 rounded-full bg-amber-50 border border-brand-amber/20 flex items-center justify-center mx-auto mb-2 text-brand-amber group-hover:scale-105 transition-all">
                    <Award className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-bold text-brand-amber mb-0.5">Premium</p>
                  <span className="text-[9px] font-mono text-brand-amber/80 font-bold">Completo</span>
                </button>

                {/* BOTÃO ADMIN */}
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleSimulatedLogin('admin')}
                  className="bg-white hover:bg-zinc-50 border border-zinc-200 hover:border-brand-blue-sky/60 p-3 rounded-lg text-center transition-all duration-300 group cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-zinc-100 flex items-center justify-center mx-auto mb-2 text-zinc-500 group-hover:bg-brand-blue-sky/10 group-hover:text-brand-blue-sky transition-colors">
                    <Shield className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-bold text-zinc-800 mb-0.5">Admin</p>
                  <span className="text-[9px] font-mono text-zinc-400 group-hover:text-brand-blue-sky font-semibold">Gerencial</span>
                </button>

              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-200"></div>
              </div>
              <span className="relative bg-white px-3 text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                Ou credenciais manuais
              </span>
            </div>

            {/* FORMULÁRIO MANUAL */}
            <form onSubmit={handleManualLogin} className="space-y-4">
              
              {/* CAMPO DE E-MAIL */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-zinc-550 font-bold tracking-wider uppercase block">
                  E-mail do Operador
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    disabled={loading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="exemplo@agro.com.br"
                    className="w-full bg-white border border-zinc-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all"
                  />
                </div>
              </div>

              {/* CAMPO DE SENHA */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-mono text-zinc-550 font-bold tracking-wider uppercase block">
                    Senha de Voo
                  </label>
                  <span className="text-xs text-brand-green font-semibold hover:underline cursor-pointer">
                    Esqueceu a chave?
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    disabled={loading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white border border-zinc-200 rounded-lg pl-10 pr-10 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-650 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* BOTÃO ENTRAR */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-green hover:bg-brand-green/90 border border-brand-green/10 text-white font-extrabold text-sm py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer shadow-sm disabled:opacity-50"
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
            <span className="text-xs text-zinc-500 font-mono">
              Não possui chave de acesso?{' '}
              <span className="text-brand-green font-bold hover:underline cursor-pointer" onClick={() => handleSimulatedLogin('free')}>
                Comece gratuitamente
              </span>
            </span>
          </div>

        </div>

      </div>

    </main>
  );
}
