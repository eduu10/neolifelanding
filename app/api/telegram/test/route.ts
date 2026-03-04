import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const body = await request.json();
  const { bot_token, chat_id } = body as {
    bot_token?: string;
    chat_id?: string;
  };

  // Mock - just validate inputs and return success
  if (!bot_token || !chat_id) {
    return NextResponse.json(
      { error: 'Bot Token e Chat ID sao obrigatorios' },
      { status: 400 }
    );
  }

  // In production, this would call the Telegram Bot API
  console.log(
    `[MOCK TELEGRAM TEST] Token: ${bot_token.slice(0, 8)}..., Chat: ${chat_id}`
  );
  console.log('[MOCK TELEGRAM TEST] Message: Teste de notificacao Neolife Dashboard');

  return NextResponse.json({
    success: true,
    message: 'Notificacao de teste enviada com sucesso (mock)',
  });
}
