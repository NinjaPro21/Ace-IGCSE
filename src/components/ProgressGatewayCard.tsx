import { Link } from 'react-router-dom'

type ProgressGatewayCardProps = {
  to: string
  icon: string
  title: string
  description: string
  meta?: string
  accent?: 'purple' | 'gold' | 'mint' | 'rose' | 'blue' | 'sage'
}

export function ProgressGatewayCard({
  to,
  icon,
  title,
  description,
  meta,
  accent = 'purple',
}: ProgressGatewayCardProps) {
  return (
    <Link to={to} className={`enlight-progress-gateway enlight-progress-gateway--${accent}`}>
      <span className="enlight-progress-gateway__icon" aria-hidden>{icon}</span>
      <div className="enlight-progress-gateway__body">
        <h2 className="enlight-progress-gateway__title">{title}</h2>
        <p className="enlight-progress-gateway__desc">{description}</p>
        {meta && <span className="enlight-progress-gateway__meta">{meta}</span>}
      </div>
      <span className="enlight-progress-gateway__arrow" aria-hidden>→</span>
    </Link>
  )
}
