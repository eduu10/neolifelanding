import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import type { Lead } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const search = searchParams.get('search');
  const sort = searchParams.get('sort') || 'created_at';
  const order = searchParams.get('order') || 'desc';
  const limit = parseInt(searchParams.get('limit') || '50', 10);
  const offset = parseInt(searchParams.get('offset') || '0', 10);

  const supabase = createAdminClient();

  let query = supabase
    .from('leads')
    .select('*', { count: 'exact' });

  if (status && status !== 'all') {
    if (status === 'ghost') {
      query = query.eq('is_ghost', true);
    } else {
      query = query.eq('status', status);
    }
  }

  if (search) {
    query = query.or(
      `name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`
    );
  }

  const ascending = order === 'asc';
  query = query
    .order(sort, { ascending })
    .range(offset, offset + limit - 1);

  const { data, count, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    leads: (data || []) as Lead[],
    total: count || 0,
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const supabase = createAdminClient();

  const newLead = {
    name: body.name || null,
    email: body.email || null,
    phone: body.phone || null,
    location: body.location || null,
    goal: body.goal || null,
    timeframe: body.timeframe || null,
    status: body.status || 'cold',
    score: body.score || 0,
    source: body.source || 'manual',
    tags: body.tags || [],
    notes: body.notes || null,
    is_ghost: false,
    fields_filled: 0,
  };

  const { data, error } = await supabase
    .from('leads')
    .insert(newLead)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Add timeline entry for manual creation
  await supabase.from('lead_timeline').insert({
    lead_id: data.id,
    event_type: 'note_added',
    event_data: { message: 'Lead criado manualmente' },
  });

  return NextResponse.json(data as Lead, { status: 201 });
}
