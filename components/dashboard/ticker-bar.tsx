'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { marketIndices, brvmStocks } from '@/lib/mock-data'

interface TickerItem {
  label: string
  value: string
  change: number
  isPositive: boolean
}

function buildTickerItems(): TickerItem[] {
  return [
    ...marketIndices.map(idx => ({
      label: idx.name,
      value: idx.value.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      change: idx.changePercent,
      isPositive: idx.change >= 0,
    })),
    ...brvmStocks.map(s => ({
      label: s.symbol,
      value: s.price.toLocaleString('fr-FR'),
      change: s.changePercent,
      isPositive: s.change >= 0,
    })),
  ]
}

export function TickerBar() {
  const [items, setItems] = useState<TickerItem[]>([])

  useEffect(() => {
    setItems(buildTickerItems())
    // Simulate live price noise every 1.5 s — client-only, no SSR mismatch
    const id = setInterval(() => {
      setItems(prev =>
        prev.map(item => {
          const noise = (Math.random() - 0.5) * 0.06
          const change = item.change + noise
          return { ...item, change, isPositive: change >= 0 }
        })
      )
    }, 1500)
    return () => clearInterval(id)
  }, [])

  if (!items.length) return <div className="h-9 bg-secondary/40 border-b border-border/50" />

  return (
    <div className="h-9 bg-secondary/40 border-b border-border/50 overflow-hidden flex items-center relative select-none">
      {/* Fade masks */}
      <div className="absolute left-0 inset-y-0 w-10 bg-gradient-to-r from-secondary/60 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 inset-y-0 w-10 bg-gradient-to-l from-secondary/60 to-transparent z-10 pointer-events-none" />

      <div className="flex animate-scroll-infinite whitespace-nowrap [animation-duration:45s] hover:[animation-play-state:paused]">
        {[...items, ...items].map((item, i) => (
          <div
            key={i}
            className="inline-flex items-center gap-2 px-4 border-r border-border/30"
          >
            <span className="text-[11px] font-semibold text-muted-foreground">{item.label}</span>
            <span className="text-[11px] font-mono font-bold text-foreground">{item.value}</span>
            <span
              className={cn(
                'text-[11px] font-mono font-bold transition-colors',
                item.isPositive ? 'text-emerald-500' : 'text-red-400',
              )}
            >
              {item.isPositive ? '▲' : '▼'}&thinsp;{Math.abs(item.change).toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
