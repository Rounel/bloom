'use client'

import { useState, useEffect } from 'react'
import {
  Activity,
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  ChevronDown,
  HelpCircle,
  BarChart3,
  Menu,
  Sun,
  Moon,
  UserCircle,
  KeyRound,
  Wallet,
  TrendingUp,
  Globe,
  Microscope,
  Radio,
  GripHorizontal,
} from 'lucide-react'
import { useDashboardStore } from '@/lib/dashboard-store'
import { useSplitStore } from '@/lib/split-store'
import { MODULE_DRAG_TYPE } from '@/components/dashboard/split-workspace'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'

// ── Draggable nav link ────────────────────────────────────────────────────────

function NavLink({
  href,
  label,
  icon: Icon,
  onDragStart,
  onDragEnd,
}: {
  href: string
  label: string
  icon: React.ElementType
  onDragStart: (e: React.DragEvent) => void
  onDragEnd: () => void
}) {
  return (
    <Link
      href={href}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={cn(
        'group flex items-center gap-2 px-3 py-1.5 text-xs font-medium',
        'text-foreground hover:bg-secondary/50 rounded-md transition-colors',
        'cursor-grab active:cursor-grabbing select-none',
      )}
      title={`Cliquer pour naviguer · Glisser pour diviser l'écran`}
    >
      <GripHorizontal className="w-3 h-3 text-muted-foreground/40 group-hover:text-muted-foreground/70 transition-colors shrink-0" />
      <Icon className="w-3.5 h-3.5 shrink-0" />
      {label}
    </Link>
  )
}

// ── Nav items config ──────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { href: '/terminal/dashboard',     label: 'Dashboard',                icon: BarChart3    },
  { href: '/terminal/portfolio',     label: 'Portefeuille',             icon: Wallet       },
  { href: '/terminal/operations',    label: 'Opérations Boursières',    icon: TrendingUp   },
  { href: '/terminal/macro',         label: 'Données Macroéconomiques', icon: Globe        },
  { href: '/terminal/analyse',       label: 'Analyse Financière',       icon: Microscope   },
  { href: '/terminal/communication', label: 'Communication & Éducation',icon: Radio        },
  { href: '/terminal/admin',         label: 'Paramétrage',              icon: Settings     },
] as const

// ── TerminalHeader ────────────────────────────────────────────────────────────

interface TerminalHeaderProps {
  onSearchOpen?: () => void
}

export function TerminalHeader({ onSearchOpen }: TerminalHeaderProps) {
  const [notifications] = useState(3)
  const [isDark, setIsDark] = useState(true)
  const { setSidebarOpen } = useDashboardStore()
  const { setIsDraggingModule } = useSplitStore()

  // Restore theme from localStorage on mount (after hydration)
  useEffect(() => {
    const saved = localStorage.getItem('bloomfield-theme')
    if (saved !== null) {
      setIsDark(saved === 'dark')
    }
  }, [])

  // ⌘K / Ctrl+K global shortcut
  useEffect(() => {
    if (!onSearchOpen) return
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        onSearchOpen!()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onSearchOpen])

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

  const makeDragHandlers = (href: string, label: string) => ({
    onDragStart: (e: React.DragEvent) => {
      e.dataTransfer.setData(MODULE_DRAG_TYPE, JSON.stringify({ href, label }))
      e.dataTransfer.effectAllowed = 'copy'
      setIsDraggingModule(true)
    },
    onDragEnd: () => setIsDraggingModule(false),
  })

  return (
    <header className="bg-card border-b border-border shrink-0">
      {/* Top Bar */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-border/50">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-secondary/50 transition-colors"
          >
            <Menu className="w-5 h-5 text-foreground" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-foreground">Bloomfield</h1>
              <p className="text-[10px] text-muted-foreground">Terminal</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-0.5 ml-4">
            {NAV_ITEMS.map(item => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                {...makeDragHandlers(item.href, item.label)}
              />
            ))}
          </nav>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Search trigger */}
          {onSearchOpen && (
            <button
              onClick={onSearchOpen}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-secondary/50 rounded-lg border border-border/50 hover:border-border transition-colors"
            >
              <Search className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground w-40 text-left">Rechercher…</span>
              <kbd className="text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">⌘K</kbd>
            </button>
          )}

          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-secondary/50 transition-colors">
            <Bell className="w-5 h-5 text-muted-foreground" />
            {notifications > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] font-semibold rounded-full flex items-center justify-center">
                {notifications}
              </span>
            )}
          </button>

          {/* Theme toggle */}
          <button
            onClick={() => setIsDark(prev => !prev)}
            className="p-2 rounded-lg hover:bg-secondary/50 transition-colors"
            title={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
          >
            {isDark
              ? <Sun className="w-5 h-5 text-muted-foreground" />
              : <Moon className="w-5 h-5 text-muted-foreground" />
            }
          </button>

          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-secondary/50 transition-colors">
                <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-xs font-medium text-foreground">Amadou Diallo</div>
                  <div className="text-[10px] text-muted-foreground">Pro Account</div>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground hidden md:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
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
      </div>
    </header>
  )
}
