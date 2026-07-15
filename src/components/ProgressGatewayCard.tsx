import { Link } from 'react-router-dom'

type ProgressGatewayCardProps = {
  to: string
  icon: string
  title: string
  description: string
  meta?: string
  accent?: 'gold' | 'warn'
}

export function ProgressGatewayCard({
  to,
  icon,
  title,
  description,
  meta,
  accent = 'gold',
}: ProgressGatewayCardProps) {
  return (
    <Link to={to} className={`ace-progress-gateway ace-progress-gateway--${accent}`}>
      <span className="ace-progress-gateway__icon" aria-hidden>{icon}</span>
      <div className="ace-progress-gateway__body">
        <h3 className="ace-progress-gateway__title">{title}</h3>
        <p className="ace-progress-gateway__desc">{description}</p>
        {meta && <span className="ace-progress-gateway__meta">{meta}</span>}
      </div>
      <span className="ace-progress-gateway__arrow" aria-hidden>→</span>
    </Link>
  )
}
