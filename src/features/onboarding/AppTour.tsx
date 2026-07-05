import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { EnlightButton } from '@/components/EnlightButton'
import { useMastery } from '@/features/mastery/MasteryContext'
import { masteryEngine } from '@/features/mastery/MasteryEngine'
import { useAuth } from '@/features/social/AuthContext'

type TourPlacement = 'bottom' | 'top' | 'center'

interface TourStep {
  id: string
  route: string
  title: string
  body: string
  placement?: TourPlacement
  target?: string | null
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    route: '/dashboard',
    title: 'Welcome to Project Enlight',
    body: 'Let us show you where everything lives — dashboard, subjects, social, and more. Takes about a minute.',
    placement: 'center',
  },
  {
    id: 'nav-dashboard',
    route: '/dashboard',
    target: '[data-tour="nav-dashboard"]',
    title: 'Study dashboard',
    body: 'Your home base for streaks, XP, weekly progress, weak topics, and quiz history.',
    placement: 'bottom',
  },
  {
    id: 'dashboard-hero',
    route: '/dashboard',
    target: '[data-tour="dashboard-hero"]',
    title: 'Level up as you study',
    body: 'Track your level, XP bar, and daily goal. The welcome-back card picks up where you left off.',
    placement: 'bottom',
  },
  {
    id: 'dashboard-explore',
    route: '/dashboard',
    target: '[data-tour="dashboard-explore"]',
    title: 'Quick links',
    body: 'Jump to quiz history, weak-topic review, achievements, and account settings from here.',
    placement: 'top',
  },
  {
    id: 'nav-subjects',
    route: '/subjects',
    target: '[data-tour="nav-subjects"]',
    title: 'Subjects',
    body: 'All your IGCSE courses live here — notes, quizzes, and chapter progress.',
    placement: 'bottom',
  },
  {
    id: 'subjects-grid',
    route: '/subjects',
    target: '[data-tour="subjects-grid"]',
    title: 'Pick a subject',
    body: 'Open Add Maths, Maths, or Physics. Each chapter has notes plus Easy → Medium → Hard quizzes.',
    placement: 'top',
  },
  {
    id: 'nav-social',
    route: '/social',
    target: '[data-tour="nav-social"]',
    title: 'Social hub',
    body: 'Profile, leaderboards, friends, duels, and your school or clan — all in one place.',
    placement: 'bottom',
  },
  {
    id: 'social-profile',
    route: '/social',
    target: '[data-tour="social-profile"]',
    title: 'Your profile & rankings',
    body: 'Customize your banner, showcase medals, and see how you rank against classmates.',
    placement: 'bottom',
  },
  {
    id: 'social-groups',
    route: '/social',
    title: 'School & clans',
    body: 'Join your school, create a study clan, and see who is online, studying, or in a quiz right now.',
    placement: 'center',
  },
  {
    id: 'done',
    route: '/dashboard',
    title: "You're all set!",
    body: 'Head to Subjects to start a lesson, or open Dashboard anytime to track progress. Good luck!',
    placement: 'center',
  },
]

const PAD = 10

function pathMatchesStep(pathname: string, route: string): boolean {
  if (pathname === route) return true
  if (route === '/dashboard') return pathname.startsWith('/dashboard')
  if (route === '/subjects') return pathname.startsWith('/subjects')
  if (route === '/social') return pathname.startsWith('/social') || pathname.startsWith('/profile')
  return false
}

function useTargetRect(selector: string | null | undefined, stepIndex: number) {
  const [rect, setRect] = useState<DOMRect | null>(null)

  useEffect(() => {
    if (!selector) {
      setRect(null)
      return
    }

    const measure = () => {
      const el = document.querySelector(selector)
      if (el) {
        el.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
        setRect(el.getBoundingClientRect())
      } else {
        setRect(null)
      }
    }

    const timer = window.setTimeout(measure, 350)
    window.addEventListener('resize', measure)
    window.addEventListener('scroll', measure, true)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', measure, true)
    }
  }, [selector, stepIndex])

  return rect
}

export function AppTour() {
  const { user, profileHydrated } = useAuth()
  const { progress } = useMastery()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [stepIndex, setStepIndex] = useState(0)
  const [ready, setReady] = useState(false)
  const tourStartedRef = useRef(false)
  const tourNavRef = useRef(false)

  const step = TOUR_STEPS[stepIndex]
  const rect = useTargetRect(step?.target, stepIndex)
  const isLast = stepIndex === TOUR_STEPS.length - 1
  const targetMissing = Boolean(step?.target && !rect)
  const useCenterLayout = !step?.target || step.placement === 'center' || targetMissing

  const finish = useCallback(() => {
    masteryEngine.setAppTourComplete()
    masteryEngine.notify()
  }, [])

  const goToStep = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(TOUR_STEPS.length - 1, index))
      tourNavRef.current = true
      setStepIndex(clamped)
      navigate(TOUR_STEPS[clamped].route)
    },
    [navigate],
  )

  useEffect(() => {
    if (!profileHydrated || !user?.id || !progress.onboardingComplete || progress.appTourComplete) return
    if (tourStartedRef.current) return
    tourStartedRef.current = true
    setReady(true)
    tourNavRef.current = true
    navigate('/dashboard')
  }, [user?.id, profileHydrated, progress.onboardingComplete, progress.appTourComplete, navigate])

  // If the user clicks header nav (or anything else), end the tour — don't trap them.
  useEffect(() => {
    if (!ready || progress.appTourComplete || !step) return
    if (tourNavRef.current) {
      tourNavRef.current = false
      return
    }
    if (!pathMatchesStep(pathname, step.route)) {
      finish()
    }
  }, [pathname, ready, progress.appTourComplete, step, finish])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') finish()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [finish])

  if (!profileHydrated || !user || !progress.onboardingComplete || progress.appTourComplete || !ready || !step) {
    return null
  }

  const spotlightStyle =
    rect && !useCenterLayout
      ? {
          top: rect.top - PAD,
          left: rect.left - PAD,
          width: rect.width + PAD * 2,
          height: rect.height + PAD * 2,
        }
      : undefined

  let tooltipStyle: CSSProperties = {}
  if (rect && !useCenterLayout) {
    const preferTop = step.placement === 'top' || rect.bottom > window.innerHeight * 0.55
    if (preferTop) {
      tooltipStyle = {
        bottom: Math.max(16, window.innerHeight - rect.top + PAD + 16),
        left: Math.max(16, Math.min(rect.left, window.innerWidth - 340)),
      }
    } else {
      tooltipStyle = {
        top: Math.min(rect.bottom + PAD + 16, window.innerHeight - 280),
        left: Math.max(16, Math.min(rect.left, window.innerWidth - 340)),
      }
    }
  }

  return (
    <div className="enlight-app-tour" role="dialog" aria-modal="true" aria-labelledby="app-tour-title">
      {useCenterLayout ? (
        <div className="enlight-app-tour__backdrop" aria-hidden />
      ) : (
        spotlightStyle && <div className="enlight-app-tour__spotlight" style={spotlightStyle} aria-hidden />
      )}

      <div
        className={`enlight-app-tour__card${useCenterLayout ? ' enlight-app-tour__card--center' : ''}`}
        style={useCenterLayout ? undefined : tooltipStyle}
      >
        <div className="enlight-app-tour__progress" aria-hidden>
          {TOUR_STEPS.map((s, i) => (
            <span
              key={s.id}
              className={[
                'enlight-app-tour__dot',
                i === stepIndex ? 'enlight-app-tour__dot--active' : '',
                i < stepIndex ? 'enlight-app-tour__dot--done' : '',
              ].join(' ')}
            />
          ))}
        </div>

        <p className="enlight-app-tour__step-count">
          Step {stepIndex + 1} of {TOUR_STEPS.length}
        </p>
        <h2 id="app-tour-title" className="enlight-heading-serif enlight-app-tour__title">
          {step.title}
        </h2>
        <p className="enlight-body-text enlight-app-tour__body">{step.body}</p>

        <div className="enlight-app-tour__actions">
          <button type="button" className="enlight-link-btn" onClick={finish}>
            Skip tour
          </button>
          <div className="enlight-app-tour__nav-btns">
            {stepIndex > 0 && (
              <EnlightButton variant="outline" onClick={() => goToStep(stepIndex - 1)}>
                Back
              </EnlightButton>
            )}
            {isLast ? (
              <EnlightButton onClick={finish}>Start studying →</EnlightButton>
            ) : (
              <EnlightButton onClick={() => goToStep(stepIndex + 1)}>Next →</EnlightButton>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
