'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  FileText,
  Send,
  ChevronRight,
  ChevronLeft,
  Check,
  Sparkles,
  Heart,
  Gift,
  MessageCircle,
  AlertTriangle,
  X,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import LinkExtension from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import UnderlineExtension from '@tiptap/extension-underline';
import toast from 'react-hot-toast';
import { useCreateCampaign, useSendCampaign } from '@/hooks/use-campaigns';
import {
  welcomeTemplate,
  recoveryTemplate,
  offerTemplate,
  followupTemplate,
} from '@/lib/email/templates';
import type { LeadStatus } from '@/lib/types';

const STEPS = [
  { id: 1, label: 'Audiencia', icon: Users },
  { id: 2, label: 'Conteudo', icon: FileText },
  { id: 3, label: 'Envio', icon: Send },
];

const STATUS_OPTIONS: { value: LeadStatus; label: string; color: string }[] = [
  { value: 'cold', label: 'Frio', color: '#94A3B8' },
  { value: 'warm', label: 'Morno', color: '#F59E0B' },
  { value: 'hot', label: 'Quente', color: '#EF4444' },
  { value: 'converted', label: 'Convertido', color: '#00D4AA' },
  { value: 'contacted', label: 'Contactado', color: '#6366F1' },
  { value: 'qualified', label: 'Qualificado', color: '#8B5CF6' },
  { value: 'lost', label: 'Perdido', color: '#64748B' },
];

const TEMPLATES = [
  {
    id: 'welcome',
    name: 'Boas-vindas',
    description: 'Email de boas-vindas para novos leads',
    icon: Sparkles,
    color: '#00D4AA',
    fn: welcomeTemplate,
  },
  {
    id: 'recovery',
    name: 'Recuperacao',
    description: 'Recuperacao de leads fantasma',
    icon: Heart,
    color: '#EF4444',
    fn: recoveryTemplate,
  },
  {
    id: 'offer',
    name: 'Oferta Especial',
    description: 'Promocao exclusiva para leads',
    icon: Gift,
    color: '#F59E0B',
    fn: offerTemplate,
  },
  {
    id: 'followup',
    name: 'Follow-up',
    description: 'Acompanhamento do lead',
    icon: MessageCircle,
    color: '#6366F1',
    fn: followupTemplate,
  },
];

function EditorToolbar({
  editor,
}: {
  editor: ReturnType<typeof useEditor>;
}) {
  if (!editor) return null;

  const addLink = useCallback(() => {
    const url = window.prompt('URL do link:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  const btnClass = (active: boolean) =>
    `p-2 rounded-lg transition-colors ${
      active
        ? 'bg-dash-accent/20 text-dash-accent'
        : 'text-dash-muted hover:text-dash-text hover:bg-dash-border/50'
    }`;

  return (
    <div className="flex items-center gap-1 border-b border-dash-border px-3 py-2 bg-dash-bg/50">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={btnClass(editor.isActive('bold'))}
        title="Negrito"
      >
        <Bold className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={btnClass(editor.isActive('italic'))}
        title="Italico"
      >
        <Italic className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={btnClass(editor.isActive('underline'))}
        title="Sublinhado"
      >
        <UnderlineIcon className="h-4 w-4" />
      </button>

      <div className="w-px h-5 bg-dash-border mx-1" />

      <button
        type="button"
        onClick={addLink}
        className={btnClass(editor.isActive('link'))}
        title="Link"
      >
        <LinkIcon className="h-4 w-4" />
      </button>

      <div className="w-px h-5 bg-dash-border mx-1" />

      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={btnClass(editor.isActive({ textAlign: 'left' }))}
        title="Alinhar esquerda"
      >
        <AlignLeft className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={btnClass(editor.isActive({ textAlign: 'center' }))}
        title="Centralizar"
      >
        <AlignCenter className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={btnClass(editor.isActive({ textAlign: 'right' }))}
        title="Alinhar direita"
      >
        <AlignRight className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function NewCampaignPage() {
  const router = useRouter();
  const { createCampaign } = useCreateCampaign();
  const { sendCampaign } = useSendCampaign();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedStatuses, setSelectedStatuses] = useState<LeadStatus[]>([]);
  const [leadCount, setLeadCount] = useState<number | null>(null);
  const [loadingCount, setLoadingCount] = useState(false);
  const [campaignName, setCampaignName] = useState('');
  const [subject, setSubject] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [createdCampaignId, setCreatedCampaignId] = useState<string | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      UnderlineExtension,
      LinkExtension.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: '<p>Escreva o conteudo do seu email aqui...</p>',
    editorProps: {
      attributes: {
        class:
          'prose prose-invert max-w-none p-4 min-h-[300px] focus:outline-none text-dash-text text-sm',
      },
    },
    onUpdate: ({ editor: ed }) => {
      setHtmlContent(ed.getHTML());
    },
  });

  // Fetch lead count when statuses change
  const fetchLeadCount = useCallback(async () => {
    setLoadingCount(true);
    try {
      const params = new URLSearchParams();
      if (selectedStatuses.length > 0) {
        params.set('statuses', selectedStatuses.join(','));
      }
      const res = await fetch(`/api/campaigns?count_leads=true&${params.toString()}`);
      // We'll estimate lead count from a quick query
      // For now, use a simpler approach
      const leadsRes = await fetch('/api/analytics?period=30d');
      const data = await leadsRes.json();
      // Rough estimate from analytics
      setLeadCount(data?.leads?.total ?? 0);
    } catch {
      setLeadCount(0);
    } finally {
      setLoadingCount(false);
    }
  }, [selectedStatuses]);

  useEffect(() => {
    fetchLeadCount();
  }, [fetchLeadCount]);

  const toggleStatus = (status: LeadStatus) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const applyTemplate = (templateId: string) => {
    const template = TEMPLATES.find((t) => t.id === templateId);
    if (template && editor) {
      const html = template.fn('{{nome}}');
      setHtmlContent(html);
      setSelectedTemplate(templateId);
      // Set editor content to a simplified version for editing
      editor.commands.setContent(
        `<h2>${template.name}</h2><p>Template "${template.name}" selecionado. O HTML completo sera utilizado no envio.</p><p>Placeholders disponiveis: <code>{{nome}}</code>, <code>{{cidade}}</code>, <code>{{queixa}}</code></p>`
      );
    }
  };

  const canProceedStep1 = selectedStatuses.length > 0;
  const canProceedStep2 = campaignName.trim() !== '' && subject.trim() !== '';

  const handleCreateAndSend = async () => {
    setSending(true);
    try {
      const campaign = await createCampaign({
        name: campaignName,
        subject,
        html_content: htmlContent,
        audience_filter: { statuses: selectedStatuses },
      });

      setCreatedCampaignId(campaign.id);

      const result = await sendCampaign(campaign.id);
      toast.success(`Campanha enviada para ${result.total_sent} leads!`);
      router.push(`/dashboard/campaigns/${campaign.id}`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Erro ao enviar campanha'
      );
    } finally {
      setSending(false);
      setShowConfirmModal(false);
    }
  };

  const handleSaveDraft = async () => {
    try {
      const campaign = await createCampaign({
        name: campaignName || 'Campanha sem nome',
        subject: subject || '(sem assunto)',
        html_content: htmlContent,
        audience_filter: { statuses: selectedStatuses },
      });
      toast.success('Rascunho salvo com sucesso!');
      router.push(`/dashboard/campaigns/${campaign.id}`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Erro ao salvar rascunho'
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1
          className="text-2xl font-bold"
          style={{ fontFamily: 'var(--font-dash-heading)' }}
        >
          Nova Campanha
        </h1>
        <button
          onClick={handleSaveDraft}
          className="text-sm text-dash-muted hover:text-dash-text transition-colors"
        >
          Salvar Rascunho
        </button>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-2">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isComplete = currentStep > step.id;

          return (
            <div key={step.id} className="flex items-center gap-2">
              {i > 0 && (
                <div
                  className={`h-px w-8 transition-colors ${
                    isComplete ? 'bg-dash-accent' : 'bg-dash-border'
                  }`}
                />
              )}
              <button
                onClick={() => {
                  if (step.id < currentStep) setCurrentStep(step.id);
                }}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-dash-accent/10 text-dash-accent border border-dash-accent/30'
                    : isComplete
                      ? 'bg-dash-accent/5 text-dash-accent border border-transparent'
                      : 'text-dash-muted border border-transparent'
                }`}
              >
                {isComplete ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
                {step.label}
              </button>
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {/* STEP 1: AUDIENCIA */}
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div className="rounded-2xl bg-dash-card/80 backdrop-blur-xl border border-dash-border p-6">
              <h2
                className="text-lg font-semibold mb-4"
                style={{ fontFamily: 'var(--font-dash-heading)' }}
              >
                Selecione a Audiencia
              </h2>
              <p className="text-sm text-dash-muted mb-6">
                Escolha os status dos leads que receberao esta campanha.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {STATUS_OPTIONS.map((opt) => {
                  const isSelected = selectedStatuses.includes(opt.value);
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => toggleStatus(opt.value)}
                      className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                        isSelected
                          ? 'border-dash-accent/50 bg-dash-accent/5'
                          : 'border-dash-border hover:border-dash-border hover:bg-dash-bg/50'
                      }`}
                    >
                      <div
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-all ${
                          isSelected
                            ? 'border-dash-accent bg-dash-accent'
                            : 'border-dash-muted'
                        }`}
                      >
                        {isSelected && (
                          <Check className="h-3 w-3 text-[#0A0A0F]" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: opt.color }}
                          />
                          <span className="text-sm font-medium text-dash-text">
                            {opt.label}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Lead Count Preview */}
              <div className="mt-6 rounded-xl bg-dash-bg/50 border border-dash-border p-4">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-dash-accent" />
                  <div>
                    <p className="text-sm text-dash-muted">
                      Leads estimados para esta campanha
                    </p>
                    <p
                      className="text-2xl font-bold text-dash-text"
                      style={{ fontFamily: 'var(--font-dash-mono)' }}
                    >
                      {loadingCount ? '...' : (leadCount ?? 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-end">
              <button
                onClick={() => setCurrentStep(2)}
                disabled={!canProceedStep1}
                className="flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-dash-accent to-[#00B894] text-[#0A0A0F]"
              >
                Proximo
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 2: CONTEUDO */}
        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Campaign Details */}
            <div className="rounded-2xl bg-dash-card/80 backdrop-blur-xl border border-dash-border p-6">
              <h2
                className="text-lg font-semibold mb-4"
                style={{ fontFamily: 'var(--font-dash-heading)' }}
              >
                Detalhes da Campanha
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2 text-dash-secondary">
                    Nome da Campanha
                  </label>
                  <input
                    type="text"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all border border-dash-border bg-dash-bg text-dash-text focus:border-dash-accent focus:ring-1 focus:ring-dash-accent"
                    placeholder="Ex: Boas-vindas Novos Leads"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-dash-secondary">
                    Assunto do Email
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all border border-dash-border bg-dash-bg text-dash-text focus:border-dash-accent focus:ring-1 focus:ring-dash-accent"
                    placeholder="Ex: Bem-vindo a Neolife!"
                  />
                </div>
              </div>
            </div>

            {/* Template Selector */}
            <div className="rounded-2xl bg-dash-card/80 backdrop-blur-xl border border-dash-border p-6">
              <h2
                className="text-lg font-semibold mb-4"
                style={{ fontFamily: 'var(--font-dash-heading)' }}
              >
                Templates
              </h2>
              <p className="text-sm text-dash-muted mb-4">
                Selecione um template pre-definido ou crie seu proprio conteudo.
              </p>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {TEMPLATES.map((template) => {
                  const Icon = template.icon;
                  const isSelected = selectedTemplate === template.id;
                  return (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => applyTemplate(template.id)}
                      className={`rounded-xl border p-4 text-left transition-all ${
                        isSelected
                          ? 'border-dash-accent/50 bg-dash-accent/5'
                          : 'border-dash-border hover:border-dash-accent/30 hover:bg-dash-bg/50'
                      }`}
                    >
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-lg mb-3"
                        style={{ backgroundColor: `${template.color}15` }}
                      >
                        <Icon
                          className="h-5 w-5"
                          style={{ color: template.color }}
                        />
                      </div>
                      <p className="text-sm font-medium text-dash-text">
                        {template.name}
                      </p>
                      <p className="text-xs text-dash-muted mt-1">
                        {template.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Editor + Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* TipTap Editor */}
              <div className="rounded-2xl bg-dash-card/80 backdrop-blur-xl border border-dash-border overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-dash-border">
                  <h3
                    className="text-sm font-semibold"
                    style={{ fontFamily: 'var(--font-dash-heading)' }}
                  >
                    Editor
                  </h3>
                </div>
                <EditorToolbar editor={editor} />
                <div className="min-h-[300px]">
                  <EditorContent editor={editor} />
                </div>
              </div>

              {/* Preview */}
              <div className="rounded-2xl bg-dash-card/80 backdrop-blur-xl border border-dash-border overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-dash-border">
                  <h3
                    className="text-sm font-semibold"
                    style={{ fontFamily: 'var(--font-dash-heading)' }}
                  >
                    Preview
                  </h3>
                </div>
                <div className="p-1 bg-white min-h-[300px]">
                  <div
                    className="text-sm"
                    dangerouslySetInnerHTML={{
                      __html: htmlContent || '<p style="padding:16px;color:#999;">Preview do email...</p>',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-medium text-dash-muted hover:text-dash-text transition-colors border border-dash-border hover:border-dash-accent/30"
              >
                <ChevronLeft className="h-4 w-4" />
                Voltar
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                disabled={!canProceedStep2}
                className="flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-dash-accent to-[#00B894] text-[#0A0A0F]"
              >
                Proximo
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: ENVIO */}
        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div className="rounded-2xl bg-dash-card/80 backdrop-blur-xl border border-dash-border p-6">
              <h2
                className="text-lg font-semibold mb-6"
                style={{ fontFamily: 'var(--font-dash-heading)' }}
              >
                Resumo da Campanha
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl bg-dash-bg/50 border border-dash-border p-4">
                    <p className="text-xs text-dash-muted mb-1">
                      Nome da Campanha
                    </p>
                    <p className="text-sm font-medium text-dash-text">
                      {campaignName}
                    </p>
                  </div>
                  <div className="rounded-xl bg-dash-bg/50 border border-dash-border p-4">
                    <p className="text-xs text-dash-muted mb-1">
                      Assunto
                    </p>
                    <p className="text-sm font-medium text-dash-text">
                      {subject}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl bg-dash-bg/50 border border-dash-border p-4">
                  <p className="text-xs text-dash-muted mb-2">Audiencia</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedStatuses.map((status) => {
                      const opt = STATUS_OPTIONS.find(
                        (o) => o.value === status
                      );
                      return (
                        <span
                          key={status}
                          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                          style={{
                            backgroundColor: `${opt?.color || '#666'}20`,
                            color: opt?.color || '#666',
                          }}
                        >
                          <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{
                              backgroundColor: opt?.color || '#666',
                            }}
                          />
                          {opt?.label || status}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-xl bg-dash-bg/50 border border-dash-border p-4">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-dash-accent" />
                    <div>
                      <p className="text-xs text-dash-muted">
                        Destinatarios estimados
                      </p>
                      <p
                        className="text-xl font-bold text-dash-text"
                        style={{ fontFamily: 'var(--font-dash-mono)' }}
                      >
                        {leadCount ?? 0} leads
                      </p>
                    </div>
                  </div>
                </div>

                {selectedTemplate && (
                  <div className="rounded-xl bg-dash-bg/50 border border-dash-border p-4">
                    <p className="text-xs text-dash-muted mb-1">
                      Template utilizado
                    </p>
                    <p className="text-sm font-medium text-dash-text">
                      {TEMPLATES.find((t) => t.id === selectedTemplate)?.name}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Warning */}
            <div className="rounded-xl border border-dash-amber/30 bg-dash-amber/5 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-dash-amber shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-dash-amber">
                    Atencao
                  </p>
                  <p className="text-sm text-dash-muted mt-1">
                    Esta acao ira enviar o email para todos os leads filtrados.
                    Certifique-se de que o conteudo esta correto antes de
                    continuar. (Modo de teste: emails nao serao enviados de
                    verdade)
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(2)}
                className="flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-medium text-dash-muted hover:text-dash-text transition-colors border border-dash-border hover:border-dash-accent/30"
              >
                <ChevronLeft className="h-4 w-4" />
                Voltar
              </button>
              <button
                onClick={() => setShowConfirmModal(true)}
                className="flex items-center gap-2 rounded-lg px-8 py-2.5 text-sm font-semibold transition-all hover:opacity-90 bg-gradient-to-r from-dash-accent to-[#00B894] text-[#0A0A0F]"
              >
                <Send className="h-4 w-4" />
                Enviar Agora
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => !sending && setShowConfirmModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl bg-dash-card border border-dash-border p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3
                  className="text-lg font-semibold"
                  style={{ fontFamily: 'var(--font-dash-heading)' }}
                >
                  Confirmar Envio
                </h3>
                <button
                  onClick={() => !sending && setShowConfirmModal(false)}
                  className="text-dash-muted hover:text-dash-text transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="text-sm text-dash-muted mb-6">
                Tem certeza que deseja enviar a campanha{' '}
                <strong className="text-dash-text">&ldquo;{campaignName}&rdquo;</strong>{' '}
                para aproximadamente{' '}
                <strong className="text-dash-accent">{leadCount ?? 0}</strong>{' '}
                leads?
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  disabled={sending}
                  className="flex-1 rounded-lg px-4 py-2.5 text-sm font-medium text-dash-muted border border-dash-border hover:bg-dash-bg transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateAndSend}
                  disabled={sending}
                  className="flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50 bg-gradient-to-r from-dash-accent to-[#00B894] text-[#0A0A0F]"
                >
                  {sending ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#0A0A0F]/30 border-t-[#0A0A0F]" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Confirmar Envio
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
