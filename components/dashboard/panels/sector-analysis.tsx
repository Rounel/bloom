'use client'

import { sectorPerformance, type SectorPerformance } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  Tooltip 
} from 'recharts'
import { TrendingUp, TrendingDown } from 'lucide-react'

const COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
]

export function SectorAnalysisPanel() {
  const totalMarketCap = sectorPerformance.reduce((sum, s) => sum + s.marketCap, 0)
  
  const pieData = sectorPerformance.map((sector, index) => ({
    name: sector.sector,
    value: sector.marketCap,
    percentage: ((sector.marketCap / totalMarketCap) * 100).toFixed(1),
    color: COLORS[index % COLORS.length],
    performance: sector.performance,
  }))

  const formatMarketCap = (cap: number) => {
    if (cap >= 1e12) return (cap / 1e12).toFixed(1) + ' T XOF'
    if (cap >= 1e9) return (cap / 1e9).toFixed(1) + ' Mrd XOF'
    return (cap / 1e6).toFixed(1) + ' M XOF'
  }

  return (
    <div className="flex flex-col h-full gap-3">
      {/* Pie Chart */}
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={60}
              paddingAngle={2}
              dataKey="value"
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
              formatter={(value: number) => [formatMarketCap(value), 'Cap. Marché']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Sector List */}
      <div className="flex-1 overflow-auto space-y-2">
        {sectorPerformance.map((sector, index) => (
          <div
            key={sector.sector}
            className="p-2 rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm font-medium text-foreground">{sector.sector}</span>
              </div>
              <div className={cn(
                "flex items-center gap-1 text-xs font-mono font-semibold",
                sector.performance >= 0 ? "text-primary" : "text-destructive"
              )}>
                {sector.performance >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {sector.performance >= 0 ? '+' : ''}{sector.performance.toFixed(1)}%
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-[10px]">
              <div>
                <div className="text-muted-foreground">Cap. Marché</div>
                <div className="font-mono text-foreground">{formatMarketCap(sector.marketCap)}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Volume</div>
                <div className="font-mono text-foreground">{sector.volume.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Valeurs</div>
                <div className="font-mono text-foreground">{sector.numberOfStocks}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="p-2 bg-secondary/30 rounded-lg text-xs">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Capitalisation totale</span>
          <span className="font-mono font-semibold text-foreground">{formatMarketCap(totalMarketCap)}</span>
        </div>
      </div>
    </div>
  )
}
