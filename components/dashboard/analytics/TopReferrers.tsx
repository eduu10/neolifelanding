'use client';

interface Props {
  data: { referrer: string; count: number }[];
}

export default function TopReferrers({ data }: Props) {
  const sorted = [...data].sort((a, b) => b.count - a.count);
  const maxCount = sorted.length > 0 ? sorted[0].count : 0;

  return (
    <div className="rounded-2xl bg-dash-card/80 backdrop-blur-xl border border-dash-border p-6">
      <h3
        className="text-sm font-semibold text-dash-text mb-4"
        style={{ fontFamily: 'var(--font-dash-heading)' }}
      >
        Top Referrers
      </h3>
      <div className="space-y-3">
        {sorted.map((item) => (
          <div key={item.referrer} className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="text-xs text-dash-text truncate">{item.referrer}</div>
              <div className="mt-1 h-1.5 rounded-full overflow-hidden bg-dash-bg">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: maxCount > 0 ? `${(item.count / maxCount) * 100}%` : '0%',
                    background: 'linear-gradient(90deg, #00D4AA, #00D4AA80)',
                  }}
                />
              </div>
            </div>
            <span
              className="text-xs text-dash-accent shrink-0 w-12 text-right"
              style={{ fontFamily: 'var(--font-dash-mono)' }}
            >
              {item.count.toLocaleString('pt-BR')}
            </span>
          </div>
        ))}
        {sorted.length === 0 && (
          <p className="text-xs text-dash-muted text-center py-4">
            Nenhum referrer encontrado
          </p>
        )}
      </div>
    </div>
  );
}
