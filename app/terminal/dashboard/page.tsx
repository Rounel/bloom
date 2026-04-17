'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import React from 'react'
import Link from 'next/link'
import {
  TrendingUp, TrendingDown, Search, Sun, Moon, X, Clock,
  BarChart2, Activity, Globe, GripVertical,
  DollarSign, Newspaper, ChevronLeft, Wifi,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import { cn } from '@/lib/utils'
import {
  brvmStocks, marketIndices, sectorPerformance, currencyRates, newsItems,
} from '@/lib/mock-data'
import { TickerBar } from '@/components/dashboard/ticker-bar'
import { ModuleLayout, ModuleSection, SectionDef } from '@/components/dashboard/module-layout'
import { useModuleSectionsStore } from '@/lib/module-sections-store'
import { PanelGrid, PanelCell, PanelRow, downloadCSV, downloadChartAsPNG, ChartZoom, ZOOM_MAIN } from '@/components/dashboard/panel-grid'

const SECTIONS: SectionDef[] = [
  { id: 'summary',        label: 'Résumé du marché',   icon: Activity },
  { id: 'indices',        label: 'Indices BRVM',        icon: Activity },
  { id: 'top-movers',     label: 'Top Movers',          icon: TrendingUp },
  { id: 'market-cap',     label: 'Capitalisation',      icon: DollarSign },
  { id: 'fx-rates',       label: 'Taux de Change',      icon: Globe },
  { id: 'sector-volumes', label: 'Volumes sectoriels',  icon: BarChart2 },
  { id: 'news',           label: 'Actualités',          icon: Newspaper },
]

// ─── Types ────────────────────────────────────────────────────────────────────

type WidgetId = 'indices' | 'top-movers' | 'sector-volumes' | 'market-cap' | 'fx-rates' | 'news'

// ─── Search Bar ───────────────────────────────────────────────────────────────

const HISTORY_KEY = 'bloomfield-search-history'

const searchIndex = brvmStocks.map((s, i) => ({
  symbol: s.symbol,
  name: s.name,
  sector: s.sector,
  country: s.country,
  price: s.price,
  changePercent: s.changePercent,
  isin: `BJ000${100 + i}${s.symbol.slice(0, 2)}`,
}))

function SearchBar() {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [history, setHistory] = useState<string[]>([])
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY)
      if (stored) setHistory(JSON.parse(stored))
    } catch {}
  }, [])

  const addHistory = useCallback((q: string) => {
    setHistory(prev => {
      const next = [q, ...prev.filter(h => h !== q)].slice(0, 8)
      try { localStorage.setItem(HISTORY_KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
    try { localStorage.removeItem(HISTORY_KEY) } catch {}
  }, [])

  const results = query.length > 0
    ? searchIndex
        .filter(
          item =>
            item.symbol.toLowerCase().includes(query.toLowerCase()) ||
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            item.sector.toLowerCase().includes(query.toLowerCase()) ||
            item.isin.toLowerCase().includes(query.toLowerCase()),
        )
        .slice(0, 6)
    : []

  const handleSelect = (label: string) => {
    addHistory(label)
    setQuery(label)
    setOpen(false)
  }

  const showDropdown = open && (results.length > 0 || (query.length === 0 && history.length > 0))

  return (
    <div ref={ref} className="relative w-full max-w-sm">
      <div
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-xl border transition-colors bg-secondary/30',
          open ? 'border-primary/50' : 'border-border/50',
        )}
      >
        <Search className="w-4 h-4 text-muted-foreground shrink-0" />
        <input
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Code, ISIN, secteur…"
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/70 outline-none min-w-0"
        />
        {query && (
          <button onClick={() => setQuery('')} className="text-muted-foreground hover:text-foreground">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute top-full mt-2 left-0 right-0 z-50 bg-popover border border-border rounded-xl shadow-2xl overflow-hidden">
          {results.length > 0 ? (
            <>
              <div className="px-3 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/50 bg-secondary/20">
                Résultats ({results.length})
              </div>
              {results.map(item => (
                <button
                  key={item.symbol}
                  onMouseDown={() => handleSelect(item.symbol)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-secondary/50 transition-colors text-left"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-foreground">{item.symbol}</span>
                      <span className="text-[10px] text-muted-foreground font-mono">{item.isin}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
                        {item.sector}
                      </span>
                    </div>
                    <span className="text-[11px] text-muted-foreground truncate block">{item.name}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs font-mono font-semibold text-foreground">
                      {item.price.toLocaleString('fr-FR')}
                    </div>
                    <div className={cn('text-[10px] font-mono', item.changePercent >= 0 ? 'text-emerald-500' : 'text-red-400')}>
                      {item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </button>
              ))}
            </>
          ) : (
            <>
              <div className="px-3 py-1.5 flex items-center justify-between border-b border-border/50 bg-secondary/20">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Historique
                </span>
                <button
                  onMouseDown={clearHistory}
                  className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  Effacer
                </button>
              </div>
              {history.map((h, i) => (
                <button
                  key={i}
                  onMouseDown={() => handleSelect(h)}
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-secondary/50 transition-colors text-left"
                >
                  <Clock className="w-3 h-3 text-muted-foreground shrink-0" />
                  <span className="text-xs text-foreground">{h}</span>
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Widget: BRVM Indices ─────────────────────────────────────────────────────

function BRVMIndicesWidget() {
  const indices = marketIndices.filter(idx => idx.name.startsWith('BRVM'))
  const advancers = 28
  const decliners = 15
  const unchanged = 3
  const total = advancers + decliners + unchanged

  return (
    <div className="space-y-3">
      {indices.map(idx => {
        const isPos = idx.change >= 0
        return (
          <div
            key={idx.name}
            className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/40 hover:border-border/70 transition-colors"
          >
            <div>
              <div className="text-xs font-semibold text-foreground">{idx.name}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">
                YTD&nbsp;
                <span className={cn('font-medium', idx.yearToDate >= 0 ? 'text-emerald-500' : 'text-red-400')}>
                  {idx.yearToDate >= 0 ? '+' : ''}{idx.yearToDate}%
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-mono font-bold text-foreground">
                {idx.value.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
              </div>
              <div className={cn('text-xs font-mono font-semibold mt-0.5', isPos ? 'text-emerald-500' : 'text-red-400')}>
                {isPos ? '▲ +' : '▼ '}{idx.changePercent.toFixed(2)}%
              </div>
            </div>
          </div>
        )
      })}

      <div className="space-y-1.5 pt-1">
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>Breadth du marché</span>
          <span>{advancers} H · {decliners} B · {unchanged} S</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden flex bg-secondary">
          <div className="bg-emerald-500 h-full" style={{ width: `${(advancers / total) * 100}%` }} />
          <div className="bg-muted-foreground/30 h-full" style={{ width: `${(unchanged / total) * 100}%` }} />
          <div className="bg-red-400 h-full flex-1" />
        </div>
      </div>
    </div>
  )
}

// ─── Widget: Top Movers ───────────────────────────────────────────────────────

function TopMoversWidget() {
  const [tab, setTab] = useState<'gainers' | 'losers'>('gainers')

  const sorted = tab === 'gainers'
    ? [...brvmStocks].sort((a, b) => b.changePercent - a.changePercent).slice(0, 5)
    : [...brvmStocks].sort((a, b) => a.changePercent - b.changePercent).slice(0, 5)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-1 p-1 bg-secondary/30 rounded-lg">
        {(['gainers', 'losers'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-md transition-colors',
              tab === t
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {t === 'gainers'
              ? <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              : <TrendingDown className="w-3.5 h-3.5 text-red-400" />}
            {t === 'gainers' ? 'Hausses' : 'Baisses'}
          </button>
        ))}
      </div>

      <div className="space-y-1">
        {sorted.map((s, i) => (
          <div
            key={s.symbol}
            className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-secondary/30 transition-colors"
          >
            <span className="text-[10px] text-muted-foreground w-4 text-center font-mono">{i + 1}</span>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold text-foreground">{s.symbol}</span>
                <span className="text-xs font-mono font-semibold text-foreground">
                  {s.price.toLocaleString('fr-FR')}
                </span>
              </div>
              <div className="flex justify-between items-center mt-0.5">
                <span className="text-[10px] text-muted-foreground truncate pr-2">{s.name}</span>
                <span className={cn('text-xs font-mono font-bold shrink-0', s.changePercent >= 0 ? 'text-emerald-500' : 'text-red-400')}>
                  {s.changePercent >= 0 ? '+' : ''}{s.changePercent.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Widget: Sector Volumes ───────────────────────────────────────────────────

function SectorVolumesWidget() {
  const data = sectorPerformance.map(s => ({
    name: s.sector.length > 14 ? s.sector.slice(0, 14) + '…' : s.sector,
    fullName: s.sector,
    volume: s.volume,
    perf: s.performance,
    cap: (s.marketCap / 1e12).toFixed(2),
  }))

  return (
    <ChartZoom heights={ZOOM_MAIN} defaultLevel={2}>
      {(h) => (
        <div style={{ height: h }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 8, bottom: 24, left: 0 }}>
              <XAxis
                dataKey="name"
                tick={{ fontSize: 9, fill: 'var(--muted-foreground)' }}
                angle={-15}
                textAnchor="end"
                interval={0}
              />
              <YAxis
                tick={{ fontSize: 9, fill: 'var(--muted-foreground)' }}
                width={44}
                tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)}
              />
              <Tooltip
                contentStyle={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  fontSize: 11,
                }}
                formatter={(v: number, _: string, { payload }: { payload: typeof data[0] }) => [
                  v.toLocaleString('fr-FR') + ' titres',
                  payload.fullName,
                ]}
                labelFormatter={() => ''}
              />
              <Bar dataKey="volume" radius={[4, 4, 0, 0]}>
                {data.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.perf >= 0 ? 'oklch(0.65 0.18 145)' : 'oklch(0.55 0.22 25)'}
                    fillOpacity={0.85}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </ChartZoom>
  )
}

// ─── Widget: Market Cap ───────────────────────────────────────────────────────

function MarketCapWidget() {
  const totalCap = brvmStocks.reduce((sum, s) => sum + s.marketCap, 0)

  const bySector = sectorPerformance
    .map(sp => {
      const sectorStocks = brvmStocks.filter(s => s.sector === sp.sector)
      const cap = sectorStocks.reduce((acc, s) => acc + s.marketCap, 0)
      return { sector: sp.sector, cap, pct: (cap / totalCap) * 100 }
    })
    .sort((a, b) => b.cap - a.cap)

  const fmt = (v: number) =>
    (v / 1e12).toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

  return (
    <div className="space-y-4">
      <div className="text-center p-4 rounded-xl bg-primary/10 border border-primary/20">
        <div className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">
          Capitalisation Totale BRVM
        </div>
        <div className="text-2xl font-black font-mono text-foreground">{fmt(totalCap)}</div>
        <div className="text-[10px] text-muted-foreground mt-1">milliers de milliards XOF</div>
      </div>

      <div className="space-y-2.5">
        {bySector.map(s => (
          <div key={s.sector}>
            <div className="flex justify-between text-[10px] mb-1">
              <span className="text-foreground font-medium truncate pr-2">{s.sector}</span>
              <span className="text-muted-foreground shrink-0">{s.pct.toFixed(1)}%</span>
            </div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-primary/80 transition-all duration-300"
                style={{ width: `${s.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Widget: FX Rates ─────────────────────────────────────────────────────────

function FXRatesWidget() {
  return (
    <div className="space-y-1.5">
      {currencyRates.slice(0, 6).map(r => (
        <div
          key={r.pair}
          className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-secondary/30 transition-colors"
        >
          <span className="text-xs font-mono font-semibold text-muted-foreground">{r.pair}</span>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-foreground">
              {r.rate < 1
                ? r.rate.toFixed(5)
                : r.rate.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
            </span>
            <span
              className={cn(
                'text-[10px] font-mono font-semibold w-14 text-right',
                r.changePercent >= 0 ? 'text-emerald-500' : 'text-red-400',
              )}
            >
              {r.changePercent >= 0 ? '+' : ''}{r.changePercent.toFixed(2)}%
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Widget: News ─────────────────────────────────────────────────────────────

function NewsWidget() {
  return (
    <div className="space-y-3">
      {newsItems.slice(0, 4).map(item => (
        <div
          key={item.id}
          className="pb-3 border-b border-border/40 last:border-0 last:pb-0 space-y-1 cursor-pointer group"
        >
          <div className="flex items-start gap-2">
            {item.isBreaking && (
              <span className="shrink-0 mt-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-500/15 text-red-400 border border-red-400/20 uppercase">
                Flash
              </span>
            )}
            <span className="text-xs font-semibold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
              {item.title}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
            <span className="font-medium">{item.source}</span>
            <span>·</span>
            <span className="px-1.5 py-0.5 rounded bg-secondary">{item.category}</span>
            <span className="ml-auto">
              {new Date(item.timestamp).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

function getWidgetCSV(id: WidgetId): { headers: string[]; rows: (string | number)[][] } {
  switch (id) {
    case 'indices':
      return {
        headers: ['Indice', 'Valeur', 'Variation', 'Var. %', 'YTD %'],
        rows: marketIndices
          .filter(i => i.name.startsWith('BRVM'))
          .map(i => [i.name, i.value, i.change, i.changePercent, i.yearToDate]),
      }
    case 'top-movers':
      return {
        headers: ['Symbole', 'Nom', 'Cours', 'Var. %', 'Volume', 'Secteur'],
        rows: [...brvmStocks]
          .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
          .map(s => [s.symbol, s.name, s.price, s.changePercent, s.volume, s.sector]),
      }
    case 'sector-volumes':
      return {
        headers: ['Secteur', 'Volume (titres)', 'Performance %', 'Cap. (Bio XOF)'],
        rows: sectorPerformance.map(s => [
          s.sector, s.volume, s.performance, (s.marketCap / 1e9).toFixed(0),
        ]),
      }
    case 'market-cap': {
      const total = brvmStocks.reduce((sum, s) => sum + s.marketCap, 0)
      return {
        headers: ['Secteur', 'Capitalisation (XOF)', 'Part %'],
        rows: sectorPerformance.map(sp => {
          const cap = brvmStocks
            .filter(s => s.sector === sp.sector)
            .reduce((a, s) => a + s.marketCap, 0)
          return [sp.sector, cap, ((cap / total) * 100).toFixed(1)]
        }),
      }
    }
    case 'fx-rates':
      return {
        headers: ['Paire', 'Taux', 'Variation %'],
        rows: currencyRates.map(r => [r.pair, r.rate, r.changePercent]),
      }
    case 'news':
      return {
        headers: ['Titre', 'Source', 'Catégorie', 'Date'],
        rows: newsItems.map(n => [n.title, n.source, n.category, n.timestamp]),
      }
  }
}

// ─── Widget metadata ──────────────────────────────────────────────────────────

const WIDGET_META: Record<WidgetId, { title: string; icon: React.ElementType; colSpan: number; canExportImage?: boolean }> = {
  'indices':        { title: 'Indices BRVM',        icon: Activity,   colSpan: 1 },
  'top-movers':     { title: 'Top Movers',           icon: TrendingUp, colSpan: 1 },
  'market-cap':     { title: 'Capitalisation BRVM',  icon: DollarSign, colSpan: 1 },
  'fx-rates':       { title: 'Taux de Change',       icon: Globe,      colSpan: 1 },
  'sector-volumes': { title: 'Volumes par Secteur',  icon: BarChart2,  colSpan: 2, canExportImage: true },
  'news':           { title: 'Actualités',           icon: Newspaper,  colSpan: 2 },
}

const DEFAULT_ORDER: WidgetId[] = [
  'indices', 'top-movers', 'market-cap', 'fx-rates', 'sector-volumes', 'news',
]

function renderWidgetContent(id: WidgetId) {
  switch (id) {
    case 'indices':        return <BRVMIndicesWidget />
    case 'top-movers':     return <TopMoversWidget />
    case 'sector-volumes': return <SectorVolumesWidget />
    case 'market-cap':     return <MarketCapWidget />
    case 'fx-rates':       return <FXRatesWidget />
    case 'news':           return <NewsWidget />
  }
}

// ─── Row / grid computation ───────────────────────────────────────────────────

function computeRows(order: WidgetId[], visibleIds: Set<WidgetId>): WidgetId[][] {
  const rows: WidgetId[][] = []
  let current: WidgetId[] = []
  let cols = 0
  const MAX = 4

  for (const id of order) {
    if (!visibleIds.has(id)) continue
    const span = WIDGET_META[id].colSpan
    if (cols + span > MAX) {
      if (current.length > 0) rows.push(current)
      current = [id]
      cols = span
    } else {
      current.push(id)
      cols += span
      if (cols >= MAX) {
        rows.push(current)
        current = []
        cols = 0
      }
    }
  }
  if (current.length > 0) rows.push(current)
  return rows
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [isDark, setIsDark] = useState(true)
  const [order, setOrder] = useState<WidgetId[]>(DEFAULT_ORDER)
  const [dragging, setDragging] = useState<WidgetId | null>(null)
  const [dragOver, setDragOver] = useState<WidgetId | null>(null)
  const [time, setTime] = useState('')
  const [hydrated, setHydrated] = useState(false)

  const configs = useModuleSectionsStore(state => state.configs)
  const toggleSection = useModuleSectionsStore(state => state.toggle)

  useEffect(() => { setHydrated(true) }, [])

  // Visible widget set (from sidebar toggles)
  const visibleIds = useMemo<Set<WidgetId>>(() => {
    if (!hydrated) return new Set(DEFAULT_ORDER)
    return new Set(
      DEFAULT_ORDER.filter(id => {
        const cfg = configs['dashboard']?.[id]
        return cfg === undefined ? true : cfg.visible
      }),
    )
  }, [hydrated, configs])

  // Rows derived from order + visibility
  const rows = useMemo(
    () => computeRows(order, visibleIds),
    [order, visibleIds],
  )

  // Theme
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])

  // Clock
  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
      )
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark')
    setIsDark(d => !d)
  }

  // Drag & drop handlers
  const handleDragStart = (id: string) => setDragging(id as WidgetId)

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault()
    if (id !== dragging) setDragOver(id as WidgetId)
  }

  const handleDrop = (targetId: string) => {
    if (dragging && dragging !== targetId) {
      setOrder(prev => {
        const next = [...prev]
        const from = next.indexOf(dragging as WidgetId)
        const to = next.indexOf(targetId as WidgetId)
        next.splice(from, 1)
        next.splice(to, 0, dragging as WidgetId)
        return next
      })
    }
    setDragging(null)
    setDragOver(null)
  }

  const handleDragEnd = () => {
    setDragging(null)
    setDragOver(null)
  }

  // Build PanelRows from rows
  const panelRows: PanelRow[] = rows.map(row => ({
    id: row.join(','),
    cells: row.map(id => {
      const meta = WIDGET_META[id]
      return {
        id,
        title: meta.title,
        icon: meta.icon,
        content: renderWidgetContent(id),
        initialFlex: meta.colSpan,
        csvExport: () => {
          const { headers, rows: csvRows } = getWidgetCSV(id)
          downloadCSV(headers, csvRows, `bloomfield-${id}-${new Date().toISOString().slice(0, 10)}.csv`)
        },
        imageExportId: meta.canExportImage ? id : undefined,
      } satisfies PanelCell
    }),
  }))

  return (
    <div className="h-screen bg-background text-foreground flex flex-col overflow-hidden">

      {/* overflow-hidden so the grid can own its vertical space */}
      <ModuleLayout pageKey="dashboard" sections={SECTIONS} mainClassName="overflow-hidden" title="Dashboard">
        <div className="shrink-0"><TickerBar /></div>
        <div className="h-full flex flex-col gap-1">

          {/* Summary strip — shrinks to its content height */}
          <ModuleSection pageKey="dashboard" id="summary" resizable={false} className="shrink-0">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
              {[
                { label: 'Vol. Total',       value: '198 764',  sub: 'titres échangés',    color: 'text-foreground'  },
                { label: 'Hausses',          value: '28',       sub: 'valeurs en hausse',  color: 'text-emerald-500' },
                { label: 'Baisses',          value: '15',       sub: 'valeurs en baisse',  color: 'text-red-400'     },
                { label: 'Capitalisation',   value: '7 962',    sub: 'Mrd XOF total',      color: 'text-primary'     },
              ].map(s => (
                <div key={s.label} className="p-3 rounded-sm bg-card/60 border border-border/50 hover:border-border transition-colors">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.label} ({s.sub})</div>
                  <div className={cn('text-2xl font-black font-mono mt-1', s.color)}>{s.value}</div>
                </div>
              ))}
            </div>
          </ModuleSection>

          {/* Resizable grid — fills remaining height */}
          <PanelGrid
            rows={panelRows}
            onHide={id => toggleSection('dashboard', id)}
            dragging={dragging}
            dragOver={dragOver}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
          />

        </div>
      </ModuleLayout>

      {/* Footer */}
      {/* <footer className="border-t border-border/30 py-2.5 px-6 flex items-center justify-between text-[10px] text-muted-foreground bg-card/30 backdrop-blur-sm shrink-0">
        <span>Bloomfield Terminal · Dashboard v1.0</span>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>BRVM · Données simulées · 2026-04-12</span>
        </div>
      </footer> */}
    </div>
  )
}
