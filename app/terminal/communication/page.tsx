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

// ─── Ticker Bar ───────────────────────────────────────────────────────────────

function TickerBar() {
  const [items, setItems] = useState<{ label: string; change: number; isPositive: boolean }[]>([])
  useEffect(() => {
    const base = [
      ...marketIndices.map(i => ({ label: i.name, change: i.changePercent, isPositive: i.change >= 0 })),
      ...brvmStocks.map(s => ({ label: s.symbol, change: s.changePercent, isPositive: s.change >= 0 })),
    ]
    setItems(base)
    const id = setInterval(() => setItems(prev => prev.map(it => {
      const c = it.change + (Math.random() - 0.5) * 0.06
      return { ...it, change: c, isPositive: c >= 0 }
    })), 1500)
    return () => clearInterval(id)
  }, [])
  if (!items.length) return <div className="h-9 bg-secondary/40 border-b border-border/50" />
  return (
    <div className="h-9 bg-secondary/40 border-b border-border/50 overflow-hidden flex items-center relative select-none">
      <div className="absolute left-0 inset-y-0 w-10 bg-gradient-to-r from-secondary/60 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 inset-y-0 w-10 bg-gradient-to-l from-secondary/60 to-transparent z-10 pointer-events-none" />
      <div className="flex animate-scroll-infinite whitespace-nowrap [animation-duration:45s] hover:[animation-play-state:paused]">
        {[...items, ...items].map((it, i) => (
          <div key={i} className="inline-flex items-center gap-2 px-4 border-r border-border/30">
            <span className="text-[11px] font-semibold text-muted-foreground">{it.label}</span>
            <span className={cn('text-[11px] font-mono font-bold', it.isPositive ? 'text-emerald-500' : 'text-red-400')}>
              {it.isPositive ? '▲' : '▼'}&thinsp;{Math.abs(it.change).toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function SectionCard({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-secondary/20">
        <Icon className="w-4 h-4 text-primary" />
        <span className="text-sm font-semibold">{title}</span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

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

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <header className="h-14 border-b flex items-center px-6 bg-card/50 backdrop-blur-sm gap-4 shrink-0">
        <Link href="/modules" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="w-4 h-4" />
          <span className="text-sm">Modules</span>
        </Link>
        <div className="h-5 w-px bg-border/50" />
        <div className="flex items-center gap-2">
          <Radio className="w-5 h-5 text-primary" />
          <span className="font-bold text-base">Communication & Éducation</span>
          <span className="text-xs text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-full">Module 5</span>
        </div>
        <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          {time}
        </div>
      </header>

      <TickerBar />

      <main className="flex-1 p-4 lg:p-6 overflow-auto">
        <div className="grid xl:grid-cols-3 md:grid-cols-2 gap-4">

          {/* News Center */}
          <div className="xl:col-span-1">
            <SectionCard icon={Newspaper} title="Centre d'actualités">
              {/* Search */}
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
              {/* Category filters */}
              <div className="flex flex-wrap gap-1 mb-3">
                {NEWS_CATS.slice(0, 6).map(c => (
                  <button
                    key={c}
                    onClick={() => setNewsCat(c)}
                    className={cn(
                      'px-2 py-0.5 rounded-full border text-[10px] font-medium transition-colors',
                      newsCat === c
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'text-muted-foreground border-border hover:border-foreground/30'
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
              {/* News list */}
              <div className="space-y-1.5 max-h-80 overflow-auto">
                {filteredNews.map(n => (
                  <div
                    key={n.id}
                    className="p-2 rounded-lg bg-secondary/20 hover:bg-secondary/40 transition-colors cursor-pointer"
                    onClick={() => setExpandedNewsId(expandedNewsId === n.id ? null : n.id)}
                  >
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
                {filteredNews.length === 0 && (
                  <div className="text-center text-xs text-muted-foreground py-6">Aucun résultat</div>
                )}
              </div>
            </SectionCard>
          </div>

          {/* Alerts */}
          <div className="xl:col-span-1">
            <SectionCard icon={Bell} title="Gestionnaire d'alertes prix">
              <div className="space-y-2 max-h-96 overflow-auto">
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
                      <div className="flex items-center gap-1.5 flex-wrap text-xs">
                        <span className="font-bold text-foreground">{a.symbol}</span>
                        <span className="text-muted-foreground">{a.type === 'above' ? '≥' : '≤'}</span>
                        <span className="font-mono font-semibold text-foreground">{a.targetPrice.toLocaleString('fr-FR')} FCFA</span>
                        {a.triggeredAt && (
                          <span className="bg-yellow-500/20 text-yellow-500 rounded px-1 py-0.5 text-[10px] font-semibold">Déclenchée</span>
                        )}
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        Cours actuel: <span className="font-mono text-foreground">{a.currentPrice.toLocaleString('fr-FR')}</span>
                        {' '}· {a.name}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => toggleAlert(a.id)} className="p-1 rounded hover:bg-secondary transition-colors">
                        {a.active
                          ? <Bell className="w-3.5 h-3.5 text-primary" />
                          : <BellOff className="w-3.5 h-3.5 text-muted-foreground" />
                        }
                      </button>
                      <button onClick={() => removeAlert(a.id)} className="p-1 rounded hover:bg-destructive/20 transition-colors">
                        <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                ))}
                {alerts.length === 0 && (
                  <div className="text-center text-xs text-muted-foreground py-8">Aucune alerte configurée</div>
                )}
              </div>
            </SectionCard>
          </div>

          {/* Web TV — full width */}
          <div className="xl:col-span-3 md:col-span-2">
            <SectionCard icon={Radio} title="Bloomfield Web TV">
              {/* Tabs */}
              <div className="flex gap-1 bg-secondary/30 rounded-lg p-1 w-fit mb-4">
                {(['live', 'programme', 'replays'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setTvTab(t)}
                    className={cn(
                      'px-4 py-1.5 text-xs font-medium rounded-md transition-colors capitalize',
                      tvTab === t ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {t === 'live' ? '🔴 LIVE' : t === 'programme' ? 'Programme' : 'Replays'}
                  </button>
                ))}
              </div>

              {tvTab === 'live' && (
                <div className="grid xl:grid-cols-3 gap-4">
                  <div className="xl:col-span-2">
                    <div className="aspect-video bg-secondary/30 rounded-xl flex flex-col items-center justify-center border border-border/40 relative overflow-hidden">
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                        EN DIRECT
                      </div>
                      <Radio className="w-12 h-12 text-muted-foreground/30 mb-2" />
                      <div className="text-sm text-muted-foreground font-medium">Bloomfield Morning Markets</div>
                      <div className="text-xs text-muted-foreground mt-1">Analyse quotidienne des marchés UEMOA</div>
                      <button className="mt-4 flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                        <Play className="w-4 h-4 fill-current" />
                        Regarder
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
            </SectionCard>
          </div>

          {/* Education — full width */}
          <div className="xl:col-span-3 md:col-span-2">
            <SectionCard icon={BookOpen} title="Espace Éducatif">
              <div className="flex gap-1 bg-secondary/30 rounded-lg p-1 w-fit mb-4">
                {(['articles', 'webinaires', 'glossaire'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setEduTab(t)}
                    className={cn(
                      'px-4 py-1.5 text-xs font-medium rounded-md transition-colors capitalize',
                      eduTab === t ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {t === 'articles' ? 'Articles' : t === 'webinaires' ? 'Webinaires' : 'Glossaire'}
                  </button>
                ))}
              </div>

              {eduTab === 'articles' && (
                <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-3">
                  {educationArticles.map(a => (
                    <div key={a.id} className="rounded-lg border border-border/40 p-3 hover:border-border/80 transition-colors">
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className={cn('text-[10px] font-semibold rounded px-1.5 py-0.5', LEVEL_COLOR[a.level])}>
                          {a.level}
                        </span>
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
                              : <span className="bg-secondary/50 text-muted-foreground text-[10px] px-2 py-0.5 rounded">Replay</span>
                            }
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
                        onClick={() => setGlossaryOpen(prev => {
                          const next = new Set(prev)
                          next.has(g.term) ? next.delete(g.term) : next.add(g.term)
                          return next
                        })}
                        className="w-full flex items-center justify-between px-3 py-2 hover:bg-secondary/20 transition-colors"
                      >
                        <span className="text-xs font-bold text-foreground">{g.term}</span>
                        <span className="text-muted-foreground">{glossaryOpen.has(g.term) ? '▲' : '▼'}</span>
                      </button>
                      {glossaryOpen.has(g.term) && (
                        <div className="px-3 pb-3 text-[11px] text-muted-foreground leading-relaxed border-t border-border/30">
                          {g.def}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>
          </div>

        </div>
      </main>

      <footer className="h-10 border-t border-border/30 bg-card/30 backdrop-blur-sm flex items-center px-6 gap-4 shrink-0">
        <span className="text-xs text-muted-foreground">Bloomfield Intelligence • Module 5 — Communication & Éducation</span>
        <span className="ml-auto text-xs text-muted-foreground">Données simulées — maquette de présentation</span>
      </footer>
    </div>
  )
}
