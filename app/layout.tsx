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
  title: 'Neolife Odontologia | Reabilitação Internacional',
  description: 'Reabilitação digital estruturada para pacientes internacionais. Planejamento criterioso e acompanhamento remoto.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt-BR" className={`${montserrat.variable} ${openSans.variable}`}>
      <body className="bg-white text-gray-600 antialiased selection:bg-[#008575] selection:text-white font-body" suppressHydrationWarning>
        {children}
        <Script src="/neolife-tracker.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
