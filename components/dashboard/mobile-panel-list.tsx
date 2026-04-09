'use client'

import { useState, useRef } from 'react'
import { X, Minus, Maximize2, GripVertical, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDashboardStore, type Panel } from '@/lib/dashboard-store'
import { getPanelContent } from './panel-registry'

interface MobilePanelListProps {
  visiblePanels: Panel[]
  minimizedPanels: Panel[]
}

export function MobilePanelList({ visiblePanels, minimizedPanels }: MobilePanelListProps) {
  const { removePanel, minimizePanel, restorePanel, reorderPanels } = useDashboardStore()
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const dragStartY = useRef(0)
  const dragCurrentY = useRef(0)

  const sortedPanels = [...visiblePanels].sort((a, b) => a.order - b.order)

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    dragStartY.current = e.clientY
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return
    
    dragCurrentY.current = e.clientY
    setDragOverIndex(index)
  }

  const handleDragEnd = () => {
    if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      reorderPanels(draggedIndex, dragOverIndex)
    }
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    handleDragEnd()
  }

  return (
    <div className="flex-1 overflow-y-auto bg-background p-3 space-y-3">
      {/* Visible Panels */}
      {sortedPanels.map((panel, index) => (
        <div
          key={panel.id}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragEnd={handleDragEnd}
          onDrop={handleDrop}
          className={cn(
            "bg-card border border-border rounded-lg overflow-hidden transition-all",
            draggedIndex === index && "opacity-50 scale-95",
            dragOverIndex === index && draggedIndex !== null && draggedIndex < index && "border-t-4 border-t-primary",
            dragOverIndex === index && draggedIndex !== null && draggedIndex > index && "border-b-4 border-b-primary"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2 bg-secondary/50 border-b border-border">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab active:cursor-grabbing shrink-0" />
              <span className="text-sm font-medium text-foreground truncate">
                {panel.title}
              </span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => minimizePanel(panel.id)}
                className="p-1.5 rounded hover:bg-secondary transition-colors"
              >
                <Minus className="w-4 h-4 text-muted-foreground" />
              </button>
              <button
                onClick={() => removePanel(panel.id)}
                className="p-1.5 rounded hover:bg-destructive/20 transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-3 max-h-[400px] overflow-auto">
            {getPanelContent(panel)}
          </div>
        </div>
      ))}

      {/* Minimized Panels */}
      {minimizedPanels.length > 0 && (
        <div className="pt-3 border-t border-border">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
            Réduits
          </div>
          <div className="space-y-2">
            {minimizedPanels.map((panel) => (
              <button
                key={panel.id}
                onClick={() => restorePanel(panel.id)}
                className={cn(
                  "w-full flex items-center justify-between gap-2 px-3 py-2.5 bg-secondary/50 rounded-md",
                  "hover:bg-secondary transition-colors text-sm text-foreground",
                  "border border-border/50 hover:border-primary/30"
                )}
              >
                <span className="truncate">{panel.title}</span>
                <Maximize2 className="w-4 h-4 text-muted-foreground shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {visiblePanels.length === 0 && minimizedPanels.length === 0 && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Menu className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Aucun module ouvert
            </h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Ouvrez le menu pour ajouter des modules à votre espace de travail.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
