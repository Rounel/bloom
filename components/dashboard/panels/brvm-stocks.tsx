'use client'

import { useState } from 'react'
import { Search, ArrowUpDown, TrendingUp, TrendingDown } from 'lucide-react'
import { brvmStocks, type Stock } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'

type SortKey = 'symbol' | 'price' | 'changePercent' | 'volume'
type SortDirection = 'asc' | 'desc'

export function BRVMStocksPanel() {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('symbol')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [selectedSector, setSelectedSector] = useState<string>('all')

  const sectors = ['all', ...new Set(brvmStocks.map(s => s.sector))]

  const filteredAndSortedStocks = brvmStocks
    .filter(stock => {
      const matchesSearch = 
        stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesSector = selectedSector === 'all' || stock.sector === selectedSector
      return matchesSearch && matchesSector
    })
    .sort((a, b) => {
      const modifier = sortDirection === 'asc' ? 1 : -1
      if (sortKey === 'symbol') return a.symbol.localeCompare(b.symbol) * modifier
      return (a[sortKey] - b[sortKey]) * modifier
    })

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
  }

  const formatPrice = (price: number) => {
    return price.toLocaleString('fr-FR') + ' XOF'
  }

  const formatMarketCap = (cap: number) => {
    if (cap >= 1e12) return (cap / 1e12).toFixed(1) + ' T'
    if (cap >= 1e9) return (cap / 1e9).toFixed(1) + ' Mrd'
    return (cap / 1e6).toFixed(1) + ' M'
  }

  return (
    <div className="flex flex-col h-full gap-3">
      {/* Search and Filters */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 h-8 text-sm bg-secondary/50 border-border/50"
          />
        </div>
        <select
          value={selectedSector}
          onChange={(e) => setSelectedSector(e.target.value)}
          className="h-8 px-2 text-xs bg-secondary/50 border border-border/50 rounded-md text-foreground"
        >
          {sectors.map(sector => (
            <option key={sector} value={sector}>
              {sector === 'all' ? 'Tous les secteurs' : sector}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-card">
            <tr className="border-b border-border text-muted-foreground">
              <th 
                className="text-left p-2 cursor-pointer hover:text-foreground transition-colors"
                onClick={() => handleSort('symbol')}
              >
                <div className="flex items-center gap-1">
                  Symbole
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th 
                className="text-right p-2 cursor-pointer hover:text-foreground transition-colors"
                onClick={() => handleSort('price')}
              >
                <div className="flex items-center justify-end gap-1">
                  Prix
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th 
                className="text-right p-2 cursor-pointer hover:text-foreground transition-colors"
                onClick={() => handleSort('changePercent')}
              >
                <div className="flex items-center justify-end gap-1">
                  Var.
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th 
                className="text-right p-2 cursor-pointer hover:text-foreground transition-colors"
                onClick={() => handleSort('volume')}
              >
                <div className="flex items-center justify-end gap-1">
                  Vol.
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="text-right p-2">Cap.</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedStocks.map((stock) => (
              <StockRow key={stock.symbol} stock={stock} formatPrice={formatPrice} formatMarketCap={formatMarketCap} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Stats */}
      <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
        <span>{filteredAndSortedStocks.length} valeurs</span>
        <span>Dernière MAJ: {new Date().toLocaleTimeString('fr-FR')}</span>
      </div>
    </div>
  )
}

function StockRow({ 
  stock, 
  formatPrice, 
  formatMarketCap 
}: { 
  stock: Stock
  formatPrice: (p: number) => string
  formatMarketCap: (c: number) => string
}) {
  const isPositive = stock.change >= 0

  return (
    <tr className="border-b border-border/30 hover:bg-secondary/30 transition-colors cursor-pointer">
      <td className="p-2">
        <div className="flex flex-col">
          <span className="font-mono font-semibold text-foreground">{stock.symbol}</span>
          <span className="text-muted-foreground text-[10px] truncate max-w-[120px]">{stock.name}</span>
        </div>
      </td>
      <td className="text-right p-2 font-mono text-foreground">
        {formatPrice(stock.price)}
      </td>
      <td className="text-right p-2">
        <div className={cn(
          "flex items-center justify-end gap-1 font-mono",
          isPositive ? "text-primary" : "text-destructive"
        )}>
          {isPositive ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          <span>{isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%</span>
        </div>
      </td>
      <td className="text-right p-2 font-mono text-muted-foreground">
        {stock.volume.toLocaleString()}
      </td>
      <td className="text-right p-2 font-mono text-muted-foreground">
        {formatMarketCap(stock.marketCap)}
      </td>
    </tr>
  )
}
