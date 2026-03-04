'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface Props {
  data: { date: string; count: number; leads: number }[];
}

export default function VisitorsByDay({ data }: Props) {
  return (
    <div className="rounded-2xl bg-dash-card/80 backdrop-blur-xl border border-dash-border p-6">
      <h3
        className="text-sm font-semibold text-dash-text mb-4"
        style={{ fontFamily: 'var(--font-dash-heading)' }}
      >
        Visitantes por Dia
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="analyticsVisitorsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00D4AA" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00D4AA" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="analyticsLeadsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E1E2E" />
            <XAxis
              dataKey="date"
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
            />
            <Legend
              wrapperStyle={{ fontSize: 12, color: '#A1A1AA' }}
            />
            <Area
              type="monotone"
              dataKey="count"
              name="Visitantes"
              stroke="#00D4AA"
              strokeWidth={2}
              fill="url(#analyticsVisitorsGrad)"
            />
            <Area
              type="monotone"
              dataKey="leads"
              name="Leads"
              stroke="#6366F1"
              strokeWidth={2}
              fill="url(#analyticsLeadsGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
