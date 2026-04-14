'use client'

import React, { useState, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { X, LayoutGrid, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSplitStore, type GridPane } from '@/lib/split-store'

export const MODULE_DRAG_TYPE = 'application/x-bloomfield-module'

const MODULE_LABELS: Record<string, string> = {
  '/terminal/dashboard':     'Dashboard',
  '/terminal/portfolio':     'Portefeuille',
  '/terminal/operations':    'Opérations Boursières',
  '/terminal/macro':         'Données Macroéconomiques',
  '/terminal/analyse':       'Analyse Financière',
  '/terminal/communication': 'Communication & Éducation',
  '/terminal/admin':         'Administration',
}

// ── Grid size picker ──────────────────────────────────────────────────────────

function GridSizePicker() {
  const { cols, rows, setCols, setRows } = useSplitStore()
  const [hover, setHover] = useState<[number, number] | null>(null)
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className={cn(
          'flex items-center gap-1 text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded transition-colors',
          open ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50',
        )}
      >
        <LayoutGrid className="w-3 h-3" />
        {cols}×{rows}
        <ChevronDown className={cn('w-2.5 h-2.5 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1 p-3 bg-popover border border-border rounded-xl shadow-2xl z-50">
            <div className="text-[10px] text-muted-foreground mb-2 text-center font-medium">
              Taille de la grille
            </div>
            <div className="flex flex-col gap-1">
              {Array.from({ length: 3 }, (_, r) => (
                <div key={r} className="flex gap-1">
                  {Array.from({ length: 3 }, (_, c) => {
                    const isActive  = r < rows && c < cols
                    const isHovered = hover ? r <= hover[0] && c <= hover[1] : false
                    return (
                      <div
                        key={c}
                        onMouseEnter={() => setHover([r, c])}
                        onMouseLeave={() => setHover(null)}
                        onClick={() => { setCols(c + 1); setRows(r + 1); setOpen(false) }}
                        className={cn(
                          'w-7 h-6 rounded border cursor-pointer transition-all duration-100',
                          isHovered
                            ? 'bg-primary/60 border-primary scale-105'
                            : isActive
                              ? 'bg-primary/20 border-primary/50'
                              : 'bg-secondary/40 border-border/40 hover:border-primary/30',
                        )}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
            <div className="text-[10px] text-center mt-2 font-medium min-h-[14px]">
              {hover
                ? <span className="text-primary">{hover[1] + 1}×{hover[0] + 1}</span>
                : <span className="text-muted-foreground">{cols}×{rows} actuel</span>}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// ── Column resize handle ──────────────────────────────────────────────────────

function ColHandle({ gapIdx }: { gapIdx: number }) {
  const { colSizes, resizeCols } = useSplitStore()
  const leftPct = colSizes.slice(0, gapIdx + 1).reduce((a, b) => a + b, 0)

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    const container = (e.currentTarget as HTMLElement).parentElement!
    const { width } = container.getBoundingClientRect()
    const startX = e.clientX
    const a0 = colSizes[gapIdx]
    const b0 = colSizes[gapIdx + 1]

    const onMove = (me: MouseEvent) => {
      const delta = ((me.clientX - startX) / width) * 100
      const MIN = 10
      let a = a0 + delta
      let b = b0 - delta
      if (a < MIN) { a = MIN; b = a0 + b0 - MIN }
      if (b < MIN) { b = MIN; a = a0 + b0 - MIN }
      resizeCols(gapIdx, gapIdx + 1, a, b)
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
      className="absolute top-0 bottom-0 z-20 cursor-col-resize group"
      style={{ left: `${leftPct}%`, width: 6, transform: 'translateX(-50%)' }}
    >
      <div className="w-full h-full bg-border/50 group-hover:bg-primary/60 transition-colors" />
    </div>
  )
}

// ── Row resize handle ─────────────────────────────────────────────────────────

function RowHandle({ gapIdx }: { gapIdx: number }) {
  const { rowSizes, resizeRows } = useSplitStore()
  const topPct = rowSizes.slice(0, gapIdx + 1).reduce((a, b) => a + b, 0)

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    const container = (e.currentTarget as HTMLElement).parentElement!
    const { height } = container.getBoundingClientRect()
    const startY = e.clientY
    const a0 = rowSizes[gapIdx]
    const b0 = rowSizes[gapIdx + 1]

    const onMove = (me: MouseEvent) => {
      const delta = ((me.clientY - startY) / height) * 100
      const MIN = 10
      let a = a0 + delta
      let b = b0 - delta
      if (a < MIN) { a = MIN; b = a0 + b0 - MIN }
      if (b < MIN) { b = MIN; a = a0 + b0 - MIN }
      resizeRows(gapIdx, gapIdx + 1, a, b)
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
      className="absolute left-0 right-0 z-20 cursor-row-resize group"
      style={{ top: `${topPct}%`, height: 6, transform: 'translateY(-50%)' }}
    >
      <div className="w-full h-full bg-border/50 group-hover:bg-primary/60 transition-colors" />
    </div>
  )
}

// ── Grid cell ─────────────────────────────────────────────────────────────────

function GridCell({
  row, col, pane, isDragging,
}: {
  row: number
  col: number
  pane: GridPane | undefined
  isDragging: boolean
}) {
  const { setCell, clearCell } = useSplitStore()
  const [dropActive, setDropActive] = useState(false)

  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setDropActive(true) }
  const onDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setDropActive(false)
  }
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDropActive(false)
    try {
      const data = JSON.parse(e.dataTransfer.getData(MODULE_DRAG_TYPE))
      setCell(row, col, data.href, data.label)
    } catch {}
  }

  // ── Empty cell ──────────────────────────────────────────────────────────
  if (!pane) {
    return (
      <div
        className={cn(
          'relative flex items-center justify-center transition-all duration-150',
          'border border-dashed',
          isDragging && dropActive
            ? 'bg-primary/15 border-primary'
            : isDragging
              ? 'bg-primary/5 border-primary/40 animate-pulse'
              : 'bg-secondary/10 border-border/30',
        )}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        {isDragging ? (
          <span className="text-[11px] font-semibold text-primary/70">Déposer ici</span>
        ) : (
          <span className="text-2xl text-muted-foreground/20 select-none">+</span>
        )}
      </div>
    )
  }

  // ── Occupied cell ───────────────────────────────────────────────────────
  return (
    <div
      className="relative flex flex-col overflow-hidden"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {/* Title bar */}
      <div className="h-7 shrink-0 flex items-center justify-between px-2 gap-2 bg-secondary/50 border-b border-border/60 select-none">
        <span className="text-[11px] font-semibold text-muted-foreground truncate">{pane.label}</span>
        <button
          onClick={() => clearCell(row, col)}
          className="shrink-0 p-0.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          title="Vider ce panneau"
        >
          <X className="w-3 h-3" />
        </button>
      </div>

      {/* Iframe */}
      <div className="flex-1 relative overflow-hidden">
        <iframe
          src={`${pane.href}?panel=1`}
          title={pane.label}
          className="w-full h-full border-none"
          style={{ pointerEvents: isDragging ? 'none' : 'auto' }}
        />
        {dropActive && isDragging && (
          <div className="absolute inset-0 pointer-events-none bg-primary/15 border-2 border-dashed border-primary flex items-center justify-center">
            <span className="text-xs font-bold text-primary bg-background/90 px-3 py-1.5 rounded-lg shadow">
              Remplacer &quot;{pane.label}&quot;
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

// ── First-drop ghost grid overlay ─────────────────────────────────────────────

function FirstDropGrid({
  onDrop,
}: {
  onDrop: (row: number, col: number, data: { href: string; label: string }) => void
}) {
  const [hover, setHover] = useState<[number, number] | null>(null)

  return (
    <div className="absolute inset-0 z-40 bg-background/75 backdrop-blur-sm flex items-center justify-center">
      <div className="flex flex-col gap-3 p-5 bg-card border border-border rounded-2xl shadow-2xl">
        <div className="text-xs font-semibold text-foreground text-center">
          Choisissez la cellule cible
        </div>
        <div className="text-[10px] text-muted-foreground text-center -mt-1">
          La taille de la grille s'adapte automatiquement
        </div>

        <div className="flex flex-col gap-1.5">
          {Array.from({ length: 3 }, (_, r) => (
            <div key={r} className="flex gap-1.5">
              {Array.from({ length: 3 }, (_, c) => {
                const isCurrent  = r === 0 && c === 0
                const isHighlight = hover ? r <= hover[0] && c <= hover[1] : false
                const isTarget    = hover ? r === hover[0] && c === hover[1] : false

                return (
                  <div
                    key={c}
                    onDragOver={!isCurrent ? (e) => { e.preventDefault(); setHover([r, c]) } : undefined}
                    onDragLeave={!isCurrent ? (e) => {
                      if (!e.currentTarget.contains(e.relatedTarget as Node)) setHover(null)
                    } : undefined}
                    onDrop={!isCurrent ? (e) => {
                      e.preventDefault()
                      setHover(null)
                      try { onDrop(r, c, JSON.parse(e.dataTransfer.getData(MODULE_DRAG_TYPE))) } catch {}
                    } : undefined}
                    className={cn(
                      'w-24 h-16 rounded-lg border-2 flex items-center justify-center transition-all duration-100 text-[10px] font-semibold',
                      isCurrent
                        ? 'bg-primary/15 border-primary/50 text-primary cursor-default'
                        : isTarget
                          ? 'bg-primary/30 border-primary scale-105 text-primary cursor-copy shadow-lg shadow-primary/20'
                          : isHighlight
                            ? 'bg-primary/10 border-primary/50 text-primary/70 cursor-copy'
                            : 'bg-secondary/30 border-border/40 text-muted-foreground/50 cursor-copy hover:border-primary/40 hover:bg-secondary/50',
                    )}
                  >
                    {isCurrent
                      ? 'Actuel'
                      : isTarget
                        ? `${c + 1}×${r + 1}`
                        : ''}
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        <div className="text-[11px] text-center min-h-[16px]">
          {hover
            ? <span className="text-primary font-semibold">Grille {hover[1] + 1} × {hover[0] + 1}</span>
            : <span className="text-muted-foreground/60">Survolez une cellule</span>}
        </div>
      </div>
    </div>
  )
}

// ── SplitWorkspace ────────────────────────────────────────────────────────────

export function SplitWorkspace({ children }: { children: React.ReactNode }) {
  const {
    isActive, cols, rows, colSizes, rowSizes, cells,
    isDraggingModule, activate, closeAll,
  } = useSplitStore()
  const pathname     = usePathname()
  const currentLabel = MODULE_LABELS[pathname] ?? 'Actuel'

  const handleFirstDrop = useCallback(
    (row: number, col: number, data: { href: string; label: string }) => {
      activate(pathname, currentLabel, data.href, data.label, row, col)
    },
    [pathname, currentLabel, activate],
  )

  // ── Normal mode ───────────────────────────────────────────────────────────
  if (!isActive) {
    return (
      <div className="flex-1 relative overflow-hidden">
        {isDraggingModule && <FirstDropGrid onDrop={handleFirstDrop} />}
        <div className={cn('h-full overflow-auto', isDraggingModule && 'pointer-events-none')}>
          {children}
        </div>
      </div>
    )
  }

  // ── Grid mode ─────────────────────────────────────────────────────────────
  const gridTemplateColumns = colSizes.map(s => `${s}fr`).join(' ')
  const gridTemplateRows    = rowSizes.map(s => `${s}fr`).join(' ')

  return (
    <div className="flex-1 flex flex-col overflow-hidden">

      {/* Control strip */}
      <div className="h-7 shrink-0 flex items-center justify-between px-3 bg-secondary/20 border-b border-border/40">
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          <GridSizePicker />
          <span className="text-border">·</span>
          <span className="text-muted-foreground/50 hidden sm:block">
            Glissez un module sur n'importe quelle cellule
          </span>
        </div>
        <button
          onClick={closeAll}
          className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-3 h-3" />
          Fermer la grille
        </button>
      </div>

      {/* Grid */}
      <div
        className="flex-1 relative overflow-hidden"
        style={{ display: 'grid', gridTemplateColumns, gridTemplateRows }}
      >
        {/* Cells */}
        {Array.from({ length: rows }, (_, r) =>
          Array.from({ length: cols }, (_, c) => (
            <GridCell
              key={`${r}-${c}`}
              row={r} col={c}
              pane={cells[`${r}-${c}`]}
              isDragging={isDraggingModule}
            />
          ))
        )}

        {/* Column resize handles */}
        {Array.from({ length: cols - 1 }, (_, i) => (
          <ColHandle key={`col-${i}`} gapIdx={i} />
        ))}

        {/* Row resize handles */}
        {Array.from({ length: rows - 1 }, (_, i) => (
          <RowHandle key={`row-${i}`} gapIdx={i} />
        ))}
      </div>

    </div>
  )
}
