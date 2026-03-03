'use client';

import { motion } from 'motion/react';
import Image from 'next/image';

const cases = [
  {
    id: 1,
    title: 'Reabilitação Total sobre Implantes',
    description: 'Protocolo All-on-4 com carga imediata. Resolução estética e funcional em 72 horas.',
    image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=1974&auto=format&fit=crop', // Dentist working
  },
  {
    id: 2,
    title: 'Lentes de Contato Cerâmicas',
    description: 'Planejamento digital do sorriso (DSD) e execução minimamente invasiva.',
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=2070&auto=format&fit=crop', // Dentist with patient
  },
  {
    id: 3,
    title: 'Reabilitação Estética Complexa',
    description: 'Integração multidisciplinar: periodontia, implantes e prótese sobre dentes.',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2080&auto=format&fit=crop', // Dental team
  },
];

export default function CaseStudies() {
  return (
    <section id="casos" className="py-24 bg-gray-50 text-gray-600 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl mb-6 text-neolife-teal font-bold">Casos Clínicos</h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg font-light font-body">
            Resultados previsíveis baseados em planejamento digital e execução técnica rigorosa.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {cases.map((c, index) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-lg shadow-gray-200/50 hover:shadow-xl hover:border-neolife-teal/30 transition-all duration-500"
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <Image
                  src={c.image}
                  alt={c.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              <div className="p-6 relative bg-white group-hover:bg-transparent transition-colors duration-300">
                <h3 className="text-xl font-bold text-gray-800 mb-2 font-heading group-hover:text-neolife-teal transition-colors">{c.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-body group-hover:text-gray-600">
                  {c.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
