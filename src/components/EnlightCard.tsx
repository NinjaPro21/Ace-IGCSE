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
      ? ' ace-card--accent-gold'
      : accent === 'blue'
        ? ' ace-card--accent-blue'
        : ''
  return <div className={`ace-card${accentClass} ${className}`.trim()}>{children}</div>
}

export function EnlightSectionLabel({ children }: { children: ReactNode }) {
  return <span className="ace-section-label">{children}</span>
}

export function EnlightFormulaBox({ children }: { children: ReactNode }) {
  return <div className="ace-formula-box">{children}</div>
}

export function EnlightProTip({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="ace-pro-tip">
      <p className="ace-pro-tip__title">{title}</p>
      <p className="ace-pro-tip__body">{children}</p>
    </div>
  )
}
