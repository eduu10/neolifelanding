'use client';

interface Props {
  data: { name: string; views: number; avgTime: number; percentage: number }[];
}

export default function SectionEngagement({ data }: Props) {
  return (
    <div className="rounded-2xl bg-dash-card/80 backdrop-blur-xl border border-dash-border p-6">
      <h3 className="text-sm font-semibold text-dash-text mb-4" style={{ fontFamily: 'var(--font-dash-heading)' }}>
        Engajamento por Seção
      </h3>
      <div className="space-y-4">
        {data.map((section) => (
          <div key={section.name} className="flex items-center gap-3">
            <div className="w-28 text-xs text-dash-secondary truncate">{section.name}</div>
            <div className="flex-1 h-6 rounded-lg overflow-hidden bg-dash-bg relative">
              <div
                className="h-full rounded-lg transition-all duration-700"
                style={{
                  width: `${Math.max(section.percentage, 3)}%`,
                  background: 'linear-gradient(90deg, #00D4AA40, #6366F140)',
                }}
              />
            </div>
            <div className="flex items-center gap-3 w-28 justify-end">
              <span className="text-xs text-dash-accent" style={{ fontFamily: 'var(--font-dash-mono)' }}>
                {section.percentage}%
              </span>
              <span className="text-xs text-dash-muted" style={{ fontFamily: 'var(--font-dash-mono)' }}>
                {section.avgTime}s
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
