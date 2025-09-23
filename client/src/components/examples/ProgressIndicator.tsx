import { ProgressIndicator } from '../ProgressIndicator'

export default function ProgressIndicatorExample() {
  return (
    <div className="p-8 max-w-md">
      <ProgressIndicator currentStep={3} totalSteps={5} />
    </div>
  )
}