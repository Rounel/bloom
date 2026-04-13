'use client'

import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { companyProfiles } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

type Tab = 'historique' | 'apropos'

const tooltipStyle = {
  contentStyle: {
    backgroundColor: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    fontSize: '12px',
  },
}

export function CompanyProfilePanel() {
  const [selectedSymbol, setSelectedSymbol] = useState(companyProfiles[0].symbol)
  const [tab, setTab] = useState<Tab>('historique')

  const company = companyProfiles.find(c => c.symbol === selectedSymbol) ?? companyProfiles[0]

  const kpis = [
    { label: 'Rev. (Md FCFA)', value: company.revenue.toFixed(1) },
    { label: 'Marge EBITDA', value: `${company.ebitdaMargin.toFixed(1)}%` },
    { label: 'Marge nette', value: `${company.netMargin.toFixed(1)}%` },
    { label: 'ROE', value: `${(company.equity > 0 ? company.revenue * company.netMargin / 100 / company.equity * 100 : 0).toFixed(1)}%` },
    { label: 'Yield', value: `${company.dividendYield.toFixed(2)}%` },
    { label: 'P/E', value: company.dividendYield > 0 ? (100 / company.dividendYield).toFixed(1) : '—' },
  ]

  return (
    <div className="flex flex-col h-full gap-2">
      {/* Selector */}
      <select
        value={selectedSymbol}
        onChange={e => setSelectedSymbol(e.target.value)}
        className="w-full rounded-md border border-border bg-secondary/30 px-2 py-1 text-xs text-foreground focus:outline-none"
      >
        {companyProfiles.map(c => (
          <option key={c.symbol} value={c.symbol}>{c.symbol} — {c.name}</option>
        ))}
      </select>

      {/* KPI strip */}
      <div className="grid grid-cols-3 gap-1.5">
        {kpis.map(k => (
          <div key={k.label} className="bg-secondary/30 rounded-lg p-2 text-center">
            <div className="text-[10px] text-muted-foreground leading-tight">{k.label}</div>
            <div className="text-xs font-bold font-mono text-foreground mt-0.5">{k.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-secondary/30 rounded-lg p-1">
        {(['historique', 'apropos'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'flex-1 py-1 text-xs font-medium rounded-md transition-colors',
              tab === t ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {t === 'historique' ? 'Historique' : 'À propos'}
          </button>
        ))}
      </div>

      {tab === 'historique' ? (
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={company.revenueHistory} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="year" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} />
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Bar dataKey="revenue" name="Rev." fill="var(--chart-2)" radius={[2, 2, 0, 0]} />
              <Bar dataKey="ebitda" name="EBITDA" fill="var(--chart-1)" radius={[2, 2, 0, 0]} />
              <Bar dataKey="netIncome" name="Résultat net" fill="var(--chart-4)" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex-1 overflow-auto space-y-2 text-xs">
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'CEO', value: company.ceo },
              { label: 'Siège', value: company.headquarters },
              { label: 'Fondée', value: String(company.founded) },
              { label: 'Employés', value: company.employees.toLocaleString('fr-FR') },
              { label: 'ISIN', value: company.isin },
              { label: 'Cotation', value: company.listing },
            ].map(item => (
              <div key={item.label} className="bg-secondary/20 rounded p-2">
                <div className="text-[10px] text-muted-foreground">{item.label}</div>
                <div className="font-medium text-foreground truncate">{item.value}</div>
              </div>
            ))}
          </div>
          <div className="bg-secondary/20 rounded p-2">
            <div className="text-[10px] text-muted-foreground mb-1">Description</div>
            <p className="text-foreground/80 leading-relaxed">{company.description}</p>
          </div>
        </div>
      )}
    </div>
  )
}
