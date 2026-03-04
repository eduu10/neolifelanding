'use client';

import { create } from 'zustand';
import type { Lead } from '@/lib/types';

interface NotificationStore {
  newLeads: Lead[];
  addNewLead: (lead: Lead) => void;
  clearNewLeads: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  newLeads: [],
  addNewLead: (lead) => set((s) => ({ newLeads: [lead, ...s.newLeads].slice(0, 50) })),
  clearNewLeads: () => set({ newLeads: [] }),
  soundEnabled: true,
  toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
}));
