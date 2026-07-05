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
    <Link to={to} className={`enlight-progress-gateway enlight-progress-gateway--${accent}`}>
      <span className="enlight-progress-gateway__icon" aria-hidden>{icon}</span>
      <div className="enlight-progress-gateway__body">
        <h3 className="enlight-progress-gateway__title">{title}</h3>
        <p className="enlight-progress-gateway__desc">{description}</p>
        {meta && <span className="enlight-progress-gateway__meta">{meta}</span>}
      </div>
      <span className="enlight-progress-gateway__arrow" aria-hidden>→</span>
    </Link>
  )
}
