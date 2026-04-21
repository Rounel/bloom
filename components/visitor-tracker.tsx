'use client'

import { useEffect } from 'react'
import { trackVisitor } from '@/lib/visitor-tracker'

export function VisitorTracker() {
  useEffect(() => { trackVisitor() }, [])
  return null
}
