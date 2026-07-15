import { useState } from 'react'
import { EnlightSectionLabel } from '@/components/EnlightCard'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useMastery } from '@/features/mastery/MasteryContext'
import { getXpRequiredForNextLevel } from '@/features/mastery/levelSystem'

export function ProgressAchievementsPage() {
  usePageTitle('Achievements')
  const { achievements, levelProfile } = useMastery()
  const [xpGuideOpen, setXpGuideOpen] = useState(false)
  const unlockedCount = achievements.filter((a) => a.unlocked).length

  return (
    <>
      <EnlightSectionLabel>Achievements</EnlightSectionLabel>
      <h1 className="ace-heading-serif">Achievements</h1>
      <p className="ace-body-text ace-progress-page__intro">
        {unlockedCount}/{achievements.length} unlocked — earn more by studying, passing quizzes, and keeping streaks.
      </p>

      <section className="ace-dashboard-card">
        <div className="ace-achievement-grid">
          {achievements.map((a) => (
            <div
              key={a.id}
              className={[
                'ace-achievement',
                a.unlocked ? 'ace-achievement--unlocked' : 'ace-achievement--locked',
              ].join(' ')}
            >
              <span className="ace-achievement__icon">{a.icon}</span>
              <div>
                <div className="ace-achievement__title">{a.title}</div>
                <div className="ace-achievement__desc">{a.description}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="ace-dashboard-card ace-collapsible">
        <button
          type="button"
          className="ace-collapsible__trigger"
          onClick={() => setXpGuideOpen((o) => !o)}
          aria-expanded={xpGuideOpen}
        >
          <span className="ace-heading-serif">How you earn XP</span>
          <span className="ace-collapsible__chevron">{xpGuideOpen ? '▾' : '▸'}</span>
        </button>
        {xpGuideOpen && (
          <div className="ace-xp-table ace-collapsible__body">
            <div className="ace-xp-table__row">
              <span>Study a topic (5 min)</span>
              <span>+5 XP</span>
            </div>
            <div className="ace-xp-table__row">
              <span>Pass Easy quiz</span>
              <span>+10 XP</span>
            </div>
            <div className="ace-xp-table__row">
              <span>Pass Medium quiz</span>
              <span>+20 XP</span>
            </div>
            <div className="ace-xp-table__row">
              <span>Pass Hard quiz</span>
              <span>+35 XP</span>
            </div>
            <div className="ace-xp-table__row">
              <span>Pass PYP mastery</span>
              <span>+50 XP</span>
            </div>
            <div className="ace-xp-table__row ace-xp-table__row--muted">
              <span>Your next level ({levelProfile.level + 1})</span>
              <span>{getXpRequiredForNextLevel(levelProfile.level)} XP</span>
            </div>
            <div className="ace-xp-table__row ace-xp-table__row--muted">
              <span>Scaling</span>
              <span>+20 XP per level after Lv 1</span>
            </div>
          </div>
        )}
      </section>
    </>
  )
}
