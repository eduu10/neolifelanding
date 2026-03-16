import dynamic from 'next/dynamic';
import Hero from '@/components/Hero';

const PatientPains = dynamic(() => import('@/components/PatientPains'));
const Methodology = dynamic(() => import('@/components/Methodology'));
const Logistics = dynamic(() => import('@/components/Logistics'));
const Authority = dynamic(() => import('@/components/Authority'));
const Security = dynamic(() => import('@/components/Security'));
const CaseStudies = dynamic(() => import('@/components/CaseStudies'));
const QualifierForm = dynamic(() => import('@/components/QualifierForm'));
const Team = dynamic(() => import('@/components/Team'));
const WhatsAppButton = dynamic(() => import('@/components/WhatsAppButton'));
const Footer = dynamic(() => import('@/components/Footer'));

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-600 selection:bg-neolife-teal selection:text-white">
      <Hero />
      <PatientPains />
      <Methodology />
      <Logistics />
      <Authority />
      <Security />
      <CaseStudies />
      <QualifierForm />
      <Team />
      <Footer />
      <WhatsAppButton />
    </main>
  );
}
