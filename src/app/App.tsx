import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MasteryProvider } from '@/features/mastery/MasteryContext'
import { QuizArena } from '@/features/quiz/QuizArena'
import { DemoPage } from '@/pages/DemoPage'
import { LandingPage } from '@/pages/LandingPage'
import { PricingPage } from '@/pages/PricingPage'
import { SubjectHubPage } from '@/pages/SubjectHubPage'
import { TopicLessonPage } from '@/pages/TopicLessonPage'

export function App() {
  return (
    <MasteryProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/subjects/:subjectId" element={<SubjectHubPage />} />
          <Route
            path="/subjects/:subjectId/chapters/:chapterId/topics/:topicId"
            element={<TopicLessonPage />}
          />
          <Route path="/quiz/:chapterId/:difficulty" element={<QuizArena />} />
        </Routes>
      </BrowserRouter>
    </MasteryProvider>
  )
}
