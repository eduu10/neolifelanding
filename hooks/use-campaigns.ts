'use client';

import useSWR from 'swr';
import { useCallback } from 'react';
import type { EmailCampaign, EmailSend } from '@/lib/types';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useCampaigns() {
  return useSWR<{ campaigns: EmailCampaign[] }>('/api/campaigns', fetcher, {
    revalidateOnFocus: true,
  });
}

export function useCampaign(id: string | null) {
  return useSWR<{ campaign: EmailCampaign; sends: EmailSend[] }>(
    id ? `/api/campaigns/${id}` : null,
    fetcher,
    { revalidateOnFocus: true }
  );
}

export function useCreateCampaign() {
  const { mutate } = useCampaigns();

  const createCampaign = useCallback(
    async (data: {
      name: string;
      subject: string;
      html_content: string;
      audience_filter: Record<string, unknown>;
    }) => {
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Erro ao criar campanha');
      }

      const campaign = await res.json();
      await mutate();
      return campaign as EmailCampaign;
    },
    [mutate]
  );

  return { createCampaign };
}

export function useSendCampaign() {
  const sendCampaign = useCallback(
    async (campaignId: string) => {
      const res = await fetch(`/api/campaigns/${campaignId}/send`, {
        method: 'POST',
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Erro ao enviar campanha');
      }

      return (await res.json()) as { success: boolean; total_sent: number };
    },
    []
  );

  return { sendCampaign };
}
