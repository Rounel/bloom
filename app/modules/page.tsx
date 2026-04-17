'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useCommentStore } from '@/lib/comment-store'
import Link from 'next/link'
import {
  Globe,
  LineChart,
  Radio,
  LayoutDashboard,
  TrendingUp,
  User,
  LogOut,
  Settings,
  Wallet,
  Sun,
  Moon,
  UserCircle,
  KeyRound,
  HelpCircle,
  Minus,
  X,
  GripHorizontal,
  Bell,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { newsItems } from '@/lib/mock-data'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'

// ─── Module definitions ────────────────────────────────────────────────────────

interface Module {
  id: string
  label: string
  sublabel: string
  description: string
  icon: React.ElementType
  href: string
  borderColor: string
  iconColor: string
}

const modules: Module[] = [
  {
    id: 'dashboard',
    label: 'Dashboard & Options',
    sublabel: 'Terminal Multi-fenêtres',
    description: 'Terminal multi-fenêtres personnalisable. Drag & drop, thèmes et recherche intelligente.',
    icon: LayoutDashboard,
    href: '/terminal/dashboard',
    borderColor: 'hover:border-primary/50 hover:shadow-primary/10',
    iconColor: 'text-primary',
  },
  {
    id: 'operations',
    label: 'Opérations Boursières',
    sublabel: 'BRVM & Marchés Africains',
    description: 'Cotations BRVM en direct, taux souverains, devises et matières premières africaines.',
    icon: TrendingUp,
    href: '/terminal/operations',
    borderColor: 'hover:border-primary/50 hover:shadow-primary/10',
    iconColor: 'text-primary',
  },
  {
    id: 'macro',
    label: 'Données Macroéconomiques',
    sublabel: 'UEMOA',
    description: 'PIB, inflation, finances publiques, balance commerciale et analyse régionale UEMOA.',
    icon: Globe,
    href: '/terminal/macro',
    borderColor: 'hover:border-primary/50 hover:shadow-primary/10',
    iconColor: 'text-primary',
  },
  {
    id: 'portfolio',
    label: 'Portefeuille',
    sublabel: 'Gestion & Suivi',
    description: 'Suivez vos investissements, analysez vos performances et optimisez votre portefeuille.',
    icon: Wallet,
    href: '/terminal/portfolio',
    borderColor: 'hover:border-primary/50 hover:shadow-primary/10',
    iconColor: 'text-primary',
  },
  {
    id: 'analyse',
    label: 'Analyse Financière & Risque',
    sublabel: 'Technique & Fondamentale',
    description: 'Analyse technique avancée (RSI, MACD, Bollinger), ratios fondamentaux et scorecard risques souverains.',
    icon: LineChart,
    href: '/terminal/analyse',
    borderColor: 'hover:border-primary/50 hover:shadow-primary/10',
    iconColor: 'text-primary',
  },
  {
    id: 'communication',
    label: 'Communication & Éducation',
    sublabel: 'Actualités & Web TV',
    description: 'Actualités en temps réel, alertes critiques, Web TV et espace éducatif.',
    icon: Radio,
    href: '/terminal/communication',
    borderColor: 'hover:border-primary/50 hover:shadow-primary/10',
    iconColor: 'text-primary',
  },
  {
    id: 'admin',
    label: 'Paramètrage & Sécurité',
    sublabel: 'Compte & Préférences',
    description: 'Gérez votre compte, vos préférences et vos paramètres de sécurité.',
    icon: Settings,
    href: '/terminal/admin',
    borderColor: 'hover:border-primary/50 hover:shadow-primary/10',
    iconColor: 'text-primary',
  },
  {
    id: 'my-account',
    label: 'Mon Compte',
    sublabel: 'Profil & Préférences',
    description: 'Gérez votre compte, vos préférences et vos paramètres de sécurité.',
    icon: User,
    href: '/terminal/my-account',
    borderColor: 'hover:border-primary/50 hover:shadow-primary/10',
    iconColor: 'text-primary',
  },
]

// ─── Background network pattern ────────────────────────────────────────────────

function NetworkBackground() {
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
    <svg className="absolute inset-0 w-full h-full pointer-events-none"
      xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1400 900">
      {edges.map((e, i) => (
        <line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
          stroke="currentColor" strokeWidth="0.6" className="text-foreground/[0.06]" />
      ))}
      {nodes.map((n, i) => (
        <circle key={i} cx={n.cx} cy={n.cy} r="3"
          fill="currentColor" className="text-foreground/[0.12]" />
      ))}
    </svg>
  )
}

// ─── Notifications ────────────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
  'Marché':              'text-blue-400',
  'Entreprise':          'text-violet-400',
  'Macro':               'text-amber-400',
  'Banque':              'text-cyan-400',
  'Agriculture':         'text-emerald-400',
  'Énergie':             'text-orange-400',
  'Politique Monétaire': 'text-rose-400',
  'Événement':           'text-sky-400',
}

function timeAgo(timestamp: string): string {
  const diff = Math.floor((new Date('2026-04-17').getTime() - new Date(timestamp).getTime()) / 60000)
  if (diff < 60)   return `${diff} min`
  if (diff < 1440) return `${Math.floor(diff / 60)} h`
  return `${Math.floor(diff / 1440)} j`
}

function NotificationButton() {
  const [readIds, setReadIds] = useState<Set<string>>(new Set())
  const unread = newsItems.filter(n => !readIds.has(n.id)).length

  const markAll = () => setReadIds(new Set(newsItems.map(n => n.id)))

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="relative p-2 rounded-lg hover:bg-white/10 transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4 text-white/70" />
          {unread > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center leading-none">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 p-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-border/60 bg-secondary/20">
          <span className="text-xs font-bold text-foreground">Notifications</span>
          {unread > 0 && (
            <button
              onClick={markAll}
              className="text-[10px] text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Tout marquer lu
            </button>
          )}
        </div>

        {/* List */}
        <div className="max-h-[420px] overflow-y-auto divide-y divide-border/40">
          {newsItems.map(item => {
            const isRead = readIds.has(item.id)
            return (
              <div
                key={item.id}
                onClick={() => setReadIds(prev => new Set([...prev, item.id]))}
                className={cn(
                  'flex gap-3 px-3 py-2.5 cursor-pointer transition-colors hover:bg-secondary/40',
                  !isRead && 'bg-primary/[0.03]',
                )}
              >
                {/* Dot lu/non-lu */}
                <div className="pt-1 shrink-0">
                  <span className={cn(
                    'block w-1.5 h-1.5 rounded-full mt-0.5',
                    isRead ? 'bg-transparent' : item.isBreaking ? 'bg-red-500' : 'bg-primary',
                  )} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    {item.isBreaking && (
                      <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-red-400 uppercase">
                        <Zap className="w-2 h-2 fill-red-400" /> Flash
                      </span>
                    )}
                    <span className={cn('text-[9px] font-semibold uppercase tracking-wide', CATEGORY_COLORS[item.category] ?? 'text-muted-foreground')}>
                      {item.category}
                    </span>
                    <span className="ml-auto text-[10px] text-muted-foreground/60 shrink-0">
                      {timeAgo(item.timestamp)}
                    </span>
                  </div>
                  <p className={cn('text-xs leading-snug', isRead ? 'text-muted-foreground' : 'text-foreground font-medium')}>
                    {item.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground/70 mt-0.5 truncate">{item.source}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        {unread === 0 && (
          <div className="px-3 py-2 text-center text-[11px] text-muted-foreground border-t border-border/40">
            Toutes les notifications ont été lues
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ─── Top bar ───────────────────────────────────────────────────────────────────

function TopBar() {
  const [time, setTime] = useState('')
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('bloomfield-theme')
    if (saved !== null) setIsDark(saved === 'dark')
  }, [])

  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const html = document.documentElement
    if (isDark) {
      html.classList.add('dark')
      localStorage.setItem('bloomfield-theme', 'dark')
    } else {
      html.classList.remove('dark')
      localStorage.setItem('bloomfield-theme', 'light')
    }
  }, [isDark])

  return (
    <header className="relative z-10 h-14 border-b border-border/50 bg-[#1c3557] flex items-center px-6 shrink-0">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-md shadow-primary/20">
          <p className="text-lg text-white">B</p>
        </div>
        <span className="text-sm lg:text-lg font-black text-white leading-none">Bloomfield Terminal</span>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <button onClick={() => setIsDark(p => !p)}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          title={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}>
          {isDark ? <Sun className="w-4 h-4 text-white/70" /> : <Moon className="w-4 h-4 text-white/70" />}
        </button>

        <NotificationButton />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/10 transition-colors">
              <div className="w-6 h-6 rounded-full bg-primary/30 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="hidden md:block text-xs md:text-sm font-semibold text-white">Amadou Diallo</span>
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
                <UserCircle className="w-4 h-4" /> Mon profil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/modules/settings" className="flex items-center gap-2 cursor-pointer">
                <Settings className="w-4 h-4" /> Paramètres
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/modules/security" className="flex items-center gap-2 cursor-pointer">
                <KeyRound className="w-4 h-4" /> Sécurité
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/help" className="flex items-center gap-2 cursor-pointer">
                <HelpCircle className="w-4 h-4" /> Aide
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/auth/sign-in" className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive">
                <LogOut className="w-4 h-4" /> Déconnexion
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

// ─── Home slot — module grid shown inside a split slot ────────────────────────

const DRAG_TYPE = 'application/x-bloomfield-minimized'

function HomeSlot({
  slotId,
  onOpen,
  onDrop,
  canClose,
  onClose,
}: {
  slotId: string
  onOpen: (slotId: string, moduleId: string) => void
  onDrop: (slotId: string, moduleId: string) => void
  canClose: boolean
  onClose: (slotId: string) => void
}) {
  const [dragOver, setDragOver] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    if (e.dataTransfer.types.includes(DRAG_TYPE)) {
      e.preventDefault()
      setDragOver(true)
    }
  }
  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOver(false)
  }
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const moduleId = e.dataTransfer.getData(DRAG_TYPE)
    if (moduleId) onDrop(slotId, moduleId)
  }

  return (
    <div
      className={cn(
        'flex flex-col h-full overflow-hidden transition-colors',
        dragOver ? 'bg-primary/10 ring-2 ring-primary/40 ring-inset' : 'bg-background',
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Slot header */}
      <div className="h-9 shrink-0 flex items-center gap-2 px-3 bg-card border-b border-border">
        <span className="text-xs font-semibold text-muted-foreground flex-1">Sélectionner un module</span>
        {canClose && (
          <button onClick={() => onClose(slotId)}
            className="p-1 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
            title="Fermer">
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Grid + drop hint */}
      <div className="max-w-360 mx-auto flex-1 overflow-auto relative">
        {dragOver && (
          <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
            <div className="bg-primary/20 border-2 border-dashed border-primary/60 rounded-xl px-8 py-4 text-primary font-semibold text-sm">
              Déposer ici pour ouvrir 
            </div>
          </div>
        )}

        <div className="p-6 flex flex-col gap-6">
          {/* Background */}
          <div className="relative">
            <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none opacity-40">
              <NetworkBackground />
            </div>
            {/* <div className="relative z-10 text-center space-y-3">
              <h1 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight">Modules</h1>
              <p className="text-sm text-muted-foreground">
                Sélectionnez un module pour accéder à vos outils d'analyse des marchés financiers africains.
              </p>
            </div> */}
          </div>

          <div className="relative my-auto z-10 w-full max-w-360 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {modules.map(mod => {
              const Icon = mod.icon
              return (
                <button
                  key={mod.id}
                  onClick={() => onOpen(slotId, mod.id)}
                  className={cn(
                    'group flex flex-row items-center justify-center gap-5 rounded-2xl',
                    'bg-card border-3 border-primary transition-all duration-300',
                    'hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-navy px-4 py-6',
                    mod.borderColor,
                    'lg:flex-col',
                  )}
                >
                  <Icon className={cn('size-10 mr-auto', 'lg:size-20 lg:mr-0', mod.iconColor)} strokeWidth={1.5} />
                  <p className="text-base md:text-lg lg:text-2xl font-black text-foreground leading-tight text-center">
                    {mod.label}
                  </p>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Module slot — iframe ──────────────────────────────────────────────────────

function ModuleSlot({
  mod,
  isDraggingTab,
  onMinimize,
  onClose,
  onDropSplit,
}: {
  mod: Module
  isDraggingTab: boolean
  onMinimize: () => void
  onClose: () => void
  onDropSplit: (moduleId: string) => void
}) {
  const Icon = mod.icon
  const [dragOver, setDragOver] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    if (e.dataTransfer.types.includes(DRAG_TYPE)) { e.preventDefault(); setDragOver(true) }
  }
  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOver(false)
  }
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false)
    const moduleId = e.dataTransfer.getData(DRAG_TYPE)
    if (moduleId) onDropSplit(moduleId)
  }

  return (
    <div
      className={cn(
        'relative flex flex-col h-full overflow-hidden transition-colors',
        dragOver && 'ring-2 ring-primary/40 ring-inset',
      )}
    >
      <div className="h-9 shrink-0 flex items-center gap-2 px-3 bg-card border-b border-border">
        <Icon className={cn('w-3.5 h-3.5 shrink-0', mod.iconColor)} />
        <span className="text-xs font-semibold text-foreground flex-1 truncate">{mod.label}</span>
        <button onClick={onMinimize}
          className="p-1 rounded hover:bg-secondary/60 text-muted-foreground hover:text-foreground transition-colors"
          title="Réduire">
          <Minus className="w-3 h-3" />
        </button>
        <button onClick={onClose}
          className="p-1 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
          title="Fermer">
          <X className="w-3 h-3" />
        </button>
      </div>

      <div className="relative flex-1 min-h-0">
        <iframe src={mod.href} className="w-full h-full border-0" title={mod.label} />

        {/* Transparent overlay shown only while a tab is being dragged.
            Iframes swallow all pointer events, so we cover them to let
            dragOver/dragLeave/drop reach this element. */}
        {isDraggingTab && (
          <div
            className="absolute inset-0 z-10"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          />
        )}

        {/* Visual feedback */}
        {dragOver && (
          <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center bg-primary/5">
            <div className="bg-primary/20 border-2 border-dashed border-primary/60 rounded-xl px-8 py-4 text-primary font-semibold text-sm">
              Déposer pour ajouter au split
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Column resize handle ──────────────────────────────────────────────────────

function ColResizeHandle({
  leftPct,
  onDrag,
}: {
  leftPct: number
  onDrag: (deltaX: number, containerWidth: number) => void
}) {
  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    const container = (e.currentTarget as HTMLElement).parentElement!
    const { width } = container.getBoundingClientRect()
    const startX = e.clientX
    const onMove = (me: MouseEvent) => onDrag(me.clientX - startX, width)
    const onUp = () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }
  return (
    <div
      onMouseDown={onMouseDown}
      className="absolute top-0 bottom-0 z-20 cursor-col-resize group"
      style={{ left: `${leftPct}%`, width: 6, transform: 'translateX(-50%)' }}
    >
      <div className="w-full h-full bg-border/60 group-hover:bg-primary/60 transition-colors" />
    </div>
  )
}

// ─── Taskbar ───────────────────────────────────────────────────────────────────

function Taskbar({
  activeIds,
  minimizedIds,
  onMinimize,
  onRestore,
  onClose,
  onDragStartTab,
  onDragEndTab,
}: {
  activeIds: string[]
  minimizedIds: string[]
  onMinimize: (moduleId: string) => void
  onRestore: (moduleId: string) => void
  onClose: (moduleId: string) => void
  onDragStartTab: () => void
  onDragEndTab: () => void
}) {
  const allIds = [...activeIds, ...minimizedIds]
  if (allIds.length === 0) return null

  return (
    <div className="h-10 shrink-0 flex items-center gap-1 px-3 bg-card border-t border-border overflow-x-auto">
      {allIds.map(moduleId => {
        const mod = modules.find(m => m.id === moduleId)!
        const Icon = mod.icon
        const isActive = activeIds.includes(moduleId)
        return (
          <div
            key={moduleId}
            draggable={!isActive}
            onDragStart={!isActive ? e => {
              e.dataTransfer.setData(DRAG_TYPE, moduleId)
              e.dataTransfer.effectAllowed = 'move'
              onDragStartTab()
            } : undefined}
            onDragEnd={!isActive ? () => onDragEndTab() : undefined}
            className={cn(
              'group flex items-center rounded border shrink-0 transition-colors',
              isActive
                ? 'border-primary/40 bg-navy cursor-default'
                : 'border-border bg-secondary/40 hover:bg-secondary/70 cursor-grab active:cursor-grabbing',
            )}
          >
            {/* Drag grip — only on minimized */}
            {!isActive && (
              <span className="pl-1.5 text-muted-foreground/40 group-hover:text-muted-foreground/70 transition-colors">
                <GripHorizontal className="w-2.5 h-2.5" />
              </span>
            )}
            <button
              onClick={() => isActive ? onMinimize(moduleId) : onRestore(moduleId)}
              className={cn(
                'flex items-center gap-1.5 py-1.5 text-[13px] font-medium transition-colors',
                isActive
                  ? 'pl-2.5 pr-2 text-white hover:text-primary/80'
                  : 'pl-1.5 pr-2 text-muted-foreground hover:text-foreground',
              )}
              title={isActive ? 'Réduire' : 'Restaurer'}
            >
              <Icon className={cn('w-3 h-3 shrink-0', isActive ? 'text-white' : 'text-primary')} />
              <span className="hidden lg:inline truncate max-w-fit">{mod.label}</span>
              {/* Active indicator dot */}
              {isActive && <span className="w-1.5 h-1.5 rounded-full bg-primary ml-0.5 shrink-0" />}
            </button>
            <button
              onClick={() => onClose(moduleId)}
              className="pr-1.5 py-1.5 text-muted-foreground hover:text-destructive opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all"
              title="Fermer">
              <X className="w-2.5 h-2.5" />
            </button>
          </div>
        )
      })}
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

type Slot = { id: string; moduleId: string | null }

let _nextId = 1
function newSlotId() { return `slot-${++_nextId}` }
function equalWidths(slots: Slot[]) {
  const w = 100 / slots.length
  return Object.fromEntries(slots.map(s => [s.id, w]))
}

export default function ModulesPage() {
  // Always at least one slot; null moduleId = home/grid view
  const [slots, setSlots]         = useState<Slot[]>([{ id: 'slot-1', moduleId: null }])
  const [widths, setWidths]       = useState<Record<string, number>>({ 'slot-1': 100 })
  const [minimized, setMinimized] = useState<string[]>([])
  const [isDraggingTab, setIsDraggingTab] = useState(false)

  // ── Actions ────────────────────────────────────────────────────────────────

  const openInSlot = useCallback((slotId: string, moduleId: string) => {
    // Reset drag overlay — the dragged tab unmounts before dragend fires, so we do it here
    setIsDraggingTab(false)
    setSlots(prev => {
      // Prevent duplicate: if module already visible in another slot, do nothing
      if (prev.some(s => s.moduleId === moduleId)) return prev
      return prev.map(s => s.id === slotId ? { ...s, moduleId } : s)
    })
    setMinimized(prev => prev.filter(id => id !== moduleId))
  }, [])

  const minimizeSlot = useCallback((slotId: string) => {
    setSlots(prev => {
      const slot = prev.find(s => s.id === slotId)
      if (!slot?.moduleId) return prev
      const moduleId = slot.moduleId
      setMinimized(m => m.includes(moduleId) ? m : [...m, moduleId])
      return prev.map(s => s.id === slotId ? { ...s, moduleId: null } : s)
    })
  }, [])

  const closeSlot = useCallback((slotId: string) => {
    setSlots(prev => {
      if (prev.length <= 1) {
        // Last slot: reset to home instead of removing
        return [{ ...prev[0], moduleId: null }]
      }
      const next = prev.filter(s => s.id !== slotId)
      setWidths(equalWidths(next))
      return next
    })
  }, [])

  // Click on minimized tab → full view (all active modules go back to minimized)
  const restoreModule = useCallback((moduleId: string) => {
    setSlots(prev => {
      const activeIds = prev.filter(s => s.moduleId !== null && s.moduleId !== moduleId).map(s => s.moduleId!)
      setMinimized(m => {
        const next = m.filter(id => id !== moduleId)
        activeIds.forEach(id => { if (!next.includes(id)) next.push(id) })
        return next
      })
      const id = newSlotId()
      setWidths({ [id]: 100 })
      return [{ id, moduleId }]
    })
  }, [])

  // Drag a minimized tab onto a module slot → add it to the split next to that slot
  const addToSplit = useCallback((moduleId: string, afterSlotId: string) => {
    // Same race condition as openInSlot — reset drag overlay eagerly
    setIsDraggingTab(false)
    setSlots(prev => {
      if (prev.some(s => s.moduleId === moduleId)) return prev
      const idx = prev.findIndex(s => s.id === afterSlotId)
      const newSlot: Slot = { id: newSlotId(), moduleId }
      const next = idx >= 0
        ? [...prev.slice(0, idx + 1), newSlot, ...prev.slice(idx + 1)]
        : [...prev, newSlot]
      setWidths(equalWidths(next))
      setMinimized(m => m.filter(id => id !== moduleId))
      return next
    })
  }, [])

  // Minimize an active module by its id (called from Taskbar active tab)
  const minimizeByModuleId = useCallback((moduleId: string) => {
    setSlots(prev => {
      const slot = prev.find(s => s.moduleId === moduleId)
      if (!slot) return prev
      setMinimized(m => m.includes(moduleId) ? m : [...m, moduleId])
      return prev.map(s => s.id === slot.id ? { ...s, moduleId: null } : s)
    })
  }, [])

  // Close a module entirely (whether active or minimized)
  const closeByModuleId = useCallback((moduleId: string) => {
    setMinimized(prev => prev.filter(id => id !== moduleId))
    setSlots(prev => {
      const slot = prev.find(s => s.moduleId === moduleId)
      if (!slot) return prev
      if (prev.length <= 1) return [{ ...prev[0], moduleId: null }]
      const next = prev.filter(s => s.id !== slot.id)
      setWidths(equalWidths(next))
      return next
    })
  }, [])

  const handleColDrag = useCallback((gapIdx: number, deltaX: number, containerWidth: number) => {
    setSlots(prev => {
      const aId = prev[gapIdx]?.id
      const bId = prev[gapIdx + 1]?.id
      if (!aId || !bId) return prev
      setWidths(w => {
        const MIN = 10
        const delta = (deltaX / containerWidth) * 100
        const sum = (w[aId] ?? 0) + (w[bId] ?? 0)
        let wa = (w[aId] ?? 0) + delta
        let wb = (w[bId] ?? 0) - delta
        if (wa < MIN) { wa = MIN; wb = sum - MIN }
        if (wb < MIN) { wb = MIN; wa = sum - MIN }
        return { ...w, [aId]: wa, [bId]: wb }
      })
      return prev
    })
  }, [])

  // Cumulative lefts for resize handles
  const cumulativeLefts = slots.reduce<number[]>((acc, s, i) => {
    const w = widths[s.id] ?? 100 / slots.length
    return i === 0 ? [w] : [...acc, (acc[i - 1] ?? 0) + w]
  }, [])

  // Safety net: dragend always fires on the source element, but if the element
  // unmounted before React could route it, the document-level listener catches it.
  useEffect(() => {
    const reset = () => setIsDraggingTab(false)
    document.addEventListener('dragend', reset)
    return () => document.removeEventListener('dragend', reset)
  }, [])

  const isInitialHome = slots.length === 1 && slots[0].moduleId === null && minimized.length === 0

  // Masque le bouton flottant de commentaire quand un module est ouvert
  const setHideButton = useCommentStore(s => s.setHideButton)
  useEffect(() => {
    setHideButton(!isInitialHome)
    return () => setHideButton(false)
  }, [isInitialHome, setHideButton])

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <TopBar />

      {isInitialHome ? (
        /* ── Full-screen initial grid ──────────────────────────────────────── */
        <main className="relative flex-1 flex flex-col items-center px-6 py-12 gap-12 bg-background overflow-y-auto">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <NetworkBackground />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,transparent_40%,var(--background)_100%)]" />
          </div>

          {/* <div className="relative z-10 text-center space-y-3">
            <h1 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight">Modules</h1>
            <p className="text-sm text-muted-foreground">
              Sélectionnez un module pour accéder à vos outils d'analyse des marchés financiers africains.
            </p>
          </div> */}

          <div className="relative my-auto z-10 w-full max-w-360 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {modules.map(mod => {
              const Icon = mod.icon
              return (
                <button
                  key={mod.id}
                  onClick={() => openInSlot('slot-1', mod.id)}
                  className={cn(
                    'group flex flex-row items-center justify-center gap-5 rounded-2xl',
                    'bg-card border-3 border-primary transition-all duration-300',
                    'hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-navy px-4 py-6',
                    mod.borderColor,
                    'lg:flex-col',
                  )}
                >
                  <Icon className={cn('size-10 mr-auto', 'lg:size-20 lg:mr-0', mod.iconColor)} strokeWidth={1.5} />
                  <p className="text-base md:text-lg lg:text-2xl font-black text-foreground leading-tight text-center">
                    {mod.label}
                  </p>
                </button>
              )
            })}
          </div>
        </main>
      ) : (
        /* ── Split workspace ───────────────────────────────────────────────── */
        <div className="flex-1 relative flex overflow-hidden min-h-0">
          {slots.map((slot, i) => {
            const mod = slot.moduleId ? modules.find(m => m.id === slot.moduleId) : null
            const widthPct = widths[slot.id] ?? 100 / slots.length
            return (
              <div
                key={slot.id}
                className="flex flex-col h-full border-r border-border/50 last:border-r-0"
                style={{ width: `${widthPct}%` }}
              >
                {mod ? (
                  <ModuleSlot
                    mod={mod}
                    isDraggingTab={isDraggingTab}
                    onMinimize={() => minimizeSlot(slot.id)}
                    onClose={() => closeSlot(slot.id)}
                    onDropSplit={moduleId => addToSplit(moduleId, slot.id)}
                  />
                ) : (
                  <HomeSlot
                    slotId={slot.id}
                    onOpen={openInSlot}
                    onDrop={openInSlot}
                    canClose={slots.length > 1}
                    onClose={closeSlot}
                  />
                )}
              </div>
            )
          })}

          {/* Column resize handles */}
          {slots.slice(0, -1).map((_, i) => (
            <ColResizeHandle
              key={i}
              leftPct={cumulativeLefts[i] ?? 0}
              onDrag={(dx, cw) => handleColDrag(i, dx, cw)}
            />
          ))}
        </div>
      )}

      {/* ── Taskbar ───────────────────────────────────────────────────────── */}
      <Taskbar
        activeIds={slots.filter(s => s.moduleId !== null).map(s => s.moduleId!)}
        minimizedIds={minimized}
        onMinimize={minimizeByModuleId}
        onRestore={restoreModule}
        onClose={closeByModuleId}
        onDragStartTab={() => setIsDraggingTab(true)}
        onDragEndTab={() => setIsDraggingTab(false)}
      />

      {isInitialHome && (
        <footer className="relative z-10 border-t border-border/30 bg-[#1c3557] py-3 px-6 flex items-center justify-between text-[10px] text-white shrink-0">
          <span>© 2026 Bloomfield Terminal</span>
          <span>Données financières africaines professionnelles · v2.4.1</span>
        </footer>
      )}
    </div>
  )
}
