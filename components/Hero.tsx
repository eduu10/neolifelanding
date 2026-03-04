'use client';

import { motion } from 'motion/react';
import { ArrowDown } from 'lucide-react';
import Image from 'next/image';

export default function Hero() {
  return (
    <section id="hero" className="relative h-screen flex flex-col justify-center items-center overflow-hidden bg-white">
      {/* Background Image of Dentist/Clinic */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2068&auto=format&fit=crop"
          alt="Dentista especialista em clínica moderna"
          fill
          className="object-cover opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/60 to-white" />
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-neolife-teal/10 border border-neolife-teal/20 text-neolife-teal text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-sm font-heading">
            Neolife Odontologia
          </span>
          <h1 className="font-heading text-5xl md:text-7xl font-bold text-gray-800 leading-tight mb-6 tracking-tight">
            Reabilitação digital estruturada para <span className="text-neolife-teal italic font-serif">pacientes internacionais.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-light leading-relaxed mb-10 font-body">
            Planejamento criterioso, fluxo digital integrado e acompanhamento remoto para brasileiros residentes nos EUA.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center font-heading">
            <a 
              href="#metodo" 
              className="px-8 py-4 bg-neolife-teal text-white rounded-full font-bold hover:bg-teal-700 transition-colors duration-300 min-w-[200px] shadow-lg shadow-neolife-teal/20"
            >
              Conheça o Método
            </a>
            <a 
              href="#avaliacao" 
              className="px-8 py-4 bg-neolife-orange text-white rounded-full font-bold hover:bg-amber-600 transition-all duration-300 min-w-[200px] shadow-lg shadow-neolife-orange/20"
            >
              Agendar Avaliação
            </a>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-neolife-teal flex flex-col items-center gap-2 z-10"
      >
        <span className="text-[10px] uppercase tracking-widest font-heading font-bold">Role para saber mais</span>
        <ArrowDown className="w-4 h-4 animate-bounce" />
      </motion.div>
    </section>
  );
}
