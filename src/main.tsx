import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app/App'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { initAceTheme } from '@/lib/appTheme'
import './styles/tokens.css'
import './styles/global.css'
import './styles/enlight.css'
import './styles/social.css'
import './styles/app-tour.css'

initAceTheme()

// Vite HMR websocket dies when the page is restored from back-forward cache.
if (import.meta.env.DEV) {
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) window.location.reload()
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
