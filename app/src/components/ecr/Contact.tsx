"use client";

import React, { useState, useEffect } from 'react';
import { Send, CheckCircle2, MessageSquare } from 'lucide-react';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState('');

  // Define a URL de redirecionamento dinamicamente para o FormSubmit retornar à página atual
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setRedirectUrl(window.location.origin + '#contato');
    }
  }, []);

  const handleSubmitPlaceholder = (e: React.FormEvent) => {
    // Se o usuário clicar, permitimos que o formulário HTML envie nativamente para o FormSubmit,
    // mas se for um teste local sem internet ou preferir feedback imediato:
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
    }, 4000);
  };

  return (
    <section id="contato" className="py-20 px-6 bg-white border-t border-zinc-200/80 relative overflow-hidden font-sans">
      
      {/* Luz de fundo suave e limpa */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(46,125,50,0.02)_0%,transparent_70%)] pointer-events-none z-0" 
        aria-hidden="true" 
      />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Cabeçalho */}
        <div className="text-center mb-16 space-y-2">
          <span className="text-brand-green font-extrabold text-xs uppercase tracking-widest block">Solicitação de Proposta</span>
          <h2 className="font-heading text-3xl md:text-5xl font-black text-zinc-900 tracking-tight">Vamos Fechar Essa Parceria?</h2>
          <p className="text-zinc-650 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Fale diretamente com os especialistas da <strong className="text-brand-green font-semibold">ECR DRONES</strong> e receba uma proposta técnica e comercial dimensionada para sua lavoura.
          </p>
        </div>

        {/* Layout de duas colunas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LADO ESQUERDO: CONTATO DIRETO & INFO (5/12 colunas) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            
            <div className="space-y-6">
              {/* Cartão de WhatsApp */}
              <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 relative shadow-sm group">
                <div className="text-3xl mb-2" role="img" aria-label="WhatsApp">💬</div>
                <h4 className="font-heading font-bold text-zinc-950 text-base mb-1">WhatsApp de Plantão</h4>
                <p className="text-xs text-zinc-550 leading-relaxed font-sans mb-3">
                  Precisa de resposta rápida? Fale direto com o nosso gestor e piloto de pulverização.
                </p>
                <a 
                  href="https://wa.me/5534988056752"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-amber font-heading font-black text-xl hover:underline"
                >
                  034 9.8805-6752
                </a>
                <span className="text-[10px] text-zinc-400 block font-mono mt-1">CÉLIO NASCIMENTO — PILOTO RESPONSÁVEL</span>
              </div>

              {/* Cartão de Próximos Passos */}
              <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 shadow-sm">
                <h4 className="font-heading font-bold text-zinc-950 text-sm mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
                  Informações úteis para o orçamento:
                </h4>
                <ul className="space-y-2 text-xs text-zinc-650 leading-relaxed">
                  <li>✔ Tamanho da propriedade em hectares.</li>
                  <li>✔ Tipo de cultura (soja, milho, cana, etc.).</li>
                  <li>✔ Principais pragas ou focos de deriva no solo.</li>
                  <li>✔ Localização aproximada para cálculo de logística.</li>
                </ul>
              </div>
            </div>

            {/* CTA do WhatsApp Rápido */}
            <a 
              href="https://wa.me/5534988056752"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-brand-amber hover:bg-brand-amber/90 text-brand-black font-extrabold text-sm uppercase tracking-wider py-4.5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 text-center"
            >
              <MessageSquare className="w-4 h-4 text-brand-black" />
              Solicitar Orçamento via WhatsApp
            </a>

          </div>

          {/* LADO DIREITO: FORMULÁRIO DE FORM-SUBMIT (7/12 colunas) */}
          <div className="lg:col-span-7 bg-white border border-zinc-200/90 shadow-[0_4px_25px_rgba(46,125,50,0.03)] p-8 rounded-2xl relative">
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-brand-green" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-brand-green" />

            <div className="space-y-4 mb-6">
              <h3 className="text-xl font-bold text-zinc-950">Formulário Técnico de Proposta</h3>
              <p className="text-xs text-zinc-500 leading-relaxed font-sans">
                Preencha os dados abaixo. Eles serão enviados diretamente ao e-mail de atendimento da ECR Drones via <strong className="text-brand-green">FormSubmit</strong>.
              </p>
            </div>

            {submitted && (
              <div className="p-4 bg-emerald-50 border border-brand-green/30 text-brand-green text-xs font-mono rounded-xl mb-4 flex items-center gap-2 animate-scale-up font-bold">
                <CheckCircle2 className="w-5 h-5" />
                DADOS ENVIADOS! AGUARDE A RESPOSTA EM SEU E-MAIL.
              </div>
            )}

            {/* FORMULÁRIO HTML INTEGRADO AO FORMSUBMIT.CO */}
            <form 
              action="https://formsubmit.co/suporte.agencia@gmail.com" 
              method="POST"
              onSubmit={handleSubmitPlaceholder}
              className="space-y-4"
            >
              {/* Configurações do FormSubmit */}
              <input type="hidden" name="_next" value={redirectUrl} />
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_subject" value="Solicitação de Orçamento - ECR Drones" />
              <input type="hidden" name="_template" value="table" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nome */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-500 font-bold uppercase">Nome Completo</label>
                  <input 
                    type="text" 
                    name="name" 
                    required 
                    placeholder="Seu nome"
                    className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all"
                  />
                </div>
                {/* E-mail */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-500 font-bold uppercase">E-mail de Contato</label>
                  <input 
                    type="email" 
                    name="email" 
                    required 
                    placeholder="seuemail@provedor.com"
                    className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Telefone / WhatsApp */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-500 font-bold uppercase">WhatsApp / Telefone</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    required 
                    placeholder="(00) 90000-0000"
                    className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all"
                  />
                </div>
                {/* Tamanho da área e cultura */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-500 font-bold uppercase">Área estimada (Hectares) e Cultura</label>
                  <input 
                    type="text" 
                    name="area_and_crop" 
                    required 
                    placeholder="Ex: 150 ha de soja"
                    className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all"
                  />
                </div>
              </div>

              {/* Mensagem */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-zinc-500 font-bold uppercase">Detalhes da Solicitação</label>
                <textarea 
                  name="message" 
                  rows={4} 
                  required
                  placeholder="Conte-nos detalhes sobre o número de aplicações desejadas, histórico de pragas ou necessidades operacionais..."
                  className="w-full bg-white border border-zinc-200 rounded-lg p-3 text-sm text-zinc-900 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all"
                />
              </div>

              {/* Botão de Envio */}
              <button
                type="submit"
                className="w-full bg-brand-green hover:bg-brand-green/90 text-white font-extrabold text-sm py-3.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                Enviar Proposta Técnica
              </button>

            </form>
          </div>

        </div>

      </div>
    </section>
  );
}
