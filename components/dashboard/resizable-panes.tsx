'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import React from 'react'
import { cn } from '@/lib/utils'
import { useModuleSectionsStore } from '@/lib/module-sections-store'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PaneCell {
  /** Must match the section id used in useModuleSectionsStore */
  id: string
  content: React.ReactNode
  /** Relative initial width (default 1 = equal share) */
  initialFlex?: number
}

export interface PaneRow {
  id: string
  cells: PaneCell[]
}

// ─── Shared resize helper ─────────────────────────────────────────────────────

function startAxisResize(opts: {
  startPx: number
  startValues: number[]
  idx: number
  containerSizePx: () => number
  min: number
  cursor: string
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

function equalArr(n: number) {
  return Array.from({ length: n }, () => 100 / n)
}

function initialColWidths(cells: PaneCell[]) {
  const total = cells.reduce((s, c) => s + (c.initialFlex ?? 1), 0)
  return cells.map(c => ((c.initialFlex ?? 1) / total) * 100)
}

// ─── Row (internal) ───────────────────────────────────────────────────────────

function PanesRow({
  cells,
  widths,
  onWidthsChange,
}: {
  cells: PaneCell[]
  widths: number[]
  onWidthsChange: (w: number[]) => void
}) {
  const ref = useRef<HTMLDivElement>(null)

  if (cells.length === 0) return null

  return (
    <div ref={ref} className="flex items-stretch h-full min-h-0">
      {cells.map((cell, i) => (
        <React.Fragment key={cell.id}>
          {/* Cell */}
          <div
            style={{ flex: `${widths[i] ?? (100 / cells.length)} 1 0%`, minWidth: 0, minHeight: 0 }}
            className="overflow-auto"
          >
            {cell.content}
          </div>

          {/* Vertical column handle */}
          {i < cells.length - 1 && (
            <div
              onMouseDown={e => {
                e.preventDefault()
                e.stopPropagation()
                startAxisResize({
                  startPx: e.clientX,
                  startValues: widths,
                  idx: i,
                  containerSizePx: () => ref.current?.getBoundingClientRect().width ?? 0,
                  min: 12,
                  cursor: 'col-resize',
                  onUpdate: onWidthsChange,
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

// ─── ResizablePanesGrid (public) ──────────────────────────────────────────────

/**
 * Drop-in replacement for CSS grid in module pages.
 *
 * - Reads visibility from useModuleSectionsStore to filter hidden cells/rows.
 * - Manages column widths per row and row heights internally.
 * - Horizontal handles between columns, horizontal handles between rows.
 * - Double-click any handle to reset to equal distribution.
 *
 * Usage:
 *   <ResizablePanesGrid
 *     pageKey="macro"
 *     rows={[
 *       { id: 'row-1', cells: [
 *         { id: 'indicators', initialFlex: 2, content: <...> },
 *         { id: 'rankings',   initialFlex: 1, content: <...> },
 *       ]},
 *     ]}
 *   />
 */
export function ResizablePanesGrid({
  pageKey,
  rows,
  className,
}: {
  pageKey: string
  rows: PaneRow[]
  className?: string
}) {
  const configs  = useModuleSectionsStore(state => state.configs)
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => { setHydrated(true) }, [])

  // Filter visible cells per row, then filter out empty rows
  const visibleRows = rows.map(row => ({
    ...row,
    visibleCells: row.cells.filter(c => {
      if (!hydrated) return true
      const cfg = configs[pageKey]?.[c.id]
      return cfg === undefined ? true : cfg.visible
    }),
  })).filter(row => row.visibleCells.length > 0)

  // Row heights state — reset when visible row count changes
  const [rowHeights, setRowHeights] = useState<number[]>(() => equalArr(rows.length))
  useEffect(() => {
    setRowHeights(prev =>
      prev.length === visibleRows.length ? prev : equalArr(visibleRows.length),
    )
  }, [visibleRows.length]) // eslint-disable-line react-hooks/exhaustive-deps

  // Per-row column widths keyed by "rowId:visibleCellIds"
  const [colWidthsMap, setColWidthsMap] = useState<Record<string, number[]>>({})

  const rowKey = (row: typeof visibleRows[0]) =>
    `${row.id}:${row.visibleCells.map(c => c.id).join(',')}`

  const getColWidths = (row: typeof visibleRows[0]) =>
    colWidthsMap[rowKey(row)] ?? initialColWidths(row.visibleCells)

  const setColWidths = useCallback((row: typeof visibleRows[0], w: number[]) => {
    setColWidthsMap(prev => ({ ...prev, [rowKey(row)]: w }))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={containerRef} className={cn('flex-1 min-h-0 flex flex-col', className)}>
      {visibleRows.map((row, i) => (
        <React.Fragment key={row.id}>
          {/* Row */}
          <div style={{ flex: `${rowHeights[i] ?? (100 / visibleRows.length)} 1 0%`, minHeight: 0 }}>
            <PanesRow
              cells={row.visibleCells}
              widths={getColWidths(row)}
              onWidthsChange={w => setColWidths(row, w)}
            />
          </div>

          {/* Horizontal row handle */}
          {i < visibleRows.length - 1 && (
            <div
              onMouseDown={e => {
                e.preventDefault()
                startAxisResize({
                  startPx: e.clientY,
                  startValues: rowHeights,
                  idx: i,
                  containerSizePx: () => containerRef.current?.getBoundingClientRect().height ?? 0,
                  min: 8,
                  cursor: 'row-resize',
                  onUpdate: setRowHeights,
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
      ))}
    </div>
  )
}
