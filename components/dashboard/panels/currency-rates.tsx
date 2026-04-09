'use client'

import { currencyRates, type CurrencyRate } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react'

export function CurrencyRatesPanel() {
  return (
    <div className="flex flex-col h-full gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Taux de Change</h3>
        <button className="p-1.5 rounded hover:bg-secondary/50 transition-colors">
          <RefreshCw className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Currency List */}
      <div className="flex-1 overflow-auto space-y-2">
        {currencyRates.map((rate) => (
          <CurrencyRow key={rate.pair} rate={rate} />
        ))}
      </div>

      {/* Footer */}
      <div className="text-[10px] text-muted-foreground text-center pt-2 border-t border-border/50">
        Dernière mise à jour: {new Date().toLocaleTimeString('fr-FR')}
      </div>
    </div>
  )
}

function CurrencyRow({ rate }: { rate: CurrencyRate }) {
  const isPositive = rate.change >= 0
  const [base, quote] = rate.pair.split('/')

  return (
    <div className="p-2 rounded-lg border border-border/50 hover:border-primary/30 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="text-sm font-semibold text-foreground">{base}</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-sm text-muted-foreground">{quote}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-mono font-semibold text-foreground">
            {rate.rate < 1 ? rate.rate.toFixed(6) : rate.rate.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className={cn(
            "flex items-center justify-end gap-1 text-xs font-mono",
            isPositive ? "text-primary" : "text-destructive"
          )}>
            {isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {isPositive ? '+' : ''}{rate.changePercent.toFixed(2)}%
          </div>
        </div>
      </div>
    </div>
  )
}
