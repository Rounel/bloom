'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ChevronLeft, Globe, BarChart2, Landmark, ShoppingCart, Map, Calendar, Clock,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  brvmStocks, marketIndices, macroIndicators, publicFinances, tradeData, regionalRankings,
} from '@/lib/mock-data'

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

function SectionCard({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-secondary/20">
        <Icon className="w-4 h-4 text-primary" />
        <span className="text-sm font-semibold">{title}</span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

export default function MacroPage() {
  const [time, setTime] = useState('')
  useEffect(() => {
    setTime(new Date().toLocaleTimeString('fr-FR'))
    const id = setInterval(() => setTime(new Date().toLocaleTimeString('fr-FR')), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <header className="h-14 border-b flex items-center px-6 bg-card/50 backdrop-blur-sm gap-4 shrink-0">
        <Link href="/modules" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="w-4 h-4" />
          <span className="text-sm">Modules</span>
        </Link>
        <div className="h-5 w-px bg-border/50" />
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary" />
          <span className="font-bold text-base">Données Macroéconomiques</span>
          <span className="text-xs text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-full">Module 4</span>
        </div>
        <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          {time}
        </div>
      </header>

      <TickerBar />

      <main className="flex-1 p-4 lg:p-6 overflow-auto">
        {/* Top indicators */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {macroIndicators.slice(0, 4).map(ind => (
            <div key={ind.country} className="rounded-xl border border-border/50 bg-card/80 p-4">
              <div className="text-xs text-muted-foreground mb-1">{ind.country}</div>
              <div className="text-sm font-bold text-foreground">PIB: <span className="font-mono text-emerald-500">{ind.gdpGrowth.toFixed(1)}%</span></div>
              <div className="text-xs text-muted-foreground mt-0.5">Inflation: <span className="font-mono text-foreground">{ind.inflation.toFixed(1)}%</span></div>
            </div>
          ))}
        </div>

        <div className="grid xl:grid-cols-3 md:grid-cols-2 gap-4">
          {/* Macro indicators table */}
          <div className="xl:col-span-2">
            <SectionCard icon={Globe} title="Indicateurs macroéconomiques UEMOA">
              <div className="overflow-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="text-[10px] text-muted-foreground font-semibold border-b border-border/40">
                      <th className="text-left py-1.5 px-2">Pays</th>
                      <th className="text-right py-1.5 px-2">PIB Growth</th>
                      <th className="text-right py-1.5 px-2">Inflation</th>
                      <th className="text-right py-1.5 px-2">Chômage</th>
                      <th className="text-right py-1.5 px-2">Déficit</th>
                      <th className="text-right py-1.5 px-2">Réserves</th>
                    </tr>
                  </thead>
                  <tbody>
                    {macroIndicators.map(ind => (
                      <tr key={ind.country} className="border-b border-border/20 hover:bg-secondary/20">
                        <td className="py-2 px-2 font-semibold text-foreground">{ind.country}</td>
                        <td className={cn('text-right py-2 px-2 font-mono', ind.gdpGrowth >= 4 ? 'text-emerald-500' : ind.gdpGrowth >= 2 ? 'text-foreground' : 'text-red-400')}>
                          {ind.gdpGrowth.toFixed(1)}%
                        </td>
                        <td className={cn('text-right py-2 px-2 font-mono', ind.inflation <= 5 ? 'text-foreground' : ind.inflation <= 8 ? 'text-yellow-500' : 'text-red-400')}>
                          {ind.inflation.toFixed(1)}%
                        </td>
                        <td className="text-right py-2 px-2 font-mono text-muted-foreground">{ind.unemployment.toFixed(1)}%</td>
                        <td className={cn('text-right py-2 px-2 font-mono', ind.currentAccount <= -3 ? 'text-red-400' : 'text-foreground')}>
                          {ind.currentAccount.toFixed(1)}%
                        </td>
                        <td className="text-right py-2 px-2 font-mono text-muted-foreground">{(ind.reserves / 1000).toFixed(1)} Md</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>
          </div>

          {/* Regional rankings */}
          <div className="xl:col-span-1">
            <SectionCard icon={Map} title="Classement régional">
              <div className="space-y-2">
                {regionalRankings.map(r => (
                  <div key={r.countryCode} className="flex items-center gap-2 p-2 rounded-lg bg-secondary/20">
                    <span className="text-base font-black text-muted-foreground/40 w-5 shrink-0">#{r.rank}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-foreground">{r.country}</div>
                      <div className="h-1.5 bg-secondary rounded-full overflow-hidden mt-1">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${r.compositeScore}%` }}
                        />
                      </div>
                    </div>
                    <span className="font-mono text-sm font-bold text-foreground shrink-0">{r.compositeScore.toFixed(1)}</span>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          {/* Public Finances */}
          <div className="xl:col-span-2">
            <SectionCard icon={Landmark} title="Finances publiques">
              <div className="overflow-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="text-[10px] text-muted-foreground font-semibold border-b border-border/40">
                      <th className="text-left py-1.5 px-2">Pays</th>
                      <th className="text-right py-1.5 px-2">Dette/PIB</th>
                      <th className="text-right py-1.5 px-2">Déficit</th>
                      <th className="text-right py-1.5 px-2">Service dette</th>
                      <th className="text-right py-1.5 px-2">Solde primaire</th>
                    </tr>
                  </thead>
                  <tbody>
                    {publicFinances.map(pf => (
                      <tr key={pf.country} className="border-b border-border/20 hover:bg-secondary/20">
                        <td className="py-2 px-2 font-semibold text-foreground">{pf.country}</td>
                        <td className={cn('text-right py-2 px-2 font-mono', pf.debtToGDP <= 50 ? 'text-emerald-500' : pf.debtToGDP <= 70 ? 'text-yellow-500' : 'text-red-400')}>
                          {pf.debtToGDP.toFixed(1)}%
                        </td>
                        <td className={cn('text-right py-2 px-2 font-mono', pf.budgetDeficit <= 3 ? 'text-foreground' : 'text-red-400')}>
                          {pf.budgetDeficit.toFixed(1)}%
                        </td>
                        <td className="text-right py-2 px-2 font-mono text-muted-foreground">{pf.debtService.toFixed(1)}%</td>
                        <td className={cn('text-right py-2 px-2 font-mono', pf.primaryBalance >= 0 ? 'text-emerald-500' : 'text-red-400')}>
                          {pf.primaryBalance >= 0 ? '+' : ''}{pf.primaryBalance.toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>
          </div>

          {/* Trade balance */}
          <div className="xl:col-span-1">
            <SectionCard icon={ShoppingCart} title="Commerce extérieur">
              <div className="space-y-2">
                {tradeData.slice(0, 5).map(tb => (
                  <div key={tb.country} className="p-2 rounded-lg bg-secondary/20">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-foreground">{tb.country}</span>
                      <span className={cn('text-xs font-mono font-semibold', tb.tradeBalance >= 0 ? 'text-emerald-500' : 'text-red-400')}>
                        {tb.tradeBalance >= 0 ? '+' : ''}{tb.tradeBalance.toLocaleString('fr-FR')} Md
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-[10px] text-muted-foreground">
                      <span>Exp: <span className="font-mono text-foreground">{tb.totalExports.toLocaleString('fr-FR')}</span></span>
                      <span>Imp: <span className="font-mono text-foreground">{tb.totalImports.toLocaleString('fr-FR')}</span></span>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        </div>

        {/* Link to terminal */}
        <div className="mt-4 rounded-xl border border-border/50 bg-card/80 p-4 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-foreground">Analyse approfondie disponible dans le Terminal</div>
            <div className="text-xs text-muted-foreground mt-0.5">Graphiques interactifs, calendrier économique et analyse régionale en panels</div>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Ouvrir le Terminal →
          </Link>
        </div>
      </main>

      <footer className="h-10 border-t border-border/30 bg-card/30 backdrop-blur-sm flex items-center px-6 gap-4 shrink-0">
        <span className="text-xs text-muted-foreground">Bloomfield Intelligence • Module 4 — Données Macroéconomiques</span>
        <span className="ml-auto text-xs text-muted-foreground">Données simulées — maquette de présentation</span>
      </footer>
    </div>
  )
}
