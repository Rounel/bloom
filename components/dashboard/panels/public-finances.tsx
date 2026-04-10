'use client'

import { useState } from 'react'
import { publicFinances } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { Calendar, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react'

type View = 'overview' | 'calendar'

function RatingBadge({ rating, outlook }: { rating: string; outlook: string }) {
  const ratingColor =
    rating.startsWith('BB') ? 'text-emerald-500 bg-emerald-500/10' :
    rating.startsWith('B')  ? 'text-yellow-500 bg-yellow-500/10' :
    'text-destructive bg-destructive/10'

  const outlookIcon =
    outlook === 'positive' ? <TrendingUp className="w-3 h-3 text-emerald-500" /> :
    outlook === 'negative' ? <TrendingDown className="w-3 h-3 text-destructive" /> :
    <span className="w-3 h-3 text-muted-foreground">–</span>

  return (
    <div className="flex items-center gap-1">
      <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded', ratingColor)}>{rating}</span>
      {outlookIcon}
    </div>
  )
}

function Bar({ value, max, color }: { value: number; max: number; color: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
        <div className={cn('h-full rounded-full', color)} style={{ width: `${Math.min(100, (value / max) * 100)}%` }} />
      </div>
      <span className="text-[10px] font-mono text-foreground w-10 text-right">{value.toFixed(1)}%</span>
    </div>
  )
}

export function PublicFinancesPanel() {
  const [view, setView] = useState<View>('overview')

  const maxDebt = Math.max(...publicFinances.map(f => f.debtToGDP))

  return (
    <div className="flex flex-col h-full gap-3">
      {/* Tab */}
      <div className="flex gap-1 bg-secondary/30 rounded-lg p-1">
        {(['overview', 'calendar'] as View[]).map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-1 text-xs font-medium rounded-md transition-colors',
              view === v ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {v === 'calendar' && <Calendar className="w-3.5 h-3.5" />}
            {v === 'overview' ? 'Vue d\'ensemble' : 'Émissions obligataires'}
          </button>
        ))}
      </div>

      {view === 'overview' ? (
        <div className="flex-1 overflow-auto space-y-2">
          {publicFinances.map(f => (
            <div key={f.countryCode} className="bg-secondary/20 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-xs font-bold text-foreground">{f.country}</span>
                  {f.debtService > 30 && (
                    <span className="ml-1.5 inline-flex items-center gap-0.5 text-[10px] text-destructive">
                      <AlertTriangle className="w-2.5 h-2.5" />Risque
                    </span>
                  )}
                </div>
                <RatingBadge rating={f.rating} outlook={f.outlook} />
              </div>
              <div className="space-y-1.5">
                <div>
                  <div className="text-[10px] text-muted-foreground mb-0.5">Dette / PIB</div>
                  <Bar value={f.debtToGDP} max={maxDebt} color="bg-primary" />
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <div>
                    <div className="text-[10px] text-muted-foreground">Déficit</div>
                    <div className={cn('text-xs font-mono font-semibold', f.budgetDeficit < 0 ? 'text-destructive' : 'text-emerald-500')}>
                      {f.budgetDeficit.toFixed(1)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground">Serv. dette</div>
                    <div className="text-xs font-mono font-semibold text-foreground">{f.debtService.toFixed(1)}%</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground">Sol. primaire</div>
                    <div className={cn('text-xs font-mono font-semibold', f.primaryBalance >= 0 ? 'text-emerald-500' : 'text-destructive')}>
                      {f.primaryBalance.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 overflow-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left py-1.5 px-2 text-muted-foreground font-medium">Pays</th>
                <th className="text-left py-1.5 px-2 text-muted-foreground font-medium">Date</th>
                <th className="text-right py-1.5 px-2 text-muted-foreground font-medium">Montant</th>
                <th className="text-center py-1.5 px-2 text-muted-foreground font-medium">Note</th>
              </tr>
            </thead>
            <tbody>
              {[...publicFinances]
                .sort((a, b) => new Date(a.nextIssuance).getTime() - new Date(b.nextIssuance).getTime())
                .map(f => {
                  const d = new Date(f.nextIssuance)
                  const dateStr = d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
                  const isPast = d < new Date('2026-04-10')
                  return (
                    <tr key={f.countryCode} className="border-b border-border/30 hover:bg-secondary/20 transition-colors">
                      <td className="py-2 px-2">
                        <div className="font-semibold text-foreground">{f.countryCode}</div>
                        <div className="text-[10px] text-muted-foreground">{f.country}</div>
                      </td>
                      <td className="py-2 px-2">
                        <span className={cn('font-medium', isPast ? 'text-muted-foreground line-through' : 'text-foreground')}>
                          {dateStr}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-right font-mono font-semibold text-foreground">
                        {f.targetAmount} Mrd XOF
                      </td>
                      <td className="py-2 px-2 text-center">
                        <RatingBadge rating={f.rating} outlook={f.outlook} />
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
