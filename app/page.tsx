'use client'

import { useState, useCallback } from 'react'
import { DashboardHeader }    from '@/components/dashboard/header'
import { DashboardSidebar }   from '@/components/dashboard/sidebar'
import { DashboardWorkspace } from '@/components/dashboard/workspace'
import { StatusBar }          from '@/components/dashboard/status-bar'
import { SearchModal }        from '@/components/search-modal'

export default function HomePage() {
  const [searchOpen, setSearchOpen] = useState(false)
  const openSearch  = useCallback(() => setSearchOpen(true),  [])
  const closeSearch = useCallback(() => setSearchOpen(false), [])

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <DashboardHeader onSearchOpen={openSearch} />

      <div className="flex-1 flex overflow-hidden">
        <DashboardSidebar />
        <DashboardWorkspace />
      </div>

      <StatusBar />

      <SearchModal open={searchOpen} onClose={closeSearch} />
    </div>
  )
}
