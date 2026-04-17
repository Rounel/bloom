'use client'

import { useState } from 'react'
import {
  User, ShieldCheck, Settings, CreditCard, Monitor, Clock,
  Edit2, Camera, Check, X, Eye, EyeOff, Smartphone, Globe,
  Bell, Moon, Sun, LogOut, AlertTriangle, ChevronRight,
  KeyRound, Lock, Badge, Wifi,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ModuleLayout, ModuleSection, SectionDef } from '@/components/dashboard/module-layout'
import { PanelGrid, PanelRow } from '@/components/dashboard/panel-grid'
import { useModuleSectionsStore } from '@/lib/module-sections-store'

// ─── Sections ─────────────────────────────────────────────────────────────────

const SECTIONS: SectionDef[] = [
  { id: 'kpis',        label: 'Vue d\'ensemble',       icon: User },
  { id: 'profil',      label: 'Profil',                 icon: Edit2 },
  { id: 'securite',    label: 'Sécurité',               icon: ShieldCheck },
  { id: 'preferences', label: 'Préférences',            icon: Settings },
  { id: 'abonnement',  label: 'Abonnement',             icon: CreditCard },
  { id: 'sessions',    label: 'Sessions actives',       icon: Monitor },
  { id: 'activite',    label: 'Historique d\'activité', icon: Clock },
]

// ─── Mock data ────────────────────────────────────────────────────────────────

const USER = {
  nom: 'Fabel Seba',
  email: 'fabelseba@gmail.com',
  telephone: '+225 07 00 00 00',
  pays: 'Côte d\'Ivoire',
  ville: 'Abidjan',
  bio: 'Analyste financier spécialisé marchés UEMOA.',
  role: 'Analyste Senior',
  avatar: 'FS',
  inscription: '12 janvier 2025',
  derniereConnexion: '16 avril 2026 à 09:41',
  statut: 'actif' as const,
  plan: 'Bloomfield Pro',
}

const SESSIONS = [
  { id: 1, device: 'Chrome · Windows 11', location: 'Abidjan, CI', ip: '41.202.XXX.XX', date: 'Maintenant', current: true },
  { id: 2, device: 'Safari · iPhone 15', location: 'Abidjan, CI', ip: '41.202.XXX.XX', date: 'Il y a 2h', current: false },
  { id: 3, device: 'Firefox · macOS', location: 'Dakar, SN', ip: '196.14.XXX.XX', date: 'Il y a 3j', current: false },
]

const ACTIVITE = [
  { id: 1, action: 'Connexion réussie', device: 'Chrome · Windows 11', date: '16/04/2026 09:41', type: 'success' as const },
  { id: 2, action: 'Modification du profil', device: 'Chrome · Windows 11', date: '14/04/2026 14:22', type: 'info' as const },
  { id: 3, action: 'Connexion réussie', device: 'Safari · iPhone 15', date: '13/04/2026 19:05', type: 'success' as const },
  { id: 4, action: 'Tentative de connexion échouée', device: 'Inconnu', date: '11/04/2026 03:17', type: 'warning' as const },
  { id: 5, action: 'Mot de passe modifié', device: 'Chrome · Windows 11', date: '08/04/2026 11:30', type: 'info' as const },
  { id: 6, action: 'Connexion réussie', device: 'Firefox · macOS', date: '06/04/2026 08:15', type: 'success' as const },
]

// ─── Profil form ──────────────────────────────────────────────────────────────

function ProfilContent() {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    nom: USER.nom,
    telephone: USER.telephone,
    pays: USER.pays,
    ville: USER.ville,
    bio: USER.bio,
  })
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div>
      {/* Edit button inline */}
      <div className="flex justify-end mb-3">
        {editing ? (
          <div className="flex gap-1">
            <button onClick={handleSave}
              className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              <Check className="w-3 h-3" /> Enregistrer
            </button>
            <button onClick={() => setEditing(false)}
              className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-secondary text-foreground hover:bg-secondary/80 transition-colors">
              <X className="w-3 h-3" /> Annuler
            </button>
          </div>
        ) : (
          <button onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors">
            <Edit2 className="w-3 h-3" /> Modifier
          </button>
        )}
      </div>

      {saved && (
        <div className="mb-4 flex items-center gap-2 text-xs text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">
          <Check className="w-3.5 h-3.5" /> Profil mis à jour avec succès
        </div>
      )}

      {/* Avatar */}
      <div className="flex items-start gap-4 mb-6">
        <div className="relative group">
          <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center text-xl font-black text-primary select-none">
            {USER.avatar}
          </div>
          <button className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Camera className="w-4 h-4 text-white" />
          </button>
        </div>
        <div>
          <div className="font-bold text-base text-foreground">{USER.nom}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{USER.email}</div>
          <div className="mt-1.5 flex items-center gap-1.5">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/15 text-primary font-semibold border border-primary/20">
              {USER.role}
            </span>
            <span className={cn(
              'text-[10px] px-2 py-0.5 rounded-full font-semibold border',
              USER.statut === 'actif'
                ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/20'
                : 'bg-red-500/15 text-red-400 border-red-400/20',
            )}>
              {USER.statut === 'actif' ? 'Actif' : 'Inactif'}
            </span>
          </div>
        </div>
      </div>

      {/* Champs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { label: 'Nom complet', key: 'nom', value: form.nom, type: 'text' },
          { label: 'Téléphone', key: 'telephone', value: form.telephone, type: 'tel' },
          { label: 'Pays', key: 'pays', value: form.pays, type: 'text' },
          { label: 'Ville', key: 'ville', value: form.ville, type: 'text' },
        ].map(field => (
          <div key={field.key}>
            <label className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block mb-1">
              {field.label}
            </label>
            {editing ? (
              <input
                type={field.type}
                value={field.value}
                onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                className="w-full rounded-lg border border-border bg-secondary/30 px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary/50 transition-colors"
              />
            ) : (
              <div className="text-xs text-foreground px-3 py-2 rounded-lg bg-secondary/20">
                {field.value}
              </div>
            )}
          </div>
        ))}

        <div className="sm:col-span-2">
          <label className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block mb-1">
            Bio
          </label>
          {editing ? (
            <textarea
              rows={2}
              value={form.bio}
              onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
              className="w-full rounded-lg border border-border bg-secondary/30 px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none"
            />
          ) : (
            <div className="text-xs text-foreground px-3 py-2 rounded-lg bg-secondary/20">
              {form.bio || <span className="text-muted-foreground/50 italic">Aucune bio</span>}
            </div>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block mb-1">
            Adresse e-mail
          </label>
          <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg bg-secondary/20">
            <span className="text-foreground">{USER.email}</span>
            <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-500 font-semibold">Vérifiée</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Sécurité ─────────────────────────────────────────────────────────────────

function SecuriteContent() {
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew]         = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [twoFa, setTwoFa]             = useState(true)
  const [pwdForm, setPwdForm]         = useState({ current: '', next: '', confirm: '' })
  const [pwdMsg, setPwdMsg]           = useState('')

  function handlePwd() {
    if (!pwdForm.current || !pwdForm.next) return
    if (pwdForm.next !== pwdForm.confirm) {
      setPwdMsg('error')
    } else {
      setPwdMsg('success')
      setPwdForm({ current: '', next: '', confirm: '' })
    }
    setTimeout(() => setPwdMsg(''), 3000)
  }

  const strength = (() => {
    const p = pwdForm.next
    if (p.length === 0) return 0
    let s = 0
    if (p.length >= 8) s++
    if (/[A-Z]/.test(p)) s++
    if (/[0-9]/.test(p)) s++
    if (/[^A-Za-z0-9]/.test(p)) s++
    return s
  })()

  const strengthLabel = ['', 'Faible', 'Moyen', 'Fort', 'Très fort'][strength]
  const strengthColor = ['', 'text-red-400', 'text-yellow-500', 'text-emerald-500', 'text-emerald-400'][strength]
  const strengthBg = ['bg-secondary', 'bg-red-400', 'bg-yellow-500', 'bg-emerald-500', 'bg-emerald-400'][strength]

  return (
    <div className="space-y-5">

      {/* Mot de passe */}
      <div>
        <div className="text-xs font-semibold text-foreground mb-3 flex items-center gap-2">
          <KeyRound className="w-3.5 h-3.5 text-primary" /> Changer le mot de passe
        </div>

        {pwdMsg === 'error' && (
          <div className="mb-3 text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2 flex items-center gap-2">
            <X className="w-3.5 h-3.5" /> Les mots de passe ne correspondent pas.
          </div>
        )}
        {pwdMsg === 'success' && (
          <div className="mb-3 text-xs text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2 flex items-center gap-2">
            <Check className="w-3.5 h-3.5" /> Mot de passe modifié avec succès.
          </div>
        )}

        <div className="space-y-2">
          {[
            { label: 'Mot de passe actuel', key: 'current', show: showCurrent, toggle: () => setShowCurrent(v => !v) },
            { label: 'Nouveau mot de passe', key: 'next', show: showNew, toggle: () => setShowNew(v => !v) },
            { label: 'Confirmer', key: 'confirm', show: showConfirm, toggle: () => setShowConfirm(v => !v) },
          ].map(f => (
            <div key={f.key}>
              <label className="text-[10px] text-muted-foreground block mb-1">{f.label}</label>
              <div className="flex items-center gap-1 rounded-lg border border-border bg-secondary/30 px-3 focus-within:border-primary/50 transition-colors">
                <input
                  type={f.show ? 'text' : 'password'}
                  value={pwdForm[f.key as keyof typeof pwdForm]}
                  onChange={e => setPwdForm(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder="••••••••"
                  className="flex-1 bg-transparent py-2 text-xs text-foreground focus:outline-none placeholder:text-muted-foreground/40"
                />
                <button onClick={f.toggle} className="text-muted-foreground/60 hover:text-muted-foreground">
                  {f.show ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              {f.key === 'next' && pwdForm.next.length > 0 && (
                <div className="mt-1.5">
                  <div className="flex gap-0.5 mb-1">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className={cn('h-1 flex-1 rounded-full transition-colors', i <= strength ? strengthBg : 'bg-secondary')} />
                    ))}
                  </div>
                  <span className={cn('text-[10px] font-medium', strengthColor)}>{strengthLabel}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={handlePwd}
          className="mt-3 w-full py-2 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Mettre à jour le mot de passe
        </button>
      </div>

      <div className="border-t border-border/40" />

      {/* 2FA */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-foreground flex items-center gap-2">
              <Smartphone className="w-3.5 h-3.5 text-primary" /> Authentification 2 facteurs
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              Via application TOTP (Google Authenticator)
            </div>
          </div>
          <button
            onClick={() => setTwoFa(v => !v)}
            className={cn(
              'relative w-10 h-5 rounded-full transition-colors shrink-0',
              twoFa ? 'bg-primary' : 'bg-secondary',
            )}
          >
            <span className={cn(
              'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all',
              twoFa ? 'left-5' : 'left-0.5',
            )} />
          </button>
        </div>
        {twoFa && (
          <div className="mt-2 text-[11px] text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2 flex items-center gap-2">
            <ShieldCheck className="w-3 h-3" /> 2FA activé — votre compte est protégé
          </div>
        )}
      </div>

      <div className="border-t border-border/40" />

      {/* Zone danger */}
      <div>
        <div className="text-xs font-semibold text-foreground flex items-center gap-2 mb-2">
          <AlertTriangle className="w-3.5 h-3.5 text-red-400" /> Zone critique
        </div>
        <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-red-400/20 bg-red-400/5 hover:bg-red-400/10 transition-colors text-xs text-red-400 font-medium">
          Supprimer mon compte
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}

// ─── Préférences ──────────────────────────────────────────────────────────────

function PreferencesContent() {
  const [theme, setTheme]       = useState<'dark' | 'light'>('dark')
  const [lang, setLang]         = useState('fr')
  const [notifs, setNotifs]     = useState({
    alertes:   true,
    news:      true,
    rapport:   false,
    securite:  true,
  })
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-5">

      {saved && (
        <div className="text-xs text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2 flex items-center gap-2">
          <Check className="w-3.5 h-3.5" /> Préférences sauvegardées
        </div>
      )}

      {/* Thème */}
      <div>
        <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-2">Thème</div>
        <div className="flex gap-2">
          {([
            { val: 'dark', label: 'Sombre', icon: Moon },
            { val: 'light', label: 'Clair', icon: Sun },
          ] as const).map(t => (
            <button
              key={t.val}
              onClick={() => setTheme(t.val)}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border text-xs font-medium transition-colors',
                theme === t.val
                  ? 'bg-primary/15 border-primary/40 text-primary'
                  : 'border-border/50 text-muted-foreground hover:text-foreground hover:border-border',
              )}
            >
              <t.icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Langue */}
      <div>
        <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-2">Langue</div>
        <div className="flex gap-2">
          {[
            { val: 'fr', label: 'Français' },
            { val: 'en', label: 'English' },
          ].map(l => (
            <button
              key={l.val}
              onClick={() => setLang(l.val)}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border text-xs font-medium transition-colors',
                lang === l.val
                  ? 'bg-primary/15 border-primary/40 text-primary'
                  : 'border-border/50 text-muted-foreground hover:text-foreground hover:border-border',
              )}
            >
              <Globe className="w-3.5 h-3.5" />
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div>
        <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-2">Notifications</div>
        <div className="space-y-2">
          {([
            { key: 'alertes',  label: 'Alertes de prix' },
            { key: 'news',     label: 'Actualités du marché' },
            { key: 'rapport',  label: 'Rapports hebdomadaires' },
            { key: 'securite', label: 'Alertes de sécurité' },
          ] as const).map(n => (
            <div key={n.key} className="flex items-center justify-between px-3 py-2 rounded-lg bg-secondary/20">
              <div className="flex items-center gap-2">
                <Bell className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-foreground">{n.label}</span>
              </div>
              <button
                onClick={() => setNotifs(prev => ({ ...prev, [n.key]: !prev[n.key] }))}
                className={cn(
                  'relative w-8 h-4 rounded-full transition-colors shrink-0',
                  notifs[n.key] ? 'bg-primary' : 'bg-secondary',
                )}
              >
                <span className={cn(
                  'absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-all',
                  notifs[n.key] ? 'left-4' : 'left-0.5',
                )} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleSave}
        className="w-full py-2 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        Sauvegarder les préférences
      </button>
    </div>
  )
}

// ─── Abonnement ───────────────────────────────────────────────────────────────

function AbonnementContent() {
  return (
    <div className="space-y-4">

      {/* Plan actif */}
      <div className="rounded-xl border border-primary/30 bg-primary/8 p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Badge className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold text-foreground">{USER.plan}</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">Renouvellement le 16 mai 2026</div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 font-semibold border border-emerald-500/20">
            Actif
          </span>
        </div>
        <div className="mt-3 text-2xl font-black font-mono text-foreground">
          35 000 <span className="text-sm text-muted-foreground font-normal">FCFA/mois</span>
        </div>
      </div>

      {/* Usage */}
      <div className="space-y-2">
        <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Utilisation ce mois</div>
        {[
          { label: 'Requêtes API', used: 8200, max: 10000, unit: 'req.' },
          { label: 'Alertes actives', used: 12, max: 50, unit: '' },
          { label: 'Exports PDF', used: 3, max: 20, unit: '' },
        ].map(u => {
          const pct = (u.used / u.max) * 100
          return (
            <div key={u.label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-foreground">{u.label}</span>
                <span className="font-mono text-muted-foreground">
                  {u.used.toLocaleString('fr-FR')} / {u.max.toLocaleString('fr-FR')} {u.unit}
                </span>
              </div>
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all',
                    pct > 80 ? 'bg-red-400' : pct > 60 ? 'bg-yellow-500' : 'bg-primary',
                  )}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Fonctionnalités */}
      <div className="space-y-1.5">
        <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Inclus dans votre plan</div>
        {[
          'Accès complet BRVM (données temps réel)',
          'Indicateurs macroéconomiques UEMOA',
          'Gestion de portefeuille avancée',
          'Alertes de prix illimitées',
          'Exports CSV / PDF',
          'Support prioritaire',
        ].map(f => (
          <div key={f} className="flex items-center gap-2 text-xs text-foreground">
            <Check className="w-3 h-3 text-emerald-500 shrink-0" />
            {f}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button className="flex-1 py-2 rounded-lg text-xs font-semibold border border-border text-foreground hover:bg-secondary/50 transition-colors">
          Changer de plan
        </button>
        <button className="flex-1 py-2 rounded-lg text-xs font-semibold border border-red-400/30 text-red-400 hover:bg-red-400/10 transition-colors">
          Résilier
        </button>
      </div>
    </div>
  )
}

// ─── Sessions actives ─────────────────────────────────────────────────────────

function SessionsContent() {
  const [sessions, setSessions] = useState(SESSIONS)

  function revoke(id: number) {
    setSessions(prev => prev.filter(s => s.id !== id))
  }

  return (
    <div className="space-y-3">
      {sessions.map(s => (
        <div
          key={s.id}
          className={cn(
            'flex items-start gap-3 p-3 rounded-xl border transition-colors',
            s.current
              ? 'bg-primary/8 border-primary/25'
              : 'bg-secondary/20 border-border/40 hover:border-border/70',
          )}
        >
          <div className={cn(
            'mt-0.5 w-2 h-2 rounded-full shrink-0',
            s.current ? 'bg-emerald-500 animate-pulse' : 'bg-muted-foreground/40',
          )} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-foreground">{s.device}</span>
              {s.current && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-500 font-semibold">
                  Session actuelle
                </span>
              )}
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              {s.location} · {s.ip} · {s.date}
            </div>
          </div>
          {!s.current && (
            <button
              onClick={() => revoke(s.id)}
              className="shrink-0 flex items-center gap-1 text-[11px] text-red-400/70 hover:text-red-400 transition-colors"
              title="Révoquer cette session"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ))}
      {sessions.length > 1 && (
        <button
          onClick={() => setSessions(prev => prev.filter(s => s.current))}
          className="w-full py-2 rounded-lg text-xs font-semibold border border-red-400/20 text-red-400 hover:bg-red-400/8 transition-colors"
        >
          Déconnecter toutes les autres sessions
        </button>
      )}
    </div>
  )
}

// ─── Historique d'activité ────────────────────────────────────────────────────

function ActiviteContent() {
  const typeConfig = {
    success: { dot: 'bg-emerald-500', text: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    info:    { dot: 'bg-primary',     text: 'text-primary',     bg: 'bg-primary/10 border-primary/20' },
    warning: { dot: 'bg-red-400',     text: 'text-red-400',     bg: 'bg-red-400/10 border-red-400/20' },
  }

  return (
    <div className="space-y-2">
      {ACTIVITE.map(ev => {
        const cfg = typeConfig[ev.type]
        return (
          <div key={ev.id} className="flex items-start gap-3 p-2.5 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-colors">
            <div className={cn('mt-1.5 w-1.5 h-1.5 rounded-full shrink-0', cfg.dot)} />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-foreground">{ev.action}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{ev.device}</div>
            </div>
            <div className="text-[10px] text-muted-foreground font-mono shrink-0">{ev.date}</div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Page principale ──────────────────────────────────────────────────────────

export default function MyAccountPage() {
  const toggleSection = useModuleSectionsStore(s => s.toggle)

  const panelRows: PanelRow[] = [
    {
      id: 'account-row-1',
      cells: [
        { id: 'profil',     title: 'Profil utilisateur',       icon: User,       initialFlex: 3, content: <ProfilContent /> },
        { id: 'abonnement', title: 'Abonnement & facturation', icon: CreditCard, initialFlex: 2, content: <AbonnementContent /> },
      ],
    },
    {
      id: 'account-row-2',
      cells: [
        { id: 'securite',    title: 'Sécurité du compte',  icon: ShieldCheck, initialFlex: 2, content: <SecuriteContent /> },
        { id: 'preferences', title: 'Préférences',          icon: Settings,    initialFlex: 2, content: <PreferencesContent /> },
        { id: 'sessions',    title: 'Sessions actives',     icon: Monitor,     initialFlex: 1, content: <SessionsContent /> },
      ],
    },
    {
      id: 'account-row-3',
      cells: [
        { id: 'activite', title: 'Historique d\'activité', icon: Clock, content: <ActiviteContent /> },
      ],
    },
  ]

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">

      <ModuleLayout pageKey="my-account" sections={SECTIONS} mainClassName="overflow-hidden" title="Mon Compte">
        <div className="h-full flex flex-col gap-1">

          {/* KPI strip */}
          <div className="shrink-0">
            <ModuleSection pageKey="my-account" id="kpis" resizable={false}>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-1">
                {[
                  { label: 'Plan',               value: USER.plan,              sub: 'Actif', color: 'text-primary' },
                  { label: 'Membre depuis',       value: USER.inscription,       sub: 'Date d\'inscription', color: 'text-foreground' },
                  { label: 'Dernière connexion',  value: '16/04/2026 09:41',     sub: 'Abidjan, CI', color: 'text-foreground' },
                  { label: 'Statut du compte',    value: 'Actif',                sub: '2FA activé', color: 'text-emerald-500' },
                ].map(k => (
                  <div key={k.label} className="rounded-xl border border-border/50 bg-card/80 p-4">
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{k.label}</div>
                    <div className={cn('font-bold text-sm font-mono truncate', k.color)}>{k.value}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{k.sub}</div>
                  </div>
                ))}
              </div>
            </ModuleSection>
          </div>

          {/* Grille principale */}
          <PanelGrid
            rows={panelRows}
            pageKey="my-account"
            onHide={id => toggleSection('my-account', id)}
          />

        </div>
      </ModuleLayout>

    </div>
  )
}
