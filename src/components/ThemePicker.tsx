import { useEffect, useState } from 'react'
import {
  ACE_THEMES,
  applyAceTheme,
  getStoredTheme,
  type AceThemeId,
} from '@/lib/appTheme'

export function ThemePicker({ className = '' }: { className?: string }) {
  const [theme, setTheme] = useState<AceThemeId>(() => getStoredTheme())

  useEffect(() => {
    applyAceTheme(theme)
  }, [theme])

  return (
    <div
      className={`ace-theme-picks ${className}`.trim()}
      role="group"
      aria-label="Color theme"
    >
      <span className="ace-theme-picks__label">Theme</span>
      {ACE_THEMES.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`ace-theme-picks__btn${theme === item.id ? ' ace-theme-picks__btn--active' : ''}`}
          aria-pressed={theme === item.id}
          onClick={() => setTheme(item.id)}
        >
          <span
            className={`ace-theme-picks__dot ace-theme-picks__dot--${item.id}`}
            aria-hidden
          />
          <span className="ace-theme-picks__name">{item.label}</span>
        </button>
      ))}
    </div>
  )
}
