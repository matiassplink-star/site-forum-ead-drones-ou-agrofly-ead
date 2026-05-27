"use client";

import React from 'react';
import { COMPARATIVE_INDICATORS } from '@/data/constants';

export default function Solution() {
  return (
    <section id="solucao" className="py-20 px-6 bg-brand-black border-t border-brand-green/10">
      <div className="max-w-6xl mx-auto">
        
        {/* Cabeçalho de Seção */}
        <div className="text-center mb-16">
          <span className="text-brand-blue-sky font-extrabold text-xs uppercase tracking-widest">Tecnologia de Precisão Flutuante</span>
          <h2 className="font-heading text-3xl md:text-5xl font-black mt-2 mb-4 text-white">A Física a Favor da Sua Lavoura</h2>
          <p className="text-brand-gray max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            A pulverização com drone de alta capacidade não é apenas inovação — é uma ferramenta de otimização financeira e agronômica de ponta.
          </p>
        </div>

        {/* Detalhe Técnico e Equipamento */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          
          {/* Detalhe do Efeito Vortex */}
          <div className="bg-brand-forest/10 border border-brand-green/20 rounded-2xl p-6 md:p-10 flex flex-col justify-between">
            <div>
              <div 
                className="inline-block bg-brand-blue-sky/20 text-brand-blue-sky font-bold text-[10px] uppercase px-3 py-1 rounded mb-4 tracking-wider"
                role="status"
              >
                Efeito Vortex (Downwash)
              </div>
              <h3 className="font-heading text-2xl font-black text-white mb-4">
                A física gerando penetração foliar
              </h3>
              <p className="text-sm text-brand-gray leading-relaxed mb-6 font-sans">
                O <strong className="text-white font-semibold">Efeito Vortex</strong>, também conhecido como <strong className="text-white font-semibold">Downwash</strong>, é o forte fluxo de ar descendente gerado pelas potentes hélices do drone durante o voo. Esse movimento físico empurra as gotas de calda para dentro da massa foliar, ajudando a aplicação a alcançar a planta de forma tridimensional e abrangente.
              </p>

              <div className="grid grid-cols-2 gap-4 text-xs border-y border-white/5 py-4 my-6 font-sans">
                <div>
                  <div className="font-bold text-brand-amber mb-1">Trator Convencional</div>
                  <div className="text-brand-gray">Cobertura mais superficial, com maior concentração e acúmulo no topo das plantas.</div>
                </div>
                <div>
                  <div className="font-bold text-brand-green mb-1">ECR DRONES Downwash</div>
                  <div className="text-brand-gray">Penetração profunda até o baixeiro, onde muitas pragas e doenças se escondem e proliferam.</div>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-brand-gray/80 italic font-sans">
              * Distribuição uniforme, com melhor aproveitamento da calda e menor desperdício. Gotas calibradas sob prescrição técnica agronômica.
            </p>
          </div>

          {/* Equipamentos: XAG P100PRO */}
          <div className="bg-brand-forest/10 border border-brand-green/20 rounded-2xl p-6 md:p-10 flex flex-col justify-between min-h-[380px]">
            <div>
              <div 
                className="inline-block bg-brand-amber/20 text-brand-amber font-bold text-[10px] uppercase px-3 py-1 rounded mb-4 tracking-wider"
                role="status"
              >
                Equipamentos Premium
              </div>
              <h3 className="font-heading text-2xl font-black text-white mb-4">
                Drone Agrícola XAG P100PRO
              </h3>
              <p className="text-sm text-brand-gray leading-relaxed mb-6 font-sans">
                A <strong className="text-white font-semibold">ECR DRONES</strong> opera com dois drones agrícolas <strong className="text-white font-semibold">XAG P100PRO</strong>, equipamentos de alta performance com tanque de <strong className="text-white font-semibold">52 litros</strong> (50kg). Em condições reais de campo, entregam rendimento espetacular de forma ágil, cobrindo com precisão mesmo em janelas curtas.
              </p>
            </div>

            <div className="flex flex-col gap-3 text-xs bg-brand-black/50 p-4 rounded-xl font-sans">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-brand-gray">Capacidade de Carga:</span>
                <span className="font-bold text-white">52 Litros / 50 kg</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-brand-gray">Rendimento Operacional:</span>
                <span className="font-bold text-brand-green">10 a 30 hectares por hora</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-brand-gray">Economia de Calda:</span>
                <span className="font-bold text-brand-blue-sky">10 a 15 Litros por Hectare</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-gray">Precisão Geográfica:</span>
                <span className="font-bold text-brand-amber">Voo Autônomo com sinal RTK centimétrico</span>
              </div>
            </div>
          </div>

        </div>

        {/* Tabela de Comparação Direta Acessível */}
        <div className="mt-16 overflow-x-auto border border-brand-green/20 rounded-xl bg-brand-black">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <caption className="sr-only">
              Tabela comparativa de indicadores operacionais entre a pulverização convencional tratorizada e a pulverização aérea tecnológica da ECR Drones.
            </caption>
            <thead>
              <tr className="bg-brand-forest/20 border-b border-brand-green/20 text-brand-green font-black uppercase text-[10px] tracking-wider">
                <th scope="col" className="p-4">Indicador</th>
                <th scope="col" className="p-4">Pulverização Convencional (Trator)</th>
                <th scope="col" className="p-4 text-brand-amber font-black">ECR DRONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-brand-gray font-sans">
              {COMPARATIVE_INDICATORS.map((row, idx) => (
                <tr key={idx} className="hover:bg-brand-forest/5 transition-all">
                  <th scope="row" className="p-4 font-bold text-white text-left font-heading">
                    {row.indicator}
                  </th>
                  <td className="p-4">
                    {row.conventional}
                  </td>
                  <td className="p-4 text-brand-green font-bold">
                    {row.ecr}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </section>
  );
}
