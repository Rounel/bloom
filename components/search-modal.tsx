'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, X, TrendingUp, TrendingDown, BarChart2, Globe, Package } from 'lucide-react'
import { cn } from '@/lib/utils'
import { brvmStocks, macroIndicators, commodities, sectorPerformance } from '@/lib/mock-data'
import { useDashboardStore } from '@/lib/dashboard-store'

interface SearchResult {
  id: string
  type: 'stock' | 'macro' | 'commodity' | 'sector'
  label: string
  sublabel: string
  badge?: string
  badgeColor?: string
  action: () => void
}

function buildResults(query: string, addPanel: (type: any, title: string) => void): SearchResult[] {
  const q = query.toLowerCase()
  const results: SearchResult[] = []

  // Stocks
  brvmStocks
    .filter(s =>
      s.symbol.toLowerCase().includes(q) ||
      s.name.toLowerCase().includes(q) ||
      s.sector.toLowerCase().includes(q) ||
      s.country.toLowerCase().includes(q)
    )
    .slice(0, 5)
    .forEach(s => results.push({
      id: `stock-${s.symbol}`,
      type: 'stock',
      label: `${s.symbol} – ${s.name}`,
      sublabel: `${s.sector} · ${s.country} · ${s.price.toLocaleString('fr-FR')} XOF`,
      badge: `${s.changePercent >= 0 ? '+' : ''}${s.changePercent.toFixed(2)}%`,
      badgeColor: s.changePercent >= 0 ? 'text-emerald-500' : 'text-destructive',
      action: () => addPanel('brvm-stocks', 'BRVM – Actions'),
    }))

  // Commodities
  commodities
    .filter(c => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q) || c.category.toLowerCase().includes(q))
    .slice(0, 3)
    .forEach(c => results.push({
      id: `commodity-${c.symbol}`,
      type: 'commodity',
      label: `${c.name} (${c.symbol})`,
      sublabel: `${c.category} · ${c.price.toLocaleString('fr-FR')} ${c.unit}`,
      badge: `${c.changePercent >= 0 ? '+' : ''}${c.changePercent.toFixed(2)}%`,
      badgeColor: c.changePercent >= 0 ? 'text-emerald-500' : 'text-destructive',
      action: () => addPanel('commodities', 'Matières Premières'),
    }))

  // Sectors
  sectorPerformance
    .filter(s => s.sector.toLowerCase().includes(q))
    .slice(0, 3)
    .forEach(s => results.push({
      id: `sector-${s.sector}`,
      type: 'sector',
      label: s.sector,
      sublabel: `${s.numberOfStocks} titres · Vol. ${s.volume.toLocaleString('fr-FR')}`,
      badge: `${s.performance >= 0 ? '+' : ''}${s.performance.toFixed(2)}%`,
      badgeColor: s.performance >= 0 ? 'text-emerald-500' : 'text-destructive',
      action: () => addPanel('sector-heatmap', 'Heatmap Secteurs'),
    }))

  // Macro countries
  macroIndicators
    .filter(m => m.country.toLowerCase().includes(q) || m.countryCode.toLowerCase().includes(q))
    .slice(0, 3)
    .forEach(m => results.push({
      id: `macro-${m.countryCode}`,
      type: 'macro',
      label: m.country,
      sublabel: `PIB: +${m.gdpGrowth}% · Inflation: ${m.inflation}% · Taux: ${m.interestRate}%`,
      action: () => addPanel('macro-indicators', 'Indicateurs Macro'),
    }))

  return results
}

function typeIcon(type: SearchResult['type']) {
  switch (type) {
    case 'stock':     return <TrendingUp className="w-4 h-4 text-primary" />
    case 'commodity': return <Package className="w-4 h-4 text-yellow-500" />
    case 'sector':    return <BarChart2 className="w-4 h-4 text-blue-500" />
    case 'macro':     return <Globe className="w-4 h-4 text-purple-500" />
  }
}

const HISTORY_KEY = 'bloom_search_history'

export function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [history, setHistory] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const { addPanel } = useDashboardStore()

  useEffect(() => {
    if (open) {
      setQuery('')
      setSelectedIdx(0)
      inputRef.current?.focus()
      try {
        const stored = JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]')
        setHistory(stored)
      } catch { /* ignore */ }
    }
  }, [open])

  const results = query.length >= 1 ? buildResults(query, addPanel) : []

  function handleSelect(result: SearchResult) {
    // Save to history
    const next = [result.label, ...history.filter(h => h !== result.label)].slice(0, 8)
    setHistory(next)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next))
    result.action()
    onClose()
  }

  function clearHistory() {
    setHistory([])
    localStorage.removeItem(HISTORY_KEY)
  }

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const list = results
    if (e.key === 'Escape') { onClose(); return }
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIdx(i => Math.min(i + 1, list.length - 1)) }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setSelectedIdx(i => Math.max(i - 1, 0)) }
    if (e.key === 'Enter' && list[selectedIdx]) handleSelect(list[selectedIdx])
  }, [results, selectedIdx, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[10vh]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="w-5 h-5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setSelectedIdx(0) }}
            onKeyDown={handleKeyDown}
            placeholder="Rechercher par code ISIN, nom, secteur, pays…"
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-0.5 rounded hover:bg-secondary transition-colors">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
          <kbd className="text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded shrink-0">ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-auto">
          {results.length > 0 ? (
            <div className="p-2 space-y-0.5">
              {results.map((result, i) => (
                <button
                  key={result.id}
                  onClick={() => handleSelect(result)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors',
                    i === selectedIdx ? 'bg-secondary' : 'hover:bg-secondary/50'
                  )}
                  onMouseEnter={() => setSelectedIdx(i)}
                >
                  <div className="shrink-0">{typeIcon(result.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">{result.label}</div>
                    <div className="text-[11px] text-muted-foreground truncate">{result.sublabel}</div>
                  </div>
                  {result.badge && (
                    <span className={cn('text-xs font-mono font-semibold shrink-0', result.badgeColor)}>
                      {result.badge}
                    </span>
                  )}
                  <span className="text-[10px] text-muted-foreground shrink-0">Ouvrir</span>
                </button>
              ))}
            </div>
          ) : query.length >= 1 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              Aucun résultat pour « {query} »
            </div>
          ) : history.length > 0 ? (
            <div className="p-2">
              <div className="flex items-center justify-between px-3 py-1.5">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Historique</span>
                <button onClick={clearHistory} className="text-[10px] text-muted-foreground hover:text-foreground transition-colors">
                  Effacer
                </button>
              </div>
              {history.map(h => (
                <button
                  key={h}
                  onClick={() => setQuery(h)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-secondary/50 transition-colors"
                >
                  <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <span className="text-sm text-muted-foreground truncate">{h}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground">
              Tapez un nom, symbole ou secteur pour rechercher
            </div>
          )}
        </div>

        {/* Footer hints */}
        <div className="flex items-center gap-4 px-4 py-2 border-t border-border text-[10px] text-muted-foreground">
          <span><kbd className="bg-secondary px-1 py-0.5 rounded">↑↓</kbd> Naviguer</span>
          <span><kbd className="bg-secondary px-1 py-0.5 rounded">↵</kbd> Ouvrir</span>
          <span><kbd className="bg-secondary px-1 py-0.5 rounded">ESC</kbd> Fermer</span>
        </div>
      </div>
    </div>
  )
}
