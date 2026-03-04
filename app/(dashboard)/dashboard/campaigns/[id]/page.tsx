'use client';

import { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Send,
  Eye,
  MousePointerClick,
  Users,
  Mail,
  CheckCircle2,
  Clock,
  Trash2,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import toast from 'react-hot-toast';
import { useCampaign } from '@/hooks/use-campaigns';
import LoadingSkeleton from '@/components/dashboard/shared/LoadingSkeleton';
import type { EmailSend } from '@/lib/types';

const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  draft: { label: 'Rascunho', bg: 'rgba(113,113,122,0.15)', color: '#71717A' },
  scheduled: { label: 'Agendado', bg: 'rgba(99,102,241,0.15)', color: '#6366F1' },
  sending: { label: 'Enviando', bg: 'rgba(245,158,11,0.15)', color: '#F59E0B' },
  sent: { label: 'Enviado', bg: 'rgba(0,212,170,0.15)', color: '#00D4AA' },
  paused: { label: 'Pausado', bg: 'rgba(239,68,68,0.15)', color: '#EF4444' },
};

const sendStatusConfig: Record<
  EmailSend['status'],
  { label: string; color: string }
> = {
  pending: { label: 'Pendente', color: '#71717A' },
  sent: { label: 'Enviado', color: '#6366F1' },
  delivered: { label: 'Entregue', color: '#00D4AA' },
  opened: { label: 'Aberto', color: '#F59E0B' },
  clicked: { label: 'Clicado', color: '#22C55E' },
  bounced: { label: 'Bounce', color: '#EF4444' },
  failed: { label: 'Falhou', color: '#EF4444' },
};

interface KPIStatProps {
  label: string;
  value: number;
  total: number;
  icon: React.ElementType;
  color: string;
  index: number;
}

function KPIStat({ label, value, total, icon: Icon, color, index }: KPIStatProps) {
  const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="rounded-xl border border-dash-border bg-dash-card/80 p-5"
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon className="h-5 w-5" style={{ color }} />
        </div>
        <p className="text-sm text-dash-muted">{label}</p>
      </div>
      <p
        className="text-3xl font-bold text-dash-text"
        style={{ fontFamily: 'var(--font-dash-mono)' }}
      >
        {value.toLocaleString('pt-BR')}
      </p>
      <p className="text-xs text-dash-muted mt-1">{percentage}% do total</p>
    </motion.div>
  );
}

export default function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data, isLoading } = useCampaign(id);

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir esta campanha?')) return;
    try {
      const res = await fetch(`/api/campaigns/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erro ao excluir');
      toast.success('Campanha excluida');
      router.push('/dashboard/campaigns');
    } catch {
      toast.error('Erro ao excluir campanha');
    }
  };

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton variant="text" className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <LoadingSkeleton key={i} variant="card" />
          ))}
        </div>
        <LoadingSkeleton variant="chart" />
      </div>
    );
  }

  const { campaign, sends } = data;
  const config = statusConfig[campaign.status] || statusConfig.draft;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/campaigns"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-dash-border text-dash-muted hover:text-dash-text hover:bg-dash-bg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1
                className="text-2xl font-bold"
                style={{ fontFamily: 'var(--font-dash-heading)' }}
              >
                {campaign.name}
              </h1>
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                style={{ backgroundColor: config.bg, color: config.color }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: config.color }}
                />
                {config.label}
              </span>
            </div>
            <p className="text-sm text-dash-muted mt-1">{campaign.subject}</p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-dash-red border border-dash-red/30 hover:bg-dash-red/10 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
          Excluir
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPIStat
          label="Enviados"
          value={campaign.total_sent}
          total={campaign.total_recipients || campaign.total_sent}
          icon={Send}
          color="#6366F1"
          index={0}
        />
        <KPIStat
          label="Entregues"
          value={campaign.total_sent - campaign.total_bounced}
          total={campaign.total_sent}
          icon={CheckCircle2}
          color="#00D4AA"
          index={1}
        />
        <KPIStat
          label="Abertos"
          value={campaign.total_opened}
          total={campaign.total_sent}
          icon={Eye}
          color="#F59E0B"
          index={2}
        />
        <KPIStat
          label="Clicados"
          value={campaign.total_clicked}
          total={campaign.total_sent}
          icon={MousePointerClick}
          color="#22C55E"
          index={3}
        />
      </div>

      {/* Campaign Info */}
      <div className="rounded-2xl bg-dash-card/80 backdrop-blur-xl border border-dash-border p-6">
        <h2
          className="text-lg font-semibold mb-4"
          style={{ fontFamily: 'var(--font-dash-heading)' }}
        >
          Informacoes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl bg-dash-bg/50 border border-dash-border p-4">
            <p className="text-xs text-dash-muted mb-1">Remetente</p>
            <p className="text-sm text-dash-text">
              {campaign.from_name} &lt;{campaign.from_email}&gt;
            </p>
          </div>
          <div className="rounded-xl bg-dash-bg/50 border border-dash-border p-4">
            <p className="text-xs text-dash-muted mb-1">Criado em</p>
            <p className="text-sm text-dash-text">
              {format(new Date(campaign.created_at), "dd 'de' MMMM, yyyy 'as' HH:mm", {
                locale: ptBR,
              })}
            </p>
          </div>
          <div className="rounded-xl bg-dash-bg/50 border border-dash-border p-4">
            <p className="text-xs text-dash-muted mb-1">Enviado em</p>
            <p className="text-sm text-dash-text">
              {campaign.sent_at
                ? format(
                    new Date(campaign.sent_at),
                    "dd 'de' MMMM, yyyy 'as' HH:mm",
                    { locale: ptBR }
                  )
                : 'Ainda nao enviado'}
            </p>
          </div>
        </div>
      </div>

      {/* Sends Table */}
      <div className="rounded-2xl bg-dash-card/80 backdrop-blur-xl border border-dash-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-lg font-semibold"
            style={{ fontFamily: 'var(--font-dash-heading)' }}
          >
            Envios Individuais
          </h2>
          <span className="text-sm text-dash-muted">
            {sends.length} registros
          </span>
        </div>

        {sends.length === 0 ? (
          <div className="text-center py-12">
            <Mail className="h-10 w-10 text-dash-muted mx-auto mb-3" />
            <p className="text-sm text-dash-muted">
              Nenhum envio registrado ainda.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dash-border">
                  <th className="text-left text-xs font-medium text-dash-muted pb-3 pr-4">
                    Email
                  </th>
                  <th className="text-left text-xs font-medium text-dash-muted pb-3 pr-4">
                    Status
                  </th>
                  <th className="text-left text-xs font-medium text-dash-muted pb-3 pr-4">
                    Enviado
                  </th>
                  <th className="text-left text-xs font-medium text-dash-muted pb-3 pr-4">
                    Aberto
                  </th>
                  <th className="text-left text-xs font-medium text-dash-muted pb-3">
                    Clicado
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dash-border">
                {sends.map((send) => {
                  const sendConfig = sendStatusConfig[send.status];
                  return (
                    <tr key={send.id} className="group">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <Users className="h-3.5 w-3.5 text-dash-muted" />
                          <span className="text-sm text-dash-text">
                            {send.email}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <span
                          className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium"
                          style={{
                            backgroundColor: `${sendConfig.color}20`,
                            color: sendConfig.color,
                          }}
                        >
                          <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ backgroundColor: sendConfig.color }}
                          />
                          {sendConfig.label}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <span className="text-xs text-dash-muted flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {send.sent_at
                            ? format(new Date(send.sent_at), 'dd/MM HH:mm')
                            : '-'}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <span className="text-xs text-dash-muted">
                          {send.opened_at
                            ? format(new Date(send.opened_at), 'dd/MM HH:mm')
                            : '-'}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="text-xs text-dash-muted">
                          {send.clicked_at
                            ? format(new Date(send.clicked_at), 'dd/MM HH:mm')
                            : '-'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
