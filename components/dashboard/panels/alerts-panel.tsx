'use client'

import { useState } from 'react'
import { priceAlerts } from '@/lib/mock-data'
import type { PriceAlert } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { Bell, BellOff, Trash2, TrendingUp, TrendingDown, AlertTriangle, Activity } from 'lucide-react'

type Tab = 'prix' | 'marche'

const MARKET_ALERTS = [
  { id: 'm1', label: 'Volatilité BRVM Composite > 2%', severity: 'modéré', active: true },
  { id: 'm2', label: 'Volume inhabituellement élevé — SNTS', severity: 'faible', active: true },
  { id: 'm3', label: 'Inversion courbe des taux UEMOA', severity: 'élevé', active: false },
  { id: 'm4', label: 'Écart bid/ask SGBC > 0.5%', severity: 'faible', active: true },
  { id: 'm5', label: 'Corrélation anormale FCFA/USD', severity: 'élevé', active: true },
]

function severityStyle(s: string) {
  if (s === 'élevé') return 'bg-red-400/20 text-red-400'
  if (s === 'modéré') return 'bg-yellow-500/20 text-yellow-500'
  return 'bg-emerald-500/20 text-emerald-500'
}

export function AlertsPanel() {
  const [tab, setTab] = useState<Tab>('prix')
  const [alerts, setAlerts] = useState<PriceAlert[]>(priceAlerts)

  function toggleAlert(id: string) {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a))
  }
  function removeAlert(id: string) {
    setAlerts(prev => prev.filter(a => a.id !== id))
  }

  return (
    <div className="flex flex-col h-full gap-2 text-xs">
      {/* Tabs */}
      <div className="flex gap-1 bg-secondary/30 rounded-lg p-1">
        {(['prix', 'marche'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'flex-1 py-1 text-xs font-medium rounded-md transition-colors',
              tab === t ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {t === 'prix' ? 'Alertes Prix' : 'Alertes Marché'}
          </button>
        ))}
      </div>

      {tab === 'prix' ? (
        <div className="flex-1 overflow-auto space-y-1.5">
          {alerts.length === 0 && (
            <div className="text-center text-muted-foreground py-8">Aucune alerte prix configurée</div>
          )}
          {alerts.map(a => (
            <div
              key={a.id}
              className={cn(
                'rounded-lg border px-3 py-2 flex items-start gap-2 transition-opacity',
                a.active ? 'border-border/50 bg-card/60' : 'border-border/20 bg-secondary/20 opacity-60',
                a.triggeredAt && 'border-yellow-500/40 bg-yellow-500/5'
              )}
            >
              <div className="mt-0.5">
                {a.type === 'above'
                  ? <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                  : <TrendingDown className="w-3.5 h-3.5 text-red-400" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-semibold text-foreground">{a.symbol}</span>
                  <span className="text-muted-foreground">{a.type === 'above' ? '≥' : '≤'}</span>
                  <span className="font-mono font-bold text-foreground">{a.targetPrice.toLocaleString('fr-FR')} FCFA</span>
                  {a.triggeredAt && (
                    <span className="bg-yellow-500/20 text-yellow-500 rounded px-1 py-0.5 text-[10px] font-semibold">
                      Déclenchée
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5">
                  Cours actuel: <span className="font-mono text-foreground">{a.currentPrice.toLocaleString('fr-FR')}</span>
                  {' '}· {a.name}
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => toggleAlert(a.id)}
                  className="p-1 rounded hover:bg-secondary transition-colors"
                  title={a.active ? 'Désactiver' : 'Activer'}
                >
                  {a.active
                    ? <Bell className="w-3.5 h-3.5 text-primary" />
                    : <BellOff className="w-3.5 h-3.5 text-muted-foreground" />
                  }
                </button>
                <button
                  onClick={() => removeAlert(a.id)}
                  className="p-1 rounded hover:bg-destructive/20 transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 overflow-auto space-y-1.5">
          {MARKET_ALERTS.map(a => (
            <div
              key={a.id}
              className={cn(
                'rounded-lg border px-3 py-2 flex items-start gap-2',
                a.active ? 'border-border/50 bg-card/60' : 'border-border/20 bg-secondary/20 opacity-60'
              )}
            >
              <div className="mt-0.5">
                {a.severity === 'élevé'
                  ? <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                  : <Activity className="w-3.5 h-3.5 text-yellow-500" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-foreground text-xs">{a.label}</span>
              </div>
              <span className={cn('rounded px-1.5 py-0.5 text-[10px] font-semibold flex-shrink-0', severityStyle(a.severity))}>
                {a.severity}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
