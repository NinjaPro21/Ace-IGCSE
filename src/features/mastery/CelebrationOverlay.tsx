import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { useMastery } from './MasteryContext'
import { masteryEngine } from './MasteryEngine'
import { getLevelTitle, getXpRequiredForNextLevel } from './levelSystem'

export type CelebrationKind = 'level-up' | 'achievement' | 'streak' | 'quiz-pass'

export interface CelebrationPayload {
  kind: CelebrationKind
  title: string
  message: string
  icon: string
}

const CelebrationContext = createContext<{ show: (p: CelebrationPayload) => void } | null>(null)

export function CelebrationProvider({ children }: { children: ReactNode }) {
  const [queue, setQueue] = useState<CelebrationPayload[]>([])
  const [current, setCurrent] = useState<CelebrationPayload | null>(null)
  const { achievements } = useMastery()
  // Seed from persisted state so already-unlocked achievements don't replay
  // their celebrations on every app load.
  const prevAchievementIds = useRef<Set<string>>(
    new Set(masteryEngine.getState().achievementIds ?? []),
  )

  const show = useCallback((p: CelebrationPayload) => {
    setQueue((q) => [...q, p])
  }, [])

  useEffect(() => {
    const onLevelUp = (e: Event) => {
      const level = (e as CustomEvent<{ level: number }>).detail?.level
      if (level) {
        const nextXp = getXpRequiredForNextLevel(level)
        show({
          kind: 'level-up',
          title: `Level ${level} — ${getLevelTitle(level)}`,
          message: `Next level needs ${nextXp} XP (requirements scale as you rank up).`,
          icon: '🏆',
        })
      }
    }
    const onQuizPass = (e: Event) => {
      const detail = (e as CustomEvent<{ tier: string; xp: number }>).detail
      if (detail) {
        show({
          kind: 'quiz-pass',
          title: `${detail.tier} quiz passed!`,
          message: `+${detail.xp} XP earned`,
          icon: '✅',
        })
      }
    }
    const onStreakUp = (e: Event) => {
      const detail = (e as CustomEvent<{ streakDays: number }>).detail
      if (detail?.streakDays) {
        show({
          kind: 'streak',
          title: `${detail.streakDays}-day streak!`,
          message: 'Keep studying today to protect it.',
          icon: '🔥',
        })
      }
    }
    window.addEventListener('enlight-level-up', onLevelUp)
    window.addEventListener('enlight-quiz-pass', onQuizPass)
    window.addEventListener('enlight-streak-up', onStreakUp)
    return () => {
      window.removeEventListener('enlight-level-up', onLevelUp)
      window.removeEventListener('enlight-quiz-pass', onQuizPass)
      window.removeEventListener('enlight-streak-up', onStreakUp)
    }
  }, [show])

  const achievementsSeen = useRef(false)

  useEffect(() => {
    const unlocked = achievements.filter((a) => a.unlocked)
    // Only celebrate unlocks that happen after mount — anything unlocked on
    // first evaluation predates this session (covers legacy states without a
    // persisted achievementIds list).
    if (achievementsSeen.current) {
      const newOnes = unlocked.filter((a) => !prevAchievementIds.current.has(a.id))
      for (const a of newOnes) {
        show({
          kind: 'achievement',
          title: a.title,
          message: a.description,
          icon: a.icon,
        })
      }
    }
    achievementsSeen.current = true
    prevAchievementIds.current = new Set(unlocked.map((a) => a.id))
    masteryEngine.syncAchievementIds(unlocked.map((a) => a.id))
  }, [achievements, show])

  useEffect(() => {
    if (current || queue.length === 0) return
    setCurrent(queue[0])
    setQueue((q) => q.slice(1))
  }, [current, queue])

  const dismiss = () => setCurrent(null)

  useEffect(() => {
    if (!current) return
    const t = window.setTimeout(dismiss, 4500)
    return () => window.clearTimeout(t)
  }, [current])

  return (
    <CelebrationContext.Provider value={{ show }}>
      {children}
      {current && (
        <div className="ace-celebration" role="status" aria-live="polite">
          <div className="ace-celebration__card">
            <span className="ace-celebration__icon">{current.icon}</span>
            <div>
              <div className="ace-celebration__title">{current.title}</div>
              <div className="ace-celebration__msg">{current.message}</div>
            </div>
            <button type="button" className="ace-celebration__close" onClick={dismiss} aria-label="Dismiss">
              ×
            </button>
          </div>
        </div>
      )}
    </CelebrationContext.Provider>
  )
}

export function useCelebration() {
  const ctx = useContext(CelebrationContext)
  if (!ctx) throw new Error('useCelebration must be used within CelebrationProvider')
  return ctx
}
