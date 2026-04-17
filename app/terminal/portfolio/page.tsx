'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
  AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import {
  ChevronLeft, TrendingUp, TrendingDown, Wallet, BarChart2,
  ShieldCheck, Eye, AlertTriangle, ArrowUpDown, Star, Clock,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  brvmStocks, marketIndices, newsItems,
  portfolioHoldings, portfolioPerformance, portfolioRiskMetrics,
  watchlistItems, orderHistory,
  type PortfolioHolding, type WatchlistItem,
} from '@/lib/mock-data'
import { ModuleLayout, ModuleSection, SectionDef } from '@/components/dashboard/module-layout'
import { PanelGrid, PanelRow, downloadCSV, ChartZoom, ZOOM_MAIN } from '@/components/dashboard/panel-grid'
import { useModuleSectionsStore } from '@/lib/module-sections-store'

const SECTIONS: SectionDef[] = [
  { id: 'kpis',        label: 'Indicateurs clés',      icon: Wallet },
  { id: 'holdings',    label: 'Titres',                icon: BarChart2 },
  { id: 'allocation',  label: 'Répartition',           icon: Eye },
  { id: 'performance1', label: 'Perf. BRVM Composite',           icon: TrendingUp },
  { id: 'performance2', label: 'Perf. BRVM 30',           icon: TrendingUp },
  { id: 'performance3', label: 'Perf. BRVM Prestige',           icon: TrendingUp },
  { id: 'risk',        label: 'Métriques de risque',   icon: ShieldCheck },
  { id: 'simulator',   label: 'Simulateur d\'ordres',  icon: ArrowUpDown },
  { id: 'watchlist',   label: 'Surveillance',          icon: Star },
  { id: 'orders',      label: 'Historique ordres',     icon: Clock },
]

const tooltipStyle = {
  contentStyle: { backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px' },
}

const PIE_COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)', '#a78bfa']

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PortfolioPage() {
  const [sortKey, setSortKey] = useState<keyof PortfolioHolding>('value')
  const [sortAsc, setSortAsc] = useState(false)
  const [perfRange, setPerfRange] = useState<'3M' | '6M' | '1A'>('1A')
  const [orderSymbol, setOrderSymbol] = useState('SNTS')
  const [orderSide, setOrderSide] = useState<'achat' | 'vente'>('achat')
  const [orderQty, setOrderQty] = useState(10)
  const [orderPrice, setOrderPrice] = useState(0)
  const [orderToast, setOrderToast] = useState('')
  const [starred, setStarred] = useState<Set<string>>(new Set())
  const [time, setTime] = useState('')

  const toggleSection = useModuleSectionsStore(s => s.toggle)

  useEffect(() => {
    setTime(new Date().toLocaleTimeString('fr-FR'))
    const id = setInterval(() => setTime(new Date().toLocaleTimeString('fr-FR')), 1000)
    return () => clearInterval(id)
  }, [])

  // Set default price when symbol changes
  useEffect(() => {
    const s = brvmStocks.find(b => b.symbol === orderSymbol)
    if (s) setOrderPrice(s.price)
  }, [orderSymbol])

  const sorted = useMemo(() => {
    return [...portfolioHoldings].sort((a, b) => {
      const av = a[sortKey] as number
      const bv = b[sortKey] as number
      return sortAsc ? av - bv : bv - av
    })
  }, [sortKey, sortAsc])

  const totalValue = portfolioHoldings.reduce((s, h) => s + h.value, 0)
  const totalPnl = portfolioHoldings.reduce((s, h) => s + h.pnl, 0)
  const totalPnlPct = (totalPnl / (totalValue - totalPnl)) * 100
  const dayChange = portfolioHoldings.reduce((s, h) => s + h.value * h.changePercent / 100, 0)
  const beta = portfolioRiskMetrics.beta

  const perfData = useMemo(() => {
    const n = perfRange === '3M' ? 3 : perfRange === '6M' ? 6 : 12
    return portfolioPerformance.slice(-n)
  }, [perfRange])

  const allocationData = portfolioHoldings.map(h => ({ name: h.symbol, value: +h.weight.toFixed(1) }))

  function handleOrder() {
    const total = orderQty * orderPrice
    setOrderToast(`✓ Ordre ${orderSide} simulé — ${orderQty} × ${orderSymbol} @ ${orderPrice.toLocaleString('fr-FR')} FCFA = ${total.toLocaleString('fr-FR')} FCFA`)
    setTimeout(() => setOrderToast(''), 4000)
  }

  function toggleSort(key: keyof PortfolioHolding) {
    if (sortKey === key) setSortAsc(!sortAsc)
    else { setSortKey(key); setSortAsc(false) }
  }

  const panelRows: PanelRow[] = [
    {
      id: 'port-row-1',
      cells: [
        {
          id: 'holdings',
          title: 'Titres du portefeuille',
          icon: BarChart2,
          initialFlex: 2,
          csvExport: () => {
            const headers = ['Symbole', 'Secteur', 'Qté', 'PRU', 'Cours', 'Valeur', 'P&L', 'P&L%', 'Poids%']
            const rows = portfolioHoldings.map(h => [h.symbol, h.sector, h.quantity, h.avgPrice, h.currentPrice, h.value, h.pnl, h.pnlPercent.toFixed(2), h.weight.toFixed(1)])
            downloadCSV(headers, rows, `bloomfield-holdings-${new Date().toISOString().slice(0, 10)}.csv`)
          },
          content: (
            <div className="overflow-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="text-[10px] text-muted-foreground font-semibold border-b border-border/40">
                    {[
                      { key: 'symbol', label: 'Titre' }, { key: 'quantity', label: 'Qté' },
                      { key: 'avgPrice', label: 'PRU' }, { key: 'currentPrice', label: 'Cours' },
                      { key: 'value', label: 'Valeur' }, { key: 'pnl', label: 'P&L' },
                      { key: 'pnlPercent', label: 'P&L%' }, { key: 'weight', label: 'Poids' },
                    ].map(col => (
                      <th key={col.key} className="text-right py-1.5 px-2 first:text-left cursor-pointer hover:text-foreground select-none"
                        onClick={() => toggleSort(col.key as keyof PortfolioHolding)}>
                        <span className="inline-flex items-center gap-0.5">
                          {col.label}{sortKey === col.key && <ArrowUpDown className="w-2.5 h-2.5" />}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sorted.map(h => (
                    <tr key={h.symbol} className="border-b border-border/20 hover:bg-secondary/20 transition-colors">
                      <td className="py-2 px-2">
                        <div className="font-bold text-foreground">{h.symbol}</div>
                        <div className="text-[10px] text-muted-foreground">{h.sector}</div>
                      </td>
                      <td className="text-right py-2 px-2 font-mono">{h.quantity}</td>
                      <td className="text-right py-2 px-2 font-mono">{h.avgPrice.toLocaleString('fr-FR')}</td>
                      <td className="text-right py-2 px-2 font-mono">{h.currentPrice.toLocaleString('fr-FR')}</td>
                      <td className="text-right py-2 px-2 font-mono font-semibold">{h.value.toLocaleString('fr-FR')}</td>
                      <td className={cn('text-right py-2 px-2 font-mono', h.pnl >= 0 ? 'text-emerald-500' : 'text-red-400')}>
                        {h.pnl >= 0 ? '+' : ''}{h.pnl.toLocaleString('fr-FR')}
                      </td>
                      <td className={cn('text-right py-2 px-2 font-mono', h.pnlPercent >= 0 ? 'text-emerald-500' : 'text-red-400')}>
                        {h.pnlPercent >= 0 ? '+' : ''}{h.pnlPercent.toFixed(2)}%
                      </td>
                      <td className="text-right py-2 px-2 font-mono text-muted-foreground">{h.weight.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ),
        },
        {
          id: 'allocation',
          title: 'Répartition du portefeuille',
          icon: Eye,
          initialFlex: 1,
          csvExport: () => {
            const headers = ['Symbole', 'Poids%']
            const rows = allocationData.map(d => [d.name, d.value])
            downloadCSV(headers, rows, `bloomfield-allocation-${new Date().toISOString().slice(0, 10)}.csv`)
          },
          imageExportId: 'allocation',
          content: (
            <ChartZoom heights={ZOOM_MAIN} defaultLevel={1}>
              {(h) => (
                <div style={{ height: h }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={allocationData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value"
                        label={({ name, value }) => `${name} ${value}%`} labelLine={false}>
                        {allocationData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                      </Pie>
                      <Tooltip {...tooltipStyle} formatter={(v: number) => [`${v}%`, 'Poids']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </ChartZoom>
          ),
        },
      ],
    },
    {
      id: 'port-row-2',
      cells: [
        {
          id: 'performance1',
          title: 'Performance Portefeuille vs BRVM Composite',
          icon: TrendingUp,
          initialFlex: 2,
          csvExport: () => {
            const headers = ['Mois', 'Portefeuille', 'BRVM Composite']
            const rows = perfData.map(d => [d.month, d.value, d.benchmark])
            downloadCSV(headers, rows, `bloomfield-performance-${new Date().toISOString().slice(0, 10)}.csv`)
          },
          imageExportId: 'performance',
          content: (
            <div>
              <div className="flex justify-end gap-1 mb-2">
                {(['3M', '6M', '1A'] as const).map(r => (
                  <button key={r} onClick={() => setPerfRange(r)}
                    className={cn('px-2.5 py-1 rounded text-xs font-medium transition-colors',
                      perfRange === r ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'
                    )}>{r}</button>
                ))}
              </div>
              <ChartZoom heights={ZOOM_MAIN} defaultLevel={1}>
                {(h) => (
                  <div style={{ height: h }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={perfData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="pfGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="bkGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                        <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} />
                        <YAxis tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} />
                        <Tooltip {...tooltipStyle} />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                        <Area type="monotone" dataKey="value" name="Portefeuille" stroke="var(--chart-1)" fill="url(#pfGrad)" strokeWidth={2} />
                        <Area type="monotone" dataKey="benchmark" name="BRVM Composite" stroke="var(--chart-2)" fill="url(#bkGrad)" strokeWidth={2} strokeDasharray="4 2" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </ChartZoom>
            </div>
          ),
        },
        {
          id: 'performance2',
          title: 'Performance Portefeuille vs BRVM 30',
          icon: TrendingUp,
          initialFlex: 2,
          csvExport: () => {
            const headers = ['Mois', 'Portefeuille', 'BRVM 30']
            const rows = perfData.map(d => [d.month, d.value, d.benchmark])
            downloadCSV(headers, rows, `bloomfield-performance-${new Date().toISOString().slice(0, 10)}.csv`)
          },
          imageExportId: 'performance',
          content: (
            <div>
              <div className="flex justify-end gap-1 mb-2">
                {(['3M', '6M', '1A'] as const).map(r => (
                  <button key={r} onClick={() => setPerfRange(r)}
                    className={cn('px-2.5 py-1 rounded text-xs font-medium transition-colors',
                      perfRange === r ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'
                    )}>{r}</button>
                ))}
              </div>
              <ChartZoom heights={ZOOM_MAIN} defaultLevel={1}>
                {(h) => (
                  <div style={{ height: h }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={perfData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="pfGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="bkGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                        <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} />
                        <YAxis tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} />
                        <Tooltip {...tooltipStyle} />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                        <Area type="monotone" dataKey="value" name="Portefeuille" stroke="var(--chart-1)" fill="url(#pfGrad)" strokeWidth={2} />
                        <Area type="monotone" dataKey="benchmark" name="BRVM 30" stroke="var(--chart-2)" fill="url(#bkGrad)" strokeWidth={2} strokeDasharray="4 2" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </ChartZoom>
            </div>
          ),
        },
        {
          id: 'performance3',
          title: 'Performance Portefeuille vs BRVM Prestige',
          icon: TrendingUp,
          initialFlex: 2,
          csvExport: () => {
            const headers = ['Mois', 'Portefeuille', 'BRVM Prestige']
            const rows = perfData.map(d => [d.month, d.value, d.benchmark])
            downloadCSV(headers, rows, `bloomfield-performance-${new Date().toISOString().slice(0, 10)}.csv`)
          },
          imageExportId: 'performance',
          content: (
            <div>
              <div className="flex justify-end gap-1 mb-2">
                {(['3M', '6M', '1A'] as const).map(r => (
                  <button key={r} onClick={() => setPerfRange(r)}
                    className={cn('px-2.5 py-1 rounded text-xs font-medium transition-colors',
                      perfRange === r ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'
                    )}>{r}</button>
                ))}
              </div>
              <ChartZoom heights={ZOOM_MAIN} defaultLevel={1}>
                {(h) => (
                  <div style={{ height: h }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={perfData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="pfGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="bkGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                        <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} />
                        <YAxis tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} />
                        <Tooltip {...tooltipStyle} />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                        <Area type="monotone" dataKey="value" name="Portefeuille" stroke="var(--chart-1)" fill="url(#pfGrad)" strokeWidth={2} />
                        <Area type="monotone" dataKey="benchmark" name="BRVM Prestige" stroke="var(--chart-2)" fill="url(#bkGrad)" strokeWidth={2} strokeDasharray="4 2" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </ChartZoom>
            </div>
          ),
        },
        {
          id: 'risk',
          title: 'Métriques de risque',
          icon: ShieldCheck,
          initialFlex: 1,
          csvExport: () => {
            const headers = ['Métrique', 'Valeur']
            const rows = [
              ['VaR 95%', `-${portfolioRiskMetrics.var95}%`],
              ['VaR 99%', `-${portfolioRiskMetrics.var99}%`],
              ['Volatilité', `${portfolioRiskMetrics.volatility}%`],
              ['Sharpe', portfolioRiskMetrics.sharpe.toFixed(2)],
              ['Beta', portfolioRiskMetrics.beta.toFixed(2)],
              ['Max Drawdown', `${portfolioRiskMetrics.maxDrawdown}%`],
            ]
            downloadCSV(headers, rows, `bloomfield-risk-${new Date().toISOString().slice(0, 10)}.csv`)
          },
          content: (
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'VaR 95%', value: `-${portfolioRiskMetrics.var95}%`, negative: true },
                { label: 'VaR 99%', value: `-${portfolioRiskMetrics.var99}%`, negative: true },
                { label: 'Volatilité', value: `${portfolioRiskMetrics.volatility}%`, negative: false },
                { label: 'Sharpe', value: portfolioRiskMetrics.sharpe.toFixed(2), negative: false },
                { label: 'Beta', value: portfolioRiskMetrics.beta.toFixed(2), negative: false },
                { label: 'Max Drawdown', value: `${portfolioRiskMetrics.maxDrawdown}%`, negative: true },
              ].map(m => (
                <div key={m.label} className="bg-secondary/30 rounded-lg p-2.5 text-center">
                  <div className="text-[10px] text-muted-foreground mb-0.5">{m.label}</div>
                  <div className={cn('font-bold font-mono text-sm', m.negative ? 'text-red-400' : 'text-emerald-500')}>{m.value}</div>
                </div>
              ))}
            </div>
          ),
        },
      ],
    },
    {
      id: 'port-row-3',
      cells: [
        {
          id: 'simulator',
          title: 'Simulateur d\'ordres',
          icon: BarChart2,
          content: (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-muted-foreground block mb-1">Titre</label>
                  <select value={orderSymbol} onChange={e => setOrderSymbol(e.target.value)}
                    className="w-full rounded-md border border-border bg-secondary/30 px-2 py-1.5 text-xs text-foreground focus:outline-none">
                    {brvmStocks.map(s => <option key={s.symbol} value={s.symbol}>{s.symbol}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground block mb-1">Sens</label>
                  <div className="flex rounded-md overflow-hidden border border-border">
                    {(['achat', 'vente'] as const).map(s => (
                      <button key={s} onClick={() => setOrderSide(s)}
                        className={cn('flex-1 py-1.5 text-xs font-medium transition-colors capitalize',
                          orderSide === s ? (s === 'achat' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white') : 'bg-secondary/30 text-muted-foreground hover:text-foreground'
                        )}>{s}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-muted-foreground block mb-1">Quantité</label>
                  <input type="number" min={1} value={orderQty} onChange={e => setOrderQty(Number(e.target.value))}
                    className="w-full rounded-md border border-border bg-secondary/30 px-2 py-1.5 text-xs text-foreground focus:outline-none" />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground block mb-1">Prix (FCFA)</label>
                  <input type="number" min={1} value={orderPrice} onChange={e => setOrderPrice(Number(e.target.value))}
                    className="w-full rounded-md border border-border bg-secondary/30 px-2 py-1.5 text-xs text-foreground focus:outline-none" />
                </div>
              </div>
              <div className="flex items-center justify-between bg-secondary/30 rounded-lg px-3 py-2">
                <span className="text-xs text-muted-foreground">Total estimé</span>
                <span className="font-bold font-mono text-sm text-foreground">{(orderQty * orderPrice).toLocaleString('fr-FR')} FCFA</span>
              </div>
              <button onClick={handleOrder}
                className={cn('w-full py-2 rounded-lg text-sm font-semibold transition-colors',
                  orderSide === 'achat' ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-red-500 hover:bg-red-600 text-white'
                )}>Placer l'ordre ({orderSide})</button>
              {orderToast && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs rounded-lg px-3 py-2">{orderToast}</div>
              )}
            </div>
          ),
        },
        {
          id: 'watchlist',
          title: 'Liste de surveillance',
          icon: Star,
          csvExport: () => {
            const headers = ['Symbole', 'Nom', 'Prix', 'Variation%', 'Alerte']
            const rows = watchlistItems.map(w => [w.symbol, w.name, w.price, w.changePercent.toFixed(2), w.alertPrice ?? ''])
            downloadCSV(headers, rows, `bloomfield-watchlist-${new Date().toISOString().slice(0, 10)}.csv`)
          },
          content: (
            <div className="space-y-2">
              {watchlistItems.map(w => (
                <div key={w.symbol} className="flex items-center gap-2 p-2 rounded-lg bg-secondary/20 hover:bg-secondary/40 transition-colors">
                  <button onClick={() => setStarred(prev => { const next = new Set(prev); next.has(w.symbol) ? next.delete(w.symbol) : next.add(w.symbol); return next })} className="shrink-0">
                    <Star className={cn('w-3.5 h-3.5', starred.has(w.symbol) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground')} />
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-foreground">{w.symbol}</div>
                    <div className="text-[10px] text-muted-foreground truncate">{w.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono font-semibold text-foreground">{w.price.toLocaleString('fr-FR')}</div>
                    <div className={cn('text-[10px] font-mono', w.changePercent >= 0 ? 'text-emerald-500' : 'text-red-400')}>
                      {w.changePercent >= 0 ? '+' : ''}{w.changePercent.toFixed(2)}%
                    </div>
                  </div>
                  {w.alertPrice && (
                    <div className="text-[10px] text-muted-foreground text-right shrink-0">
                      <AlertTriangle className="w-3 h-3 inline text-yellow-500 mr-0.5" />{w.alertPrice.toLocaleString('fr-FR')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ),
        },
        {
          id: 'orders',
          title: 'Historique des ordres',
          icon: Clock,
          csvExport: () => {
            const headers = ['ID', 'Type', 'Symbole', 'Quantité', 'Prix', 'Date', 'Statut']
            const rows = orderHistory.slice(0, 5).map(o => [o.id, o.type, o.symbol, o.quantity, o.price, o.date, o.status])
            downloadCSV(headers, rows, `bloomfield-orders-${new Date().toISOString().slice(0, 10)}.csv`)
          },
          content: (
            <div className="space-y-2">
              {orderHistory.slice(0, 5).map(o => (
                <div key={o.id} className="flex items-start gap-2 p-2 rounded-lg bg-secondary/20 text-xs">
                  <div className={cn('w-1.5 h-1.5 rounded-full mt-1 shrink-0', {
                    'bg-emerald-500': o.status === 'exécuté', 'bg-red-400': o.status === 'annulé', 'bg-yellow-500': o.status === 'en_attente',
                  })} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={cn('font-semibold capitalize', o.type === 'achat' ? 'text-emerald-500' : 'text-red-400')}>{o.type}</span>
                      <span className="font-bold text-foreground">{o.symbol}</span>
                      <span className="text-muted-foreground">×{o.quantity}</span>
                      <span className="font-mono text-foreground">@{o.price.toLocaleString('fr-FR')}</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{o.date}</div>
                  </div>
                  <span className={cn('text-[10px] font-semibold rounded px-1.5 py-0.5 shrink-0', {
                    'bg-emerald-500/20 text-emerald-500': o.status === 'exécuté',
                    'bg-red-400/20 text-red-400': o.status === 'annulé',
                    'bg-yellow-500/20 text-yellow-500': o.status === 'en_attente',
                  })}>{o.status}</span>
                </div>
              ))}
            </div>
          ),
        },
      ],
    },
  ]

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">

      <ModuleLayout pageKey="portfolio" sections={SECTIONS} mainClassName="overflow-hidden" title="Portefeuille">
        <div className="h-full flex flex-col gap-2">

        <div className="shrink-0">
        <ModuleSection pageKey="portfolio" id="kpis" resizable={false}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: 'Valeur totale', value: totalValue.toLocaleString('fr-FR') + ' FCFA', positive: true },
              { label: 'P&L total', value: (totalPnl >= 0 ? '+' : '') + totalPnl.toLocaleString('fr-FR') + ' FCFA', positive: totalPnl >= 0, sub: `${totalPnlPct >= 0 ? '+' : ''}${totalPnlPct.toFixed(2)}%` },
              { label: 'Variation jour', value: (dayChange >= 0 ? '+' : '') + dayChange.toLocaleString('fr-FR', { maximumFractionDigits: 0 }) + ' FCFA', positive: dayChange >= 0 },
              { label: 'Beta portefeuille', value: beta.toFixed(2), positive: beta <= 1, sub: beta <= 1 ? 'Défensif' : 'Agressif' },
            ].map(k => (
              <div key={k.label} className="rounded-xl border border-border/50 bg-card/80 p-4">
                <div className="text-xs text-muted-foreground mb-1">{k.label}</div>
                <div className={cn('font-bold text-lg font-mono', k.positive ? 'text-emerald-500' : 'text-red-400')}>{k.value}</div>
                {k.sub && <div className="text-[11px] text-muted-foreground">{k.sub}</div>}
              </div>
            ))}
          </div>
        </ModuleSection>
        </div>

        <PanelGrid
          rows={panelRows}
          pageKey="portfolio"
          onHide={id => toggleSection('portfolio', id)}
        />

        </div>
      </ModuleLayout>
    </div>
  )
}
