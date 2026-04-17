'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import React from 'react'
import { cn } from '@/lib/utils'
import { useModuleSectionsStore } from '@/lib/module-sections-store'
import {
  X, Maximize2, Minimize2,
  FileDown, ImageDown,
  ZoomIn, ZoomOut,
  GripVertical, Copy,
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

const DEFAULT_ROW_HEIGHT = 380

function initialColWidths(cells: PanelCell[]) {
  const total = cells.reduce((s, c) => s + (c.initialFlex ?? 1), 0)
  return cells.map(c => ((c.initialFlex ?? 1) / total) * 100)
}

// ─── Helpers mobile ───────────────────────────────────────────────────────────

const MOBILE_DEFAULT_H = 300

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

// ─── Export CSV par défaut (scrape la première <table> du panneau) ────────────

function exportTableCSV(chartId: string, title: string) {
  const container = document.querySelector(`[data-chart-id="${chartId}"]`)
  const table = container?.querySelector('table')
  if (!table) return
  const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent?.trim() ?? '')
  const rows = Array.from(table.querySelectorAll('tbody tr')).map(tr =>
    Array.from(tr.querySelectorAll('td')).map(td => td.textContent?.trim() ?? '')
  )
  if (!headers.length && !rows.length) return
  downloadCSV(headers, rows, `bloomfield-${title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.csv`)
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
  onMaximize, onHide, onDuplicate,
  onDragStart, onDragEnd, onDragOver, onDrop,
  onMobileDragStart,
}: {
  cell: PanelCell
  isDraggingThis?: boolean
  isDragTarget?: boolean
  isMaximized?: boolean
  onMaximize: () => void
  onHide?: () => void
  onDuplicate?: () => void
  onDragStart?: () => void
  onDragEnd?: () => void
  onDragOver?: (e: React.DragEvent) => void
  onDrop?: () => void
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
        'rounded-sm border bg-card/80 backdrop-blur-sm flex flex-col overflow-hidden h-full transition-all duration-200',
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
        {/* Grip mobile */}
        {onMobileDragStart && (
          <div
            onPointerDown={e => { e.preventDefault(); onMobileDragStart(e) }}
            className="touch-none cursor-grab active:cursor-grabbing shrink-0 p-0.5 -ml-0.5 text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors"
          >
            <GripVertical className="w-3.5 h-3.5" />
          </div>
        )}

        <span className="text-sm font-semibold text-foreground truncate flex-1">{cell.title}</span>

        <div className="flex items-center gap-1 shrink-0">
          <ActionBtn
            title="Exporter CSV"
            hoverClass="hover:text-emerald-500"
            onClick={() => cell.csvExport
              ? cell.csvExport()
              : exportTableCSV(cell.imageExportId ?? cell.id, cell.title)
            }
          >
            <FileDown className="size-3.5" />
          </ActionBtn>
          {cell.imageExportId && (
            <ActionBtn title="Exporter image PNG" hoverClass="hover:text-blue-400"
              onClick={() => downloadChartAsPNG(cell.imageExportId!, `bloomfield-${cell.imageExportId}-${new Date().toISOString().slice(0, 10)}.png`)}>
              <ImageDown className="size-3.5" />
            </ActionBtn>
          )}
          {onDuplicate && (
            <ActionBtn title="Dupliquer ce panneau" hoverClass="hover:text-violet-400" onClick={onDuplicate}>
              <Copy className="size-3.5" />
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
  cells, widths, onWidthsChange, onMaximize, onHide, onDuplicate,
  dragging, dragOver, onDragStart, onDragOver, onDrop, onDragEnd,
}: {
  cells: PanelCell[]
  widths: number[]
  onWidthsChange: (w: number[]) => void
  onMaximize: (id: string) => void
  onHide?: (id: string) => void
  onDuplicate: (id: string) => void
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
              onDuplicate={() => onDuplicate(cell.id)}
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

// ─── Liste mobile ─────────────────────────────────────────────────────────────

function MobilePanelList({
  cells, order, onOrderChange, heights, onHeightChange, onMaximize, onHide, onDuplicate,
}: {
  cells: PanelCell[]
  order: string[]
  onOrderChange: (newOrder: string[]) => void
  heights: Record<string, number>
  onHeightChange: (id: string, h: number) => void
  onMaximize: (id: string) => void
  onHide?: (id: string) => void
  onDuplicate: (id: string) => void
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
              onDuplicate={() => onDuplicate(cell.id)}
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

interface DuplicateEntry {
  rowId: string
  afterId: string
  cell: PanelCell
}

export function PanelGrid({
  rows, pageKey, onHide,
}: {
  rows: PanelRow[]
  pageKey?: string
  onHide?: (id: string) => void
}) {
  const [maximized, setMaximized]           = useState<string | null>(null)
  const [colWidthsMap, setColWidthsMap]     = useState<Record<string, number[]>>({})
  const [rowHeights, setRowHeights]         = useState<number[]>([])
  const [duplicates, setDuplicates]         = useState<DuplicateEntry[]>([])
  // rowContents[rowId] = liste ordonnée des cell ids dans cette ligne (cross-row inclus)
  const [rowContents, setRowContents]       = useState<Record<string, string[]>>({})
  const [dragging, setDragging]             = useState<string | null>(null)
  const [dragOver, setDragOver]             = useState<string | null>(null)
  const containerRef                         = useRef<HTMLDivElement>(null)

  // ── Détection mobile ───────────────────────────────────────────────────────
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // ── État mobile ────────────────────────────────────────────────────────────
  const [mobileOrder, setMobileOrder]             = useState<string[]>([])
  const [mobileCellHeights, setMobileCellHeights] = useState<Record<string, number>>({})

  // ── Store visibilité ───────────────────────────────────────────────────────
  const configs = useModuleSectionsStore(state => state.configs)
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => { setHydrated(true) }, [])

  // ── Rows enrichis avec les duplicats ──────────────────────────────────────
  const allRows: PanelRow[] = rows.map(row => {
    const cells = [...row.cells]
    for (const dup of duplicates.filter(d => d.rowId === row.id)) {
      const idx = cells.findIndex(c => c.id === dup.afterId)
      if (idx !== -1) cells.splice(idx + 1, 0, dup.cell)
      else cells.push(dup.cell)
    }
    return { ...row, cells }
  })

  // Dictionnaire plat de toutes les cellules disponibles (allRows + duplicats)
  const allCellsById = Object.fromEntries(allRows.flatMap(r => r.cells).map(c => [c.id, c]))

  const isVisible = (cellId: string) => {
    if (duplicates.some(d => d.cell.id === cellId)) return true
    if (!pageKey || !hydrated) return true
    const cfg = configs[pageKey]?.[cellId]
    return cfg === undefined ? true : cfg.visible
  }

  const visibleRows = allRows.map(row => {
    // Si rowContents est initialisé pour cette ligne, utilise-le (cross-row support)
    const contents = rowContents[row.id]
    const sourceCells = contents
      ? contents.map(id => allCellsById[id]).filter(Boolean) as PanelCell[]
      : row.cells
    const visibleCells = sourceCells.filter(c => isVisible(c.id))
    return { ...row, visibleCells }
  }).filter(r => r.visibleCells.length > 0)

  const flatCells   = visibleRows.flatMap(r => r.visibleCells)
  const flatCellIds = flatCells.map(c => c.id).join(',')

  // Synchronise l'ordre mobile
  useEffect(() => {
    setMobileOrder(prev => {
      const ids = flatCells.map(c => c.id)
      const kept  = prev.filter(id => ids.includes(id))
      const added = ids.filter(id => !kept.includes(id))
      return [...kept, ...added]
    })
  }, [flatCellIds]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Desktop: hauteurs de lignes (pixels fixes) ────────────────────────────
  useEffect(() => {
    setRowHeights(prev =>
      prev.length === visibleRows.length
        ? prev
        : Array.from({ length: visibleRows.length }, (_, i) => prev[i] ?? DEFAULT_ROW_HEIGHT),
    )
  }, [visibleRows.length]) // eslint-disable-line react-hooks/exhaustive-deps

  const rowKey = (row: typeof visibleRows[0]) =>
    `${row.id}:${row.visibleCells.map(c => c.id).join(',')}`

  const getColWidths = (row: typeof visibleRows[0]) =>
    colWidthsMap[rowKey(row)] ?? initialColWidths(row.visibleCells)

  const setColWidths = useCallback((row: typeof visibleRows[0], w: number[]) => {
    setColWidthsMap(prev => ({ ...prev, [rowKey(row)]: w }))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Drag-and-drop desktop (interne, cross-row) ────────────────────────────
  const handleDragStart = useCallback((cellId: string) => {
    setDragging(cellId)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent, cellId: string) => {
    e.preventDefault()
    setDragOver(cellId)
  }, [])

  const handleDrop = useCallback((cellId: string) => {
    const from = dragging
    setDragging(null)
    setDragOver(null)
    if (!from || from === cellId) return

    setRowContents(prev => {
      // Initialise rowContents depuis l'état visible courant si pas encore fait
      const current: Record<string, string[]> = {}
      for (const row of visibleRows) {
        current[row.id] = prev[row.id] ?? row.visibleCells.map(c => c.id)
      }
      // Inclut aussi les lignes dont rowContents est déjà défini mais filtrées (cellules masquées)
      for (const [rowId, ids] of Object.entries(prev)) {
        if (!current[rowId]) current[rowId] = ids
      }

      // Trouve la ligne source (contient `from`) et cible (contient `cellId`)
      let sourceRowId: string | null = null
      let targetRowId: string | null = null
      let targetIdx = -1

      for (const [rowId, ids] of Object.entries(current)) {
        if (ids.includes(from) && !sourceRowId) sourceRowId = rowId
        const idx = ids.indexOf(cellId)
        if (idx !== -1 && !targetRowId) { targetRowId = rowId; targetIdx = idx }
      }

      if (!sourceRowId || !targetRowId) return prev

      // Retire `from` de sa ligne source
      current[sourceRowId] = current[sourceRowId].filter(id => id !== from)

      // Insère `from` devant `cellId` dans la ligne cible
      const targetCells = [...current[targetRowId]]
      // Recalcule targetIdx dans la liste après suppression éventuelle
      const newTargetIdx = targetCells.indexOf(cellId)
      targetCells.splice(newTargetIdx === -1 ? targetCells.length : newTargetIdx, 0, from)
      current[targetRowId] = targetCells

      return { ...prev, ...current }
    })
  }, [dragging, visibleRows])

  const handleDragEnd = useCallback(() => {
    setDragging(null)
    setDragOver(null)
  }, [])

  // ── Duplication ────────────────────────────────────────────────────────────
  const handleDuplicate = useCallback((cellId: string) => {
    // Cherche dans les rows originales et dans les duplicats
    let sourceCell: PanelCell | undefined
    let rowId: string | undefined

    for (const row of allRows) {
      const found = row.cells.find(c => c.id === cellId)
      if (found) { sourceCell = found; rowId = row.id; break }
    }
    if (!sourceCell || !rowId) return

    const newId = `${cellId.replace(/-dup-\d+$/, '')}-dup-${Date.now()}`
    const newCell: PanelCell = {
      ...sourceCell,
      id: newId,
      title: `${sourceCell.title.replace(/ \(copie\)$/, '')} (copie)`,
      content: React.isValidElement(sourceCell.content)
        ? React.cloneElement(sourceCell.content as React.ReactElement)
        : sourceCell.content,
    }
    setDuplicates(prev => [...prev, { rowId: rowId!, afterId: cellId, cell: newCell }])
    // Met à jour rowContents si déjà initialisé pour cette ligne
    setRowContents(prev => {
      if (!prev[rowId!]) return prev
      const ids = [...prev[rowId!]]
      const afterIdx = ids.indexOf(cellId)
      ids.splice(afterIdx === -1 ? ids.length : afterIdx + 1, 0, newId)
      return { ...prev, [rowId!]: ids }
    })
  }, [allRows]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Masquage (original via store, duplicat via state local) ───────────────
  const handleHide = useCallback((cellId: string) => {
    if (duplicates.some(d => d.cell.id === cellId)) {
      setDuplicates(prev => prev.filter(d => d.cell.id !== cellId))
      setRowContents(prev => {
        const next = { ...prev }
        for (const rowId of Object.keys(next)) {
          next[rowId] = next[rowId].filter(id => id !== cellId)
        }
        return next
      })
    } else {
      onHide?.(cellId)
    }
    if (maximized === cellId) setMaximized(null)
  }, [duplicates, onHide, maximized])

  const maximizedCell = maximized
    ? allRows.flatMap(r => r.cells).find(c => c.id === maximized) ?? null
    : null

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div ref={containerRef} className="flex-1 min-h-0 flex flex-col overflow-auto">

      {maximizedCell ? (
        <div className="flex-1 min-h-0">
          <PanelCard
            cell={maximizedCell}
            isMaximized
            onMaximize={() => setMaximized(null)}
            onHide={() => handleHide(maximizedCell.id)}
            onDuplicate={() => handleDuplicate(maximizedCell.id)}
          />
        </div>

      ) : isMobile ? (
        <div className="flex-1 min-h-0 overflow-y-auto px-1 py-1">
          <MobilePanelList
            cells={flatCells}
            order={mobileOrder}
            onOrderChange={setMobileOrder}
            heights={mobileCellHeights}
            onHeightChange={(id, h) => setMobileCellHeights(prev => ({ ...prev, [id]: h }))}
            onMaximize={setMaximized}
            onHide={handleHide}
            onDuplicate={handleDuplicate}
          />
        </div>

      ) : (
        visibleRows.map((row, i) => (
          <React.Fragment key={row.id}>
            <div style={{ height: rowHeights[i] ?? DEFAULT_ROW_HEIGHT, flexShrink: 0 }}>
              <PanelRowInner
                cells={row.visibleCells}
                widths={getColWidths(row)}
                onWidthsChange={w => setColWidths(row, w)}
                onMaximize={setMaximized}
                onHide={handleHide}
                onDuplicate={handleDuplicate}
                dragging={dragging}
                dragOver={dragOver}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onDragEnd={handleDragEnd}
              />
            </div>

            {i < visibleRows.length - 1 && (
              <div
                onMouseDown={e => {
                  e.preventDefault()
                  const startY = e.clientY
                  const startH = rowHeights[i] ?? DEFAULT_ROW_HEIGHT
                  const onMove = (me: MouseEvent) => {
                    setRowHeights(prev => {
                      const next = [...prev]
                      next[i] = Math.max(120, startH + (me.clientY - startY))
                      return next
                    })
                  }
                  const onUp = () => {
                    document.removeEventListener('mousemove', onMove)
                    document.removeEventListener('mouseup', onUp)
                    document.body.style.cursor = ''
                    document.body.style.userSelect = ''
                  }
                  document.body.style.cursor = 'row-resize'
                  document.body.style.userSelect = 'none'
                  document.addEventListener('mousemove', onMove)
                  document.addEventListener('mouseup', onUp)
                }}
                onDoubleClick={() => setRowHeights(prev => prev.map(() => DEFAULT_ROW_HEIGHT))}
                draggable={false}
                title="Glisser pour redimensionner · Double-clic pour réinitialiser"
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
