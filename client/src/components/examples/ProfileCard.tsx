import { ProfileCard } from '../ProfileCard'
import { riskProfiles } from '@shared/schema'

export default function ProfileCardExample() {
  return (
    <div className="p-8 bg-background">
      <ProfileCard 
        profile={riskProfiles[0]} 
        onViewDetails={() => console.log('View details clicked')}
      />
    </div>
  )
}