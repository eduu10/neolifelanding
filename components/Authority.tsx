'use client';

import { motion } from 'motion/react';
import { Award, GraduationCap, Monitor, Users } from 'lucide-react';

const credentials = [
  {
    icon: GraduationCap,
    title: 'Especialização em Prótese e Implantes',
    description: 'Formação avançada em reabilitação oral com foco em estética e odontologia digital.',
  },
  {
    icon: Monitor,
    title: 'Referência em Odontologia Digital',
    description: 'Fluxo digital completo: escaneamento intraoral, planejamento 3D e integração direta com laboratório.',
  },
  {
    icon: Users,
    title: 'Centenas de Sorrisos Transformados',
    description: 'Pacientes do Brasil e do exterior que recuperaram autoestima e qualidade de vida.',
  },
  {
    icon: Award,
    title: 'Atualização Constante',
    description: 'Participação em congressos nacionais e internacionais, sempre na vanguarda das técnicas mais modernas.',
  },
];

export default function Authority() {
  return (
    <section id="autoridade" className="py-24 bg-white text-gray-600 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl mb-6 text-neolife-teal font-bold">Dr. Lucas — Referência em Reabilitação Oral</h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg font-light font-body">
            Para tratamentos de alto valor, a confiança no profissional faz toda a diferença. Conheça quem estará à frente do seu tratamento.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {credentials.map((cred, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              className="flex items-start gap-6 p-8 rounded-2xl bg-gray-50 border border-gray-100 shadow-lg shadow-gray-200/50 hover:border-neolife-teal/30 transition-colors group"
            >
              <div className="p-4 rounded-xl bg-neolife-teal/10 text-neolife-teal group-hover:bg-neolife-teal group-hover:text-white transition-colors">
                <cred.icon className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2 font-heading">{cred.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm font-body">{cred.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-14">
          <a
            href="https://wa.me/553132214335?text=Ol%C3%A1%2C%20gostaria%20de%20conversar%20sobre%20meu%20tratamento"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 bg-amber-600 text-white rounded-full font-bold hover:bg-amber-700 transition-colors duration-300 shadow-lg shadow-amber-600/20 font-heading"
          >
            Converse Diretamente com a Equipe
          </a>
        </div>
      </div>
    </section>
  );
}
