import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export function ProgressIndicator({ 
  currentStep, 
  totalSteps, 
  className 
}: ProgressIndicatorProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className={cn("w-full space-y-2", className)}>
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Step {currentStep} of {totalSteps}</span>
        <span>{Math.round(progress)}% complete</span>
      </div>
      <Progress 
        value={progress} 
        className="h-2" 
        data-testid="progress-assessment"
      />
    </div>
  );
}