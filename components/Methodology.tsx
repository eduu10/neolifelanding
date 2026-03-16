'use client';

import { motion } from 'motion/react';
import { MessageCircle, Scan, Plane, CalendarCheck, Activity } from 'lucide-react';

const steps = [
  {
    icon: MessageCircle,
    title: '1. Avaliação Inicial Online',
    description: 'Você entra em contato pelo WhatsApp, envia seus exames e fotos. Nossa equipe faz uma análise preliminar do seu caso à distância.',
  },
  {
    icon: Scan,
    title: '2. Planejamento Digital',
    description: 'Com base nos seus exames, criamos um plano de tratamento personalizado com simulação digital e escaneamento 3D. Essa etapa é imprescindível para garantir previsibilidade.',
  },
  {
    icon: Plane,
    title: '3. Organização da Viagem',
    description: 'Ajudamos a organizar sua estadia no Brasil: tempo necessário, cronograma de consultas e logística para que você aproveite cada dia.',
  },
  {
    icon: CalendarCheck,
    title: '4. Execução na Clínica',
    description: 'Durante sua estadia em BH, os procedimentos são realizados de forma concentrada com tecnologia de ponta, respeitando tempos biológicos.',
  },
  {
    icon: Activity,
    title: '5. Acompanhamento Online',
    description: 'Após o retorno, mantemos seu acompanhamento por teleconsulta. Sem suporte presencial nos EUA — tudo online, com segurança e continuidade.',
  },
];

export default function Methodology() {
  return (
    <section id="metodo" className="py-24 bg-white text-gray-600 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl mb-6 text-neolife-teal font-bold">Como Funciona Para Quem Mora Fora</h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg font-light font-body">
            Do primeiro contato ao acompanhamento pós-tratamento — tudo pensado para quem vive no exterior e quer realizar o tratamento no Brasil com segurança e previsibilidade.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-8 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neolife-teal/30 to-transparent z-0" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              className="relative z-10 flex flex-col items-center text-center group"
            >
              <div className="w-20 h-20 rounded-full bg-white border-2 border-neolife-teal flex items-center justify-center mb-6 group-hover:bg-neolife-teal transition-all duration-300 shadow-lg shadow-neolife-teal/10">
                <step.icon className="w-8 h-8 text-neolife-teal group-hover:text-white transition-colors" strokeWidth={1.5} />
              </div>
              <h3 className="text-base font-bold text-gray-800 mb-3 font-heading">{step.title}</h3>
              <p className="text-gray-500 leading-relaxed text-xs max-w-[200px] font-body">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-14">
          <a
            href="https://wa.me/553132214335?text=Ol%C3%A1%2C%20gostaria%20de%20saber%20como%20funciona%20o%20tratamento"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 bg-neolife-teal text-white rounded-full font-bold hover:bg-teal-700 transition-colors duration-300 shadow-lg shadow-neolife-teal/20 font-heading"
          >
            Iniciar Minha Avaliação Online
          </a>
        </div>
      </div>
    </section>
  );
}
