'use client';

import {
  Edit3,
  PenLine,
  ArrowRightLeft,
  CheckCircle,
  StickyNote,
  Mail,
  type LucideIcon,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { LEAD_STATUS_CONFIG } from '@/lib/constants';
import type { LeadTimelineEntry, LeadStatus } from '@/lib/types';

const EVENT_CONFIG: Record<
  string,
  { icon: LucideIcon; label: string; color: string }
> = {
  form_focus: { icon: Edit3, label: 'Iniciou formulário', color: '#6366F1' },
  field_filled: { icon: PenLine, label: 'Preencheu campo', color: '#F59E0B' },
  status_change: { icon: ArrowRightLeft, label: 'Status alterado', color: '#00D4AA' },
  form_submitted: { icon: CheckCircle, label: 'Formulário enviado', color: '#22C55E' },
  note_added: { icon: StickyNote, label: 'Nota adicionada', color: '#A1A1AA' },
  email_sent: { icon: Mail, label: 'Email enviado', color: '#6366F1' },
};

function getEventSummary(entry: LeadTimelineEntry): string {
  const data = entry.event_data;

  switch (entry.event_type) {
    case 'status_change': {
      const from = LEAD_STATUS_CONFIG[data.from as LeadStatus]?.label || String(data.from);
      const to = LEAD_STATUS_CONFIG[data.to as LeadStatus]?.label || String(data.to);
      return `${from} → ${to}`;
    }
    case 'field_filled': {
      const field = data.field as string;
      return field ? `Campo: ${field}` : 'Campo preenchido';
    }
    case 'note_added': {
      return (data.message as string) || 'Nota atualizada';
    }
    case 'email_sent': {
      return (data.subject as string) || 'Email enviado';
    }
    default: {
      if (data.message) return String(data.message);
      return '';
    }
  }
}

interface LeadTimelineProps {
  entries: LeadTimelineEntry[];
}

export default function LeadTimeline({ entries }: LeadTimelineProps) {
  if (entries.length === 0) {
    return (
      <p className="py-4 text-center text-xs text-dash-muted">
        Nenhuma atividade registrada
      </p>
    );
  }

  return (
    <div className="relative space-y-0">
      {entries.map((entry, index) => {
        const config = EVENT_CONFIG[entry.event_type] || {
          icon: StickyNote,
          label: entry.event_type,
          color: '#71717A',
        };
        const Icon = config.icon;
        const summary = getEventSummary(entry);
        const isLast = index === entries.length - 1;

        return (
          <div key={entry.id} className="relative flex gap-3 pb-4">
            {/* Vertical line */}
            {!isLast && (
              <div
                className="absolute left-[11px] top-6 h-full w-px"
                style={{ backgroundColor: `${config.color}30` }}
              />
            )}

            {/* Dot / Icon */}
            <div
              className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: `${config.color}20` }}
            >
              <Icon className="h-3 w-3" style={{ color: config.color }} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pt-0.5">
              <p className="text-xs font-medium text-dash-text">{config.label}</p>
              {summary && (
                <p className="mt-0.5 text-[11px] text-dash-muted truncate">{summary}</p>
              )}
              <p
                className="mt-1 text-[10px] text-dash-muted"
                style={{ fontFamily: 'var(--font-dash-mono)' }}
              >
                {format(new Date(entry.created_at), "dd MMM yyyy 'às' HH:mm", {
                  locale: ptBR,
                })}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
