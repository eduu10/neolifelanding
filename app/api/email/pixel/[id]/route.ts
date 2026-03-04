import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

// 1x1 transparent GIF
const TRANSPARENT_GIF = Buffer.from(
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  'base64'
);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createAdminClient();

  // Update email_sends record
  const { data: send } = await supabase
    .from('email_sends')
    .select('campaign_id, status')
    .eq('id', id)
    .single();

  if (send) {
    // Only update if not already clicked (clicked is a higher-priority status)
    if (send.status !== 'clicked') {
      await supabase
        .from('email_sends')
        .update({
          status: 'opened',
          opened_at: new Date().toISOString(),
        })
        .eq('id', id);
    }

    // Increment total_opened on campaign
    await supabase.rpc('increment_campaign_stat', {
      campaign_id: send.campaign_id,
      stat_column: 'total_opened',
    }).then(({ error }) => {
      // If RPC doesn't exist, do a manual increment
      if (error) {
        supabase
          .from('email_campaigns')
          .select('total_opened')
          .eq('id', send.campaign_id)
          .single()
          .then(({ data: campaign }) => {
            if (campaign) {
              supabase
                .from('email_campaigns')
                .update({ total_opened: (campaign.total_opened || 0) + 1 })
                .eq('id', send.campaign_id)
                .then(() => {});
            }
          });
      }
    });
  }

  return new NextResponse(TRANSPARENT_GIF, {
    status: 200,
    headers: {
      'Content-Type': 'image/gif',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    },
  });
}
