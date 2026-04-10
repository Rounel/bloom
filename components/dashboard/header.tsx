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
  Shield,
  HelpCircle,
  BarChart3,
  TrendingUp,
  Newspaper,
  Tv,
  Menu
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { marketIndices, brvmStocks } from '@/lib/mock-data'
import { useDashboardStore } from '@/lib/dashboard-store'
import Link from 'next/link'

export function DashboardHeader({ onSearchOpen }: { onSearchOpen: () => void }) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [notifications] = useState(3)
  const { setSidebarOpen } = useDashboardStore()

  // ⌘K / Ctrl+K global shortcut
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        onSearchOpen()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onSearchOpen])

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

  return (
    <header className="bg-card border-b border-border shrink-0">
      {/* Top Bar - Logo, Navigation, Right Section */}
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
          <nav className="hidden lg:flex items-center gap-1 ml-4">
            <Link href="/terminal/operations" className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary/50 rounded-md transition-colors">
              <BarChart3 className="w-4 h-4" />
              Opérations Boursières
            </Link>
            <Link href="/terminal/macro" className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary/50 rounded-md transition-colors">
              <BarChart3 className="w-4 h-4" />
              Données Macroéconomiques
            </Link>
            <Link href="/terminal/analyse" className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary/50 rounded-md transition-colors">
              <BarChart3 className="w-4 h-4" />
              Analyse Financière
            </Link>
            <Link href="/terminal/communication" className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary/50 rounded-md transition-colors">
              <BarChart3 className="w-4 h-4" />
              Communication & Education
            </Link>
            <Link href="/terminal/dashboard" className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary/50 rounded-md transition-colors">
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </Link>
          </nav>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
        {/* Search trigger */}
        <button
          onClick={onSearchOpen}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-secondary/50 rounded-lg border border-border/50 hover:border-border transition-colors"
        >
          <Search className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground w-40 text-left">Rechercher…</span>
          <kbd className="text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">⌘K</kbd>
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-secondary/50 transition-colors">
          <Bell className="w-5 h-5 text-muted-foreground" />
          {notifications > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] font-semibold rounded-full flex items-center justify-center">
              {notifications}
            </span>
          )}
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-secondary/50 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-medium text-foreground">Amadou Diallo</div>
              <div className="text-[10px] text-muted-foreground">Pro Account</div>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground hidden md:block" />
          </button>

          {showUserMenu && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-lg shadow-xl z-50 overflow-hidden">
                <div className="p-3 border-b border-border">
                  <div className="text-sm font-medium text-foreground">Amadou Diallo</div>
                  <div className="text-xs text-muted-foreground">amadou.diallo@example.com</div>
                </div>
                <div className="p-1">
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-secondary/50 rounded-md transition-colors">
                    <User className="w-4 h-4 text-muted-foreground" />
                    Mon profil
                  </button>
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-secondary/50 rounded-md transition-colors">
                    <Settings className="w-4 h-4 text-muted-foreground" />
                    Paramètres
                  </button>
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-secondary/50 rounded-md transition-colors">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    Sécurité
                  </button>
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-secondary/50 rounded-md transition-colors">
                    <HelpCircle className="w-4 h-4 text-muted-foreground" />
                    Aide
                  </button>
                </div>
                <div className="p-1 border-t border-border">
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors">
                    <LogOut className="w-4 h-4" />
                    Déconnexion
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
        </div>
      </div>

      {/* Market Ticker Bar with Infinite Scroll */}
      <div className="h-8 bg-secondary/30 overflow-hidden relative">
        <div className="flex animate-scroll-infinite whitespace-nowrap">
          {/* First set */}
          {tickerItems.map((item, index) => (
            <div key={`first-${index}`} className="inline-flex items-center gap-2 px-4 border-r border-border/30">
              <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
              <span className="text-xs font-mono font-semibold text-foreground">
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
              <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
              <span className="text-xs font-mono font-semibold text-foreground">
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
    </header>
  )
}
