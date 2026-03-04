import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = createAdminClient();
  const cutoff = new Date(Date.now() - 60000).toISOString(); // Last 60 seconds

  const { count } = await supabase
    .from('events')
    .select('session_id', { count: 'exact' })
    .eq('event_type', 'heartbeat')
    .gte('timestamp', cutoff);

  return NextResponse.json({ online: count || 0 });
}
