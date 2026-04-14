'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { TerminalHeader } from '@/components/dashboard/terminal-header'
import { SplitWorkspace } from '@/components/dashboard/split-workspace'

// Separated so useSearchParams is inside a Suspense boundary
function LayoutInner({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams()
  const isPanel = searchParams.get('panel') === '1'

  if (isPanel) {
    // Bare wrapper — no header, no ticker, no split chrome
    return (
      <div className="flex flex-col bg-background min-h-screen">
        {children}
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <TerminalHeader />
      <SplitWorkspace>
        {children}
      </SplitWorkspace>
    </div>
  )
}

export default function TerminalLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="h-screen bg-background" />}>
      <LayoutInner>{children}</LayoutInner>
    </Suspense>
  )
}
