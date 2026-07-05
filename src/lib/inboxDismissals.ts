const STORAGE_KEY = 'enlight-inbox-dismissed'

export function getDismissedInboxIds(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return new Set()
    const parsed = JSON.parse(raw) as string[]
    return new Set(Array.isArray(parsed) ? parsed : [])
  } catch {
    return new Set()
  }
}

export function dismissInboxIds(ids: string[]): void {
  if (ids.length === 0) return
  const set = getDismissedInboxIds()
  for (const id of ids) set.add(id)
  const trimmed = [...set].slice(-200)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
}

export function clearAllInboxDismissals(): void {
  localStorage.removeItem(STORAGE_KEY)
}
