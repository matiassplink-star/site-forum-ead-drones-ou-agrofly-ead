"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ECRDronesLogo from '@/components/ECRDronesLogo';
import { setUserSession, getUserSession } from '@/lib/mockAuth';
import { Sparkles, Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react';

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
    // Simula login de formulário como Premium por padrão
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

      {/* ── PAINEL CENTRAL DE AUTENTICAÇÃO CLEAN ── */}
      <div className="relative z-10 w-full max-w-[460px] bg-white border border-zinc-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-8 sm:p-10 rounded-2xl flex flex-col justify-between">
        
        {/* Cantoneiras HUD */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-brand-green/30" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-brand-green/30" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-brand-green/30" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-brand-green/30" />

        <div className="space-y-6">
          
          {/* Logo e cabeçalho principal */}
          <div className="flex flex-col items-center text-center space-y-4 mb-2">
            <ECRDronesLogo version={3} size={36} showTagline={false} />
            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-zinc-900 tracking-tight">Central de Acesso</h3>
              <p className="text-xs text-zinc-500 font-medium">Entre na sua conta para acessar as aulas e o fórum</p>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-650 font-mono font-medium">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* FORMULÁRIO MANUAL */}
          <form onSubmit={handleManualLogin} className="space-y-4">
            
            {/* CAMPO DE E-MAIL */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-zinc-500 font-bold tracking-wider uppercase block">
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
                <label className="text-[10px] font-mono text-zinc-500 font-bold tracking-wider uppercase block">
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

          {/* ── BOTÕES DE LOGIN SOCIAL ── */}
          <div className="space-y-3 pt-2">
            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-zinc-250"></div>
              <span className="relative bg-white px-3 text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                Ou acesse com
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* BOTÃO GOOGLE */}
              <button
                type="button"
                onClick={() => {
                  setLoading(true);
                  setTimeout(() => {
                    setUserSession({
                      name: 'Operador Google (Premium)',
                      email: 'google.user@ecrdrones.com.br',
                      role: 'premium',
                    });
                    router.push('/dashboard');
                  }, 1200);
                }}
                className="bg-white hover:bg-zinc-50 border border-zinc-200 hover:border-zinc-300 py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 text-xs font-bold text-zinc-700 transition-all duration-200 cursor-pointer shadow-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
                Google
              </button>

              {/* BOTÃO FACEBOOK */}
              <button
                type="button"
                onClick={() => {
                  setLoading(true);
                  setTimeout(() => {
                    setUserSession({
                      name: 'Operador Facebook (Premium)',
                      email: 'facebook.user@ecrdrones.com.br',
                      role: 'premium',
                    });
                    router.push('/dashboard');
                  }, 1200);
                }}
                className="bg-[#1877F2] hover:bg-[#166FE5] border border-transparent py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 text-xs font-bold text-white transition-all duration-200 cursor-pointer shadow-sm"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </button>
            </div>
          </div>

          {/* ── ATALHOS DE SIMULAÇÃO DISCRETOS ── */}
          <details className="group border border-zinc-150 rounded-xl overflow-hidden bg-zinc-50 transition-all duration-300">
            <summary className="list-none flex items-center justify-between p-3 text-xs font-mono font-bold text-zinc-500 cursor-pointer hover:bg-zinc-100 select-none">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-green animate-pulse" />
                ATALHOS RÁPIDOS DE TESTE
              </span>
              <span className="transition-transform duration-300 group-open:rotate-180 text-[10px]">▼</span>
            </summary>
            <div className="p-3 border-t border-zinc-150 bg-white grid grid-cols-3 gap-2">
              <button
                type="button"
                disabled={loading}
                onClick={() => handleSimulatedLogin('free')}
                className="bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 p-2 rounded-lg text-center transition-all duration-200 cursor-pointer"
              >
                <p className="text-[10px] font-extrabold text-zinc-700 mb-0.5">Gratuito</p>
                <span className="text-[9px] font-mono text-zinc-400 block">Grátis</span>
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => handleSimulatedLogin('premium')}
                className="bg-amber-50/50 hover:bg-amber-50 border border-brand-amber/20 p-2 rounded-lg text-center transition-all duration-200 cursor-pointer"
              >
                <p className="text-[10px] font-extrabold text-brand-amber mb-0.5">Premium</p>
                <span className="text-[9px] font-mono text-brand-amber/85 block">Completo</span>
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => handleSimulatedLogin('admin')}
                className="bg-blue-50/50 hover:bg-blue-50 border border-brand-blue-sky/20 p-2 rounded-lg text-center transition-all duration-200 cursor-pointer"
              >
                <p className="text-[10px] font-extrabold text-brand-blue-sky mb-0.5">Admin</p>
                <span className="text-[9px] font-mono text-zinc-400 block">Gerencial</span>
              </button>
            </div>
          </details>

        </div>

        <div className="mt-8 text-center border-t border-zinc-100 pt-6">
          <span className="text-xs text-zinc-500 font-mono">
            Não possui chave de acesso?{' '}
            <span className="text-brand-green font-bold hover:underline cursor-pointer" onClick={() => handleSimulatedLogin('free')}>
              Comece gratuitamente
            </span>
          </span>
        </div>

      </div>

    </main>
  );
}
