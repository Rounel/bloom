'use client'

import { useState, useMemo } from 'react'
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts'
import {
  TrendingUp, TrendingDown, BarChart2, DollarSign,
  Newspaper, Tv, Globe, Activity, AlertTriangle,
  ChevronUp, ChevronDown, Minus, Radio,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  brvmStocks, marketIndices, sectorPerformance,
  currencyRates, commodities, newsItems, tvPrograms,
  sovereignYields, generateStockHistory,
} from '@/lib/mock-data'

// ─── Types ────────────────────────────────────────────────────────────────────

type TabId = 'marches' | 'taux' | 'devises' | 'matieres' | 'performances' | 'flashinfo'
type CommodityPeriod = 'jour' | 'semaine' | 'mois'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number, dec = 2) {
  return n.toLocaleString('fr-FR', { minimumFractionDigits: dec, maximumFractionDigits: dec })
}

function pct(n: number) {
  const sign = n >= 0 ? '+' : ''
  return `${sign}${fmt(n)}%`
}

function ChangeChip({ value, size = 'sm' }: { value: number; size?: 'xs' | 'sm' }) {
  const pos = value >= 0
  return (
    <span className={cn(
      'inline-flex items-center gap-0.5 font-mono font-semibold rounded px-1',
      size === 'xs' ? 'text-[10px]' : 'text-xs',
      pos ? 'text-emerald-400' : 'text-red-400',
    )}>
      {pos ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      {pct(value)}
    </span>
  )
}

// ─── Sparkline ────────────────────────────────────────────────────────────────

function Sparkline({ basePrice, positive }: { basePrice: number; positive: boolean }) {
  const data = useMemo(() => generateStockHistory(basePrice, 14), [basePrice])
  return (
    <ResponsiveContainer width={80} height={28}>
      <LineChart data={data}>
        <Line
          type="monotone"
          dataKey="close"
          dot={false}
          strokeWidth={1.5}
          stroke={positive ? '#34d399' : '#f87171'}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

// ─── Tab bar ──────────────────────────────────────────────────────────────────

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'marches',      label: 'Marchés Boursiers',      icon: BarChart2 },
  { id: 'taux',         label: 'Taux Souverains',         icon: Activity },
  { id: 'devises',      label: 'Devises',                 icon: DollarSign },
  { id: 'matieres',     label: 'Matières Premières',      icon: Globe },
  { id: 'performances', label: 'Performances',            icon: TrendingUp },
  { id: 'flashinfo',    label: 'Flash Info & Web TV',     icon: Radio },
]

// ─── Section 1 — Marchés Boursiers ───────────────────────────────────────────

function MarchesTab() {
  const [selectedStock, setSelectedStock] = useState(brvmStocks[0])
  const history = useMemo(() => generateStockHistory(selectedStock.price, 60), [selectedStock.price])

  const heatmapMax = Math.max(...sectorPerformance.map(s => Math.abs(s.performance)))

  return (
    <div className="space-y-6">
      {/* Indices africains */}
      <section>
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Indices Africains</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {marketIndices.map(idx => (
            <div key={idx.name} className="bg-card border border-border rounded-lg p-3">
              <p className="text-[10px] text-muted-foreground truncate">{idx.name}</p>
              <p className="text-sm font-bold text-foreground mt-0.5 font-mono">{fmt(idx.value)}</p>
              <ChangeChip value={idx.changePercent} />
              <p className="text-[10px] text-muted-foreground mt-1">YTD <span className={idx.yearToDate >= 0 ? 'text-emerald-400' : 'text-red-400'}>{pct(idx.yearToDate)}</span></p>
            </div>
          ))}
        </div>
      </section>

      {/* Stock chart + table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chart */}
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-sm font-bold text-foreground">{selectedStock.symbol}</span>
              <span className="ml-2 text-xs text-muted-foreground">{selectedStock.name}</span>
            </div>
            <ChangeChip value={selectedStock.changePercent} />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={history}>
              <defs>
                <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={selectedStock.change >= 0 ? '#34d399' : '#f87171'} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={selectedStock.change >= 0 ? '#34d399' : '#f87171'} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.4} />
              <XAxis dataKey="date" tick={{ fontSize: 9, fill: 'var(--muted-foreground)' }} tickFormatter={d => d.slice(5)} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 9, fill: 'var(--muted-foreground)' }} domain={['auto', 'auto']} width={55} tickFormatter={v => v.toLocaleString('fr-FR')} />
              <Tooltip
                contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 11 }}
                formatter={(v: number) => [v.toLocaleString('fr-FR') + ' XOF', 'Cours']}
                labelStyle={{ color: 'var(--muted-foreground)' }}
              />
              <Area type="monotone" dataKey="close" stroke={selectedStock.change >= 0 ? '#34d399' : '#f87171'} fill="url(#priceGrad)" strokeWidth={1.5} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Sector Heatmap */}
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Heatmap Sectorielle</h3>
          <div className="space-y-2">
            {sectorPerformance.map(s => {
              const intensity = Math.abs(s.performance) / heatmapMax
              const pos = s.performance >= 0
              return (
                <div key={s.sector} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] text-foreground truncate pr-2">{s.sector}</span>
                    <ChangeChip value={s.performance} size="xs" />
                  </div>
                  <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full transition-all', pos ? 'bg-emerald-500' : 'bg-red-500')}
                      style={{ width: `${intensity * 100}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-4 pt-3 border-t border-border space-y-1">
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-2">Capitalisation (Mrd XOF)</p>
            {sectorPerformance.map(s => (
              <div key={s.sector} className="flex justify-between text-[10px]">
                <span className="text-muted-foreground truncate">{s.sector}</span>
                <span className="font-mono text-foreground">{(s.marketCap / 1e12).toFixed(2)} T</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BRVM Cotations */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Cotations BRVM en Direct</h3>
          <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 animate-pulse">● Live</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                {['Symbole', 'Nom', 'Cours (XOF)', 'Var.', 'Var.%', 'Volume', 'Pays', 'Secteur', '60j'].map(h => (
                  <th key={h} className="px-3 py-2 text-left text-[10px] font-semibold text-muted-foreground whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {brvmStocks.map((s, i) => (
                <tr
                  key={s.symbol}
                  onClick={() => setSelectedStock(s)}
                  className={cn(
                    'border-b border-border/50 cursor-pointer transition-colors',
                    selectedStock.symbol === s.symbol ? 'bg-primary/5' : i % 2 === 0 ? 'bg-transparent' : 'bg-secondary/10',
                    'hover:bg-primary/5',
                  )}
                >
                  <td className="px-3 py-2 font-bold text-foreground font-mono">{s.symbol}</td>
                  <td className="px-3 py-2 text-foreground truncate max-w-[120px]">{s.name}</td>
                  <td className="px-3 py-2 font-mono font-semibold text-foreground">{s.price.toLocaleString('fr-FR')}</td>
                  <td className={cn('px-3 py-2 font-mono', s.change >= 0 ? 'text-emerald-400' : 'text-red-400')}>
                    {s.change >= 0 ? '+' : ''}{s.change.toLocaleString('fr-FR')}
                  </td>
                  <td className="px-3 py-2"><ChangeChip value={s.changePercent} size="xs" /></td>
                  <td className="px-3 py-2 font-mono text-muted-foreground">{s.volume.toLocaleString('fr-FR')}</td>
                  <td className="px-3 py-2 text-muted-foreground">{s.country}</td>
                  <td className="px-3 py-2 text-muted-foreground">{s.sector}</td>
                  <td className="px-3 py-2">
                    <Sparkline basePrice={s.price} positive={s.change >= 0} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ─── Section 2 — Taux Souverains ─────────────────────────────────────────────

const YIELD_COLORS: Record<string, string> = {
  CI: '#3b82f6', SN: '#22c55e', BF: '#f59e0b', ML: '#ef4444', BJ: '#a855f7',
}

function TauxTab() {
  const [selected, setSelected] = useState<string[]>(['CI', 'SN', 'BF'])

  const maturities = ['3M', '6M', '1A', '2A', '5A', '10A']

  const chartData = maturities.map(mat => {
    const point: Record<string, number | string> = { maturity: mat }
    sovereignYields.forEach(c => {
      const y = c.yields.find(r => r.maturity === mat)
      if (y && selected.includes(c.code)) point[c.code] = y.rate
    })
    return point
  })

  return (
    <div className="space-y-6">
      {/* Country selector */}
      <div className="flex flex-wrap gap-2">
        {sovereignYields.map(c => (
          <button
            key={c.code}
            onClick={() => setSelected(prev =>
              prev.includes(c.code) ? prev.filter(x => x !== c.code) : [...prev, c.code]
            )}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
              selected.includes(c.code)
                ? 'border-transparent text-white'
                : 'border-border text-muted-foreground hover:border-border/80',
            )}
            style={selected.includes(c.code) ? { background: YIELD_COLORS[c.code] } : {}}
          >
            <span className="w-2 h-2 rounded-full" style={{ background: YIELD_COLORS[c.code] }} />
            {c.country}
          </button>
        ))}
      </div>

      {/* Yield curve chart */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Courbes des Taux Souverains UEMOA</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.4} />
            <XAxis dataKey="maturity" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} />
            <YAxis tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} tickFormatter={v => `${v}%`} domain={[3, 10]} />
            <Tooltip
              contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 11 }}
              formatter={(v: number, name: string) => {
                const c = sovereignYields.find(x => x.code === name)
                return [`${v.toFixed(2)}%`, c?.country ?? name]
              }}
            />
            <Legend formatter={(value) => sovereignYields.find(c => c.code === value)?.country ?? value} wrapperStyle={{ fontSize: 11 }} />
            {sovereignYields.filter(c => selected.includes(c.code)).map(c => (
              <Line key={c.code} type="monotone" dataKey={c.code} stroke={YIELD_COLORS[c.code]} strokeWidth={2} dot={{ r: 4, fill: YIELD_COLORS[c.code] }} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Spreads table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Spreads par Maturité (vs Côte d'Ivoire)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="px-4 py-2 text-left text-[10px] font-semibold text-muted-foreground">Pays</th>
                {maturities.map(m => (
                  <th key={m} className="px-3 py-2 text-center text-[10px] font-semibold text-muted-foreground">{m}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sovereignYields.map((c, i) => {
                const base = sovereignYields[0]
                return (
                  <tr key={c.code} className={cn('border-b border-border/50', i % 2 === 0 ? 'bg-transparent' : 'bg-secondary/10')}>
                    <td className="px-4 py-2 font-medium text-foreground flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ background: YIELD_COLORS[c.code] }} />
                      {c.country}
                    </td>
                    {maturities.map(mat => {
                      const y = c.yields.find(r => r.maturity === mat)?.rate ?? 0
                      const b = base.yields.find(r => r.maturity === mat)?.rate ?? 0
                      const spread = c.code === 'CI' ? y : y - b
                      return (
                        <td key={mat} className="px-3 py-2 text-center font-mono">
                          {c.code === 'CI'
                            ? <span className="text-foreground">{y.toFixed(2)}%</span>
                            : <span className={spread > 0 ? 'text-red-400' : 'text-emerald-400'}>
                                {spread > 0 ? '+' : ''}{spread.toFixed(0)}pb
                              </span>
                          }
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ─── Section 3 — Devises ─────────────────────────────────────────────────────

function DevisesTab() {
  const [selectedPair, setSelectedPair] = useState(currencyRates[0])

  // Generate mock historical data for selected pair
  const history = useMemo(() => {
    const seed = selectedPair.rate * 1e6
    const data: { date: string; rate: number }[] = []
    let r = selectedPair.rate
    const rng = (() => {
      let s = Math.floor(seed) >>> 0
      return () => {
        s += 0x6d2b79f5
        let t = Math.imul(s ^ (s >>> 15), 1 | s)
        t ^= t + Math.imul(t ^ (t >>> 7), 61 | t)
        return ((t ^ (t >>> 14)) >>> 0) / 0xffffffff
      }
    })()
    const now = new Date('2026-04-10T00:00:00Z')
    for (let i = 59; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      r = r + (rng() - 0.5) * 0.002 * r
      data.push({ date: d.toISOString().split('T')[0], rate: +r.toFixed(6) })
    }
    return data
  }, [selectedPair.rate])

  return (
    <div className="space-y-6">
      {/* Pair cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {currencyRates.map(c => (
          <button
            key={c.pair}
            onClick={() => setSelectedPair(c)}
            className={cn(
              'text-left bg-card border rounded-lg p-3 transition-colors',
              selectedPair.pair === c.pair ? 'border-primary/50 bg-primary/5' : 'border-border hover:border-border/80',
            )}
          >
            <p className="text-[10px] text-muted-foreground">{c.pair}</p>
            <p className="text-sm font-bold font-mono text-foreground mt-0.5">{c.rate < 1 ? c.rate.toFixed(6) : fmt(c.rate, 2)}</p>
            <ChangeChip value={c.changePercent} size="xs" />
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-sm font-bold text-foreground">{selectedPair.pair}</span>
            <span className="ml-2 text-xs text-muted-foreground">60 jours</span>
          </div>
          <ChangeChip value={selectedPair.changePercent} />
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={history}>
            <defs>
              <linearGradient id="fxGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={selectedPair.changePercent >= 0 ? '#34d399' : '#f87171'} stopOpacity={0.3} />
                <stop offset="95%" stopColor={selectedPair.changePercent >= 0 ? '#34d399' : '#f87171'} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.4} />
            <XAxis dataKey="date" tick={{ fontSize: 9, fill: 'var(--muted-foreground)' }} tickFormatter={d => d.slice(5)} interval="preserveStartEnd" />
            <YAxis tick={{ fontSize: 9, fill: 'var(--muted-foreground)' }} domain={['auto', 'auto']} width={65} tickFormatter={v => v.toFixed(selectedPair.rate < 1 ? 5 : 2)} />
            <Tooltip
              contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 11 }}
              formatter={(v: number) => [v.toFixed(selectedPair.rate < 1 ? 6 : 4), selectedPair.pair]}
              labelStyle={{ color: 'var(--muted-foreground)' }}
            />
            <Area type="monotone" dataKey="rate" stroke={selectedPair.changePercent >= 0 ? '#34d399' : '#f87171'} fill="url(#fxGrad)" strokeWidth={1.5} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Full table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Tableau des Paires</h3>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              {['Paire', 'Taux', 'Variation', 'Var. %'].map(h => (
                <th key={h} className="px-4 py-2 text-left text-[10px] font-semibold text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currencyRates.map((c, i) => (
              <tr key={c.pair} className={cn('border-b border-border/50 cursor-pointer hover:bg-primary/5 transition-colors', i % 2 === 0 ? '' : 'bg-secondary/10')} onClick={() => setSelectedPair(c)}>
                <td className="px-4 py-2 font-bold text-foreground font-mono">{c.pair}</td>
                <td className="px-4 py-2 font-mono text-foreground">{c.rate < 1 ? c.rate.toFixed(6) : fmt(c.rate, 2)}</td>
                <td className={cn('px-4 py-2 font-mono', c.change >= 0 ? 'text-emerald-400' : 'text-red-400')}>
                  {c.change >= 0 ? '+' : ''}{c.change.toFixed(6)}
                </td>
                <td className="px-4 py-2"><ChangeChip value={c.changePercent} size="xs" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Section 4 — Matières Premières ──────────────────────────────────────────

const CATEGORIES = ['Tous', 'Agricole', 'Énergie', 'Métaux', 'Minéraux']

function MatieresTab() {
  const [period, setPeriod] = useState<CommodityPeriod>('jour')
  const [category, setCategory] = useState('Tous')

  const filtered = commodities.filter(c => category === 'Tous' || c.category === category)

  function periodValue(c: typeof commodities[0]) {
    if (period === 'jour') return c.changePercent
    if (period === 'semaine') return c.weekChange
    return c.monthChange
  }

  // Correlation data (mock — using week changes as proxy)
  const corrData = CATEGORIES.slice(1).map(cat => ({
    cat,
    value: commodities.filter(c => c.category === cat).reduce((s, c) => s + c.weekChange, 0) /
           (commodities.filter(c => c.category === cat).length || 1),
  }))

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex rounded-lg border border-border overflow-hidden">
          {(['jour', 'semaine', 'mois'] as CommodityPeriod[]).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn('px-3 py-1.5 text-xs font-medium capitalize transition-colors', period === p ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary/50')}
            >
              {p === 'jour' ? 'Journalier' : p === 'semaine' ? 'Hebdo.' : 'Mensuel'}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn('px-3 py-1.5 text-xs rounded-lg border transition-colors', category === cat ? 'bg-primary/10 border-primary/40 text-primary' : 'border-border text-muted-foreground hover:bg-secondary/50')}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {filtered.map(c => {
          const val = periodValue(c)
          const pos = val >= 0
          return (
            <div key={c.symbol} className="bg-card border border-border rounded-lg p-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{c.symbol}</p>
                  <p className="text-xs font-medium text-foreground mt-0.5">{c.name}</p>
                </div>
                <span className={cn('text-[9px] px-1.5 py-0.5 rounded font-medium', c.category === 'Agricole' ? 'bg-emerald-500/10 text-emerald-400' : c.category === 'Énergie' ? 'bg-orange-500/10 text-orange-400' : c.category === 'Métaux' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-blue-500/10 text-blue-400')}>
                  {c.category}
                </span>
              </div>
              <p className="text-sm font-bold font-mono text-foreground mt-2">{c.price < 10 ? c.price.toFixed(2) : fmt(c.price, 0)}</p>
              <p className="text-[10px] text-muted-foreground">{c.unit}</p>
              <div className="mt-1.5 flex items-center gap-1">
                {pos ? <TrendingUp className="w-3 h-3 text-emerald-400" /> : <TrendingDown className="w-3 h-3 text-red-400" />}
                <span className={cn('text-xs font-mono font-semibold', pos ? 'text-emerald-400' : 'text-red-400')}>{pct(val)}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Correlation bar chart */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Performance Hebdomadaire par Catégorie</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={corrData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.4} />
            <XAxis dataKey="cat" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} />
            <YAxis tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} tickFormatter={v => `${v.toFixed(1)}%`} />
            <Tooltip
              contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 11 }}
              formatter={(v: number) => [`${v.toFixed(2)}%`, 'Perf. moy.']}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {corrData.map((entry, i) => (
                <rect key={i} fill={entry.value >= 0 ? '#34d399' : '#f87171'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// ─── Section 5 — Performances ─────────────────────────────────────────────────

function PerformancesTab() {
  const sorted = [...brvmStocks].sort((a, b) => b.changePercent - a.changePercent)
  const gainers = sorted.slice(0, 5)
  const losers = [...sorted].reverse().slice(0, 5)
  const byVolume = [...brvmStocks].sort((a, b) => b.volume - a.volume).slice(0, 6)

  const sectorChartData = sectorPerformance.map(s => ({ name: s.sector, perf: s.performance, vol: Math.round(s.volume / 1000) }))

  return (
    <div className="space-y-6">
      {/* Top movers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Gainers */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Top Hausses</h3>
          </div>
          <div className="divide-y divide-border/50">
            {gainers.map(s => (
              <div key={s.symbol} className="px-4 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-xs text-foreground w-12">{s.symbol}</span>
                  <div>
                    <p className="text-xs text-foreground">{s.name}</p>
                    <p className="text-[10px] text-muted-foreground">{s.sector}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-mono font-semibold text-foreground">{s.price.toLocaleString('fr-FR')}</p>
                  <ChangeChip value={s.changePercent} size="xs" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Losers */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-red-400" />
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Top Baisses</h3>
          </div>
          <div className="divide-y divide-border/50">
            {losers.map(s => (
              <div key={s.symbol} className="px-4 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-xs text-foreground w-12">{s.symbol}</span>
                  <div>
                    <p className="text-xs text-foreground">{s.name}</p>
                    <p className="text-[10px] text-muted-foreground">{s.sector}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-mono font-semibold text-foreground">{s.price.toLocaleString('fr-FR')}</p>
                  <ChangeChip value={s.changePercent} size="xs" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Most traded */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Titres les Plus Échangés</h3>
        </div>
        <div className="p-4">
          <div className="space-y-2">
            {byVolume.map((s, i) => {
              const maxVol = byVolume[0].volume
              return (
                <div key={s.symbol} className="flex items-center gap-3">
                  <span className="text-[10px] text-muted-foreground w-4">{i + 1}</span>
                  <span className="font-mono font-bold text-xs text-foreground w-12">{s.symbol}</span>
                  <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${(s.volume / maxVol) * 100}%` }} />
                  </div>
                  <span className="font-mono text-xs text-muted-foreground w-20 text-right">{s.volume.toLocaleString('fr-FR')}</span>
                  <ChangeChip value={s.changePercent} size="xs" />
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Sector trends */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Tendances Sectorielles</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={sectorChartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.4} horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 9, fill: 'var(--muted-foreground)' }} tickFormatter={v => `${v}%`} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 9, fill: 'var(--muted-foreground)' }} width={110} />
            <Tooltip
              contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 11 }}
              formatter={(v: number) => [`${v >= 0 ? '+' : ''}${v.toFixed(2)}%`, 'Performance']}
            />
            <Bar dataKey="perf" radius={[0, 4, 4, 0]}>
              {sectorChartData.map((entry, i) => (
                <rect key={i} fill={entry.perf >= 0 ? '#34d399' : '#f87171'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// ─── Section 6 — Flash Info & Web TV ─────────────────────────────────────────

function FlashInfoTab() {
  return (
    <div className="space-y-6">
      {/* Breaking alerts */}
      <div className="space-y-2">
        {newsItems.filter(n => n.isBreaking).map(n => (
          <div key={n.id} className="flex items-start gap-3 bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-3">
            <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-bold text-destructive uppercase tracking-wider">Flash</span>
                <span className="text-[10px] text-muted-foreground">{n.source}</span>
              </div>
              <p className="text-xs font-semibold text-foreground">{n.title}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{n.summary}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* News feed */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center gap-2">
            <Newspaper className="w-4 h-4 text-primary" />
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Actualités en Temps Réel</h3>
          </div>
          <div className="divide-y divide-border/50">
            {newsItems.map(n => (
              <div key={n.id} className="px-4 py-3 hover:bg-secondary/20 transition-colors cursor-pointer">
                <div className="flex items-center gap-2 mb-1">
                  <span className={cn(
                    'text-[9px] px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider',
                    n.isBreaking ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary',
                  )}>
                    {n.isBreaking ? '⚡ Flash' : n.category}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{n.source}</span>
                  <span className="text-[10px] text-muted-foreground ml-auto">
                    {new Date(n.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs font-semibold text-foreground leading-snug">{n.title}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{n.summary}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Web TV */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center gap-2">
            <Tv className="w-4 h-4 text-primary" />
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Web TV — Programme</h3>
          </div>
          <div className="divide-y divide-border/50">
            {tvPrograms.map(p => (
              <div key={p.id} className="px-4 py-3 flex items-center gap-3 hover:bg-secondary/20 transition-colors cursor-pointer">
                {/* Thumbnail placeholder */}
                <div className={cn('w-20 h-12 rounded shrink-0 flex items-center justify-center', p.isLive ? 'bg-destructive/10 border border-destructive/30' : 'bg-secondary/50')}>
                  {p.isLive
                    ? <span className="text-[9px] font-bold text-destructive animate-pulse">● LIVE</span>
                    : <Tv className="w-5 h-5 text-muted-foreground/50" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[9px] px-1.5 py-0.5 bg-primary/10 text-primary rounded font-medium">{p.category}</span>
                    {p.scheduledTime && <span className="text-[10px] text-muted-foreground">{p.scheduledTime}</span>}
                  </div>
                  <p className="text-xs font-semibold text-foreground truncate">{p.title}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{p.description}</p>
                </div>
                <span className="text-[10px] text-muted-foreground shrink-0">{p.duration}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OperationsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('marches')

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      {/* Tab bar */}
      <div className="shrink-0 border-b border-border bg-card px-4 overflow-x-auto">
        <div className="flex gap-0.5 min-w-max">
          {TABS.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-1.5 px-4 py-3 text-xs font-medium border-b-2 transition-colors whitespace-nowrap',
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border',
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        {activeTab === 'marches'      && <MarchesTab />}
        {activeTab === 'taux'         && <TauxTab />}
        {activeTab === 'devises'      && <DevisesTab />}
        {activeTab === 'matieres'     && <MatieresTab />}
        {activeTab === 'performances' && <PerformancesTab />}
        {activeTab === 'flashinfo'    && <FlashInfoTab />}
      </div>
    </div>
  )
}
