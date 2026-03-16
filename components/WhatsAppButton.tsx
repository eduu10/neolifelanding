'use client';

import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/553132214335?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20avalia%C3%A7%C3%A3o"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Fale conosco pelo WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 bg-green-500 text-white rounded-full shadow-2xl shadow-green-500/30 hover:bg-green-600 transition-all duration-300 hover:scale-105 font-heading font-bold text-sm"
    >
      <MessageCircle className="w-6 h-6" fill="white" strokeWidth={0} />
      <span className="hidden sm:inline">Fale pelo WhatsApp</span>
    </a>
  );
}
