'use client'

import { useState, useMemo } from 'react'
import { brvmStocks, orderBooks } from '@/lib/mock-data'

function localRng(seed: number) {
  let s = seed >>> 0
  return () => { s += 0x6D2B79F5; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }
}
import { cn } from '@/lib/utils'

function buildDynamicOrderBook(symbol: string, basePrice: number) {
  if (orderBooks[symbol]) return orderBooks[symbol]
  const rng = localRng(basePrice * 7 + 1)
  const spread = +(basePrice * 0.002).toFixed(0)
  const bids = Array.from({ length: 8 }, (_, i) => {
    const price = basePrice - spread - i * (spread * 0.5 + rng() * spread)
    const qty = Math.floor(100 + rng() * 900)
    return { price: +price.toFixed(0), quantity: qty, cumulative: 0, side: 'bid' as const }
  })
  const asks = Array.from({ length: 8 }, (_, i) => {
    const price = basePrice + spread + i * (spread * 0.5 + rng() * spread)
    const qty = Math.floor(100 + rng() * 900)
    return { price: +price.toFixed(0), quantity: qty, cumulative: 0, side: 'ask' as const }
  })
  let cum = 0
  bids.forEach(b => { cum += b.quantity; b.cumulative = cum })
  cum = 0
  asks.forEach(a => { cum += a.quantity; a.cumulative = cum })
  const lastTrades = Array.from({ length: 6 }, (_, i) => ({
    price: basePrice + Math.round((rng() - 0.5) * spread * 2),
    quantity: Math.floor(50 + rng() * 500),
    time: `${14 - i}:${String(Math.floor(rng() * 60)).padStart(2, '0')}`,
    side: rng() > 0.5 ? 'buy' as const : 'sell' as const,
  }))
  return {
    symbol, bids, asks, lastTrades,
    spread: asks[0].price - bids[0].price,
    spreadPct: +((asks[0].price - bids[0].price) / basePrice * 100).toFixed(3),
  }
}

export function OrderBookPanel() {
  const [selectedSymbol, setSelectedSymbol] = useState('SNTS')

  const stock = useMemo(() => brvmStocks.find(s => s.symbol === selectedSymbol) ?? brvmStocks[0], [selectedSymbol])
  const book = useMemo(() => buildDynamicOrderBook(stock.symbol, stock.price), [stock])

  const maxBidCum = book.bids[book.bids.length - 1]?.cumulative ?? 1
  const maxAskCum = book.asks[book.asks.length - 1]?.cumulative ?? 1

  return (
    <div className="flex flex-col h-full gap-2 text-xs">
      {/* Selector */}
      <select
        value={selectedSymbol}
        onChange={e => setSelectedSymbol(e.target.value)}
        className="w-full rounded-md border border-border bg-secondary/30 px-2 py-1 text-xs text-foreground focus:outline-none"
      >
        {brvmStocks.map(s => (
          <option key={s.symbol} value={s.symbol}>{s.symbol} — {s.name}</option>
        ))}
      </select>

      {/* Mid price + spread */}
      <div className="flex items-center justify-between bg-secondary/20 rounded-lg px-3 py-2">
        <div>
          <div className="text-[10px] text-muted-foreground">Prix central</div>
          <div className="font-mono font-bold text-base text-foreground">
            {stock.price.toLocaleString('fr-FR')} <span className="text-[10px] font-normal text-muted-foreground">FCFA</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-muted-foreground">Spread</div>
          <span className="font-mono bg-yellow-500/20 text-yellow-500 rounded px-1.5 py-0.5 text-[11px]">
            {book.spread} ({book.spreadPct}%)
          </span>
        </div>
      </div>

      {/* Order book table */}
      <div className="flex-1 overflow-auto min-h-0">
        <div className="grid grid-cols-2 gap-1">
          {/* Bids */}
          <div>
            <div className="grid grid-cols-2 text-[10px] text-emerald-500 font-semibold px-1 mb-1">
              <span>Prix</span><span className="text-right">Qté</span>
            </div>
            {book.bids.map((b, i) => (
              <div key={i} className="relative grid grid-cols-2 px-1 py-0.5 rounded overflow-hidden">
                <div
                  className="absolute inset-0 bg-emerald-500/10"
                  style={{ width: `${(b.cumulative / maxBidCum) * 100}%` }}
                />
                <span className="relative font-mono text-emerald-500">{b.price.toLocaleString('fr-FR')}</span>
                <span className="relative font-mono text-right text-foreground/80">{b.quantity}</span>
              </div>
            ))}
          </div>
          {/* Asks */}
          <div>
            <div className="grid grid-cols-2 text-[10px] text-red-400 font-semibold px-1 mb-1">
              <span>Prix</span><span className="text-right">Qté</span>
            </div>
            {book.asks.map((a, i) => (
              <div key={i} className="relative grid grid-cols-2 px-1 py-0.5 rounded overflow-hidden">
                <div
                  className="absolute inset-0 bg-red-400/10 right-0 left-auto"
                  style={{ width: `${(a.cumulative / maxAskCum) * 100}%` }}
                />
                <span className="relative font-mono text-red-400">{a.price.toLocaleString('fr-FR')}</span>
                <span className="relative font-mono text-right text-foreground/80">{a.quantity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Last trades */}
      <div className="border-t border-border/40 pt-2">
        <div className="text-[10px] text-muted-foreground font-semibold mb-1">Dernières transactions</div>
        <div className="space-y-0.5">
          {book.lastTrades.map((t, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-muted-foreground font-mono">{t.time}</span>
              <span className={cn('font-mono font-semibold', t.side === 'buy' ? 'text-emerald-500' : 'text-red-400')}>
                {t.price.toLocaleString('fr-FR')}
              </span>
              <span className="text-foreground/70 font-mono">{t.quantity}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
