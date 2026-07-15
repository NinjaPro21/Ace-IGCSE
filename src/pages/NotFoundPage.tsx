import { Link } from 'react-router-dom'
import { EnlightButton } from '@/components/EnlightButton'
import { EnlightHeader } from '@/components/EnlightHeader'
import { usePageTitle } from '@/hooks/usePageTitle'

export function NotFoundPage() {
  usePageTitle('Page not found')
  return (
    <div className="ace-app">
      <EnlightHeader />
      <div className="ace-container ace-page-padding">
        <h1 className="ace-heading-serif">Page not found</h1>
        <p className="ace-body-text">
          That link doesn&apos;t match any page on AceIGCSE. Head back to your dashboard or
          browse subjects to keep studying.
        </p>
        <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
          <EnlightButton to="/dashboard">Go to dashboard</EnlightButton>
          <EnlightButton to="/subjects" variant="outline">
            Browse subjects
          </EnlightButton>
        </div>
        <p className="ace-body-text" style={{ marginTop: 24 }}>
          <Link to="/">Return to home</Link>
        </p>
      </div>
    </div>
  )
}
