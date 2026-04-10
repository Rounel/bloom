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
} from 'lucide-react'
import { cn } from '@/lib/utils'

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
    href: '/',
    accentColor: 'bg-emerald-500/15',
    borderColor:  'hover:border-emerald-500/50 hover:shadow-emerald-500/10',
    iconColor:    'text-emerald-400',
    badge: 'Live',
  },
  {
    id: 'macro',
    label: 'Données',
    sublabel: 'Macroéconomiques',
    description: 'PIB, inflation, finances publiques, balance commerciale et analyse régionale UEMOA.',
    icon: Globe,
    href: '/',
    accentColor: 'bg-blue-500/15',
    borderColor:  'hover:border-blue-500/50 hover:shadow-blue-500/10',
    iconColor:    'text-blue-400',
  },
  {
    id: 'analyse',
    label: 'Analyse',
    sublabel: 'Financière',
    description: 'Analyse technique avancée, modélisation de portefeuille et signaux macro-financiers.',
    icon: LineChart,
    href: '/',
    accentColor: 'bg-violet-500/15',
    borderColor:  'hover:border-violet-500/50 hover:shadow-violet-500/10',
    iconColor:    'text-violet-400',
  },
  {
    id: 'communication',
    label: 'Communication',
    sublabel: '& Éducation',
    description: 'Actualités en temps réel, alertes critiques, Web TV et décryptages vidéo.',
    icon: Radio,
    href: '/',
    accentColor: 'bg-orange-500/15',
    borderColor:  'hover:border-orange-500/50 hover:shadow-orange-500/10',
    iconColor:    'text-orange-400',
  },
  {
    id: 'reporting',
    label: 'Reporting',
    sublabel: '& Exports',
    description: 'Génération de rapports personnalisés, exports Excel, PDF et partage de données.',
    icon: BarChart3,
    href: '/',
    accentColor: 'bg-cyan-500/15',
    borderColor:  'hover:border-cyan-500/50 hover:shadow-cyan-500/10',
    iconColor:    'text-cyan-400',
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    sublabel: '& Options',
    description: 'Terminal multi-fenêtres personnalisable. Drag & drop, thèmes et recherche intelligente.',
    icon: LayoutDashboard,
    href: '/',
    accentColor: 'bg-primary/15',
    borderColor:  'hover:border-primary/50 hover:shadow-primary/10',
    iconColor:    'text-primary',
    badge: 'Nouveau',
  },
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

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <header className="relative z-10 h-14 border-b border-border/50 backdrop-blur-md flex items-center px-6">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-md shadow-primary/20">
          <Activity className="w-4.5 h-4.5 text-primary-foreground" style={{ width: '1.125rem', height: '1.125rem' }} />
        </div>
        <div>
          <span className="text-sm font-black text-foreground leading-none block">Bloomfield</span>
          <span className="text-[9px] text-muted-foreground font-medium tracking-widest uppercase leading-none block mt-0.5">Terminal</span>
        </div>
      </div>

      {/* Center title */}
      <div className="absolute left-1/2 -translate-x-1/2 text-center">
        <span className="text-sm font-black text-foreground tracking-[0.2em] uppercase">MODULES</span>
      </div>

      {/* Right controls */}
      <div className="ml-auto flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-lg border border-border/50">
          <Wifi className="w-3 h-3 text-emerald-500" />
          <span>Connecté</span>
          <span className="mx-1 text-border">|</span>
          <Clock className="w-3 h-3" />
          <span className="font-mono">{time}</span>
        </div>

        <button className="relative p-2 rounded-lg hover:bg-secondary/50 transition-colors">
          <Bell className="w-4 h-4 text-muted-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
        </button>

        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-3.5 h-3.5 text-primary" />
          </div>
          <div className="hidden md:block text-left">
            <span className="text-xs font-semibold text-foreground block leading-none">Amadou Diallo</span>
            <span className="text-[10px] text-muted-foreground">Pro · BRVM</span>
          </div>
        </div>

        <Link
          href="/auth/sign-in"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 border border-border/50 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Déconnexion
        </Link>
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
        'group relative flex flex-col items-center text-center gap-5 p-8 rounded-2xl',
        'bg-card/70 backdrop-blur-sm border border-border/60 transition-all duration-300',
        'hover:-translate-y-1.5 hover:shadow-2xl',
        mod.borderColor,
      )}
    > 
      {/* Badge */}
      {mod.badge && (
        <span className="absolute top-3 right-3 text-[9px] font-bold px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/20 uppercase tracking-wider">
          {mod.badge}
        </span>
      )}

      {/* Icon container – inspired by the screenshot's coloured rounded squares */}
      <div className={cn(
        'w-20 h-20 rounded-2xl flex items-center justify-center border transition-all duration-300',
        mod.accentColor,
        'border-current/10 group-hover:scale-110 group-hover:shadow-lg',
      )}>
        <Icon className={cn('w-10 h-10', mod.iconColor)} strokeWidth={1.5} />
      </div>

      {/* Label */}
      <div>
        <p className="text-base font-black text-foreground leading-tight">{mod.label}</p>
        <p className={cn('text-sm font-semibold', mod.iconColor)}>{mod.sublabel}</p>
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground leading-relaxed flex-1">
        {mod.description}
      </p>

      {/* CTA */}
      <div className={cn(
        'flex items-center gap-1 text-xs font-semibold transition-all duration-200',
        mod.iconColor,
        'opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0',
      )}>
        Accéder
        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </div>
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

      {/* Main content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 gap-12 bg-white rounded-2xl">

        {/* Page title – mirroring "ADMINISTRATION" from the screenshot */}
        <div className="text-center space-y-3">
          {/* <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full border border-primary/20 mb-2">
            <Shield className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-bold text-primary tracking-wider uppercase">Plateforme certifiée BRVM</span>
          </div> */}
          <h1 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight">
            Modules
          </h1>
          <p className="text-sm text-muted-foreground max-w-md">
            Sélectionnez un module pour accéder à vos outils d'analyse des marchés financiers africains.
          </p>
        </div>

        {/* Module grid – 3 columns on md+, 2 on sm, 1 on xs */}
        <div className="w-full max-w-5xl grid grid-cols-3 gap-5">
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
      <footer className="relative z-10 border-t border-border/30 py-3 px-6 flex items-center justify-between text-[10px] text-muted-foreground bg-card/30 backdrop-blur-sm">
        <span>© 2026 Bloomfield Terminal</span>
        <span>Données financières africaines professionnelles · v2.4.1</span>
      </footer>
    </div>
  )
}
