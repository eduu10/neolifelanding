import Hero from '@/components/Hero';
import Methodology from '@/components/Methodology';
import Logistics from '@/components/Logistics';
import Security from '@/components/Security';
import CaseStudies from '@/components/CaseStudies';
import QualifierForm from '@/components/QualifierForm';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-600 selection:bg-neolife-teal selection:text-white">
      <Hero />
      <Methodology />
      <Logistics />
      <Security />
      <CaseStudies />
      <QualifierForm />
      <Footer />
    </main>
  );
}
