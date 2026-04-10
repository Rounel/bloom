'use client'

import { useState, useRef, useCallback, type ReactNode } from 'react'
import { X, Minus, Maximize2, GripVertical, Download } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDashboardStore, type Panel } from '@/lib/dashboard-store'

interface DraggablePanelProps {
  panel: Panel
  children: ReactNode
}

export function DraggablePanel({ panel, children }: DraggablePanelProps) {
  const { updatePanel, removePanel, bringToFront, minimizePanel, maximizePanel, unmaximizePanel } = useDashboardStore()

  const handleExport = useCallback(() => {
    // Collect text content of panel and trigger CSV-like download
    const panelEl = panelRef.current
    if (!panelEl) return
    const rows: string[] = []
    panelEl.querySelectorAll('table tr').forEach(tr => {
      const cells = Array.from(tr.querySelectorAll('th, td')).map(td => `"${td.textContent?.replace(/"/g, '""') ?? ''}"`)
      if (cells.length) rows.push(cells.join(','))
    })
    const csv = rows.length
      ? rows.join('\n')
      : `"${panel.title}"\n"Données exportées le ${new Date().toLocaleDateString('fr-FR')}"`
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `${panel.title.toLowerCase().replace(/\s+/g, '-')}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }, [panel.title])
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const dragOffset = useRef({ x: 0, y: 0 })
  const resizeStart = useRef({ width: 0, height: 0, x: 0, y: 0 })

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.panel-controls')) return
    if (panel.isMaximized) return // Don't allow drag when maximized
    
    bringToFront(panel.id)
    setIsDragging(true)
    dragOffset.current = {
      x: e.clientX - panel.x,
      y: e.clientY - panel.y,
    }

    const handleMouseMove = (e: MouseEvent) => {
      const newX = Math.max(0, e.clientX - dragOffset.current.x)
      const newY = Math.max(0, e.clientY - dragOffset.current.y)
      updatePanel(panel.id, { x: newX, y: newY })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [panel.id, panel.x, panel.y, bringToFront, updatePanel])

  const handleResizeMouseDown = useCallback((e: React.MouseEvent) => {
    if (panel.isMaximized) return // Don't allow resize when maximized
    e.stopPropagation()
    bringToFront(panel.id)
    setIsResizing(true)
    resizeStart.current = {
      width: panel.width,
      height: panel.height,
      x: e.clientX,
      y: e.clientY,
    }

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - resizeStart.current.x
      const deltaY = e.clientY - resizeStart.current.y
      const newWidth = Math.max(300, resizeStart.current.width + deltaX)
      const newHeight = Math.max(200, resizeStart.current.height + deltaY)
      updatePanel(panel.id, { width: newWidth, height: newHeight })
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [panel.id, panel.width, panel.height, panel.isMaximized, bringToFront, updatePanel])

  const handleMaximizeToggle = useCallback(() => {
    if (panel.isMaximized) {
      unmaximizePanel(panel.id)
    } else {
      maximizePanel(panel.id)
    }
  }, [panel.id, panel.isMaximized, maximizePanel, unmaximizePanel])

  if (panel.isMinimized) return null

  return (
    <div
      ref={panelRef}
      className={cn(
        "absolute bg-card border border-border overflow-hidden shadow-xl",
        "flex flex-col transition-all duration-200",
        panel.isMaximized ? "rounded-none" : "rounded-lg",
        isDragging && "cursor-grabbing opacity-90",
        isResizing && "select-none"
      )}
      style={{
        left: panel.isMaximized ? 0 : panel.x,
        top: panel.isMaximized ? 0 : panel.y,
        width: panel.isMaximized ? '100vw' : panel.width,
        height: panel.isMaximized ? '100vh' : panel.height,
        zIndex: panel.zIndex,
      }}
      onClick={() => bringToFront(panel.id)}
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-center justify-between px-3 py-2 bg-secondary/50 border-b border-border select-none",
          panel.isMaximized ? "cursor-default" : "cursor-grab"
        )}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleMaximizeToggle}
      >
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground truncate">
            {panel.title}
          </span>
        </div>
        <div className="flex items-center gap-1 panel-controls">
          <button
            onClick={handleExport}
            className="p-1 rounded hover:bg-secondary transition-colors"
            title="Exporter CSV"
          >
            <Download className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
          <button
            onClick={() => minimizePanel(panel.id)}
            className="p-1 rounded hover:bg-secondary transition-colors"
          >
            <Minus className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
          <button
            onClick={handleMaximizeToggle}
            className="p-1 rounded hover:bg-secondary transition-colors"
            title={panel.isMaximized ? 'Restaurer' : 'Maximiser'}
          >
            <Maximize2 className={cn(
              "w-3.5 h-3.5 text-muted-foreground transition-transform",
              panel.isMaximized && "rotate-180"
            )} />
          </button>
          <button
            onClick={() => removePanel(panel.id)}
            className="p-1 rounded hover:bg-destructive/20 transition-colors"
          >
            <X className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-3">
        {children}
      </div>

      {/* Resize Handle */}
      {!panel.isMaximized && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
          onMouseDown={handleResizeMouseDown}
        >
          <svg
            className="w-4 h-4 text-muted-foreground/50"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M22 22H20V20H22V22ZM22 18H20V16H22V18ZM18 22H16V20H18V22ZM22 14H20V12H22V14ZM18 18H16V16H18V18ZM14 22H12V20H14V22Z" />
          </svg>
        </div>
      )}
    </div>
  )
}
