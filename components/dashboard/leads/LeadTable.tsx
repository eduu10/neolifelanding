'use client';

import { Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Badge from '@/components/dashboard/shared/Badge';
import { LEAD_STATUS_CONFIG } from '@/lib/constants';
import type { Lead, LeadStatus } from '@/lib/types';

interface LeadTableProps {
  leads: Lead[];
  isLoading: boolean;
  selectedLeadId: string | null;
  onSelectLead: (id: string) => void;
}

function getScoreColor(score: number): string {
  if (score >= 70) return '#00D4AA';
  if (score >= 40) return '#F59E0B';
  return '#EF4444';
}

export default function LeadTable({
  leads,
  isLoading,
  selectedLeadId,
  onSelectLead,
}: LeadTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl bg-dash-card/80 backdrop-blur-xl border border-dash-border p-6">
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-dash-bg/50" />
          ))}
        </div>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="rounded-2xl bg-dash-card/80 backdrop-blur-xl border border-dash-border p-12">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-dash-border/50">
            <Eye className="h-5 w-5 text-dash-muted" />
          </div>
          <p className="text-sm font-medium text-dash-text">Nenhum lead encontrado</p>
          <p className="mt-1 text-xs text-dash-muted">
            Ajuste os filtros ou aguarde novos leads
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-dash-card/80 backdrop-blur-xl border border-dash-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dash-border">
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-dash-muted">
                Status
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-dash-muted">
                Nome
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-dash-muted">
                Contato
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-dash-muted">
                Cidade
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-dash-muted">
                Status
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-dash-muted">
                Score
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-dash-muted">
                Quando
              </th>
              <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-dash-muted">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => {
              const statusConfig = LEAD_STATUS_CONFIG[lead.status as LeadStatus];
              const isSelected = selectedLeadId === lead.id;

              return (
                <tr
                  key={lead.id}
                  onClick={() => onSelectLead(lead.id)}
                  className={`cursor-pointer border-b border-dash-border/50 transition-colors hover:bg-dash-bg/50 ${
                    isSelected ? 'bg-dash-accent/5' : ''
                  }`}
                >
                  {/* Status Dot */}
                  <td className="px-4 py-3">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: statusConfig?.color || '#71717A' }}
                    />
                  </td>

                  {/* Nome */}
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-dash-text">
                      {lead.name || 'Anônimo'}
                    </span>
                  </td>

                  {/* Contato */}
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      {lead.email && (
                        <span className="text-xs text-dash-secondary truncate max-w-[180px]">
                          {lead.email}
                        </span>
                      )}
                      {lead.phone && (
                        <span className="text-xs text-dash-muted">{lead.phone}</span>
                      )}
                      {!lead.email && !lead.phone && (
                        <span className="text-xs text-dash-muted">&mdash;</span>
                      )}
                    </div>
                  </td>

                  {/* Cidade */}
                  <td className="px-4 py-3">
                    <span className="text-xs text-dash-secondary">
                      {lead.location || '\u2014'}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="px-4 py-3">
                    <Badge status={lead.status} size="sm" />
                  </td>

                  {/* Score */}
                  <td className="px-4 py-3">
                    <span
                      className="text-sm font-semibold"
                      style={{
                        fontFamily: 'var(--font-dash-mono)',
                        color: getScoreColor(lead.score),
                      }}
                    >
                      {lead.score}
                    </span>
                  </td>

                  {/* Quando */}
                  <td className="px-4 py-3">
                    <span className="text-xs text-dash-muted whitespace-nowrap">
                      {formatDistanceToNow(new Date(lead.created_at), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </span>
                  </td>

                  {/* Ações */}
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectLead(lead.id);
                      }}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-dash-muted transition-colors hover:bg-dash-border/50 hover:text-dash-text"
                      aria-label="Ver detalhes"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
