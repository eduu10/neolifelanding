import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('settings')
    .select('key, value');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Convert array of { key, value } into a key-value object
  const settings: Record<string, string> = {};
  (data || []).forEach((row) => {
    settings[row.key] = row.value;
  });

  return NextResponse.json(settings);
}

export async function PATCH(request: Request) {
  const supabase = createAdminClient();
  const body = await request.json();

  const { key, value } = body as { key: string; value: string };

  if (!key) {
    return NextResponse.json(
      { error: 'Campo "key" e obrigatorio' },
      { status: 400 }
    );
  }

  // Upsert the setting
  const { error } = await supabase
    .from('settings')
    .upsert(
      { key, value, updated_at: new Date().toISOString() },
      { onConflict: 'key' }
    );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, key, value });
}
