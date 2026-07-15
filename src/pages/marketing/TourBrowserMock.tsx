import type { ReactNode } from 'react'

/** Decorative browser frame for marketing walkthrough (premium PE-style). */
export function TourBrowserMock({
  url = 'aceigcse.my',
  children,
  className = '',
}: {
  url?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`ace-tour-browser ${className}`.trim()}>
      <div className="ace-tour-browser__chrome">
        <span className="ace-tour-browser__dot ace-tour-browser__dot--red" />
        <span className="ace-tour-browser__dot ace-tour-browser__dot--amber" />
        <span className="ace-tour-browser__dot ace-tour-browser__dot--green" />
        <span className="ace-tour-browser__url">{url}</span>
      </div>
      <div className="ace-tour-browser__body">{children}</div>
    </div>
  )
}

export function TourHeroMock() {
  return (
    <TourBrowserMock className="ace-tour-browser--hero">
      <div className="ace-tour-browser__float ace-tour-browser__float--xp">
        <span className="ace-tour-browser__float-icon">⚡</span>
        <div>
          <strong>+15 XP</strong>
          <span>Quiz complete</span>
        </div>
      </div>
      <div className="ace-tour-browser__float ace-tour-browser__float--study">
        <span className="ace-tour-browser__float-icon">⏱</span>
        <div>
          <strong>Study time</strong>
          <span>12 min today</span>
        </div>
      </div>
      <div className="ace-tour-browser__card">
        <div className="ace-tour-browser__card-icon">📊</div>
        <div>
          <strong>Linear Graphs</strong>
          <span>Mathematics 0580 · Section 2</span>
        </div>
        <div className="ace-tour-browser__card-cta">Open lesson →</div>
      </div>
    </TourBrowserMock>
  )
}
