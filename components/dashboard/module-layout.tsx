'use client'

import React, { useState } from 'react'
import { PanelLeftClose, PanelLeft, Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useModuleSectionsStore } from '@/lib/module-sections-store'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SectionDef {
  id: string
  label: string
  icon: React.ElementType
}

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
  const { getConfig } = useModuleSectionsStore()
  const cfg = getConfig(pageKey, id)

  if (!cfg.visible) return null

  return (
    <div
      data-module-section
      className={cn('flex flex-col', className)}
      style={cfg.height > 0 ? { height: cfg.height } : undefined}
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

// ── ModuleLayout ──────────────────────────────────────────────────────────────

export function ModuleLayout({
  pageKey,
  sections,
  children,
  mainClassName,
}: {
  pageKey: string
  sections: SectionDef[]
  children: React.ReactNode
  mainClassName?: string
}) {
  const [open, setOpen] = useState(true)
  const { getConfig, toggle, showAll } = useModuleSectionsStore()

  const visibleCount = sections.filter(s => getConfig(pageKey, s.id).visible).length
  const hiddenCount  = sections.length - visibleCount

  return (
    <div className="flex-1 flex overflow-hidden min-h-0">

      {/* ── Sidebar ── */}
      <aside
        className={cn(
          'shrink-0 flex flex-col bg-card border-r border-border/50 transition-all duration-200 overflow-hidden',
          open ? 'w-44' : 'w-10',
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

        {/* Section list */}
        <div className="flex-1 overflow-y-auto py-1">
          {sections.map(s => {
            const visible = getConfig(pageKey, s.id).visible
            const Icon = s.icon
            return (
              <button
                key={s.id}
                onClick={() => toggle(pageKey, s.id)}
                title={open ? undefined : s.label}
                className={cn(
                  'w-full flex items-center gap-2 px-2 py-1.5 text-left transition-colors',
                  visible
                    ? 'text-foreground hover:bg-secondary/50'
                    : 'text-muted-foreground/40 hover:bg-secondary/30 hover:text-muted-foreground/60',
                )}
              >
                <Icon
                  className={cn(
                    'w-3.5 h-3.5 shrink-0',
                    visible ? 'text-primary' : 'text-muted-foreground/30',
                  )}
                />
                {open && (
                  <>
                    <span className="flex-1 text-[11px] font-medium truncate">{s.label}</span>
                    {visible
                      ? <Eye    className="w-3 h-3 shrink-0 text-primary/50" />
                      : <EyeOff className="w-3 h-3 shrink-0 text-muted-foreground/30" />}
                  </>
                )}
              </button>
            )
          })}
        </div>

        {/* Footer */}
        {open && hiddenCount > 0 && (
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

      {/* ── Main content ── */}
      <div className={cn('flex-1 overflow-auto min-w-0', mainClassName)}>
        {children}
      </div>

    </div>
  )
}
