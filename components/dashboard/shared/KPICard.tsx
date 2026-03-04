'use client';

import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'motion/react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import CountUp from '@/components/dashboard/shared/CountUp';

interface KPICardProps {
  title: string;
  value: number;
  change: number;
  icon: LucideIcon;
  color?: 'accent' | 'indigo' | 'amber' | 'red';
  sparklineData?: number[];
  suffix?: string;
  prefix?: string;
  formatValue?: (value: number) => string;
}

const colorMap = {
  accent: {
    bg: 'bg-dash-accent/10',
    text: 'text-dash-accent',
    hex: '#00D4AA',
    glow: 'shadow-dash-accent/5',
  },
  indigo: {
    bg: 'bg-dash-indigo/10',
    text: 'text-dash-indigo',
    hex: '#6366F1',
    glow: 'shadow-dash-indigo/5',
  },
  amber: {
    bg: 'bg-dash-amber/10',
    text: 'text-dash-amber',
    hex: '#F59E0B',
    glow: 'shadow-dash-amber/5',
  },
  red: {
    bg: 'bg-dash-red/10',
    text: 'text-dash-red',
    hex: '#EF4444',
    glow: 'shadow-dash-red/5',
  },
} as const;

export default function KPICard({
  title,
  value,
  change,
  icon: Icon,
  color = 'accent',
  sparklineData = [],
  suffix,
  prefix,
  formatValue,
}: KPICardProps) {
  const colors = colorMap[color];
  const isPositive = change >= 0;

  const chartData = sparklineData.map((v, i) => ({ index: i, value: v }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`group relative overflow-hidden rounded-xl border border-dash-border bg-dash-card/80 p-5 backdrop-blur-sm transition-all duration-300 hover:border-dash-border hover:shadow-lg hover:${colors.glow}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${colors.bg}`}>
          <Icon className={`h-5 w-5 ${colors.text}`} />
        </div>
        <div
          className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
            isPositive
              ? 'bg-dash-accent/10 text-dash-accent'
              : 'bg-dash-red/10 text-dash-red'
          }`}
        >
          {isPositive ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          <span>{isPositive ? '+' : ''}{change.toFixed(1)}%</span>
        </div>
      </div>

      {/* Value */}
      <div className="mt-4">
        <p className="text-sm text-dash-muted">{title}</p>
        <p
          className="mt-1 text-3xl font-bold tracking-tight"
          style={{ fontFamily: 'var(--font-dash-mono)' }}
        >
          {formatValue ? formatValue(value) : <CountUp end={value} suffix={suffix} prefix={prefix} />}
        </p>
      </div>

      {/* Sparkline */}
      {chartData.length > 0 && (
        <div className="mt-3 h-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors.hex} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={colors.hex} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={colors.hex}
                strokeWidth={1.5}
                fill={`url(#gradient-${color})`}
                dot={false}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
}
