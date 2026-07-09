import type { Metadata } from 'next'
import SearchPage from './SearchPage'

export const metadata: Metadata = {
  title: 'Find Farms Near You | Gathered',
  description: 'Discover local farms, farm stands, and farmers markets on a map.',
}

export default function Page(): React.ReactElement {
  return <SearchPage />
}
