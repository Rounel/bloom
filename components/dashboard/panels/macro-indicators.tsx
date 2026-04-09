'use client'

import { useState } from 'react'
import { macroIndicators, type MacroIndicator } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { 
  TrendingUp, 
  TrendingDown,
  Building2,
  Percent,
  Banknote,
  Users,
  Scale,
  ArrowRightLeft,
  Landmark,
  Wallet
} from 'lucide-react'

type IndicatorType = 'gdp' | 'inflation' | 'rates' | 'employment' | 'debt' | 'trade'

const indicatorConfig: Record<IndicatorType, { label: string; icon: React.ElementType; key: keyof MacroIndicator }> = {
  gdp: { label: 'Croissance PIB', icon: Building2, key: 'gdpGrowth' },
  inflation: { label: 'Inflation', icon: Percent, key: 'inflation' },
  rates: { label: 'Taux directeur', icon: Banknote, key: 'interestRate' },
  employment: { label: 'Chômage', icon: Users, key: 'unemployment' },
  debt: { label: 'Dette/PIB', icon: Scale, key: 'debtToGDP' },
  trade: { label: 'Compte courant', icon: ArrowRightLeft, key: 'currentAccount' },
}

export function MacroIndicatorsPanel() {
  const [selectedIndicator, setSelectedIndicator] = useState<IndicatorType>('gdp')
  const [selectedCountry, setSelectedCountry] = useState<MacroIndicator | null>(null)

  const config = indicatorConfig[selectedIndicator]
  const Icon = config.icon

  const sortedCountries = [...macroIndicators].sort((a, b) => {
    const aValue = a[config.key] as number
    const bValue = b[config.key] as number
    return bValue - aValue
  })

  const maxValue = Math.max(...sortedCountries.map(c => Math.abs(c[config.key] as number)))

  return (
    <div className="flex flex-col h-full gap-3">
      {/* Indicator Selector */}
      <div className="flex flex-wrap gap-1">
        {(Object.keys(indicatorConfig) as IndicatorType[]).map((type) => {
          const conf = indicatorConfig[type]
          const Ic = conf.icon
          return (
            <button
              key={type}
              onClick={() => setSelectedIndicator(type)}
              className={cn(
                "flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors",
                selectedIndicator === type 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-secondary/50 text-muted-foreground hover:text-foreground"
              )}
            >
              <Ic className="w-3 h-3" />
              {conf.label}
            </button>
          )
        })}
      </div>

      {/* Chart Area */}
      <div className="flex-1 space-y-2 overflow-auto">
        {sortedCountries.map((country) => {
          const value = country[config.key] as number
          const isPositive = selectedIndicator === 'gdp' || selectedIndicator === 'rates' 
            ? value > 0 
            : selectedIndicator === 'inflation' || selectedIndicator === 'employment' || selectedIndicator === 'debt'
              ? value < 5
              : value > 0
          const barWidth = (Math.abs(value) / maxValue) * 100

          return (
            <div
              key={country.countryCode}
              className={cn(
                "p-2 rounded-lg border border-border/50 hover:border-primary/30 transition-colors cursor-pointer",
                selectedCountry?.countryCode === country.countryCode && "border-primary/50 bg-primary/5"
              )}
              onClick={() => setSelectedCountry(country)}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground w-6">{country.countryCode}</span>
                  <span className="text-sm font-medium text-foreground">{country.country}</span>
                </div>
                <div className={cn(
                  "flex items-center gap-1 text-sm font-mono font-semibold",
                  isPositive ? "text-primary" : "text-destructive"
                )}>
                  {value > 0 && selectedIndicator !== 'debt' && selectedIndicator !== 'employment' && '+'}
                  {value.toFixed(1)}%
                  {isPositive ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                </div>
              </div>
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all",
                    isPositive ? "bg-primary" : "bg-destructive"
                  )}
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Country Detail */}
      {selectedCountry && (
        <div className="p-3 bg-secondary/30 rounded-lg border border-border/50">
          <div className="flex items-center gap-2 mb-3">
            <Landmark className="w-4 h-4 text-primary" />
            <span className="font-medium text-foreground">{selectedCountry.country}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">PIB</span>
              <span className={cn("font-mono", selectedCountry.gdpGrowth > 0 ? "text-primary" : "text-destructive")}>
                {selectedCountry.gdpGrowth > 0 ? '+' : ''}{selectedCountry.gdpGrowth}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Inflation</span>
              <span className={cn("font-mono", selectedCountry.inflation < 5 ? "text-primary" : "text-destructive")}>
                {selectedCountry.inflation}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">IDE</span>
              <span className="font-mono text-foreground">{selectedCountry.fdi} M$</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Réserves</span>
              <span className="font-mono text-foreground">{selectedCountry.reserves} M$</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
