'use client';

import { useState, useMemo } from 'react';
import LeadFilters from '@/components/dashboard/leads/LeadFilters';
import LeadTable from '@/components/dashboard/leads/LeadTable';
import LeadDetailPanel from '@/components/dashboard/leads/LeadDetailPanel';
import { useLeads } from '@/hooks/use-leads';
import { useDebounce } from '@/hooks/use-debounce';

export default function LeadsPage() {
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const debouncedSearch = useDebounce(searchQuery, 300);

  const params = useMemo(
    () => ({
      status: statusFilter !== 'all' ? statusFilter : undefined,
      search: debouncedSearch || undefined,
      limit: 50,
    }),
    [statusFilter, debouncedSearch]
  );

  const { data, isLoading } = useLeads(params);
  const leads = data?.leads || [];

  return (
    <div className="space-y-6">
      <h1
        className="text-2xl font-bold text-dash-text"
        style={{ fontFamily: 'var(--font-dash-heading)' }}
      >
        Leads
      </h1>

      <LeadFilters
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <LeadTable
        leads={leads}
        isLoading={isLoading}
        selectedLeadId={selectedLeadId}
        onSelectLead={setSelectedLeadId}
      />

      <LeadDetailPanel
        leadId={selectedLeadId}
        onClose={() => setSelectedLeadId(null)}
      />
    </div>
  );
}
