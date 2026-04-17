'use client'

import { Dot } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useRef, useCallback } from 'react'

const MODULES = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Vue d\'ensemble temps réel, indices BRVM, cours des valeurs, flux d\'actualités et alertes consolidés en un seul espace.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-12">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    image: '/dashboard.jpg',
  },
  {
    id: 'analyse',
    name: 'Analyse',
    description: 'Analyse technique et fondamentale approfondie, graphiques interactifs, ratios financiers, scorecard de risque et notations.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-12">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    image: '/analyse.jpg',
  },
  {
    id: 'macro',
    name: 'Macro',
    description: 'Indicateurs macroéconomiques des pays de l\'UEMOA, PIB, inflation, balance commerciale, devises et finances publiques.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-12">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    image: '/macro.jpg',
  },
  {
    id: 'portfolio',
    name: 'Portefeuille',
    description: 'Gestion et suivi de portefeuille, allocation d\'actifs, performance historique, analyse de risque et simulateur de scénarios.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-12">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    image: '/portefeuille.jpg',
  },
  {
    id: 'communication',
    name: 'Communication',
    description: 'Agrégation de flux d\'informations, actualités marchés, alertes personnalisées, web TV financière et ressources éducatives.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-12">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    image: '/communication.jpg',
  },
  {
    id: 'operations',
    name: 'Opérations',
    description: 'Suivi opérationnel des ordres de bourse, transactions, comptes clients et reporting réglementaire en temps réel.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-12">
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
    image: '/operations.jpg',
  },
  // {
  //   id: 'admin',
  //   name: 'Administration',
  //   description: 'Gestion des utilisateurs, des sources de données, des permissions d\'accès et supervision de l\'intégrité du système.',
  //   icon: (
  //     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
  //       <circle cx="12" cy="12" r="3" />
  //       <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
  //       <path d="M16.24 7.76a6 6 0 0 1 0 8.49M7.76 7.76a6 6 0 0 0 0 8.49" />
  //     </svg>
  //   ),
  // },
]

const ADVANTAGES = [
  {
    title: 'Données locales en temps réel',
    description: 'Accès direct aux cours BRVM, indicateurs économiques UEMOA et données macroéconomiques ouest-africaines, consolidés en une plateforme unique.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  {
    title: 'Interface professionnelle modulaire',
    description: 'Espace de travail configurable avec panneaux redimensionnables, filtres avancés et visualisations adaptées aux pratiques des professionnels de la finance.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
  },
  {
    title: 'Analyse multi-dimensionnelle',
    description: 'Des outils d\'analyse technique, fondamentale et macroéconomique intégrés pour une compréhension complète des marchés africains.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    title: 'Sécurité et conformité',
    description: 'Gestion fine des droits d\'accès, audit trail complet et architecture conçue pour répondre aux exigences réglementaires des marchés financiers.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
]

// ─── Hero Slider ───────────────────────────────────────────────────────────────

const SLIDES = MODULES.map(m => ({
  id:    m.id,
  name:  m.name,
  desc:  m.description.split(',')[0].trim(),
  image: m.image,
  icon:  m.icon,
}))

function HeroSlider() {
  const [current, setCurrent]   = useState(0)
  const [paused, setPaused]     = useState(false)
  const [transitioning, setTransitioning] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const goTo = useCallback((idx: number) => {
    if (transitioning) return
    setTransitioning(true)
    setCurrent(idx)
    setTimeout(() => setTransitioning(false), 400)
  }, [transitioning])

  const prev = useCallback(() => goTo((current - 1 + SLIDES.length) % SLIDES.length), [current, goTo])
  const next = useCallback(() => goTo((current + 1) % SLIDES.length), [current, goTo])

  // Auto-advance
  useEffect(() => {
    if (paused) return
    timeoutRef.current = setTimeout(next, 4000)
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }
  }, [current, paused, next])

  const slide = SLIDES[current]

  return (
    <div
      className="relative w-full rounded-xl overflow-hidden border border-[oklch(0.269_0_0)] bg-[oklch(0.12_0_0)] select-none"
      style={{ aspectRatio: '16/10' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slide image */}
      <div
        className="absolute inset-0 transition-opacity duration-400"
        style={{ opacity: transitioning ? 0 : 1 }}
      >
        <Image
          src={slide.image}
          alt={slide.name}
          fill
          className="object-cover object-top"
          priority
        />
        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.08_0_0)]/90 via-[oklch(0.08_0_0)]/20 to-transparent" />
      </div>

      {/* Slide label */}
      <div
        className="absolute bottom-0 left-0 right-0 px-5 pb-5 pt-12 transition-opacity duration-400"
        style={{ opacity: transitioning ? 0 : 1 }}
      >
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center text-primary">
            {slide.icon}
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-primary">{slide.name}</span>
        </div>
        <p className="text-sm text-[oklch(0.75_0_0)] leading-snug">{slide.desc}</p>
      </div>

      {/* Prev / Next */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[oklch(0.12_0_0)]/80 border border-[oklch(0.269_0_0)] flex items-center justify-center text-[oklch(0.7_0_0)] hover:text-white hover:bg-[oklch(0.18_0_0)] transition-colors"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[oklch(0.12_0_0)]/80 border border-[oklch(0.269_0_0)] flex items-center justify-center text-[oklch(0.7_0_0)] hover:text-white hover:bg-[oklch(0.18_0_0)] transition-colors"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      {/* Dots */}
      <div className="absolute top-3 right-3 flex gap-1.5 items-center">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="transition-all duration-300 rounded-full"
            style={{
              width:  i === current ? 16 : 6,
              height: 6,
              background: i === current ? 'var(--primary)' : 'oklch(0.4 0 0)',
            }}
          />
        ))}
      </div>

      {/* Progress bar */}
      {!paused && (
        <div className="absolute bottom-0 left-0 h-[2px] bg-primary/60 rounded-full"
          style={{
            animation: 'progress-bar 4s linear',
            animationKey: current,
          } as React.CSSProperties}
        />
      )}
    </div>
  )
}

function ContactForm() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', org: '', email: '', message: '' })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.name && form.email) setSent(true)
  }

  const inputClass = "w-full px-4 py-3 rounded bg-[oklch(0.12_0_0)] border border-[oklch(0.269_0_0)] text-sm text-[oklch(0.985_0_0)] placeholder:text-[oklch(0.4_0_0)] focus:outline-none focus:border-primary/60 transition-colors"

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 h-full min-h-[300px] rounded-xl border border-primary/30 bg-primary/5 p-10 text-center">
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <p className="font-bold text-[oklch(0.985_0_0)]">Message envoyé</p>
        <p className="text-sm text-[oklch(0.55_0_0)]">Notre équipe vous répondra sous 24h ouvrées.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-widest text-[oklch(0.45_0_0)] mb-1.5">Nom *</label>
          <input
            type="text" required placeholder="Jean Dupont"
            value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-widest text-[oklch(0.45_0_0)] mb-1.5">Organisation</label>
          <input
            type="text" placeholder="Société Générale CI"
            value={form.org} onChange={e => setForm(f => ({ ...f, org: e.target.value }))}
            className={inputClass}
          />
        </div>
      </div>
      <div>
        <label className="block text-[10px] font-semibold uppercase tracking-widest text-[oklch(0.45_0_0)] mb-1.5">Email *</label>
        <input
          type="email" required placeholder="vous@organisation.com"
          value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          className={inputClass}
        />
      </div>
      <div>
        <label className="block text-[10px] font-semibold uppercase tracking-widest text-[oklch(0.45_0_0)] mb-1.5">Message</label>
        <textarea
          rows={5} placeholder="Décrivez vos besoins, votre profil ou posez vos questions…"
          value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
          className={`${inputClass} resize-none`}
        />
      </div>
      <button
        type="submit"
        className="w-full py-3 rounded bg-primary text-black font-bold text-sm hover:bg-primary/90 transition-colors"
      >
        Envoyer le message
      </button>
      <p className="text-[10px] text-[oklch(0.4_0_0)] text-center">Vos données ne sont jamais partagées avec des tiers.</p>
    </form>
  )
}

export default function LandingPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (email) setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-white text-[oklch(0.985_0_0)] font-(--font-lato)">

      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-[oklch(0.269_0_0)] bg-[oklch(0.145_0_0)]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
              B
            </div>
            <span className="text-sm font-bold tracking-widest uppercase text-[oklch(0.985_0_0)]">
              Bloomfield Terminal
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            {[
              { label: 'Bloomfield Intelligence', href: '#intelligence' },
              { label: 'Modules',                 href: '#modules' },
              { label: "Mode d'accès",            href: '#access' },
              { label: 'Contact',                 href: '#contact' },
            ].map(link => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-[oklch(0.65_0_0)] hover:text-[oklch(0.985_0_0)] transition-colors whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/auth/sign-in"
              className="text-sm text-[oklch(0.7_0_0)] hover:text-[oklch(0.985_0_0)] transition-colors"
            >
              Connexion
            </Link>
            <a
              href="#access"
              className="text-sm px-4 py-2 rounded bg-primary text-black font-bold hover:bg-primary/90 transition-colors"
            >
              Demander l'accès
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background grid */}
        {/* <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(oklch(0.985 0 0) 1px, transparent 1px), linear-gradient(90deg, oklch(0.985 0 0) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        /> */}
        {/* Radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full bg-[oklch(0.6_0.118_184.704)]/5 blur-[120px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-24">
          <div className="grid grid-cols-1 gap-12 lg:gap-16 items-center">

            {/* Left — text */}
            <div className='flex flex-row'>
              <div className="flex flex-col justify-between">
                <h1 className="text-3xl text-foreground sm:text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight mb-6">
                  Bloomfield Terminal
                </h1>

                <div className="flex flex-col sm:flex-row gap-4 mb-14 max-w-lg">
                  <a
                    href="#access"
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded bg-primary text-black font-bold text-sm hover:bg-primary/90 transition-colors"
                  >
                    Demander un accès
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </a>
                  <Link
                    href="/auth/sign-in"
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded border border-[oklch(0.269_0_0)]/50 text-sm text-[oklch(0.5_0_0)] hover:border-[oklch(0.4_0_0)] hover:text-[oklch(0.75_0_0)] transition-colors"
                  >
                    Accéder au terminal
                  </Link>
                </div>
              </div>

              <div className="flex flex-col">
                <p className="text-lg text-[oklch(0.5_0_0)] leading-relaxed mb-10">
                  Bloomfield Terminal centralise les données BRVM, les indicateurs macroéconomiques de l'UEMOA et les flux d'actualités en un espace de travail professionnel, configurable et haute performance.
                </p>

                {/* Stats */}
                <div className="flex flex-wrap gap-8">
                  {[
                    { value: '6',    label: 'modules spécialisés' },
                    { value: 'BRVM', label: 'bourse régionale' },
                    { value: '8',    label: 'pays UEMOA couverts' },
                    { value: '∞',    label: 'données en temps réel' },
                  ].map(stat => (
                    <div key={stat.label}>
                      <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                      <div className="text-xs text-[oklch(0.55_0_0)] mt-0.5">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — slider */}
            <div className="hidden lg:block">
              <HeroSlider />
            </div>

          </div>
        </div>
      </section>

      {/* Bloomfield Intelligence */}
      <section id="intelligence" className="py-24 border-t border-[oklch(0.269_0_0)] bg-[#A3001B]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Text */}
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-teal-500 mb-3">
                Bloomfield Intelligence
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold leading-tight mb-6 text-[oklch(0.985_0_0)]">
                La recherche au cœur des marchés africains
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                Bloomfield Intelligence est la division analytique de Bloomfield Investment Corporation, spécialisée dans la production de données financières, d'études sectorielles et de recherche macroéconomique sur l'Afrique subsaharienne et la zone UEMOA.
              </p>
              <p className="text-gray-300 text-sm leading-relaxed mb-10">
                Nos équipes de recherche combinent méthodologies quantitatives et connaissance terrain pour fournir aux investisseurs une vision claire, fiable et actionnelle des marchés de la région.
              </p>

              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: '15+', label: 'Analystes spécialisés' },
                  { value: '8',   label: 'Pays couverts' },
                  { value: '200+', label: 'Rapports annuels' },
                  { value: '2003', label: 'Fondée en' },
                ].map(stat => (
                  <div key={stat.label} className="p-4 rounded-lg border border-[oklch(0.269_0_0)] bg-white">
                    <div className="text-2xl font-bold text-primary">{stat.value}</div>
                    <div className="text-xs text-[oklch(0.55_0_0)] mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cards expertise */}
            <div className="flex flex-col gap-4">
              {[
                {
                  title: 'Recherche actions BRVM',
                  desc: 'Couverture exhaustive des valeurs cotées — notes, objectifs de cours, initiations de couverture et mises à jour trimestrielles.',
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                    </svg>
                  ),
                },
                {
                  title: 'Études macroéconomiques',
                  desc: 'Analyses approfondies du PIB, de l\'inflation, des finances publiques et de la politique monétaire de la BCEAO pour les 8 pays de l\'UEMOA.',
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                      <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                  ),
                },
                {
                  title: 'Notation et risque souverain',
                  desc: 'Scorecards de risque pays, analyse des spreads obligataires et suivi des programmes FMI/Banque Mondiale pour anticiper les évolutions des marchés de taux.',
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  ),
                },
                {
                  title: 'Veille sectorielle',
                  desc: 'Suivi continu des secteurs clés — télécoms, finance, agriculture, énergie — avec indicateurs de performance et tendances d\'investissement.',
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
                    </svg>
                  ),
                },
              ].map(item => (
                <div key={item.title} className="flex gap-4 p-5 rounded-lg border border-[oklch(0.269_0_0)] bg-white hover:border-primary/30 transition-colors group">
                  <div className="shrink-0 w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-sm lg:text-lg font-bold text-foreground mb-1">{item.title}</h3>
                    <p className="text-xs text-[oklch(0.55_0_0)] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="py-24 border-t bg-navy border-[oklch(0.269_0_0)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-xl mb-16">
            <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-3">
              Pourquoi Bloomfield Terminal
            </p>
            <h2 className="text-3xl font-bold leading-tight">
              Conçu pour les professionnels de la finance africaine
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ADVANTAGES.map((adv) => (
              <div
                key={adv.title}
                className="p-6 rounded-lg border border-[oklch(0.269_0_0)] bg-[oklch(0.18_0_0)]  transition-colors group"
              >
                <div className="w-12 h-12 rounded-lg bg-navy/20 flex items-center justify-center text-primary mb-4 transition-colors">
                  {adv.icon}
                </div>
                <h3 className="font-bold text-sm mb-2">{adv.title}</h3>
                <p className="text-sm text-[oklch(0.55_0_0)] leading-relaxed">{adv.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules */}
      <section id="modules" className="py-24 border-t border-[oklch(0.269_0_0)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-xl mb-16">
            <p className="text-xs font-semibold tracking-widest uppercase text-[oklch(0.6_0.118_184.704)] mb-3">
              Modules
            </p>
            <h2 className="text-3xl font-bold leading-tight text-foreground">
              Six espaces de travail dédiés
            </h2>
            <p className="text-[oklch(0.55_0_0)] mt-3 text-sm leading-relaxed">
              Chaque module est optimisé pour un flux de travail spécifique. Les panneaux sont redimensionnables et configurables selon vos besoins.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:gap-8 lg:gap-10">
            {MODULES.map((mod, i) => (
              <div 
                className="grid grid-cols-2"
                key={mod.id}
              >
                <div className={i % 2 === 0 ? '' : 'order-2'}>
                  <Image 
                    src={mod.image}
                    alt={mod.name}
                    width={800}
                    height={300}
                  />
                </div>
                <div
                  className={`flex items-start flex-col gap-4 p-5 ${i % 2 === 0 ? 'rounded-r-md' : 'rounded-l-md'} hover:border-[oklch(0.269_0_0)]/80  transition-all group`}
                >
                  <div className="shrink-0 size-20 rounded-lg bg-primary flex items-center justify-center text-white group-hover:border-[oklch(0.646_0.222_41.116)]/30 transition-colors">
                    {mod.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-base md:text-lg text-foreground lg:text-3xl">{mod.name}</h3>
                    </div>
                    <ul className="list-disc list-inside">
                      {mod.description.split(',').map((item, i) => (
                        <li key={i} className="flex items-center my-4 gap-2">
                          <Dot className='text-primary size-10' />
                          <span className="text-sm md:text-base lg:text-lg text-[oklch(0.55_0_0)] leading-relaxed capitalize">{item.trim()}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / Access request */}
      <section id="access" className="py-24 border-t border-[oklch(0.269_0_0)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative rounded-xl border border-[oklch(0.269_0_0)] bg-[oklch(0.18_0_0)] overflow-hidden px-8 py-16 text-center">
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-primary/6 blur-[80px] pointer-events-none" />

            <div className="relative">
              <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-4">
                Accès professionnel
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 max-w-2xl mx-auto leading-tight">
                Rejoignez les professionnels qui suivent les marchés africains
              </h2>
              <p className="text-[oklch(0.55_0_0)] text-sm mb-10 max-w-lg mx-auto leading-relaxed">
                L'accès au terminal est réservé aux professionnels de la finance. Laissez votre email pour qu'un conseiller Bloomfield vous contacte.
              </p>

              {submitted ? (
                <div className="inline-flex items-center gap-3 px-6 py-4 rounded-lg border border-[oklch(0.6_0.118_184.704)]/40 bg-[oklch(0.6_0.118_184.704)]/10 text-[oklch(0.6_0.118_184.704)]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 shrink-0">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <span className="font-medium text-sm">Demande envoyée — nous vous contacterons sous 24h.</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    required
                    className="flex-1 px-4 py-3 rounded bg-[oklch(0.145_0_0)] border border-[oklch(0.269_0_0)] text-sm text-[oklch(0.985_0_0)] placeholder:text-[oklch(0.4_0_0)] focus:outline-none focus:border-[oklch(0.646_0.222_41.116)]/60 transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 rounded bg-navy text-white font-bold text-sm hover:bg-primary transition-colors whitespace-nowrap"
                  >
                    Demander l'accès
                  </button>
                </form>
              )}

              <p className="text-[oklch(0.4_0_0)] text-xs mt-4">
                Aucun engagement — réponse personnalisée sous 24h ouvrées.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 border-t border-[oklch(0.269_0_0)] bg-[oklch(0.145_0_0)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* Infos */}
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-3">Contact</p>
              <h2 className="text-3xl font-bold text-[oklch(0.985_0_0)] leading-tight mb-4">
                Parlons de vos besoins
              </h2>
              <p className="text-[oklch(0.55_0_0)] text-sm leading-relaxed mb-10">
                Notre équipe commerciale est disponible pour vous présenter la plateforme, répondre à vos questions et définir la formule d'accès adaptée à votre structure.
              </p>

              <div className="space-y-5">
                {[
                  {
                    label: 'Email',
                    value: 'terminal@bloomfieldinvestment.com',
                    icon: (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    ),
                  },
                  {
                    label: 'Téléphone',
                    value: '+225 27 20 31 30 00',
                    icon: (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.79 19.79 0 0 1 1.61 5 2 2 0 0 1 3.6 3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.6a16 16 0 0 0 6 6l.94-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17.92z" />
                      </svg>
                    ),
                  },
                  {
                    label: 'Adresse',
                    value: 'Abidjan Plateau, Immeuble CCIA – Côte d\'Ivoire',
                    icon: (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    ),
                  },
                  {
                    label: 'Horaires',
                    value: 'Lun – Ven, 8h00 – 18h00 (GMT)',
                    icon: (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    ),
                  },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary mt-0.5">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-[oklch(0.45_0_0)] mb-0.5">{item.label}</p>
                      <p className="text-sm text-[oklch(0.75_0_0)]">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Formulaire */}
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-[oklch(0.145_0_0)]/90 border-[oklch(0.269_0_0)] py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              B
            </div>
            <span className="text-xs font-bold tracking-widest uppercase text-[oklch(0.75_0_0)]">
              Bloomfield Terminal
            </span>
          </div>

          <p className="text-xs text-[oklch(0.6_0_0)]">
            © {new Date().getFullYear()} Bloomfield Investment Corporation. Tous droits réservés.
          </p>

          <div className="flex items-center gap-6">
            {['Mentions légales', 'Confidentialité', 'Contact'].map((item) => (
              <a key={item} href="#" className="text-xs text-[oklch(0.6_0_0)] hover:text-[oklch(0.85_0_0)] transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </footer>

    </div>
  )
}
