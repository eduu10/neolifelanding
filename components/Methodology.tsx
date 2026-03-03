'use client';

import { motion } from 'motion/react';
import { Scan, CalendarCheck, Activity } from 'lucide-react';

const steps = [
  {
    icon: Scan,
    title: 'Planejamento Digital',
    description: 'Antes da sua viagem, realizamos uma análise completa através de exames digitais enviados remotamente. O plano de tratamento é estruturado com precisão milimétrica.',
  },
  {
    icon: CalendarCheck,
    title: 'Execução Otimizada',
    description: 'Cronograma ajustado à sua estadia no Brasil. Procedimentos concentrados para maximizar seu tempo, sem comprometer a excelência clínica.',
  },
  {
    icon: Activity,
    title: 'Acompanhamento Remoto',
    description: 'Após o retorno aos EUA, mantemos monitoramento contínuo através de telemedicina e parcerias locais para manutenção e garantia de longo prazo.',
  },
];

export default function Methodology() {
  return (
    <section id="metodo" className="py-24 bg-white text-gray-600 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl mb-6 text-neolife-teal font-bold">Método Estruturado</h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg font-light font-body">
            Desenvolvemos um protocolo exclusivo para quem não pode perder tempo, garantindo previsibilidade do início ao fim.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neolife-teal/30 to-transparent z-0" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="relative z-10 flex flex-col items-center text-center group"
            >
              <div className="w-24 h-24 rounded-full bg-white border-2 border-neolife-teal flex items-center justify-center mb-8 group-hover:bg-neolife-teal transition-all duration-300 shadow-lg shadow-neolife-teal/10">
                <step.icon className="w-10 h-10 text-neolife-teal group-hover:text-white transition-colors" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 font-heading">{step.title}</h3>
              <p className="text-gray-500 leading-relaxed text-sm max-w-xs font-body">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
