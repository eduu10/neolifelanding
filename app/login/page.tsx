'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError('Credenciais inválidas');
      setLoading(false);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0A0A0F' }}>
      <div className="w-full max-w-md px-6">
        <div
          className="rounded-2xl p-8 backdrop-blur-xl border"
          style={{
            background: 'rgba(18, 18, 26, 0.8)',
            borderColor: '#1E1E2E',
          }}
        >
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold" style={{ color: '#E4E4E7', fontFamily: 'Outfit, sans-serif' }}>
              Neolife
            </h1>
            <p className="text-sm mt-1" style={{ color: '#71717A' }}>
              Dashboard Analytics
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm mb-2" style={{ color: '#A1A1AA' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all focus:ring-2"
                style={{
                  background: '#0A0A0F',
                  border: '1px solid #1E1E2E',
                  color: '#E4E4E7',
                  // @ts-expect-error CSS custom property
                  '--tw-ring-color': '#00D4AA',
                }}
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-2" style={{ color: '#A1A1AA' }}>
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all focus:ring-2"
                style={{
                  background: '#0A0A0F',
                  border: '1px solid #1E1E2E',
                  color: '#E4E4E7',
                }}
                placeholder="********"
                required
              />
            </div>

            {error && (
              <p className="text-sm text-center" style={{ color: '#EF4444' }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, #00D4AA, #00B894)',
                color: '#0A0A0F',
              }}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
