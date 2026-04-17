'use client'

import React, { useState, useEffect, useContext, createContext, useCallback } from 'react'
import { PanelLeftClose, PanelLeft, Eye, EyeOff, LayoutList, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useModuleSectionsStore } from '@/lib/module-sections-store'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SectionDef {
  id: string
  label: string
  icon: React.ElementType
}

// ── Focus context ─────────────────────────────────────────────────────────────

const FocusContext = createContext<{
  focusedId: string | null
  totalSections: number
}>({ focusedId: null, totalSections: 0 })

// ── Resize handle (bottom edge of a section) ──────────────────────────────────

function SectionResizeHandle({
  pageKey,
  sectionId,
  currentHeight,
}: {
  pageKey: string
  sectionId: string
  currentHeight: number
}) {
  const { setHeight } = useModuleSectionsStore()

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    const section = (e.currentTarget as HTMLElement).closest('[data-module-section]') as HTMLElement
    const startY = e.clientY
    const startH = currentHeight > 0 ? currentHeight : section.getBoundingClientRect().height

    const onMove = (me: MouseEvent) => {
      const newH = Math.max(120, startH + (me.clientY - startY))
      setHeight(pageKey, sectionId, newH)
    }
    const onUp = () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }

  return (
    <div
      onMouseDown={onMouseDown}
      onDoubleClick={() => setHeight(pageKey, sectionId, 0)}
      title="Glisser pour redimensionner · Double-clic pour réinitialiser"
      className={cn(
        'h-[5px] w-full cursor-row-resize group/handle flex items-center justify-center',
        'bg-transparent hover:bg-primary/20 transition-colors',
      )}
    >
      <div className="w-8 h-[2px] rounded-full bg-border/60 group-hover/handle:bg-primary/60 transition-colors" />
    </div>
  )
}

// ── ModuleSection ─────────────────────────────────────────────────────────────

export function ModuleSection({
  pageKey,
  id,
  className,
  resizable = true,
  children,
}: {
  pageKey: string
  id: string
  className?: string
  resizable?: boolean
  children: React.ReactNode
}) {
  const [hydrated, setHydrated] = useState(false)
  const { getConfig } = useModuleSectionsStore()
  const cfg = getConfig(pageKey, id)
  const { focusedId, totalSections } = useContext(FocusContext)

  useEffect(() => { setHydrated(true) }, [])

  if (hydrated && !cfg.visible) return null

  const isDimmed = totalSections > 1 && focusedId !== null && focusedId !== id

  return (
    <div
      data-module-section
      data-module-section-id={id}
      className={cn(
        'flex flex-col transition-opacity duration-200',
        isDimmed && 'opacity-30',
        className,
      )}
      style={(resizable && cfg.height > 0) ? { height: cfg.height } : undefined}
    >
      <div className={cn('flex-1', cfg.height > 0 && 'overflow-auto min-h-0')}>
        {children}
      </div>
      {resizable && (
        <SectionResizeHandle pageKey={pageKey} sectionId={id} currentHeight={cfg.height} />
      )}
    </div>
  )
}

// ── Sidebar item (shared between desktop and mobile) ──────────────────────────

function SidebarItem({
  pageKey,
  section,
  focused,
  onFocus,
  showLabel,
}: {
  pageKey: string
  section: SectionDef
  focused: boolean
  onFocus: () => void
  showLabel: boolean
}) {
  const { getConfig, toggle } = useModuleSectionsStore()
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => { setHydrated(true) }, [])

  const visible = !hydrated || getConfig(pageKey, section.id).visible
  const Icon = section.icon

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onFocus}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onFocus() }}
      className={cn(
        'w-full flex items-center gap-2 px-2 py-1.5 cursor-pointer transition-colors select-none',
        focused
          ? 'bg-primary/10 text-foreground'
          : visible
            ? 'text-foreground hover:bg-secondary/50'
            : 'text-muted-foreground/40 hover:bg-secondary/30 hover:text-muted-foreground/60',
      )}
    >
      <Icon
        className={cn(
          'size-4 shrink-0',
          visible ? 'text-primary' : 'text-muted-foreground/30',
        )}
      />
      {showLabel && (
        <>
          <span className="flex-1 text-[14px] font-medium truncate">{section.label}</span>
          <button
            title={visible ? 'Masquer' : 'Afficher'}
            onClick={(e) => { e.stopPropagation(); toggle(pageKey, section.id) }}
            className="p-0.5 rounded hover:bg-secondary/60 transition-colors"
          >
            {visible
              ? <Eye    className="w-3 h-3 shrink-0 text-primary/50" />
              : <EyeOff className="w-3 h-3 shrink-0 text-muted-foreground/30" />}
          </button>
        </>
      )}
    </div>
  )
}

// ── ModuleLayout ──────────────────────────────────────────────────────────────

export function ModuleLayout({
  pageKey,
  sections,
  children,
  mainClassName,
  title,
}: {
  pageKey: string
  sections: SectionDef[]
  children: React.ReactNode
  mainClassName?: string
  /** Nom du module affiché dans l'en-tête mobile à côté du bouton panneau */
  title?: string
}) {
  const [open, setOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const [focusedId, setFocusedId] = useState<string | null>(null)
  const { getConfig, showAll } = useModuleSectionsStore()

  useEffect(() => { setHydrated(true) }, [])

  // Fermer le drawer mobile sur Échap
  useEffect(() => {
    if (!mobileOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [mobileOpen])

  // Scroll vers la section focalisée (mobile uniquement)
  useEffect(() => {
    if (!focusedId) return
    if (window.innerWidth >= 1024) return
    const el = document.querySelector(`[data-module-section-id="${focusedId}"]`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [focusedId])

  const handleFocus = useCallback((id: string) => {
    setFocusedId(prev => (prev === id ? null : id))
    setMobileOpen(false)
  }, [])

  const visibleCount = sections.filter(s => getConfig(pageKey, s.id).visible).length
  const hiddenCount  = sections.length - visibleCount

  return (
    <FocusContext.Provider value={{ focusedId, totalSections: sections.length }}>
      <div className="flex-1 flex flex-col overflow-hidden min-h-0">

        {/* ── En-tête mobile (masqué sur desktop) ── */}
        <div className="lg:hidden h-9 shrink-0 flex items-center gap-2 px-3 border-b border-border/50 bg-card/60 backdrop-blur-sm">
          <button
            onClick={() => setMobileOpen(true)}
            title="Afficher les panneaux"
            className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
          >
            <LayoutList className="w-4 h-4" />
          </button>
          {title && (
            <span className="text-xs font-semibold text-foreground truncate">{title}</span>
          )}
        </div>

        {/* ── Ligne contenu : sidebar + main ── */}
        <div className="flex-1 flex overflow-hidden min-h-0">

          {/* Fond obscur — mobile seulement */}
          {mobileOpen && (
            <div
              className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]"
              onClick={() => setMobileOpen(false)}
            />
          )}

          {/* ── Drawer mobile (overlay au-dessus du contenu) ── */}
          <aside
            className={cn(
              'lg:hidden fixed inset-y-0 left-0 z-50 flex flex-col w-64',
              'bg-card border-r border-border/50 overflow-hidden',
              'transition-transform duration-200 ease-in-out',
              mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full',
            )}
          >
            {/* Header drawer */}
            <div className="h-8 shrink-0 flex items-center justify-between border-b border-border/50 px-2 gap-2">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                Panneaux
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                title="Fermer"
                className="p-0.5 rounded text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Liste sections */}
            <div className="flex-1 overflow-y-auto py-1">
              {sections.map(s => (
                <SidebarItem
                  key={s.id}
                  pageKey={pageKey}
                  section={s}
                  focused={focusedId === s.id}
                  onFocus={() => handleFocus(s.id)}
                  showLabel
                />
              ))}
            </div>

            {/* Footer drawer */}
            {hydrated && hiddenCount > 0 && (
              <div className="shrink-0 border-t border-border/50 p-2">
                <button
                  onClick={() => { showAll(pageKey); setMobileOpen(false) }}
                  className="w-full text-[10px] text-primary/70 hover:text-primary font-medium py-1 rounded hover:bg-primary/5 transition-colors"
                >
                  Tout afficher ({hiddenCount} masqué{hiddenCount > 1 ? 's' : ''})
                </button>
              </div>
            )}
          </aside>

          {/* ── Sidebar desktop (inline, masquée sur mobile) ── */}
          <aside
            className={cn(
              'hidden lg:flex shrink-0 flex-col bg-card border-r border-border/50 transition-all duration-200 overflow-hidden',
              open ? 'w-50' : 'w-10',
            )}
          >
            {/* Header */}
            <div
              className={cn(
                'h-8 shrink-0 flex items-center border-b border-border/50 px-2 gap-2',
                open ? 'justify-between' : 'justify-center',
              )}
            >
              {open && (
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                  Panneaux
                </span>
              )}
              <button
                onClick={() => setOpen(o => !o)}
                className="p-0.5 rounded text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                title={open ? 'Réduire' : 'Étendre'}
              >
                {open
                  ? <PanelLeftClose className="w-3.5 h-3.5" />
                  : <PanelLeft      className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Liste sections */}
            <div className="flex-1 overflow-y-auto py-1">
              {sections.map(s => (
                <SidebarItem
                  key={s.id}
                  pageKey={pageKey}
                  section={s}
                  focused={focusedId === s.id}
                  onFocus={() => handleFocus(s.id)}
                  showLabel={open}
                />
              ))}
            </div>

            {/* Footer */}
            {open && hydrated && hiddenCount > 0 && (
              <div className="shrink-0 border-t border-border/50 p-2">
                <button
                  onClick={() => showAll(pageKey)}
                  className="w-full text-[10px] text-primary/70 hover:text-primary font-medium py-1 rounded hover:bg-primary/5 transition-colors"
                >
                  Tout afficher ({hiddenCount} masqué{hiddenCount > 1 ? 's' : ''})
                </button>
              </div>
            )}
          </aside>

          {/* ── Contenu principal ── */}
          <div className={cn('flex-1 overflow-auto min-w-0', mainClassName)}>
            {children}
          </div>

        </div>
      </div>
    </FocusContext.Provider>
  )
}
