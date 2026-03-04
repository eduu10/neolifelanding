'use client';

import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  X,
  MessageCircle,
  Mail,
  ChevronDown,
  Plus,
  Tag,
} from 'lucide-react';
import Badge from '@/components/dashboard/shared/Badge';
import LeadTimeline from './LeadTimeline';
import { useLead, useUpdateLead } from '@/hooks/use-leads';
import { LEAD_STATUS_CONFIG, TIMEFRAME_LABELS } from '@/lib/constants';
import type { LeadStatus } from '@/lib/types';

interface LeadDetailPanelProps {
  leadId: string | null;
  onClose: () => void;
}

const ALL_STATUSES = Object.keys(LEAD_STATUS_CONFIG) as LeadStatus[];

export default function LeadDetailPanel({ leadId, onClose }: LeadDetailPanelProps) {
  const { data, isLoading } = useLead(leadId);
  const { updateLead } = useUpdateLead();
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [notes, setNotes] = useState('');
  const [tagInput, setTagInput] = useState('');
  const notesInitialized = useRef(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const lead = data?.lead;
  const timeline = data?.timeline || [];

  // Initialize notes when lead data loads
  useEffect(() => {
    if (lead && !notesInitialized.current) {
      setNotes(lead.notes || '');
      notesInitialized.current = true;
    }
  }, [lead]);

  // Reset when lead changes
  useEffect(() => {
    notesInitialized.current = false;
    setNotes('');
    setShowStatusDropdown(false);
    setTagInput('');
  }, [leadId]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowStatusDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  async function handleStatusChange(newStatus: LeadStatus) {
    if (!lead) return;
    setShowStatusDropdown(false);

    const extra: Record<string, string> = {};
    if (newStatus === 'converted') extra.converted_at = new Date().toISOString();
    if (newStatus === 'contacted') extra.contacted_at = new Date().toISOString();

    await updateLead(lead.id, { status: newStatus, ...extra });
  }

  async function handleNotesBlur() {
    if (!lead || notes === (lead.notes || '')) return;
    await updateLead(lead.id, { notes, _addNoteTimeline: true });
  }

  async function handleAddTag() {
    if (!lead || !tagInput.trim()) return;
    const newTags = [...(lead.tags || []), tagInput.trim()];
    setTagInput('');
    await updateLead(lead.id, { tags: newTags });
  }

  async function handleRemoveTag(tag: string) {
    if (!lead) return;
    const newTags = (lead.tags || []).filter((t) => t !== tag);
    await updateLead(lead.id, { tags: newTags });
  }

  function openWhatsApp() {
    if (!lead?.phone) return;
    const cleaned = lead.phone.replace(/\D/g, '');
    window.open(`https://wa.me/${cleaned}`, '_blank');
  }

  function openEmail() {
    if (!lead?.email) return;
    window.open(`mailto:${lead.email}`, '_blank');
  }

  return (
    <AnimatePresence>
      {leadId && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-dash-border bg-dash-card overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-dash-border px-6 py-4">
              <h2
                className="text-lg font-bold text-dash-text"
                style={{ fontFamily: 'var(--font-dash-heading)' }}
              >
                Detalhes do Lead
              </h2>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-dash-muted transition-colors hover:bg-dash-border/50 hover:text-dash-text"
                aria-label="Fechar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {isLoading || !lead ? (
              <div className="flex-1 p-6">
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-8 animate-pulse rounded-lg bg-dash-bg/50" />
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-6">
                {/* Name & Contact */}
                <div className="mb-6">
                  <h3
                    className="text-xl font-bold text-dash-text"
                    style={{ fontFamily: 'var(--font-dash-heading)' }}
                  >
                    {lead.name || 'Anônimo'}
                  </h3>
                  {lead.email && (
                    <p className="mt-1 text-sm text-dash-secondary">{lead.email}</p>
                  )}
                  {lead.phone && (
                    <p className="mt-0.5 text-sm text-dash-muted">{lead.phone}</p>
                  )}
                </div>

                {/* Status + Score row */}
                <div className="mb-6 flex items-center gap-4">
                  {/* Status dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                      className="inline-flex items-center gap-1.5"
                    >
                      <Badge status={lead.status} />
                      <ChevronDown className="h-3.5 w-3.5 text-dash-muted" />
                    </button>

                    {showStatusDropdown && (
                      <div className="absolute left-0 top-full z-10 mt-1 w-44 rounded-lg border border-dash-border bg-dash-card p-1 shadow-xl">
                        {ALL_STATUSES.map((s) => {
                          const config = LEAD_STATUS_CONFIG[s];
                          return (
                            <button
                              key={s}
                              onClick={() => handleStatusChange(s)}
                              className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-xs transition-colors hover:bg-dash-bg/50"
                            >
                              <span
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: config.color }}
                              />
                              <span className="text-dash-text">{config.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Score */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-dash-muted">Score:</span>
                    <span
                      className="text-lg font-bold"
                      style={{
                        fontFamily: 'var(--font-dash-mono)',
                        color:
                          lead.score >= 70
                            ? '#00D4AA'
                            : lead.score >= 40
                            ? '#F59E0B'
                            : '#EF4444',
                      }}
                    >
                      {lead.score}
                    </span>
                    <span className="text-[10px] text-dash-muted">/100</span>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="mb-6 space-y-3">
                  {lead.location && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-dash-muted">Cidade</span>
                      <span className="text-sm text-dash-text">{lead.location}</span>
                    </div>
                  )}
                  {lead.goal && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-dash-muted">Queixa</span>
                      <span className="text-sm text-dash-text">{lead.goal}</span>
                    </div>
                  )}
                  {lead.timeframe && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-dash-muted">Previsão</span>
                      <span className="text-sm text-dash-text">
                        {TIMEFRAME_LABELS[lead.timeframe] || lead.timeframe}
                      </span>
                    </div>
                  )}
                  {lead.source && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-dash-muted">Fonte</span>
                      <span className="text-sm text-dash-text">{lead.source}</span>
                    </div>
                  )}
                  {lead.is_ghost && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-dash-muted">Ghost</span>
                      <span className="text-xs font-medium text-dash-amber">Sim</span>
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div className="mb-6">
                  <span className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-dash-muted">
                    <Tag className="h-3 w-3" />
                    Tags
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(lead.tags || []).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded-full bg-dash-border/50 px-2.5 py-0.5 text-[11px] text-dash-secondary"
                      >
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-0.5 text-dash-muted hover:text-dash-red transition-colors"
                          aria-label={`Remover tag ${tag}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                    <div className="inline-flex items-center gap-1">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                        placeholder="Adicionar..."
                        className="h-6 w-20 rounded bg-transparent text-[11px] text-dash-text placeholder:text-dash-muted focus:outline-none"
                      />
                      {tagInput.trim() && (
                        <button
                          onClick={handleAddTag}
                          className="text-dash-accent hover:text-dash-accent/80"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="mb-6">
                  <label className="mb-2 block text-xs font-semibold text-dash-muted">
                    Notas
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    onBlur={handleNotesBlur}
                    rows={3}
                    placeholder="Adicione notas sobre este lead..."
                    className="w-full resize-none rounded-lg border border-dash-border bg-dash-bg/50 p-3 text-sm text-dash-text placeholder:text-dash-muted focus:border-dash-accent/50 focus:outline-none focus:ring-1 focus:ring-dash-accent/30 transition-colors"
                    style={{ fontFamily: 'var(--font-dash-body)' }}
                  />
                </div>

                {/* Action Buttons */}
                <div className="mb-6 flex gap-3">
                  {lead.phone && (
                    <button
                      onClick={openWhatsApp}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#25D366]/15 py-2.5 text-xs font-medium text-[#25D366] transition-colors hover:bg-[#25D366]/25"
                    >
                      <MessageCircle className="h-4 w-4" />
                      WhatsApp
                    </button>
                  )}
                  {lead.email && (
                    <button
                      onClick={openEmail}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-dash-indigo/15 py-2.5 text-xs font-medium text-dash-indigo transition-colors hover:bg-dash-indigo/25"
                    >
                      <Mail className="h-4 w-4" />
                      Email
                    </button>
                  )}
                </div>

                {/* Timeline */}
                <div>
                  <h4
                    className="mb-4 text-sm font-semibold text-dash-text"
                    style={{ fontFamily: 'var(--font-dash-heading)' }}
                  >
                    Atividade
                  </h4>
                  <LeadTimeline entries={timeline} />
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
