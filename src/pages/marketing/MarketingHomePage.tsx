import { MarketingWalkthrough } from './MarketingWalkthrough'
import { usePageTitle } from '@/hooks/usePageTitle'

export function MarketingHomePage() {
  usePageTitle('Home')
  return <MarketingWalkthrough />
}
