// BRVM Stock Data
export interface Stock {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap: number
  sector: string
  country: string
}

export const brvmStocks: Stock[] = [
  { symbol: 'SNTS', name: 'SONATEL', price: 15850, change: 250, changePercent: 1.60, volume: 12450, marketCap: 1585000000000, sector: 'Télécommunications', country: 'Sénégal' },
  { symbol: 'SGBC', name: 'SGBCI', price: 12500, change: -150, changePercent: -1.19, volume: 8230, marketCap: 875000000000, sector: 'Finance', country: 'Côte d\'Ivoire' },
  { symbol: 'ONTBF', name: 'ONATEL BF', price: 4200, change: 85, changePercent: 2.07, volume: 5680, marketCap: 420000000000, sector: 'Télécommunications', country: 'Burkina Faso' },
  { symbol: 'ETIT', name: 'ECOBANK TG', price: 18, change: 0.5, changePercent: 2.86, volume: 145000, marketCap: 270000000000, sector: 'Finance', country: 'Togo' },
  { symbol: 'SIBC', name: 'SIB CI', price: 4850, change: -65, changePercent: -1.32, volume: 3420, marketCap: 485000000000, sector: 'Finance', country: 'Côte d\'Ivoire' },
  { symbol: 'PALC', name: 'PALM CI', price: 7250, change: 180, changePercent: 2.55, volume: 7890, marketCap: 362500000000, sector: 'Agriculture', country: 'Côte d\'Ivoire' },
  { symbol: 'BOAB', name: 'BOA BENIN', price: 5900, change: 45, changePercent: 0.77, volume: 2340, marketCap: 295000000000, sector: 'Finance', country: 'Bénin' },
  { symbol: 'NSBC', name: 'NSIA BANQUE', price: 6100, change: -85, changePercent: -1.37, volume: 4560, marketCap: 427000000000, sector: 'Finance', country: 'Côte d\'Ivoire' },
  { symbol: 'TTLS', name: 'TOTAL SENEGAL', price: 2150, change: 35, changePercent: 1.65, volume: 6780, marketCap: 215000000000, sector: 'Distribution', country: 'Sénégal' },
  { symbol: 'SLBC', name: 'SOLIBRA', price: 175000, change: 2500, changePercent: 1.45, volume: 124, marketCap: 525000000000, sector: 'Industrie', country: 'Côte d\'Ivoire' },
  { symbol: 'BOAM', name: 'BOA MALI', price: 1850, change: -25, changePercent: -1.33, volume: 3200, marketCap: 185000000000, sector: 'Finance', country: 'Mali' },
  { symbol: 'SOGC', name: 'SOGB CI', price: 4100, change: 95, changePercent: 2.37, volume: 1890, marketCap: 287000000000, sector: 'Agriculture', country: 'Côte d\'Ivoire' },
]

// Macroeconomic Indicators
export interface MacroIndicator {
  country: string
  countryCode: string
  gdpGrowth: number
  inflation: number
  interestRate: number
  unemployment: number
  debtToGDP: number
  currentAccount: number
  fdi: number
  reserves: number
}

export const macroIndicators: MacroIndicator[] = [
  { country: 'Côte d\'Ivoire', countryCode: 'CI', gdpGrowth: 6.5, inflation: 4.2, interestRate: 5.0, unemployment: 3.1, debtToGDP: 52.8, currentAccount: -3.2, fdi: 1250, reserves: 8500 },
  { country: 'Sénégal', countryCode: 'SN', gdpGrowth: 5.8, inflation: 5.1, interestRate: 5.0, unemployment: 6.8, debtToGDP: 68.5, currentAccount: -11.2, fdi: 980, reserves: 4200 },
  { country: 'Burkina Faso', countryCode: 'BF', gdpGrowth: 4.2, inflation: 3.8, interestRate: 5.0, unemployment: 4.9, debtToGDP: 45.2, currentAccount: -5.8, fdi: 320, reserves: 1800 },
  { country: 'Mali', countryCode: 'ML', gdpGrowth: 3.5, inflation: 4.5, interestRate: 5.0, unemployment: 7.2, debtToGDP: 48.6, currentAccount: -6.1, fdi: 280, reserves: 2100 },
  { country: 'Bénin', countryCode: 'BJ', gdpGrowth: 5.9, inflation: 3.2, interestRate: 5.0, unemployment: 2.4, debtToGDP: 42.1, currentAccount: -4.5, fdi: 420, reserves: 2400 },
  { country: 'Niger', countryCode: 'NE', gdpGrowth: 7.2, inflation: 3.9, interestRate: 5.0, unemployment: 5.5, debtToGDP: 38.5, currentAccount: -12.5, fdi: 850, reserves: 1600 },
  { country: 'Togo', countryCode: 'TG', gdpGrowth: 5.4, inflation: 4.8, interestRate: 5.0, unemployment: 3.8, debtToGDP: 58.2, currentAccount: -2.8, fdi: 180, reserves: 1200 },
  { country: 'Guinée-Bissau', countryCode: 'GW', gdpGrowth: 3.8, inflation: 5.5, interestRate: 5.0, unemployment: 6.1, debtToGDP: 62.4, currentAccount: -8.2, fdi: 45, reserves: 480 },
]

// Stock Price History for Charts
export interface PricePoint {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export const generateStockHistory = (basePrice: number, days: number = 90): PricePoint[] => {
  const data: PricePoint[] = []
  let currentPrice = basePrice
  const now = new Date()
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    
    const volatility = 0.02
    const change = (Math.random() - 0.5) * 2 * volatility * currentPrice
    const open = currentPrice
    const close = currentPrice + change
    const high = Math.max(open, close) + Math.random() * volatility * currentPrice * 0.5
    const low = Math.min(open, close) - Math.random() * volatility * currentPrice * 0.5
    
    data.push({
      date: date.toISOString().split('T')[0],
      open: Math.round(open),
      high: Math.round(high),
      low: Math.round(low),
      close: Math.round(close),
      volume: Math.floor(Math.random() * 50000) + 5000,
    })
    
    currentPrice = close
  }
  
  return data
}

// News Feed
export interface NewsItem {
  id: string
  title: string
  source: string
  category: string
  timestamp: string
  summary: string
  isBreaking?: boolean
}

export const newsItems: NewsItem[] = [
  { id: '1', title: 'SONATEL annonce des résultats trimestriels records', source: 'Reuters Africa', category: 'Entreprise', timestamp: '2026-04-09T10:30:00Z', summary: 'Le groupe télécoms sénégalais affiche une croissance de 12% de son chiffre d\'affaires.', isBreaking: true },
  { id: '2', title: 'La BRVM franchit la barre des 8 000 points', source: 'Jeune Afrique', category: 'Marché', timestamp: '2026-04-09T09:15:00Z', summary: 'L\'indice BRVM Composite atteint un nouveau record historique.' },
  { id: '3', title: 'La BCEAO maintient son taux directeur à 5%', source: 'Agence Ecofin', category: 'Politique Monétaire', timestamp: '2026-04-09T08:45:00Z', summary: 'Le comité de politique monétaire confirme une approche prudente face à l\'inflation.' },
  { id: '4', title: 'Côte d\'Ivoire : le PIB en hausse de 6,5% en 2025', source: 'Bloomberg Africa', category: 'Macro', timestamp: '2026-04-08T16:20:00Z', summary: 'La première économie de l\'UEMOA confirme sa résilience économique.' },
  { id: '5', title: 'ECOBANK lance une nouvelle plateforme digitale', source: 'Financial Afrik', category: 'Banque', timestamp: '2026-04-08T14:00:00Z', summary: 'Le groupe panafricain investit massivement dans la transformation numérique.' },
  { id: '6', title: 'Le secteur agricole ivoirien attire les investisseurs', source: 'La Tribune Afrique', category: 'Agriculture', timestamp: '2026-04-08T11:30:00Z', summary: 'PALM CI et SOGB CI bénéficient d\'un regain d\'intérêt des fonds d\'investissement.' },
  { id: '7', title: 'Sénégal : production pétrolière en hausse', source: 'Africa Oil & Power', category: 'Énergie', timestamp: '2026-04-07T15:45:00Z', summary: 'Les champs de Sangomar et Yakaar-Teranga boostent les exportations.' },
  { id: '8', title: 'Forum des marchés financiers africains à Abidjan', source: 'BRVM News', category: 'Événement', timestamp: '2026-04-07T09:00:00Z', summary: 'Plus de 500 investisseurs attendus pour la 15ème édition.' },
]

// Sector Performance
export interface SectorPerformance {
  sector: string
  performance: number
  marketCap: number
  volume: number
  numberOfStocks: number
}

export const sectorPerformance: SectorPerformance[] = [
  { sector: 'Télécommunications', performance: 2.8, marketCap: 2005000000000, volume: 18130, numberOfStocks: 2 },
  { sector: 'Finance', performance: -0.5, marketCap: 2837000000000, volume: 163950, numberOfStocks: 6 },
  { sector: 'Agriculture', performance: 2.4, marketCap: 649500000000, volume: 9780, numberOfStocks: 2 },
  { sector: 'Industrie', performance: 1.5, marketCap: 525000000000, volume: 124, numberOfStocks: 1 },
  { sector: 'Distribution', performance: 1.2, marketCap: 215000000000, volume: 6780, numberOfStocks: 1 },
]

// Currency Rates
export interface CurrencyRate {
  pair: string
  rate: number
  change: number
  changePercent: number
}

export const currencyRates: CurrencyRate[] = [
  { pair: 'XOF/EUR', rate: 0.00152, change: 0.000002, changePercent: 0.13 },
  { pair: 'XOF/USD', rate: 0.00165, change: -0.000008, changePercent: -0.48 },
  { pair: 'EUR/USD', rate: 1.0850, change: 0.0025, changePercent: 0.23 },
  { pair: 'USD/NGN', rate: 1520.50, change: 15.25, changePercent: 1.01 },
  { pair: 'USD/GHS', rate: 14.85, change: -0.12, changePercent: -0.80 },
  { pair: 'USD/KES', rate: 128.45, change: 0.35, changePercent: 0.27 },
  { pair: 'USD/ZAR', rate: 18.25, change: 0.08, changePercent: 0.44 },
  { pair: 'USD/EGP', rate: 48.50, change: -0.25, changePercent: -0.51 },
]

// Economic Calendar
export interface EconomicEvent {
  id: string
  date: string
  time: string
  country: string
  event: string
  importance: 'high' | 'medium' | 'low'
  actual?: string
  forecast?: string
  previous?: string
}

export const economicCalendar: EconomicEvent[] = [
  { id: '1', date: '2026-04-09', time: '10:00', country: 'UEMOA', event: 'Réunion BCEAO - Taux directeur', importance: 'high', forecast: '5.00%', previous: '5.00%' },
  { id: '2', date: '2026-04-10', time: '09:00', country: 'Côte d\'Ivoire', event: 'IPC (Inflation) - Mars', importance: 'high', forecast: '4.3%', previous: '4.2%' },
  { id: '3', date: '2026-04-10', time: '14:00', country: 'Sénégal', event: 'Balance commerciale - Février', importance: 'medium', forecast: '-185 Mrd XOF', previous: '-192 Mrd XOF' },
  { id: '4', date: '2026-04-11', time: '11:00', country: 'UEMOA', event: 'PIB T1 2026 (Préliminaire)', importance: 'high', forecast: '5.8%', previous: '5.6%' },
  { id: '5', date: '2026-04-12', time: '10:00', country: 'Nigeria', event: 'Décision taux CBN', importance: 'high', forecast: '24.75%', previous: '24.75%' },
  { id: '6', date: '2026-04-14', time: '09:30', country: 'Burkina Faso', event: 'Production minière - Mars', importance: 'medium', previous: '+2.1%' },
  { id: '7', date: '2026-04-15', time: '15:00', country: 'Ghana', event: 'Réserves de change', importance: 'low', previous: '6.2 Mrd USD' },
]

// Market Indices
export interface MarketIndex {
  name: string
  value: number
  change: number
  changePercent: number
  yearToDate: number
}

export const marketIndices: MarketIndex[] = [
  { name: 'BRVM Composite', value: 242.85, change: 3.25, changePercent: 1.36, yearToDate: 8.5 },
  { name: 'BRVM 30', value: 118.42, change: 1.85, changePercent: 1.59, yearToDate: 9.2 },
  { name: 'BRVM Prestige', value: 108.56, change: 2.12, changePercent: 1.99, yearToDate: 11.4 },
  { name: 'NSE All-Share', value: 102458.25, change: -856.50, changePercent: -0.83, yearToDate: 5.8 },
  { name: 'GSE-CI', value: 4125.80, change: 28.45, changePercent: 0.69, yearToDate: 12.3 },
  { name: 'JSE Top 40', value: 78542.15, change: 425.80, changePercent: 0.55, yearToDate: 4.2 },
]

// Web TV Programs
export interface TVProgram {
  id: string
  title: string
  description: string
  duration: string
  thumbnail: string
  isLive?: boolean
  scheduledTime?: string
  category: string
}

export const tvPrograms: TVProgram[] = [
  { id: '1', title: 'Ouverture des Marchés', description: 'Analyse en direct de l\'ouverture de la BRVM', duration: '45 min', thumbnail: '/api/placeholder/320/180', isLive: true, category: 'Live' },
  { id: '2', title: 'Focus Macro UEMOA', description: 'Décryptage des indicateurs économiques de la zone', duration: '30 min', thumbnail: '/api/placeholder/320/180', scheduledTime: '11:00', category: 'Analyse' },
  { id: '3', title: 'Investir en Afrique', description: 'Stratégies d\'investissement sur les marchés africains', duration: '60 min', thumbnail: '/api/placeholder/320/180', scheduledTime: '14:00', category: 'Formation' },
  { id: '4', title: 'Le Point Bourse', description: 'Résumé de la séance et perspectives', duration: '20 min', thumbnail: '/api/placeholder/320/180', scheduledTime: '17:30', category: 'Synthèse' },
  { id: '5', title: 'Interview PDG SONATEL', description: 'Entretien exclusif sur la stratégie du groupe', duration: '45 min', thumbnail: '/api/placeholder/320/180', scheduledTime: '15:00', category: 'Interview' },
]
