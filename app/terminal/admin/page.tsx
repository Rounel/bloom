'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
  ChevronLeft, Users, Database, FileText, Shield, Activity,
  Search, AlertTriangle, Clock, CheckCircle, XCircle, RefreshCw,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { adminUsers, auditLog, dataSources, type AdminUser, type UserRole } from '@/lib/mock-data'
import { ModuleLayout, ModuleSection, SectionDef } from '@/components/dashboard/module-layout'
import { PanelGrid, PanelRow, downloadCSV } from '@/components/dashboard/panel-grid'
import { useModuleSectionsStore } from '@/lib/module-sections-store'

const SECTIONS: SectionDef[] = [
  { id: 'kpis',        label: 'Indicateurs clés',  icon: Activity },
  { id: 'users',       label: 'Utilisateurs',       icon: Users },
  { id: 'sources',     label: 'Sources données',    icon: Database },
  { id: 'audit',       label: 'Journal d\'audit',   icon: FileText },
  { id: 'permissions', label: 'Permissions',        icon: Shield },
  { id: 'system',      label: 'Statut système',     icon: Activity },
]

const ROLE_COLORS: Record<UserRole, string> = {
  'super-admin': 'bg-red-400/20 text-red-400',
  'admin': 'bg-orange-500/20 text-orange-500',
  'analyste': 'bg-blue-400/20 text-blue-400',
  'trader': 'bg-emerald-500/20 text-emerald-500',
  'lecture-seule': 'bg-secondary text-muted-foreground',
}

const PERMISSIONS_MATRIX: { role: UserRole; modules: Record<string, boolean[]> }[] = [
  { role: 'super-admin',   modules: { 'Opérations': [true,true,true], 'Portefeuille': [true,true,true], 'Analyse': [true,true,true], 'Admin': [true,true,true] } },
  { role: 'admin',         modules: { 'Opérations': [true,true,true], 'Portefeuille': [true,true,false], 'Analyse': [true,true,false], 'Admin': [true,false,false] } },
  { role: 'analyste',      modules: { 'Opérations': [true,false,false], 'Portefeuille': [true,false,false], 'Analyse': [true,true,false], 'Admin': [false,false,false] } },
  { role: 'trader',        modules: { 'Opérations': [true,true,false], 'Portefeuille': [true,true,true], 'Analyse': [true,false,false], 'Admin': [false,false,false] } },
  { role: 'lecture-seule', modules: { 'Opérations': [true,false,false], 'Portefeuille': [true,false,false], 'Analyse': [true,false,false], 'Admin': [false,false,false] } },
]
const PERM_LABELS = ['Lire', 'Écrire', 'Admin']

export default function AdminPage() {
  const [userSearch, setUserSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<'tous' | UserRole>('tous')
  const [expandedAudit, setExpandedAudit] = useState<string | null>(null)
  const [time, setTime] = useState('')
  const [syncing, setSyncing] = useState<string | null>(null)

  const toggleSection = useModuleSectionsStore(s => s.toggle)

  useEffect(() => {
    setTime(new Date().toLocaleTimeString('fr-FR'))
    const id = setInterval(() => setTime(new Date().toLocaleTimeString('fr-FR')), 1000)
    return () => clearInterval(id)
  }, [])

  const filteredUsers = useMemo(() => {
    let users = adminUsers
    if (roleFilter !== 'tous') users = users.filter(u => u.role === roleFilter)
    if (userSearch) users = users.filter(u =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase())
    )
    return users
  }, [userSearch, roleFilter])

  function handleSync(id: string) {
    setSyncing(id)
    setTimeout(() => setSyncing(null), 2000)
  }

  const activeUsers = adminUsers.filter(u => u.status === 'actif').length
  const activeSources = dataSources.filter(s => s.status === 'actif').length

  const panelRows: PanelRow[] = [
    {
      id: 'admin-row-1',
      cells: [
        {
          id: 'users',
          title: 'Gestion des utilisateurs',
          icon: Users,
          initialFlex: 2,
          csvExport: () => {
            const headers = ['Nom', 'Email', 'Rôle', 'Pays', 'Statut', 'Dernière connexion']
            const rows = filteredUsers.map(u => [u.name, u.email, u.role, u.country, u.status, u.lastLogin])
            downloadCSV(headers, rows, `bloomfield-users-${new Date().toISOString().slice(0, 10)}.csv`)
          },
          content: (
            <div>
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <div className="relative flex-1 min-w-40">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <input type="text" placeholder="Rechercher utilisateur…" value={userSearch}
                    onChange={e => setUserSearch(e.target.value)}
                    className="w-full rounded-md border border-border bg-secondary/30 pl-8 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none" />
                </div>
                <select value={roleFilter} onChange={e => setRoleFilter(e.target.value as 'tous' | UserRole)}
                  className="rounded-md border border-border bg-secondary/30 px-2 py-1.5 text-xs text-foreground focus:outline-none">
                  <option value="tous">Tous les rôles</option>
                  <option value="super-admin">Super Admin</option>
                  <option value="admin">Admin</option>
                  <option value="analyste">Analyste</option>
                  <option value="trader">Trader</option>
                  <option value="lecture-seule">Lecture seule</option>
                </select>
              </div>
              <div className="overflow-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="text-[10px] text-muted-foreground font-semibold border-b border-border/40">
                      <th className="text-left py-1.5 px-2">Utilisateur</th>
                      <th className="text-left py-1.5 px-2">Rôle</th>
                      <th className="text-left py-1.5 px-2">Pays</th>
                      <th className="text-left py-1.5 px-2">Statut</th>
                      <th className="text-left py-1.5 px-2">Dernière connexion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(u => (
                      <tr key={u.id} className="border-b border-border/20 hover:bg-secondary/20 transition-colors">
                        <td className="py-2 px-2">
                          <div className="font-semibold text-foreground">{u.name}</div>
                          <div className="text-[10px] text-muted-foreground">{u.email}</div>
                        </td>
                        <td className="py-2 px-2">
                          <span className={cn('text-[10px] font-semibold rounded px-1.5 py-0.5', ROLE_COLORS[u.role])}>{u.role}</span>
                        </td>
                        <td className="py-2 px-2 text-muted-foreground">{u.country}</td>
                        <td className="py-2 px-2">
                          <span className={cn('text-[10px] font-semibold rounded px-1.5 py-0.5', {
                            'bg-emerald-500/20 text-emerald-500': u.status === 'actif',
                            'bg-red-400/20 text-red-400': u.status === 'suspendu',
                            'bg-yellow-500/20 text-yellow-500': u.status === 'en_attente',
                          })}>{u.status}</span>
                        </td>
                        <td className="py-2 px-2 font-mono text-[10px] text-muted-foreground">{u.lastLogin}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ),
        },
        {
          id: 'sources',
          title: 'Sources de données',
          icon: Database,
          initialFlex: 1,
          csvExport: () => {
            const headers = ['Nom', 'Statut', 'Latence (ms)', 'Fiabilité%']
            const rows = dataSources.map(s => [s.name, s.status, s.latency, s.reliability])
            downloadCSV(headers, rows, `bloomfield-sources-${new Date().toISOString().slice(0, 10)}.csv`)
          },
          content: (
            <div className="space-y-2">
              {dataSources.map(s => (
                <div key={s.id} className="flex items-center gap-2 p-2 rounded-lg bg-secondary/20">
                  <div className={cn('w-2 h-2 rounded-full shrink-0', {
                    'bg-emerald-500': s.status === 'actif',
                    'bg-yellow-500': s.status === 'dégradé',
                    'bg-red-400': s.status === 'hors_ligne',
                  })} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-foreground truncate">{s.name}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {s.latency}ms · Fiabilité: <span className={cn('font-semibold', s.reliability >= 95 ? 'text-emerald-500' : s.reliability >= 80 ? 'text-yellow-500' : 'text-red-400')}>{s.reliability}%</span>
                    </div>
                  </div>
                  <button onClick={() => handleSync(s.id)} className="p-1 rounded hover:bg-secondary transition-colors shrink-0" title="Synchroniser">
                    <RefreshCw className={cn('w-3.5 h-3.5 text-muted-foreground', syncing === s.id && 'animate-spin text-primary')} />
                  </button>
                </div>
              ))}
            </div>
          ),
        },
      ],
    },
    {
      id: 'admin-row-2',
      cells: [
        {
          id: 'audit',
          title: 'Journal d\'audit',
          icon: FileText,
          csvExport: () => {
            const headers = ['Horodatage', 'Utilisateur', 'Action', 'Ressource', 'IP', 'Statut']
            const rows = auditLog.map(e => [e.timestamp, e.userName, e.action, e.resource, e.ipAddress, e.status])
            downloadCSV(headers, rows, `bloomfield-audit-${new Date().toISOString().slice(0, 10)}.csv`)
          },
          content: (
            <div>
              <div className="overflow-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="text-[10px] text-muted-foreground font-semibold border-b border-border/40">
                      <th className="text-left py-1.5 px-3">Horodatage</th>
                      <th className="text-left py-1.5 px-3">Utilisateur</th>
                      <th className="text-left py-1.5 px-3">Action</th>
                      <th className="text-left py-1.5 px-3">Ressource</th>
                      <th className="text-left py-1.5 px-3">IP</th>
                      <th className="text-center py-1.5 px-3">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLog.map(entry => (
                      <>
                        <tr key={entry.id} className="border-b border-border/20 hover:bg-secondary/20 transition-colors cursor-pointer"
                          onClick={() => setExpandedAudit(expandedAudit === entry.id ? null : entry.id)}>
                          <td className="py-2 px-3 font-mono text-[10px] text-muted-foreground">{entry.timestamp}</td>
                          <td className="py-2 px-3"><div className="font-medium text-foreground">{entry.userName}</div></td>
                          <td className="py-2 px-3 text-muted-foreground">{entry.action}</td>
                          <td className="py-2 px-3 text-muted-foreground">{entry.resource}</td>
                          <td className="py-2 px-3 font-mono text-[10px] text-muted-foreground">{entry.ipAddress}</td>
                          <td className="py-2 px-3 text-center">
                            {entry.status === 'succès'
                              ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500 inline" />
                              : <XCircle className="w-3.5 h-3.5 text-red-400 inline" />}
                          </td>
                        </tr>
                        {expandedAudit === entry.id && entry.details && (
                          <tr key={`${entry.id}-detail`} className="border-b border-border/20 bg-secondary/10">
                            <td colSpan={6} className="py-2 px-3">
                              <div className="text-[11px] text-muted-foreground bg-secondary/30 rounded p-2 font-mono">{entry.details}</div>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 flex justify-end">
                <button className="text-xs text-muted-foreground hover:text-foreground border border-border/50 px-3 py-1.5 rounded-lg transition-colors">
                  Exporter le journal (simulé)
                </button>
              </div>
            </div>
          ),
        },
      ],
    },
    {
      id: 'admin-row-3',
      cells: [
        {
          id: 'permissions',
          title: 'Matrice des permissions',
          icon: Shield,
          initialFlex: 2,
          content: (
            <div className="overflow-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="text-[10px] text-muted-foreground font-semibold border-b border-border/40">
                    <th className="text-left py-1.5 px-3">Rôle</th>
                    {Object.keys(PERMISSIONS_MATRIX[0].modules).map(mod => (
                      PERM_LABELS.map(p => (
                        <th key={`${mod}-${p}`} className="text-center py-1.5 px-1.5 whitespace-nowrap">
                          <div className="text-[9px] text-muted-foreground/60">{mod}</div>
                          <div>{p}</div>
                        </th>
                      ))
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PERMISSIONS_MATRIX.map(row => (
                    <tr key={row.role} className="border-b border-border/20 hover:bg-secondary/20">
                      <td className="py-2 px-3">
                        <span className={cn('text-[10px] font-semibold rounded px-1.5 py-0.5', ROLE_COLORS[row.role])}>{row.role}</span>
                      </td>
                      {Object.values(row.modules).map((perms, mi) =>
                        perms.map((allowed, pi) => (
                          <td key={`${mi}-${pi}`} className="text-center py-2 px-1.5">
                            {allowed
                              ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500 inline" />
                              : <XCircle className="w-3.5 h-3.5 text-muted-foreground/30 inline" />}
                          </td>
                        ))
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ),
        },
        {
          id: 'system',
          title: 'Statut système',
          icon: Activity,
          initialFlex: 1,
          content: (
            <div className="space-y-3">
              {[
                { name: 'API BRVM Feed', uptime: 99.8, latency: 42, status: 'ok' },
                { name: 'Base de données', uptime: 99.9, latency: 12, status: 'ok' },
                { name: 'Service d\'alertes', uptime: 98.1, latency: 88, status: 'dégradé' },
                { name: 'CDN / Médias', uptime: 100, latency: 23, status: 'ok' },
              ].map(s => (
                <div key={s.name} className="flex items-center gap-2">
                  <div className={cn('w-2 h-2 rounded-full shrink-0', s.status === 'ok' ? 'bg-emerald-500' : 'bg-yellow-500')} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-foreground truncate">{s.name}</span>
                      <span className="text-[10px] font-mono text-muted-foreground ml-2 shrink-0">{s.latency}ms</span>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className={cn('h-full rounded-full', s.uptime >= 99 ? 'bg-emerald-500' : s.uptime >= 95 ? 'bg-yellow-500' : 'bg-red-400')}
                          style={{ width: `${s.uptime}%` }} />
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground w-10 text-right shrink-0">{s.uptime}%</span>
                    </div>
                  </div>
                </div>
              ))}
              <div className="border-t border-border/40 pt-3">
                <div className="text-[10px] text-muted-foreground mb-1.5">Santé globale</div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" style={{ width: '97%' }} />
                </div>
                <div className="text-xs font-bold text-emerald-500 mt-1">97% · Opérationnel</div>
              </div>
            </div>
          ),
        },
      ],
    },
  ]

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <header className="h-14 border-b flex items-center px-6 bg-card/50 backdrop-blur-sm gap-4 shrink-0">
        <Link href="/modules" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="w-4 h-4" />
          <span className="text-sm">Modules</span>
        </Link>
        <div className="h-5 w-px bg-border/50" />
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          <span className="font-bold text-base">Administration</span>
          <span className="text-xs text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-full">Back-office</span>
        </div>
        <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          {time}
        </div>
      </header>

      {/* Access banner */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-2 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
        <span className="text-xs text-amber-500 font-medium">
          Accès restreint — Zone Bloomfield Intelligence · Toutes les actions sont journalisées
        </span>
      </div>

      <ModuleLayout pageKey="admin" sections={SECTIONS} mainClassName="overflow-hidden" title="Paramétrage">
        <div className="h-full flex flex-col gap-1">

        <div className="shrink-0">
        <ModuleSection pageKey="admin" id="kpis" resizable={false}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-1">
            {[
              { label: 'Utilisateurs actifs', value: activeUsers, icon: Users, color: 'text-emerald-500' },
              { label: 'Connexions aujourd\'hui', value: 47, icon: Activity, color: 'text-blue-400' },
              { label: 'Sources actives', value: activeSources, icon: Database, color: 'text-primary' },
              { label: 'Alertes système', value: 2, icon: AlertTriangle, color: 'text-yellow-500' },
            ].map(k => (
              <div key={k.label} className="rounded-md border border-border/50 bg-card/80 p-4 flex items-center gap-3">
                <div className={cn('p-2.5 rounded-lg bg-secondary/50', k.color)}>
                  <k.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">{k.label}</div>
                  <div className="text-xl font-bold font-mono text-foreground">{k.value}</div>
                </div>
              </div>
            ))}
          </div>
        </ModuleSection>
        </div>

        <PanelGrid
          rows={panelRows}
          pageKey="admin"
          onHide={id => toggleSection('admin', id)}
        />

        </div>
      </ModuleLayout>
    </div>
  )
}
