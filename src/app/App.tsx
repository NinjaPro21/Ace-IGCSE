import type { ReactNode } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { AfkPrompt } from '@/features/mastery/AfkPrompt'
import { MasteryProvider } from '@/features/mastery/MasteryContext'

import { AuthProvider } from '@/features/social/AuthContext'

import { RequireAuth } from '@/features/social/RequireAuth'

import { QuizArena } from '@/features/quiz/QuizArena'

import { LandingPage } from '@/pages/LandingPage'

import { ProgressPage } from '@/pages/ProgressPage'

import { AnalyticsPage } from '@/pages/AnalyticsPage'

import { SubjectHubPage } from '@/pages/SubjectHubPage'

import { TopicLessonPage } from '@/pages/TopicLessonPage'



function Protected({ children }: { children: ReactNode }) {

  return <RequireAuth>{children}</RequireAuth>

}



export function App() {

  return (

    <AuthProvider>

      <MasteryProvider>

        <BrowserRouter>

          <AfkPrompt />

          <Routes>

            <Route path="/" element={<Protected><LandingPage /></Protected>} />

            <Route path="/progress" element={<Protected><ProgressPage /></Protected>} />
            <Route path="/analytics" element={<Protected><AnalyticsPage /></Protected>} />

            <Route path="/subjects/:subjectId" element={<Protected><SubjectHubPage /></Protected>} />

            <Route

              path="/subjects/:subjectId/chapters/:chapterId/topics/:topicId"

              element={<Protected><TopicLessonPage /></Protected>}

            />

            <Route path="/quiz/:chapterId/:difficulty" element={<Protected><QuizArena /></Protected>} />

          </Routes>

        </BrowserRouter>

      </MasteryProvider>

    </AuthProvider>

  )

}

