'use client';

import { motion } from 'motion/react';
import { Plane, Calendar, ShieldCheck, Clock } from 'lucide-react';

const benefits = [
  {
    icon: Plane,
    title: 'Planejamento de Viagem',
    description: 'Ajudamos a organizar sua estadia, desde a escolha do hotel até o transporte, garantindo conforto e segurança.',
  },
  {
    icon: Calendar,
    title: 'Cronograma Otimizado',
    description: 'Agendamos todos os procedimentos de forma concentrada, respeitando o tempo de cicatrização e sua disponibilidade.',
  },
  {
    icon: ShieldCheck,
    title: 'Garantia Contratual',
    description: 'Oferecemos garantia estendida para todos os tratamentos, com suporte local nos EUA em casos de urgência.',
  },
  {
    icon: Clock,
    title: 'Agilidade e Precisão',
    description: 'Utilizamos tecnologia digital para reduzir o tempo de cadeira e aumentar a previsibilidade dos resultados.',
  },
];

export default function Logistics() {
  return (
    <section id="logistica" className="py-24 bg-gray-50 text-gray-600 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl mb-6 text-neolife-teal font-bold">Para Residentes nos EUA</h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg font-light font-body">
            Entendemos as necessidades específicas de quem vive fora. Nosso protocolo foi desenhado para eliminar incertezas.
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
