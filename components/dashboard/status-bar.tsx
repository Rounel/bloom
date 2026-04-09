'use client'

import { useEffect, useState } from 'react'
import { 
  Circle, 
  Clock, 
  Signal, 
  Wifi, 
  Shield,
  Server
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function StatusBar() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [marketStatus, setMarketStatus] = useState<'open' | 'closed' | 'pre-market'>('open')

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
      
      // Check market hours (BRVM: 9h00 - 15h30 WAT)
      const hours = new Date().getHours()
      if (hours >= 9 && hours < 15.5) {
        setMarketStatus('open')
      } else if (hours >= 8 && hours < 9) {
        setMarketStatus('pre-market')
      } else {
        setMarketStatus('closed')
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const getMarketStatusColor = () => {
    switch (marketStatus) {
      case 'open': return 'text-primary'
      case 'pre-market': return 'text-accent'
      case 'closed': return 'text-muted-foreground'
    }
  }

  const getMarketStatusText = () => {
    switch (marketStatus) {
      case 'open': return 'Marché ouvert'
      case 'pre-market': return 'Pré-ouverture'
      case 'closed': return 'Marché fermé'
    }
  }

  return (
    <footer className="h-7 bg-card border-t border-border flex items-center justify-between px-4 text-xs text-muted-foreground shrink-0">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Market Status */}
        <div className="flex items-center gap-1.5">
          <Circle className={cn("w-2 h-2 fill-current", getMarketStatusColor())} />
          <span className={getMarketStatusColor()}>{getMarketStatusText()}</span>
        </div>

        {/* Connection Status */}
        <div className="flex items-center gap-1.5">
          <Wifi className="w-3 h-3 text-primary" />
          <span>Connecté</span>
        </div>

        {/* Data Feed */}
        <div className="flex items-center gap-1.5">
          <Signal className="w-3 h-3 text-primary" />
          <span>Flux temps réel</span>
        </div>
      </div>

      {/* Center Section */}
      <div className="hidden md:flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <Server className="w-3 h-3" />
          <span>Latence: 12ms</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Shield className="w-3 h-3 text-primary" />
          <span>Connexion sécurisée</span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3 h-3" />
          <span>{currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
        </div>
        <span className="text-muted-foreground/50">|</span>
        <span>BRVM Session</span>
        <span className="text-muted-foreground/50">|</span>
        <span>v2.4.1</span>
      </div>
    </footer>
  )
}
