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

// Seeded PRNG (mulberry32) — produces identical sequences on server and client
function createRng(seed: number) {
  let s = seed >>> 0
  return () => {
    s += 0x6d2b79f5
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t)
    return ((t ^ (t >>> 14)) >>> 0) / 0xffffffff
  }
}

export const generateStockHistory = (basePrice: number, days: number = 90): PricePoint[] => {
  const data: PricePoint[] = []
  let currentPrice = basePrice
  // Seed from basePrice + days so each stock/range combo is deterministic
  const rand = createRng(basePrice * 31 + days)
  // Use a fixed reference date so the series is stable across renders
  const now = new Date('2026-04-10T00:00:00Z')

  for (let i = days; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    const volatility = 0.02
    const change = (rand() - 0.5) * 2 * volatility * currentPrice
    const open = currentPrice
    const close = currentPrice + change
    const high = Math.max(open, close) + rand() * volatility * currentPrice * 0.5
    const low = Math.min(open, close) - rand() * volatility * currentPrice * 0.5

    data.push({
      date: date.toISOString().split('T')[0],
      open: Math.round(open),
      high: Math.round(high),
      low: Math.round(low),
      close: Math.round(close),
      volume: Math.floor(rand() * 50000) + 5000,
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

// Yield Curves – sovereign rates by country and maturity
export interface YieldPoint {
  maturity: string // '3M' | '6M' | '1Y' | '2Y' | '5Y' | '10Y'
  months: number
}

export interface CountryYields {
  country: string
  code: string
  color: string
  yields: { maturity: string; months: number; rate: number }[]
}

export const sovereignYields: CountryYields[] = [
  {
    country: "Côte d'Ivoire", code: 'CI', color: '#3b82f6',
    yields: [
      { maturity: '3M', months: 3, rate: 4.25 }, { maturity: '6M', months: 6, rate: 4.55 },
      { maturity: '1A', months: 12, rate: 4.90 }, { maturity: '2A', months: 24, rate: 5.40 },
      { maturity: '5A', months: 60, rate: 6.20 }, { maturity: '10A', months: 120, rate: 6.85 },
    ],
  },
  {
    country: 'Sénégal', code: 'SN', color: '#22c55e',
    yields: [
      { maturity: '3M', months: 3, rate: 4.50 }, { maturity: '6M', months: 6, rate: 4.85 },
      { maturity: '1A', months: 12, rate: 5.20 }, { maturity: '2A', months: 24, rate: 5.75 },
      { maturity: '5A', months: 60, rate: 6.60 }, { maturity: '10A', months: 120, rate: 7.30 },
    ],
  },
  {
    country: 'Burkina Faso', code: 'BF', color: '#f59e0b',
    yields: [
      { maturity: '3M', months: 3, rate: 5.10 }, { maturity: '6M', months: 6, rate: 5.50 },
      { maturity: '1A', months: 12, rate: 5.90 }, { maturity: '2A', months: 24, rate: 6.50 },
      { maturity: '5A', months: 60, rate: 7.40 }, { maturity: '10A', months: 120, rate: 8.20 },
    ],
  },
  {
    country: 'Mali', code: 'ML', color: '#ef4444',
    yields: [
      { maturity: '3M', months: 3, rate: 5.30 }, { maturity: '6M', months: 6, rate: 5.75 },
      { maturity: '1A', months: 12, rate: 6.20 }, { maturity: '2A', months: 24, rate: 6.80 },
      { maturity: '5A', months: 60, rate: 7.80 }, { maturity: '10A', months: 120, rate: 8.60 },
    ],
  },
  {
    country: 'Bénin', code: 'BJ', color: '#a855f7',
    yields: [
      { maturity: '3M', months: 3, rate: 4.40 }, { maturity: '6M', months: 6, rate: 4.70 },
      { maturity: '1A', months: 12, rate: 5.10 }, { maturity: '2A', months: 24, rate: 5.60 },
      { maturity: '5A', months: 60, rate: 6.40 }, { maturity: '10A', months: 120, rate: 7.10 },
    ],
  },
]

// Commodities
export interface Commodity {
  name: string
  symbol: string
  unit: string
  price: number
  change: number
  changePercent: number
  weekChange: number
  monthChange: number
  category: string
}

export const commodities: Commodity[] = [
  { name: 'Cacao', symbol: 'COCOA', unit: '$/tonne', price: 8450, change: 125, changePercent: 1.50, weekChange: 3.2, monthChange: 8.5, category: 'Agricole' },
  { name: 'Café Robusta', symbol: 'ROBUSTA', unit: '$/tonne', price: 4820, change: -65, changePercent: -1.33, weekChange: -2.1, monthChange: 5.8, category: 'Agricole' },
  { name: "Huile de palme", symbol: 'PALM', unit: '$/tonne', price: 1065, change: 18, changePercent: 1.72, weekChange: 2.8, monthChange: -1.2, category: 'Agricole' },
  { name: 'Coton', symbol: 'COTTON', unit: 'cents/lb', price: 88.5, change: -1.2, changePercent: -1.34, weekChange: -0.8, monthChange: 3.1, category: 'Agricole' },
  { name: 'Caoutchouc', symbol: 'RUBBER', unit: 'cents/kg', price: 198, change: 4.5, changePercent: 2.32, weekChange: 4.1, monthChange: 6.7, category: 'Agricole' },
  { name: 'Pétrole Brent', symbol: 'BRENT', unit: '$/baril', price: 84.25, change: -0.85, changePercent: -1.00, weekChange: -2.5, monthChange: -4.2, category: 'Énergie' },
  { name: 'Gaz naturel', symbol: 'NATGAS', unit: '$/MMBTU', price: 2.85, change: 0.08, changePercent: 2.89, weekChange: 5.2, monthChange: -8.1, category: 'Énergie' },
  { name: 'Or', symbol: 'GOLD', unit: '$/oz', price: 2345, change: 12.5, changePercent: 0.54, weekChange: 1.8, monthChange: 4.5, category: 'Métaux' },
  { name: 'Bauxite', symbol: 'BAUXI', unit: '$/tonne', price: 52.5, change: 0.8, changePercent: 1.55, weekChange: 2.1, monthChange: 3.8, category: 'Métaux' },
  { name: 'Phosphate', symbol: 'PHOS', unit: '$/tonne', price: 185, change: -3.5, changePercent: -1.86, weekChange: -1.2, monthChange: 2.4, category: 'Minéraux' },
]

// Public Finances & Sovereign Debt
export interface PublicFinance {
  country: string
  countryCode: string
  debtToGDP: number
  budgetDeficit: number
  debtService: number // % of revenues
  primaryBalance: number // % PIB
  rating: string
  outlook: 'positive' | 'stable' | 'negative'
  nextIssuance: string
  targetAmount: number // Mrd XOF
}

export const publicFinances: PublicFinance[] = [
  { country: "Côte d'Ivoire", countryCode: 'CI', debtToGDP: 52.8, budgetDeficit: -4.1, debtService: 28.5, primaryBalance: -1.2, rating: 'BB-', outlook: 'stable', nextIssuance: '2026-04-22', targetAmount: 150 },
  { country: 'Sénégal', countryCode: 'SN', debtToGDP: 68.5, budgetDeficit: -4.8, debtService: 32.1, primaryBalance: -2.1, rating: 'B+', outlook: 'stable', nextIssuance: '2026-04-29', targetAmount: 100 },
  { country: 'Burkina Faso', countryCode: 'BF', debtToGDP: 45.2, budgetDeficit: -5.2, debtService: 24.8, primaryBalance: -3.1, rating: 'CCC+', outlook: 'negative', nextIssuance: '2026-05-06', targetAmount: 75 },
  { country: 'Mali', countryCode: 'ML', debtToGDP: 48.6, budgetDeficit: -4.5, debtService: 22.3, primaryBalance: -2.8, rating: 'CCC', outlook: 'negative', nextIssuance: '2026-05-13', targetAmount: 60 },
  { country: 'Bénin', countryCode: 'BJ', debtToGDP: 42.1, budgetDeficit: -3.2, debtService: 19.5, primaryBalance: -0.8, rating: 'B+', outlook: 'positive', nextIssuance: '2026-04-30', targetAmount: 80 },
  { country: 'Niger', countryCode: 'NE', debtToGDP: 38.5, budgetDeficit: -5.8, debtService: 18.2, primaryBalance: -3.5, rating: 'CCC', outlook: 'negative', nextIssuance: '2026-05-20', targetAmount: 50 },
  { country: 'Togo', countryCode: 'TG', debtToGDP: 58.2, budgetDeficit: -3.8, debtService: 26.4, primaryBalance: -1.5, rating: 'B', outlook: 'stable', nextIssuance: '2026-05-07', targetAmount: 70 },
]

// Trade Balance
export interface TradeProduct {
  product: string
  category: string
  exports: number // Mrd XOF
  imports: number
  balance: number
  yoyChange: number
}

export interface CountryTrade {
  country: string
  countryCode: string
  totalExports: number
  totalImports: number
  tradeBalance: number
  mainExport: string
  mainImport: string
  products: TradeProduct[]
}

export const tradeData: CountryTrade[] = [
  {
    country: "Côte d'Ivoire", countryCode: 'CI',
    totalExports: 6850, totalImports: 5420, tradeBalance: 1430,
    mainExport: 'Cacao', mainImport: 'Pétrole raffiné',
    products: [
      { product: 'Cacao & dérivés', category: 'Agricole', exports: 2850, imports: 0, balance: 2850, yoyChange: 8.5 },
      { product: 'Pétrole raffiné', category: 'Énergie', exports: 0, imports: 1250, balance: -1250, yoyChange: -5.2 },
      { product: 'Caoutchouc', category: 'Agricole', exports: 680, imports: 0, balance: 680, yoyChange: 4.1 },
      { product: 'Noix de cajou', category: 'Agricole', exports: 520, imports: 0, balance: 520, yoyChange: 12.3 },
      { product: 'Or', category: 'Métaux', exports: 480, imports: 0, balance: 480, yoyChange: 18.5 },
    ],
  },
  {
    country: 'Sénégal', countryCode: 'SN',
    totalExports: 2950, totalImports: 4120, tradeBalance: -1170,
    mainExport: 'Pétrole brut', mainImport: 'Machines',
    products: [
      { product: 'Pétrole brut', category: 'Énergie', exports: 850, imports: 0, balance: 850, yoyChange: 42.5 },
      { product: 'Phosphate', category: 'Minéraux', exports: 380, imports: 0, balance: 380, yoyChange: 2.8 },
      { product: 'Machines & équipements', category: 'Industrie', exports: 0, imports: 1250, balance: -1250, yoyChange: 8.2 },
      { product: 'Produits pétroliers', category: 'Énergie', exports: 0, imports: 680, balance: -680, yoyChange: -3.1 },
      { product: 'Arachides', category: 'Agricole', exports: 290, imports: 0, balance: 290, yoyChange: -1.5 },
    ],
  },
]

// Regional Analysis
export interface RegionalRanking {
  country: string
  countryCode: string
  stabilityScore: number // 0-100
  growthScore: number
  fiscalScore: number
  monetaryScore: number
  compositeScore: number
  rank: number
  trend: 'up' | 'stable' | 'down'
  alert?: string
}

export const regionalRankings: RegionalRanking[] = [
  { country: "Côte d'Ivoire", countryCode: 'CI', stabilityScore: 78, growthScore: 85, fiscalScore: 72, monetaryScore: 80, compositeScore: 78.8, rank: 1, trend: 'up' },
  { country: 'Bénin', countryCode: 'BJ', stabilityScore: 75, growthScore: 78, fiscalScore: 80, monetaryScore: 76, compositeScore: 77.3, rank: 2, trend: 'stable' },
  { country: 'Sénégal', countryCode: 'SN', stabilityScore: 72, growthScore: 75, fiscalScore: 65, monetaryScore: 74, compositeScore: 71.5, rank: 3, trend: 'up' },
  { country: 'Togo', countryCode: 'TG', stabilityScore: 68, growthScore: 70, fiscalScore: 68, monetaryScore: 70, compositeScore: 69.0, rank: 4, trend: 'stable' },
  { country: 'Burkina Faso', countryCode: 'BF', stabilityScore: 42, growthScore: 58, fiscalScore: 62, monetaryScore: 65, compositeScore: 56.8, rank: 5, trend: 'down', alert: 'Risque sécuritaire élevé' },
  { country: 'Mali', countryCode: 'ML', stabilityScore: 38, growthScore: 52, fiscalScore: 58, monetaryScore: 60, compositeScore: 52.0, rank: 6, trend: 'down', alert: 'Instabilité politique' },
  { country: 'Niger', countryCode: 'NE', stabilityScore: 35, growthScore: 60, fiscalScore: 55, monetaryScore: 58, compositeScore: 52.0, rank: 7, trend: 'down', alert: 'Sanctions CEDEAO levées' },
  { country: 'Guinée-Bissau', countryCode: 'GW', stabilityScore: 48, growthScore: 45, fiscalScore: 50, monetaryScore: 55, compositeScore: 49.5, rank: 8, trend: 'stable' },
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
