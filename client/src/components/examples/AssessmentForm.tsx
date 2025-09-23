import { AssessmentForm } from '../AssessmentForm'

export default function AssessmentFormExample() {
  return (
    <AssessmentForm 
      onSubmit={(data) => console.log('Assessment submitted:', data)}
      onBack={() => console.log('Going back...')}
    />
  )
}