import { ResultsPage } from '../ResultsPage'
import { riskProfiles } from '@shared/schema'

export default function ResultsPageExample() {
  return (
    <ResultsPage 
      profile={riskProfiles[1]} // Overwhelmed Achiever
      onStartOver={() => console.log('Starting over...')}
    />
  )
}