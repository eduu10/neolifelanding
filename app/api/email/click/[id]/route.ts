import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return NextResponse.json(
      { error: 'URL de destino nao fornecida' },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();

  // Update email_sends record
  const { data: send } = await supabase
    .from('email_sends')
    .select('campaign_id')
    .eq('id', id)
    .single();

  if (send) {
    await supabase
      .from('email_sends')
      .update({
        status: 'clicked',
        clicked_at: new Date().toISOString(),
      })
      .eq('id', id);

    // Increment total_clicked on campaign
    await supabase.rpc('increment_campaign_stat', {
      campaign_id: send.campaign_id,
      stat_column: 'total_clicked',
    }).then(({ error }) => {
      // If RPC doesn't exist, do a manual increment
      if (error) {
        supabase
          .from('email_campaigns')
          .select('total_clicked')
          .eq('id', send.campaign_id)
          .single()
          .then(({ data: campaign }) => {
            if (campaign) {
              supabase
                .from('email_campaigns')
                .update({
                  total_clicked: (campaign.total_clicked || 0) + 1,
                })
                .eq('id', send.campaign_id)
                .then(() => {});
            }
          });
      }
    });
  }

  return NextResponse.redirect(targetUrl);
}
