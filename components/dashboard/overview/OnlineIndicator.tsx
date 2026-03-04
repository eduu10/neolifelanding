'use client';

import { useRealtimeVisitors } from '@/hooks/use-analytics';

export default function OnlineIndicator() {
  const { data } = useRealtimeVisitors();
  const online = data?.online || 0;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-dash-card border border-dash-border">
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
      </span>
      <span className="text-xs text-dash-secondary" style={{ fontFamily: 'var(--font-dash-mono)' }}>
        {online} online
      </span>
    </div>
  );
}
