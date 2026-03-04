'use client';

interface Props {
  data: { step: string; count: number; percentage: number }[];
}

export default function FunnelChart({ data }: Props) {
  const colors = ['#00D4AA', '#22C55E', '#6366F1', '#F59E0B', '#EF4444'];

  return (
    <div className="rounded-2xl bg-dash-card/80 backdrop-blur-xl border border-dash-border p-6">
      <h3 className="text-sm font-semibold text-dash-text mb-4" style={{ fontFamily: 'var(--font-dash-heading)' }}>
        Funil de Conversão
      </h3>
      <div className="space-y-3">
        {data.map((item, i) => (
          <div key={item.step} className="flex items-center gap-3">
            <div className="w-24 text-xs text-dash-secondary truncate">{item.step}</div>
            <div className="flex-1 h-7 rounded-lg overflow-hidden bg-dash-bg relative">
              <div
                className="h-full rounded-lg transition-all duration-700 flex items-center px-2"
                style={{
                  width: `${Math.max(item.percentage, 4)}%`,
                  background: `${colors[i]}30`,
                  borderLeft: `3px solid ${colors[i]}`,
                }}
              >
                <span className="text-xs font-mono text-dash-text whitespace-nowrap" style={{ fontFamily: 'var(--font-dash-mono)' }}>
                  {item.count}
                </span>
              </div>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-dash-muted" style={{ fontFamily: 'var(--font-dash-mono)' }}>
                {item.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
