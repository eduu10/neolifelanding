'use client';

import { Search, Plus } from 'lucide-react';
import Link from 'next/link';
import ExportCSV from './ExportCSV';

interface LeadFiltersProps {
  statusFilter: string;
  onStatusChange: (status: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const STATUS_PILLS = [
  { key: 'all', label: 'Todos', color: '#A1A1AA' },
  { key: 'hot', label: 'Quente', color: '#EF4444' },
  { key: 'warm', label: 'Morno', color: '#F59E0B' },
  { key: 'cold', label: 'Frio', color: '#94A3B8' },
  { key: 'ghost', label: 'Ghost', color: '#71717A' },
  { key: 'converted', label: 'Convertido', color: '#00D4AA' },
] as const;

export default function LeadFilters({
  statusFilter,
  onStatusChange,
  searchQuery,
  onSearchChange,
}: LeadFiltersProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Status Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {STATUS_PILLS.map((pill) => {
          const isActive = statusFilter === pill.key;
          return (
            <button
              key={pill.key}
              onClick={() => onStatusChange(pill.key)}
              className="rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200"
              style={{
                backgroundColor: isActive ? `${pill.color}20` : 'transparent',
                color: isActive ? pill.color : '#71717A',
                border: `1px solid ${isActive ? `${pill.color}40` : '#1E1E2E'}`,
              }}
            >
              {pill.label}
            </button>
          );
        })}
      </div>

      {/* Search + Actions */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dash-muted" />
          <input
            type="text"
            placeholder="Buscar nome, email ou telefone..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-9 w-64 rounded-lg border border-dash-border bg-dash-bg/50 pl-9 pr-3 text-sm text-dash-text placeholder:text-dash-muted focus:border-dash-accent/50 focus:outline-none focus:ring-1 focus:ring-dash-accent/30 transition-colors"
            style={{ fontFamily: 'var(--font-dash-body)' }}
          />
        </div>

        <ExportCSV />

        <Link
          href="/dashboard/campaigns/new"
          className="inline-flex h-9 items-center gap-2 rounded-lg bg-dash-accent/15 px-3.5 text-xs font-medium text-dash-accent transition-colors hover:bg-dash-accent/25"
        >
          <Plus className="h-4 w-4" />
          Nova Campanha
        </Link>
      </div>
    </div>
  );
}
