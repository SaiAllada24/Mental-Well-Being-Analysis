import { LandingPage } from '../LandingPage'

export default function LandingPageExample() {
  return (
    <LandingPage 
      onStartAssessment={() => console.log('Starting assessment...')}
    />
  )
}