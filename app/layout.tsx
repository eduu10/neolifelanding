import type {Metadata} from 'next';
import {Montserrat, Open_Sans} from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Neolife Odontologia | Dentista no Brasil para Brasileiros no Exterior',
  description: 'Reabilitação oral, lentes de porcelana e implantes com planejamento digital prévio para brasileiros que vivem no exterior. Tratamento executado durante sua estadia no Brasil.',
  keywords: [
    'dentista no brasil',
    'dentista para brasileiros no exterior',
    'reabilitação oral',
    'lentes de porcelana',
    'implantes dentários',
    'odontologia digital',
    'planejamento digital odontológico',
    'dentista brasileiro',
    'tratamento dentário no brasil',
    'neolife odontologia',
  ],
  authors: [{ name: 'Dr. Lucas - Neolife Odontologia' }],
  creator: 'Neolife Odontologia',
  publisher: 'Neolife Odontologia',
  metadataBase: new URL('https://dentistanobrasil.com.br'),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Neolife Odontologia | Dentista no Brasil para Brasileiros no Exterior',
    description: 'Reabilitação oral, lentes de porcelana e implantes com planejamento digital prévio. Tudo organizado à distância, executado durante sua estadia no Brasil.',
    url: 'https://dentistanobrasil.com.br',
    siteName: 'Neolife Odontologia',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Neolife Odontologia - Dentista no Brasil para Brasileiros no Exterior',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Neolife Odontologia | Dentista no Brasil para Brasileiros no Exterior',
    description: 'Reabilitação oral, lentes de porcelana e implantes com planejamento digital prévio para brasileiros no exterior.',
    creator: '@neolifeodonto',
  },
  verification: {
    google: 'J_xP5grazCDeFoiTEOv4bNwJKL7t1EqKEBoGknNDua0',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': ['Dentist', 'LocalBusiness'],
  '@id': 'https://dentistanobrasil.com.br#business',
  name: 'Neolife Odontologia',
  description: 'Clínica odontológica especializada em reabilitação oral, lentes de porcelana e implantes com planejamento digital para brasileiros que vivem no exterior.',
  url: 'https://dentistanobrasil.com.br',
  telephone: '+553132214335',
  image: 'https://dentistanobrasil.com.br/opengraph-image',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Av. do Contorno 4747 – LJ 15',
    addressLocality: 'Belo Horizonte',
    addressRegion: 'MG',
    postalCode: '30110-051',
    addressCountry: 'BR',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -19.9167,
    longitude: -43.9345,
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Service',
    telephone: '+553132214335',
    areaServed: ['US', 'BR', 'CA', 'AU', 'GB', 'PT'],
    availableLanguage: ['pt-BR', 'en'],
  },
  areaServed: [
    { '@type': 'Country', name: 'United States' },
    { '@type': 'Country', name: 'Canada' },
    { '@type': 'Country', name: 'Brazil' },
    { '@type': 'Country', name: 'United Kingdom' },
    { '@type': 'Country', name: 'Portugal' },
    { '@type': 'Country', name: 'Australia' },
  ],
  priceRange: '$$$',
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '18:00',
    },
  ],
  medicalSpecialty: [
    'Prosthodontics',
    'Dental Implants',
    'Cosmetic Dentistry',
    'Digital Dentistry',
  ],
  availableService: [
    {
      '@type': 'MedicalProcedure',
      name: 'Reabilitação Oral Completa',
      description: 'Reconstrução funcional e estética do sorriso com planejamento digital.',
    },
    {
      '@type': 'MedicalProcedure',
      name: 'Lentes de Porcelana',
      description: 'Laminados cerâmicos ultrafinos para transformação estética do sorriso.',
    },
    {
      '@type': 'MedicalProcedure',
      name: 'Implantes Dentários',
      description: 'Implantes com planejamento digital e cirurgia guiada para máxima precisão.',
    },
  ],
  sameAs: [
    'https://www.instagram.com/neolifeodontologia',
  ],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Como funciona o tratamento odontológico para brasileiros que moram no exterior?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'O tratamento é planejado digitalmente antes da sua viagem ao Brasil. Fazemos avaliação inicial online, planejamento digital do caso, e executamos o tratamento durante sua estadia. Após o retorno, o acompanhamento é feito online.',
      },
    },
    {
      '@type': 'Question',
      name: 'Vocês oferecem suporte presencial nos Estados Unidos?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Não oferecemos suporte presencial nos Estados Unidos. O acompanhamento pós-tratamento é realizado online. O planejamento prévio detalhado é essencial para minimizar intercorrências e garantir previsibilidade.',
      },
    },
    {
      '@type': 'Question',
      name: 'Quais tratamentos a Neolife Odontologia oferece?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Somos especializados em reabilitação oral completa, lentes de porcelana, implantes dentários, ortodontia e estética dental, todos com planejamento digital avançado.',
      },
    },
    {
      '@type': 'Question',
      name: 'A clínica oferece garantia nos tratamentos?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sim, oferecemos garantia conforme estabelecido em contrato, com termos claros e transparentes para cada tipo de procedimento realizado.',
      },
    },
  ],
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt-BR" className={`${montserrat.variable} ${openSans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </head>
      <body className="bg-white text-gray-600 antialiased selection:bg-[#008575] selection:text-white font-body" suppressHydrationWarning>
        {children}
        <Script src="/neolife-tracker.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
