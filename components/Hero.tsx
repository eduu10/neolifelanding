'use client';

import { motion } from 'motion/react';
import { ArrowDown } from 'lucide-react';
import Image from 'next/image';

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden bg-white py-20">
      {/* Background Image of Dentist/Clinic */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/bghero.jpg"
          alt="Dentista especialista em clínica moderna"
          fill
          className="object-cover"
          priority
          sizes="100vw"
          quality={75}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/40 to-white/80" />
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-neolife-teal/10 border border-neolife-teal/20 text-neolife-teal text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-sm font-heading">
            Para brasileiros que vivem no exterior
          </span>
          <h1 className="font-heading text-3xl sm:text-5xl md:text-7xl font-bold text-gray-800 leading-tight mb-6 tracking-tight">
            Seu sorriso planejado digitalmente <span className="text-neolife-teal italic font-serif">antes da viagem ao Brasil.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-light leading-relaxed mb-10 font-body">
            Reabilitação oral, lentes de porcelana e implantes com planejamento digital prévio. Tudo organizado à distância, executado durante sua estadia no Brasil e acompanhado online após o retorno.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center font-heading">
            <a
              href="https://wa.me/553132214335?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20avalia%C3%A7%C3%A3o"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-neolife-teal text-white rounded-full font-bold hover:bg-teal-700 transition-colors duration-300 min-w-[200px] shadow-lg shadow-neolife-teal/20"
            >
              Fale pelo WhatsApp
            </a>
            <a
              href="#avaliacao"
              className="px-8 py-4 bg-amber-600 text-white rounded-full font-bold hover:bg-amber-700 transition-all duration-300 min-w-[200px] shadow-lg shadow-amber-600/20"
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
