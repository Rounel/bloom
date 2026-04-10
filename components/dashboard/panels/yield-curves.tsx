'use client'

import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { sovereignYields } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const MATURITIES = ['3M', '6M', '1A', '2A', '5A', '10A']

// Reshape data: one row per maturity, columns = countries
function buildChartData() {
  return MATURITIES.map(mat => {
    const row: Record<string, string | number> = { maturity: mat }
    sovereignYields.forEach(c => {
      const pt = c.yields.find(y => y.maturity === mat)
      if (pt) row[c.code] = pt.rate
    })
    return row
  })
}

export function YieldCurvesPanel() {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(sovereignYields.map(c => c.code))
  )

  const data = buildChartData()

  function toggle(code: string) {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(code)) { if (next.size > 1) next.delete(code) }
      else next.add(code)
      return next
    })
  }

  // Spread table: 10Y – 3M for each country
  const spreads = sovereignYields.map(c => {
    const y3m  = c.yields.find(y => y.maturity === '3M')?.rate ?? 0
    const y10y = c.yields.find(y => y.maturity === '10A')?.rate ?? 0
    return { code: c.code, country: c.country, spread: +(y10y - y3m).toFixed(2), color: c.color }
  })

  return (
    <div className="flex flex-col h-full gap-3">
      {/* Country toggles */}
      <div className="flex flex-wrap gap-1.5">
        {sovereignYields.map(c => (
          <button
            key={c.code}
            onClick={() => toggle(c.code)}
            className={cn(
              'flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border transition-all',
              selected.has(c.code)
                ? 'text-white border-transparent'
                : 'bg-transparent text-muted-foreground border-border'
            )}
            style={selected.has(c.code) ? { backgroundColor: c.color, borderColor: c.color } : {}}
          >
            {c.code} – {c.country.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <XAxis dataKey="maturity" tick={{ fontSize: 10 }} />
            <YAxis
              tick={{ fontSize: 10 }}
              tickFormatter={v => `${v}%`}
              domain={['auto', 'auto']}
            />
            <Tooltip
              formatter={(value: number, name: string) => [`${value.toFixed(2)}%`, name]}
              contentStyle={{ fontSize: 11, backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
            />
            {sovereignYields
              .filter(c => selected.has(c.code))
              .map(c => (
                <Line
                  key={c.code}
                  type="monotone"
                  dataKey={c.code}
                  stroke={c.color}
                  strokeWidth={2}
                  dot={{ r: 3, fill: c.color }}
                  activeDot={{ r: 5 }}
                  name={c.country}
                />
              ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Spread table */}
      <div className="border-t border-border/50 pt-2">
        <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
          Spread 10A – 3M
        </div>
        <div className="grid grid-cols-4 gap-1">
          {spreads.map(s => (
            <div key={s.code} className="bg-secondary/30 rounded px-2 py-1">
              <div className="text-[10px] font-bold" style={{ color: s.color }}>{s.code}</div>
              <div className="text-xs font-mono text-foreground">{s.spread}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
