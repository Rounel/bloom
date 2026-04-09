'use client'

import { TrendingUp, TrendingDown, Activity } from 'lucide-react'
import { marketIndices, type MarketIndex } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

function IndexCard({ index }: { index: MarketIndex }) {
  const isPositive = index.change >= 0

  return (
    <div className="p-3 bg-secondary/30 rounded-lg border border-border/50 hover:border-primary/30 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-muted-foreground">{index.name}</span>
        {isPositive ? (
          <TrendingUp className="w-4 h-4 text-primary" />
        ) : (
          <TrendingDown className="w-4 h-4 text-destructive" />
        )}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-lg font-mono font-semibold text-foreground">
          {index.value.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
        </span>
        <span
          className={cn(
            "text-xs font-medium",
            isPositive ? "text-primary" : "text-destructive"
          )}
        >
          {isPositive ? '+' : ''}{index.changePercent.toFixed(2)}%
        </span>
      </div>
      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
        <span>YTD: </span>
        <span className={cn(
          "font-medium",
          index.yearToDate >= 0 ? "text-primary" : "text-destructive"
        )}>
          {index.yearToDate >= 0 ? '+' : ''}{index.yearToDate}%
        </span>
      </div>
    </div>
  )
}

export function MarketOverviewPanel() {
  const totalVolume = 198764
  const advancers = 28
  const decliners = 15
  const unchanged = 3

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="p-2 bg-secondary/30 rounded">
          <div className="text-xs text-muted-foreground">Volume</div>
          <div className="text-sm font-mono font-semibold text-foreground">
            {totalVolume.toLocaleString()}
          </div>
        </div>
        <div className="p-2 bg-primary/10 rounded">
          <div className="text-xs text-muted-foreground">Hausses</div>
          <div className="text-sm font-mono font-semibold text-primary">{advancers}</div>
        </div>
        <div className="p-2 bg-destructive/10 rounded">
          <div className="text-xs text-muted-foreground">Baisses</div>
          <div className="text-sm font-mono font-semibold text-destructive">{decliners}</div>
        </div>
        <div className="p-2 bg-secondary/30 rounded">
          <div className="text-xs text-muted-foreground">Stable</div>
          <div className="text-sm font-mono font-semibold text-muted-foreground">{unchanged}</div>
        </div>
      </div>

      {/* Market Breadth */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Breadth du marché</span>
          <span>{((advancers / (advancers + decliners)) * 100).toFixed(0)}% haussier</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden flex">
          <div 
            className="bg-primary h-full transition-all" 
            style={{ width: `${(advancers / (advancers + decliners + unchanged)) * 100}%` }}
          />
          <div 
            className="bg-muted-foreground/30 h-full transition-all" 
            style={{ width: `${(unchanged / (advancers + decliners + unchanged)) * 100}%` }}
          />
          <div 
            className="bg-destructive h-full transition-all" 
            style={{ width: `${(decliners / (advancers + decliners + unchanged)) * 100}%` }}
          />
        </div>
      </div>

      {/* Indices Grid */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
          <Activity className="w-3.5 h-3.5" />
          Indices Africains
        </div>
        <div className="grid grid-cols-1 gap-2">
          {marketIndices.map((index) => (
            <IndexCard key={index.name} index={index} />
          ))}
        </div>
      </div>
    </div>
  )
}
