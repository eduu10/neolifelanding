-- Neolife Dashboard Schema
-- Execute este SQL no Supabase SQL Editor

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Visitantes unicos
CREATE TABLE visitors (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fingerprint   TEXT NOT NULL UNIQUE,
  first_seen    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  device_type   TEXT,
  browser       TEXT,
  os            TEXT,
  screen_width  INT,
  screen_height INT,
  language      TEXT,
  timezone      TEXT,
  country       TEXT,
  city          TEXT,
  utm_source    TEXT,
  utm_medium    TEXT,
  utm_campaign  TEXT,
  utm_term      TEXT,
  utm_content   TEXT,
  referrer      TEXT,
  visit_count   INT NOT NULL DEFAULT 1,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_visitors_fingerprint ON visitors(fingerprint);
CREATE INDEX idx_visitors_last_seen ON visitors(last_seen);

-- Sessoes
CREATE TABLE sessions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id  UUID NOT NULL REFERENCES visitors(id) ON DELETE CASCADE,
  session_id  TEXT NOT NULL UNIQUE,
  started_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at    TIMESTAMPTZ,
  duration_s  INT DEFAULT 0,
  page_url    TEXT,
  entry_page  TEXT,
  exit_page   TEXT,
  is_bounce   BOOLEAN DEFAULT TRUE,
  utm_source  TEXT,
  utm_medium  TEXT,
  utm_campaign TEXT,
  referrer    TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sessions_visitor ON sessions(visitor_id);
CREATE INDEX idx_sessions_started ON sessions(started_at);

-- Eventos
CREATE TABLE events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id  UUID NOT NULL REFERENCES visitors(id) ON DELETE CASCADE,
  session_id  TEXT NOT NULL,
  event_type  TEXT NOT NULL,
  event_data  JSONB DEFAULT '{}',
  page_url    TEXT,
  timestamp   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_events_visitor ON events(visitor_id);
CREATE INDEX idx_events_session ON events(session_id);
CREATE INDEX idx_events_type ON events(event_type);
CREATE INDEX idx_events_timestamp ON events(timestamp);

-- Leads
CREATE TABLE leads (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id    UUID REFERENCES visitors(id) ON DELETE SET NULL,
  status        TEXT NOT NULL DEFAULT 'cold',
  score         INT NOT NULL DEFAULT 0,
  name          TEXT,
  email         TEXT,
  phone         TEXT,
  location      TEXT,
  goal          TEXT,
  timeframe     TEXT,
  fields_filled INT NOT NULL DEFAULT 0,
  source        TEXT DEFAULT 'organic',
  utm_source    TEXT,
  utm_medium    TEXT,
  utm_campaign  TEXT,
  tags          TEXT[] DEFAULT '{}',
  notes         TEXT,
  is_ghost      BOOLEAN DEFAULT TRUE,
  converted_at  TIMESTAMPTZ,
  contacted_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_visitor ON leads(visitor_id);
CREATE INDEX idx_leads_created ON leads(created_at);

-- Timeline do lead
CREATE TABLE lead_timeline (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id     UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  event_type  TEXT NOT NULL,
  event_data  JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_timeline_lead ON lead_timeline(lead_id);

-- Campanhas de Email
CREATE TABLE email_campaigns (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  subject       TEXT NOT NULL,
  from_name     TEXT NOT NULL DEFAULT 'Neolife Odontologia',
  from_email    TEXT NOT NULL DEFAULT 'contato@neolifeodontologia.com.br',
  html_content  TEXT NOT NULL,
  text_content  TEXT,
  status        TEXT NOT NULL DEFAULT 'draft',
  audience_filter JSONB DEFAULT '{}',
  scheduled_at  TIMESTAMPTZ,
  sent_at       TIMESTAMPTZ,
  total_recipients INT DEFAULT 0,
  total_sent    INT DEFAULT 0,
  total_opened  INT DEFAULT 0,
  total_clicked INT DEFAULT 0,
  total_bounced INT DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Emails enviados
CREATE TABLE email_sends (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id   UUID NOT NULL REFERENCES email_campaigns(id) ON DELETE CASCADE,
  lead_id       UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  email         TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'pending',
  resend_id     TEXT,
  opened_at     TIMESTAMPTZ,
  clicked_at    TIMESTAMPTZ,
  sent_at       TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_email_sends_campaign ON email_sends(campaign_id);
CREATE INDEX idx_email_sends_lead ON email_sends(lead_id);

-- Settings
CREATE TABLE settings (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key         TEXT NOT NULL UNIQUE,
  value       JSONB NOT NULL DEFAULT '{}',
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO settings (key, value) VALUES
  ('telegram', '{"enabled": false, "bot_token": "", "chat_id": ""}'),
  ('tracking', '{"enabled": true, "ghost_leads": true, "heartbeat_interval": 30}'),
  ('tags', '{"available": ["implantes", "lentes", "reabilitacao", "urgencia", "retorno"]}');

-- RLS Policies
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_sends ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Anon pode inserir (tracker)
CREATE POLICY "anon_insert_visitors" ON visitors FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_insert_sessions" ON sessions FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_insert_events" ON events FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_insert_leads" ON leads FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_update_visitors" ON visitors FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_update_leads" ON leads FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_select_visitors" ON visitors FOR SELECT TO anon USING (true);
CREATE POLICY "anon_select_leads" ON leads FOR SELECT TO anon USING (true);

-- Authenticated pode tudo
CREATE POLICY "auth_all_visitors" ON visitors FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all_sessions" ON sessions FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all_events" ON events FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all_leads" ON leads FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all_timeline" ON lead_timeline FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all_campaigns" ON email_campaigns FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all_sends" ON email_sends FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all_settings" ON settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE leads;
ALTER PUBLICATION supabase_realtime ADD TABLE events;
