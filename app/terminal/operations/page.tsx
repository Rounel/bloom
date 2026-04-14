'use client'

import { useState, useMemo } from 'react'
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts'
import {
  TrendingUp, TrendingDown, BarChart2, DollarSign,
  Newspaper, Tv, Globe, Activity, AlertTriangle,
  ChevronUp, ChevronDown, Radio, Package, Flame,
  ChevronLeft, ChevronRight, LayoutGrid, X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  brvmStocks, marketIndices, sectorPerformance,
  currencyRates, commodities, newsItems, tvPrograms,
  sovereignYields, generateStockHistory,
} from '@/lib/mock-data'
import { ModuleLayout, ModuleSection, SectionDef } from '@/components/dashboard/module-layout'

// ─── Section IDs ──────────────────────────────────────────────────────────────

type SectionId =
  | 'indices-africains'
  | 'cours-brvm'
  | 'heatmap-sectorielle'
  | 'cotations-brvm'
  | 'courbes-taux'
  | 'spreads-maturite'
  | 'devises-graphique'
  | 'devises-tableau'
  | 'matieres-prix'
  | 'matieres-perf'
  | 'top-movers'
  | 'most-traded'
  | 'sector-trends'
  | 'flash-alerts'
  | 'actualites'
  | 'web-tv'

const SECTIONS: SectionDef[] = [
  { id: 'indices-africains',   label: 'Indices Africains',    icon: Globe },
  { id: 'cours-brvm',          label: 'Cours & Graphique',    icon: Activity },
  { id: 'heatmap-sectorielle', label: 'Heatmap Sectorielle',  icon: Flame },
  { id: 'cotations-brvm',      label: 'Cotations BRVM',       icon: BarChart2 },
  { id: 'courbes-taux',        label: 'Courbes des Taux',     icon: TrendingUp },
  { id: 'spreads-maturite',    label: 'Spreads Maturité',     icon: BarChart2 },
  { id: 'devises-graphique',   label: 'Paires & Graphique',   icon: TrendingUp },
  { id: 'devises-tableau',     label: 'Tableau FX',           icon: DollarSign },
  { id: 'matieres-prix',       label: 'Prix Spot',            icon: Package },
  { id: 'matieres-perf',       label: 'Perf. Matières',       icon: BarChart2 },
  { id: 'top-movers',          label: 'Top Movers',           icon: TrendingUp },
  { id: 'most-traded',         label: 'Plus Échangés',        icon: Activity },
  { id: 'sector-trends',       label: 'Tendances Sect.',      icon: Flame },
  { id: 'flash-alerts',        label: 'Alertes Flash',        icon: AlertTriangle },
  { id: 'actualites',          label: 'Actualités',           icon: Newspaper },
  { id: 'web-tv',              label: 'Web TV',               icon: Tv },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number, dec = 2) {
  return n.toLocaleString('fr-FR', { minimumFractionDigits: dec, maximumFractionDigits: dec })
}
function pct(n: number) {
  return `${n >= 0 ? '+' : ''}${fmt(n)}%`
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

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden flex flex-col">
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  )
}

// ─── Sparkline ────────────────────────────────────────────────────────────────

function Sparkline({ basePrice, positive }: { basePrice: number; positive: boolean }) {
  const data = useMemo(() => generateStockHistory(basePrice, 14), [basePrice])
  return (
    <LineChart width={80} height={28} data={data}>
      <Line type="monotone" dataKey="close" dot={false} strokeWidth={1.5} stroke={positive ? '#34d399' : '#f87171'} />
    </LineChart>
  )
}

// ─── Section components ───────────────────────────────────────────────────────

function IndicesAfricains() {
  return (
    <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
      {marketIndices.map(idx => (
        <div key={idx.name} className="bg-secondary/20 rounded-lg p-3">
          <p className="text-[10px] text-muted-foreground truncate">{idx.name}</p>
          <p className="text-sm font-bold text-foreground mt-0.5 font-mono">{fmt(idx.value)}</p>
          <ChangeChip value={idx.changePercent} />
          <p className="text-[10px] text-muted-foreground mt-1">YTD <span className={idx.yearToDate >= 0 ? 'text-emerald-400' : 'text-red-400'}>{pct(idx.yearToDate)}</span></p>
        </div>
      ))}
    </div>
  )
}

function CoursBRVM() {
  const [selected, setSelected] = useState(brvmStocks[0])
  const history = useMemo(() => generateStockHistory(selected.price, 60), [selected.price])
  return (
    <div className="p-4 space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {brvmStocks.map(s => (
          <button key={s.symbol} onClick={() => setSelected(s)}
            className={cn('text-xs px-2 py-1 rounded border transition-colors font-mono', selected.symbol === s.symbol ? 'bg-primary/10 border-primary/40 text-primary' : 'border-border text-muted-foreground hover:bg-secondary/50')}>
            {s.symbol}
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm font-bold text-foreground">{selected.symbol}</span>
          <span className="ml-2 text-xs text-muted-foreground">{selected.name}</span>
        </div>
        <ChangeChip value={selected.changePercent} />
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={history}>
          <defs>
            <linearGradient id="cGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={selected.change >= 0 ? '#34d399' : '#f87171'} stopOpacity={0.3} />
              <stop offset="95%" stopColor={selected.change >= 0 ? '#34d399' : '#f87171'} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.4} />
          <XAxis dataKey="date" tick={{ fontSize: 9, fill: 'var(--muted-foreground)' }} tickFormatter={d => d.slice(5)} interval="preserveStartEnd" />
          <YAxis tick={{ fontSize: 9, fill: 'var(--muted-foreground)' }} domain={['auto', 'auto']} width={55} tickFormatter={v => v.toLocaleString('fr-FR')} />
          <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 11 }}
            formatter={(v: number) => [v.toLocaleString('fr-FR') + ' XOF', 'Cours']} labelStyle={{ color: 'var(--muted-foreground)' }} />
          <Area type="monotone" dataKey="close" stroke={selected.change >= 0 ? '#34d399' : '#f87171'} fill="url(#cGrad)" strokeWidth={1.5} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

function HeatmapSectorielle() {
  const max = Math.max(...sectorPerformance.map(s => Math.abs(s.performance)))
  return (
    <div className="p-4 space-y-3">
      {sectorPerformance.map(s => {
        const intensity = Math.abs(s.performance) / max
        const pos = s.performance >= 0
        return (
          <div key={s.sector} className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs text-foreground truncate pr-2">{s.sector}</span>
              <ChangeChip value={s.performance} size="xs" />
            </div>
            <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
              <div className={cn('h-full rounded-full', pos ? 'bg-emerald-500' : 'bg-red-500')} style={{ width: `${intensity * 100}%` }} />
            </div>
            <p className="text-[10px] text-muted-foreground">Cap. {(s.marketCap / 1e12).toFixed(2)} T XOF · {s.numberOfStocks} valeur(s)</p>
          </div>
        )
      })}
    </div>
  )
}

function CotationsBRVM() {
  const [selected, setSelected] = useState(brvmStocks[0].symbol)
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border bg-secondary/30">
            {['Symbole', 'Nom', 'Cours', 'Var.', 'Var.%', 'Volume', 'Pays', '14j'].map(h => (
              <th key={h} className="px-3 py-2 text-left text-[10px] font-semibold text-muted-foreground whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {brvmStocks.map((s, i) => (
            <tr key={s.symbol} onClick={() => setSelected(s.symbol)}
              className={cn('border-b border-border/50 cursor-pointer transition-colors hover:bg-primary/5',
                selected === s.symbol ? 'bg-primary/5' : i % 2 === 0 ? '' : 'bg-secondary/10')}>
              <td className="px-3 py-2 font-bold text-foreground font-mono">{s.symbol}</td>
              <td className="px-3 py-2 text-foreground truncate max-w-[120px]">{s.name}</td>
              <td className="px-3 py-2 font-mono font-semibold text-foreground">{s.price.toLocaleString('fr-FR')}</td>
              <td className={cn('px-3 py-2 font-mono', s.change >= 0 ? 'text-emerald-400' : 'text-red-400')}>
                {s.change >= 0 ? '+' : ''}{s.change.toLocaleString('fr-FR')}
              </td>
              <td className="px-3 py-2"><ChangeChip value={s.changePercent} size="xs" /></td>
              <td className="px-3 py-2 font-mono text-muted-foreground">{s.volume.toLocaleString('fr-FR')}</td>
              <td className="px-3 py-2 text-muted-foreground">{s.country}</td>
              <td className="px-3 py-2"><Sparkline basePrice={s.price} positive={s.change >= 0} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const YIELD_COLORS: Record<string, string> = { CI: '#3b82f6', SN: '#22c55e', BF: '#f59e0b', ML: '#ef4444', BJ: '#a855f7' }

function CourbesTaux() {
  const [selected, setSelected] = useState<string[]>(['CI', 'SN', 'BF'])
  const maturities = ['3M', '6M', '1A', '2A', '5A', '10A']
  const chartData = maturities.map(mat => {
    const pt: Record<string, number | string> = { maturity: mat }
    sovereignYields.forEach(c => {
      const y = c.yields.find(r => r.maturity === mat)
      if (y && selected.includes(c.code)) pt[c.code] = y.rate
    })
    return pt
  })
  return (
    <div className="p-4 space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {sovereignYields.map(c => (
          <button key={c.code}
            onClick={() => setSelected(prev => prev.includes(c.code) ? prev.filter(x => x !== c.code) : [...prev, c.code])}
            className={cn('flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors',
              selected.includes(c.code) ? 'border-transparent text-white' : 'border-border text-muted-foreground hover:bg-secondary/50')}
            style={selected.includes(c.code) ? { background: YIELD_COLORS[c.code] } : {}}>
            {c.country}
          </button>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.4} />
          <XAxis dataKey="maturity" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} />
          <YAxis tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} tickFormatter={v => `${v}%`} domain={[3, 10]} />
          <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 11 }}
            formatter={(v: number, name: string) => [`${v.toFixed(2)}%`, sovereignYields.find(x => x.code === name)?.country ?? name]} />
          <Legend formatter={v => sovereignYields.find(c => c.code === v)?.country ?? v} wrapperStyle={{ fontSize: 10 }} />
          {sovereignYields.filter(c => selected.includes(c.code)).map(c => (
            <Line key={c.code} type="monotone" dataKey={c.code} stroke={YIELD_COLORS[c.code]} strokeWidth={2} dot={{ r: 3, fill: YIELD_COLORS[c.code] }} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

function SpreadsMaturite() {
  const maturities = ['3M', '6M', '1A', '2A', '5A', '10A']
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border bg-secondary/30">
            <th className="px-4 py-2 text-left text-[10px] font-semibold text-muted-foreground">Pays</th>
            {maturities.map(m => <th key={m} className="px-3 py-2 text-center text-[10px] font-semibold text-muted-foreground">{m}</th>)}
          </tr>
        </thead>
        <tbody>
          {sovereignYields.map((c, i) => {
            const base = sovereignYields[0]
            return (
              <tr key={c.code} className={cn('border-b border-border/50', i % 2 === 0 ? '' : 'bg-secondary/10')}>
                <td className="px-4 py-2 font-medium text-foreground">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: YIELD_COLORS[c.code] }} />
                    {c.country}
                  </div>
                </td>
                {maturities.map(mat => {
                  const y = c.yields.find(r => r.maturity === mat)?.rate ?? 0
                  const b = base.yields.find(r => r.maturity === mat)?.rate ?? 0
                  const spread = c.code === 'CI' ? y : y - b
                  return (
                    <td key={mat} className="px-3 py-2 text-center font-mono">
                      {c.code === 'CI'
                        ? <span className="text-foreground">{y.toFixed(2)}%</span>
                        : <span className={spread > 0 ? 'text-red-400' : 'text-emerald-400'}>{spread > 0 ? '+' : ''}{spread.toFixed(0)}pb</span>}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function DevisesGraphique() {
  const [selected, setSelected] = useState(currencyRates[0])
  const history = useMemo(() => {
    const seed = selected.rate * 1e6
    const data: { date: string; rate: number }[] = []
    let r = selected.rate
    const rng = (() => {
      let s = Math.floor(seed) >>> 0
      return () => { s += 0x6d2b79f5; let t = Math.imul(s ^ (s >>> 15), 1 | s); t ^= t + Math.imul(t ^ (t >>> 7), 61 | t); return ((t ^ (t >>> 14)) >>> 0) / 0xffffffff }
    })()
    const now = new Date('2026-04-10T00:00:00Z')
    for (let i = 59; i >= 0; i--) {
      const d = new Date(now); d.setDate(d.getDate() - i)
      r = r + (rng() - 0.5) * 0.002 * r
      data.push({ date: d.toISOString().split('T')[0], rate: +r.toFixed(6) })
    }
    return data
  }, [selected.rate])
  return (
    <div className="p-4 space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {currencyRates.map(c => (
          <button key={c.pair} onClick={() => setSelected(c)}
            className={cn('text-xs px-2.5 py-1 rounded border transition-colors font-mono', selected.pair === c.pair ? 'bg-primary/10 border-primary/40 text-primary' : 'border-border text-muted-foreground hover:bg-secondary/50')}>
            {c.pair}
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold font-mono text-foreground">{selected.pair}</span>
        <ChangeChip value={selected.changePercent} />
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={history}>
          <defs>
            <linearGradient id="fxG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={selected.changePercent >= 0 ? '#34d399' : '#f87171'} stopOpacity={0.3} />
              <stop offset="95%" stopColor={selected.changePercent >= 0 ? '#34d399' : '#f87171'} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.4} />
          <XAxis dataKey="date" tick={{ fontSize: 9, fill: 'var(--muted-foreground)' }} tickFormatter={d => d.slice(5)} interval="preserveStartEnd" />
          <YAxis tick={{ fontSize: 9, fill: 'var(--muted-foreground)' }} domain={['auto', 'auto']} width={65} tickFormatter={v => v.toFixed(selected.rate < 1 ? 5 : 2)} />
          <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 11 }}
            formatter={(v: number) => [v.toFixed(selected.rate < 1 ? 6 : 4), selected.pair]} labelStyle={{ color: 'var(--muted-foreground)' }} />
          <Area type="monotone" dataKey="rate" stroke={selected.changePercent >= 0 ? '#34d399' : '#f87171'} fill="url(#fxG)" strokeWidth={1.5} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

function DevisesTableau() {
  return (
    <div className="overflow-x-auto">
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
            <tr key={c.pair} className={cn('border-b border-border/50 hover:bg-primary/5 transition-colors', i % 2 === 0 ? '' : 'bg-secondary/10')}>
              <td className="px-4 py-2 font-bold text-foreground font-mono">{c.pair}</td>
              <td className="px-4 py-2 font-mono text-foreground">{c.rate < 1 ? c.rate.toFixed(6) : fmt(c.rate, 2)}</td>
              <td className={cn('px-4 py-2 font-mono', c.change >= 0 ? 'text-emerald-400' : 'text-red-400')}>
                {c.change >= 0 ? '+' : ''}{Math.abs(c.change).toFixed(6)}
              </td>
              <td className="px-4 py-2"><ChangeChip value={c.changePercent} size="xs" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

type CommodityPeriod = 'jour' | 'semaine' | 'mois'
const CAT_COLORS: Record<string, string> = { Agricole: 'bg-emerald-500/10 text-emerald-400', Énergie: 'bg-orange-500/10 text-orange-400', Métaux: 'bg-yellow-500/10 text-yellow-400', Minéraux: 'bg-blue-500/10 text-blue-400' }

function MatieresPrix() {
  const [period, setPeriod] = useState<CommodityPeriod>('jour')
  const [cat, setCat] = useState('Tous')
  const cats = ['Tous', 'Agricole', 'Énergie', 'Métaux', 'Minéraux']
  const filtered = commodities.filter(c => cat === 'Tous' || c.category === cat)
  const val = (c: typeof commodities[0]) => period === 'jour' ? c.changePercent : period === 'semaine' ? c.weekChange : c.monthChange
  return (
    <div className="p-4 space-y-3">
      <div className="flex flex-wrap gap-2">
        <div className="flex rounded-lg border border-border overflow-hidden">
          {(['jour', 'semaine', 'mois'] as CommodityPeriod[]).map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={cn('px-3 py-1.5 text-xs font-medium transition-colors', period === p ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary/50')}>
              {p === 'jour' ? 'J' : p === 'semaine' ? 'S' : 'M'}
            </button>
          ))}
        </div>
        {cats.map(c => (
          <button key={c} onClick={() => setCat(c)}
            className={cn('px-2.5 py-1 text-xs rounded-lg border transition-colors', cat === c ? 'bg-primary/10 border-primary/40 text-primary' : 'border-border text-muted-foreground hover:bg-secondary/50')}>
            {c}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {filtered.map(c => {
          const v = val(c); const pos = v >= 0
          return (
            <div key={c.symbol} className="bg-secondary/20 rounded-lg p-3">
              <div className="flex items-start justify-between gap-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase">{c.symbol}</p>
                <span className={cn('text-[9px] px-1 py-0.5 rounded font-medium shrink-0', CAT_COLORS[c.category] ?? '')}>{c.category}</span>
              </div>
              <p className="text-xs font-medium text-foreground mt-0.5 truncate">{c.name}</p>
              <p className="text-sm font-bold font-mono text-foreground mt-1">{c.price < 10 ? c.price.toFixed(2) : fmt(c.price, 0)}</p>
              <p className="text-[10px] text-muted-foreground">{c.unit}</p>
              <div className="mt-1 flex items-center gap-1">
                {pos ? <TrendingUp className="w-3 h-3 text-emerald-400" /> : <TrendingDown className="w-3 h-3 text-red-400" />}
                <span className={cn('text-xs font-mono font-semibold', pos ? 'text-emerald-400' : 'text-red-400')}>{pct(v)}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function MatieresPerf() {
  const cats = ['Agricole', 'Énergie', 'Métaux', 'Minéraux']
  const data = cats.map(cat => ({
    cat,
    j: +(commodities.filter(c => c.category === cat).reduce((s, c) => s + c.changePercent, 0) / (commodities.filter(c => c.category === cat).length || 1)).toFixed(2),
    s: +(commodities.filter(c => c.category === cat).reduce((s, c) => s + c.weekChange, 0) / (commodities.filter(c => c.category === cat).length || 1)).toFixed(2),
    m: +(commodities.filter(c => c.category === cat).reduce((s, c) => s + c.monthChange, 0) / (commodities.filter(c => c.category === cat).length || 1)).toFixed(2),
  }))
  return (
    <div className="p-4">
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.4} />
          <XAxis dataKey="cat" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} />
          <YAxis tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} tickFormatter={v => `${v}%`} />
          <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 11 }} formatter={(v: number, n: string) => [`${v >= 0 ? '+' : ''}${v.toFixed(2)}%`, n === 'j' ? 'Jour' : n === 's' ? 'Semaine' : 'Mois']} />
          <Legend formatter={v => v === 'j' ? 'Jour' : v === 's' ? 'Semaine' : 'Mois'} wrapperStyle={{ fontSize: 10 }} />
          <Bar dataKey="j" fill="#34d399" radius={[2, 2, 0, 0]} />
          <Bar dataKey="s" fill="#60a5fa" radius={[2, 2, 0, 0]} />
          <Bar dataKey="m" fill="#a78bfa" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

function TopMovers() {
  const sorted = [...brvmStocks].sort((a, b) => b.changePercent - a.changePercent)
  const gainers = sorted.slice(0, 5)
  const losers = [...sorted].reverse().slice(0, 5)
  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
      {[{ label: 'Top Hausses', icon: TrendingUp, color: 'text-emerald-400', data: gainers }, { label: 'Top Baisses', icon: TrendingDown, color: 'text-red-400', data: losers }].map(({ label, icon: Icon, color, data }) => (
        <div key={label}>
          <div className="flex items-center gap-1.5 mb-2">
            <Icon className={cn('w-3.5 h-3.5', color)} />
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{label}</p>
          </div>
          <div className="space-y-1.5">
            {data.map(s => (
              <div key={s.symbol} className="flex items-center justify-between px-2 py-1.5 rounded bg-secondary/20">
                <div>
                  <span className="font-mono font-bold text-xs text-foreground">{s.symbol}</span>
                  <p className="text-[10px] text-muted-foreground">{s.sector}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-mono text-foreground">{s.price.toLocaleString('fr-FR')}</p>
                  <ChangeChip value={s.changePercent} size="xs" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function MostTraded() {
  const byVol = [...brvmStocks].sort((a, b) => b.volume - a.volume).slice(0, 8)
  const max = byVol[0].volume
  return (
    <div className="p-4 space-y-2">
      {byVol.map((s, i) => (
        <div key={s.symbol} className="flex items-center gap-3">
          <span className="text-[10px] text-muted-foreground w-4 shrink-0">{i + 1}</span>
          <span className="font-mono font-bold text-xs text-foreground w-12 shrink-0">{s.symbol}</span>
          <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: `${(s.volume / max) * 100}%` }} />
          </div>
          <span className="font-mono text-xs text-muted-foreground w-20 text-right shrink-0">{s.volume.toLocaleString('fr-FR')}</span>
          <ChangeChip value={s.changePercent} size="xs" />
        </div>
      ))}
    </div>
  )
}

function SectorTrends() {
  const data = sectorPerformance.map(s => ({ name: s.sector, perf: s.performance }))
  return (
    <div className="p-4">
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.4} horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 9, fill: 'var(--muted-foreground)' }} tickFormatter={v => `${v}%`} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 9, fill: 'var(--muted-foreground)' }} width={110} />
          <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 11 }}
            formatter={(v: number) => [`${v >= 0 ? '+' : ''}${v.toFixed(2)}%`, 'Performance']} />
          <Bar dataKey="perf" radius={[0, 4, 4, 0]}>
            {data.map((entry, i) => <rect key={i} fill={entry.perf >= 0 ? '#34d399' : '#f87171'} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

function FlashAlerts() {
  const breaking = newsItems.filter(n => n.isBreaking)
  return (
    <div className="p-4 space-y-2">
      {breaking.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">Aucune alerte critique</p>}
      {breaking.map(n => (
        <div key={n.id} className="flex items-start gap-3 bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2.5">
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
  )
}

function Actualites() {
  return (
    <div className="divide-y divide-border/50">
      {newsItems.map(n => (
        <div key={n.id} className="px-4 py-3 hover:bg-secondary/20 transition-colors cursor-pointer">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn('text-[9px] px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider',
              n.isBreaking ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary')}>
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
  )
}

function WebTV() {
  return (
    <div className="divide-y divide-border/50">
      {tvPrograms.map(p => (
        <div key={p.id} className="px-4 py-3 flex items-center gap-3 hover:bg-secondary/20 transition-colors cursor-pointer">
          <div className={cn('w-16 h-10 rounded shrink-0 flex items-center justify-center text-center',
            p.isLive ? 'bg-destructive/10 border border-destructive/30' : 'bg-secondary/50')}>
            {p.isLive ? <span className="text-[9px] font-bold text-destructive animate-pulse">● LIVE</span> : <Tv className="w-4 h-4 text-muted-foreground/50" />}
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
  )
}

// ─── Section renderer ─────────────────────────────────────────────────────────

const SECTION_TITLES: Record<SectionId, string> = {
  'indices-africains':   'Indices Africains',
  'cours-brvm':          'Cours & Graphique',
  'heatmap-sectorielle': 'Heatmap Sectorielle',
  'cotations-brvm':      'Cotations BRVM',
  'courbes-taux':        'Courbes des Taux Souverains',
  'spreads-maturite':    'Spreads par Maturité',
  'devises-graphique':   'Paires & Graphique',
  'devises-tableau':     'Tableau des Paires',
  'matieres-prix':       'Prix Spot Matières Premières',
  'matieres-perf':       'Perf. par Catégorie',
  'top-movers':          'Top Hausses / Baisses',
  'most-traded':         'Titres les Plus Échangés',
  'sector-trends':       'Tendances Sectorielles',
  'flash-alerts':        'Alertes Flash',
  'actualites':          'Actualités',
  'web-tv':              'Web TV',
}

function renderSection(id: SectionId) {
  switch (id) {
    case 'indices-africains':   return <IndicesAfricains />
    case 'cours-brvm':          return <CoursBRVM />
    case 'heatmap-sectorielle': return <HeatmapSectorielle />
    case 'cotations-brvm':      return <CotationsBRVM />
    case 'courbes-taux':        return <CourbesTaux />
    case 'spreads-maturite':    return <SpreadsMaturite />
    case 'devises-graphique':   return <DevisesGraphique />
    case 'devises-tableau':     return <DevisesTableau />
    case 'matieres-prix':       return <MatieresPrix />
    case 'matieres-perf':       return <MatieresPerf />
    case 'top-movers':          return <TopMovers />
    case 'most-traded':         return <MostTraded />
    case 'sector-trends':       return <SectorTrends />
    case 'flash-alerts':        return <FlashAlerts />
    case 'actualites':          return <Actualites />
    case 'web-tv':              return <WebTV />
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OperationsPage() {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <ModuleLayout pageKey="operations" sections={SECTIONS}>
        <div className="p-4 columns-1 xl:columns-2 gap-4">
          {SECTIONS.map(item => (
            <ModuleSection key={item.id} pageKey="operations" id={item.id} resizable={false} className="break-inside-avoid mb-4">
              <SectionCard>
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-secondary/10">
                  <item.icon className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span className="text-xs font-bold text-foreground">{SECTION_TITLES[item.id as SectionId]}</span>
                </div>
                {renderSection(item.id as SectionId)}
              </SectionCard>
            </ModuleSection>
          ))}
        </div>
      </ModuleLayout>
    </div>
  )
}
