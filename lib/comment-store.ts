import { create } from 'zustand'
import { supabase, type DbComment } from '@/lib/supabase'

export interface Comment {
  id: string
  text: string
  route: string
  routeLabel: string
  panelId?: string
  panelLabel?: string
  timestamp: string
  ip?: string
  userAgent?: string
}

type View = 'compose' | 'list'

type CommentStore = {
  comments: Comment[]
  isOpen: boolean
  view: View
  loading: boolean
  /** Masque le bouton flottant (ex: quand un module est ouvert sur /modules) */
  hideButton: boolean

  toggle: () => void
  setOpen: (v: boolean) => void
  setView: (v: View) => void
  setHideButton: (v: boolean) => void

  /** Charge les commentaires depuis Supabase */
  fetchComments: () => Promise<void>
  /** Insère un commentaire dans Supabase puis met à jour le store */
  addComment: (c: Omit<Comment, 'id' | 'timestamp'>) => Promise<void>
  /** Supprime un commentaire dans Supabase puis met à jour le store */
  deleteComment: (id: string) => Promise<void>
  /** Modifie le texte d'un commentaire dans Supabase puis met à jour le store */
  updateComment: (id: string, text: string) => Promise<void>
}

function dbToComment(row: DbComment): Comment {
  return {
    id: row.id,
    text: row.text,
    route: row.route,
    routeLabel: row.route_label,
    panelId: row.panel_id ?? undefined,
    panelLabel: row.panel_label ?? undefined,
    timestamp: row.created_at,
    ip: row.ip ?? undefined,
    userAgent: row.user_agent ?? undefined,
  }
}

export const useCommentStore = create<CommentStore>((set) => ({
  comments: [],
  isOpen: false,
  view: 'compose',
  loading: false,
  hideButton: false,

  toggle:        () => set(s => ({ isOpen: !s.isOpen })),
  setOpen:       (v) => set({ isOpen: v }),
  setView:       (v) => set({ view: v }),
  setHideButton: (v) => set({ hideButton: v }),

  fetchComments: async () => {
    set({ loading: true })
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error && data) {
      set({ comments: (data as DbComment[]).map(dbToComment) })
    }
    set({ loading: false })
  },

  addComment: async (c) => {
    const { data, error } = await supabase
      .from('comments')
      .insert({
        text:        c.text,
        route:       c.route,
        route_label: c.routeLabel,
        panel_id:    c.panelId ?? null,
        panel_label: c.panelLabel ?? null,
        ip:          c.ip ?? null,
        user_agent:  c.userAgent ?? null,
      })
      .select()
      .single()
    if (!error && data) {
      set(s => ({ comments: [dbToComment(data as DbComment), ...s.comments] }))
    }
  },

  deleteComment: async (id) => {
    const { error } = await supabase.from('comments').delete().eq('id', id)
    if (!error) {
      set(s => ({ comments: s.comments.filter(c => c.id !== id) }))
    }
  },

  updateComment: async (id, text) => {
    const { error } = await supabase
      .from('comments')
      .update({ text })
      .eq('id', id)
    if (!error) {
      set(s => ({
        comments: s.comments.map(c => c.id === id ? { ...c, text } : c),
      }))
    }
  },
}))
