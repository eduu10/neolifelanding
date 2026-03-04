'use client';

interface UTMRow {
  source: string;
  medium: string;
  campaign: string;
  visits: number;
  leads: number;
}

interface Props {
  data: UTMRow[];
}

export default function UTMBreakdown({ data }: Props) {
  return (
    <div className="rounded-2xl bg-dash-card/80 backdrop-blur-xl border border-dash-border p-6">
      <h3
        className="text-sm font-semibold text-dash-text mb-4"
        style={{ fontFamily: 'var(--font-dash-heading)' }}
      >
        UTM Breakdown
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-dash-border">
              <th className="text-left py-3 px-2 text-dash-muted font-medium text-xs">Source</th>
              <th className="text-left py-3 px-2 text-dash-muted font-medium text-xs">Medium</th>
              <th className="text-left py-3 px-2 text-dash-muted font-medium text-xs">Campaign</th>
              <th
                className="text-right py-3 px-2 text-dash-muted font-medium text-xs"
                style={{ fontFamily: 'var(--font-dash-mono)' }}
              >
                Visitas
              </th>
              <th
                className="text-right py-3 px-2 text-dash-muted font-medium text-xs"
                style={{ fontFamily: 'var(--font-dash-mono)' }}
              >
                Leads
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr
                key={`${row.source}-${row.medium}-${row.campaign}-${i}`}
                className={`border-b border-dash-border/50 transition-colors hover:bg-dash-border/20 ${
                  i % 2 === 1 ? 'bg-dash-bg/30' : ''
                }`}
              >
                <td className="py-2.5 px-2 text-dash-text text-xs">{row.source || '-'}</td>
                <td className="py-2.5 px-2 text-dash-secondary text-xs">{row.medium || '-'}</td>
                <td className="py-2.5 px-2 text-dash-secondary text-xs">{row.campaign || '-'}</td>
                <td
                  className="py-2.5 px-2 text-right text-dash-accent text-xs"
                  style={{ fontFamily: 'var(--font-dash-mono)' }}
                >
                  {row.visits.toLocaleString('pt-BR')}
                </td>
                <td
                  className="py-2.5 px-2 text-right text-dash-indigo text-xs"
                  style={{ fontFamily: 'var(--font-dash-mono)' }}
                >
                  {row.leads.toLocaleString('pt-BR')}
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-dash-muted text-xs">
                  Nenhum dado UTM encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
