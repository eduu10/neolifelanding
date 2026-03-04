import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { subDays, subHours, startOfDay, startOfHour, format } from 'date-fns';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period') || '7d';
  const supabase = createAdminClient();

  const now = new Date();
  let from: Date;
  switch (period) {
    case 'today': from = startOfDay(now); break;
    case '30d': from = subDays(now, 30); break;
    default: from = subDays(now, 7);
  }
  const prevFrom = new Date(from.getTime() - (now.getTime() - from.getTime()));
  const fromISO = from.toISOString();
  const prevFromISO = prevFrom.toISOString();

  // Parallel queries
  const [
    visitorsRes, prevVisitorsRes,
    leadsRes, prevLeadsRes,
    ghostRes, prevGhostRes,
    sessionsRes,
    eventsRes,
    devicesRes,
    scrollRes,
    ctaRes,
    sectionRes,
    leadsByCityRes,
    utmRes,
    referrerRes,
  ] = await Promise.all([
    supabase.from('visitors').select('id', { count: 'exact' }).gte('last_seen', fromISO),
    supabase.from('visitors').select('id', { count: 'exact' }).gte('last_seen', prevFromISO).lt('last_seen', fromISO),
    supabase.from('leads').select('id', { count: 'exact' }).gte('created_at', fromISO),
    supabase.from('leads').select('id', { count: 'exact' }).gte('created_at', prevFromISO).lt('created_at', fromISO),
    supabase.from('leads').select('id', { count: 'exact' }).eq('is_ghost', true).gte('created_at', fromISO),
    supabase.from('leads').select('id', { count: 'exact' }).eq('is_ghost', true).gte('created_at', prevFromISO).lt('created_at', fromISO),
    supabase.from('sessions').select('duration_s').gte('started_at', fromISO),
    supabase.from('events').select('event_type, timestamp, event_data').gte('timestamp', fromISO).order('timestamp', { ascending: true }),
    supabase.from('visitors').select('device_type').gte('last_seen', fromISO),
    supabase.from('events').select('event_data').eq('event_type', 'scroll').gte('timestamp', fromISO),
    supabase.from('events').select('event_data').eq('event_type', 'cta_click').gte('timestamp', fromISO),
    supabase.from('events').select('event_data').eq('event_type', 'section_view').gte('timestamp', fromISO),
    supabase.from('leads').select('location').gte('created_at', fromISO).not('location', 'is', null),
    supabase.from('visitors').select('utm_source, utm_medium, utm_campaign').gte('last_seen', fromISO).not('utm_source', 'is', null),
    supabase.from('visitors').select('referrer').gte('last_seen', fromISO).not('referrer', 'is', null),
  ]);

  const vCount = visitorsRes.count || 0;
  const pvCount = prevVisitorsRes.count || 0;
  const lCount = leadsRes.count || 0;
  const plCount = prevLeadsRes.count || 0;
  const gCount = ghostRes.count || 0;
  const pgCount = prevGhostRes.count || 0;

  const calcChange = (curr: number, prev: number) => prev === 0 ? (curr > 0 ? 100 : 0) : Math.round(((curr - prev) / prev) * 100);

  // Average session duration
  const durations = (sessionsRes.data || []).map(s => s.duration_s || 0).filter(d => d > 0);
  const avgDuration = durations.length > 0 ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : 0;

  // Visitors by hour (last 24h)
  const last24h = subHours(now, 24);
  const hourlyEvents = (eventsRes.data || []).filter(e => e.event_type === 'pageview' && new Date(e.timestamp) >= last24h);
  const hourlyMap: Record<string, number> = {};
  for (let i = 0; i < 24; i++) {
    const h = format(subHours(now, 23 - i), 'HH:00');
    hourlyMap[h] = 0;
  }
  hourlyEvents.forEach(e => {
    const h = format(new Date(e.timestamp), 'HH:00');
    if (hourlyMap[h] !== undefined) hourlyMap[h]++;
  });
  const visitorsByHour = Object.entries(hourlyMap).map(([hour, count]) => ({ hour, count }));

  // Visitors by day
  const dailyMap: Record<string, { count: number; leads: number }> = {};
  const events = eventsRes.data || [];
  const pageviews = events.filter(e => e.event_type === 'pageview');
  pageviews.forEach(e => {
    const d = format(new Date(e.timestamp), 'dd/MM');
    if (!dailyMap[d]) dailyMap[d] = { count: 0, leads: 0 };
    dailyMap[d].count++;
  });
  const visitorsByDay = Object.entries(dailyMap).map(([date, data]) => ({ date, ...data }));

  // Devices
  const deviceMap: Record<string, number> = {};
  (devicesRes.data || []).forEach(v => {
    const type = v.device_type || 'desktop';
    deviceMap[type] = (deviceMap[type] || 0) + 1;
  });
  const totalDevices = Object.values(deviceMap).reduce((a, b) => a + b, 0) || 1;
  const devices = Object.entries(deviceMap).map(([name, value]) => ({
    name: name === 'mobile' ? 'Mobile' : name === 'tablet' ? 'Tablet' : 'Desktop',
    value: Math.round((value / totalDevices) * 100),
  }));

  // Scroll depth
  const scrollMap: Record<string, number> = { '25%': 0, '50%': 0, '75%': 0, '100%': 0 };
  (scrollRes.data || []).forEach(e => {
    const depth = (e.event_data as Record<string, number>)?.depth;
    if (depth) scrollMap[depth + '%'] = (scrollMap[depth + '%'] || 0) + 1;
  });
  const scrollDepth = Object.entries(scrollMap).map(([depth, count]) => ({ depth, count }));

  // CTA clicks
  const ctaMap: Record<string, number> = {};
  (ctaRes.data || []).forEach(e => {
    const text = (e.event_data as Record<string, string>)?.text || 'Unknown';
    ctaMap[text] = (ctaMap[text] || 0) + 1;
  });
  const ctaClicks = Object.entries(ctaMap).map(([name, clicks]) => ({ name, clicks })).sort((a, b) => b.clicks - a.clicks);

  // Sections
  const sectionMap: Record<string, { views: number; totalDuration: number; durations: number }> = {};
  (sectionRes.data || []).forEach(e => {
    const data = e.event_data as Record<string, string | number>;
    const section = data?.section as string || '';
    if (!section) return;
    if (!sectionMap[section]) sectionMap[section] = { views: 0, totalDuration: 0, durations: 0 };
    if (data.action === 'enter') sectionMap[section].views++;
    if (data.action === 'exit' && typeof data.duration_s === 'number') {
      sectionMap[section].totalDuration += data.duration_s;
      sectionMap[section].durations++;
    }
  });
  const maxViews = Math.max(...Object.values(sectionMap).map(s => s.views), 1);
  const sectionNames: Record<string, string> = {
    hero: 'Hero', metodo: 'Metodologia', logistica: 'Para EUA',
    seguranca: 'Excelência', casos: 'Casos Clínicos', avaliacao: 'Formulário'
  };
  const sections = Object.entries(sectionMap).map(([id, data]) => ({
    name: sectionNames[id] || id,
    views: data.views,
    avgTime: data.durations > 0 ? Math.round(data.totalDuration / data.durations) : 0,
    percentage: Math.round((data.views / maxViews) * 100),
  }));

  // Leads by city
  const cityMap: Record<string, number> = {};
  (leadsByCityRes.data || []).forEach(l => {
    const city = l.location || 'Unknown';
    cityMap[city] = (cityMap[city] || 0) + 1;
  });
  const totalCityLeads = Object.values(cityMap).reduce((a, b) => a + b, 0) || 1;
  const leadsByCity = Object.entries(cityMap)
    .map(([city, count]) => ({ city, count, percentage: Math.round((count / totalCityLeads) * 100) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // UTM breakdown
  const utmMap: Record<string, { visits: number; leads: number }> = {};
  (utmRes.data || []).forEach(v => {
    const key = `${v.utm_source || ''}|${v.utm_medium || ''}|${v.utm_campaign || ''}`;
    if (!utmMap[key]) utmMap[key] = { visits: 0, leads: 0 };
    utmMap[key].visits++;
  });
  const utmBreakdown = Object.entries(utmMap).map(([key, data]) => {
    const [source, medium, campaign] = key.split('|');
    return { source, medium, campaign, ...data };
  });

  // Top referrers
  const refMap: Record<string, number> = {};
  (referrerRes.data || []).forEach(v => {
    const ref = v.referrer || 'Direct';
    refMap[ref] = (refMap[ref] || 0) + 1;
  });
  const topReferrers = Object.entries(refMap)
    .map(([referrer, count]) => ({ referrer, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Funnel
  const totalPageviews = pageviews.length;
  const scrolled50 = (scrollRes.data || []).filter(e => ((e.event_data as Record<string, number>)?.depth || 0) >= 50).length;
  const ctaTotal = (ctaRes.data || []).length;
  const formStarts = events.filter(e => e.event_type === 'form_focus').length;
  const formSubmits = events.filter(e => e.event_type === 'form_submit').length;
  const funnelBase = totalPageviews || 1;
  const funnel = [
    { step: 'Visitou', count: totalPageviews, percentage: 100 },
    { step: 'Scrollou 50%', count: scrolled50, percentage: Math.round((scrolled50 / funnelBase) * 100) },
    { step: 'Clicou CTA', count: ctaTotal, percentage: Math.round((ctaTotal / funnelBase) * 100) },
    { step: 'Iniciou Form', count: formStarts, percentage: Math.round((formStarts / funnelBase) * 100) },
    { step: 'Converteu', count: formSubmits, percentage: Math.round((formSubmits / funnelBase) * 100) },
  ];

  // Sparkline data (last 7 points)
  const sparklineVisitors = visitorsByHour.slice(-7).map(v => v.count);
  const sparklineLeads = Array(7).fill(0);
  const sparklineGhost = Array(7).fill(0);
  const sparklineTime = Array(7).fill(avgDuration);

  // Heatmap
  const heatmap: { day: number; hour: number; count: number }[] = [];
  const heatmapMap: Record<string, number> = {};
  pageviews.forEach(e => {
    const d = new Date(e.timestamp);
    const key = `${d.getDay()}-${d.getHours()}`;
    heatmapMap[key] = (heatmapMap[key] || 0) + 1;
  });
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      heatmap.push({ day, hour, count: heatmapMap[`${day}-${hour}`] || 0 });
    }
  }

  return NextResponse.json({
    visitors: { total: vCount, change: calcChange(vCount, pvCount), sparkline: sparklineVisitors },
    leads: { total: lCount, change: calcChange(lCount, plCount), sparkline: sparklineLeads },
    ghostLeads: { total: gCount, change: calcChange(gCount, pgCount), sparkline: sparklineGhost },
    avgTime: { value: avgDuration, change: 0, sparkline: sparklineTime },
    visitorsByHour,
    visitorsByDay,
    devices,
    sections,
    scrollDepth,
    utmBreakdown,
    topReferrers,
    ctaClicks,
    funnel,
    leadsByCity,
    heatmap,
  });
}
