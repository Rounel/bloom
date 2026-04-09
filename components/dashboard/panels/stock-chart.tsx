'use client'

import { useState, useMemo } from 'react'
import { 
  Area, 
  AreaChart, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Bar,
  BarChart,
} from 'recharts'
import { brvmStocks, generateStockHistory } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, BarChart3, LineChart } from 'lucide-react'

type TimeRange = '1W' | '1M' | '3M' | '6M' | '1Y'
type ChartType = 'area' | 'candle'

export function StockChartPanel() {
  const [selectedStock, setSelectedStock] = useState(brvmStocks[0])
  const [timeRange, setTimeRange] = useState<TimeRange>('3M')
  const [chartType, setChartType] = useState<ChartType>('area')

  const stockData = useMemo(() => {
    const days = timeRange === '1W' ? 7 : timeRange === '1M' ? 30 : timeRange === '3M' ? 90 : timeRange === '6M' ? 180 : 365
    return generateStockHistory(selectedStock.price, days)
  }, [selectedStock.price, timeRange])

  const timeRanges: TimeRange[] = ['1W', '1M', '3M', '6M', '1Y']
  const isPositive = selectedStock.change >= 0

  const minPrice = Math.min(...stockData.map(d => d.low))
  const maxPrice = Math.max(...stockData.map(d => d.high))
  const priceRange = maxPrice - minPrice

  return (
    <div className="flex flex-col h-full gap-3">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <select
              value={selectedStock.symbol}
              onChange={(e) => {
                const stock = brvmStocks.find(s => s.symbol === e.target.value)
                if (stock) setSelectedStock(stock)
              }}
              className="text-lg font-semibold bg-transparent border-none text-foreground cursor-pointer hover:text-primary transition-colors"
            >
              {brvmStocks.map(stock => (
                <option key={stock.symbol} value={stock.symbol}>
                  {stock.symbol} - {stock.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-mono font-bold text-foreground">
              {selectedStock.price.toLocaleString('fr-FR')} <span className="text-sm">XOF</span>
            </span>
            <span className={cn(
              "flex items-center gap-1 text-sm font-medium",
              isPositive ? "text-primary" : "text-destructive"
            )}>
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {isPositive ? '+' : ''}{selectedStock.change.toLocaleString()} ({isPositive ? '+' : ''}{selectedStock.changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>

        {/* Chart Controls */}
        <div className="flex items-center gap-2">
          <div className="flex bg-secondary/50 rounded-md p-0.5">
            <button
              onClick={() => setChartType('area')}
              className={cn(
                "p-1.5 rounded transition-colors",
                chartType === 'area' ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <LineChart className="w-4 h-4" />
            </button>
            <button
              onClick={() => setChartType('candle')}
              className={cn(
                "p-1.5 rounded transition-colors",
                chartType === 'candle' ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <BarChart3 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex gap-1">
        {timeRanges.map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={cn(
              "px-3 py-1 text-xs rounded transition-colors",
              timeRange === range 
                ? "bg-primary text-primary-foreground" 
                : "bg-secondary/50 text-muted-foreground hover:text-foreground"
            )}
          >
            {range}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart data={stockData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
                }}
                minTickGap={50}
              />
              <YAxis 
                domain={[minPrice - priceRange * 0.1, maxPrice + priceRange * 0.1]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
                tickFormatter={(value) => value.toLocaleString()}
                width={60}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                labelStyle={{ color: 'var(--foreground)' }}
                formatter={(value: number) => [value.toLocaleString() + ' XOF', 'Prix']}
                labelFormatter={(label) => new Date(label).toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              />
              <Area
                type="monotone"
                dataKey="close"
                stroke="var(--primary)"
                strokeWidth={2}
                fill="url(#colorPrice)"
              />
            </AreaChart>
          ) : (
            <BarChart data={stockData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
                }}
                minTickGap={50}
              />
              <YAxis 
                domain={[minPrice - priceRange * 0.1, maxPrice + priceRange * 0.1]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
                tickFormatter={(value) => value.toLocaleString()}
                width={60}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                labelStyle={{ color: 'var(--foreground)' }}
                formatter={(value: number, name: string) => [
                  value.toLocaleString() + ' XOF', 
                  name === 'high' ? 'Haut' : name === 'low' ? 'Bas' : name === 'open' ? 'Ouv.' : 'Clôt.'
                ]}
              />
              <Bar dataKey="high" fill="var(--primary)" opacity={0.8} />
              <Bar dataKey="low" fill="var(--destructive)" opacity={0.8} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Volume Chart */}
      <div className="h-16">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={stockData} margin={{ top: 0, right: 5, bottom: 0, left: 5 }}>
            <Bar 
              dataKey="volume" 
              fill="var(--muted-foreground)" 
              opacity={0.3}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 text-xs">
        <div className="p-2 bg-secondary/30 rounded">
          <div className="text-muted-foreground">Ouverture</div>
          <div className="font-mono text-foreground">{stockData[stockData.length - 1]?.open.toLocaleString()}</div>
        </div>
        <div className="p-2 bg-secondary/30 rounded">
          <div className="text-muted-foreground">Haut</div>
          <div className="font-mono text-primary">{maxPrice.toLocaleString()}</div>
        </div>
        <div className="p-2 bg-secondary/30 rounded">
          <div className="text-muted-foreground">Bas</div>
          <div className="font-mono text-destructive">{minPrice.toLocaleString()}</div>
        </div>
        <div className="p-2 bg-secondary/30 rounded">
          <div className="text-muted-foreground">Volume</div>
          <div className="font-mono text-foreground">{stockData[stockData.length - 1]?.volume.toLocaleString()}</div>
        </div>
      </div>
    </div>
  )
}
