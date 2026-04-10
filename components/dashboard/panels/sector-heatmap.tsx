'use client'

import { brvmStocks, sectorPerformance } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

function perfColor(p: number) {
  if (p >= 3)   return 'bg-emerald-600/80 hover:bg-emerald-600'
  if (p >= 1.5) return 'bg-emerald-500/70 hover:bg-emerald-500'
  if (p >= 0)   return 'bg-emerald-400/50 hover:bg-emerald-400/70'
  if (p >= -1.5) return 'bg-red-400/50 hover:bg-red-400/70'
  if (p >= -3)  return 'bg-red-500/70 hover:bg-red-500'
  return 'bg-red-600/80 hover:bg-red-600'
}

// Mini sparkline via inline SVG (deterministic data derived from stock price)
function Sparkline({ seed, positive }: { seed: number; positive: boolean }) {
  const points = Array.from({ length: 8 }, (_, i) => {
    const s = (seed * 31 + i * 17) % 100
    return 10 + (s % 30)
  })
  const max = Math.max(...points)
  const min = Math.min(...points)
  const range = max - min || 1
  const h = 24
  const w = 48
  const coords = points.map((p, i) => `${(i / (points.length - 1)) * w},${h - ((p - min) / range) * h}`).join(' ')

  return (
    <svg width={w} height={h} className="opacity-70">
      <polyline
        points={coords}
        fill="none"
        stroke={positive ? '#10b981' : '#ef4444'}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function SectorHeatmapPanel() {
  const sectors = sectorPerformance

  return (
    <div className="flex flex-col h-full gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Performance sectorielle intraday</span>
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-emerald-500 inline-block" />Hausse</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-red-500 inline-block" />Baisse</span>
        </div>
      </div>

      {/* Heatmap grid */}
      <div className="grid grid-cols-2 gap-2 flex-1">
        {sectors.map((sector) => {
          const isPos = sector.performance >= 0
          const sectorStocks = brvmStocks.filter(s => s.sector === sector.sector)

          return (
            <div
              key={sector.sector}
              className={cn(
                'rounded-lg p-3 cursor-pointer transition-colors flex flex-col justify-between',
                perfColor(sector.performance)
              )}
            >
              <div>
                <div className="text-xs font-bold text-white truncate">{sector.sector}</div>
                <div className={cn(
                  'text-lg font-mono font-bold',
                  isPos ? 'text-emerald-100' : 'text-red-100'
                )}>
                  {isPos ? '+' : ''}{sector.performance.toFixed(2)}%
                </div>
              </div>
              <div className="flex items-end justify-between mt-2">
                <div>
                  <div className="text-[10px] text-white/70">{sector.numberOfStocks} valeur{sector.numberOfStocks > 1 ? 's' : ''}</div>
                  <div className="text-[10px] text-white/70">Vol: {sector.volume.toLocaleString('fr-FR')}</div>
                </div>
                <Sparkline seed={sector.marketCap % 1000} positive={isPos} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Stock mini-list */}
      <div className="border-t border-border/50 pt-2">
        <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Titres intraday</div>
        <div className="grid grid-cols-3 gap-1">
          {brvmStocks.slice(0, 6).map(stock => (
            <div key={stock.symbol} className="flex flex-col px-2 py-1 bg-secondary/30 rounded">
              <span className="text-[10px] font-bold text-foreground">{stock.symbol}</span>
              <span className={cn(
                'text-[10px] font-mono',
                stock.changePercent >= 0 ? 'text-emerald-500' : 'text-destructive'
              )}>
                {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
