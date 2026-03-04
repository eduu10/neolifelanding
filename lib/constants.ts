export const DASHBOARD_COLORS = {
  bg: '#0A0A0F',
  card: '#12121A',
  cardBorder: '#1E1E2E',
  cardHover: '#1A1A2E',
  accent: '#00D4AA',
  accentDim: '#00D4AA40',
  indigo: '#6366F1',
  indigoDim: '#6366F140',
  amber: '#F59E0B',
  amberDim: '#F59E0B40',
  red: '#EF4444',
  redDim: '#EF444440',
  green: '#22C55E',
  text: '#E4E4E7',
  textSecondary: '#A1A1AA',
  textMuted: '#71717A',
} as const;

export const SECTION_NAMES: Record<string, string> = {
  hero: 'Hero',
  metodo: 'Metodologia',
  logistica: 'Para Quem Mora nos EUA',
  seguranca: 'Excelência',
  casos: 'Casos Clínicos',
  avaliacao: 'Formulário',
};

export const LEAD_STATUS_CONFIG = {
  cold: { label: 'Frio', color: '#94A3B8', bg: 'rgba(148,163,184,0.15)', icon: '❄️' },
  warm: { label: 'Morno', color: '#F59E0B', bg: 'rgba(245,158,11,0.15)', icon: '🌡️' },
  hot: { label: 'Quente', color: '#EF4444', bg: 'rgba(239,68,68,0.15)', icon: '🔥' },
  converted: { label: 'Convertido', color: '#00D4AA', bg: 'rgba(0,212,170,0.15)', icon: '✅' },
  contacted: { label: 'Contactado', color: '#6366F1', bg: 'rgba(99,102,241,0.15)', icon: '📞' },
  qualified: { label: 'Qualificado', color: '#8B5CF6', bg: 'rgba(139,92,246,0.15)', icon: '⭐' },
  lost: { label: 'Perdido', color: '#64748B', bg: 'rgba(100,116,139,0.15)', icon: '💤' },
} as const;

export const TIMEFRAME_LABELS: Record<string, string> = {
  imediato: 'Imediato (30 dias)',
  '3meses': 'Curto Prazo (1-3 meses)',
  '6meses': 'Médio Prazo (3-6 meses)',
  planejamento: 'Planejamento (6+ meses)',
};

export const TRACKER_VERSION = '1.0.0';
