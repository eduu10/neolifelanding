import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import type { Lead, LeadTimelineEntry } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createAdminClient();

  const [leadRes, timelineRes] = await Promise.all([
    supabase.from('leads').select('*').eq('id', id).single(),
    supabase
      .from('lead_timeline')
      .select('*')
      .eq('lead_id', id)
      .order('created_at', { ascending: false }),
  ]);

  if (leadRes.error) {
    return NextResponse.json({ error: leadRes.error.message }, { status: 404 });
  }

  return NextResponse.json({
    lead: leadRes.data as Lead,
    timeline: (timelineRes.data || []) as LeadTimelineEntry[],
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const supabase = createAdminClient();

  // If status is being changed, track the old status for timeline
  let oldStatus: string | null = null;
  if (body.status) {
    const { data: existing } = await supabase
      .from('leads')
      .select('status')
      .eq('id', id)
      .single();
    oldStatus = existing?.status || null;
  }

  const updateData: Record<string, unknown> = {};
  const allowedFields = [
    'name', 'email', 'phone', 'location', 'goal', 'timeframe',
    'status', 'score', 'tags', 'notes', 'is_ghost',
    'converted_at', 'contacted_at',
  ];

  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      updateData[field] = body[field];
    }
  }

  updateData.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('leads')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Add timeline entry for status changes
  if (body.status && oldStatus && oldStatus !== body.status) {
    await supabase.from('lead_timeline').insert({
      lead_id: id,
      event_type: 'status_change',
      event_data: {
        from: oldStatus,
        to: body.status,
      },
    });
  }

  // Add timeline entry for note changes
  if (body.notes !== undefined && body._addNoteTimeline) {
    await supabase.from('lead_timeline').insert({
      lead_id: id,
      event_type: 'note_added',
      event_data: { message: 'Nota atualizada' },
    });
  }

  return NextResponse.json(data as Lead);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createAdminClient();

  // Delete timeline entries first
  await supabase.from('lead_timeline').delete().eq('lead_id', id);

  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
