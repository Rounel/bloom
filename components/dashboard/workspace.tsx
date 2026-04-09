'use client'

import { useState, useEffect } from 'react'
import { useDashboardStore } from '@/lib/dashboard-store'
import { DraggablePanel } from './draggable-panel'
import { MobilePanelList } from './mobile-panel-list'
import { getPanelContent } from './panel-registry'
import { cn } from '@/lib/utils'
import { Maximize2 } from 'lucide-react'

export function DashboardWorkspace() {
  const { panels, restorePanel } = useDashboardStore()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const visiblePanels = panels.filter(p => !p.isMinimized)
  const minimizedPanels = panels.filter(p => p.isMinimized)

  if (isMobile) {
    return <MobilePanelList visiblePanels={visiblePanels} minimizedPanels={minimizedPanels} />
  }

  return (
    <div className="flex-1 relative overflow-hidden bg-background">
      {/* Grid Background */}
      <div 
        className="absolute inset-0 opacity-5 hidden lg:block"
        style={{
          backgroundImage: `
            linear-gradient(var(--border) 1px, transparent 1px),
            linear-gradient(90deg, var(--border) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Panels - Desktop */}
      <div className="relative w-full h-full hidden lg:block">
        {visiblePanels.map((panel) => (
          <DraggablePanel key={panel.id} panel={panel}>
            {getPanelContent(panel)}
          </DraggablePanel>
        ))}
      </div>

      {/* Minimized Panels Bar */}
      {minimizedPanels.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-card/80 backdrop-blur-sm border-t border-border">
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-xs text-muted-foreground shrink-0">Réduits:</span>
            {minimizedPanels.map((panel) => (
              <button
                key={panel.id}
                onClick={() => restorePanel(panel.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 bg-secondary/50 rounded-md",
                  "hover:bg-secondary transition-colors text-sm text-foreground",
                  "border border-border/50 hover:border-primary/30"
                )}
              >
                <span className="truncate max-w-[150px]">{panel.title}</span>
                <Maximize2 className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {visiblePanels.length === 0 && minimizedPanels.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Aucun module ouvert
            </h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Utilisez le menu latéral pour ajouter des modules d&apos;analyse à votre espace de travail.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
