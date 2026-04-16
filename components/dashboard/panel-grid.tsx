'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import React from 'react'
import { cn } from '@/lib/utils'
import { useModuleSectionsStore } from '@/lib/module-sections-store'
import {
  X, Maximize2, Minimize2,
  FileDown, ImageDown,
  ZoomIn, ZoomOut,
  GripVertical,
} from 'lucide-react'

// ─── Public types ─────────────────────────────────────────────────────────────

export interface PanelCell {
  id: string
  title: string
  icon: React.ElementType
  content: React.ReactNode
  initialFlex?: number
  csvExport?: () => void
  imageExportId?: string
}

export interface PanelRow {
  id: string
  cells: PanelCell[]
}

// ─── Utilitaires d'export ─────────────────────────────────────────────────────

export function downloadCSV(
  headers: string[],
  rows: (string | number)[][],
  filename: string,
) {
  const esc = (v: string | number) => {
    const s = String(v)
    return s.includes(',') || s.includes('"') || s.includes('\n')
      ? `"${s.replace(/"/g, '""')}"`
      : s
  }
  const csv = [headers, ...rows].map(r => r.map(esc).join(',')).join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}

export function downloadChartAsPNG(chartId: string, filename: string) {
  const container = document.querySelector(`[data-chart-id="${chartId}"]`)
  const svg = container?.querySelector('svg')
  if (!svg) return
  const { width, height } = svg.getBoundingClientRect()
  const scale = 2
  const canvas = document.createElement('canvas')
  canvas.width = width * scale; canvas.height = height * scale
  const ctx = canvas.getContext('2d')!
  ctx.scale(scale, scale)
  ctx.fillStyle = '#111118'
  ctx.fillRect(0, 0, width, height)
  const svgBlob = new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(svgBlob)
  const img = new Image()
  img.onload = () => {
    ctx.drawImage(img, 0, 0)
    URL.revokeObjectURL(url)
    canvas.toBlob(out => {
      if (!out) return
      const a = document.createElement('a')
      a.href = URL.createObjectURL(out); a.download = filename; a.click()
    }, 'image/png')
  }
  img.src = url
}

// ─── ChartZoom ────────────────────────────────────────────────────────────────

export const ZOOM_MAIN: number[]      = [140, 176, 220, 270, 340]
export const ZOOM_INDICATOR: number[] = [50, 70, 90, 120, 160]

export function ChartZoom({
  children,
  heights = ZOOM_MAIN,
  defaultLevel = 1,
}: {
  children: (height: number) => React.ReactNode
  heights?: number[]
  defaultLevel?: number
}) {
  const [zoom, setZoom] = useState(defaultLevel)
  const max = heights.length - 1

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-end gap-0.5">
        <button
          onClick={() => setZoom(z => Math.max(0, z - 1))}
          disabled={zoom === 0}
          title="Zoom arrière"
          className={cn('p-1 rounded transition-colors',
            zoom === 0 ? 'text-muted-foreground/20 cursor-not-allowed' : 'text-muted-foreground/50 hover:text-foreground hover:bg-secondary/60')}
        ><ZoomOut className="size-3.5" /></button>

        <div className="flex gap-0.5 items-center px-1">
          {heights.map((_, i) => (
            <button key={i} onClick={() => setZoom(i)}
              className={cn('rounded-full transition-all',
                i === zoom ? 'w-2 h-2 bg-primary' : 'w-1.5 h-1.5 bg-border/60 hover:bg-muted-foreground/40')}
            />
          ))}
        </div>

        <button
          onClick={() => setZoom(z => Math.min(max, z + 1))}
          disabled={zoom === max}
          title="Zoom avant"
          className={cn('p-1 rounded transition-colors',
            zoom === max ? 'text-muted-foreground/20 cursor-not-allowed' : 'text-muted-foreground/50 hover:text-foreground hover:bg-secondary/60')}
        ><ZoomIn className="size-3.5" /></button>
      </div>

      <div style={{ height: heights[zoom], transition: 'height 0.2s ease' }}>
        {children(heights[zoom])}
      </div>
    </div>
  )
}

// ─── Helpers desktop ──────────────────────────────────────────────────────────

function startAxisResize(opts: {
  startPx: number; startValues: number[]; idx: number
  containerSizePx: () => number; min: number; cursor: string
  onUpdate: (values: number[]) => void
}) {
  const { startPx, startValues, idx, containerSizePx, min, cursor, onUpdate } = opts
  const onMove = (me: MouseEvent) => {
    const total = containerSizePx()
    if (total === 0) return
    const delta = ((cursor === 'col-resize' ? me.clientX : me.clientY) - startPx) / total * 100
    const next = [...startValues]
    next[idx]     = Math.max(min, startValues[idx] + delta)
    next[idx + 1] = Math.max(min, startValues[idx + 1] - delta)
    const sum = next.reduce((a, b) => a + b, 0)
    onUpdate(next.map(v => (v / sum) * 100))
  }
  const onUp = () => {
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onUp)
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }
  document.body.style.cursor = cursor
  document.body.style.userSelect = 'none'
  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
}

function equalArr(n: number) { return Array.from({ length: n }, () => 100 / n) }

function initialColWidths(cells: PanelCell[]) {
  const total = cells.reduce((s, c) => s + (c.initialFlex ?? 1), 0)
  return cells.map(c => ((c.initialFlex ?? 1) / total) * 100)
}

// ─── Helpers mobile ───────────────────────────────────────────────────────────

const MOBILE_DEFAULT_H = 300

/** Drag pointer-based pour réordonnancement mobile. Utilise une variable locale
 *  pour éviter les closures stale dans le handler onUp. */
function startMobileDrag({
  cellId, cellRefs, onUpdate, onCommit,
}: {
  cellId: string
  cellRefs: React.MutableRefObject<Map<string, HTMLElement>>
  onUpdate: (dragging: string | null, target: string | null) => void
  onCommit: (from: string, to: string) => void
}) {
  let currentTarget: string | null = null
  onUpdate(cellId, null)

  const onMove = (e: PointerEvent) => {
    let found: string | null = null
    for (const [id, el] of cellRefs.current) {
      if (id === cellId) continue
      const r = el.getBoundingClientRect()
      if (e.clientY >= r.top && e.clientY <= r.bottom) { found = id; break }
    }
    if (found !== currentTarget) {
      currentTarget = found
      onUpdate(cellId, currentTarget)
    }
  }

  const onUp = () => {
    document.removeEventListener('pointermove', onMove)
    document.removeEventListener('pointerup', onUp)
    if (currentTarget) onCommit(cellId, currentTarget)
    onUpdate(null, null)
  }

  document.addEventListener('pointermove', onMove)
  document.addEventListener('pointerup', onUp)
}

// ─── Bouton d'action ──────────────────────────────────────────────────────────

function ActionBtn({ title, onClick, hoverClass, children }: {
  title: string
  onClick: (e: React.MouseEvent) => void
  hoverClass?: string
  children: React.ReactNode
}) {
  return (
    <button
      draggable={false}
      onMouseDown={e => e.stopPropagation()}
      onClick={e => { e.stopPropagation(); onClick(e) }}
      title={title}
      className={cn('p-0.5 rounded text-muted-foreground/30 hover:bg-secondary/60 transition-colors cursor-pointer', hoverClass ?? 'hover:text-muted-foreground')}
    >{children}</button>
  )
}

// ─── Carte panneau ────────────────────────────────────────────────────────────

function PanelCard({
  cell, isDraggingThis, isDragTarget, isMaximized,
  onMaximize, onHide,
  onDragStart, onDragEnd, onDragOver, onDrop,
  onMobileDragStart,
}: {
  cell: PanelCell
  isDraggingThis?: boolean
  isDragTarget?: boolean
  isMaximized?: boolean
  onMaximize: () => void
  onHide?: () => void
  onDragStart?: () => void
  onDragEnd?: () => void
  onDragOver?: (e: React.DragEvent) => void
  onDrop?: () => void
  /** Drag pointer-based pour mobile (remplace draggable HTML) */
  onMobileDragStart?: (e: React.PointerEvent) => void
}) {
  const Icon = cell.icon
  const draggable = !!onDragStart

  return (
    <div
      data-chart-id={cell.imageExportId ?? cell.id}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={cn(
        'rounded-xl border bg-card/80 backdrop-blur-sm flex flex-col overflow-hidden h-full transition-all duration-200',
        isDraggingThis && 'opacity-40 scale-[0.98] shadow-none',
        isDragTarget && 'ring-2 ring-primary/50 border-primary/30 shadow-lg shadow-primary/10',
        isMaximized && 'border-primary/30',
        !isDraggingThis && !isDragTarget && !isMaximized && 'border-border/50 hover:border-border',
      )}
    >
      {/* En-tête */}
      <div
        draggable={draggable}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        className={cn(
          'flex items-center gap-2 px-3 py-1 border-b border-border/50 bg-secondary/20 select-none shrink-0',
          draggable ? 'cursor-grab active:cursor-grabbing' : 'cursor-default',
        )}
      >
        {/* Grip desktop */}
        {draggable && (
          <GripVertical className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0" />
        )}
        {/* Grip mobile (pointer-based, touch-none pour bloquer le scroll) */}
        {onMobileDragStart && (
          <div
            onPointerDown={e => { e.preventDefault(); onMobileDragStart(e) }}
            className="touch-none cursor-grab active:cursor-grabbing shrink-0 p-0.5 -ml-0.5 text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors"
          >
            <GripVertical className="w-3.5 h-3.5" />
          </div>
        )}

        {/* <Icon className="w-4 h-4 text-primary shrink-0" /> */}
        <span className="text-sm font-semibold text-foreground truncate flex-1">{cell.title}</span>

        <div className="flex items-center gap-1 shrink-0">
          {cell.csvExport && (
            <ActionBtn title="Exporter CSV" hoverClass="hover:text-emerald-500" onClick={() => cell.csvExport!()}>
              <FileDown className="size-3.5" />
            </ActionBtn>
          )}
          {cell.imageExportId && (
            <ActionBtn title="Exporter image PNG" hoverClass="hover:text-blue-400"
              onClick={() => downloadChartAsPNG(cell.imageExportId!, `bloomfield-${cell.imageExportId}-${new Date().toISOString().slice(0, 10)}.png`)}>
              <ImageDown className="size-3.5" />
            </ActionBtn>
          )}
          <ActionBtn
            title={isMaximized ? 'Restaurer la grille' : 'Agrandir ce panneau'}
            hoverClass={isMaximized ? 'hover:text-primary' : 'hover:text-muted-foreground'}
            onClick={onMaximize}
          >
            {isMaximized ? <Minimize2 className="size-3.5 text-primary/60" /> : <Maximize2 className="size-3.5" />}
          </ActionBtn>
          {onHide && (
            <ActionBtn title="Masquer ce panneau" onClick={onHide}>
              <X className="size-3.5" />
            </ActionBtn>
          )}
        </div>
      </div>

      {/* Corps */}
      <div className="p-2 overflow-auto flex-1 min-h-0">
        {cell.content}
      </div>
    </div>
  )
}

// ─── Ligne desktop ────────────────────────────────────────────────────────────

function PanelRowInner({
  cells, widths, onWidthsChange, onMaximize, onHide,
  dragging, dragOver, onDragStart, onDragOver, onDrop, onDragEnd,
}: {
  cells: PanelCell[]
  widths: number[]
  onWidthsChange: (w: number[]) => void
  onMaximize: (id: string) => void
  onHide?: (id: string) => void
  dragging?: string | null
  dragOver?: string | null
  onDragStart?: (id: string) => void
  onDragOver?: (e: React.DragEvent, id: string) => void
  onDrop?: (id: string) => void
  onDragEnd?: () => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={containerRef} className="flex items-stretch min-h-0 h-full">
      {cells.map((cell, i) => (
        <React.Fragment key={cell.id}>
          <div style={{ flex: `${widths[i] ?? (100 / cells.length)} 1 0%`, minWidth: 0, minHeight: 0 }}>
            <PanelCard
              cell={cell}
              isDraggingThis={dragging === cell.id}
              isDragTarget={dragOver === cell.id && dragging !== cell.id}
              isMaximized={false}
              onMaximize={() => onMaximize(cell.id)}
              onHide={onHide ? () => onHide(cell.id) : undefined}
              onDragStart={onDragStart ? () => onDragStart(cell.id) : undefined}
              onDragEnd={onDragEnd}
              onDragOver={onDragOver ? e => onDragOver(e, cell.id) : undefined}
              onDrop={onDrop ? () => onDrop(cell.id) : undefined}
            />
          </div>

          {i < cells.length - 1 && (
            <div
              onMouseDown={e => {
                e.preventDefault(); e.stopPropagation()
                startAxisResize({
                  startPx: e.clientX, startValues: widths, idx: i,
                  containerSizePx: () => containerRef.current?.getBoundingClientRect().width ?? 0,
                  min: 12, cursor: 'col-resize', onUpdate: onWidthsChange,
                })
              }}
              onDoubleClick={() => onWidthsChange(initialColWidths(cells))}
              draggable={false}
              title="Glisser pour redimensionner · Double-clic pour réinitialiser"
              className="w-3 shrink-0 flex items-stretch justify-center cursor-col-resize group/colhandle hover:bg-primary/8 transition-colors select-none"
            >
              <div className="w-px self-stretch bg-border/40 group-hover/colhandle:w-[3px] group-hover/colhandle:bg-primary/50 group-hover/colhandle:rounded-full transition-all duration-150" />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

// ─── Liste mobile (colonne unique, réordonnable, redimensionnable) ────────────

function MobilePanelList({
  cells, order, onOrderChange, heights, onHeightChange, onMaximize, onHide,
}: {
  cells: PanelCell[]
  order: string[]
  onOrderChange: (newOrder: string[]) => void
  heights: Record<string, number>
  onHeightChange: (id: string, h: number) => void
  onMaximize: (id: string) => void
  onHide?: (id: string) => void
}) {
  const [dragging, setDragging]     = useState<string | null>(null)
  const [dragTarget, setDragTarget] = useState<string | null>(null)
  const cellRefs = useRef<Map<string, HTMLElement>>(new Map())

  const orderedCells = order
    .filter(id => cells.some(c => c.id === id))
    .map(id => cells.find(c => c.id === id)!)

  return (
    <div className="flex flex-col gap-0">
      {orderedCells.map((cell, i) => (
        <React.Fragment key={cell.id}>
          <div
            ref={el => { if (el) cellRefs.current.set(cell.id, el); else cellRefs.current.delete(cell.id) }}
            style={{ height: heights[cell.id] ?? MOBILE_DEFAULT_H }}
          >
            <PanelCard
              cell={cell}
              isDraggingThis={dragging === cell.id}
              isDragTarget={dragTarget === cell.id && dragging !== cell.id}
              isMaximized={false}
              onMaximize={() => onMaximize(cell.id)}
              onHide={onHide ? () => onHide(cell.id) : undefined}
              onMobileDragStart={e => {
                startMobileDrag({
                  cellId: cell.id,
                  cellRefs,
                  onUpdate: (d, t) => { setDragging(d); setDragTarget(t) },
                  onCommit: (from, to) => {
                    const next = [...order]
                    const fi = next.indexOf(from)
                    const ti = next.indexOf(to)
                    if (fi !== -1 && ti !== -1) { next.splice(fi, 1); next.splice(ti, 0, from) }
                    onOrderChange(next)
                  },
                })
              }}
            />
          </div>

          {/* Poignée de redimensionnement vertical mobile */}
          {i < orderedCells.length - 1 && (
            <div
              onPointerDown={e => {
                e.preventDefault()
                const startY = e.clientY
                const startH = heights[cell.id] ?? MOBILE_DEFAULT_H
                const onMove = (me: PointerEvent) =>
                  onHeightChange(cell.id, Math.max(150, startH + (me.clientY - startY)))
                const onUp = () => {
                  document.removeEventListener('pointermove', onMove)
                  document.removeEventListener('pointerup', onUp)
                }
                document.addEventListener('pointermove', onMove)
                document.addEventListener('pointerup', onUp)
              }}
              onDoubleClick={() => onHeightChange(cell.id, MOBILE_DEFAULT_H)}
              title="Glisser pour redimensionner · Double-clic pour réinitialiser"
              className="h-4 shrink-0 flex items-center justify-center cursor-row-resize group/mhandle hover:bg-primary/8 transition-colors select-none touch-none"
            >
              <div className="h-px w-10 bg-border/40 group-hover/mhandle:h-[3px] group-hover/mhandle:w-full group-hover/mhandle:bg-primary/50 group-hover/mhandle:rounded-full transition-all duration-150" />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

// ─── PanelGrid (export public) ────────────────────────────────────────────────

export function PanelGrid({
  rows, pageKey, onHide,
  dragging, dragOver, onDragStart, onDragOver, onDrop, onDragEnd,
}: {
  rows: PanelRow[]
  pageKey?: string
  onHide?: (id: string) => void
  dragging?: string | null
  dragOver?: string | null
  onDragStart?: (id: string) => void
  onDragOver?: (e: React.DragEvent, id: string) => void
  onDrop?: (id: string) => void
  onDragEnd?: () => void
}) {
  const [maximized, setMaximized]       = useState<string | null>(null)
  const [colWidthsMap, setColWidthsMap] = useState<Record<string, number[]>>({})
  const [rowHeights, setRowHeights]     = useState<number[]>([])
  const containerRef                     = useRef<HTMLDivElement>(null)

  // ── Détection mobile (< lg = 1024px) ──────────────────────────────────────
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // ── État mobile ────────────────────────────────────────────────────────────
  const [mobileOrder, setMobileOrder]           = useState<string[]>([])
  const [mobileCellHeights, setMobileCellHeights] = useState<Record<string, number>>({})

  // ── Store visibilité ───────────────────────────────────────────────────────
  const configs = useModuleSectionsStore(state => state.configs)
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => { setHydrated(true) }, [])

  const visibleRows = rows.map(row => ({
    ...row,
    visibleCells: row.cells.filter(c => {
      if (!pageKey || !hydrated) return true
      const cfg = configs[pageKey]?.[c.id]
      return cfg === undefined ? true : cfg.visible
    }),
  })).filter(r => r.visibleCells.length > 0)

  const flatCells   = visibleRows.flatMap(r => r.visibleCells)
  const flatCellIds = flatCells.map(c => c.id).join(',')

  // Synchronise l'ordre mobile quand les cellules visibles changent
  useEffect(() => {
    setMobileOrder(prev => {
      const ids = flatCells.map(c => c.id)
      const kept  = prev.filter(id => ids.includes(id))
      const added = ids.filter(id => !kept.includes(id))
      return [...kept, ...added]
    })
  }, [flatCellIds]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Desktop: hauteurs de lignes ────────────────────────────────────────────
  useEffect(() => {
    setRowHeights(prev =>
      prev.length === visibleRows.length ? prev : equalArr(visibleRows.length),
    )
  }, [visibleRows.length]) // eslint-disable-line react-hooks/exhaustive-deps

  const rowKey = (row: typeof visibleRows[0]) =>
    `${row.id}:${row.visibleCells.map(c => c.id).join(',')}`

  const getColWidths = (row: typeof visibleRows[0]) =>
    colWidthsMap[rowKey(row)] ?? initialColWidths(row.visibleCells)

  const setColWidths = useCallback((row: typeof visibleRows[0], w: number[]) => {
    setColWidthsMap(prev => ({ ...prev, [rowKey(row)]: w }))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const maximizedCell = maximized
    ? rows.flatMap(r => r.cells).find(c => c.id === maximized) ?? null
    : null

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div ref={containerRef} className="flex-1 min-h-0 flex flex-col">

      {maximizedCell ? (
        /* Panneau agrandi — identique desktop et mobile */
        <div className="flex-1 min-h-0">
          <PanelCard
            cell={maximizedCell}
            isMaximized
            onMaximize={() => setMaximized(null)}
            onHide={onHide ? () => { onHide(maximizedCell.id); setMaximized(null) } : undefined}
          />
        </div>

      ) : isMobile ? (
        /* Vue mobile : colonne unique scrollable, réordonnable, redimensionnable */
        <div className="flex-1 min-h-0 overflow-y-auto px-1 py-1">
          <MobilePanelList
            cells={flatCells}
            order={mobileOrder}
            onOrderChange={setMobileOrder}
            heights={mobileCellHeights}
            onHeightChange={(id, h) => setMobileCellHeights(prev => ({ ...prev, [id]: h }))}
            onMaximize={setMaximized}
            onHide={onHide}
          />
        </div>

      ) : (
        /* Vue desktop : grille multi-colonnes/lignes */
        visibleRows.map((row, i) => (
          <React.Fragment key={row.id}>
            <div style={{ flex: `${rowHeights[i] ?? (100 / visibleRows.length)} 1 0%`, minHeight: 0 }}>
              <PanelRowInner
                cells={row.visibleCells}
                widths={getColWidths(row)}
                onWidthsChange={w => setColWidths(row, w)}
                onMaximize={setMaximized}
                onHide={onHide}
                dragging={dragging}
                dragOver={dragOver}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDrop={onDrop}
                onDragEnd={onDragEnd}
              />
            </div>

            {i < visibleRows.length - 1 && (
              <div
                onMouseDown={e => {
                  e.preventDefault()
                  startAxisResize({
                    startPx: e.clientY, startValues: rowHeights, idx: i,
                    containerSizePx: () => containerRef.current?.getBoundingClientRect().height ?? 0,
                    min: 8, cursor: 'row-resize', onUpdate: setRowHeights,
                  })
                }}
                onDoubleClick={() => setRowHeights(equalArr(visibleRows.length))}
                draggable={false}
                title="Glisser pour redimensionner · Double-clic pour égaliser"
                className="h-3 shrink-0 flex items-center justify-center cursor-row-resize group/rowhandle hover:bg-primary/8 transition-colors select-none"
              >
                <div className="h-px w-10 bg-border/40 group-hover/rowhandle:h-[3px] group-hover/rowhandle:w-full group-hover/rowhandle:bg-primary/50 group-hover/rowhandle:rounded-full transition-all duration-150" />
              </div>
            )}
          </React.Fragment>
        ))
      )}

    </div>
  )
}
