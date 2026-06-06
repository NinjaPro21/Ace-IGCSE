import type { ReactNode } from 'react'

type Accent = 'gold' | 'blue' | 'none'

interface EnlightCardProps {
  children: ReactNode
  accent?: Accent
  className?: string
}

export function EnlightCard({ children, accent = 'none', className = '' }: EnlightCardProps) {
  const accentClass =
    accent === 'gold'
      ? ' enlight-card--accent-gold'
      : accent === 'blue'
        ? ' enlight-card--accent-blue'
        : ''
  return <div className={`enlight-card${accentClass} ${className}`.trim()}>{children}</div>
}

export function EnlightSectionLabel({ children }: { children: ReactNode }) {
  return <span className="enlight-section-label">{children}</span>
}

export function EnlightFormulaBox({ children }: { children: ReactNode }) {
  return <div className="enlight-formula-box">{children}</div>
}

export function EnlightProTip({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="enlight-pro-tip">
      <p className="enlight-pro-tip__title">{title}</p>
      <p className="enlight-pro-tip__body">{children}</p>
    </div>
  )
}
