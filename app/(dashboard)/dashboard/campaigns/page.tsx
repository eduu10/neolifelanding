'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Plus, Mail, Users, Eye, MousePointerClick, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useCampaigns } from '@/hooks/use-campaigns';
import LoadingSkeleton from '@/components/dashboard/shared/LoadingSkeleton';
import type { EmailCampaign } from '@/lib/types';

const statusConfig: Record<
  EmailCampaign['status'],
  { label: string; bg: string; color: string }
> = {
  draft: { label: 'Rascunho', bg: 'rgba(113,113,122,0.15)', color: '#71717A' },
  scheduled: { label: 'Agendado', bg: 'rgba(99,102,241,0.15)', color: '#6366F1' },
  sending: { label: 'Enviando', bg: 'rgba(245,158,11,0.15)', color: '#F59E0B' },
  sent: { label: 'Enviado', bg: 'rgba(0,212,170,0.15)', color: '#00D4AA' },
  paused: { label: 'Pausado', bg: 'rgba(239,68,68,0.15)', color: '#EF4444' },
};

function CampaignCard({ campaign, index }: { campaign: EmailCampaign; index: number }) {
  const config = statusConfig[campaign.status];
  const openRate =
    campaign.total_sent > 0
      ? ((campaign.total_opened / campaign.total_sent) * 100).toFixed(1)
      : '0.0';
  const clickRate =
    campaign.total_sent > 0
      ? ((campaign.total_clicked / campaign.total_sent) * 100).toFixed(1)
      : '0.0';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link href={`/dashboard/campaigns/${campaign.id}`}>
        <div className="group rounded-2xl bg-dash-card/80 backdrop-blur-xl border border-dash-border p-6 transition-all duration-300 hover:border-dash-accent/30 hover:shadow-lg cursor-pointer">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-dash-accent/10">
                <Mail className="h-5 w-5 text-dash-accent" />
              </div>
              <div className="min-w-0">
                <h3
                  className="text-sm font-semibold text-dash-text truncate group-hover:text-dash-accent transition-colors"
                  style={{ fontFamily: 'var(--font-dash-heading)' }}
                >
                  {campaign.name}
                </h3>
                <p className="text-xs text-dash-muted truncate mt-0.5">
                  {campaign.subject}
                </p>
              </div>
            </div>
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium shrink-0"
              style={{ backgroundColor: config.bg, color: config.color }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: config.color }}
              />
              {config.label}
            </span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Users className="h-3.5 w-3.5 text-dash-muted" />
              <div>
                <p className="text-xs text-dash-muted">Destinatarios</p>
                <p
                  className="text-sm font-semibold text-dash-text"
                  style={{ fontFamily: 'var(--font-dash-mono)' }}
                >
                  {campaign.total_recipients}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-3.5 w-3.5 text-dash-muted" />
              <div>
                <p className="text-xs text-dash-muted">Aberturas</p>
                <p
                  className="text-sm font-semibold text-dash-text"
                  style={{ fontFamily: 'var(--font-dash-mono)' }}
                >
                  {openRate}%
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MousePointerClick className="h-3.5 w-3.5 text-dash-muted" />
              <div>
                <p className="text-xs text-dash-muted">Cliques</p>
                <p
                  className="text-sm font-semibold text-dash-text"
                  style={{ fontFamily: 'var(--font-dash-mono)' }}
                >
                  {clickRate}%
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-2 text-xs text-dash-muted border-t border-dash-border pt-3">
            <Calendar className="h-3.5 w-3.5" />
            <span>
              {campaign.sent_at
                ? `Enviado em ${format(new Date(campaign.sent_at), "dd 'de' MMM, yyyy", { locale: ptBR })}`
                : `Criado em ${format(new Date(campaign.created_at), "dd 'de' MMM, yyyy", { locale: ptBR })}`}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function CampaignsPage() {
  const { data, isLoading } = useCampaigns();
  const campaigns = data?.campaigns || [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: 'var(--font-dash-heading)' }}
          >
            Campanhas
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <LoadingSkeleton key={i} variant="chart" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1
          className="text-2xl font-bold"
          style={{ fontFamily: 'var(--font-dash-heading)' }}
        >
          Campanhas
        </h1>
        <Link href="/dashboard/campaigns/new">
          <button className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all hover:opacity-90 bg-gradient-to-r from-dash-accent to-[#00B894] text-[#0A0A0F]">
            <Plus className="h-4 w-4" />
            Nova Campanha
          </button>
        </Link>
      </div>

      {/* Campaign Grid or Empty State */}
      {campaigns.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-dash-card/80 backdrop-blur-xl border border-dash-border p-12 text-center"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-dash-accent/10 mx-auto mb-4">
            <Mail className="h-8 w-8 text-dash-accent" />
          </div>
          <h2
            className="text-lg font-semibold text-dash-text mb-2"
            style={{ fontFamily: 'var(--font-dash-heading)' }}
          >
            Nenhuma campanha ainda
          </h2>
          <p className="text-sm text-dash-muted mb-6 max-w-md mx-auto">
            Crie sua primeira campanha de email para se conectar com seus leads e aumentar suas conversoes.
          </p>
          <Link href="/dashboard/campaigns/new">
            <button className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all hover:opacity-90 bg-gradient-to-r from-dash-accent to-[#00B894] text-[#0A0A0F]">
              <Plus className="h-4 w-4" />
              Criar Primeira Campanha
            </button>
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {campaigns.map((campaign, index) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  );
}
