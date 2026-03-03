'use client';

import { motion } from 'motion/react';
import { ShieldCheck, FileText, Globe } from 'lucide-react';

export default function Security() {
  return (
    <section id="seguranca" className="py-24 bg-white text-gray-600 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white border-2 border-neolife-teal/20 rounded-3xl p-12 relative shadow-2xl shadow-neolife-teal/5"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-full border-2 border-neolife-teal/20">
            <ShieldCheck className="w-12 h-12 text-neolife-teal" strokeWidth={1.5} />
          </div>

          <h2 className="font-heading text-3xl md:text-4xl mb-8 mt-6 text-neolife-teal font-bold">Compromisso de Excelência</h2>
          
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-800 font-bold font-heading">
                <FileText className="w-5 h-5 text-neolife-teal" />
                <span>Contrato Transparente</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed font-body">
                Cláusulas claras sobre prazos, custos e responsabilidades. Sem letras miúdas ou surpresas.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-800 font-bold font-heading">
                <Globe className="w-5 h-5 text-neolife-teal" />
                <span>Suporte Internacional</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed font-body">
                Rede de parceiros nos EUA para atendimentos de urgência e manutenção, se necessário.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-800 font-bold font-heading">
                <ShieldCheck className="w-5 h-5 text-neolife-teal" />
                <span>Garantia Estendida</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed font-body">
                Cobertura completa para falhas de material ou execução, assegurando seu investimento.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
