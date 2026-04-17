'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
  ChevronLeft, Newspaper, Bell, Radio, BookOpen, Clock,
  Search, X, TrendingUp, TrendingDown, Trash2, BellOff, Play,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  brvmStocks, marketIndices, newsItems, moreNewsItems, priceAlerts, educationArticles, webinars,
  type PriceAlert,
} from '@/lib/mock-data'
import { ModuleLayout, ModuleSection, SectionDef } from '@/components/dashboard/module-layout'
import { PanelGrid, PanelRow } from '@/components/dashboard/panel-grid'
import { useModuleSectionsStore } from '@/lib/module-sections-store'

const SECTIONS: SectionDef[] = [
  { id: 'news',      label: 'Actualités',    icon: Newspaper },
  { id: 'alerts',    label: 'Alertes prix',  icon: Bell },
  { id: 'web-tv',    label: 'Web TV',        icon: Radio },
  { id: 'education', label: 'Éducation',     icon: BookOpen },
]

const ALL_NEWS = [...newsItems, ...moreNewsItems]
const NEWS_CATS = ['Tous', ...Array.from(new Set(ALL_NEWS.map(n => n.category)))]

const GLOSSARY = [
  { term: 'BRVM', def: 'Bourse Régionale des Valeurs Mobilières — bourse commune des 8 pays UEMOA.' },
  { term: 'OAT', def: 'Obligation Assimilable du Trésor — titre de dette souveraine à long terme.' },
  { term: 'BCEAO', def: 'Banque Centrale des États de l\'Afrique de l\'Ouest — banque centrale UEMOA.' },
  { term: 'P/E', def: 'Price-to-Earnings — ratio cours/bénéfice, mesure la cherté d\'un titre.' },
  { term: 'ROE', def: 'Return on Equity — rentabilité des capitaux propres.' },
  { term: 'FCFA', def: 'Franc CFA — monnaie officielle des pays UEMOA, arrimée à l\'euro.' },
  { term: 'Spread', def: 'Écart entre le taux souverain d\'un pays et le taux de référence (OAT France).' },
  { term: 'VaR', def: 'Value at Risk — perte maximale probable sur un horizon donné avec un niveau de confiance.' },
]

const LEVEL_COLOR: Record<string, string> = {
  'débutant': 'bg-emerald-500/20 text-emerald-500',
  'intermédiaire': 'bg-yellow-500/20 text-yellow-500',
  'avancé': 'bg-red-400/20 text-red-400',
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CommunicationPage() {
  const [newsSearch, setNewsSearch] = useState('')
  const [newsCat, setNewsCat] = useState('Tous')
  const [expandedNewsId, setExpandedNewsId] = useState<number | null>(null)
  const [alerts, setAlerts] = useState<PriceAlert[]>(priceAlerts)
  const [tvTab, setTvTab] = useState<'live' | 'programme' | 'replays'>('live')
  const [eduTab, setEduTab] = useState<'articles' | 'webinaires' | 'glossaire'>('articles')
  const [glossaryOpen, setGlossaryOpen] = useState<Set<string>>(new Set())
  const [time, setTime] = useState('')

  const toggleSection = useModuleSectionsStore(s => s.toggle)

  useEffect(() => {
    setTime(new Date().toLocaleTimeString('fr-FR'))
    const id = setInterval(() => setTime(new Date().toLocaleTimeString('fr-FR')), 1000)
    return () => clearInterval(id)
  }, [])

  const filteredNews = useMemo(() => {
    let items = ALL_NEWS
    if (newsCat !== 'Tous') items = items.filter(n => n.category === newsCat)
    if (newsSearch) items = items.filter(n =>
      n.title.toLowerCase().includes(newsSearch.toLowerCase()) ||
      n.summary.toLowerCase().includes(newsSearch.toLowerCase())
    )
    return items
  }, [newsCat, newsSearch])

  function toggleAlert(id: string) {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a))
  }
  function removeAlert(id: string) {
    setAlerts(prev => prev.filter(a => a.id !== id))
  }

  const panelRows: PanelRow[] = [
    {
      id: 'comm-row-1',
      cells: [
        {
          id: 'news',
          title: 'Centre d\'actualités',
          icon: Newspaper,
          initialFlex: 1,
          content: (
            <div>
              <div className="relative mb-2">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Rechercher…"
                  value={newsSearch}
                  onChange={e => setNewsSearch(e.target.value)}
                  className="w-full rounded-md border border-border bg-secondary/30 pl-8 pr-8 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
                {newsSearch && (
                  <button onClick={() => setNewsSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2">
                    <X className="w-3 h-3 text-muted-foreground" />
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {NEWS_CATS.slice(0, 6).map(c => (
                  <button key={c} onClick={() => setNewsCat(c)}
                    className={cn('px-2 py-0.5 rounded-full border text-[10px] font-medium transition-colors',
                      newsCat === c ? 'bg-primary text-primary-foreground border-primary' : 'text-muted-foreground border-border hover:border-foreground/30'
                    )}>{c}</button>
                ))}
              </div>
              <div className="space-y-1.5 max-h-80 overflow-auto">
                {filteredNews.map(n => (
                  <div key={n.id} className="p-2 rounded-lg bg-secondary/20 hover:bg-secondary/40 transition-colors cursor-pointer"
                    onClick={() => setExpandedNewsId(expandedNewsId === n.id ? null : n.id)}>
                    <div className="flex items-start gap-2">
                      <span className="text-[10px] bg-secondary/50 text-muted-foreground rounded px-1.5 py-0.5 shrink-0 mt-0.5">{n.category}</span>
                      <span className="text-xs font-medium text-foreground leading-snug">{n.title}</span>
                    </div>
                    {expandedNewsId === n.id && (
                      <div className="mt-2 text-[11px] text-muted-foreground leading-relaxed border-t border-border/30 pt-2">
                        {n.summary}
                        <div className="text-[10px] text-muted-foreground/60 mt-1">{n.source} · {n.time}</div>
                      </div>
                    )}
                  </div>
                ))}
                {filteredNews.length === 0 && <div className="text-center text-xs text-muted-foreground py-6">Aucun résultat</div>}
              </div>
            </div>
          ),
        },
        {
          id: 'alerts',
          title: 'Gestionnaire d\'alertes prix',
          icon: Bell,
          initialFlex: 1,
          content: (
            <div className="space-y-2 max-h-96 overflow-auto">
              {alerts.map(a => (
                <div key={a.id} className={cn('rounded-lg border px-3 py-2 flex items-start gap-2 transition-opacity',
                  a.active ? 'border-border/50 bg-card/60' : 'border-border/20 bg-secondary/20 opacity-60',
                  a.triggeredAt && 'border-yellow-500/40 bg-yellow-500/5'
                )}>
                  <div className="mt-0.5">
                    {a.type === 'above' ? <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> : <TrendingDown className="w-3.5 h-3.5 text-red-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap text-xs">
                      <span className="font-bold text-foreground">{a.symbol}</span>
                      <span className="text-muted-foreground">{a.type === 'above' ? '≥' : '≤'}</span>
                      <span className="font-mono font-semibold text-foreground">{a.targetPrice.toLocaleString('fr-FR')} FCFA</span>
                      {a.triggeredAt && <span className="bg-yellow-500/20 text-yellow-500 rounded px-1 py-0.5 text-[10px] font-semibold">Déclenchée</span>}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      Cours actuel: <span className="font-mono text-foreground">{a.currentPrice.toLocaleString('fr-FR')}</span>{' '}· {a.name}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => toggleAlert(a.id)} className="p-1 rounded hover:bg-secondary transition-colors">
                      {a.active ? <Bell className="w-3.5 h-3.5 text-primary" /> : <BellOff className="w-3.5 h-3.5 text-muted-foreground" />}
                    </button>
                    <button onClick={() => removeAlert(a.id)} className="p-1 rounded hover:bg-destructive/20 transition-colors">
                      <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              ))}
              {alerts.length === 0 && <div className="text-center text-xs text-muted-foreground py-8">Aucune alerte configurée</div>}
            </div>
          ),
        },
      ],
    },
    {
      id: 'comm-row-2',
      cells: [
        {
          id: 'web-tv',
          title: 'Bloomfield Web TV',
          icon: Radio,
          content: (
            <div>
              <div className="flex gap-1 bg-secondary/30 rounded-lg p-1 w-fit mb-4">
                {(['live', 'programme', 'replays'] as const).map(t => (
                  <button key={t} onClick={() => setTvTab(t)}
                    className={cn('px-4 py-1.5 text-xs font-medium rounded-md transition-colors capitalize',
                      tvTab === t ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                    )}>
                    {t === 'live' ? '🔴 LIVE' : t === 'programme' ? 'Programme' : 'Replays'}
                  </button>
                ))}
              </div>
              {tvTab === 'live' && (
                <div className="grid xl:grid-cols-3 gap-4">
                  <div className="xl:col-span-2">
                    <div className="aspect-video bg-secondary/30 rounded-xl flex flex-col items-center justify-center border border-border/40 relative overflow-hidden">
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />EN DIRECT
                      </div>
                      <Radio className="w-12 h-12 text-muted-foreground/30 mb-2" />
                      <div className="text-sm text-muted-foreground font-medium">Bloomfield Morning Markets</div>
                      <div className="text-xs text-muted-foreground mt-1">Analyse quotidienne des marchés UEMOA</div>
                      <button className="mt-4 flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                        <Play className="w-4 h-4 fill-current" />Regarder
                      </button>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-foreground mb-2">À l'antenne</div>
                    {webinars.filter(w => w.isLive).map(w => (
                      <div key={w.id} className="p-3 rounded-lg bg-secondary/20 border border-red-500/20">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="bg-red-500/20 text-red-400 text-[10px] font-bold px-1.5 py-0.5 rounded">LIVE</span>
                          <span className="font-semibold text-xs text-foreground">{w.title}</span>
                        </div>
                        <div className="text-[10px] text-muted-foreground">{w.presenter}</div>
                        <div className="text-[10px] text-muted-foreground">{w.topic}</div>
                        <div className="text-[10px] text-emerald-500 mt-1">{w.registrations.toLocaleString('fr-FR')} spectateurs</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {tvTab === 'programme' && (
                <div className="overflow-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="text-[10px] text-muted-foreground font-semibold border-b border-border/40">
                        <th className="text-left py-1.5 px-3">Date & Heure</th>
                        <th className="text-left py-1.5 px-3">Titre</th>
                        <th className="text-left py-1.5 px-3">Présentateur</th>
                        <th className="text-left py-1.5 px-3">Thème</th>
                        <th className="text-right py-1.5 px-3">Durée</th>
                        <th className="text-right py-1.5 px-3">Inscrits</th>
                      </tr>
                    </thead>
                    <tbody>
                      {webinars.map(w => (
                        <tr key={w.id} className="border-b border-border/20 hover:bg-secondary/20">
                          <td className="py-2 px-3 font-mono text-muted-foreground">{w.scheduledAt}</td>
                          <td className="py-2 px-3">
                            <div className="flex items-center gap-1.5">
                              {w.isLive && <span className="bg-red-500/20 text-red-400 text-[9px] font-bold px-1 rounded">LIVE</span>}
                              <span className="font-medium text-foreground">{w.title}</span>
                            </div>
                          </td>
                          <td className="py-2 px-3 text-muted-foreground">{w.presenter}</td>
                          <td className="py-2 px-3 text-muted-foreground">{w.topic}</td>
                          <td className="py-2 px-3 text-right text-muted-foreground">{w.duration}min</td>
                          <td className="py-2 px-3 text-right font-mono">{w.registrations.toLocaleString('fr-FR')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {tvTab === 'replays' && (
                <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-3">
                  {webinars.filter(w => !w.isLive).map(w => (
                    <div key={w.id} className="rounded-lg border border-border/40 overflow-hidden hover:border-border/80 transition-colors cursor-pointer">
                      <div className="aspect-video bg-secondary/30 flex items-center justify-center relative">
                        <Play className="w-8 h-8 text-muted-foreground/40" />
                        <span className="absolute bottom-1.5 right-1.5 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">{w.duration}:00</span>
                      </div>
                      <div className="p-2">
                        <div className="text-xs font-medium text-foreground line-clamp-2">{w.title}</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">{w.presenter}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ),
        },
      ],
    },
    {
      id: 'comm-row-3',
      cells: [
        {
          id: 'education',
          title: 'Espace Éducatif',
          icon: BookOpen,
          content: (
            <div>
              <div className="flex gap-1 bg-secondary/30 rounded-lg p-1 w-fit mb-4">
                {(['articles', 'webinaires', 'glossaire'] as const).map(t => (
                  <button key={t} onClick={() => setEduTab(t)}
                    className={cn('px-4 py-1.5 text-xs font-medium rounded-md transition-colors capitalize',
                      eduTab === t ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                    )}>
                    {t === 'articles' ? 'Articles' : t === 'webinaires' ? 'Webinaires' : 'Glossaire'}
                  </button>
                ))}
              </div>
              {eduTab === 'articles' && (
                <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-3">
                  {educationArticles.map(a => (
                    <div key={a.id} className="rounded-lg border border-border/40 p-3 hover:border-border/80 transition-colors">
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className={cn('text-[10px] font-semibold rounded px-1.5 py-0.5', LEVEL_COLOR[a.level])}>{a.level}</span>
                        <span className="text-[10px] text-muted-foreground">{a.duration}min</span>
                      </div>
                      <div className="text-xs font-semibold text-foreground mb-1 line-clamp-2">{a.title}</div>
                      <div className="text-[10px] text-muted-foreground line-clamp-3">{a.summary}</div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {a.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="bg-secondary/50 text-muted-foreground text-[9px] px-1.5 py-0.5 rounded-full">{tag}</span>
                        ))}
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-2">{a.author} · {a.publishedAt}</div>
                    </div>
                  ))}
                </div>
              )}
              {eduTab === 'webinaires' && (
                <div className="overflow-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="text-[10px] text-muted-foreground font-semibold border-b border-border/40">
                        <th className="text-left py-1.5 px-3">Titre</th>
                        <th className="text-left py-1.5 px-3">Présentateur</th>
                        <th className="text-left py-1.5 px-3">Thème</th>
                        <th className="text-center py-1.5 px-3">Date</th>
                        <th className="text-right py-1.5 px-3">Durée</th>
                        <th className="text-center py-1.5 px-3">Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {webinars.map(w => (
                        <tr key={w.id} className="border-b border-border/20 hover:bg-secondary/20">
                          <td className="py-2 px-3 font-medium text-foreground">{w.title}</td>
                          <td className="py-2 px-3 text-muted-foreground">{w.presenter}</td>
                          <td className="py-2 px-3 text-muted-foreground">{w.topic}</td>
                          <td className="py-2 px-3 text-center font-mono text-muted-foreground">{w.scheduledAt}</td>
                          <td className="py-2 px-3 text-right text-muted-foreground">{w.duration}min</td>
                          <td className="py-2 px-3 text-center">
                            {w.isLive
                              ? <span className="bg-red-500/20 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded">EN DIRECT</span>
                              : <span className="bg-secondary/50 text-muted-foreground text-[10px] px-2 py-0.5 rounded">Replay</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {eduTab === 'glossaire' && (
                <div className="grid md:grid-cols-2 gap-2">
                  {GLOSSARY.map(g => (
                    <div key={g.term} className="border border-border/40 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setGlossaryOpen(prev => { const next = new Set(prev); next.has(g.term) ? next.delete(g.term) : next.add(g.term); return next })}
                        className="w-full flex items-center justify-between px-3 py-2 hover:bg-secondary/20 transition-colors">
                        <span className="text-xs font-bold text-foreground">{g.term}</span>
                        <span className="text-muted-foreground">{glossaryOpen.has(g.term) ? '▲' : '▼'}</span>
                      </button>
                      {glossaryOpen.has(g.term) && (
                        <div className="px-3 pb-3 text-[11px] text-muted-foreground leading-relaxed border-t border-border/30">{g.def}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ),
        },
      ],
    },
  ]

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">

      <ModuleLayout pageKey="communication" sections={SECTIONS} mainClassName="overflow-hidden" title="Communication & Éducation">
        <div className="h-full flex flex-col p-4">
          <PanelGrid
            rows={panelRows}
            pageKey="communication"
            onHide={id => toggleSection('communication', id)}
          />
        </div>
      </ModuleLayout>

    </div>
  )
}
