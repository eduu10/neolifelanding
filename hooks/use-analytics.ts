'use client';

import useSWR from 'swr';
import type { AnalyticsData } from '@/lib/types';
import { useDashboardStore } from '@/stores/dashboard-store';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function useAnalytics() {
  const { period, refreshKey } = useDashboardStore();
  return useSWR<AnalyticsData>(
    `/api/analytics?period=${period}&_=${refreshKey}`,
    fetcher,
    { refreshInterval: 30000, revalidateOnFocus: true }
  );
}

export function useRealtimeVisitors() {
  return useSWR<{ online: number }>(
    '/api/analytics/realtime',
    fetcher,
    { refreshInterval: 15000 }
  );
}
