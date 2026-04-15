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
import { ModuleLayout, ModuleSection, SectionDef } from '@/components/dashboard/module-layout'
import { ResizablePanesGrid } from '@/components/dashboard/resizable-panes'

const SECTIONS: SectionDef[] = [
  { id: 'kpis',       label: 'Indicateurs clés',      icon: BarChart2 },
  { id: 'indicators', label: 'Indicateurs macro',      icon: Globe },
  { id: 'rankings',   label: 'Classement régional',    icon: Map },
  { id: 'finances',   label: 'Finances publiques',     icon: Landmark },
  { id: 'trade',      label: 'Commerce extérieur',     icon: ShoppingCart },
]

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

      <ModuleLayout pageKey="macro" sections={SECTIONS} mainClassName="overflow-hidden">
        <div className="h-full flex flex-col p-4 gap-4">

        <div className="shrink-0">
        <ModuleSection pageKey="macro" id="kpis" resizable={false}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {macroIndicators.slice(0, 4).map(ind => (
              <div key={ind.country} className="rounded-xl border border-border/50 bg-card/80 p-4">
                <div className="text-xs text-muted-foreground mb-1">{ind.country}</div>
                <div className="text-sm font-bold text-foreground">PIB: <span className="font-mono text-emerald-500">{ind.gdpGrowth.toFixed(1)}%</span></div>
                <div className="text-xs text-muted-foreground mt-0.5">Inflation: <span className="font-mono text-foreground">{ind.inflation.toFixed(1)}%</span></div>
              </div>
            ))}
          </div>
        </ModuleSection>
        </div>

        <ResizablePanesGrid
          pageKey="macro"
          rows={[
            { id: 'macro-row-1', cells: [
              { id: 'indicators', initialFlex: 2, content: (
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
              )},
              { id: 'rankings', initialFlex: 1, content: (
                <SectionCard icon={Map} title="Classement régional">
                  <div className="space-y-2">
                    {regionalRankings.map(r => (
                      <div key={r.countryCode} className="flex items-center gap-2 p-2 rounded-lg bg-secondary/20">
                        <span className="text-base font-black text-muted-foreground/40 w-5 shrink-0">#{r.rank}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-foreground">{r.country}</div>
                          <div className="h-1.5 bg-secondary rounded-full overflow-hidden mt-1">
                            <div className="h-full rounded-full bg-primary" style={{ width: `${r.compositeScore}%` }} />
                          </div>
                        </div>
                        <span className="font-mono text-sm font-bold text-foreground shrink-0">{r.compositeScore.toFixed(1)}</span>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              )},
            ]},
            { id: 'macro-row-2', cells: [
              { id: 'finances', initialFlex: 2, content: (
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
              )},
              { id: 'trade', initialFlex: 1, content: (
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
              )},
            ]},
          ]}
        />

        </div>
      </ModuleLayout>

      <footer className="h-10 border-t border-border/30 bg-card/30 backdrop-blur-sm flex items-center px-6 gap-4 shrink-0">
        <span className="text-xs text-muted-foreground">Bloomfield Intelligence • Module 4 — Données Macroéconomiques</span>
        <span className="ml-auto text-xs text-muted-foreground">Données simulées — maquette de présentation</span>
      </footer>
    </div>
  )
}
