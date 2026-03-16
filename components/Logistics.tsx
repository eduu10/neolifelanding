'use client';

import { motion } from 'motion/react';
import { Plane, Calendar, ShieldCheck, Clock } from 'lucide-react';

const benefits = [
  {
    icon: Plane,
    title: 'Suporte na Organização da Viagem',
    description: 'Orientamos sobre a melhor época para vir, tempo de estadia necessário e logística, para que você aproveite ao máximo cada dia em BH.',
  },
  {
    icon: Calendar,
    title: 'Cronograma Concentrado',
    description: 'Seus procedimentos são organizados de forma inteligente, respeitando tempos biológicos e otimizando sua agenda durante a estadia.',
  },
  {
    icon: ShieldCheck,
    title: 'Garantia Conforme Contrato',
    description: 'Todos os tratamentos possuem garantia formalizada em contrato, com termos claros e transparentes sobre prazos e coberturas.',
  },
  {
    icon: Clock,
    title: 'Tecnologia Digital Integrada',
    description: 'Escaneamento intraoral, planejamento 3D e fluxo digital completo para reduzir tempo de cadeira e entregar resultados previsíveis.',
  },
];

export default function Logistics() {
  return (
    <section id="logistica" className="py-24 bg-gray-50 text-gray-600 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl mb-6 text-neolife-teal font-bold">Por Que Pacientes nos EUA Nos Escolhem</h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg font-light font-body">
            Sabemos o quanto é difícil encontrar um tratamento odontológico de confiança morando fora. Nosso protocolo foi desenhado para eliminar incertezas e oferecer segurança em cada etapa.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="flex items-start gap-6 p-8 rounded-2xl bg-white border border-gray-100 shadow-lg shadow-gray-200/50 hover:border-neolife-teal/30 transition-colors group"
            >
              <div className="p-4 rounded-xl bg-neolife-teal/10 text-neolife-teal group-hover:bg-neolife-teal group-hover:text-white transition-colors">
                <benefit.icon className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2 font-heading">{benefit.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm font-body">
                  {benefit.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
