import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createAdminClient();

  // Get campaign
  const { data: campaign, error: campError } = await supabase
    .from('email_campaigns')
    .select('*')
    .eq('id', id)
    .single();

  if (campError || !campaign) {
    return NextResponse.json(
      { error: 'Campanha nao encontrada' },
      { status: 404 }
    );
  }

  if (campaign.status === 'sent') {
    return NextResponse.json(
      { error: 'Campanha ja foi enviada' },
      { status: 400 }
    );
  }

  // Build lead query based on audience_filter
  const filter = campaign.audience_filter as Record<string, unknown>;
  let query = supabase.from('leads').select('id, email, name');

  // Filter by status if provided
  if (filter.statuses && Array.isArray(filter.statuses) && filter.statuses.length > 0) {
    query = query.in('status', filter.statuses as string[]);
  }

  // Filter by tags if provided
  if (filter.tags && Array.isArray(filter.tags) && filter.tags.length > 0) {
    query = query.overlaps('tags', filter.tags as string[]);
  }

  // Only leads with email
  query = query.not('email', 'is', null);

  const { data: leads, error: leadsError } = await query;

  if (leadsError) {
    return NextResponse.json({ error: leadsError.message }, { status: 500 });
  }

  const validLeads = (leads || []).filter(
    (l) => l.email && l.email.trim() !== ''
  );

  if (validLeads.length === 0) {
    return NextResponse.json(
      { error: 'Nenhum lead encontrado com os filtros selecionados' },
      { status: 400 }
    );
  }

  // Create email_sends records (MOCK - no actual emails sent)
  const emailSends = validLeads.map((lead) => ({
    campaign_id: id,
    lead_id: lead.id,
    email: lead.email!,
    status: 'sent' as const,
    sent_at: new Date().toISOString(),
  }));

  const { error: sendsError } = await supabase
    .from('email_sends')
    .insert(emailSends);

  if (sendsError) {
    return NextResponse.json({ error: sendsError.message }, { status: 500 });
  }

  // Update campaign stats
  const { error: updateError } = await supabase
    .from('email_campaigns')
    .update({
      status: 'sent',
      sent_at: new Date().toISOString(),
      total_recipients: validLeads.length,
      total_sent: validLeads.length,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  // NOTE: This is a MOCK - no actual emails are sent
  console.log(
    `[MOCK EMAIL] Campaign "${campaign.name}" sent to ${validLeads.length} leads`
  );

  return NextResponse.json({
    success: true,
    total_sent: validLeads.length,
  });
}
