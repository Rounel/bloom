'use client'

import { useState } from 'react'
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { regionalRankings } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react'

type View = 'ranking' | 'radar'

function TrendIcon({ trend }: { trend: 'up' | 'stable' | 'down' }) {
  if (trend === 'up')     return <TrendingUp   className="w-3.5 h-3.5 text-emerald-500" />
  if (trend === 'down')   return <TrendingDown  className="w-3.5 h-3.5 text-destructive" />
  return <Minus className="w-3.5 h-3.5 text-muted-foreground" />
}

function ScoreBar({ value }: { value: number }) {
  const color = value >= 70 ? 'bg-emerald-500' : value >= 50 ? 'bg-yellow-500' : 'bg-destructive'
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
        <div className={cn('h-full rounded-full transition-all', color)} style={{ width: `${value}%` }} />
      </div>
      <span className="text-[10px] font-mono w-7 text-right text-foreground">{value}</span>
    </div>
  )
}

export function RegionalAnalysisPanel() {
  const [view, setView] = useState<View>('ranking')
  const [selectedCountry, setSelectedCountry] = useState(regionalRankings[0])

  const radarData = [
    { subject: 'Stabilité',  value: selectedCountry.stabilityScore },
    { subject: 'Croissance', value: selectedCountry.growthScore },
    { subject: 'Fiscal',     value: selectedCountry.fiscalScore },
    { subject: 'Monétaire',  value: selectedCountry.monetaryScore },
  ]

  return (
    <div className="flex flex-col h-full gap-3">
      {/* View toggle */}
      <div className="flex gap-1 bg-secondary/30 rounded-lg p-1">
        {(['ranking', 'radar'] as View[]).map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={cn(
              'flex-1 py-1 text-xs font-medium rounded-md transition-colors',
              view === v ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {v === 'ranking' ? 'Classement' : 'Radar comparatif'}
          </button>
        ))}
      </div>

      {view === 'ranking' ? (
        <div className="flex-1 overflow-auto space-y-1.5">
          {regionalRankings.map(r => (
            <div key={r.countryCode} className="bg-secondary/20 rounded-lg px-3 py-2">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-base font-black text-muted-foreground/50 w-5">#{r.rank}</span>
                  <div>
                    <div className="text-xs font-bold text-foreground">{r.country}</div>
                    {r.alert && (
                      <div className="flex items-center gap-0.5 text-[10px] text-destructive">
                        <AlertTriangle className="w-2.5 h-2.5" />{r.alert}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <TrendIcon trend={r.trend} />
                  <span className={cn(
                    'text-sm font-bold font-mono',
                    r.compositeScore >= 70 ? 'text-emerald-500' :
                    r.compositeScore >= 50 ? 'text-yellow-500' : 'text-destructive'
                  )}>{r.compositeScore.toFixed(1)}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
                <div>
                  <span className="text-[10px] text-muted-foreground">Stabilité</span>
                  <ScoreBar value={r.stabilityScore} />
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground">Croissance</span>
                  <ScoreBar value={r.growthScore} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col flex-1 gap-2">
          {/* Country selector for radar */}
          <div className="flex flex-wrap gap-1">
            {regionalRankings.map(r => (
              <button
                key={r.countryCode}
                onClick={() => setSelectedCountry(r)}
                className={cn(
                  'px-2 py-0.5 rounded-full text-[10px] font-medium border transition-colors',
                  selectedCountry.countryCode === r.countryCode
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'text-muted-foreground border-border hover:border-foreground/30'
                )}
              >
                {r.countryCode}
              </button>
            ))}
          </div>

          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} />
                <Tooltip
                  contentStyle={{ fontSize: 11, backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
                />
                <Radar
                  name={selectedCountry.country}
                  dataKey="value"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.25}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-4 gap-1">
            {[
              { label: 'Stabilité',  v: selectedCountry.stabilityScore },
              { label: 'Croissance', v: selectedCountry.growthScore },
              { label: 'Fiscal',     v: selectedCountry.fiscalScore },
              { label: 'Monétaire',  v: selectedCountry.monetaryScore },
            ].map(d => (
              <div key={d.label} className="bg-secondary/30 rounded p-1.5 text-center">
                <div className="text-[10px] text-muted-foreground">{d.label}</div>
                <div className={cn(
                  'text-sm font-bold font-mono',
                  d.v >= 70 ? 'text-emerald-500' : d.v >= 50 ? 'text-yellow-500' : 'text-destructive'
                )}>{d.v}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
