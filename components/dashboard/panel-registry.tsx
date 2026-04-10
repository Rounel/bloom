'use client'

import { type Panel } from '@/lib/dashboard-store'
import { MarketOverviewPanel }   from './panels/market-overview'
import { BRVMStocksPanel }       from './panels/brvm-stocks'
import { StockChartPanel }       from './panels/stock-chart'
import { TopMoversPanel }        from './panels/top-movers'
import { SectorHeatmapPanel }    from './panels/sector-heatmap'
import { YieldCurvesPanel }      from './panels/yield-curves'
import { CurrencyRatesPanel }    from './panels/currency-rates'
import { CommoditiesPanel }      from './panels/commodities'
import { NewsFeedPanel }         from './panels/news-feed'
import { WebTVPanel }            from './panels/web-tv'
import { MacroIndicatorsPanel }  from './panels/macro-indicators'
import { PublicFinancesPanel }   from './panels/public-finances'
import { TradeBalancePanel }     from './panels/trade-balance'
import { SectorAnalysisPanel }   from './panels/sector-analysis'
import { RegionalAnalysisPanel } from './panels/regional-analysis'
import { EconomicCalendarPanel } from './panels/economic-calendar'
import { PortfolioPanel }        from './panels/portfolio'

export function getPanelContent(panel: Panel) {
  switch (panel.type) {
    case 'market-overview':   return <MarketOverviewPanel />
    case 'brvm-stocks':       return <BRVMStocksPanel />
    case 'stock-chart':       return <StockChartPanel />
    case 'top-movers':        return <TopMoversPanel />
    case 'sector-heatmap':    return <SectorHeatmapPanel />
    case 'yield-curves':      return <YieldCurvesPanel />
    case 'currency-rates':    return <CurrencyRatesPanel />
    case 'commodities':       return <CommoditiesPanel />
    case 'news-feed':         return <NewsFeedPanel />
    case 'web-tv':            return <WebTVPanel />
    case 'macro-indicators':  return <MacroIndicatorsPanel />
    case 'public-finances':   return <PublicFinancesPanel />
    case 'trade-balance':     return <TradeBalancePanel />
    case 'sector-analysis':   return <SectorAnalysisPanel />
    case 'regional-analysis': return <RegionalAnalysisPanel />
    case 'economic-calendar': return <EconomicCalendarPanel />
    case 'portfolio':         return <PortfolioPanel />
    default:
      return <div className="text-muted-foreground text-sm">Module non disponible</div>
  }
}
