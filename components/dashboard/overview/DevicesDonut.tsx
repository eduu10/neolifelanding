'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#00D4AA', '#6366F1', '#F59E0B'];

interface Props {
  data: { name: string; value: number }[];
}

export default function DevicesDonut({ data }: Props) {
  return (
    <div className="rounded-2xl bg-dash-card/80 backdrop-blur-xl border border-dash-border p-6">
      <h3 className="text-sm font-semibold text-dash-text mb-4" style={{ fontFamily: 'var(--font-dash-heading)' }}>
        Dispositivos
      </h3>
      <div className="h-48 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} strokeWidth={0} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: '#12121A', border: '1px solid #1E1E2E', borderRadius: '8px', color: '#E4E4E7', fontSize: 12 }}
              formatter={(value) => `${value}%`}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-4 mt-2">
        {data.map((d, i) => (
          <div key={d.name} className="flex items-center gap-1.5 text-xs text-dash-secondary">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
            {d.name}: {d.value}%
          </div>
        ))}
      </div>
    </div>
  );
}
