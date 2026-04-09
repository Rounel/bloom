'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Wallet,
  PieChart
} from 'lucide-react'
import { 
  PieChart as RechartsPie, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  Tooltip 
} from 'recharts'

interface PortfolioHolding {
  symbol: string
  name: string
  quantity: number
  avgPrice: number
  currentPrice: number
  value: number
  change: number
  changePercent: number
  weight: number
}

const portfolioHoldings: PortfolioHolding[] = [
  { symbol: 'SNTS', name: 'SONATEL', quantity: 150, avgPrice: 14500, currentPrice: 15850, value: 2377500, change: 202500, changePercent: 9.31, weight: 35 },
  { symbol: 'SGBC', name: 'SGBCI', quantity: 80, avgPrice: 12800, currentPrice: 12500, value: 1000000, change: -24000, changePercent: -2.34, weight: 15 },
  { symbol: 'ETIT', name: 'ECOBANK TG', quantity: 50000, avgPrice: 16.5, currentPrice: 18, value: 900000, change: 75000, changePercent: 9.09, weight: 13 },
  { symbol: 'ONTBF', name: 'ONATEL BF', quantity: 200, avgPrice: 3900, currentPrice: 4200, value: 840000, change: 60000, changePercent: 7.69, weight: 12 },
  { symbol: 'PALC', name: 'PALM CI', quantity: 100, avgPrice: 6800, currentPrice: 7250, value: 725000, change: 45000, changePercent: 6.62, weight: 11 },
  { symbol: 'BOAB', name: 'BOA BENIN', quantity: 150, avgPrice: 5600, currentPrice: 5900, value: 885000, change: 45000, changePercent: 5.36, weight: 14 },
]

const COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  'var(--muted-foreground)',
]

export function PortfolioPanel() {
  const [view, setView] = useState<'list' | 'chart'>('list')

  const totalValue = portfolioHoldings.reduce((sum, h) => sum + h.value, 0)
  const totalCost = portfolioHoldings.reduce((sum, h) => sum + (h.avgPrice * h.quantity), 0)
  const totalGain = totalValue - totalCost
  const totalGainPercent = (totalGain / totalCost) * 100

  const pieData = portfolioHoldings.map((holding, index) => ({
    name: holding.symbol,
    value: holding.value,
    color: COLORS[index % COLORS.length],
  }))

  const formatValue = (value: number) => {
    if (value >= 1e6) return (value / 1e6).toFixed(2) + ' M'
    if (value >= 1e3) return (value / 1e3).toFixed(0) + ' K'
    return value.toLocaleString()
  }

  return (
    <div className="flex flex-col h-full gap-3">
      {/* Summary */}
      <div className="p-3 bg-secondary/30 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">Valeur du portefeuille</span>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setView('list')}
              className={cn(
                "p-1 rounded transition-colors",
                view === 'list' ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Wallet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setView('chart')}
              className={cn(
                "p-1 rounded transition-colors",
                view === 'chart' ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <PieChart className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <div className="text-xl font-mono font-bold text-foreground">
          {formatValue(totalValue)} XOF
        </div>
        <div className={cn(
          "flex items-center gap-1 text-sm font-mono",
          totalGain >= 0 ? "text-primary" : "text-destructive"
        )}>
          {totalGain >= 0 ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          {totalGain >= 0 ? '+' : ''}{formatValue(totalGain)} XOF ({totalGain >= 0 ? '+' : ''}{totalGainPercent.toFixed(2)}%)
        </div>
      </div>

      {view === 'chart' ? (
        /* Pie Chart View */
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPie>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                formatter={(value: number) => [formatValue(value) + ' XOF', 'Valeur']}
              />
            </RechartsPie>
          </ResponsiveContainer>
        </div>
      ) : (
        /* List View */
        <div className="flex-1 overflow-auto space-y-2">
          {portfolioHoldings.map((holding, index) => (
            <div
              key={holding.symbol}
              className="p-2 rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm font-mono font-semibold text-foreground">{holding.symbol}</span>
                  <span className="text-xs text-muted-foreground">{holding.quantity} titres</span>
                </div>
                <span className="text-sm font-mono font-semibold text-foreground">
                  {formatValue(holding.value)} XOF
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  PRU: {holding.avgPrice.toLocaleString()} → {holding.currentPrice.toLocaleString()} XOF
                </span>
                <span className={cn(
                  "font-mono",
                  holding.change >= 0 ? "text-primary" : "text-destructive"
                )}>
                  {holding.change >= 0 ? '+' : ''}{holding.changePercent.toFixed(2)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Position Button */}
      <button className="flex items-center justify-center gap-2 p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium">
        <Plus className="w-4 h-4" />
        Ajouter une position
      </button>
    </div>
  )
}
