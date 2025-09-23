import { ResultsPage } from '../ResultsPage'
import { riskProfiles } from '@shared/schema'

export default function ResultsPageExample() {
  return (
    <ResultsPage 
      profile={riskProfiles[2]} // The Careful Climber
      onStartOver={() => console.log('Starting over...')}
    />
  )
}