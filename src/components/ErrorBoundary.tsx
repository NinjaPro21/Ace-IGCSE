import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

const PROVIDER_HMR_RE = /must be used within \w+Provider/

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)

    if (import.meta.env.DEV && PROVIDER_HMR_RE.test(error.message)) {
      window.setTimeout(() => window.location.reload(), 100)
    }
  }

  private reload = () => {
    window.location.reload()
  }

  render() {
    const { error } = this.state
    if (!error) return this.props.children

    const hmrHint =
      import.meta.env.DEV && PROVIDER_HMR_RE.test(error.message)
        ? 'The dev server hot-reloaded and lost React context. Reloading…'
        : null

    return (
      <div className="ace-error-boundary" role="alert">
        <h1>Something went wrong</h1>
        {hmrHint ? <p>{hmrHint}</p> : <p>The app hit an unexpected error.</p>}
        <p className="ace-error-boundary__detail">{error.message}</p>
        <button type="button" className="ace-btn ace-btn--primary" onClick={this.reload}>
          Reload page
        </button>
      </div>
    )
  }
}
