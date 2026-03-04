import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data: campaign, error } = await supabase
    .from('email_campaigns')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !campaign) {
    return NextResponse.json(
      { error: 'Campanha nao encontrada' },
      { status: 404 }
    );
  }

  // Get individual sends for stats
  const { data: sends } = await supabase
    .from('email_sends')
    .select('*')
    .eq('campaign_id', id)
    .order('created_at', { ascending: false });

  return NextResponse.json({ campaign, sends: sends || [] });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createAdminClient();
  const body = await request.json();

  const allowedFields = [
    'name',
    'subject',
    'html_content',
    'status',
    'audience_filter',
  ];
  const updates: Record<string, unknown> = {};

  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      updates[field] = body[field];
    }
  }

  updates.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('email_campaigns')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createAdminClient();

  // Delete related sends first
  await supabase.from('email_sends').delete().eq('campaign_id', id);

  const { error } = await supabase
    .from('email_campaigns')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
