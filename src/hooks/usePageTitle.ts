import { useEffect } from 'react'

const SITE = 'Project Enlight'

export function usePageTitle(pageTitle: string) {
  useEffect(() => {
    const prev = document.title
    document.title = pageTitle ? `${pageTitle} — ${SITE}` : SITE
    return () => {
      document.title = prev
    }
  }, [pageTitle])
}
