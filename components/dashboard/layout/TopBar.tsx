'use client';

import { RefreshCw, Bell, LogOut } from 'lucide-react';
import { motion } from 'motion/react';
import { useDashboardStore } from '@/stores/dashboard-store';

const periodOptions = [
  { label: 'Hoje', value: 'today' as const },
  { label: '7 dias', value: '7d' as const },
  { label: '30 dias', value: '30d' as const },
];

export default function TopBar() {
  const { period, setPeriod, refresh } = useDashboardStore();

  return (
    <header className="sticky top-0 z-30 border-b border-dash-border bg-dash-card/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Period Selector */}
        <div className="flex items-center gap-1 rounded-lg bg-dash-bg p-1">
          {periodOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setPeriod(option.value)}
              className={`relative rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                period === option.value
                  ? 'text-dash-bg'
                  : 'text-dash-muted hover:text-dash-text'
              }`}
            >
              {period === option.value && (
                <motion.div
                  layoutId="period-pill"
                  className="absolute inset-0 rounded-md bg-dash-accent"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{option.label}</span>
            </button>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Online Visitors */}
          <div className="flex items-center gap-2 text-sm text-dash-muted">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
            </span>
            <span>0 online</span>
          </div>

          {/* Refresh Button */}
          <button
            onClick={refresh}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-dash-muted transition-colors hover:bg-dash-border/50 hover:text-dash-text"
            aria-label="Refresh data"
          >
            <RefreshCw className="h-4 w-4" />
          </button>

          {/* Notification Bell */}
          <button
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-dash-muted transition-colors hover:bg-dash-border/50 hover:text-dash-text"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
          </button>

          {/* Divider */}
          <div className="h-8 w-px bg-dash-border" />

          {/* User Avatar / Logout */}
          <button
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-dash-muted transition-colors hover:bg-dash-border/50 hover:text-dash-text"
            aria-label="Logout"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-dash-accent/20 text-xs font-bold text-dash-accent">
              A
            </div>
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
