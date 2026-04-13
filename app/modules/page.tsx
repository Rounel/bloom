'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Activity,
  BarChart3,
  Globe,
  LineChart,
  Radio,
  LayoutDashboard,
  TrendingUp,
  Shield,
  ChevronRight,
  User,
  Bell,
  LogOut,
  Clock,
  Wifi,
  Settings,
  Wallet,
  Sun,
  Moon,
  UserCircle,
  KeyRound,
  HelpCircle,
} from 'lucide-react'
import { marketIndices, brvmStocks } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'

// ─── Module definitions ───────────────────────────────────────────────────────

interface Module {
  id: string
  label: string
  sublabel: string
  description: string
  icon: React.ElementType
  href: string
  accentColor: string        // Tailwind arbitrary colour for the icon bg
  borderColor: string        // ring/border on hover
  iconColor: string          // icon itself
  badge?: string
}

const modules: Module[] = [
  {
    id: 'operations',
    label: 'Opérations',
    sublabel: 'Boursières',
    description: 'Cotations BRVM en direct, taux souverains, devises et matières premières africaines.',
    icon: TrendingUp,
    href: '/terminal/operations',
    accentColor: 'bg-primary/15',
    borderColor:  'hover:border-primary/50 hover:shadow-primary/10',
    iconColor:    'text-primary',
    badge: 'Live',
  },
  {
    id: 'macro',
    label: 'Données',
    sublabel: 'Macroéconomiques',
    description: 'PIB, inflation, finances publiques, balance commerciale et analyse régionale UEMOA.',
    icon: Globe,
    href: '/terminal/macro',
    accentColor: 'bg-primary/15',
    borderColor:  'hover:border-primary/50 hover:shadow-primary/10',
    iconColor:    'text-primary',
  },
  {
    id: 'analyse',
    label: 'Analyse',
    sublabel: 'Financière & Risque',
    description: 'Analyse technique avancée (RSI, MACD, Bollinger), ratios fondamentaux et scorecard risques souverains.',
    icon: LineChart,
    href: '/terminal/analyse',
    accentColor: 'bg-primary/15',
    borderColor:  'hover:border-primary/50 hover:shadow-primary/10',
    iconColor:    'text-primary',
  },
  {
    id: 'communication',
    label: 'Communication',
    sublabel: '& Éducation',
    description: 'Actualités en temps réel, alertes critiques, Web TV et espace éducatif.',
    icon: Radio,
    href: '/terminal/communication',
    accentColor: 'bg-primary/15',
    borderColor:  'hover:border-primary/50 hover:shadow-primary/10',
    iconColor:    'text-primary',
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    sublabel: '& Options',
    description: 'Terminal multi-fenêtres personnalisable. Drag & drop, thèmes et recherche intelligente.',
    icon: LayoutDashboard,
    href: '/terminal/dashboard',
    accentColor: 'bg-primary/15',
    borderColor:  'hover:border-primary/50 hover:shadow-primary/10',
    iconColor:    'text-primary',
    badge: 'Nouveau',
  },
  {
    id: 'settings',
    label: 'Paramètrage',
    sublabel: 'Compte & Préférences',
    description: 'Gérez votre compte, vos préférences et vos paramètres de sécurité.',
    icon: Settings,
    href: '/terminal/settings',
    accentColor: 'bg-primary/15',
    borderColor:  'hover:border-primary/50 hover:shadow-primary/10',
    iconColor:    'text-primary',
  },
]


// Combine market indices and top stocks for ticker
const tickerItems = [
  ...marketIndices.map(index => ({
    label: index.name,
    value: index.value.toLocaleString('fr-FR', { maximumFractionDigits: 2 }),
    change: index.changePercent,
    isPositive: index.change >= 0,
  })),
  ...brvmStocks.slice(0, 8).map(stock => ({
    label: stock.symbol,
    value: stock.price.toLocaleString('fr-FR'),
    change: stock.changePercent,
    isPositive: stock.change >= 0,
  })),
]

// ─── Background network pattern (SVG) ────────────────────────────────────────

function NetworkBackground() {
  // Deterministic node positions (no Math.random to avoid hydration mismatch)
  const nodes = [
    { cx: 80,  cy: 120 }, { cx: 220, cy: 60  }, { cx: 380, cy: 200 },
    { cx: 520, cy: 80  }, { cx: 680, cy: 160 }, { cx: 820, cy: 40  },
    { cx: 960, cy: 220 }, { cx: 1100,cy: 90  }, { cx: 1240,cy: 180 },
    { cx: 150, cy: 320 }, { cx: 300, cy: 420 }, { cx: 460, cy: 340 },
    { cx: 600, cy: 460 }, { cx: 740, cy: 300 }, { cx: 880, cy: 400 },
    { cx: 1020,cy: 350 }, { cx: 1160,cy: 440 }, { cx: 1300,cy: 280 },
    { cx: 60,  cy: 520 }, { cx: 200, cy: 600 }, { cx: 360, cy: 540 },
    { cx: 500, cy: 650 }, { cx: 660, cy: 570 }, { cx: 800, cy: 620 },
    { cx: 940, cy: 560 }, { cx: 1080,cy: 640 }, { cx: 1220,cy: 580 },
    { cx: 1360,cy: 500 }, { cx: 120, cy: 720 }, { cx: 280, cy: 780 },
    { cx: 440, cy: 740 }, { cx: 580, cy: 820 }, { cx: 720, cy: 760 },
    { cx: 860, cy: 840 }, { cx: 1000,cy: 780 }, { cx: 1140,cy: 860 },
  ]

  // Connect nearby pairs (deterministic)
  const edges: { x1: number; y1: number; x2: number; y2: number }[] = []
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].cx - nodes[j].cx
      const dy = nodes[i].cy - nodes[j].cy
      if (Math.sqrt(dx * dx + dy * dy) < 220) {
        edges.push({ x1: nodes[i].cx, y1: nodes[i].cy, x2: nodes[j].cx, y2: nodes[j].cy })
      }
    }
  }

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 1400 900"
    >
      {edges.map((e, i) => (
        <line
          key={i}
          x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
          stroke="currentColor"
          strokeWidth="0.6"
          className="text-foreground/[0.06]"
        />
      ))}
      {nodes.map((n, i) => (
        <circle
          key={i}
          cx={n.cx} cy={n.cy} r="3"
          fill="currentColor"
          className="text-foreground/[0.12]"
        />
      ))}
    </svg>
  )
}

// ─── Top bar ──────────────────────────────────────────────────────────────────

function TopBar() {
  const [time, setTime] = useState('')
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const html = document.documentElement
    if (isDark) {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
  }, [isDark])

  return (
    <header className="relative z-10 h-14 border-b border-border/50 bg-[#1c3557] backdrop-blur-md flex items-center px-6">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-md shadow-primary/20">
          <p className="text-lg text-white">B</p>
        </div>
        <div>
          <span className="text-sm lg:text-lg font-black text-white leading-none block">Bloomfield Terminal</span>
        </div>
      </div>

      {/* Center title */}
      <div className="absolute left-1/2 -translate-x-1/2 text-center">
        <span className="text-sm font-black text-white tracking-[0.2em] uppercase">MODULES</span>
      </div>

      {/* Right controls */}
      <div className="ml-auto flex items-center gap-3">

        {/* Notification bell */}
        <button className="relative p-2 rounded-lg hover:bg-white/10 transition-colors">
          <Bell className="w-4 h-4 text-white/70" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
        </button>

        {/* Theme toggle */}
        <button
          onClick={() => setIsDark(prev => !prev)}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          title={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
        >
          {isDark
            ? <Sun className="w-4 h-4 text-white/70" />
            : <Moon className="w-4 h-4 text-white/70" />
          }
        </button>

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/10 transition-colors">
              <div className="w-6 h-6 rounded-full bg-primary/30 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="hidden md:block text-left">
                <span className="text-xs font-semibold text-white block leading-none">Amadou Diallo</span>
                <span className="text-[10px] text-white/60">Pro · BRVM</span>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="flex flex-col">
              <span className="font-semibold">Amadou Diallo</span>
              <span className="text-[10px] font-normal text-muted-foreground">amadou.diallo@brvm.org</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/modules/profile" className="flex items-center gap-2 cursor-pointer">
                <UserCircle className="w-4 h-4" />
                Mon profil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/modules/settings" className="flex items-center gap-2 cursor-pointer">
                <Settings className="w-4 h-4" />
                Paramètres
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/modules/security" className="flex items-center gap-2 cursor-pointer">
                <KeyRound className="w-4 h-4" />
                Sécurité
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/help" className="flex items-center gap-2 cursor-pointer">
                <HelpCircle className="w-4 h-4" />
                Aide
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/auth/sign-in" className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive">
                <LogOut className="w-4 h-4" />
                Déconnexion
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </header>
  )
}

// ─── Module card ──────────────────────────────────────────────────────────────

function ModuleCard({ mod }: { mod: Module }) {
  const Icon = mod.icon
  return (
    <Link
      href={mod.href}
      className={cn(
        'group relative flex flex-row gap-5 rounded-2xl',
        'bg-card backdrop-blur-sm border border-border transition-all duration-300',
        'hover:-translate-y-1.5 hover:shadow-2xl',
        mod.borderColor,
      )}
    > 
      {/* Badge */}
      {/* {mod.badge && (
        <span className="absolute top-3 right-3 text-[9px] font-bold px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/20 uppercase tracking-wider z-20">
          {mod.badge}
        </span>
      )} */}

      {/* Icon container – inspired by the screenshot's coloured rounded squares */}
      <div className='flex justify-center items-center px-2'>
        <Icon className={cn('size-30', mod.iconColor)} strokeWidth={1.5} />
      </div>

      <div className="flex flex-col py-8 pr-8">
        {/* Label */}
        <div>
          <p className="text-base md:text-lg lg:text-xl font-black text-gray-800 leading-tight">{mod.label}</p>
          <p className={cn('text-sm md:text-base lg:text-lg font-semibold', mod.iconColor)}>{mod.sublabel}</p>
        </div>

        {/* Description */}
        <p className="text-xs md:text-sm lg:text-base text-muted-foreground leading-relaxed flex-1">
          {mod.description}
        </p>
      </div>

      {/* CTA */}
      {/* <div className={cn(
        'flex items-center gap-1 text-xs font-semibold transition-all duration-200',
        mod.iconColor,
        'opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0',
      )}>
        Accéder
        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </div> */}
    </Link>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ModulesPage() {
  return (
    <div className="relative min-h-screen bg-background flex flex-col overflow-hidden">
      {/* Network SVG background */}
      <div className="absolute inset-0 overflow-hidden">
        <NetworkBackground />
        {/* Radial gradient vignette to fade edges */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,transparent_40%,var(--background)_100%)]" />
      </div>

      <TopBar />
      
      {/* Market Ticker Bar with Infinite Scroll */}
      <div className="h-8 bg-[#0f2035] overflow-hidden flex items-center relative">
        <div className="flex animate-scroll-infinite whitespace-nowrap">
          {/* First set */}
          {tickerItems.map((item, index) => (
            <div key={`first-${index}`} className="inline-flex items-center gap-2 px-4 border-r border-border/30">
              <span className="text-xs font-bold text-primary">{item.label}</span>
              <span className="text-xs font-mono font-semibold text-white">
                {item.value}
              </span>
              <span className={cn(
                "text-xs font-mono font-semibold",
                item.isPositive ? "text-ring" : "text-destructive"
              )}>
                {item.isPositive ? '+' : ''}{item.change.toFixed(2)}%
              </span>
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
          {tickerItems.map((item, index) => (
            <div key={`second-${index}`} className="inline-flex items-center gap-2 px-4 border-r border-border/30">
              <span className="text-xs font-medium text-primary">{item.label}</span>
              <span className="text-xs font-mono font-semibold text-white">
                {item.value}
              </span>
              <span className={cn(
                "text-xs font-mono font-semibold",
                item.isPositive ? "text-ring" : "text-destructive"
              )}>
                {item.isPositive ? '+' : ''}{item.change.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 gap-12 bg-background">

        {/* Page title – mirroring "ADMINISTRATION" from the screenshot */}
        <div className="text-center space-y-3">
          {/* <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full border border-primary/20 mb-2">
            <Shield className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-bold text-primary tracking-wider uppercase">Plateforme certifiée BRVM</span>
          </div> */}
          {/* <h1 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight">
            Modules
          </h1> */}
          <p className="text-sm text-muted-foreground ">
            Sélectionnez un module pour accéder à vos outils d'analyse des marchés financiers africains.
          </p>
        </div>

        {/* Module grid – 3 columns on md+, 2 on sm, 1 on xs */}
        <div className="w-full max-w-7xl grid grid-cols-3 gap-5">
          {modules.map(mod => (
            <ModuleCard key={mod.id} mod={mod} />
          ))}
        </div>

        {/* Bottom status strip */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] text-muted-foreground">
          {[
            { dot: 'bg-emerald-500', label: 'BRVM · Marché ouvert' },
            { dot: 'bg-blue-500',   label: '45 valeurs cotées' },
            { dot: 'bg-primary',    label: '8 pays couverts' },
          ].map(s => (
            <span key={s.label} className="flex items-center gap-1.5">
              <span className={cn('w-1.5 h-1.5 rounded-full animate-pulse', s.dot)} />
              {s.label}
            </span>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/30 bg-[#1c3557] py-3 px-6 flex items-center justify-between text-[10px] text-white backdrop-blur-sm">
        <span>© 2026 Bloomfield Terminal</span>
        <span>Données financières africaines professionnelles · v2.4.1</span>
      </footer>
    </div>
  )
}
