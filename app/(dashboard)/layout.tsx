import { Outfit, DM_Sans, JetBrains_Mono } from 'next/font/google';
import Sidebar from '@/components/dashboard/layout/Sidebar';
import TopBar from '@/components/dashboard/layout/TopBar';
import { Toaster } from 'react-hot-toast';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-dash-heading' });
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dash-body' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-dash-mono' });

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${outfit.variable} ${dmSans.variable} ${jetbrains.variable} min-h-screen bg-dash-bg text-dash-text`}
      style={{ fontFamily: 'var(--font-dash-body)' }}
    >
      <Sidebar />
      <div className="transition-all duration-300 ml-64">
        <TopBar />
        <main className="p-6">
          {children}
        </main>
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#12121A',
            color: '#E4E4E7',
            border: '1px solid #1E1E2E',
          },
        }}
      />
    </div>
  );
}
