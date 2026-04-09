'use client'

import { useState, useEffect } from 'react'
import {
  LayoutDashboard,
  LineChart,
  BarChart3,
  Globe,
  Newspaper,
  Radio,
  Wallet,
  Calendar,
  DollarSign,
  PieChart,
  Plus,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDashboardStore, type PanelType } from '@/lib/dashboard-store'

interface NavItem {
  icon: React.ElementType
  label: string
  panelType: PanelType
  description: string
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Vue Marché', panelType: 'market-overview', description: 'Indices et aperçu' },
  { icon: LineChart, label: 'BRVM Actions', panelType: 'brvm-stocks', description: 'Cotations temps réel' },
  { icon: BarChart3, label: 'Graphiques', panelType: 'stock-chart', description: 'Analyse technique' },
  { icon: Globe, label: 'Macro UEMOA', panelType: 'macro-indicators', description: 'Indicateurs économiques' },
  { icon: PieChart, label: 'Secteurs', panelType: 'sector-analysis', description: 'Performance sectorielle' },
  { icon: Newspaper, label: 'Actualités', panelType: 'news-feed', description: 'Fil d\'info en direct' },
  { icon: Radio, label: 'Web TV', panelType: 'web-tv', description: 'Émissions finance' },
  { icon: Wallet, label: 'Portefeuille', panelType: 'portfolio', description: 'Suivi investissements' },
  { icon: Calendar, label: 'Calendrier', panelType: 'economic-calendar', description: 'Événements économiques' },
  { icon: DollarSign, label: 'Devises', panelType: 'currency-rates', description: 'Taux de change' },
]

export function DashboardSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { addPanel, panels, restorePanel, sidebarOpen, setSidebarOpen } = useDashboardStore()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleAddPanel = (item: NavItem) => {
    // Check if panel type already exists and is minimized
    const existingMinimized = panels.find(p => p.type === item.panelType && p.isMinimized)
    if (existingMinimized) {
      restorePanel(existingMinimized.id)
    } else {
      addPanel(item.panelType, item.label)
    }
    
    // Close sidebar on mobile after adding panel
    if (isMobile) {
      setSidebarOpen(false)
    }
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={cn(
          "h-full bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300",
          "lg:relative lg:translate-x-0",
          // Mobile styles
          isMobile && "fixed top-0 left-0 z-50 w-64",
          isMobile && !sidebarOpen && "-translate-x-full",
          // Desktop styles
          !isMobile && (isCollapsed ? "w-16" : "w-56")
        )}
      >
        {/* Mobile Close Button */}
        {isMobile && (
          <div className="flex items-center justify-between px-4 py-3 border-b border-sidebar-border lg:hidden">
            <span className="text-sm font-semibold text-sidebar-foreground">Menu</span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 rounded hover:bg-sidebar-accent transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        )}
      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        <div className={cn(
          "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2",
          isCollapsed && "text-center px-0"
        )}>
          {isCollapsed ? '◆' : 'Modules'}
        </div>
        
        {navItems.map((item) => {
          const Icon = item.icon
          const activeCount = panels.filter(p => p.type === item.panelType && !p.isMinimized).length
          const minimizedCount = panels.filter(p => p.type === item.panelType && p.isMinimized).length

          return (
            <button
              key={item.panelType}
              onClick={() => handleAddPanel(item)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors group",
                "hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground",
                activeCount > 0 && "bg-sidebar-accent/50"
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <div className="relative">
                <Icon className="w-5 h-5 shrink-0" />
                {activeCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-primary text-primary-foreground text-[9px] font-bold rounded-full flex items-center justify-center">
                    {activeCount}
                  </span>
                )}
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{item.label}</div>
                  <div className="text-[10px] text-muted-foreground truncate">{item.description}</div>
                </div>
              )}
              {!isCollapsed && (
                <Plus className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
              {!isCollapsed && minimizedCount > 0 && (
                <span className="text-[10px] text-muted-foreground">({minimizedCount})</span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Collapse Toggle - Desktop Only */}
      {!isMobile && (
        <div className="p-2 border-t border-sidebar-border">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span>Réduire</span>
              </>
            )}
          </button>
        </div>
      )}
      </aside>
    </>
  )
}
