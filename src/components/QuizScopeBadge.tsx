interface QuizScopeBadgeProps {
  scope: 'section' | 'chapter'
  className?: string
}

/** Distinguishes per-topic section quizzes from end-of-chapter combined quizzes. */
export function QuizScopeBadge({ scope, className = '' }: QuizScopeBadgeProps) {
  const label = scope === 'section' ? 'Section quiz' : 'Chapter quiz'
  return (
    <span
      className={`enlight-quiz-scope-badge enlight-quiz-scope-badge--${scope} ${className}`.trim()}
    >
      {label}
    </span>
  )
}
