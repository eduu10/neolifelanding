'use client';

interface Props {
  data: { name: string; clicks: number }[];
}

export default function CTARankings({ data }: Props) {
  const sorted = [...data].sort((a, b) => b.clicks - a.clicks);
  const maxClicks = sorted.length > 0 ? sorted[0].clicks : 0;

  return (
    <div className="rounded-2xl bg-dash-card/80 backdrop-blur-xl border border-dash-border p-6">
      <h3
        className="text-sm font-semibold text-dash-text mb-4"
        style={{ fontFamily: 'var(--font-dash-heading)' }}
      >
        Ranking de CTAs
      </h3>
      <div className="space-y-3">
        {sorted.map((item, i) => (
          <div key={item.name} className="flex items-center gap-3">
            <span
              className="text-xs text-dash-muted w-5 shrink-0 text-right"
              style={{ fontFamily: 'var(--font-dash-mono)' }}
            >
              {i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-dash-text truncate mb-1">{item.name}</div>
              <div className="h-2 rounded-full overflow-hidden bg-dash-bg">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: maxClicks > 0 ? `${(item.clicks / maxClicks) * 100}%` : '0%',
                    background: 'linear-gradient(90deg, #00D4AA, #00D4AA60)',
                  }}
                />
              </div>
            </div>
            <span
              className="text-xs text-dash-accent shrink-0 w-14 text-right"
              style={{ fontFamily: 'var(--font-dash-mono)' }}
            >
              {item.clicks.toLocaleString('pt-BR')}
            </span>
          </div>
        ))}
        {sorted.length === 0 && (
          <p className="text-xs text-dash-muted text-center py-4">
            Nenhum clique em CTA registrado
          </p>
        )}
      </div>
    </div>
  );
}
