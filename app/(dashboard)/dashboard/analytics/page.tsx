'use client';

import { useAnalytics } from '@/hooks/use-analytics';
import LoadingSkeleton from '@/components/dashboard/shared/LoadingSkeleton';
import VisitorsByHour from '@/components/dashboard/analytics/VisitorsByHour';
import VisitorsByDay from '@/components/dashboard/analytics/VisitorsByDay';
import HeatmapChart from '@/components/dashboard/analytics/HeatmapChart';
import UTMBreakdown from '@/components/dashboard/analytics/UTMBreakdown';
import TopReferrers from '@/components/dashboard/analytics/TopReferrers';
import ScrollDistribution from '@/components/dashboard/analytics/ScrollDistribution';
import CTARankings from '@/components/dashboard/analytics/CTARankings';

export default function AnalyticsPage() {
  const { data, isLoading } = useAnalytics();

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <h1
          className="text-2xl font-bold"
          style={{ fontFamily: 'var(--font-dash-heading)' }}
        >
          Analytics Detalhado
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <LoadingSkeleton variant="chart" />
          <LoadingSkeleton variant="chart" />
        </div>
        <LoadingSkeleton variant="chart" />
        <LoadingSkeleton variant="chart" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <LoadingSkeleton variant="chart" />
          <LoadingSkeleton variant="chart" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1
        className="text-2xl font-bold"
        style={{ fontFamily: 'var(--font-dash-heading)' }}
      >
        Analytics Detalhado
      </h1>

      {/* Charts Row: Visitors by Hour & Visitors by Day */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <VisitorsByHour data={data.visitorsByHour} />
        <VisitorsByDay data={data.visitorsByDay} />
      </div>

      {/* Heatmap - full width */}
      <HeatmapChart data={data.heatmap} />

      {/* UTM Breakdown - full width table */}
      <UTMBreakdown data={data.utmBreakdown} />

      {/* Charts Row: Top Referrers & Scroll Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TopReferrers data={data.topReferrers} />
        <ScrollDistribution data={data.scrollDepth} />
      </div>

      {/* CTA Rankings - full width */}
      <CTARankings data={data.ctaClicks} />
    </div>
  );
}
