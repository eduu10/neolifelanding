import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('email_campaigns')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ campaigns: data });
}

export async function POST(request: Request) {
  const supabase = createAdminClient();
  const body = await request.json();

  const { name, subject, html_content, audience_filter } = body as {
    name: string;
    subject: string;
    html_content: string;
    audience_filter: Record<string, unknown>;
  };

  if (!name || !subject) {
    return NextResponse.json(
      { error: 'Nome e assunto sao obrigatorios' },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from('email_campaigns')
    .insert({
      name,
      subject,
      html_content: html_content || '',
      audience_filter: audience_filter || {},
      status: 'draft',
      from_name: 'Neolife Odontologia',
      from_email: 'contato@neolifeodontologia.com.br',
      total_recipients: 0,
      total_sent: 0,
      total_opened: 0,
      total_clicked: 0,
      total_bounced: 0,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
