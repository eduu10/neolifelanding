'use client';

import { Eye, Users, Ghost, Clock } from 'lucide-react';
import KPICard from '@/components/dashboard/shared/KPICard';
import VisitorsChart from '@/components/dashboard/overview/VisitorsChart';
import LeadOriginMap from '@/components/dashboard/overview/LeadOriginMap';
import DevicesDonut from '@/components/dashboard/overview/DevicesDonut';
import FunnelChart from '@/components/dashboard/overview/FunnelChart';
import RecentLeads from '@/components/dashboard/overview/RecentLeads';
import SectionEngagement from '@/components/dashboard/overview/SectionEngagement';
import { LoadingSkeleton } from '@/components/dashboard/shared/LoadingSkeleton';
import { useAnalytics } from '@/hooks/use-analytics';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s.toString().padStart(2, '0')}s`;
}

export default function OverviewPage() {
  const { data, isLoading } = useAnalytics();

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-dash-heading)' }}>Overview</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <LoadingSkeleton key={i} variant="card" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2"><LoadingSkeleton variant="chart" /></div>
          <LoadingSkeleton variant="chart" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-dash-heading)' }}>Overview</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Visitantes"
          value={data.visitors.total}
          change={data.visitors.change}
          icon={Eye}
          color="accent"
          sparklineData={data.visitors.sparkline}
        />
        <KPICard
          title="Leads Capturados"
          value={data.leads.total}
          change={data.leads.change}
          icon={Users}
          color="indigo"
          sparklineData={data.leads.sparkline}
        />
        <KPICard
          title="Ghost Leads"
          value={data.ghostLeads.total}
          change={data.ghostLeads.change}
          icon={Ghost}
          color="amber"
          sparklineData={data.ghostLeads.sparkline}
        />
        <KPICard
          title="Tempo Médio"
          value={data.avgTime.value}
          change={data.avgTime.change}
          icon={Clock}
          color="indigo"
          sparklineData={data.avgTime.sparkline}
          suffix=""
          formatValue={formatTime}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <VisitorsChart data={data.visitorsByDay} />
        </div>
        <LeadOriginMap data={data.leadsByCity} />
      </div>

      {/* Insights Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <DevicesDonut data={data.devices} />
        <FunnelChart data={data.funnel} />
        <RecentLeads />
      </div>

      {/* Section Engagement */}
      <SectionEngagement data={data.sections} />
    </div>
  );
}
