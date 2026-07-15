import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

type Variant = 'primary' | 'outline'

interface BaseProps {
  variant?: Variant
  className?: string
  children: ReactNode
}

interface ButtonProps extends BaseProps {
  to?: undefined
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
}

interface LinkProps extends BaseProps {
  to: string
  onClick?: () => void
}

export function EnlightButton(props: ButtonProps | LinkProps) {
  const variant = props.variant ?? 'primary'
  const cls = `ace-btn ace-btn--${variant}${props.className ? ` ${props.className}` : ''}`

  if ('to' in props && props.to) {
    const { to, onClick, children } = props as LinkProps
    return (
      <Link to={to} className={cls} onClick={onClick}>
        {children}
      </Link>
    )
  }

  const { onClick, type = 'button', disabled, children } = props as ButtonProps
  return (
    <button type={type} className={cls} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}
