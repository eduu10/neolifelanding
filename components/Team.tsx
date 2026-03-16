'use client';

import { motion } from 'motion/react';
import Image from 'next/image';

const teamMembers = [
  {
    name: 'Dr. Lucas',
    role: 'Mestre e Especialista em Prótese Dentária | Especialista em Implantodontia | Estética Dental',
    image: '/team/dr-lucas.png',
    highlight: true,
  },
  {
    name: 'Dr. Gabriel',
    role: 'Especialista em Ortodontia | Implantodontia e Periodontia',
    image: '/team/dr-gabriel.png',
  },
  {
    name: 'Dra. Ana Carla',
    role: 'Especialista em Endodontia | Clínica Geral',
    image: '/team/dra-ana-carla.png',
  },
  {
    name: 'Dra. Thaís',
    role: 'Especialista em Ortodontia | Alinhadores Invisíveis',
    image: '/team/dra-thais.png',
  },
  {
    name: 'Dr. Vinicius',
    role: 'Disfunção Temporomandibular | Dor Orofacial | Prótese e Implantes',
    image: '/team/dr-vinicius.png',
  },
  {
    name: 'Dra. Elisa',
    role: 'Especialista em Ortodontia',
    image: '/team/dra-elisa.png',
  },
];

export default function Team() {
  return (
    <section id="equipe" className="py-24 bg-gray-50 text-gray-600 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-heading text-4xl md:text-5xl mb-6 text-neolife-teal font-bold"
          >
            Nossa Equipe
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-500 max-w-2xl mx-auto text-lg font-light font-body"
          >
            Profissionais especializados e dedicados a oferecer o melhor tratamento odontológico com tecnologia de ponta.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group relative bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-200/50 overflow-hidden hover:shadow-xl hover:border-neolife-teal/30 transition-all duration-500"
            >
              {/* Image container */}
              <div className="flex justify-center pt-6">
                <div className="relative w-36 h-36 rounded-full overflow-hidden bg-gray-100 ring-4 ring-gray-100 group-hover:ring-neolife-teal/30 transition-all duration-500">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-110"
                    sizes="144px"
                    quality={95}
                  />
                </div>
              </div>

              {/* Info */}
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-gray-800 font-heading mb-2 group-hover:text-neolife-teal transition-colors duration-300">
                  {member.name}
                </h3>
                <p className="text-gray-500 text-sm font-body leading-relaxed">
                  {member.role}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
