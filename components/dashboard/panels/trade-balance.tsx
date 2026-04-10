'use client'

import { useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts'
import { tradeData } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

export function TradeBalancePanel() {
  const [countryIdx, setCountryIdx] = useState(0)

  const country = tradeData[countryIdx]

  const balanceData = country.products.map(p => ({
    name: p.product.length > 14 ? p.product.slice(0, 14) + '…' : p.product,
    exports: p.exports,
    imports: -p.imports,
    balance: p.balance,
    yoy: p.yoyChange,
  }))

  const summary = [
    { label: 'Exportations', value: country.totalExports, color: 'text-emerald-500' },
    { label: 'Importations', value: country.totalImports, color: 'text-destructive' },
    { label: 'Solde commercial', value: country.tradeBalance, color: country.tradeBalance >= 0 ? 'text-emerald-500' : 'text-destructive' },
  ]

  return (
    <div className="flex flex-col h-full gap-3">
      {/* Country selector */}
      <div className="flex gap-1">
        {tradeData.map((c, i) => (
          <button
            key={c.countryCode}
            onClick={() => setCountryIdx(i)}
            className={cn(
              'px-3 py-1 rounded-lg text-xs font-medium transition-colors border',
              i === countryIdx
                ? 'bg-primary text-primary-foreground border-primary'
                : 'text-muted-foreground border-border hover:border-foreground/30'
            )}
          >
            {c.countryCode}
          </button>
        ))}
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-3 gap-2">
        {summary.map(s => (
          <div key={s.label} className="bg-secondary/30 rounded-lg p-2 text-center">
            <div className="text-[10px] text-muted-foreground">{s.label}</div>
            <div className={cn('text-sm font-mono font-bold', s.color)}>
              {s.value >= 0 ? '' : '-'}{Math.abs(s.value).toLocaleString('fr-FR')}
            </div>
            <div className="text-[10px] text-muted-foreground">Mrd XOF</div>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="flex-1 min-h-0">
        <div className="text-[10px] text-muted-foreground mb-1">Produits principaux – Mrd XOF</div>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={balanceData}
            layout="vertical"
            margin={{ top: 0, right: 8, left: 0, bottom: 0 }}
            barSize={8}
          >
            <XAxis type="number" tick={{ fontSize: 9 }} tickFormatter={v => `${Math.abs(v)}`} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 9 }} width={90} />
            <ReferenceLine x={0} stroke="var(--border)" />
            <Tooltip
              formatter={(value: number, name: string) => [
                `${Math.abs(value).toLocaleString('fr-FR')} Mrd XOF`,
                name === 'exports' ? 'Exportations' : 'Importations',
              ]}
              contentStyle={{ fontSize: 11, backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
            />
            <Bar dataKey="exports" name="exports" radius={[0, 4, 4, 0]}>
              {balanceData.map((_, i) => (
                <Cell key={i} fill="#10b981" />
              ))}
            </Bar>
            <Bar dataKey="imports" name="imports" radius={[0, 4, 4, 0]}>
              {balanceData.map((_, i) => (
                <Cell key={i} fill="#ef4444" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* YoY variations */}
      <div className="border-t border-border/50 pt-2 grid grid-cols-2 gap-1">
        {country.products.map(p => (
          <div key={p.product} className="flex items-center justify-between px-2 py-0.5 bg-secondary/20 rounded text-[10px]">
            <span className="text-muted-foreground truncate">{p.product.split(' ')[0]}</span>
            <span className={cn('font-mono font-semibold', p.yoyChange >= 0 ? 'text-emerald-500' : 'text-destructive')}>
              {p.yoyChange >= 0 ? '+' : ''}{p.yoyChange.toFixed(1)}% a/a
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
