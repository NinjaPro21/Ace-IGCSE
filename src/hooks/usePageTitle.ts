import { useEffect } from 'react'
import { BRAND } from '@/lib/brand'

const SITE = BRAND.full

export function usePageTitle(pageTitle: string) {
  useEffect(() => {
    const prev = document.title
    document.title = pageTitle ? `${pageTitle} — ${SITE}` : SITE
    return () => {
      document.title = prev
    }
  }, [pageTitle])
}
