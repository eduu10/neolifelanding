'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import {
  Settings,
  Bell,
  Tag,
  Server,
  Save,
  Send,
  Plus,
  X,
  Check,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface SettingsData {
  telegram_bot_token?: string;
  telegram_chat_id?: string;
  tags?: string;
  [key: string]: string | undefined;
}

function SectionCard({
  title,
  description,
  icon: Icon,
  children,
  index,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  children: React.ReactNode;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="rounded-2xl bg-dash-card/80 backdrop-blur-xl border border-dash-border p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-dash-accent/10">
          <Icon className="h-5 w-5 text-dash-accent" />
        </div>
        <div>
          <h2
            className="text-lg font-semibold"
            style={{ fontFamily: 'var(--font-dash-heading)' }}
          >
            {title}
          </h2>
          <p className="text-xs text-dash-muted">{description}</p>
        </div>
      </div>
      {children}
    </motion.div>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsData>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [testingTelegram, setTestingTelegram] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [botToken, setBotToken] = useState('');
  const [chatId, setChatId] = useState('');

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
        setBotToken(data.telegram_bot_token || '');
        setChatId(data.telegram_chat_id || '');
      }
    } catch {
      toast.error('Erro ao carregar configuracoes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const saveSetting = async (key: string, value: string) => {
    setSaving(key);
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
      });

      if (!res.ok) throw new Error('Erro ao salvar');

      setSettings((prev) => ({ ...prev, [key]: value }));
      toast.success('Configuracao salva');
    } catch {
      toast.error('Erro ao salvar configuracao');
    } finally {
      setSaving(null);
    }
  };

  const testTelegram = async () => {
    setTestingTelegram(true);
    try {
      const res = await fetch('/api/telegram/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bot_token: botToken,
          chat_id: chatId,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || 'Teste enviado com sucesso!');
      } else {
        toast.error(data.error || 'Erro no teste');
      }
    } catch {
      toast.error('Erro ao testar notificacao');
    } finally {
      setTestingTelegram(false);
    }
  };

  const tags: string[] = settings.tags
    ? settings.tags.split(',').filter((t) => t.trim() !== '')
    : [];

  const addTag = async () => {
    if (!newTag.trim()) return;
    const updatedTags = [...tags, newTag.trim()];
    await saveSetting('tags', updatedTags.join(','));
    setNewTag('');
  };

  const removeTag = async (tagToRemove: string) => {
    const updatedTags = tags.filter((t) => t !== tagToRemove);
    await saveSetting('tags', updatedTags.join(','));
  };

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'Nao configurado';

  if (loading) {
    return (
      <div className="space-y-6">
        <h1
          className="text-2xl font-bold"
          style={{ fontFamily: 'var(--font-dash-heading)' }}
        >
          Configuracoes
        </h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl bg-dash-card border border-dash-border p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-dash-border" />
                <div className="space-y-2">
                  <div className="h-5 w-32 rounded bg-dash-border" />
                  <div className="h-3 w-48 rounded bg-dash-border" />
                </div>
              </div>
              <div className="h-20 rounded bg-dash-border" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="h-6 w-6 text-dash-accent" />
        <h1
          className="text-2xl font-bold"
          style={{ fontFamily: 'var(--font-dash-heading)' }}
        >
          Configuracoes
        </h1>
      </div>

      {/* Telegram Notifications */}
      <SectionCard
        title="Notificacoes Telegram"
        description="Configure o bot do Telegram para receber notificacoes"
        icon={Bell}
        index={0}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-2 text-dash-secondary">
              Bot Token
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                value={botToken}
                onChange={(e) => setBotToken(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg text-sm outline-none transition-all border border-dash-border bg-dash-bg text-dash-text focus:border-dash-accent focus:ring-1 focus:ring-dash-accent"
                placeholder="123456789:ABCdefGHIjklMNOpqrSTUvwxYZ"
              />
              <button
                onClick={() => saveSetting('telegram_bot_token', botToken)}
                disabled={saving === 'telegram_bot_token'}
                className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors border border-dash-border hover:border-dash-accent/30 text-dash-muted hover:text-dash-text disabled:opacity-50"
              >
                {saving === 'telegram_bot_token' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Salvar
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2 text-dash-secondary">
              Chat ID
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg text-sm outline-none transition-all border border-dash-border bg-dash-bg text-dash-text focus:border-dash-accent focus:ring-1 focus:ring-dash-accent"
                placeholder="-1001234567890"
              />
              <button
                onClick={() => saveSetting('telegram_chat_id', chatId)}
                disabled={saving === 'telegram_chat_id'}
                className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors border border-dash-border hover:border-dash-accent/30 text-dash-muted hover:text-dash-text disabled:opacity-50"
              >
                {saving === 'telegram_chat_id' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Salvar
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={testTelegram}
              disabled={testingTelegram || !botToken || !chatId}
              className="flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-dash-accent to-[#00B894] text-[#0A0A0F]"
            >
              {testingTelegram ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Testando...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Enviar Teste
                </>
              )}
            </button>
          </div>
        </div>
      </SectionCard>

      {/* Tag Management */}
      <SectionCard
        title="Gerenciamento de Tags"
        description="Gerencie as tags usadas para categorizar leads"
        icon={Tag}
        index={1}
      >
        <div className="space-y-4">
          {/* Add Tag */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag();
                }
              }}
              className="flex-1 px-4 py-3 rounded-lg text-sm outline-none transition-all border border-dash-border bg-dash-bg text-dash-text focus:border-dash-accent focus:ring-1 focus:ring-dash-accent"
              placeholder="Nova tag..."
            />
            <button
              onClick={addTag}
              disabled={!newTag.trim() || saving === 'tags'}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-dash-accent to-[#00B894] text-[#0A0A0F]"
            >
              {saving === 'tags' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Adicionar
            </button>
          </div>

          {/* Tags List */}
          <div className="flex flex-wrap gap-2">
            {tags.length === 0 ? (
              <p className="text-sm text-dash-muted py-4">
                Nenhuma tag cadastrada. Adicione tags para categorizar seus
                leads.
              </p>
            ) : (
              tags.map((tag) => (
                <span
                  key={tag}
                  className="group inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium bg-dash-accent/10 text-dash-accent border border-dash-accent/20"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="text-dash-accent/50 hover:text-dash-red transition-colors"
                    title="Remover tag"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))
            )}
          </div>
        </div>
      </SectionCard>

      {/* API Info */}
      <SectionCard
        title="Informacoes da API"
        description="Dados de conexao e configuracao do sistema"
        icon={Server}
        index={2}
      >
        <div className="space-y-3">
          <div className="rounded-xl bg-dash-bg/50 border border-dash-border p-4">
            <p className="text-xs text-dash-muted mb-1">Supabase URL</p>
            <div className="flex items-center gap-2">
              <code
                className="text-sm text-dash-text break-all"
                style={{ fontFamily: 'var(--font-dash-mono)' }}
              >
                {supabaseUrl}
              </code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(supabaseUrl);
                  toast.success('URL copiada!');
                }}
                className="shrink-0 p-1 text-dash-muted hover:text-dash-accent transition-colors"
                title="Copiar"
              >
                <Check className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="rounded-xl bg-dash-bg/50 border border-dash-border p-4">
            <p className="text-xs text-dash-muted mb-1">Status</p>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-dash-accent animate-pulse" />
              <span className="text-sm text-dash-text">Conectado</span>
            </div>
          </div>

          <div className="rounded-xl bg-dash-bg/50 border border-dash-border p-4">
            <p className="text-xs text-dash-muted mb-1">Versao do Dashboard</p>
            <code
              className="text-sm text-dash-text"
              style={{ fontFamily: 'var(--font-dash-mono)' }}
            >
              v1.0.0
            </code>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
