'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'motion/react';
import { CheckCircle, Loader2 } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  location: z.string().min(2, 'Localização nos EUA é obrigatória'),
  goal: z.string().min(10, 'Descreva brevemente seu objetivo'),
  timeframe: z.string().refine((val) => ['imediato', '3meses', '6meses', 'planejamento'].includes(val), {
    message: 'Selecione uma opção',
  }),
});

type FormData = z.infer<typeof formSchema>;

export default function QualifierForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Track form submission
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const win = window as any;
      if (typeof window !== 'undefined' && win.__neoTracker) {
        win.__neoTracker.trackFormSubmit(data);
      }
      // Small delay for UX
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSuccess(true);
    } catch {
      // Still show success to user
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <section id="avaliacao" className="py-24 bg-white text-gray-600 relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-2xl text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-green-50 border border-green-100 rounded-3xl p-12 flex flex-col items-center"
          >
            <CheckCircle className="w-16 h-16 text-neolife-teal mb-6" />
            <h3 className="text-2xl font-heading font-bold text-gray-800 mb-4">Solicitação Recebida</h3>
            <p className="text-gray-600 font-body">
              Nossa equipe clínica analisará suas informações e entrará em contato em até 24 horas úteis para agendar sua avaliação inicial.
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="avaliacao" className="py-24 bg-white text-gray-600 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl mb-4 text-neolife-teal font-bold">Dê o Primeiro Passo</h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm font-light font-body">
            Preencha o formulário e nossa equipe entrará em contato para entender seu caso e montar um plano personalizado. Sem compromisso.
          </p>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 bg-gray-50 p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-xs uppercase tracking-wider text-gray-500 font-bold font-heading">Nome Completo</label>
              <input
                id="name"
                {...register('name')}
                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:border-neolife-teal focus:ring-1 focus:ring-neolife-teal transition-colors"
                placeholder="Seu nome"
              />
              {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-xs uppercase tracking-wider text-gray-500 font-bold font-heading">Email</label>
              <input
                id="email"
                {...register('email')}
                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:border-neolife-teal focus:ring-1 focus:ring-neolife-teal transition-colors"
                placeholder="seu@email.com"
              />
              {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="phone" className="text-xs uppercase tracking-wider text-gray-500 font-bold font-heading">WhatsApp / Telefone</label>
              <input
                id="phone"
                {...register('phone')}
                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:border-neolife-teal focus:ring-1 focus:ring-neolife-teal transition-colors"
                placeholder="+1 (555) 000-0000"
              />
              {errors.phone && <span className="text-red-500 text-xs">{errors.phone.message}</span>}
            </div>

            <div className="space-y-2">
              <label htmlFor="location" className="text-xs uppercase tracking-wider text-gray-500 font-bold font-heading">Cidade/Estado (EUA)</label>
              <input
                id="location"
                {...register('location')}
                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:border-neolife-teal focus:ring-1 focus:ring-neolife-teal transition-colors"
                placeholder="Ex: Miami, FL"
              />
              {errors.location && <span className="text-red-500 text-xs">{errors.location.message}</span>}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="goal" className="text-xs uppercase tracking-wider text-gray-500 font-bold font-heading">Principal Queixa ou Objetivo</label>
            <textarea
              id="goal"
              {...register('goal')}
              rows={3}
              className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:border-neolife-teal focus:ring-1 focus:ring-neolife-teal transition-colors resize-none"
              placeholder="Descreva brevemente o que deseja melhorar..."
            />
            {errors.goal && <span className="text-red-500 text-xs">{errors.goal.message}</span>}
          </div>

          <div className="space-y-2">
            <label htmlFor="timeframe" className="text-xs uppercase tracking-wider text-gray-500 font-bold font-heading">Previsão para Início</label>
            <select
              id="timeframe"
              {...register('timeframe')}
              className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:border-neolife-teal focus:ring-1 focus:ring-neolife-teal transition-colors appearance-none"
            >
              <option value="">Selecione...</option>
              <option value="imediato">Imediato (Próximos 30 dias)</option>
              <option value="3meses">Curto Prazo (1-3 meses)</option>
              <option value="6meses">Médio Prazo (3-6 meses)</option>
              <option value="planejamento">Apenas Planejamento (6+ meses)</option>
            </select>
            {errors.timeframe && <span className="text-red-500 text-xs">{errors.timeframe.message}</span>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-amber-600 text-white rounded-lg font-bold hover:bg-amber-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4 shadow-lg shadow-amber-600/20 font-heading uppercase tracking-wide"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processando...
              </>
            ) : (
              'Quero Minha Avaliação Gratuita'
            )}
          </button>
        </motion.form>
      </div>
    </section>
  );
}
