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
import { PanelGrid, PanelRow, downloadCSV } from '@/components/dashboard/panel-grid'
import { useModuleSectionsStore } from '@/lib/module-sections-store'

const SECTIONS: SectionDef[] = [
  { id: 'kpis',       label: 'Indicateurs clés',      icon: BarChart2 },
  { id: 'indicators', label: 'Indicateurs macro',      icon: Globe },
  { id: 'rankings',   label: 'Classement régional',    icon: Map },
  { id: 'finances',   label: 'Finances publiques',     icon: Landmark },
  { id: 'trade',      label: 'Commerce extérieur',     icon: ShoppingCart },
]

export default function MacroPage() {
  const [time, setTime] = useState('')
  const toggleSection = useModuleSectionsStore(s => s.toggle)

  useEffect(() => {
    setTime(new Date().toLocaleTimeString('fr-FR'))
    const id = setInterval(() => setTime(new Date().toLocaleTimeString('fr-FR')), 1000)
    return () => clearInterval(id)
  }, [])

  const panelRows: PanelRow[] = [
    {
      id: 'macro-row-1',
      cells: [
        {
          id: 'indicators',
          title: 'Indicateurs macroéconomiques UEMOA',
          icon: Globe,
          initialFlex: 2,
          csvExport: () => {
            const headers = ['Pays', 'PIB Growth', 'Inflation', 'Chômage', 'Solde courant', 'Réserves (Md)']
            const rows = macroIndicators.map(ind => [ind.country, ind.gdpGrowth.toFixed(1), ind.inflation.toFixed(1), ind.unemployment.toFixed(1), ind.currentAccount.toFixed(1), (ind.reserves / 1000).toFixed(1)])
            downloadCSV(headers, rows, `bloomfield-indicators-${new Date().toISOString().slice(0, 10)}.csv`)
          },
          content: (
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
          ),
        },
        {
          id: 'rankings',
          title: 'Classement régional',
          icon: Map,
          initialFlex: 1,
          csvExport: () => {
            const headers = ['Rang', 'Pays', 'Code', 'Score composite']
            const rows = regionalRankings.map(r => [r.rank, r.country, r.countryCode, r.compositeScore.toFixed(1)])
            downloadCSV(headers, rows, `bloomfield-rankings-${new Date().toISOString().slice(0, 10)}.csv`)
          },
          content: (
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
          ),
        },
      ],
    },
    {
      id: 'macro-row-2',
      cells: [
        {
          id: 'finances',
          title: 'Finances publiques',
          icon: Landmark,
          initialFlex: 2,
          csvExport: () => {
            const headers = ['Pays', 'Dette/PIB', 'Déficit', 'Service dette', 'Solde primaire']
            const rows = publicFinances.map(pf => [pf.country, pf.debtToGDP.toFixed(1), pf.budgetDeficit.toFixed(1), pf.debtService.toFixed(1), pf.primaryBalance.toFixed(1)])
            downloadCSV(headers, rows, `bloomfield-finances-${new Date().toISOString().slice(0, 10)}.csv`)
          },
          content: (
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
          ),
        },
        {
          id: 'trade',
          title: 'Commerce extérieur',
          icon: ShoppingCart,
          initialFlex: 1,
          csvExport: () => {
            const headers = ['Pays', 'Balance commerciale', 'Exportations', 'Importations']
            const rows = tradeData.slice(0, 5).map(tb => [tb.country, tb.tradeBalance, tb.totalExports, tb.totalImports])
            downloadCSV(headers, rows, `bloomfield-trade-${new Date().toISOString().slice(0, 10)}.csv`)
          },
          content: (
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
          ),
        },
      ],
    },
  ]

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">

      <ModuleLayout pageKey="macro" sections={SECTIONS} mainClassName="overflow-hidden" title="Données Macroéconomiques">
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

        <PanelGrid
          rows={panelRows}
          pageKey="macro"
          onHide={id => toggleSection('macro', id)}
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
