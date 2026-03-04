'use client';

import { MapPin } from 'lucide-react';

interface Props {
  data: { city: string; count: number; percentage: number }[];
}

export default function LeadOriginMap({ data }: Props) {
  return (
    <div className="rounded-2xl bg-dash-card/80 backdrop-blur-xl border border-dash-border p-6">
      <h3 className="text-sm font-semibold text-dash-text mb-4" style={{ fontFamily: 'var(--font-dash-heading)' }}>
        Origem dos Leads
      </h3>
      {data.length === 0 ? (
        <p className="text-sm text-dash-muted text-center py-8">Sem dados de localização</p>
      ) : (
        <div className="space-y-3">
          {data.map((item) => (
            <div key={item.city} className="flex items-center gap-3 p-2.5 rounded-xl bg-dash-bg/50 hover:bg-dash-bg transition-colors">
              <MapPin className="w-4 h-4 text-dash-accent flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-dash-text truncate">{item.city}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-dash-accent font-semibold" style={{ fontFamily: 'var(--font-dash-mono)' }}>
                  {item.count}
                </span>
                <span className="text-[10px] text-dash-muted" style={{ fontFamily: 'var(--font-dash-mono)' }}>
                  ({item.percentage}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
