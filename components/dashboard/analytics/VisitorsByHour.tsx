'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface Props {
  data: { hour: string; count: number }[];
}

export default function VisitorsByHour({ data }: Props) {
  return (
    <div className="rounded-2xl bg-dash-card/80 backdrop-blur-xl border border-dash-border p-6">
      <h3
        className="text-sm font-semibold text-dash-text mb-4"
        style={{ fontFamily: 'var(--font-dash-heading)' }}
      >
        Visitantes por Hora (24h)
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="barAccentGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00D4AA" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#00D4AA" stopOpacity={0.4} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E1E2E" vertical={false} />
            <XAxis
              dataKey="hour"
              tick={{ fill: '#71717A', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#71717A', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                background: '#12121A',
                border: '1px solid #1E1E2E',
                borderRadius: '8px',
                color: '#E4E4E7',
                fontSize: 12,
              }}
              cursor={{ fill: '#1E1E2E40' }}
            />
            <Bar
              dataKey="count"
              name="Visitantes"
              fill="url(#barAccentGrad)"
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
