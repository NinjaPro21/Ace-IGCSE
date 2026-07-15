interface QuizScopeBadgeProps {
  scope: 'section' | 'chapter'
  className?: string
}

/** Distinguishes per-topic section quizzes from end-of-chapter combined quizzes. */
export function QuizScopeBadge({ scope, className = '' }: QuizScopeBadgeProps) {
  const label = scope === 'section' ? 'Section quiz' : 'Chapter quiz'
  return (
    <span
      className={`ace-quiz-scope-badge ace-quiz-scope-badge--${scope} ${className}`.trim()}
    >
      {label}
    </span>
  )
}
