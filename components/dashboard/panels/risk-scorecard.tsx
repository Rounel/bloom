'use client'

import { useState } from 'react'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, Tooltip, ResponsiveContainer,
} from 'recharts'
import { countryRiskCards } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

function riskColor(score: number) {
  if (score <= 30) return 'text-emerald-500'
  if (score <= 50) return 'text-yellow-500'
  if (score <= 70) return 'text-orange-500'
  return 'text-red-400'
}

function riskBgColor(score: number) {
  if (score <= 30) return 'border-emerald-500 text-emerald-500'
  if (score <= 50) return 'border-yellow-500 text-yellow-500'
  if (score <= 70) return 'border-orange-500 text-orange-500'
  return 'border-red-400 text-red-400'
}

function riskLabel(score: number) {
  if (score <= 30) return 'Faible'
  if (score <= 50) return 'Modéré'
  if (score <= 70) return 'Élevé'
  return 'Critique'
}

export function RiskScorecardPanel() {
  const [selectedCode, setSelectedCode] = useState(countryRiskCards[0].countryCode)

  const card = countryRiskCards.find(c => c.countryCode === selectedCode) ?? countryRiskCards[0]

  const radarData = card.dimensions.map(d => ({
    subject: d.label.length > 10 ? d.label.slice(0, 10) : d.label,
    value: d.score,
  }))

  return (
    <div className="flex flex-col h-full gap-2 text-xs">
      {/* Country selector */}
      <div className="flex flex-wrap gap-1">
        {countryRiskCards.map(c => (
          <button
            key={c.countryCode}
            onClick={() => setSelectedCode(c.countryCode)}
            className={cn(
              'px-2 py-0.5 rounded-full border text-[10px] font-medium transition-colors',
              selectedCode === c.countryCode
                ? 'bg-primary text-primary-foreground border-primary'
                : 'text-muted-foreground border-border hover:border-foreground/30'
            )}
          >
            {c.countryCode}
          </button>
        ))}
      </div>

      {/* Score + agencies */}
      <div className="flex items-center gap-3">
        {/* Circular score */}
        <div className={cn(
          'w-16 h-16 rounded-full border-4 flex flex-col items-center justify-center flex-shrink-0',
          riskBgColor(card.overallScore)
        )}>
          <span className="font-bold text-lg leading-none">{card.overallScore}</span>
          <span className="text-[9px] font-medium">{riskLabel(card.overallScore)}</span>
        </div>
        <div>
          <div className="font-bold text-sm text-foreground">{card.country}</div>
          <div className="text-[10px] text-muted-foreground mb-1">Outlook: <span className="font-medium text-foreground">{card.outlook}</span></div>
          <div className="flex gap-1.5">
            {[
              { agency: "Moody's", rating: card.ratingMoodys },
              { agency: 'S&P', rating: card.ratingSP },
              { agency: 'Fitch', rating: card.ratingFitch },
            ].map(a => (
              <span key={a.agency} className="bg-secondary/50 rounded px-1.5 py-0.5 text-[10px]">
                <span className="text-muted-foreground">{a.agency} </span>
                <span className="font-mono font-semibold text-foreground">{a.rating}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Risk dimensions bars */}
      <div className="space-y-1.5">
        {card.dimensions.map(d => (
          <div key={d.label}>
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-[10px] text-muted-foreground">{d.label}</span>
              <span className={cn('text-[10px] font-semibold', riskColor(d.score))}>
                {riskLabel(d.score)} ({d.score})
              </span>
            </div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className={cn('h-full rounded-full transition-all', {
                  'bg-emerald-500': d.score <= 30,
                  'bg-yellow-500': d.score > 30 && d.score <= 50,
                  'bg-orange-500': d.score > 50 && d.score <= 70,
                  'bg-red-400': d.score > 70,
                })}
                style={{ width: `${d.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Radar chart */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData}>
            <PolarGrid stroke="var(--border)" />
            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: 'var(--muted-foreground)' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '11px',
              }}
            />
            <Radar
              name={card.country}
              dataKey="value"
              stroke="#f97316"
              fill="#f97316"
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
