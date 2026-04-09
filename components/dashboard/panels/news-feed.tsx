'use client'

import { useState } from 'react'
import { newsItems, type NewsItem } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { 
  Newspaper, 
  Clock, 
  ExternalLink,
  Zap,
  Building2,
  TrendingUp,
  Landmark,
  Leaf,
  Flame,
  Calendar
} from 'lucide-react'

const categoryIcons: Record<string, React.ElementType> = {
  'Entreprise': Building2,
  'Marché': TrendingUp,
  'Politique Monétaire': Landmark,
  'Macro': Landmark,
  'Banque': Building2,
  'Agriculture': Leaf,
  'Énergie': Flame,
  'Événement': Calendar,
}

type FilterCategory = 'all' | 'Entreprise' | 'Marché' | 'Macro'

export function NewsFeedPanel() {
  const [filter, setFilter] = useState<FilterCategory>('all')
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)

  const categories: FilterCategory[] = ['all', 'Entreprise', 'Marché', 'Macro']

  const filteredNews = newsItems.filter(news => 
    filter === 'all' || news.category === filter || 
    (filter === 'Macro' && ['Politique Monétaire', 'Macro'].includes(news.category))
  )

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    
    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60))
      return `Il y a ${diffMinutes} min`
    } else if (diffHours < 24) {
      return `Il y a ${diffHours}h`
    } else {
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
    }
  }

  return (
    <div className="flex flex-col h-full gap-3">
      {/* Filter Tabs */}
      <div className="flex gap-1 border-b border-border/50 pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={cn(
              "px-2 py-1 text-xs rounded-t transition-colors",
              filter === cat 
                ? "bg-primary/10 text-primary border-b-2 border-primary" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {cat === 'all' ? 'Toutes' : cat}
          </button>
        ))}
      </div>

      {/* News List */}
      <div className="flex-1 overflow-auto space-y-2">
        {filteredNews.map((news) => {
          const CategoryIcon = categoryIcons[news.category] || Newspaper
          
          return (
            <div
              key={news.id}
              className={cn(
                "p-2 rounded-lg border border-border/50 hover:border-primary/30 transition-all cursor-pointer",
                selectedNews?.id === news.id && "border-primary/50 bg-primary/5",
                news.isBreaking && "border-l-2 border-l-destructive"
              )}
              onClick={() => setSelectedNews(news)}
            >
              <div className="flex items-start gap-2">
                {news.isBreaking && (
                  <Zap className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn(
                      "px-1.5 py-0.5 text-[10px] rounded flex items-center gap-1",
                      "bg-secondary text-muted-foreground"
                    )}>
                      <CategoryIcon className="w-2.5 h-2.5" />
                      {news.category}
                    </span>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {formatTime(news.timestamp)}
                    </span>
                  </div>
                  <h4 className="text-sm font-medium text-foreground line-clamp-2 leading-tight">
                    {news.title}
                  </h4>
                  {selectedNews?.id === news.id && (
                    <div className="mt-2 space-y-2">
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {news.summary}
                      </p>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-muted-foreground">Source: {news.source}</span>
                        <button className="flex items-center gap-1 text-primary hover:underline">
                          Lire plus <ExternalLink className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
        <span className="flex items-center gap-1">
          <Newspaper className="w-3 h-3" />
          {filteredNews.length} actualités
        </span>
        <button className="text-primary hover:underline">
          Voir toutes les actualités
        </button>
      </div>
    </div>
  )
}
