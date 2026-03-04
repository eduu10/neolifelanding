export interface Visitor {
  id: string;
  fingerprint: string;
  first_seen: string;
  last_seen: string;
  device_type: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  screen_width: number;
  screen_height: number;
  language: string;
  timezone: string;
  country: string;
  city: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  referrer: string | null;
  visit_count: number;
  created_at: string;
}

export interface Session {
  id: string;
  visitor_id: string;
  session_id: string;
  started_at: string;
  ended_at: string | null;
  duration_s: number;
  page_url: string;
  entry_page: string;
  exit_page: string | null;
  is_bounce: boolean;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  referrer: string | null;
  created_at: string;
}

export interface TrackingEvent {
  id: string;
  visitor_id: string;
  session_id: string;
  event_type: string;
  event_data: Record<string, unknown>;
  page_url: string;
  timestamp: string;
  created_at: string;
}

export type LeadStatus = 'cold' | 'warm' | 'hot' | 'converted' | 'contacted' | 'qualified' | 'lost';

export interface Lead {
  id: string;
  visitor_id: string | null;
  status: LeadStatus;
  score: number;
  name: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  goal: string | null;
  timeframe: string | null;
  fields_filled: number;
  source: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  tags: string[];
  notes: string | null;
  is_ghost: boolean;
  converted_at: string | null;
  contacted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface LeadTimelineEntry {
  id: string;
  lead_id: string;
  event_type: string;
  event_data: Record<string, unknown>;
  created_at: string;
}

export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  from_name: string;
  from_email: string;
  html_content: string;
  text_content: string | null;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused';
  audience_filter: Record<string, unknown>;
  scheduled_at: string | null;
  sent_at: string | null;
  total_recipients: number;
  total_sent: number;
  total_opened: number;
  total_clicked: number;
  total_bounced: number;
  created_at: string;
  updated_at: string;
}

export interface EmailSend {
  id: string;
  campaign_id: string;
  lead_id: string;
  email: string;
  status: 'pending' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'failed';
  resend_id: string | null;
  opened_at: string | null;
  clicked_at: string | null;
  sent_at: string | null;
  created_at: string;
}

export interface AnalyticsData {
  visitors: { total: number; change: number; sparkline: number[] };
  leads: { total: number; change: number; sparkline: number[] };
  ghostLeads: { total: number; change: number; sparkline: number[] };
  avgTime: { value: number; change: number; sparkline: number[] };
  visitorsByHour: { hour: string; count: number }[];
  visitorsByDay: { date: string; count: number; leads: number }[];
  devices: { name: string; value: number }[];
  sections: { name: string; views: number; avgTime: number; percentage: number }[];
  scrollDepth: { depth: string; count: number }[];
  utmBreakdown: { source: string; medium: string; campaign: string; visits: number; leads: number }[];
  topReferrers: { referrer: string; count: number }[];
  ctaClicks: { name: string; clicks: number }[];
  funnel: { step: string; count: number; percentage: number }[];
  leadsByCity: { city: string; count: number; percentage: number }[];
  heatmap: { day: number; hour: number; count: number }[];
}

export interface DashboardPeriod {
  label: string;
  value: 'today' | '7d' | '30d' | 'custom';
  from: Date;
  to: Date;
}

export interface TrackingPayload {
  visitor_id: string;
  session_id: string;
  fingerprint: string;
  event_type: string;
  event_data: Record<string, unknown>;
  page_url: string;
  referrer: string | null;
  timestamp: string;
  device: {
    device_type: string;
    browser: string;
    os: string;
    screen_width: number;
    screen_height: number;
    language: string;
    timezone: string;
  };
  utm: {
    utm_source: string | null;
    utm_medium: string | null;
    utm_campaign: string | null;
    utm_term: string | null;
    utm_content: string | null;
  };
  tracker_version: string;
}
