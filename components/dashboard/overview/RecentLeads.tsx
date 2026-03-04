'use client';

import useSWR from 'swr';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Badge from '@/components/dashboard/shared/Badge';
import type { Lead } from '@/lib/types';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function RecentLeads() {
  const { data } = useSWR<{ leads: Lead[] }>('/api/leads?limit=5&sort=created_at', fetcher, { refreshInterval: 15000 });
  const leads = data?.leads || [];

  return (
    <div className="rounded-2xl bg-dash-card/80 backdrop-blur-xl border border-dash-border p-6">
      <h3 className="text-sm font-semibold text-dash-text mb-4" style={{ fontFamily: 'var(--font-dash-heading)' }}>
        Leads Recentes
      </h3>
      {leads.length === 0 ? (
        <p className="text-sm text-dash-muted text-center py-8">Nenhum lead ainda</p>
      ) : (
        <div className="space-y-3">
          {leads.map((lead) => (
            <div key={lead.id} className="flex items-center justify-between p-3 rounded-xl bg-dash-bg/50 hover:bg-dash-bg transition-colors">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-dash-text font-medium truncate">{lead.name || 'Anônimo'}</p>
                <p className="text-xs text-dash-muted truncate">{lead.location || lead.email || '—'}</p>
              </div>
              <div className="flex items-center gap-2 ml-3">
                <Badge status={lead.status} size="sm" />
                <span className="text-[10px] text-dash-muted whitespace-nowrap" style={{ fontFamily: 'var(--font-dash-mono)' }}>
                  {formatDistanceToNow(new Date(lead.created_at), { addSuffix: false, locale: ptBR })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
