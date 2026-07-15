import { useState } from 'react'
import { EnlightButton } from '@/components/EnlightButton'

interface InlineConfirmProps {
  label: string
  onConfirm: () => void
  variant?: 'primary' | 'outline'
  className?: string
  disabled?: boolean
  /** Render as a text link-style control instead of a button */
  textStyle?: boolean
}

export function InlineConfirm({
  label,
  onConfirm,
  variant = 'outline',
  className,
  disabled,
  textStyle,
}: InlineConfirmProps) {
  const [confirming, setConfirming] = useState(false)

  if (confirming) {
    return (
      <span className="ace-inline-confirm" role="group" aria-label={`Confirm ${label}`}>
        <span className="ace-inline-confirm__prompt">Are you sure?</span>
        <button
          type="button"
          className="ace-inline-confirm__yes"
          onClick={() => {
            onConfirm()
            setConfirming(false)
          }}
        >
          Yes
        </button>
        <button type="button" className="ace-inline-confirm__cancel" onClick={() => setConfirming(false)}>
          Cancel
        </button>
      </span>
    )
  }

  if (textStyle) {
    return (
      <button
        type="button"
        className={`ace-friend-row__remove${className ? ` ${className}` : ''}`}
        disabled={disabled}
        onClick={() => setConfirming(true)}
      >
        {label}
      </button>
    )
  }

  return (
    <EnlightButton variant={variant} className={className} disabled={disabled} onClick={() => setConfirming(true)}>
      {label}
    </EnlightButton>
  )
}
