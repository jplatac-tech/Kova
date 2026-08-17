'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

export function HideOnAdmin({
  children,
  includeLogin = false,
}: {
  children: ReactNode
  includeLogin?: boolean
}) {
  const pathname = usePathname()
  if (!pathname.startsWith('/admin')) return children
  if (pathname === '/admin/login' && !includeLogin) return children
  return null
}
