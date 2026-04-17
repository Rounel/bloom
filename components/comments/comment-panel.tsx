'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { MessageSquare, X, ChevronLeft, Trash2, Send, CheckCircle2, Pencil, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCommentStore } from '@/lib/comment-store'
import { trackVisitor } from '@/lib/visitor-tracker'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// ─── Registres statiques ──────────────────────────────────────────────────────

const PAGE_LABELS: Record<string, string> = {
  '/modules':                'Sélection des modules',
  '/terminal/dashboard':     'Dashboard',
  '/terminal/analyse':       'Analyse Financière',
  '/terminal/macro':         'Données Macroéconomiques',
  '/terminal/portfolio':     'Portefeuille',
  '/terminal/operations':    'Opérations Boursières',
  '/terminal/communication': 'Communication & Éducation',
  '/terminal/admin':         'Paramétrage',
  '/terminal/my-account':    'Mon Compte',
}

const ROUTE_PANELS: Record<string, { id: string; label: string }[]> = {
  '/terminal/dashboard': [
    { id: 'indices',        label: 'Indices de marché' },
    { id: 'top-movers',     label: 'Top mouvements' },
    { id: 'sector-volumes', label: 'Volumes sectoriels' },
    { id: 'market-cap',     label: 'Capitalisation marché' },
    { id: 'fx-rates',       label: 'Taux de change' },
    { id: 'news',           label: 'Actualités' },
  ],
  '/terminal/analyse': [
    { id: 'technical',      label: 'Analyse technique' },
    { id: 'fundamentals',   label: 'Analyse fondamentale' },
    { id: 'ratios',         label: 'Ratios comparatifs' },
    { id: 'risk-scorecard', label: 'Scorecard risque souverain' },
    { id: 'ratings',        label: 'Notations souveraines' },
  ],
  '/terminal/macro': [
    { id: 'kpis',       label: 'Indicateurs clés' },
    { id: 'indicators', label: 'Indicateurs macro' },
    { id: 'rankings',   label: 'Classement régional' },
    { id: 'finances',   label: 'Finances publiques' },
    { id: 'trade',      label: 'Commerce extérieur' },
  ],
  '/terminal/portfolio': [
    { id: 'kpis',        label: 'Indicateurs clés' },
    { id: 'holdings',    label: 'Positions' },
    { id: 'allocation',  label: 'Répartition' },
    { id: 'performance', label: 'Performance' },
    { id: 'risk',        label: 'Métriques de risque' },
    { id: 'simulator',   label: "Simulateur d'ordres" },
    { id: 'watchlist',   label: 'Surveillance' },
    { id: 'orders',      label: 'Historique ordres' },
  ],
  '/terminal/operations': [
    { id: 'indices-africains',   label: 'Indices Africains' },
    { id: 'cours-brvm',          label: 'Cours & Graphique' },
    { id: 'heatmap-sectorielle', label: 'Heatmap Sectorielle' },
    { id: 'cotations-brvm',      label: 'Cotations BRVM' },
    { id: 'courbes-taux',        label: 'Courbes des Taux' },
    { id: 'spreads-maturite',    label: 'Spreads Maturité' },
    { id: 'devises-graphique',   label: 'Paires & Graphique' },
    { id: 'devises-tableau',     label: 'Tableau FX' },
    { id: 'matieres-prix',       label: 'Prix Spot' },
    { id: 'matieres-perf',       label: 'Perf. Matières' },
    { id: 'top-movers',          label: 'Top Movers' },
    { id: 'most-traded',         label: 'Plus Échangés' },
    { id: 'sector-trends',       label: 'Tendances Sect.' },
    { id: 'flash-alerts',        label: 'Alertes Flash' },
    { id: 'actualites',          label: 'Actualités' },
    { id: 'web-tv',              label: 'Web TV' },
  ],
  '/terminal/communication': [
    { id: 'news',      label: 'Actualités' },
    { id: 'alerts',    label: 'Alertes prix' },
    { id: 'web-tv',    label: 'Web TV' },
    { id: 'education', label: 'Éducation' },
  ],
  '/terminal/admin': [
    { id: 'kpis',        label: 'Indicateurs clés' },
    { id: 'users',       label: 'Utilisateurs' },
    { id: 'sources',     label: 'Sources données' },
    { id: 'audit',       label: "Journal d'audit" },
    { id: 'permissions', label: 'Permissions' },
    { id: 'system',      label: 'Statut système' },
  ],
  '/terminal/my-account': [
    { id: 'profil',      label: 'Profil' },
    { id: 'securite',    label: 'Sécurité' },
    { id: 'preferences', label: 'Préférences' },
    { id: 'abonnement',  label: 'Abonnement' },
    { id: 'sessions',    label: 'Sessions actives' },
    { id: 'activite',    label: "Historique d'activité" },
  ],
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  const d = new Date(iso)
  const date = d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
  const time = d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  return `${date} · ${time}`
}

// ─── Vue Composer ─────────────────────────────────────────────────────────────

function ComposeView({ pathname, ip }: { pathname: string; ip: string | undefined }) {
  const { addComment, setView, comments } = useCommentStore()
  const [text, setText]             = useState('')
  const [panelId, setPanelId]       = useState('')
  const [submitted, setSubmitted]   = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const panels      = ROUTE_PANELS[pathname] ?? []
  const routeLabel  = PAGE_LABELS[pathname] ?? pathname
  const selectedPanel = panels.find(p => p.id === panelId)

  // Reset panel select when route changes
  useEffect(() => { setPanelId('') }, [pathname])

  const handleSubmit = async () => {
    if (!text.trim() || submitting) return
    setSubmitting(true)
    await addComment({
      text: text.trim(),
      route: pathname,
      routeLabel,
      panelId: selectedPanel?.id,
      panelLabel: selectedPanel?.label,
      ip,
      userAgent: navigator.userAgent,
    })
    setSubmitting(false)
    setText('')
    setPanelId('')
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 2500)
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      <ScrollArea className="flex-1">
        <div className="p-4 flex flex-col gap-4">

          {/* Page actuelle */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-muted-foreground">Page actuelle :</span>
            <Badge variant="secondary" className="text-[11px] font-medium truncate max-w-[160px]">
              {routeLabel}
            </Badge>
          </div>

          {/* Message en dur */}
          <div className="rounded-lg border border-border/60 bg-muted/30 p-3 text-[12px] text-muted-foreground leading-relaxed">
            Vos retours contribuent directement à améliorer l'expérience{' '}
            <span className="font-semibold text-foreground">Bloomfield Terminal</span>.
            Décrivez ce que vous observez, ce qui manque ou ce qui pourrait être amélioré.
          </div>

          {/* Select panneau */}
          {panels.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
                Panneau concerné <span className="normal-case font-normal">(optionnel)</span>
              </label>
              <Select value={panelId} onValueChange={setPanelId}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Sélectionner un panneau…" />
                </SelectTrigger>
                <SelectContent className='bg-white text-black z-500'>
                  {panels.map(p => (
                    <SelectItem key={p.id} value={p.id} className="text-xs">
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Textarea */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
              Votre commentaire
            </label>
            <Textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Décrivez votre retour…"
              className="text-xs resize-none min-h-[100px]"
              onKeyDown={e => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit()
              }}
            />
            <span className="text-[10px] text-muted-foreground/60 text-right">
              ⌘↵ pour envoyer
            </span>
          </div>

          {/* Feedback envoi */}
          {submitted && (
            <div className="flex items-center gap-2 text-emerald-500 text-xs font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Commentaire enregistré
            </div>
          )}

          {/* Bouton envoyer */}
          <button
            onClick={handleSubmit}
            disabled={!text.trim() || submitting}
            className={cn(
              'flex items-center justify-center gap-2 w-full h-8 rounded-md text-xs font-semibold transition-colors',
              text.trim() && !submitting
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'bg-muted text-muted-foreground cursor-not-allowed',
            )}
          >
            <Send className="w-3 h-3" />
            {submitting ? 'Envoi…' : 'Envoyer le commentaire'}
          </button>
        </div>
      </ScrollArea>

      {/* Footer — voir tous */}
      <div className="shrink-0 border-t border-border/50 p-3">
        <button
          onClick={() => setView('list')}
          className="w-full text-xs text-primary/80 hover:text-primary font-medium py-1.5 rounded hover:bg-primary/5 transition-colors"
        >
          Voir tous les commentaires
          {comments.length > 0 && (
            <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-primary/15 text-primary text-[10px] font-bold">
              {comments.length}
            </span>
          )}
        </button>
      </div>
    </div>
  )
}

// ─── Vue Liste ────────────────────────────────────────────────────────────────

function ListView() {
  const { comments, deleteComment, updateComment, setView, loading } = useCommentStore()
  const [confirmId, setConfirmId]   = useState<string | null>(null)
  const [editingId, setEditingId]   = useState<string | null>(null)
  const [editText, setEditText]     = useState('')
  const [saving, setSaving]         = useState(false)

  const handleDelete = async (id: string) => {
    if (confirmId === id) {
      await deleteComment(id)
      setConfirmId(null)
    } else {
      setConfirmId(id)
      setEditingId(null) // ferme l'édition si ouverte sur ce commentaire
      setTimeout(() => setConfirmId(c => c === id ? null : c), 3000)
    }
  }

  const startEdit = (id: string, text: string) => {
    setEditingId(id)
    setEditText(text)
    setConfirmId(null)
  }

  const cancelEdit = () => { setEditingId(null); setEditText('') }

  const handleSave = async (id: string) => {
    if (!editText.trim() || saving) return
    setSaving(true)
    await updateComment(id, editText.trim())
    setSaving(false)
    setEditingId(null)
    setEditText('')
  }

  return (
    <ScrollArea className="flex-1">
      <div className="p-4 flex flex-col gap-3">
        {loading ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <p className="text-xs text-muted-foreground">Chargement…</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <MessageSquare className="w-8 h-8 text-muted-foreground/30" />
            <p className="text-xs text-muted-foreground">Aucun commentaire pour l'instant.</p>
          </div>
        ) : (
          comments.map(c => {
            const isEditing = editingId === c.id
            return (
              <div
                key={c.id}
                className="rounded-lg border border-border/50 bg-secondary/20 p-3 flex flex-col gap-2"
              >
                {/* Badges contexte */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-medium">
                    {c.routeLabel}
                  </Badge>
                  {c.panelLabel && (
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                      {c.panelLabel}
                    </Badge>
                  )}
                </div>

                {/* Texte ou champ d'édition */}
                {isEditing ? (
                  <div className="flex flex-col gap-1.5">
                    <Textarea
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      className="text-xs resize-none min-h-[72px]"
                      autoFocus
                      onKeyDown={e => {
                        if (e.key === 'Escape') cancelEdit()
                        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSave(c.id)
                      }}
                    />
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={cancelEdit}
                        className="text-[10px] text-muted-foreground hover:text-foreground px-2 py-0.5 rounded hover:bg-secondary/60 transition-colors"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={() => handleSave(c.id)}
                        disabled={!editText.trim() || saving}
                        className={cn(
                          'flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded transition-colors',
                          editText.trim() && !saving
                            ? 'bg-primary/15 text-primary hover:bg-primary/25'
                            : 'text-muted-foreground/40 cursor-not-allowed',
                        )}
                      >
                        <Check className="w-3 h-3" />
                        {saving ? 'Sauvegarde…' : 'Enregistrer'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap">{c.text}</p>
                )}

                {/* Footer */}
                {!isEditing && (
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] text-muted-foreground/60">{formatDate(c.timestamp)}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => startEdit(c.id, c.text)}
                        title="Modifier"
                        className="flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded transition-colors text-muted-foreground/50 hover:text-primary hover:bg-primary/10"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        title={confirmId === c.id ? 'Cliquer à nouveau pour confirmer' : 'Supprimer'}
                        className={cn(
                          'flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded transition-colors',
                          confirmId === c.id
                            ? 'text-destructive bg-destructive/10 hover:bg-destructive/20'
                            : 'text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10',
                        )}
                      >
                        <Trash2 className="w-3 h-3" />
                        {confirmId === c.id ? 'Confirmer ?' : ''}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </ScrollArea>
  )
}

// ─── CommentPanel (export public) ────────────────────────────────────────────

export function CommentPanel() {
  const pathname = usePathname()
  const { isOpen, view, toggle, setOpen, setView, comments, hideButton, fetchComments } = useCommentStore()
  const [visitorIp, setVisitorIp] = useState<string | undefined>(undefined)

  // Masquer sur les routes auth
  const hidden = pathname?.startsWith('/auth')

  // Chargement initial + tracking visiteur
  useEffect(() => {
    fetchComments()
    trackVisitor().then(ip => setVisitorIp(ip))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Fermer sur Escape
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, setOpen])

  if (hidden) return null

  return (
    <>
      {/* ── Bouton flottant ── */}
      <button
        onClick={toggle}
        title="Laisser un commentaire"
        aria-label="Ouvrir le panneau de commentaires"
        className={cn(
          'fixed bottom-6 right-6 z-[55] flex items-center justify-center',
          'w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg',
          'hover:bg-primary/90 hover:scale-105 transition-all duration-200',
          (isOpen || hideButton) && 'opacity-0 pointer-events-none scale-90',
        )}
      >
        <MessageSquare className="w-5 h-5" />
        {comments.length > 0 && !isOpen && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center shadow-sm">
            {comments.length > 99 ? '99+' : comments.length}
          </span>
        )}
      </button>

      {/* ── Sidebar ── */}
      <div
        className={cn(
          'fixed right-0 inset-y-0 z-[60] flex flex-col',
          'w-full sm:w-80',
          'bg-card border-l border-border shadow-2xl',
          'transition-transform duration-200 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/* Header */}
        <div className="h-11 shrink-0 flex items-center gap-2 px-4 border-b border-border/60 bg-secondary/20">
          {view === 'list' ? (
            <button
              onClick={() => setView('compose')}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mr-1"
              title="Nouveau commentaire"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Nouveau
            </button>
          ) : (
            <MessageSquare className="w-3.5 h-3.5 text-primary shrink-0" />
          )}

          <span className="flex-1 text-xs font-semibold text-foreground truncate">
            {view === 'list' ? 'Tous les commentaires' : 'Commentaires'}
          </span>

          <button
            onClick={() => setOpen(false)}
            title="Fermer"
            className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Contenu selon la vue */}
        {view === 'compose'
          ? <ComposeView pathname={pathname ?? '/'} ip={visitorIp} />
          : <ListView />
        }
      </div>
    </>
  )
}
