'use client';

import useSWR, { mutate } from 'swr';
import { useCallback } from 'react';
import type { Lead, LeadTimelineEntry } from '@/lib/types';
import { useDashboardStore } from '@/stores/dashboard-store';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface UseLeadsParams {
  status?: string;
  search?: string;
  sort?: string;
  order?: string;
  limit?: number;
  offset?: number;
}

interface LeadsResponse {
  leads: Lead[];
  total: number;
}

interface LeadDetailResponse {
  lead: Lead;
  timeline: LeadTimelineEntry[];
}

export function useLeads(params: UseLeadsParams = {}) {
  const { refreshKey } = useDashboardStore();

  const searchParams = new URLSearchParams();
  if (params.status && params.status !== 'all') searchParams.set('status', params.status);
  if (params.search) searchParams.set('search', params.search);
  if (params.sort) searchParams.set('sort', params.sort);
  if (params.order) searchParams.set('order', params.order);
  if (params.limit) searchParams.set('limit', String(params.limit));
  if (params.offset) searchParams.set('offset', String(params.offset));

  const qs = searchParams.toString();
  const key = `/api/leads${qs ? `?${qs}` : ''}${qs ? '&' : '?'}_=${refreshKey}`;

  return useSWR<LeadsResponse>(key, fetcher, {
    refreshInterval: 30000,
    revalidateOnFocus: true,
  });
}

export function useLead(id: string | null) {
  const { refreshKey } = useDashboardStore();

  return useSWR<LeadDetailResponse>(
    id ? `/api/leads/${id}?_=${refreshKey}` : null,
    fetcher,
    { revalidateOnFocus: true }
  );
}

export function useUpdateLead() {
  const update = useCallback(
    async (id: string, data: Partial<Lead> & { _addNoteTimeline?: boolean }) => {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to update lead');
      }

      const updated = await res.json();

      // Revalidate both the list and the single lead
      await mutate(
        (key: unknown) => typeof key === 'string' && key.startsWith('/api/leads'),
        undefined,
        { revalidate: true }
      );

      return updated as Lead;
    },
    []
  );

  return { updateLead: update };
}
