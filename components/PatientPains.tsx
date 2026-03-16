'use client';

import { motion } from 'motion/react';
import { Frown, Clock, ShieldAlert, Sparkles } from 'lucide-react';

const pains = [
  {
    icon: Frown,
    text: 'Mora fora do Brasil e não confia em fazer tratamento odontológico onde vive?',
  },
  {
    icon: Clock,
    text: 'Tem pouco tempo quando visita o Brasil e precisa resolver tudo de forma organizada?',
  },
  {
    icon: ShieldAlert,
    text: 'Tem receio de iniciar um tratamento à distância sem saber exatamente o resultado?',
  },
  {
    icon: Sparkles,
    text: 'Quer um sorriso natural e duradouro, com planejamento feito antes mesmo da viagem?',
  },
];

export default function PatientPains() {
  return (
    <section className="py-24 bg-gray-50 text-gray-600 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl mb-6 text-neolife-teal font-bold">Você Se Identifica?</h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg font-light font-body">
            Se alguma dessas situações faz parte da sua realidade, a Neolife foi pensada exatamente para você.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {pains.map((pain, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="flex items-center gap-5 p-6 rounded-2xl bg-white border border-gray-100 shadow-lg shadow-gray-200/50"
            >
              <div className="p-3 rounded-xl bg-amber-600/10 text-amber-600 shrink-0">
                <pain.icon className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <p className="text-gray-700 font-body text-sm leading-relaxed">{pain.text}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="https://wa.me/553132214335?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20avalia%C3%A7%C3%A3o"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 bg-neolife-teal text-white rounded-full font-bold hover:bg-teal-700 transition-colors duration-300 shadow-lg shadow-neolife-teal/20 font-heading"
          >
            Fale com a Neolife Agora
          </a>
        </div>
      </div>
    </section>
  );
}
