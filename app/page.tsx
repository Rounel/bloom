'use client'

import { DashboardHeader } from '@/components/dashboard/header'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardWorkspace } from '@/components/dashboard/workspace'
import { StatusBar } from '@/components/dashboard/status-bar'

export default function HomePage() {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <DashboardHeader />
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <DashboardSidebar />
        
        {/* Workspace */}
        <DashboardWorkspace />
      </div>
      
      {/* Status Bar */}
      <StatusBar />
    </div>
  )
}
