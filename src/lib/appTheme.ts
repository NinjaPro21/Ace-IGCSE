export const ACE_THEMES = [
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
  { id: 'forest', label: 'Forest' },
  { id: 'ocean', label: 'Ocean' },
] as const

export type AceThemeId = (typeof ACE_THEMES)[number]['id']

const STORAGE_KEY = 'ace-ui-theme'
const DEFAULT_THEME: AceThemeId = 'light'

/** Map retired theme ids to the closest current option. */
const LEGACY_THEME_MAP: Record<string, AceThemeId> = {
  pine: 'forest',
  teal: 'ocean',
}

export function isAceThemeId(value: string | null | undefined): value is AceThemeId {
  return ACE_THEMES.some((theme) => theme.id === value)
}

export function getStoredTheme(): AceThemeId {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (isAceThemeId(stored)) return stored
    if (stored && stored in LEGACY_THEME_MAP) return LEGACY_THEME_MAP[stored]
  } catch {
    /* ignore */
  }
  return DEFAULT_THEME
}

export function applyAceTheme(id: AceThemeId) {
  document.documentElement.setAttribute('data-ace-theme', id)
  try {
    localStorage.setItem(STORAGE_KEY, id)
  } catch {
    /* ignore */
  }
}

export function initAceTheme() {
  applyAceTheme(getStoredTheme())
}
