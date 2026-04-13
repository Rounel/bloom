import { create } from 'zustand'

export type PanelType =
  // Module 1 – Opérations Boursières
  | 'market-overview'
  | 'brvm-stocks'
  | 'stock-chart'
  | 'top-movers'
  | 'sector-heatmap'
  | 'yield-curves'
  | 'currency-rates'
  | 'commodities'
  | 'news-feed'
  | 'web-tv'
  // Module 2 – Données Macroéconomiques
  | 'macro-indicators'
  | 'public-finances'
  | 'trade-balance'
  | 'sector-analysis'
  | 'regional-analysis'
  | 'economic-calendar'
  // Module 5 – Dashboard
  | 'portfolio'
  // Panels CDC
  | 'order-book'
  | 'company-profile'
  | 'financial-ratios'
  | 'risk-scorecard'
  | 'alerts-panel'

export interface Panel {
  id: string
  type: PanelType
  title: string
  x: number
  y: number
  width: number
  height: number
  isMinimized: boolean
  isMaximized: boolean
  zIndex: number
  order: number // For mobile vertical ordering
  data?: Record<string, unknown>
  // Store previous dimensions for restore
  previousDimensions?: {
    x: number
    y: number
    width: number
    height: number
  }
}

interface DashboardStore {
  panels: Panel[]
  activePanel: string | null
  maxZIndex: number
  sidebarOpen: boolean
  addPanel: (type: PanelType, title: string) => void
  removePanel: (id: string) => void
  updatePanel: (id: string, updates: Partial<Panel>) => void
  bringToFront: (id: string) => void
  minimizePanel: (id: string) => void
  restorePanel: (id: string) => void
  maximizePanel: (id: string) => void
  unmaximizePanel: (id: string) => void
  setActivePanel: (id: string | null) => void
  reorderPanels: (startIndex: number, endIndex: number) => void
  setSidebarOpen: (open: boolean) => void
}

// Auto-layout algorithm to find optimal position for new panel
function findOptimalPosition(
  existingPanels: Panel[],
  newWidth: number,
  newHeight: number,
  viewportWidth = 1920,
  viewportHeight = 1080
): { x: number; y: number } {
  // Filter out minimized and maximized panels
  const visiblePanels = existingPanels.filter(p => !p.isMinimized && !p.isMaximized)
  
  if (visiblePanels.length === 0) {
    return { x: 20, y: 20 }
  }

  const gap = 10
  const candidates: Array<{ x: number; y: number; score: number }> = []

  // Try placing to the right of each panel
  visiblePanels.forEach(panel => {
    const x = panel.x + panel.width + gap
    const y = panel.y
    if (x + newWidth <= viewportWidth - 20) {
      const overlaps = checkOverlap(x, y, newWidth, newHeight, visiblePanels)
      if (!overlaps) {
        candidates.push({ x, y, score: y + x * 0.1 }) // Prefer top-left
      }
    }
  })

  // Try placing below each panel
  visiblePanels.forEach(panel => {
    const x = panel.x
    const y = panel.y + panel.height + gap
    if (y + newHeight <= viewportHeight - 20) {
      const overlaps = checkOverlap(x, y, newWidth, newHeight, visiblePanels)
      if (!overlaps) {
        candidates.push({ x, y, score: y + x * 0.1 })
      }
    }
  })

  // Try placing at the end of each row
  const rows = groupPanelsByRows(visiblePanels)
  rows.forEach(row => {
    const rightMost = row.reduce((max, p) => Math.max(max, p.x + p.width), 0)
    const x = rightMost + gap
    const y = row[0].y
    if (x + newWidth <= viewportWidth - 20) {
      const overlaps = checkOverlap(x, y, newWidth, newHeight, visiblePanels)
      if (!overlaps) {
        candidates.push({ x, y, score: y + x * 0.1 })
      }
    }
  })

  // If we found candidates, return the best one (lowest score = top-left priority)
  if (candidates.length > 0) {
    candidates.sort((a, b) => a.score - b.score)
    return { x: candidates[0].x, y: candidates[0].y }
  }

  // Fallback: place in a grid pattern starting from top-left
  const gridSize = 50
  for (let y = 20; y < viewportHeight - newHeight; y += gridSize) {
    for (let x = 20; x < viewportWidth - newWidth; x += gridSize) {
      if (!checkOverlap(x, y, newWidth, newHeight, visiblePanels)) {
        return { x, y }
      }
    }
  }

  // Last resort: cascade from top-left
  return { 
    x: 20 + (visiblePanels.length % 10) * 30, 
    y: 20 + (visiblePanels.length % 10) * 30 
  }
}

function checkOverlap(
  x: number,
  y: number,
  width: number,
  height: number,
  panels: Panel[]
): boolean {
  return panels.some(panel => 
    !(x + width < panel.x || 
      x > panel.x + panel.width || 
      y + height < panel.y || 
      y > panel.y + panel.height)
  )
}

function groupPanelsByRows(panels: Panel[]): Panel[][] {
  const sorted = [...panels].sort((a, b) => a.y - b.y)
  const rows: Panel[][] = []
  const rowThreshold = 50 // Panels within 50px vertically are considered same row

  sorted.forEach(panel => {
    const existingRow = rows.find(row => 
      Math.abs(row[0].y - panel.y) < rowThreshold
    )
    if (existingRow) {
      existingRow.push(panel)
    } else {
      rows.push([panel])
    }
  })

  return rows
}

const defaultPanels: Panel[] = [
  {
    id: 'market-overview-1',
    type: 'market-overview',
    title: 'Vue du Marché',
    x: 0,
    y: 0,
    width: 400,
    height: 300,
    isMinimized: false,
    isMaximized: false,
    zIndex: 1,
    order: 0,
  },
  {
    id: 'brvm-stocks-1',
    type: 'brvm-stocks',
    title: 'BRVM - Actions',
    x: 410,
    y: 0,
    width: 500,
    height: 400,
    isMinimized: false,
    isMaximized: false,
    zIndex: 2,
    order: 1,
  },
  {
    id: 'stock-chart-1',
    type: 'stock-chart',
    title: 'Graphique - SONATEL',
    x: 920,
    y: 0,
    width: 500,
    height: 400,
    isMinimized: false,
    isMaximized: false,
    zIndex: 3,
    order: 2,
  },
  {
    id: 'macro-indicators-1',
    type: 'macro-indicators',
    title: 'Indicateurs Macro',
    x: 0,
    y: 310,
    width: 400,
    height: 350,
    isMinimized: false,
    isMaximized: false,
    zIndex: 4,
    order: 3,
  },
  {
    id: 'news-feed-1',
    type: 'news-feed',
    title: 'Actualités',
    x: 410,
    y: 410,
    width: 500,
    height: 250,
    isMinimized: false,
    isMaximized: false,
    zIndex: 5,
    order: 4,
  },
  {
    id: 'web-tv-1',
    type: 'web-tv',
    title: 'Web TV Finance',
    x: 920,
    y: 410,
    width: 500,
    height: 250,
    isMinimized: false,
    isMaximized: false,
    zIndex: 6,
    order: 5,
  },
]

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  panels: defaultPanels,
  activePanel: null,
  maxZIndex: 6,
  sidebarOpen: false,
  
  addPanel: (type, title) => {
    const { panels, maxZIndex } = get()
    
    // Determine panel dimensions based on type
    const dimensions: Record<PanelType, { width: number; height: number }> = {
      'market-overview':  { width: 400, height: 300 },
      'brvm-stocks':      { width: 500, height: 400 },
      'stock-chart':      { width: 520, height: 400 },
      'top-movers':       { width: 420, height: 340 },
      'sector-heatmap':   { width: 460, height: 360 },
      'yield-curves':     { width: 540, height: 380 },
      'currency-rates':   { width: 380, height: 280 },
      'commodities':      { width: 520, height: 400 },
      'news-feed':        { width: 500, height: 300 },
      'web-tv':           { width: 500, height: 350 },
      'macro-indicators': { width: 420, height: 360 },
      'public-finances':  { width: 520, height: 400 },
      'trade-balance':    { width: 500, height: 400 },
      'sector-analysis':  { width: 450, height: 350 },
      'regional-analysis':{ width: 500, height: 420 },
      'economic-calendar':{ width: 480, height: 400 },
      'portfolio':        { width: 450, height: 380 },
      'order-book':       { width: 480, height: 400 },
      'company-profile':  { width: 500, height: 440 },
      'financial-ratios': { width: 560, height: 420 },
      'risk-scorecard':   { width: 440, height: 460 },
      'alerts-panel':     { width: 420, height: 380 },
    }
    const dim = dimensions[type] || { width: 450, height: 350 }
    
    // Find optimal position using auto-layout
    const position = findOptimalPosition(
      panels,
      dim.width,
      dim.height,
      typeof window !== 'undefined' ? window.innerWidth : 1920,
      typeof window !== 'undefined' ? window.innerHeight : 1080
    )
    
    const newPanel: Panel = {
      id: `${type}-${Date.now()}`,
      type,
      title,
      x: position.x,
      y: position.y,
      width: dim.width,
      height: dim.height,
      isMinimized: false,
      isMaximized: false,
      zIndex: maxZIndex + 1,
      order: panels.length,
    }
    set({ panels: [...panels, newPanel], maxZIndex: maxZIndex + 1 })
  },
  
  removePanel: (id) => {
    set({ panels: get().panels.filter(p => p.id !== id) })
  },
  
  updatePanel: (id, updates) => {
    set({
      panels: get().panels.map(p => p.id === id ? { ...p, ...updates } : p)
    })
  },
  
  bringToFront: (id) => {
    const { maxZIndex } = get()
    set({
      panels: get().panels.map(p => 
        p.id === id ? { ...p, zIndex: maxZIndex + 1 } : p
      ),
      maxZIndex: maxZIndex + 1,
      activePanel: id,
    })
  },
  
  minimizePanel: (id) => {
    set({
      panels: get().panels.map(p => 
        p.id === id ? { ...p, isMinimized: true } : p
      )
    })
  },
  
  restorePanel: (id) => {
    const { maxZIndex } = get()
    set({
      panels: get().panels.map(p => 
        p.id === id ? { ...p, isMinimized: false, zIndex: maxZIndex + 1 } : p
      ),
      maxZIndex: maxZIndex + 1,
    })
  },
  
  maximizePanel: (id) => {
    const { maxZIndex } = get()
    set({
      panels: get().panels.map(p => {
        if (p.id === id) {
          return {
            ...p,
            isMaximized: true,
            zIndex: maxZIndex + 1,
            previousDimensions: {
              x: p.x,
              y: p.y,
              width: p.width,
              height: p.height,
            },
          }
        }
        return p
      }),
      maxZIndex: maxZIndex + 1,
    })
  },
  
  unmaximizePanel: (id) => {
    set({
      panels: get().panels.map(p => {
        if (p.id === id && p.previousDimensions) {
          return {
            ...p,
            isMaximized: false,
            x: p.previousDimensions.x,
            y: p.previousDimensions.y,
            width: p.previousDimensions.width,
            height: p.previousDimensions.height,
            previousDimensions: undefined,
          }
        }
        return p
      }),
    })
  },
  
  setActivePanel: (id) => set({ activePanel: id }),
  
  reorderPanels: (startIndex, endIndex) => {
    const panels = [...get().panels]
    const [removed] = panels.splice(startIndex, 1)
    panels.splice(endIndex, 0, removed)
    
    // Update order property for all panels
    const reorderedPanels = panels.map((panel, index) => ({
      ...panel,
      order: index,
    }))
    
    set({ panels: reorderedPanels })
  },
  
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}))
