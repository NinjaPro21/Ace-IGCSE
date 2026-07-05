import { useState } from 'react'
import { EnlightButton } from '@/components/EnlightButton'
import { useMastery } from '@/features/mastery/MasteryContext'
import { masteryEngine } from '@/features/mastery/MasteryEngine'
import { getAllSubjects } from '@/lib/contentLoader'
import { useAuth } from '@/features/social/AuthContext'

const GOALS = [10, 20, 30, 45, 60, 90, 120] as const

function formatGoalLabel(minutes: number): string {
  if (minutes >= 60) {
    const hrs = minutes / 60
    return Number.isInteger(hrs) ? `${hrs} hr${hrs > 1 ? 's' : ''}` : `${hrs} hrs`
  }
  return `${minutes} min`
}

export function OnboardingModal() {
  const { user, profileHydrated } = useAuth()
  const { progress, setDisplayName } = useMastery()
  const [step, setStep] = useState(0)
  const [name, setName] = useState(progress.displayName || user?.displayName || '')
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(
    progress.subjects?.length ? progress.subjects : ['add-maths-0606'],
  )
  const [goal, setGoal] = useState(progress.dailyGoalMin ?? 20)

  if (!profileHydrated || !user || progress.onboardingComplete) return null

  const subjects = getAllSubjects()

  const finish = () => {
    if (name.trim()) setDisplayName(name.trim())
    masteryEngine.setSubjects(selectedSubjects)
    masteryEngine.setDailyGoal(goal)
    masteryEngine.setOnboardingComplete()
    masteryEngine.notify()
  }

  return (
    <div className="enlight-popout-overlay" role="dialog" aria-modal="true">
      <div className="enlight-popout enlight-popout--card enlight-onboarding">
        {step === 0 && (
          <>
            <h2 className="enlight-heading-serif">Welcome to Project Enlight</h2>
            <p className="enlight-body-text">Pick a display name for leaderboards and friend lists.</p>
            <input
              className="enlight-profile-form__input"
              value={name}
              maxLength={24}
              onChange={(e) => setName(e.target.value)}
              placeholder="Display name"
            />
            <div className="enlight-popout__actions">
              <EnlightButton onClick={() => setStep(1)}>Next</EnlightButton>
              <EnlightButton variant="outline" onClick={finish}>Skip</EnlightButton>
            </div>
          </>
        )}
        {step === 1 && (
          <>
            <h2 className="enlight-heading-serif">Your subjects</h2>
            <p className="enlight-body-text">Which IGCSE subjects are you studying?</p>
            <div className="enlight-onboarding__subjects">
              {subjects.map((s) => (
                <label key={s.id} className="enlight-onboarding__subject">
                  <input
                    type="checkbox"
                    checked={selectedSubjects.includes(s.id)}
                    onChange={(e) => {
                      setSelectedSubjects((prev) =>
                        e.target.checked ? [...prev, s.id] : prev.filter((id) => id !== s.id),
                      )
                    }}
                  />
                  {s.name}
                </label>
              ))}
            </div>
            <div className="enlight-popout__actions">
              <EnlightButton onClick={() => setStep(2)}>Next</EnlightButton>
              <EnlightButton variant="outline" onClick={() => setStep(0)}>Back</EnlightButton>
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <h2 className="enlight-heading-serif">Daily study goal</h2>
            <p className="enlight-body-text">How many minutes do you want to study each day?</p>
            <div className="enlight-onboarding__goals">
              {GOALS.map((g) => (
                <button
                  key={g}
                  type="button"
                  className={`enlight-group-tab${goal === g ? ' enlight-group-tab--active' : ''}`}
                  onClick={() => setGoal(g)}
                >
                  {formatGoalLabel(g)}
                </button>
              ))}
            </div>
            <div className="enlight-popout__actions">
              <EnlightButton onClick={finish}>Continue →</EnlightButton>
            </div>
            <p className="enlight-body-text" style={{ marginTop: 12, fontSize: '0.85rem' }}>
              Next: a quick tour of the dashboard, subjects, and social hub.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
