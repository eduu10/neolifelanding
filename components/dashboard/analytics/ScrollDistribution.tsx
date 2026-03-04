'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface Props {
  data: { depth: string; count: number }[];
}

const GRADIENT_COLORS = ['#00D4AA', '#22C5A0', '#4496C8', '#6366F1'];

export default function ScrollDistribution({ data }: Props) {
  return (
    <div className="rounded-2xl bg-dash-card/80 backdrop-blur-xl border border-dash-border p-6">
      <h3
        className="text-sm font-semibold text-dash-text mb-4"
        style={{ fontFamily: 'var(--font-dash-heading)' }}
      >
        Distribuição de Scroll
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 20, left: 10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1E1E2E" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fill: '#71717A', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <YAxis
              type="category"
              dataKey="depth"
              tick={{ fill: '#A1A1AA', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={50}
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
            <Bar dataKey="count" name="Visitantes" radius={[0, 4, 4, 0]} maxBarSize={28}>
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={GRADIENT_COLORS[index % GRADIENT_COLORS.length]}
                  fillOpacity={0.8}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
