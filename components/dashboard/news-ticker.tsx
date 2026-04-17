'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { newsItems } from '@/lib/mock-data'
import { Zap, Radio } from 'lucide-react'

const CATEGORY_COLORS: Record<string, string> = {
  'Marché':            'text-blue-400',
  'Entreprise':        'text-violet-400',
  'Macro':             'text-amber-400',
  'Banque':            'text-cyan-400',
  'Agriculture':       'text-emerald-400',
  'Énergie':           'text-orange-400',
  'Politique Monétaire': 'text-rose-400',
  'Événement':         'text-sky-400',
}

function timeAgo(timestamp: string): string {
  const diff = Math.floor((new Date('2026-04-17').getTime() - new Date(timestamp).getTime()) / 60000)
  if (diff < 60)  return `il y a ${diff} min`
  if (diff < 1440) return `il y a ${Math.floor(diff / 60)} h`
  return `il y a ${Math.floor(diff / 1440)} j`
}

export function NewsTicker({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  if (!mounted) return <div className={cn('h-7 bg-card border-b border-border/50', className)} />

  const items = newsItems

  return (
    <div
      className={cn(
        'h-7 bg-card border-b border-border/50 overflow-hidden flex items-center relative select-none',
        className,
      )}
    >
      {/* Label fixe */}
      <div className="shrink-0 h-full flex items-center gap-1.5 px-3 border-r border-border/40 bg-primary/8 z-20">
        <Radio className="w-3 h-3 text-primary animate-pulse" />
        <span className="text-[11px] font-bold text-primary uppercase tracking-widest whitespace-nowrap">
          Actus
        </span>
      </div>

      {/* Fade masks */}
      <div className="absolute left-[72px] inset-y-0 w-8 bg-gradient-to-r from-card to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 inset-y-0 w-10 bg-gradient-to-l from-card to-transparent z-10 pointer-events-none" />

      {/* Défilement */}
      <div className="flex animate-scroll-infinite whitespace-nowrap [animation-duration:90s] hover:[animation-play-state:paused] ml-2">
        {[...items, ...items].map((item, i) => (
          <div
            key={i}
            className="inline-flex items-center gap-2 px-5 border-r border-border/20 last:border-r-0"
          >
            {item.isBreaking && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-400 uppercase tracking-wide shrink-0">
                <Zap className="w-2.5 h-2.5 fill-red-400" />
                Flash
              </span>
            )}

            <span className={cn(
              'text-[10px] font-semibold uppercase tracking-wide shrink-0',
              CATEGORY_COLORS[item.category] ?? 'text-muted-foreground',
            )}>
              {item.category}
            </span>

            <span className="text-[12px] font-medium text-foreground">
              {item.title}
            </span>

            <span className="text-[11px] text-muted-foreground/60 shrink-0">
              {item.source} · {timeAgo(item.timestamp)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
