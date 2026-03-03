'use client';

import { MapPin, Phone, Mail, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-600 py-16 border-t border-gray-200">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <h4 className="text-neolife-teal font-heading font-bold text-2xl mb-6">Neolife Odontologia</h4>
            <p className="text-sm leading-relaxed max-w-xs mb-6 font-body">
              Centro de excelência em odontologia digital focado em pacientes residentes no exterior. Tecnologia, previsibilidade e acolhimento.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-white rounded-full hover:bg-neolife-teal hover:text-white transition-colors text-neolife-teal shadow-sm border border-gray-200">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-white rounded-full hover:bg-neolife-teal hover:text-white transition-colors text-neolife-teal shadow-sm border border-gray-200">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h5 className="text-gray-800 font-bold mb-6 uppercase tracking-wider text-xs font-heading">Contato</h5>
            <ul className="space-y-4 text-sm font-body">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-neolife-teal shrink-0" />
                <span>+55 (31) 3221-4335</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-neolife-teal shrink-0" />
                <span>contato@neolifeodontologia.com.br</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-neolife-teal shrink-0" />
                <span>Av. do Contorno 4747 – LJ 15<br />Serra – Belo Horizonte / MG</span>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-gray-800 font-bold mb-6 uppercase tracking-wider text-xs font-heading">Legal</h5>
            <ul className="space-y-4 text-sm font-body">
              <li><a href="#" className="hover:text-neolife-teal transition-colors">Política de Privacidade</a></li>
              <li><a href="#" className="hover:text-neolife-teal transition-colors">Termos de Uso</a></li>
              <li><a href="#" className="hover:text-neolife-teal transition-colors">Responsabilidade Técnica</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 font-body">
          <p>&copy; {new Date().getFullYear()} Neolife Odontologia. Todos os direitos reservados.</p>
          <p>Responsável Técnico: Dr. Lucas - CRO/MG 00000</p>
        </div>
      </div>
    </footer>
  );
}
