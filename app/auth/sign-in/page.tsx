'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  Activity, Eye, EyeOff, Shield, Smartphone, ChevronRight,
  CheckCircle2, AlertCircle, Loader2, RefreshCw, ArrowLeft,
  Lock, Mail, TrendingUp, BarChart3, Globe,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = 'captcha' | 'credentials' | 'twofa' | 'success'

interface FormState {
  email: string
  password: string
  rememberMe: boolean
}

// ─── Mock credentials ─────────────────────────────────────────────────────────

const VALID_USERS = [
  { email: 'demo@bloomfield.com',  password: 'Demo@1234',  name: 'Amadou Diallo', otp: '000000' },
  { email: 'admin@bloomfield.com', password: 'Admin@2024', name: 'Fatou Ndiaye',  otp: '000000' },
]

// ─── CAPTCHA ──────────────────────────────────────────────────────────────────

type CaptchaState = 'idle' | 'verifying' | 'challenge' | 'verified' | 'error'

interface ImageTile {
  id: number
  label: string
  isTarget: boolean
  selected: boolean
}

const TILE_LAYOUT: { label: string; isTarget: boolean }[] = [
  { label: 'Graphique boursier', isTarget: true  },
  { label: 'Carte géographique', isTarget: false },
  { label: 'Graphique boursier', isTarget: true  },
  { label: 'Tableau de bord',    isTarget: false },
  { label: 'Graphique boursier', isTarget: true  },
  { label: 'Carte géographique', isTarget: false },
  { label: 'Tableau de bord',    isTarget: false },
  { label: 'Graphique boursier', isTarget: true  },
  { label: 'Tableau de bord',    isTarget: false },
]

function initTiles(): ImageTile[] {
  return TILE_LAYOUT.map((t, i) => ({ ...t, id: i, selected: false }))
}

const TILE_ICON: Record<string, React.ElementType> = {
  'Graphique boursier': TrendingUp,
  'Carte géographique': Globe,
  'Tableau de bord':    BarChart3,
}

const TILE_COLOR: Record<string, string> = {
  'Graphique boursier': 'text-emerald-400',
  'Carte géographique': 'text-blue-400',
  'Tableau de bord':    'text-purple-400',
}

const TILE_BG: Record<string, string> = {
  'Graphique boursier': 'bg-emerald-500/10 border-emerald-500/20',
  'Carte géographique': 'bg-blue-500/10 border-blue-500/20',
  'Tableau de bord':    'bg-purple-500/10 border-purple-500/20',
}

function CaptchaWidget({ onVerified }: { onVerified: () => void }) {
  const [state, setState] = useState<CaptchaState>('idle')
  const [tiles, setTiles] = useState<ImageTile[]>([])
  const [submitError, setSubmitError] = useState(false)

  function handleCheck() {
    if (state !== 'idle' && state !== 'error') return
    setState('verifying')
    setTimeout(() => {
      setTiles(initTiles())
      setSubmitError(false)
      setState('verified')
      onVerified()
    }, 1800)
  }

  function toggleTile(id: number) {
    setTiles(prev => prev.map(t => t.id === id ? { ...t, selected: !t.selected } : t))
    setSubmitError(false)
  }

  function handleSubmit() {
    const selected = tiles.filter(t => t.selected)
    const targets  = tiles.filter(t => t.isTarget)
    const correct  = selected.length === targets.length && selected.every(s => s.isTarget)

    if (correct) {
      setState('verified')
      setTimeout(onVerified, 700)
    } else {
      setSubmitError(true)
      setTimeout(() => {
        setTiles(initTiles().map(t => ({ ...t, selected: false })))
        setSubmitError(false)
      }, 1200)
    }
  }

  return (
    <div className="w-full">
      {/* Checkbox row */}
      {(state === 'idle' || state === 'verifying' || state === 'error') && (
        <div
          onClick={handleCheck}
          className={cn(
            'flex items-center justify-between px-4 py-3.5 rounded-xl border transition-all cursor-pointer select-none',
            state === 'error'
              ? 'border-destructive/50 bg-destructive/5'
              : 'border-border bg-secondary/30 hover:bg-secondary/50 hover:border-primary/30'
          )}
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all',
              state === 'idle'      && 'border-border bg-background',
              state === 'verifying' && 'border-primary animate-pulse',
              state === 'error'     && 'border-destructive bg-destructive/10',
            )}>
              {state === 'verifying' && <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />}
              {state === 'error'     && <AlertCircle className="w-3.5 h-3.5 text-destructive" />}
            </div>
            <span className={cn(
              'text-sm font-medium',
              state === 'error' ? 'text-destructive' : 'text-foreground'
            )}>
              {state === 'error' ? 'Vérification échouée – Réessayez' : 'Je ne suis pas un robot'}
            </span>
          </div>

          {/* BloomCaptcha logo */}
          <div className="flex flex-col items-center gap-0.5 shrink-0">
            <div className="flex gap-0.5">
              {['#3b82f6', '#ef4444', '#f59e0b', '#10b981'].map((c, i) => (
                <div key={i} className="w-2 h-2 rounded-sm" style={{ backgroundColor: c }} />
              ))}
            </div>
            <span className="text-[8px] text-muted-foreground font-bold tracking-wider">CAPTCHA</span>
          </div>
        </div>
      )}

      {/* Image challenge */}
      {state === 'challenge' && (
        <div className="rounded-xl border border-border overflow-hidden bg-card shadow-lg">
          <div className="px-4 py-3 bg-secondary/40 border-b border-border">
            <p className="text-xs font-bold text-foreground">
              Sélectionnez tous les graphiques boursiers
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Cliquez sur toutes les cases correspondantes, puis confirmez
            </p>
          </div>

          <div className="grid grid-cols-3 gap-1.5 p-3">
            {tiles.map(tile => {
              const Icon = TILE_ICON[tile.label] ?? TrendingUp
              return (
                <button
                  key={tile.id}
                  onClick={() => toggleTile(tile.id)}
                  className={cn(
                    'relative aspect-square rounded-lg border-2 flex flex-col items-center justify-center gap-2 transition-all duration-150',
                    tile.selected
                      ? 'border-primary bg-primary/15 scale-95 shadow-inner'
                      : cn('hover:scale-[0.97]', TILE_BG[tile.label] ?? 'bg-secondary/30 border-transparent'),
                  )}
                >
                  <Icon className={cn('w-8 h-8', TILE_COLOR[tile.label] ?? 'text-muted-foreground')} />
                  <span className="text-[9px] text-muted-foreground text-center leading-tight px-1">
                    {tile.label}
                  </span>
                  {tile.selected && (
                    <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-primary rounded-full flex items-center justify-center shadow-md">
                      <CheckCircle2 className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {submitError && (
            <div className="px-4 py-2 bg-destructive/10 border-t border-destructive/20 flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 text-destructive shrink-0" />
              <span className="text-xs text-destructive">Sélection incorrecte. Nouvel essai en cours…</span>
            </div>
          )}

          <div className="px-3 py-2.5 flex items-center justify-between border-t border-border bg-secondary/20">
            <button
              onClick={() => { setState('idle'); setTiles([]) }}
              className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
            >
              <RefreshCw className="w-3 h-3" /> Recommencer
            </button>
            <button
              onClick={handleSubmit}
              disabled={!tiles.some(t => t.selected)}
              className={cn(
                'px-4 py-1.5 rounded-lg text-xs font-bold transition-all',
                tiles.some(t => t.selected)
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm'
                  : 'bg-secondary text-muted-foreground cursor-not-allowed'
              )}
            >
              Confirmer
            </button>
          </div>
        </div>
      )}

      {/* Verified */}
      {state === 'verified' && (
        <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <span className="text-sm font-semibold text-emerald-400">Vérification réussie</span>
        </div>
      )}
    </div>
  )
}

// ─── OTP Input ────────────────────────────────────────────────────────────────

function OTPInput({ length = 6, onComplete, disabled }: {
  length?: number
  onComplete: (code: string) => void
  disabled?: boolean
}) {
  const [values, setValues] = useState<string[]>(Array(length).fill(''))
  const refs = useRef<(HTMLInputElement | null)[]>([])

  function handleChange(idx: number, raw: string) {
    const digit = raw.replace(/\D/g, '').slice(-1)
    const next  = [...values]
    next[idx]   = digit
    setValues(next)
    if (digit && idx < length - 1) refs.current[idx + 1]?.focus()
    if (next.every(v => v !== '')) onComplete(next.join(''))
  }

  function handleKeyDown(idx: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !values[idx] && idx > 0) {
      refs.current[idx - 1]?.focus()
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    const next   = Array(length).fill('')
    pasted.split('').forEach((ch, i) => { next[i] = ch })
    setValues(next)
    refs.current[Math.min(pasted.length, length - 1)]?.focus()
    if (next.every(v => v !== '')) onComplete(next.join(''))
  }

  return (
    <div className="flex gap-2 justify-center" onPaste={handlePaste}>
      {values.map((v, i) => (
        <input
          key={i}
          ref={el => { refs.current[i] = el }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={v}
          disabled={disabled}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
          className={cn(
            'w-12 text-center text-2xl font-mono font-black rounded-xl border-2 bg-secondary/30',
            'text-foreground outline-none transition-all duration-150',
            'focus:scale-105 focus:shadow-md',
            v ? 'border-primary bg-primary/10 text-primary' : 'border-border focus:border-primary',
            disabled && 'opacity-50 cursor-not-allowed',
          )}
          style={{ height: '3.5rem' }}
          autoFocus={i === 0}
        />
      ))}
    </div>
  )
}

// ─── Brand panel (left side, desktop) ────────────────────────────────────────

function BrandPanel() {
  return (
    <div className="hidden lg:flex flex-col justify-between h-full bg-[url('/sign-in-bg.jpg')] object-cover object-center from-background via-background to-primary/5 border-r border-border overflow-hidden relative">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Logo */}
      <div className="relative flex items-center gap-3 p-10">
        <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
          <p className="text-3xl text-primary-foreground font-bold">B</p>
        </div>
        <div>
          <h1 className="text-lg md:text-lg lg:text-3xl font-black text-white">
            Bloomfield
            {' '}
            <span className="text-lg md:text-lg lg:text-3xl font-black text-primary">Terminal</span>
          </h1>
        </div>
      </div>

      {/* Hero content */}
      <div className="relative space-y-8 bg-linear-to-t from-black via-black/60 to-transparent p-10">
        <div className="space-y-4">
          {/* <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-primary">Données en temps réel · BRVM</span>
          </div> */}

          <h2 className="text-4xl lg:text-7xl font-black text-white leading-tight">
            La référence<br />des{' '}
            <span className="relative">
              <span className="relative z-10">marchés africains</span>
              <span className="absolute bottom-0 left-0 w-full h-2 bg-primary/20 rounded" />
            </span>
          </h2>

          <p className="text-sm lg:text-2xl text-gray-300 leading-relaxed max-w-">
            Accédez aux cotations BRVM, indicateurs macroéconomiques et analyses régionales
            de l'Afrique de l'Ouest depuis un terminal professionnel unifié.
          </p>
        </div>

        {/* Stats */}
        {/* <div className="grid grid-cols-3 gap-3">
          {[
            { v: '45+',    l: 'Valeurs cotées' },
            { v: '8',      l: 'Pays couverts'  },
            { v: '<50ms',  l: 'Latence données' },
          ].map(s => (
            <div key={s.l} className="bg-secondary/40 backdrop-blur-sm rounded-xl p-3 border border-border/50">
              <div className="text-2xl font-black text-foreground">{s.v}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{s.l}</div>
            </div>
          ))}
        </div> */}

        {/* Decorative mini chart */}
        {/* <div className="relative rounded-xl bg-secondary/20 border border-border/50 p-4 overflow-hidden">
          <div className="text-[10px] text-muted-foreground font-medium mb-2">BRVM Composite – 30j</div>
          <svg viewBox="0 0 220 56" className="w-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" className="text-foreground" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0" className="text-foreground" />
              </linearGradient>
            </defs>
            <path
              d="M0,44 C20,40 30,38 50,32 S80,26 100,22 S140,16 160,12 S190,8 220,6"
              fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinejoin="round" strokeLinecap="round"
              className="text-foreground"
            />
            <path
              d="M0,44 C20,40 30,38 50,32 S80,26 100,22 S140,16 160,12 S190,8 220,6 L220,56 L0,56 Z"
              fill="url(#g)"
            />
          </svg>
          <div className="absolute top-3 right-4 text-xs font-mono font-bold text-emerald-500">+8.5% YTD</div>
        </div> */}

        <p className="relative text-[11px] text-gray-400">
          © 2026 Bloomfield Terminal · Données financières africaines professionnelles
        </p>
      </div>

    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SignInPage() {
  const router = useRouter()
  const [step, setStep]         = useState<Step>('captcha')
  const [form, setForm]         = useState<FormState>({ email: '', password: '', rememberMe: false })
  const [showPw, setShowPw]     = useState(false)
  const [loading, setLoading]   = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [otpError, setOtpError] = useState<string | null>(null)
  const [matched, setMatched]   = useState<typeof VALID_USERS[0] | null>(null)
  const [resend, setResend]     = useState(0)

  useEffect(() => {
    if (resend <= 0) return
    const t = setTimeout(() => setResend(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [resend])

  function handleCaptchaVerified() {
    setTimeout(() => setStep('credentials'), 350)
  }

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)
    setLoading(true)
    await new Promise(r => setTimeout(r, 1400))
    setLoading(false)

    const user = VALID_USERS.find(
      u => u.email.toLowerCase() === form.email.toLowerCase() && u.password === form.password
    )
    if (!user) {
      setFormError('Email ou mot de passe incorrect. Vérifiez vos identifiants.')
      return
    }
    setMatched(user)
    setResend(30)
    setStep('twofa')
  }

  const handleOTP = useCallback(async (code: string) => {
    if (!matched) return
    setOtpError(null)
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    setLoading(false)

    if (code !== matched.otp) {
      setOtpError('Code incorrect. Vérifiez votre application d\'authentification.')
      return
    }
    setStep('success')
    await new Promise(r => setTimeout(r, 1800))
    router.push('/modules')
  }, [matched, router])

  const inputBase = cn(
    'w-full px-4 py-3 rounded-xl border border-muted-foreground bg-secondary/10 text-sm text-foreground',
    'placeholder:text-muted-foreground outline-none transition-all duration-200',
    'focus:border-primary focus:bg-secondary/50',
  )

  const STEPS: Step[] = ['captcha', 'credentials', 'twofa']
  const stepIdx = STEPS.indexOf(step)

  return (
    <div className="min-h-screen grid lg:grid-cols-[2fr_1fr]">
      <BrandPanel />

      {/* ── Right panel */}
      <div className="flex items-center justify-center min-h-screen p-6 lg:p-12 bg-background">
        <div className="w-full max-w-[420px] space-y-7">

          {/* Mobile logo */}
          <div className="flex items-center gap-3 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <span className="font-black text-foreground">Bloomfield Terminal</span>
            </div>
          </div>

          {/* ─── STEP 1: CAPTCHA ────────────────────────────────────── */}
          {step === 'captcha' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
              <div className="space-y-1.5">
                <h2 className="text-2xl font-black text-foreground">Vérification de sécurité</h2>
                <p className="text-sm text-muted-foreground">
                  Confirmez que vous êtes humain avant d'accéder à votre espace.
                </p>
              </div>

              <div className="bg-card border border-border/50 rounded-2xl p-5 space-y-4 shadow-sm">
                {/* <div className="flex items-center gap-2 text-xs text-muted-foreground border-b border-border/50 pb-3">
                  <Shield className="w-4 h-4 text-primary shrink-0" />
                  <span>Protection BloomCAPTCHA contre les accès automatisés</span>
                </div> */}
                <CaptchaWidget onVerified={handleCaptchaVerified} />
              </div>

              <p className="text-center text-[11px] text-muted-foreground">
                Ce site est protégé par CAPTCHA.{' '}
                <span className="underline cursor-pointer hover:text-foreground transition-colors">
                  Politique de confidentialité
                </span>{' '}et{' '}
                <span className="underline cursor-pointer hover:text-foreground transition-colors">
                  Conditions d'utilisation
                </span>.
              </p>
            </div>
          )}

          {/* ─── STEP 2: CREDENTIALS ────────────────────────────────── */}
          {step === 'credentials' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
              <div className="space-y-1.5">
                <h2 className="text-2xl font-black text-foreground">Connexion</h2>
                <p className="text-sm text-muted-foreground">
                  Accédez à votre terminal de données financières africaines.
                </p>
              </div>

              {/* Demo credentials box */}
              {/* <div className="rounded-xl border border-primary/25 bg-primary/5 px-4 py-3.5 space-y-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <p className="text-xs font-bold text-primary">Comptes de démonstration</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] text-muted-foreground font-mono bg-secondary/50 px-2 py-1 rounded-md">
                    demo@bloomfield.com · <span className="text-foreground">Demo@1234</span>
                  </p>
                  <p className="text-[11px] text-muted-foreground font-mono bg-secondary/50 px-2 py-1 rounded-md">
                    admin@bloomfield.com · <span className="text-foreground">Admin@2024</span>
                  </p>
                </div>
              </div> */}

              <form onSubmit={handleCredentials} className="space-y-4">
                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                    Adresse e-mail
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="vous@exemple.com"
                      value={form.email}
                      onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setFormError(null) }}
                      className={cn(inputBase, 'pl-11', formError && 'border-destructive/60')}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                      Mot de passe
                    </label>
                    <button type="button" className="text-xs text-primary hover:underline transition-colors">
                      Mot de passe oublié ?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type={showPw ? 'text' : 'password'}
                      required
                      autoComplete="current-password"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setFormError(null) }}
                      className={cn(inputBase, 'pl-11 pr-12', formError && 'border-destructive/60')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(s => !s)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {formError && (
                  <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl bg-destructive/10 border border-destructive/20">
                    <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                    <span className="text-xs text-destructive leading-relaxed">{formError}</span>
                  </div>
                )}

                {/* Remember me */}
                <div
                  className="flex items-center gap-2.5 cursor-pointer group w-fit"
                  onClick={() => setForm(f => ({ ...f, rememberMe: !f.rememberMe }))}
                >
                  <div className={cn(
                    'w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0',
                    form.rememberMe
                      ? 'bg-primary border-primary'
                      : 'border-border group-hover:border-primary/50'
                  )}>
                    {form.rememberMe && <CheckCircle2 className="w-3.5 h-3.5 text-primary-foreground" />}
                  </div>
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors select-none">
                    Se souvenir de moi
                  </span>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading || !form.email || !form.password}
                  className={cn(
                    'w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all duration-200',
                    loading || !form.email || !form.password
                      ? 'bg-secondary text-muted-foreground cursor-not-allowed'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/15 hover:shadow-primary/25 hover:-translate-y-0.5'
                  )}
                >
                  {loading
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Vérification…</>
                    : <><span>Se connecter</span><ChevronRight className="w-4 h-4" /></>
                  }
                </button>
              </form>

              <div className="flex items-center justify-center gap-5 text-[10px] text-muted-foreground pt-1">
                <span className="flex items-center gap-1.5"><Lock className="w-3 h-3" /> Connexion TLS 1.3</span>
                <span className="flex items-center gap-1.5"><Shield className="w-3 h-3" /> 2FA activé</span>
              </div>
            </div>
          )}

          {/* ─── STEP 3: 2FA ──────────────────────────────────────────── */}
          {step === 'twofa' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
              <button
                onClick={() => { setStep('credentials'); setOtpError(null) }}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                Retour
              </button>

              {/* Icon + heading */}
              <div className="space-y-3 text-center">
                {/* <div className="relative inline-flex">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center shadow-inner">
                    <Smartphone className="w-8 h-8 text-primary" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shadow-md">
                    <Shield className="w-3 h-3 text-white" />
                  </div>
                </div> */}
                <div>
                  <h2 className="text-2xl font-black text-foreground">Double authentification</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Entrez le code à 6 chiffres de votre application TOTP.
                  </p>
                </div>
              </div>

              {/* Demo OTP hint */}
              {/* <div className="rounded-xl border border-primary/25 bg-primary/5 px-4 py-3.5 text-center">
                <p className="text-xs font-bold text-primary mb-1.5">Code de démonstration</p>
                <div className="flex items-center justify-center gap-1">
                  {matched?.otp.split('').map((d, i) => (
                    <span
                      key={i}
                      className={cn(
                        'w-9 h-10 flex items-center justify-center rounded-lg text-xl font-black font-mono bg-secondary/50 border border-border/50',
                        i === 2 && 'ml-2',
                      )}
                    >
                      {d}
                    </span>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground mt-2">
                  Valide 30 secondes · TOTP RFC 6238
                </p>
              </div> */}

              {/* OTP input */}
              <div className="space-y-4">
                <OTPInput length={6} onComplete={handleOTP} disabled={loading} />

                {loading && (
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Vérification du code…</span>
                  </div>
                )}

                {otpError && (
                  <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl bg-destructive/10 border border-destructive/20">
                    <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                    <span className="text-xs text-destructive">{otpError}</span>
                  </div>
                )}

                {/* Resend */}
                <p className="text-center text-xs text-muted-foreground">
                  Vous n'avez pas reçu de code ?{' '}
                  <button
                    onClick={() => { if (resend === 0) setResend(30) }}
                    disabled={resend > 0}
                    className={cn(
                      'font-semibold transition-colors',
                      resend > 0 ? 'text-muted-foreground cursor-not-allowed' : 'text-primary hover:underline'
                    )}
                  >
                    {resend > 0 ? `Renvoyer (${resend}s)` : 'Renvoyer le code'}
                  </button>
                </p>
              </div>

              <div className="flex items-center justify-center gap-4 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3 h-3" /> Authentification TOTP · RFC 6238
                </span>
              </div>
            </div>
          )}

          {/* ─── STEP 4: SUCCESS ──────────────────────────────────────── */}
          {step === 'success' && (
            <div className="flex flex-col items-center gap-7 text-center animate-in fade-in zoom-in-95 duration-400">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center shadow-xl shadow-emerald-500/10">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                </div>
                <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20 animate-ping" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-black text-foreground">Connexion réussie</h2>
                <p className="text-sm text-muted-foreground">
                  Bienvenue,{' '}
                  <span className="font-bold text-foreground">{matched?.name}</span>.
                  <br />
                  Redirection vers votre terminal…
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/30 px-5 py-2.5 rounded-full border border-border/50">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Chargement du tableau de bord</span>
              </div>
            </div>
          )}

          {/* Step progress indicator */}
          {/* {step !== 'success' && (
            <div className="flex items-center justify-center gap-2">
              {STEPS.map((s, i) => (
                <div
                  key={s}
                  className={cn(
                    'rounded-full transition-all duration-300',
                    i === stepIdx   ? 'w-7 h-2 bg-primary' :
                    i < stepIdx     ? 'w-2 h-2 bg-primary/40' :
                                      'w-2 h-2 bg-border'
                  )}
                />
              ))}
            </div>
          )} */}
        </div>
      </div>
    </div>
  )
}
