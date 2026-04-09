'use client'

import { useState } from 'react'
import { economicCalendar, type EconomicEvent } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { Calendar, Clock, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react'

type ImportanceFilter = 'all' | 'high' | 'medium' | 'low'

export function EconomicCalendarPanel() {
  const [filter, setFilter] = useState<ImportanceFilter>('all')
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null)

  const filteredEvents = economicCalendar.filter(
    event => filter === 'all' || event.importance === filter
  )

  const groupedEvents = filteredEvents.reduce((groups, event) => {
    const date = event.date
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(event)
    return groups
  }, {} as Record<string, EconomicEvent[]>)

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (dateStr === today.toISOString().split('T')[0]) {
      return "Aujourd'hui"
    } else if (dateStr === tomorrow.toISOString().split('T')[0]) {
      return 'Demain'
    }
    return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
  }

  const getImportanceColor = (importance: EconomicEvent['importance']) => {
    switch (importance) {
      case 'high': return 'bg-destructive text-destructive-foreground'
      case 'medium': return 'bg-accent text-accent-foreground'
      case 'low': return 'bg-secondary text-secondary-foreground'
    }
  }

  return (
    <div className="flex flex-col h-full gap-3">
      {/* Filter */}
      <div className="flex gap-1">
        {(['all', 'high', 'medium', 'low'] as ImportanceFilter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-2 py-1 text-xs rounded transition-colors",
              filter === f 
                ? "bg-primary text-primary-foreground" 
                : "bg-secondary/50 text-muted-foreground hover:text-foreground"
            )}
          >
            {f === 'all' ? 'Tous' : f === 'high' ? 'Important' : f === 'medium' ? 'Moyen' : 'Faible'}
          </button>
        ))}
      </div>

      {/* Events List */}
      <div className="flex-1 overflow-auto space-y-4">
        {Object.entries(groupedEvents).map(([date, events]) => (
          <div key={date}>
            <div className="flex items-center gap-2 mb-2 sticky top-0 bg-card py-1">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-semibold text-foreground capitalize">
                {formatDate(date)}
              </span>
            </div>
            <div className="space-y-2">
              {events.map((event) => (
                <div
                  key={event.id}
                  className={cn(
                    "p-2 rounded-lg border border-border/50 hover:border-primary/30 transition-colors cursor-pointer",
                    expandedEvent === event.id && "border-primary/50 bg-primary/5"
                  )}
                  onClick={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn(
                          "px-1.5 py-0.5 text-[10px] font-semibold rounded",
                          getImportanceColor(event.importance)
                        )}>
                          {event.importance === 'high' && <AlertCircle className="w-2.5 h-2.5 inline mr-0.5" />}
                          {event.country}
                        </span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {event.time}
                        </span>
                      </div>
                      <h4 className="text-xs font-medium text-foreground">{event.event}</h4>
                    </div>
                    {expandedEvent === event.id ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                    )}
                  </div>
                  
                  {expandedEvent === event.id && (
                    <div className="mt-2 pt-2 border-t border-border/50 grid grid-cols-3 gap-2 text-[10px]">
                      {event.actual && (
                        <div>
                          <div className="text-muted-foreground">Actuel</div>
                          <div className="font-mono font-semibold text-primary">{event.actual}</div>
                        </div>
                      )}
                      {event.forecast && (
                        <div>
                          <div className="text-muted-foreground">Prévision</div>
                          <div className="font-mono text-foreground">{event.forecast}</div>
                        </div>
                      )}
                      {event.previous && (
                        <div>
                          <div className="text-muted-foreground">Précédent</div>
                          <div className="font-mono text-muted-foreground">{event.previous}</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="text-[10px] text-muted-foreground text-center pt-2 border-t border-border/50">
        {filteredEvents.length} événements à venir
      </div>
    </div>
  )
}
