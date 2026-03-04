'use client';

import { create } from 'zustand';

interface DashboardStore {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  period: 'today' | '7d' | '30d' | 'custom';
  setPeriod: (period: 'today' | '7d' | '30d' | 'custom') => void;
  customDateRange: { from: Date; to: Date } | null;
  setCustomDateRange: (range: { from: Date; to: Date } | null) => void;
  refreshKey: number;
  refresh: () => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  period: '7d',
  setPeriod: (period) => set({ period }),
  customDateRange: null,
  setCustomDateRange: (range) => set({ customDateRange: range }),
  refreshKey: 0,
  refresh: () => set((s) => ({ refreshKey: s.refreshKey + 1 })),
}));
