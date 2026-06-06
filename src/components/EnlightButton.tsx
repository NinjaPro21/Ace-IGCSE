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
}

interface LinkProps extends BaseProps {
  to: string
}

export function EnlightButton(props: ButtonProps | LinkProps) {
  const variant = props.variant ?? 'primary'
  const cls = `enlight-btn enlight-btn--${variant}${props.className ? ` ${props.className}` : ''}`

  if ('to' in props && props.to) {
    return (
      <Link to={props.to} className={cls}>
        {props.children}
      </Link>
    )
  }

  const { onClick, type = 'button', children } = props as ButtonProps
  return (
    <button type={type} className={cls} onClick={onClick}>
      {children}
    </button>
  )
}
