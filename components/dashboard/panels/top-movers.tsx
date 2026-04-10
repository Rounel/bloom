'use client'

import { useState } from 'react'
import { TrendingUp, TrendingDown, BarChart2 } from 'lucide-react'
import { brvmStocks } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

type Tab = 'gainers' | 'losers' | 'volume'

export function TopMoversPanel() {
  const [tab, setTab] = useState<Tab>('gainers')

  const gainers = [...brvmStocks].sort((a, b) => b.changePercent - a.changePercent)
  const losers  = [...brvmStocks].sort((a, b) => a.changePercent - b.changePercent)
  const byVolume = [...brvmStocks].sort((a, b) => b.volume - a.volume)

  const list = tab === 'gainers' ? gainers : tab === 'losers' ? losers : byVolume

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: 'gainers', label: 'Hausses', icon: TrendingUp },
    { key: 'losers',  label: 'Baisses', icon: TrendingDown },
    { key: 'volume',  label: 'Volumes', icon: BarChart2 },
  ]

  return (
    <div className="flex flex-col h-full gap-3">
      {/* Tabs */}
      <div className="flex gap-1 bg-secondary/30 rounded-lg p-1">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-md transition-colors',
              tab === key
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex-1 overflow-auto space-y-1">
        {list.map((stock, i) => {
          const isPositive = stock.changePercent >= 0
          const maxVol = byVolume[0].volume
          const volPct = (stock.volume / maxVol) * 100

          return (
            <div
              key={stock.symbol}
              className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-secondary/30 transition-colors"
            >
              <span className="text-xs font-bold text-muted-foreground w-5 text-center">{i + 1}</span>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">{stock.symbol}</span>
                  <span className="text-xs font-mono font-semibold text-foreground">
                    {stock.price.toLocaleString('fr-FR')}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-[10px] text-muted-foreground truncate">{stock.name}</span>
                  {tab === 'volume' ? (
                    <div className="flex items-center gap-1.5">
                      <div className="w-16 h-1 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${volPct}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-muted-foreground">{stock.volume.toLocaleString('fr-FR')}</span>
                    </div>
                  ) : (
                    <span className={cn(
                      'text-xs font-mono font-semibold',
                      isPositive ? 'text-emerald-500' : 'text-destructive'
                    )}>
                      {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
