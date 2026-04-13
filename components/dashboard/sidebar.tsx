'use client'

import { useState, useEffect } from 'react'
import {
  LayoutDashboard, LineChart, BarChart3, Globe, Newspaper, Radio,
  Wallet, Calendar, DollarSign, PieChart, Plus, ChevronLeft,
  ChevronRight, X, TrendingUp, Flame, Activity, Package,
  Landmark, ShoppingCart, Map, ChevronDown,
  BookOpen, Building2, Percent, ShieldAlert, Bell,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDashboardStore, type PanelType } from '@/lib/dashboard-store'

interface NavItem {
  icon: React.ElementType
  label: string
  panelType: PanelType
  description: string
}

interface NavModule {
  id: string
  label: string
  items: NavItem[]
}

const modules: NavModule[] = [
  {
    id: 'operations',
    label: 'Opérations Boursières',
    items: [
      { icon: LayoutDashboard, label: 'Vue Marché',        panelType: 'market-overview',  description: 'Indices et aperçu global' },
      { icon: LineChart,       label: 'BRVM Actions',      panelType: 'brvm-stocks',       description: 'Cotations temps réel' },
      { icon: BarChart3,       label: 'Graphiques',        panelType: 'stock-chart',       description: 'Analyse technique' },
      { icon: TrendingUp,      label: 'Top Movers',        panelType: 'top-movers',        description: 'Hausses, baisses, volumes' },
      { icon: Flame,           label: 'Heatmap Secteurs',  panelType: 'sector-heatmap',    description: 'Carte de chaleur intraday' },
      { icon: Activity,        label: 'Taux Souverains',   panelType: 'yield-curves',      description: 'Courbes UEMOA multi-pays' },
      { icon: DollarSign,      label: 'Devises',           panelType: 'currency-rates',    description: 'Paires FCFA / USD / EUR' },
      { icon: Package,         label: 'Matières Premières',panelType: 'commodities',       description: 'Cacao, pétrole, or…' },
      { icon: Newspaper,       label: 'Flash Info',        panelType: 'news-feed',         description: 'Actualités en temps réel' },
      { icon: Radio,           label: 'Web TV',            panelType: 'web-tv',            description: 'Décryptages vidéo' },
    ],
  },
  {
    id: 'macro',
    label: 'Données Macroéconomiques',
    items: [
      { icon: Globe,      label: 'Indicateurs Macro',  panelType: 'macro-indicators',  description: 'PIB, inflation, chômage' },
      { icon: Landmark,   label: 'Finances Publiques', panelType: 'public-finances',   description: 'Dette, déficit, émissions' },
      { icon: ShoppingCart,label: 'Commerce Extérieur',panelType: 'trade-balance',     description: 'Import / export par produit' },
      { icon: PieChart,   label: 'Secteurs',           panelType: 'sector-analysis',   description: 'Performance sectorielle' },
      { icon: Map,        label: 'Analyse Régionale',  panelType: 'regional-analysis', description: 'Classement & stabilité pays' },
      { icon: Calendar,   label: 'Calendrier Éco.',    panelType: 'economic-calendar', description: 'Événements économiques' },
    ],
  },
  {
    id: 'analyse',
    label: 'Analyse Financière & Risque',
    items: [
      { icon: BookOpen,    label: 'Carnet d\'ordres',   panelType: 'order-book',       description: 'Bid/Ask temps réel' },
      { icon: Building2,   label: 'Fiche Société',      panelType: 'company-profile',  description: 'Fondamentaux & historique' },
      { icon: Percent,     label: 'Ratios Financiers',  panelType: 'financial-ratios', description: 'P/E, PBR, ROE, Yield…' },
      { icon: ShieldAlert, label: 'Scorecard Risques',  panelType: 'risk-scorecard',   description: 'Notation souveraine pays' },
    ],
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    items: [
      { icon: Wallet, label: 'Portefeuille', panelType: 'portfolio', description: 'Suivi investissements' },
      { icon: Bell,   label: 'Alertes',      panelType: 'alerts-panel', description: 'Alertes prix & marché' },
    ],
  },
]

export function DashboardSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(['operations', 'macro', 'analyse', 'dashboard']))
  const { addPanel, panels, restorePanel, sidebarOpen, setSidebarOpen } = useDashboardStore()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  function handleAddPanel(item: NavItem) {
    const existingMinimized = panels.find(p => p.type === item.panelType && p.isMinimized)
    if (existingMinimized) {
      restorePanel(existingMinimized.id)
    } else {
      addPanel(item.panelType, item.label)
    }
    if (isMobile) setSidebarOpen(false)
  }

  function toggleModule(id: string) {
    setExpandedModules(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <>
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          'h-full bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300',
          'lg:relative lg:translate-x-0',
          isMobile && 'fixed top-0 left-0 z-50 w-64',
          isMobile && !sidebarOpen && '-translate-x-full',
          !isMobile && (isCollapsed ? 'w-16' : 'w-60')
        )}
      >
        {/* Mobile close */}
        {isMobile && (
          <div className="flex items-center justify-between px-4 py-3 border-b border-sidebar-border lg:hidden">
            <span className="text-sm font-semibold text-sidebar-foreground">Modules</span>
            <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded hover:bg-sidebar-accent transition-colors">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto py-2">
          {modules.map(mod => {
            const isExpanded = expandedModules.has(mod.id)
            const activeInModule = panels.filter(p =>
              mod.items.some(i => i.panelType === p.type) && !p.isMinimized
            ).length

            return (
              <div key={mod.id} className="mb-1">
                {/* Module header */}
                <button
                  onClick={() => !isCollapsed && toggleModule(mod.id)}
                  className={cn(
                    'w-full flex items-center gap-2 px-3 py-2 text-left transition-colors',
                    'hover:bg-sidebar-accent/50',
                    isCollapsed && 'justify-center'
                  )}
                  title={isCollapsed ? mod.label : undefined}
                >
                  {isCollapsed ? (
                    <span className="text-[10px] font-black text-muted-foreground/60">
                      {activeInModule > 0 ? (
                        <span className="w-4 h-4 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-[9px]">
                          {activeInModule}
                        </span>
                      ) : '◆'}
                    </span>
                  ) : (
                    <>
                      <span className="flex-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider truncate">
                        {mod.label}
                      </span>
                      {activeInModule > 0 && (
                        <span className="w-4 h-4 bg-primary text-primary-foreground text-[9px] font-bold rounded-full flex items-center justify-center shrink-0">
                          {activeInModule}
                        </span>
                      )}
                      <ChevronDown className={cn(
                        'w-3.5 h-3.5 text-muted-foreground shrink-0 transition-transform',
                        !isExpanded && '-rotate-90'
                      )} />
                    </>
                  )}
                </button>

                {/* Items */}
                {(isExpanded || isCollapsed) && (
                  <div className={cn('space-y-0.5 px-1.5', isCollapsed && 'px-1')}>
                    {mod.items.map(item => {
                      const Icon = item.icon
                      const activeCount  = panels.filter(p => p.type === item.panelType && !p.isMinimized).length
                      const minimizedCount = panels.filter(p => p.type === item.panelType && p.isMinimized).length

                      return (
                        <button
                          key={item.panelType}
                          onClick={() => handleAddPanel(item)}
                          className={cn(
                            'w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left transition-colors group',
                            'hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground',
                            activeCount > 0 && 'bg-sidebar-accent/50',
                            isCollapsed && 'justify-center px-2'
                          )}
                          title={isCollapsed ? item.label : undefined}
                        >
                          <div className="relative shrink-0">
                            <Icon className="w-4 h-4" />
                            {activeCount > 0 && (
                              <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary text-primary-foreground text-[8px] font-bold rounded-full flex items-center justify-center">
                                {activeCount}
                              </span>
                            )}
                          </div>
                          {!isCollapsed && (
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-medium truncate">{item.label}</div>
                              <div className="text-[10px] text-muted-foreground truncate">{item.description}</div>
                            </div>
                          )}
                          {!isCollapsed && (
                            <Plus className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                          )}
                          {!isCollapsed && minimizedCount > 0 && (
                            <span className="text-[10px] text-muted-foreground shrink-0">({minimizedCount})</span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* Collapse toggle – desktop only */}
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
                  <span className="text-xs">Réduire</span>
                </>
              )}
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
