'use client'

import { useState } from 'react'
import { commodities } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

type Period = 'day' | 'week' | 'month'

const CATEGORIES = ['Tous', 'Agricole', 'Énergie', 'Métaux', 'Minéraux']

export function CommoditiesPanel() {
  const [period, setPeriod] = useState<Period>('day')
  const [category, setCategory] = useState('Tous')

  const filtered = category === 'Tous'
    ? commodities
    : commodities.filter(c => c.category === category)

  function getChange(c: (typeof commodities)[0]) {
    if (period === 'week')  return { v: c.weekChange,  pct: true }
    if (period === 'month') return { v: c.monthChange, pct: true }
    return { v: c.changePercent, pct: true }
  }

  const periods: { key: Period; label: string }[] = [
    { key: 'day',   label: 'Jour' },
    { key: 'week',  label: 'Sem.' },
    { key: 'month', label: 'Mois' },
  ]

  return (
    <div className="flex flex-col h-full gap-3">
      {/* Controls */}
      <div className="flex items-center justify-between gap-2">
        {/* Category pills */}
        <div className="flex gap-1 flex-wrap">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                'px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors border',
                category === cat
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'text-muted-foreground border-border hover:border-foreground/30'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
        {/* Period */}
        <div className="flex gap-0.5 bg-secondary/30 rounded-lg p-0.5 shrink-0">
          {periods.map(p => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={cn(
                'px-2 py-0.5 text-[10px] font-medium rounded-md transition-colors',
                period === p.key
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border/50">
              <th className="text-left py-1.5 px-2 text-muted-foreground font-medium">Matière</th>
              <th className="text-right py-1.5 px-2 text-muted-foreground font-medium">Prix</th>
              <th className="text-right py-1.5 px-2 text-muted-foreground font-medium">Var.</th>
              <th className="text-left py-1.5 px-2 text-muted-foreground font-medium hidden sm:table-cell">Unité</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => {
              const { v } = getChange(c)
              const isPos = v >= 0
              const barMax = Math.max(...filtered.map(x => Math.abs(getChange(x).v)))
              const barPct = barMax ? (Math.abs(v) / barMax) * 100 : 0

              return (
                <tr key={c.symbol} className="border-b border-border/30 hover:bg-secondary/20 transition-colors">
                  <td className="py-2 px-2">
                    <div className="font-semibold text-foreground">{c.name}</div>
                    <div className="text-[10px] text-muted-foreground">{c.category}</div>
                  </td>
                  <td className="py-2 px-2 text-right font-mono font-semibold text-foreground">
                    {c.price.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
                  </td>
                  <td className="py-2 px-2 text-right">
                    <div className={cn('font-mono font-semibold', isPos ? 'text-emerald-500' : 'text-destructive')}>
                      {isPos ? '+' : ''}{v.toFixed(2)}%
                    </div>
                    <div className="flex items-center justify-end mt-0.5">
                      <div className="w-12 h-1 bg-secondary rounded-full overflow-hidden">
                        <div
                          className={cn('h-full rounded-full', isPos ? 'bg-emerald-500' : 'bg-destructive')}
                          style={{ width: `${barPct}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-2 px-2 text-[10px] text-muted-foreground hidden sm:table-cell">{c.unit}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
