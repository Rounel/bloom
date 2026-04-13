'use client'

import { useState, useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import { financialRatios } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const SECTORS = ['Tous', ...Array.from(new Set(financialRatios.map(r => r.sector)))]

const tooltipStyle = {
  contentStyle: {
    backgroundColor: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    fontSize: '11px',
  },
}

export function FinancialRatiosPanel() {
  const [sector, setSector] = useState('Tous')
  const [expandedSymbol, setExpandedSymbol] = useState<string | null>(null)

  const filtered = useMemo(
    () => sector === 'Tous' ? financialRatios : financialRatios.filter(r => r.sector === sector),
    [sector]
  )

  const averages = useMemo(() => ({
    per: +(filtered.reduce((s, r) => s + r.per, 0) / filtered.length).toFixed(1),
    dividendYield: +(filtered.reduce((s, r) => s + r.dividendYield, 0) / filtered.length).toFixed(2),
    roe: +(filtered.reduce((s, r) => s + r.roe, 0) / filtered.length).toFixed(1),
  }), [filtered])

  const expanded = expandedSymbol ? financialRatios.find(r => r.symbol === expandedSymbol) : null

  return (
    <div className="flex flex-col h-full gap-2 text-xs">
      {/* Sector pills */}
      <div className="flex flex-wrap gap-1">
        {SECTORS.map(s => (
          <button
            key={s}
            onClick={() => setSector(s)}
            className={cn(
              'px-2 py-0.5 rounded-full border text-[10px] font-medium transition-colors',
              sector === s
                ? 'bg-primary text-primary-foreground border-primary'
                : 'text-muted-foreground border-border hover:border-foreground/30'
            )}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Expanded peer chart */}
      {expanded && (
        <div className="bg-secondary/20 rounded-lg p-2">
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-foreground">{expanded.symbol} — comparaison sectorielle</span>
            <button onClick={() => setExpandedSymbol(null)} className="text-muted-foreground hover:text-foreground">✕</button>
          </div>
          <div className="h-20">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: 'P/E', val: expanded.per },
                  { name: 'P/B', val: expanded.pbr },
                  { name: 'ROE%', val: expanded.roe },
                  { name: 'EV/EBITDA', val: expanded.evEbitda },
                  { name: 'Yield%', val: expanded.dividendYield },
                ]}
                margin={{ top: 2, right: 4, left: -30, bottom: 0 }}
              >
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: 'var(--muted-foreground)' }} />
                <YAxis tick={{ fontSize: 9, fill: 'var(--muted-foreground)' }} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="val" radius={[2, 2, 0, 0]}>
                  {['P/E', 'P/B', 'ROE%', 'EV/EBITDA', 'Yield%'].map((_, i) => (
                    <Cell key={i} fill={`var(--chart-${(i % 5) + 1})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="flex-1 overflow-auto min-h-0">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 bg-card z-10">
            <tr className="text-[10px] text-muted-foreground font-semibold">
              <th className="text-left py-1 px-1">Symbole</th>
              <th className="text-right py-1 px-1">P/E</th>
              <th className="text-right py-1 px-1">P/B</th>
              <th className="text-right py-1 px-1">ROE%</th>
              <th className="text-right py-1 px-1">EV/EBITDA</th>
              <th className="text-right py-1 px-1">Yield%</th>
              <th className="text-right py-1 px-1">Marge%</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr
                key={r.symbol}
                onClick={() => setExpandedSymbol(expandedSymbol === r.symbol ? null : r.symbol)}
                className={cn(
                  'border-t border-border/30 cursor-pointer transition-colors hover:bg-secondary/30',
                  expandedSymbol === r.symbol && 'bg-secondary/40'
                )}
              >
                <td className="py-1 px-1">
                  <div className="font-semibold text-foreground">{r.symbol}</div>
                  <div className="text-[9px] text-muted-foreground truncate max-w-[70px]">{r.sector}</div>
                </td>
                <td className="text-right py-1 px-1 font-mono text-foreground">{r.per.toFixed(1)}</td>
                <td className="text-right py-1 px-1 font-mono text-foreground">{r.pbr.toFixed(2)}</td>
                <td className={cn('text-right py-1 px-1 font-mono', r.roe >= 15 ? 'text-emerald-500' : r.roe >= 8 ? 'text-foreground' : 'text-red-400')}>
                  {r.roe.toFixed(1)}
                </td>
                <td className="text-right py-1 px-1 font-mono text-foreground">{r.evEbitda.toFixed(1)}</td>
                <td className={cn('text-right py-1 px-1 font-mono', r.dividendYield >= 3 ? 'text-emerald-500' : 'text-foreground')}>
                  {r.dividendYield.toFixed(2)}
                </td>
                <td className="text-right py-1 px-1 font-mono text-foreground">{r.netMargin.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer averages */}
      <div className="border-t border-border/40 pt-1.5 flex gap-4 text-[10px]">
        <span className="text-muted-foreground">Moy. secteur:</span>
        <span>P/E <span className="font-mono font-semibold text-foreground">{averages.per}</span></span>
        <span>Yield <span className="font-mono font-semibold text-emerald-500">{averages.dividendYield}%</span></span>
        <span>ROE <span className="font-mono font-semibold text-foreground">{averages.roe}%</span></span>
      </div>
    </div>
  )
}
