'use client';

import type { LeadStatus } from '@/lib/types';
import { LEAD_STATUS_CONFIG } from '@/lib/constants';

interface BadgeProps {
  status: LeadStatus;
  size?: 'sm' | 'md';
}

export default function Badge({ status, size = 'md' }: BadgeProps) {
  const config = LEAD_STATUS_CONFIG[status];

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';
  const dotSize = size === 'sm' ? 'h-1.5 w-1.5' : 'h-2 w-2';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${sizeClasses}`}
      style={{ backgroundColor: config.bg, color: config.color }}
    >
      <span
        className={`${dotSize} shrink-0 rounded-full`}
        style={{ backgroundColor: config.color }}
      />
      {config.label}
    </span>
  );
}
