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
// BRVM Stock Data
export interface Indices {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap: number
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

export const brvmIndices: Indices[] = [
  { symbol: 'BRVM-C', name: 'BRVM Compose', price: 12500, change: -150, changePercent: -1.19, volume: 8230, marketCap: 875000000000 },
  { symbol: 'BRVM-30', name: 'BRVM 30', price: 15850, change: 250, changePercent: 1.60, volume: 12450, marketCap: 1585000000000  },
  { symbol: 'BRVM-PRES', name: 'BRVM Prestige', price: 4200, change: 85, changePercent: 2.07, volume: 5680, marketCap: 420000000000 },
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

// ─── Module 2 — Gestion de Portefeuilles ─────────────────────────────────────

export interface PortfolioHolding {
  symbol: string
  name: string
  quantity: number
  avgPrice: number
  currentPrice: number
  value: number
  pnl: number
  pnlPercent: number
  weight: number
  sector: string
  change: number
  changePercent: number
}

export const portfolioHoldings: PortfolioHolding[] = [
  { symbol: 'SNTS', name: 'SONATEL', quantity: 50, avgPrice: 15200, currentPrice: 15850, value: 792500, pnl: 32500, pnlPercent: 4.28, weight: 44.5, sector: 'Télécommunications', change: 250, changePercent: 1.60 },
  { symbol: 'SGBC', name: 'SGBCI', quantity: 30, avgPrice: 12800, currentPrice: 12500, value: 375000, pnl: -9000, pnlPercent: -2.34, weight: 21.1, sector: 'Finance', change: -150, changePercent: -1.19 },
  { symbol: 'PALC', name: 'PALM CI', quantity: 40, avgPrice: 6900, currentPrice: 7250, value: 290000, pnl: 14000, pnlPercent: 5.07, weight: 16.3, sector: 'Agriculture', change: 180, changePercent: 2.55 },
  { symbol: 'ETIT', name: 'ECOBANK TG', quantity: 1000, avgPrice: 16.5, currentPrice: 18, value: 18000, pnl: 1500, pnlPercent: 9.09, weight: 1.0, sector: 'Finance', change: 0.5, changePercent: 2.86 },
  { symbol: 'SIBC', name: 'SIB CI', quantity: 20, avgPrice: 5100, currentPrice: 4850, value: 97000, pnl: -5000, pnlPercent: -4.90, weight: 5.5, sector: 'Finance', change: -65, changePercent: -1.32 },
  { symbol: 'BOAB', name: 'BOA BENIN', quantity: 35, avgPrice: 5700, currentPrice: 5900, value: 206500, pnl: 7000, pnlPercent: 3.51, weight: 11.6, sector: 'Finance', change: 45, changePercent: 0.77 },
]

export interface PortfolioPerf {
  month: string
  value: number
  benchmark: number
}

function buildPortfolioPerf(): PortfolioPerf[] {
  const months = ['avr. 25', 'mai 25', 'juin 25', 'juil. 25', 'août 25', 'sept. 25', 'oct. 25', 'nov. 25', 'déc. 25', 'janv. 26', 'févr. 26', 'mars 26']
  const rng = createRng(99999)
  let v = 1500000
  let b = 235
  return months.map(month => {
    v = v * (1 + (rng() - 0.44) * 0.05)
    b = b * (1 + (rng() - 0.44) * 0.04)
    return { month, value: Math.round(v), benchmark: Math.round(b * 100) / 100 }
  })
}

export const portfolioPerformance: PortfolioPerf[] = buildPortfolioPerf()

export const portfolioRiskMetrics = {
  var95: 3.2,
  var99: 5.1,
  volatility: 14.8,
  sharpe: 1.42,
  beta: 0.87,
  maxDrawdown: -8.4,
  alpha: 3.1,
}

export interface WatchlistItem {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  alertPrice?: number
  sector: string
}

export const watchlistItems: WatchlistItem[] = [
  { symbol: 'SLBC', name: 'SOLIBRA', price: 175000, change: 2500, changePercent: 1.45, alertPrice: 180000, sector: 'Industrie' },
  { symbol: 'BOAM', name: 'BOA MALI', price: 1850, change: -25, changePercent: -1.33, sector: 'Finance' },
  { symbol: 'NSBC', name: 'NSIA BANQUE', price: 6100, change: -85, changePercent: -1.37, alertPrice: 5800, sector: 'Finance' },
  { symbol: 'TTLS', name: 'TOTAL SENEGAL', price: 2150, change: 35, changePercent: 1.65, sector: 'Distribution' },
  { symbol: 'SOGC', name: 'SOGB CI', price: 4100, change: 95, changePercent: 2.37, alertPrice: 4500, sector: 'Agriculture' },
]

export interface OrderHistory {
  id: string
  date: string
  symbol: string
  type: 'achat' | 'vente'
  quantity: number
  price: number
  total: number
  status: 'exécuté' | 'annulé' | 'en_attente'
}

export const orderHistory: OrderHistory[] = [
  { id: 'ORD-001', date: '2026-04-10', symbol: 'SNTS', type: 'achat', quantity: 10, price: 15600, total: 156000, status: 'exécuté' },
  { id: 'ORD-002', date: '2026-04-08', symbol: 'SGBC', type: 'vente', quantity: 5, price: 12700, total: 63500, status: 'exécuté' },
  { id: 'ORD-003', date: '2026-04-07', symbol: 'PALC', type: 'achat', quantity: 20, price: 7100, total: 142000, status: 'exécuté' },
  { id: 'ORD-004', date: '2026-04-05', symbol: 'ETIT', type: 'achat', quantity: 500, price: 17, total: 8500, status: 'exécuté' },
  { id: 'ORD-005', date: '2026-04-03', symbol: 'SLBC', type: 'achat', quantity: 2, price: 173000, total: 346000, status: 'annulé' },
  { id: 'ORD-006', date: '2026-04-01', symbol: 'SIBC', type: 'vente', quantity: 10, price: 5050, total: 50500, status: 'exécuté' },
  { id: 'ORD-007', date: '2026-03-28', symbol: 'BOAB', type: 'achat', quantity: 15, price: 5650, total: 84750, status: 'exécuté' },
  { id: 'ORD-008', date: '2026-03-25', symbol: 'SNTS', type: 'vente', quantity: 5, price: 15750, total: 78750, status: 'en_attente' },
]

// ─── Module 3 — Analyse Financière et Risque ─────────────────────────────────

export interface CompanyFinancialYear {
  year: number
  revenue: number
  ebitda: number
  netIncome: number
}

export interface CompanyProfile {
  symbol: string
  name: string
  fullName: string
  sector: string
  country: string
  founded: number
  employees: number
  description: string
  ceo: string
  headquarters: string
  isin: string
  listing: string
  revenue: number
  revenueGrowth: number
  ebitdaMargin: number
  netMargin: number
  totalAssets: number
  equity: number
  dividendYield: number
  revenueHistory: CompanyFinancialYear[]
}

function buildRevHistory(base: number, seed: number): CompanyFinancialYear[] {
  const rng = createRng(seed)
  let rev = base * 0.75
  return [2021, 2022, 2023, 2024, 2025].map(year => {
    rev = rev * (1 + 0.06 + (rng() - 0.4) * 0.08)
    const ebitdaPct = 0.30 + rng() * 0.20
    const niPct = 0.12 + rng() * 0.15
    return { year, revenue: Math.round(rev), ebitda: Math.round(rev * ebitdaPct), netIncome: Math.round(rev * niPct) }
  })
}

export const companyProfiles: CompanyProfile[] = [
  {
    symbol: 'SNTS', name: 'SONATEL', fullName: 'Société Nationale des Télécommunications du Sénégal',
    sector: 'Télécommunications', country: 'Sénégal', founded: 1997, employees: 3800,
    description: 'Opérateur télécom leader en Afrique de l\'Ouest, filiale d\'Orange, présent au Sénégal, Mali, Guinée, Guinée-Bissau et Sierra Leone.',
    ceo: 'Sékou Dramé', headquarters: 'Dakar, Sénégal', isin: 'SN0000000019', listing: 'BRVM – Première catégorie',
    revenue: 1850, revenueGrowth: 12.0, ebitdaMargin: 42.0, netMargin: 20.8, totalAssets: 3200, equity: 1400, dividendYield: 4.8,
    revenueHistory: buildRevHistory(1850, 1850 * 17),
  },
  {
    symbol: 'SGBC', name: 'SGBCI', fullName: 'Société Générale de Banques en Côte d\'Ivoire',
    sector: 'Finance', country: 'Côte d\'Ivoire', founded: 1985, employees: 1650,
    description: 'Banque commerciale ivoirienne, filiale du groupe Société Générale, leader du financement des entreprises et des particuliers en CI.',
    ceo: 'Aymeric Magne', headquarters: 'Abidjan, Côte d\'Ivoire', isin: 'CI0000000009', listing: 'BRVM – Première catégorie',
    revenue: 285, revenueGrowth: 8.5, ebitdaMargin: 55.0, netMargin: 28.4, totalAssets: 4800, equity: 620, dividendYield: 5.2,
    revenueHistory: buildRevHistory(285, 12500 * 17),
  },
  {
    symbol: 'ETIT', name: 'ECOBANK TG', fullName: 'Ecobank Transnational Incorporated – Togo',
    sector: 'Finance', country: 'Togo', founded: 1985, employees: 14500,
    description: 'Pan-African banking group present in 33 African countries. Ecobank is the leading pan-African bank with a strong focus on digital banking.',
    ceo: 'Jeremy Awori', headquarters: 'Lomé, Togo', isin: 'TG0000000028', listing: 'BRVM – Première catégorie',
    revenue: 420, revenueGrowth: 9.2, ebitdaMargin: 48.0, netMargin: 18.1, totalAssets: 8500, equity: 980, dividendYield: 2.1,
    revenueHistory: buildRevHistory(420, 18 * 31 * 17),
  },
  {
    symbol: 'PALC', name: 'PALM CI', fullName: 'Palmafrique Côte d\'Ivoire',
    sector: 'Agriculture', country: 'Côte d\'Ivoire', founded: 1963, employees: 8200,
    description: 'Premier producteur et transformateur d\'huile de palme en Côte d\'Ivoire. Exploite plus de 28 000 hectares de palmeraies industrielles.',
    ceo: 'Jean-Luc Bied-Charreton', headquarters: 'Abidjan, Côte d\'Ivoire', isin: 'CI0000000025', listing: 'BRVM – Deuxième catégorie',
    revenue: 320, revenueGrowth: 6.8, ebitdaMargin: 28.0, netMargin: 12.5, totalAssets: 850, equity: 420, dividendYield: 3.6,
    revenueHistory: buildRevHistory(320, 7250 * 17),
  },
]

export interface FinancialRatios {
  symbol: string
  name: string
  per: number
  pbr: number
  roe: number
  evEbitda: number
  dividendYield: number
  debtEquity: number
  currentRatio: number
  netMargin: number
  revenueGrowth: number
  sector: string
}

function buildRatios(s: { symbol: string; name: string; price: number; sector: string }): FinancialRatios {
  const rng = createRng(s.price * 13)
  return {
    symbol: s.symbol, name: s.name, sector: s.sector,
    per: Math.round((8 + rng() * 12) * 10) / 10,
    pbr: Math.round((1.2 + rng() * 2.5) * 10) / 10,
    roe: Math.round((10 + rng() * 20) * 10) / 10,
    evEbitda: Math.round((4 + rng() * 8) * 10) / 10,
    dividendYield: Math.round((1.5 + rng() * 4.5) * 10) / 10,
    debtEquity: Math.round((0.2 + rng() * 1.8) * 10) / 10,
    currentRatio: Math.round((0.8 + rng() * 2.2) * 10) / 10,
    netMargin: Math.round((8 + rng() * 25) * 10) / 10,
    revenueGrowth: Math.round((2 + rng() * 18 - 2) * 10) / 10,
  }
}

export const financialRatios: FinancialRatios[] = [
  { symbol: 'SNTS', name: 'SONATEL', sector: 'Télécommunications', per: 12.4, pbr: 3.2, roe: 26.1, evEbitda: 7.8, dividendYield: 4.8, debtEquity: 0.4, currentRatio: 1.8, netMargin: 20.8, revenueGrowth: 12.0 },
  { symbol: 'SGBC', name: 'SGBCI', sector: 'Finance', per: 8.6, pbr: 1.8, roe: 21.4, evEbitda: 5.2, dividendYield: 5.2, debtEquity: 2.8, currentRatio: 1.2, netMargin: 28.4, revenueGrowth: 8.5 },
  { symbol: 'ETIT', name: 'ECOBANK TG', sector: 'Finance', per: 15.2, pbr: 2.1, roe: 14.8, evEbitda: 9.3, dividendYield: 2.1, debtEquity: 3.2, currentRatio: 1.0, netMargin: 18.1, revenueGrowth: 9.2 },
  { symbol: 'PALC', name: 'PALM CI', sector: 'Agriculture', per: 11.8, pbr: 2.6, roe: 22.0, evEbitda: 6.7, dividendYield: 3.6, debtEquity: 0.6, currentRatio: 2.1, netMargin: 12.5, revenueGrowth: 6.8 },
  ...brvmStocks.filter(s => !['SNTS','SGBC','ETIT','PALC'].includes(s.symbol)).map(buildRatios),
]

export interface RiskDimension {
  name: string
  score: number
  label: 'Faible' | 'Modéré' | 'Élevé' | 'Critique'
  details: string
}

export interface CountryRiskCard {
  country: string
  countryCode: string
  overallScore: number
  overallLabel: string
  ratingMoodys: string
  ratingSP: string
  ratingFitch: string
  outlook: 'positive' | 'stable' | 'negative'
  dimensions: RiskDimension[]
  lastUpdated: string
  previousScore: number
}

function riskLabel(score: number): 'Faible' | 'Modéré' | 'Élevé' | 'Critique' {
  if (score <= 30) return 'Faible'
  if (score <= 55) return 'Modéré'
  if (score <= 75) return 'Élevé'
  return 'Critique'
}

export const countryRiskCards: CountryRiskCard[] = [
  {
    country: "Côte d'Ivoire", countryCode: 'CI', overallScore: 32, overallLabel: 'Modéré',
    ratingMoodys: 'Ba3', ratingSP: 'BB-', ratingFitch: 'B+', outlook: 'stable', lastUpdated: '2026-04-10', previousScore: 35,
    dimensions: [
      { name: 'Politique', score: 28, label: riskLabel(28), details: 'Démocratie stable depuis 2011, alternance respectée' },
      { name: 'Économique', score: 22, label: riskLabel(22), details: 'Croissance 6.5%, diversification en cours' },
      { name: 'Fiscal', score: 38, label: riskLabel(38), details: 'Déficit -4.1% PIB, dette 52.8% PIB' },
      { name: 'Externe', score: 30, label: riskLabel(30), details: 'Balance commerciale excédentaire +1430 Mrd XOF' },
      { name: 'Sécuritaire', score: 35, label: riskLabel(35), details: 'Risques frontaliers nord, sécurité intérieure maîtrisée' },
      { name: 'Institutionnel', score: 40, label: riskLabel(40), details: 'Justice indépendante, corruption modérée' },
    ],
  },
  {
    country: 'Sénégal', countryCode: 'SN', overallScore: 38, overallLabel: 'Modéré',
    ratingMoodys: 'Ba3', ratingSP: 'B+', ratingFitch: 'B+', outlook: 'stable', lastUpdated: '2026-04-10', previousScore: 42,
    dimensions: [
      { name: 'Politique', score: 30, label: riskLabel(30), details: 'Transition démocratique 2024, nouveau gouvernement stable' },
      { name: 'Économique', score: 25, label: riskLabel(25), details: 'Croissance 5.8%, boost pétrolier attendu' },
      { name: 'Fiscal', score: 48, label: riskLabel(48), details: 'Déficit -4.8%, dette 68.5% PIB en hausse' },
      { name: 'Externe', score: 55, label: riskLabel(55), details: 'Déficit courant -11.2% PIB, forte dépendance imports' },
      { name: 'Sécuritaire', score: 28, label: riskLabel(28), details: 'Conflit Casamance résiduel, sécurité urbaine correcte' },
      { name: 'Institutionnel', score: 35, label: riskLabel(35), details: 'Institutions solides, presse libre' },
    ],
  },
  {
    country: 'Burkina Faso', countryCode: 'BF', overallScore: 72, overallLabel: 'Élevé',
    ratingMoodys: 'Caa1', ratingSP: 'CCC+', ratingFitch: 'CCC', outlook: 'negative', lastUpdated: '2026-04-10', previousScore: 68,
    dimensions: [
      { name: 'Politique', score: 82, label: riskLabel(82), details: 'Junte militaire au pouvoir depuis 2022, démocratie suspendue' },
      { name: 'Économique', score: 55, label: riskLabel(55), details: 'Croissance 4.2% malgré crise, mines en production' },
      { name: 'Fiscal', score: 62, label: riskLabel(62), details: 'Déficit -5.2%, contraintes accès marchés financiers' },
      { name: 'Externe', score: 68, label: riskLabel(68), details: 'Isolement diplomatique croissant, aide suspendue' },
      { name: 'Sécuritaire', score: 88, label: riskLabel(88), details: 'Groupes armés contrôlent ~40% du territoire' },
      { name: 'Institutionnel', score: 75, label: riskLabel(75), details: 'Justice sous influence militaire, médias censurés' },
    ],
  },
  {
    country: 'Mali', countryCode: 'ML', overallScore: 78, overallLabel: 'Élevé',
    ratingMoodys: 'Caa2', ratingSP: 'CCC', ratingFitch: 'CCC-', outlook: 'negative', lastUpdated: '2026-04-10', previousScore: 74,
    dimensions: [
      { name: 'Politique', score: 85, label: riskLabel(85), details: 'Transition militaire prolongée, élections repoussées' },
      { name: 'Économique', score: 60, label: riskLabel(60), details: 'Croissance 3.5%, or principal ressource' },
      { name: 'Fiscal', score: 65, label: riskLabel(65), details: 'Déficit -4.5%, accès limité aux marchés internationaux' },
      { name: 'Externe', score: 72, label: riskLabel(72), details: 'Sanctions partielles levées, relations tendues avec CEDEAO' },
      { name: 'Sécuritaire', score: 90, label: riskLabel(90), details: 'Conflit actif nord et centre, présence Wagner/AES' },
      { name: 'Institutionnel', score: 78, label: riskLabel(78), details: 'État de droit fragilisé, corruption systémique' },
    ],
  },
  {
    country: 'Bénin', countryCode: 'BJ', overallScore: 28, overallLabel: 'Faible',
    ratingMoodys: 'B2', ratingSP: 'B+', ratingFitch: 'B', outlook: 'positive', lastUpdated: '2026-04-10', previousScore: 32,
    dimensions: [
      { name: 'Politique', score: 25, label: riskLabel(25), details: 'Gouvernement stable, réformes structurelles avancées' },
      { name: 'Économique', score: 22, label: riskLabel(22), details: 'Croissance 5.9%, diversification agriculture-industrie' },
      { name: 'Fiscal', score: 35, label: riskLabel(35), details: 'Déficit -3.2% PIB, meilleur score UEMOA' },
      { name: 'Externe', score: 30, label: riskLabel(30), details: 'Balance -4.5% PIB, IDE en hausse +420 M USD' },
      { name: 'Sécuritaire', score: 32, label: riskLabel(32), details: 'Risque débordement nord (BF), sécurité côtière gérée' },
      { name: 'Institutionnel', score: 28, label: riskLabel(28), details: 'Réformes judiciaires, gouvernance améliorée' },
    ],
  },
]

// ─── Module 5 — Communication & Éducation ────────────────────────────────────

export const moreNewsItems: NewsItem[] = [
  { id: '9', title: 'Ecobank remporte le prix de la meilleure banque digitale', source: 'Jeune Afrique', category: 'Banque', timestamp: '2026-04-10T08:00:00Z', summary: 'Le groupe panafricain est distingué pour sa plateforme Ecobank Mobile.' },
  { id: '10', title: 'Les prix du cacao franchissent 8 500 $/tonne', source: 'Bloomberg Africa', category: 'Agriculture', timestamp: '2026-04-10T07:30:00Z', summary: 'Nouveau record historique porté par les tensions d\'approvisionnement en Côte d\'Ivoire.', isBreaking: true },
  { id: '11', title: 'PALM CI annonce l\'expansion de ses palmeraies de 5 000 ha', source: 'Agence Ecofin', category: 'Entreprise', timestamp: '2026-04-09T15:00:00Z', summary: 'L\'investissement de 12 Mrd XOF vise à renforcer la capacité de production d\'ici 2028.' },
  { id: '12', title: 'BRVM lance son programme de cotation accélérée PME', source: 'BRVM News', category: 'Marché', timestamp: '2026-04-09T12:00:00Z', summary: 'Cinq nouvelles entreprises attendues sur le compartiment croissance avant fin 2026.' },
  { id: '13', title: 'Le Sénégal placarde 150 Mrd XOF d\'OAT à 7 ans', source: 'Reuters Africa', category: 'Macro', timestamp: '2026-04-08T18:00:00Z', summary: 'L\'émission obligataire est sursouscrite 2,4 fois, signe de la confiance des marchés.' },
  { id: '14', title: 'Total Sénégal augmente ses capacités de stockage', source: 'Africa Oil & Power', category: 'Énergie', timestamp: '2026-04-08T10:00:00Z', summary: 'Un terminal pétrolier à Dakar portera la capacité nationale à 800 000 m³.' },
  { id: '15', title: 'Niger : la production d\'uranium repart à la hausse', source: 'Financial Afrik', category: 'Énergie', timestamp: '2026-04-07T16:00:00Z', summary: 'Orano reprend partiellement les opérations après la reprise des discussions avec Niamey.' },
  { id: '16', title: 'Réforme fiscale UEMOA : TVA unifiée à 18% en discussion', source: 'La Tribune Afrique', category: 'Politique Monétaire', timestamp: '2026-04-07T11:00:00Z', summary: 'La Commission UEMOA propose une harmonisation des taux de TVA pour 2027.' },
  { id: '17', title: 'Forum Investir en Afrique de l\'Ouest — Abidjan 2026', source: 'BRVM News', category: 'Événement', timestamp: '2026-04-06T09:00:00Z', summary: 'Plus de 800 investisseurs attendus les 18-19 mai à l\'HÔTEL IVOIRE pour la 8ème édition.' },
  { id: '18', title: 'Côte d\'Ivoire : émission inaugurale d\'obligations vertes', source: 'Bloomberg Africa', category: 'Marché', timestamp: '2026-04-05T14:00:00Z', summary: 'Première obligtion souveraine verte de la zone UEMOA, levée de 200 Mrd XOF.', isBreaking: true },
]

export interface PriceAlert {
  id: string
  symbol: string
  name: string
  type: 'above' | 'below'
  targetPrice: number
  currentPrice: number
  active: boolean
  createdAt: string
  triggeredAt?: string
}

export const priceAlerts: PriceAlert[] = [
  { id: 'ALT-001', symbol: 'SNTS', name: 'SONATEL', type: 'above', targetPrice: 16500, currentPrice: 15850, active: true, createdAt: '2026-04-05' },
  { id: 'ALT-002', symbol: 'SGBC', name: 'SGBCI', type: 'below', targetPrice: 12000, currentPrice: 12500, active: true, createdAt: '2026-04-03' },
  { id: 'ALT-003', symbol: 'PALC', name: 'PALM CI', type: 'above', targetPrice: 7000, currentPrice: 7250, active: false, createdAt: '2026-03-20', triggeredAt: '2026-04-08' },
  { id: 'ALT-004', symbol: 'SLBC', name: 'SOLIBRA', type: 'above', targetPrice: 180000, currentPrice: 175000, active: true, createdAt: '2026-04-01' },
  { id: 'ALT-005', symbol: 'ETIT', name: 'ECOBANK TG', type: 'below', targetPrice: 15, currentPrice: 18, active: true, createdAt: '2026-04-10' },
]

export interface EducationArticle {
  id: string
  title: string
  category: string
  level: 'débutant' | 'intermédiaire' | 'avancé'
  duration: string
  author: string
  publishedAt: string
  tags: string[]
  summary: string
}

export const educationArticles: EducationArticle[] = [
  { id: 'ART-001', title: 'Introduction à la BRVM : comment fonctionne la bourse régionale ?', category: 'Marchés', level: 'débutant', duration: '8 min', author: 'Équipe Bloomfield', publishedAt: '2026-04-01', tags: ['BRVM', 'Bourse', 'UEMOA'], summary: 'Comprendre le fonctionnement de la Bourse Régionale des Valeurs Mobilières, ses indices et ses acteurs.' },
  { id: 'ART-002', title: 'Lire et analyser un carnet d\'ordres', category: 'Analyse', level: 'intermédiaire', duration: '12 min', author: 'Dr. Koné Mamadou', publishedAt: '2026-03-28', tags: ['Carnet d\'ordres', 'Liquidité', 'Trading'], summary: 'Décryptage du bid-ask spread, des niveaux de profondeur et des signaux de trading à en tirer.' },
  { id: 'ART-003', title: 'Les indicateurs techniques RSI et MACD appliqués aux actions BRVM', category: 'Analyse Technique', level: 'avancé', duration: '18 min', author: 'Fatou Diallo, CFA', publishedAt: '2026-03-25', tags: ['RSI', 'MACD', 'Technique'], summary: 'Application des indicateurs de momentum sur les titres BRVM avec études de cas réels.' },
  { id: 'ART-004', title: 'Construire un portefeuille diversifié sur les marchés africains', category: 'Gestion', level: 'intermédiaire', duration: '15 min', author: 'Bloomfield Research', publishedAt: '2026-03-20', tags: ['Portefeuille', 'Diversification', 'Risque'], summary: 'Principes de construction de portefeuille adaptés au contexte des marchés financiers d\'Afrique de l\'Ouest.' },
  { id: 'ART-005', title: 'Comprendre les obligations souveraines de l\'UEMOA', category: 'Obligations', level: 'débutant', duration: '10 min', author: 'Équipe Bloomfield', publishedAt: '2026-03-15', tags: ['Obligations', 'OAT', 'BCEAO'], summary: 'Fonctionnement des adjudications du Trésor, taux et maturités des titres d\'État UEMOA.' },
  { id: 'ART-006', title: 'Analyse fondamentale : évaluer une société cotée à la BRVM', category: 'Analyse Fondamentale', level: 'avancé', duration: '20 min', author: 'Ibrahima Sow, CFA', publishedAt: '2026-03-10', tags: ['Fondamentaux', 'PER', 'Valorisation'], summary: 'De l\'analyse des états financiers au calcul de la juste valeur d\'une action africaine.' },
  { id: 'ART-007', title: 'Les matières premières africaines et leur impact sur les marchés', category: 'Macro', level: 'intermédiaire', duration: '14 min', author: 'Aïcha Traoré', publishedAt: '2026-03-05', tags: ['Cacao', 'Or', 'Matières premières'], summary: 'Comment les prix du cacao, de l\'or et du pétrole influencent les actions cotées à la BRVM.' },
  { id: 'ART-008', title: 'Le risque de change pour l\'investisseur africain', category: 'Risque', level: 'intermédiaire', duration: '11 min', author: 'Équipe Bloomfield', publishedAt: '2026-02-28', tags: ['Forex', 'XOF', 'Risque'], summary: 'Impact de la parité XOF/EUR et des autres devises sur la performance des actifs africains.' },
]

export interface Webinar {
  id: string
  title: string
  presenter: string
  scheduledAt: string
  duration: string
  topic: string
  registrations: number
  isLive: boolean
}

export const webinars: Webinar[] = [
  { id: 'WEB-001', title: 'Stratégies de trading sur la BRVM — Session Live', presenter: 'Fatou Diallo, CFA', scheduledAt: '2026-04-12T10:00:00Z', duration: '90 min', topic: 'Trading', registrations: 342, isLive: true },
  { id: 'WEB-002', title: 'Perspectives macro UEMOA Q2 2026', presenter: 'Dr. Koné Mamadou', scheduledAt: '2026-04-15T14:00:00Z', duration: '60 min', topic: 'Macro', registrations: 215, isLive: false },
  { id: 'WEB-003', title: 'Construction de portefeuille — Niveau avancé', presenter: 'Ibrahima Sow, CFA', scheduledAt: '2026-04-22T10:00:00Z', duration: '120 min', topic: 'Gestion', registrations: 178, isLive: false },
  { id: 'WEB-004', title: 'Introduction aux obligations souveraines africaines', presenter: 'Équipe Bloomfield', scheduledAt: '2026-04-29T15:00:00Z', duration: '60 min', topic: 'Obligations', registrations: 124, isLive: false },
]

// ─── Back-office Administration ───────────────────────────────────────────────

export type UserRole = 'super-admin' | 'admin' | 'analyste' | 'trader' | 'lecture-seule'

export interface AdminUser {
  id: string
  name: string
  email: string
  role: UserRole
  country: string
  lastLogin: string
  status: 'actif' | 'suspendu' | 'en_attente'
  createdAt: string
  permissions: string[]
}

export const adminUsers: AdminUser[] = [
  { id: 'USR-001', name: 'Amadou Diallo', email: 'amadou.diallo@bloomfield.com', role: 'super-admin', country: 'Sénégal', lastLogin: '2026-04-12T08:45:00Z', status: 'actif', createdAt: '2024-01-15', permissions: ['*'] },
  { id: 'USR-002', name: 'Fatou Ndiaye', email: 'fatou.ndiaye@bloomfield.com', role: 'admin', country: 'Côte d\'Ivoire', lastLogin: '2026-04-12T07:30:00Z', status: 'actif', createdAt: '2024-02-20', permissions: ['users', 'data', 'reports'] },
  { id: 'USR-003', name: 'Kofi Asante', email: 'kofi.asante@sgi-ci.com', role: 'trader', country: 'Côte d\'Ivoire', lastLogin: '2026-04-11T16:00:00Z', status: 'actif', createdAt: '2024-06-10', permissions: ['markets', 'orders', 'portfolio'] },
  { id: 'USR-004', name: 'Mariama Bah', email: 'mariama.bah@bceao.int', role: 'analyste', country: 'Guinée', lastLogin: '2026-04-10T14:20:00Z', status: 'actif', createdAt: '2024-07-01', permissions: ['markets', 'macro', 'reports'] },
  { id: 'USR-005', name: 'Ousmane Traoré', email: 'ousmane.traore@invest-bf.com', role: 'lecture-seule', country: 'Burkina Faso', lastLogin: '2026-04-09T11:00:00Z', status: 'suspendu', createdAt: '2024-09-15', permissions: ['markets'] },
  { id: 'USR-006', name: 'Awa Coulibaly', email: 'awa.coulibaly@mef-mali.gov', role: 'analyste', country: 'Mali', lastLogin: '2026-04-08T09:45:00Z', status: 'actif', createdAt: '2024-10-20', permissions: ['macro', 'reports'] },
  { id: 'USR-007', name: 'Jean-Pierre Hounkpé', email: 'jp.hounkpe@bj-invest.com', role: 'trader', country: 'Bénin', lastLogin: '2026-04-12T06:30:00Z', status: 'actif', createdAt: '2025-01-05', permissions: ['markets', 'orders', 'portfolio'] },
  { id: 'USR-008', name: 'Ndéye Fall', email: 'ndeye.fall@new-analyst.com', role: 'lecture-seule', country: 'Sénégal', lastLogin: '', status: 'en_attente', createdAt: '2026-04-11', permissions: ['markets'] },
]

export interface AuditLogEntry {
  id: string
  timestamp: string
  userId: string
  userName: string
  action: string
  resource: string
  ipAddress: string
  status: 'succès' | 'échec'
  details?: string
}

export const auditLog: AuditLogEntry[] = [
  { id: 'LOG-001', timestamp: '2026-04-12T08:52:14Z', userId: 'USR-001', userName: 'Amadou Diallo', action: 'connexion', resource: 'Authentification', ipAddress: '41.82.12.5', status: 'succès' },
  { id: 'LOG-002', timestamp: '2026-04-12T08:50:02Z', userId: 'USR-002', userName: 'Fatou Ndiaye', action: 'modification_utilisateur', resource: 'USR-008', ipAddress: '41.82.15.2', status: 'succès', details: 'Changement rôle : lecture-seule → analyste (en attente)' },
  { id: 'LOG-003', timestamp: '2026-04-12T08:30:45Z', userId: 'USR-003', userName: 'Kofi Asante', action: 'export_données', resource: 'Cotations BRVM', ipAddress: '154.66.8.22', status: 'succès', details: 'Export CSV 90 jours — 12 titres' },
  { id: 'LOG-004', timestamp: '2026-04-12T07:45:00Z', userId: 'USR-002', userName: 'Fatou Ndiaye', action: 'mise_a_jour_donnees', resource: 'Indicateurs Macro', ipAddress: '41.82.15.2', status: 'succès', details: 'Mise à jour PIB T1 2026 — 8 pays' },
  { id: 'LOG-005', timestamp: '2026-04-12T07:30:12Z', userId: 'UNKNOWN', userName: 'Inconnu', action: 'tentative_connexion', resource: 'Authentification', ipAddress: '185.220.101.42', status: 'échec', details: 'Mot de passe incorrect — 3 tentatives' },
  { id: 'LOG-006', timestamp: '2026-04-11T17:20:00Z', userId: 'USR-004', userName: 'Mariama Bah', action: 'consultation_rapport', resource: 'Rapport Risque Pays', ipAddress: '196.14.88.5', status: 'succès' },
  { id: 'LOG-007', timestamp: '2026-04-11T16:05:30Z', userId: 'USR-003', userName: 'Kofi Asante', action: 'modification_alerte', resource: 'ALT-003', ipAddress: '154.66.8.22', status: 'succès', details: 'Désactivation alerte PALC > 7 000' },
  { id: 'LOG-008', timestamp: '2026-04-11T14:50:00Z', userId: 'USR-002', userName: 'Fatou Ndiaye', action: 'suspension_compte', resource: 'USR-005', ipAddress: '41.82.15.2', status: 'succès', details: 'Compte suspendu : inactivité > 30j + accès suspect' },
  { id: 'LOG-009', timestamp: '2026-04-11T11:00:00Z', userId: 'USR-001', userName: 'Amadou Diallo', action: 'configuration_systeme', resource: 'Sources de données', ipAddress: '41.82.12.5', status: 'succès', details: 'Ajout source Reuters Africa — API v2' },
  { id: 'LOG-010', timestamp: '2026-04-10T16:30:00Z', userId: 'USR-006', userName: 'Awa Coulibaly', action: 'export_données', resource: 'Calendrier Économique', ipAddress: '223.14.5.8', status: 'succès' },
  { id: 'LOG-011', timestamp: '2026-04-10T09:15:00Z', userId: 'USR-001', userName: 'Amadou Diallo', action: 'creation_utilisateur', resource: 'USR-008', ipAddress: '41.82.12.5', status: 'succès', details: 'Création compte Ndéye Fall — en attente validation' },
  { id: 'LOG-012', timestamp: '2026-04-09T18:00:00Z', userId: 'USR-007', userName: 'Jean-Pierre Hounkpé', action: 'connexion', resource: 'Authentification', ipAddress: '41.90.120.15', status: 'succès' },
]

export interface DataSource {
  id: string
  name: string
  type: 'marché' | 'macro' | 'fx' | 'actualités' | 'risque'
  status: 'actif' | 'dégradé' | 'hors_ligne'
  lastSync: string
  latency: number
  reliability: number
}

export const dataSources: DataSource[] = [
  { id: 'DS-001', name: 'BRVM Market Feed', type: 'marché', status: 'actif', lastSync: '2026-04-12T08:54:00Z', latency: 180, reliability: 99.8 },
  { id: 'DS-002', name: 'BCEAO — Taux & Émissions', type: 'macro', status: 'actif', lastSync: '2026-04-12T08:00:00Z', latency: 320, reliability: 99.5 },
  { id: 'DS-003', name: 'Reuters Africa News', type: 'actualités', status: 'actif', lastSync: '2026-04-12T08:52:00Z', latency: 240, reliability: 98.9 },
  { id: 'DS-004', name: 'Bloomberg FX Africa', type: 'fx', status: 'actif', lastSync: '2026-04-12T08:53:00Z', latency: 95, reliability: 99.9 },
  { id: 'DS-005', name: 'UEMOA — Données Macro', type: 'macro', status: 'dégradé', lastSync: '2026-04-12T06:30:00Z', latency: 1450, reliability: 97.2 },
  { id: 'DS-006', name: 'Bloomfield Risk Engine', type: 'risque', status: 'actif', lastSync: '2026-04-12T08:00:00Z', latency: 520, reliability: 99.1 },
]

// ─── Order Book ───────────────────────────────────────────────────────────────

export interface OrderBookLevel {
  price: number
  quantity: number
  cumulative: number
  side: 'bid' | 'ask'
}

export interface LastTrade {
  price: number
  quantity: number
  time: string
  side: 'buy' | 'sell'
}

export interface OrderBook {
  symbol: string
  bids: OrderBookLevel[]
  asks: OrderBookLevel[]
  lastTrades: LastTrade[]
  spread: number
  spreadPct: number
}

function buildOrderBook(symbol: string, basePrice: number): OrderBook {
  const rng = createRng(basePrice * 7 + 1)
  const step = Math.max(1, Math.round(basePrice * 0.0006))
  const bids: OrderBookLevel[] = []
  const asks: OrderBookLevel[] = []
  let cumBid = 0
  let cumAsk = 0
  for (let i = 0; i < 8; i++) {
    const bQty = Math.floor(rng() * 800) + 100
    cumBid += bQty
    bids.push({ price: basePrice - step * (i + 1), quantity: bQty, cumulative: cumBid, side: 'bid' })
    const aQty = Math.floor(rng() * 800) + 100
    cumAsk += aQty
    asks.push({ price: basePrice + step * (i + 1), quantity: aQty, cumulative: cumAsk, side: 'ask' })
  }
  const times = ['10:42:15', '10:41:58', '10:41:30', '10:40:52', '10:40:18', '10:39:45']
  const lastTrades: LastTrade[] = times.map((time, i) => ({
    time,
    price: basePrice + Math.round((rng() - 0.5) * step * 2),
    quantity: Math.floor(rng() * 200) + 20,
    side: i % 2 === 0 ? 'buy' : 'sell',
  }))
  return { symbol, bids, asks, lastTrades, spread: step * 2, spreadPct: Math.round((step * 2 / basePrice) * 10000) / 100 }
}

export const orderBooks: Record<string, OrderBook> = Object.fromEntries(
  brvmStocks.map(s => [s.symbol, buildOrderBook(s.symbol, s.price)])
)
