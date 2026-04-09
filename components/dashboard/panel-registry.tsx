'use client'

import { type Panel } from '@/lib/dashboard-store'
import { MarketOverviewPanel } from './panels/market-overview'
import { BRVMStocksPanel } from './panels/brvm-stocks'
import { StockChartPanel } from './panels/stock-chart'
import { MacroIndicatorsPanel } from './panels/macro-indicators'
import { NewsFeedPanel } from './panels/news-feed'
import { WebTVPanel } from './panels/web-tv'
import { SectorAnalysisPanel } from './panels/sector-analysis'
import { CurrencyRatesPanel } from './panels/currency-rates'
import { EconomicCalendarPanel } from './panels/economic-calendar'
import { PortfolioPanel } from './panels/portfolio'

export function getPanelContent(panel: Panel) {
  switch (panel.type) {
    case 'market-overview':
      return <MarketOverviewPanel />
    case 'brvm-stocks':
      return <BRVMStocksPanel />
    case 'stock-chart':
      return <StockChartPanel />
    case 'macro-indicators':
      return <MacroIndicatorsPanel />
    case 'news-feed':
      return <NewsFeedPanel />
    case 'web-tv':
      return <WebTVPanel />
    case 'sector-analysis':
      return <SectorAnalysisPanel />
    case 'currency-rates':
      return <CurrencyRatesPanel />
    case 'economic-calendar':
      return <EconomicCalendarPanel />
    case 'portfolio':
      return <PortfolioPanel />
    default:
      return <div className="text-muted-foreground text-sm">Module non disponible</div>
  }
}
