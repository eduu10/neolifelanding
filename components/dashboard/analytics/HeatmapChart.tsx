'use client';

import { useState, useMemo, useCallback } from 'react';

interface Props {
  data: { day: number; hour: number; count: number }[];
}

const DAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

function getCellColor(count: number, maxCount: number): string {
  if (maxCount === 0 || count === 0) return 'rgba(0, 212, 170, 0.05)';
  const intensity = count / maxCount;
  const alpha = 0.1 + intensity * 0.8;
  return `rgba(0, 212, 170, ${alpha.toFixed(2)})`;
}

export default function HeatmapChart({ data }: Props) {
  const [tooltip, setTooltip] = useState<{
    day: number;
    hour: number;
    count: number;
    x: number;
    y: number;
  } | null>(null);

  const { countMap, maxCount } = useMemo(() => {
    const map = new Map<string, number>();
    let max = 0;
    for (const item of data) {
      const key = `${item.day}-${item.hour}`;
      map.set(key, item.count);
      if (item.count > max) max = item.count;
    }
    return { countMap: map, maxCount: max };
  }, [data]);

  const getCount = useCallback(
    (day: number, hour: number) => countMap.get(`${day}-${hour}`) ?? 0,
    [countMap],
  );

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent, day: number, hour: number, count: number) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const parentRect = e.currentTarget.closest('.heatmap-container')?.getBoundingClientRect();
      if (parentRect) {
        setTooltip({
          day,
          hour,
          count,
          x: rect.left - parentRect.left + rect.width / 2,
          y: rect.top - parentRect.top - 8,
        });
      }
    },
    [],
  );

  const handleMouseLeave = useCallback(() => setTooltip(null), []);

  return (
    <div className="rounded-2xl bg-dash-card/80 backdrop-blur-xl border border-dash-border p-6">
      <h3
        className="text-sm font-semibold text-dash-text mb-4"
        style={{ fontFamily: 'var(--font-dash-heading)' }}
      >
        Mapa de Calor - Visitantes
      </h3>
      <div className="heatmap-container relative overflow-x-auto">
        {/* Hour labels */}
        <div className="flex ml-10 mb-1 gap-[2px]">
          {HOURS.map((h) => (
            <div
              key={h}
              className="flex-1 min-w-[20px] text-center text-[10px] text-dash-muted"
              style={{ fontFamily: 'var(--font-dash-mono)' }}
            >
              {h % 3 === 0 ? h : ''}
            </div>
          ))}
        </div>

        {/* Grid rows */}
        {DAY_LABELS.map((dayLabel, dayIndex) => (
          <div key={dayLabel} className="flex items-center gap-[2px] mb-[2px]">
            <div className="w-10 text-xs text-dash-secondary shrink-0 text-right pr-2">
              {dayLabel}
            </div>
            {HOURS.map((hour) => {
              const count = getCount(dayIndex, hour);
              return (
                <div
                  key={hour}
                  className="flex-1 min-w-[20px] h-5 rounded-sm cursor-pointer transition-all duration-150 hover:ring-1 hover:ring-dash-accent/50"
                  style={{ backgroundColor: getCellColor(count, maxCount) }}
                  onMouseEnter={(e) => handleMouseEnter(e, dayIndex, hour, count)}
                  onMouseLeave={handleMouseLeave}
                />
              );
            })}
          </div>
        ))}

        {/* Tooltip */}
        {tooltip && (
          <div
            className="absolute z-10 pointer-events-none px-3 py-2 rounded-lg text-xs"
            style={{
              background: '#12121A',
              border: '1px solid #1E1E2E',
              color: '#E4E4E7',
              fontSize: 12,
              left: tooltip.x,
              top: tooltip.y,
              transform: 'translate(-50%, -100%)',
            }}
          >
            <span className="font-semibold">{DAY_LABELS[tooltip.day]}</span>
            {' '}
            <span style={{ fontFamily: 'var(--font-dash-mono)' }}>
              {String(tooltip.hour).padStart(2, '0')}:00
            </span>
            {' - '}
            <span className="text-dash-accent" style={{ fontFamily: 'var(--font-dash-mono)' }}>
              {tooltip.count}
            </span>
            {' visitas'}
          </div>
        )}
      </div>
    </div>
  );
}
