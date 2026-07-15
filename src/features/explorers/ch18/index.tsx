import { Component, type ReactNode } from 'react'
import { Chapter18VisualExplorer } from './Chapter18VisualExplorer'
import { parseCh18SceneFromDiagram, SCENE_META, type Ch18SceneId } from './ch18Scenes'

export { Chapter18VisualExplorer, parseCh18SceneFromDiagram, SCENE_META }
export type { Ch18SceneId }

type BoundaryState = { error: string | null }

class Ch18ErrorBoundary extends Component<{ children: ReactNode }, BoundaryState> {
  state: BoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): BoundaryState {
    return { error: error.message || 'Diagram failed to load' }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="ace-em-3d-explorer ace-em-3d-explorer--error" role="alert">
          <p>3D diagram could not be displayed.</p>
          <p className="ace-em-3d-explorer__error-detail">{this.state.error}</p>
        </div>
      )
    }
    return this.props.children
  }
}

/** Inline diagram in lesson notes */
export function Ch18Diagram({ diagram, hero }: { diagram: string; hero?: boolean }) {
  const scene = parseCh18SceneFromDiagram(diagram)
  return (
    <Ch18ErrorBoundary>
      <Chapter18VisualExplorer scene={scene} compact hero={hero} />
    </Ch18ErrorBoundary>
  )
}

export { Ch18ErrorBoundary }
