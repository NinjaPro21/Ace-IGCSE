import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'

import { AfkPrompt } from '@/features/mastery/AfkPrompt'
import { CelebrationProvider } from '@/features/mastery/CelebrationOverlay'
import { MasteryProvider } from '@/features/mastery/MasteryContext'
import { AuthProvider } from '@/features/social/AuthContext'
import { RequireAuth } from '@/features/social/RequireAuth'
import { RequireAdmin } from '@/features/social/RequireAdmin'
import { SignInPrompt } from '@/features/social/SignInPrompt'
import { OnboardingModal } from '@/features/onboarding/OnboardingModal'
import { QuizArena } from '@/features/quiz/QuizArena'

import { MarketingLayout } from '@/pages/marketing/MarketingLayout'
import { MarketingHomePage } from '@/pages/marketing/MarketingHomePage'

const ProgressLayout = lazy(() =>
  import('@/pages/progress/ProgressLayout').then((m) => ({ default: m.ProgressLayout })),
)
const ProgressHubPage = lazy(() =>
  import('@/pages/progress/ProgressHubPage').then((m) => ({ default: m.ProgressHubPage })),
)
const ProgressReviewPage = lazy(() =>
  import('@/pages/progress/ProgressReviewPage').then((m) => ({ default: m.ProgressReviewPage })),
)
const ProgressSocialPage = lazy(() =>
  import('@/pages/progress/ProgressSocialPage').then((m) => ({ default: m.ProgressSocialPage })),
)
const ProgressSubjectsPage = lazy(() =>
  import('@/pages/progress/ProgressSubjectsPage').then((m) => ({ default: m.ProgressSubjectsPage })),
)
const ProgressAchievementsPage = lazy(() =>
  import('@/pages/progress/ProgressAchievementsPage').then((m) => ({ default: m.ProgressAchievementsPage })),
)
const ProgressAccountPage = lazy(() =>
  import('@/pages/progress/ProgressAccountPage').then((m) => ({ default: m.ProgressAccountPage })),
)
const ProgressQuizHistoryPage = lazy(() =>
  import('@/pages/progress/ProgressQuizHistoryPage').then((m) => ({ default: m.ProgressQuizHistoryPage })),
)
const ProgressQuizHistorySubjectPage = lazy(() =>
  import('@/pages/progress/ProgressQuizHistorySubjectPage').then((m) => ({
    default: m.ProgressQuizHistorySubjectPage,
  })),
)
const ProfilePage = lazy(() => import('@/pages/ProfilePage').then((m) => ({ default: m.ProfilePage })))
const AnalyticsPage = lazy(() => import('@/pages/AnalyticsPage').then((m) => ({ default: m.AnalyticsPage })))
const SubjectHubPage = lazy(() => import('@/pages/SubjectHubPage').then((m) => ({ default: m.SubjectHubPage })))
const SubjectsListPage = lazy(() =>
  import('@/pages/SubjectsListPage').then((m) => ({ default: m.SubjectsListPage })),
)
const TopicLessonPage = lazy(() => import('@/pages/TopicLessonPage').then((m) => ({ default: m.TopicLessonPage })))

function RouteFallback() {
  return (
    <div className="enlight-route-fallback" role="status" aria-live="polite">
      Loading…
    </div>
  )
}

function Protected({ children }: { children: React.ReactNode }) {
  return <RequireAuth>{children}</RequireAuth>
}

function LegacyProgressRedirect() {
  const { pathname, hash } = useLocation()
  const rest = pathname.replace(/^\/progress/, '') || ''
  return <Navigate to={`/dashboard${rest}${hash}`} replace />
}

export function App() {
  return (
    <AuthProvider>
      <MasteryProvider>
        <CelebrationProvider>
          <BrowserRouter>
            <AfkPrompt />
            <SignInPrompt />
            <OnboardingModal />

            <Suspense fallback={<RouteFallback />}>
              <Routes>
                {/* Public marketing */}
                <Route element={<MarketingLayout />}>
                  <Route index element={<MarketingHomePage />} />
                  <Route path="about" element={<Navigate to="/?step=4" replace />} />
                  <Route path="features" element={<Navigate to="/?step=1" replace />} />
                  <Route path="leaderboard" element={<Navigate to="/?step=5" replace />} />
                </Route>

                {/* Legacy redirect */}
                <Route path="/progress/*" element={<LegacyProgressRedirect />} />

                {/* Signed-in dashboard */}
                <Route path="/dashboard" element={<Protected><ProgressLayout /></Protected>}>
                  <Route index element={<ProgressHubPage />} />
                  <Route path="review" element={<ProgressReviewPage />} />
                  <Route path="social" element={<ProgressSocialPage />} />
                  <Route path="subjects" element={<ProgressSubjectsPage />} />
                  <Route path="achievements" element={<ProgressAchievementsPage />} />
                  <Route path="account" element={<ProgressAccountPage />} />
                  <Route path="quiz-history" element={<ProgressQuizHistoryPage />} />
                  <Route path="quiz-history/:subjectId" element={<ProgressQuizHistorySubjectPage />} />
                </Route>

                <Route path="/profile/:userId" element={<Protected><ProfilePage /></Protected>} />
                <Route path="/analytics" element={<Protected><RequireAdmin><AnalyticsPage /></RequireAdmin></Protected>} />

                <Route path="/subjects" element={<Protected><SubjectsListPage /></Protected>} />
                <Route path="/subjects/:subjectId" element={<Protected><SubjectHubPage /></Protected>} />
                <Route
                  path="/subjects/:subjectId/chapters/:chapterId/topics/:topicId"
                  element={<Protected><TopicLessonPage /></Protected>}
                />
                <Route path="/quiz/topic/:topicId/:difficulty" element={<QuizArena />} />
                <Route path="/quiz/:chapterId/:difficulty" element={<QuizArena />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </CelebrationProvider>
      </MasteryProvider>
    </AuthProvider>
  )
}
