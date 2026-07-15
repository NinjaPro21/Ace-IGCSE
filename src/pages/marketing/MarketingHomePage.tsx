import { MarketingLanding } from './MarketingLanding'
import { usePageTitle } from '@/hooks/usePageTitle'

export function MarketingHomePage() {
  usePageTitle('Home')
  return <MarketingLanding />
}
