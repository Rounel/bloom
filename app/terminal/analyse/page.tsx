'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
  ComposedChart, Area, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ReferenceLine,
} from 'recharts'
import { ChevronLeft, BarChart2, Activity, ShieldAlert, Globe, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  brvmStocks, marketIndices, generateStockHistory,
  companyProfiles, financialRatios, countryRiskCards,
} from '@/lib/mock-data'

// ─── Technical indicator functions ───────────────────────────────────────────

function computeSMA(data: number[], period: number): (number | null)[] {
  return data.map((_, i) =>
    i < period - 1 ? null : +(data.slice(i - period + 1, i + 1).reduce((s, v) => s + v, 0) / period).toFixed(2)
  )
}

function computeRSI(closes: number[], period = 14): (number | null)[] {
  const result: (number | null)[] = Array(closes.length).fill(null)
  if (closes.length < period + 1) return result
  for (let i = period; i < closes.length; i++) {
    const slice = closes.slice(i - period, i + 1)
    const gains: number[] = []
    const losses: number[] = []
    for (let j = 1; j < slice.length; j++) {
      const diff = slice[j] - slice[j - 1]
      gains.push(diff > 0 ? diff : 0)
      losses.push(diff < 0 ? -diff : 0)
    }
    const avgGain = gains.reduce((s, v) => s + v, 0) / period
    const avgLoss = losses.reduce((s, v) => s + v, 0) / period
    if (avgLoss === 0) { result[i] = 100; continue }
    const rs = avgGain / avgLoss
    result[i] = +(100 - 100 / (1 + rs)).toFixed(2)
  }
  return result
}

function computeMACD(closes: number[]): { macd: number | null; signal: number | null; histogram: number | null }[] {
  const ema = (data: number[], period: number): number[] => {
    const k = 2 / (period + 1)
    const result: number[] = [data[0]]
    for (let i = 1; i < data.length; i++) result.push(data[i] * k + result[i - 1] * (1 - k))
    return result
  }
  const ema12 = ema(closes, 12)
  const ema26 = ema(closes, 26)
  const macdLine = closes.map((_, i) => i < 25 ? null : +(ema12[i] - ema26[i]).toFixed(2))
  const macdValues = macdLine.filter((v): v is number => v !== null)
  const signalValues = ema(macdValues, 9)
  let sigIdx = 0
  return closes.map((_, i) => {
    if (i < 25) return { macd: null, signal: null, histogram: null }
    const macd = macdLine[i]!
    const signal = i < 34 ? null : +signalValues[sigIdx++].toFixed(2)
    const histogram = signal !== null ? +(macd - signal).toFixed(2) : null
    return { macd, signal, histogram }
  })
}

function computeBollinger(closes: number[], period = 20): { upper: number | null; lower: number | null; mid: number | null }[] {
  const sma = computeSMA(closes, period)
  return closes.map((_, i) => {
    if (sma[i] === null) return { upper: null, lower: null, mid: null }
    const mid = sma[i]!
    const slice = closes.slice(i - period + 1, i + 1)
    const std = Math.sqrt(slice.reduce((s, v) => s + (v - mid) ** 2, 0) / period)
    return { upper: +(mid + 2 * std).toFixed(2), lower: +(mid - 2 * std).toFixed(2), mid: +mid.toFixed(2) }
  })
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function TickerBar() {
  const [items, setItems] = useState<{ label: string; change: number; isPositive: boolean }[]>([])
  useEffect(() => {
    const base = [
      ...marketIndices.map(i => ({ label: i.name, change: i.changePercent, isPositive: i.change >= 0 })),
      ...brvmStocks.map(s => ({ label: s.symbol, change: s.changePercent, isPositive: s.change >= 0 })),
    ]
    setItems(base)
    const id = setInterval(() => setItems(prev => prev.map(it => {
      const c = it.change + (Math.random() - 0.5) * 0.06
      return { ...it, change: c, isPositive: c >= 0 }
    })), 1500)
    return () => clearInterval(id)
  }, [])
  if (!items.length) return <div className="h-9 bg-secondary/40 border-b border-border/50" />
  return (
    <div className="h-9 bg-secondary/40 border-b border-border/50 overflow-hidden flex items-center relative select-none">
      <div className="absolute left-0 inset-y-0 w-10 bg-gradient-to-r from-secondary/60 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 inset-y-0 w-10 bg-gradient-to-l from-secondary/60 to-transparent z-10 pointer-events-none" />
      <div className="flex animate-scroll-infinite whitespace-nowrap [animation-duration:45s] hover:[animation-play-state:paused]">
        {[...items, ...items].map((it, i) => (
          <div key={i} className="inline-flex items-center gap-2 px-4 border-r border-border/30">
            <span className="text-[11px] font-semibold text-muted-foreground">{it.label}</span>
            <span className={cn('text-[11px] font-mono font-bold', it.isPositive ? 'text-emerald-500' : 'text-red-400')}>
              {it.isPositive ? '▲' : '▼'}&thinsp;{Math.abs(it.change).toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function SectionCard({ icon: Icon, title, children, colSpan }: {
  icon: React.ElementType; title: string; children: React.ReactNode; colSpan?: string
}) {
  return (
    <div className={cn('rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden', colSpan)}>
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-secondary/20">
        <Icon className="w-4 h-4 text-primary" />
        <span className="text-sm font-semibold">{title}</span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

const tooltipStyle = {
  contentStyle: { backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '11px' },
}

function riskColor(score: number) {
  if (score <= 30) return 'text-emerald-500'
  if (score <= 50) return 'text-yellow-500'
  if (score <= 70) return 'text-orange-500'
  return 'text-red-400'
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AnalysePage() {
  const [techSymbol, setTechSymbol] = useState('SNTS')
  const [fundSymbol, setFundSymbol] = useState('SNTS')
  const [riskCountry, setRiskCountry] = useState('CI')
  const [ratioSector, setRatioSector] = useState('Tous')
  const [time, setTime] = useState('')

  useEffect(() => {
    setTime(new Date().toLocaleTimeString('fr-FR'))
    const id = setInterval(() => setTime(new Date().toLocaleTimeString('fr-FR')), 1000)
    return () => clearInterval(id)
  }, [])

  const techStock = brvmStocks.find(s => s.symbol === techSymbol) ?? brvmStocks[0]
  const history = useMemo(() => generateStockHistory(techStock.price, 90), [techStock.price])
  const closes = useMemo(() => history.map(h => h.close), [history])

  const bollinger = useMemo(() => computeBollinger(closes), [closes])
  const rsi = useMemo(() => computeRSI(closes), [closes])
  const macd = useMemo(() => computeMACD(closes), [closes])

  const chartData = useMemo(() => history.map((h, i) => ({
    date: h.date,
    close: h.close,
    upper: bollinger[i].upper,
    lower: bollinger[i].lower,
    mid: bollinger[i].mid,
    rsi: rsi[i],
    macd: macd[i].macd,
    signal: macd[i].signal,
    histogram: macd[i].histogram,
  })), [history, bollinger, rsi, macd])

  const fundCompany = companyProfiles.find(c => c.symbol === fundSymbol) ?? companyProfiles[0]
  const riskCard = countryRiskCards.find(c => c.countryCode === riskCountry) ?? countryRiskCards[0]
  const radarData = riskCard.dimensions.map(d => ({ subject: d.label.slice(0, 8), value: d.score }))

  const sectors = ['Tous', ...Array.from(new Set(financialRatios.map(r => r.sector)))]
  const filteredRatios = ratioSector === 'Tous' ? financialRatios : financialRatios.filter(r => r.sector === ratioSector)

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      {/* <header className="h-14 border-b flex items-center px-6 bg-card/50 backdrop-blur-sm gap-4 shrink-0">
        <Link href="/modules" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="w-4 h-4" />
          <span className="text-sm">Modules</span>
        </Link>
        <div className="h-5 w-px bg-border/50" />
        <div className="flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-primary" />
          <span className="font-bold text-base">Analyse Financière & Risque</span>
          <span className="text-xs text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-full">Module 3</span>
        </div>
        <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          {time}
        </div>
      </header> */}

      {/* <TickerBar /> */}

      <main className="flex-1 p-4 lg:p-6 overflow-auto">
        <div className="grid xl:grid-cols-3 gap-4">

          {/* Technical Analysis — 2 cols */}
          <div className="xl:col-span-2">
            <SectionCard icon={Activity} title="Analyse Technique">
              <div className="flex items-center gap-2 mb-3">
                <select
                  value={techSymbol}
                  onChange={e => setTechSymbol(e.target.value)}
                  className="rounded-md border border-border bg-secondary/30 px-2 py-1 text-xs text-foreground focus:outline-none"
                >
                  {brvmStocks.map(s => <option key={s.symbol} value={s.symbol}>{s.symbol}</option>)}
                </select>
                <span className="text-xs text-muted-foreground">90 jours · Bollinger ± 2σ · RSI(14) · MACD(12,26,9)</span>
              </div>

              {/* Price + Bollinger */}
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="bandGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--chart-3)" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="var(--chart-3)" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="date" tick={{ fontSize: 9, fill: 'var(--muted-foreground)' }} interval={14} />
                    <YAxis tick={{ fontSize: 9, fill: 'var(--muted-foreground)' }} domain={['auto', 'auto']} />
                    <Tooltip {...tooltipStyle} />
                    <Area type="monotone" dataKey="upper" stroke="var(--chart-3)" fill="url(#bandGrad)" strokeWidth={1} dot={false} strokeDasharray="3 2" />
                    <Area type="monotone" dataKey="lower" stroke="var(--chart-3)" fill="url(#bandGrad)" strokeWidth={1} dot={false} strokeDasharray="3 2" />
                    <Line type="monotone" dataKey="mid" stroke="var(--chart-3)" strokeWidth={1} dot={false} strokeDasharray="4 2" />
                    <Area type="monotone" dataKey="close" name="Cours" stroke="var(--chart-1)" fill="url(#priceGrad)" strokeWidth={2} dot={false} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* RSI */}
              <div className="h-20 mt-1">
                <div className="text-[10px] text-muted-foreground mb-0.5">RSI (14)</div>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData} margin={{ top: 0, right: 4, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="date" tick={false} />
                    <YAxis tick={{ fontSize: 9, fill: 'var(--muted-foreground)' }} domain={[0, 100]} ticks={[30, 50, 70]} />
                    <Tooltip {...tooltipStyle} />
                    <ReferenceLine y={70} stroke="var(--destructive)" strokeDasharray="3 2" strokeWidth={1} />
                    <ReferenceLine y={30} stroke="var(--chart-2)" strokeDasharray="3 2" strokeWidth={1} />
                    <Line type="monotone" dataKey="rsi" name="RSI" stroke="var(--chart-4)" strokeWidth={1.5} dot={false} connectNulls />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* MACD */}
              <div className="h-20 mt-1">
                <div className="text-[10px] text-muted-foreground mb-0.5">MACD (12,26,9)</div>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData} margin={{ top: 0, right: 4, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="date" tick={false} />
                    <YAxis tick={{ fontSize: 9, fill: 'var(--muted-foreground)' }} />
                    <Tooltip {...tooltipStyle} />
                    <ReferenceLine y={0} stroke="var(--border)" strokeWidth={1} />
                    <Bar dataKey="histogram" name="Histogramme" fill="var(--chart-5)" opacity={0.6} />
                    <Line type="monotone" dataKey="macd" name="MACD" stroke="var(--chart-1)" strokeWidth={1.5} dot={false} connectNulls />
                    <Line type="monotone" dataKey="signal" name="Signal" stroke="var(--chart-2)" strokeWidth={1.5} dot={false} connectNulls strokeDasharray="4 2" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>
          </div>

          {/* Fundamentals — 1 col */}
          <div className="xl:col-span-1">
            <SectionCard icon={BarChart2} title="Analyse Fondamentale">
              <select
                value={fundSymbol}
                onChange={e => setFundSymbol(e.target.value)}
                className="w-full rounded-md border border-border bg-secondary/30 px-2 py-1 text-xs text-foreground focus:outline-none mb-3"
              >
                {companyProfiles.map(c => <option key={c.symbol} value={c.symbol}>{c.symbol} — {c.name}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-1.5 mb-3">
                {[
                  { label: 'Rev. (Md)', value: fundCompany.revenue.toFixed(1) },
                  { label: 'EBITDA%', value: `${fundCompany.ebitdaMargin.toFixed(1)}%` },
                  { label: 'Marge nette', value: `${fundCompany.netMargin.toFixed(1)}%` },
                  { label: 'Yield', value: `${fundCompany.dividendYield.toFixed(2)}%` },
                ].map(k => (
                  <div key={k.label} className="bg-secondary/30 rounded p-2 text-center">
                    <div className="text-[10px] text-muted-foreground">{k.label}</div>
                    <div className="text-sm font-bold font-mono text-foreground">{k.value}</div>
                  </div>
                ))}
              </div>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={fundCompany.revenueHistory} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="year" tick={{ fontSize: 9, fill: 'var(--muted-foreground)' }} />
                    <YAxis tick={{ fontSize: 9, fill: 'var(--muted-foreground)' }} />
                    <Tooltip {...tooltipStyle} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="revenue" name="Rev." fill="var(--chart-2)" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="ebitda" name="EBITDA" fill="var(--chart-1)" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="netIncome" name="Résultat" fill="var(--chart-4)" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>
          </div>

          {/* Ratios table — 2 cols */}
          <div className="xl:col-span-2">
            <SectionCard icon={BarChart2} title="Ratios financiers comparatifs">
              <div className="flex flex-wrap gap-1 mb-3">
                {sectors.map(s => (
                  <button
                    key={s}
                    onClick={() => setRatioSector(s)}
                    className={cn(
                      'px-2 py-0.5 rounded-full border text-[10px] font-medium transition-colors',
                      ratioSector === s
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'text-muted-foreground border-border hover:border-foreground/30'
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="overflow-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="text-[10px] text-muted-foreground font-semibold border-b border-border/40">
                      <th className="text-left py-1.5 px-2">Symbole</th>
                      <th className="text-right py-1.5 px-2">P/E</th>
                      <th className="text-right py-1.5 px-2">P/B</th>
                      <th className="text-right py-1.5 px-2">ROE%</th>
                      <th className="text-right py-1.5 px-2">EV/EBITDA</th>
                      <th className="text-right py-1.5 px-2">Yield%</th>
                      <th className="text-right py-1.5 px-2">Marge%</th>
                      <th className="text-right py-1.5 px-2">Det/FP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRatios.map(r => (
                      <tr key={r.symbol} className="border-b border-border/20 hover:bg-secondary/20 transition-colors">
                        <td className="py-1.5 px-2">
                          <div className="font-bold text-foreground">{r.symbol}</div>
                          <div className="text-[10px] text-muted-foreground">{r.sector}</div>
                        </td>
                        <td className="text-right py-1.5 px-2 font-mono">{r.per.toFixed(1)}</td>
                        <td className="text-right py-1.5 px-2 font-mono">{r.pbr.toFixed(2)}</td>
                        <td className={cn('text-right py-1.5 px-2 font-mono', r.roe >= 15 ? 'text-emerald-500' : r.roe >= 8 ? 'text-foreground' : 'text-red-400')}>
                          {r.roe.toFixed(1)}
                        </td>
                        <td className="text-right py-1.5 px-2 font-mono">{r.evEbitda.toFixed(1)}</td>
                        <td className={cn('text-right py-1.5 px-2 font-mono', r.dividendYield >= 3 ? 'text-emerald-500' : 'text-foreground')}>
                          {r.dividendYield.toFixed(2)}
                        </td>
                        <td className="text-right py-1.5 px-2 font-mono">{r.netMargin.toFixed(1)}</td>
                        <td className="text-right py-1.5 px-2 font-mono">{r.debtEquity.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>
          </div>

          {/* Risk Scorecard — 1 col */}
          <div className="xl:col-span-1">
            <SectionCard icon={ShieldAlert} title="Scorecard Risques Souverains">
              <div className="flex flex-wrap gap-1 mb-3">
                {countryRiskCards.map(c => (
                  <button
                    key={c.countryCode}
                    onClick={() => setRiskCountry(c.countryCode)}
                    className={cn(
                      'px-2 py-0.5 rounded-full border text-[10px] font-medium transition-colors',
                      riskCountry === c.countryCode
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'text-muted-foreground border-border hover:border-foreground/30'
                    )}
                  >
                    {c.countryCode}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3 mb-3">
                <div className={cn(
                  'w-14 h-14 rounded-full border-4 flex flex-col items-center justify-center shrink-0',
                  riskCard.overallScore <= 30 ? 'border-emerald-500 text-emerald-500' :
                  riskCard.overallScore <= 50 ? 'border-yellow-500 text-yellow-500' :
                  riskCard.overallScore <= 70 ? 'border-orange-500 text-orange-500' : 'border-red-400 text-red-400'
                )}>
                  <span className="font-bold text-base leading-none">{riskCard.overallScore}</span>
                </div>
                <div>
                  <div className="font-bold text-sm">{riskCard.country}</div>
                  <div className="flex gap-1 mt-1">
                    {[riskCard.ratingMoodys, riskCard.ratingSP, riskCard.ratingFitch].map((r, i) => (
                      <span key={i} className="bg-secondary/50 rounded px-1.5 py-0.5 text-[10px] font-mono font-semibold">{r}</span>
                    ))}
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">
                    Delta: <span className={cn('font-semibold', riskCard.overallScore <= riskCard.previousScore ? 'text-emerald-500' : 'text-red-400')}>
                      {riskCard.overallScore <= riskCard.previousScore ? '▼' : '▲'}{Math.abs(riskCard.overallScore - riskCard.previousScore)}
                    </span> vs mois préc.
                  </div>
                </div>
              </div>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="var(--border)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: 'var(--muted-foreground)' }} />
                    <Tooltip {...tooltipStyle} />
                    <Radar name={riskCard.country} dataKey="value" stroke="#f97316" fill="#f97316" fillOpacity={0.2} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>
          </div>

          {/* Sovereign ratings table — full width */}
          <div className="xl:col-span-3">
            <SectionCard icon={Globe} title="Notations souveraines UEMOA">
              <div className="overflow-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="text-[10px] text-muted-foreground font-semibold border-b border-border/40">
                      <th className="text-left py-1.5 px-3">Pays</th>
                      <th className="text-center py-1.5 px-3">Moody's</th>
                      <th className="text-center py-1.5 px-3">S&P</th>
                      <th className="text-center py-1.5 px-3">Fitch</th>
                      <th className="text-center py-1.5 px-3">Outlook</th>
                      <th className="text-center py-1.5 px-3">Score risque</th>
                      <th className="text-left py-1.5 px-3">Niveau</th>
                    </tr>
                  </thead>
                  <tbody>
                    {countryRiskCards.map(c => (
                      <tr key={c.countryCode} className="border-b border-border/20 hover:bg-secondary/20 transition-colors">
                        <td className="py-2 px-3">
                          <div className="font-bold text-foreground">{c.country}</div>
                          <div className="text-[10px] text-muted-foreground">{c.countryCode}</div>
                        </td>
                        <td className="text-center py-2 px-3 font-mono font-semibold">{c.ratingMoodys}</td>
                        <td className="text-center py-2 px-3 font-mono font-semibold">{c.ratingSP}</td>
                        <td className="text-center py-2 px-3 font-mono font-semibold">{c.ratingFitch}</td>
                        <td className="text-center py-2 px-3 text-muted-foreground">{c.outlook}</td>
                        <td className="text-center py-2 px-3">
                          <div className="inline-flex items-center gap-1.5">
                            <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                              <div
                                className={cn('h-full rounded-full', {
                                  'bg-emerald-500': c.overallScore <= 30,
                                  'bg-yellow-500': c.overallScore > 30 && c.overallScore <= 50,
                                  'bg-orange-500': c.overallScore > 50 && c.overallScore <= 70,
                                  'bg-red-400': c.overallScore > 70,
                                })}
                                style={{ width: `${c.overallScore}%` }}
                              />
                            </div>
                            <span className={cn('font-mono font-bold', riskColor(c.overallScore))}>{c.overallScore}</span>
                          </div>
                        </td>
                        <td className="py-2 px-3">
                          <span className={cn('text-[10px] font-semibold rounded px-1.5 py-0.5', {
                            'bg-emerald-500/20 text-emerald-500': c.overallScore <= 30,
                            'bg-yellow-500/20 text-yellow-500': c.overallScore > 30 && c.overallScore <= 50,
                            'bg-orange-500/20 text-orange-500': c.overallScore > 50 && c.overallScore <= 70,
                            'bg-red-400/20 text-red-400': c.overallScore > 70,
                          })}>
                            {c.overallScore <= 30 ? 'Faible' : c.overallScore <= 50 ? 'Modéré' : c.overallScore <= 70 ? 'Élevé' : 'Critique'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>
          </div>

        </div>
      </main>

      <footer className="h-10 border-t border-border/30 bg-card/30 backdrop-blur-sm flex items-center px-6 gap-4 shrink-0">
        <span className="text-xs text-muted-foreground">Bloomfield Intelligence • Module 3 — Analyse Financière & Risque</span>
        <span className="ml-auto text-xs text-muted-foreground">Données simulées — maquette de présentation</span>
      </footer>
    </div>
  )
}
