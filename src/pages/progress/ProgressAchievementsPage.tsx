import { useState } from 'react'
import { EnlightSectionLabel } from '@/components/EnlightCard'
import { useMastery } from '@/features/mastery/MasteryContext'
import { XP_PER_LEVEL } from '@/features/mastery/levelSystem'

export function ProgressAchievementsPage() {
  const { achievements } = useMastery()
  const [xpGuideOpen, setXpGuideOpen] = useState(false)
  const unlockedCount = achievements.filter((a) => a.unlocked).length

  return (
    <>
      <EnlightSectionLabel>Achievements</EnlightSectionLabel>
      <h1 className="enlight-heading-serif">Achievements</h1>
      <p className="enlight-body-text enlight-progress-page__intro">
        {unlockedCount}/{achievements.length} unlocked — earn more by studying, passing quizzes, and keeping streaks.
      </p>

      <section className="enlight-dashboard-card">
        <div className="enlight-achievement-grid">
          {achievements.map((a) => (
            <div
              key={a.id}
              className={[
                'enlight-achievement',
                a.unlocked ? 'enlight-achievement--unlocked' : 'enlight-achievement--locked',
              ].join(' ')}
            >
              <span className="enlight-achievement__icon">{a.icon}</span>
              <div>
                <div className="enlight-achievement__title">{a.title}</div>
                <div className="enlight-achievement__desc">{a.description}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="enlight-dashboard-card enlight-collapsible">
        <button
          type="button"
          className="enlight-collapsible__trigger"
          onClick={() => setXpGuideOpen((o) => !o)}
          aria-expanded={xpGuideOpen}
        >
          <span className="enlight-heading-serif">How you earn XP</span>
          <span className="enlight-collapsible__chevron">{xpGuideOpen ? '▾' : '▸'}</span>
        </button>
        {xpGuideOpen && (
          <div className="enlight-xp-table enlight-collapsible__body">
            <div className="enlight-xp-table__row">
              <span>Study a topic (5 min)</span>
              <span>+5 XP</span>
            </div>
            <div className="enlight-xp-table__row">
              <span>Pass Easy quiz</span>
              <span>+10 XP</span>
            </div>
            <div className="enlight-xp-table__row">
              <span>Pass Medium quiz</span>
              <span>+20 XP</span>
            </div>
            <div className="enlight-xp-table__row">
              <span>Pass Hard quiz</span>
              <span>+35 XP</span>
            </div>
            <div className="enlight-xp-table__row">
              <span>Pass PYP mastery</span>
              <span>+50 XP</span>
            </div>
            <div className="enlight-xp-table__row enlight-xp-table__row--muted">
              <span>Level up every</span>
              <span>{XP_PER_LEVEL} XP</span>
            </div>
          </div>
        )}
      </section>
    </>
  )
}
