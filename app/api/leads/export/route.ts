import { createAdminClient } from '@/lib/supabase/server';
import { LEAD_STATUS_CONFIG, TIMEFRAME_LABELS } from '@/lib/constants';
import type { Lead, LeadStatus } from '@/lib/types';
import Papa from 'papaparse';
import { format } from 'date-fns';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const leads = (data || []) as Lead[];

  const rows = leads.map((lead) => ({
    Nome: lead.name || 'Anônimo',
    Email: lead.email || '',
    Telefone: lead.phone || '',
    Cidade: lead.location || '',
    Status: LEAD_STATUS_CONFIG[lead.status as LeadStatus]?.label || lead.status,
    Score: lead.score,
    Queixa: lead.goal || '',
    'Previsão': TIMEFRAME_LABELS[lead.timeframe || ''] || lead.timeframe || '',
    Ghost: lead.is_ghost ? 'Sim' : 'Não',
    Data: format(new Date(lead.created_at), 'dd/MM/yyyy HH:mm'),
  }));

  const csv = Papa.unparse(rows);

  return new Response(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="leads-${format(new Date(), 'yyyy-MM-dd')}.csv"`,
    },
  });
}
