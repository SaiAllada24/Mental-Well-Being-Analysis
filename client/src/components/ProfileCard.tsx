import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Quote, User, TrendingUp } from "lucide-react";
import { RiskProfile } from "@shared/schema";

interface ProfileCardProps {
  profile: RiskProfile;
  onViewDetails: () => void;
}

export function ProfileCard({ profile, onViewDetails }: ProfileCardProps) {
  return (
    <Card className="hover-elevate max-w-2xl mx-auto">
      <CardHeader className="text-center space-y-4">
        <div className="text-6xl">{profile.emoji}</div>
        <div>
          <CardTitle className="text-2xl">{profile.name}</CardTitle>
          <CardDescription className="text-lg italic mt-2">
            "{profile.emotionalNarrative}"
          </CardDescription>
        </div>
        <Badge variant="secondary" className="w-fit mx-auto">
          {profile.occupation.join(", ")} Profile
        </Badge>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Quote */}
        <div className="bg-primary/5 p-4 rounded-md border-l-4 border-primary">
          <Quote className="h-5 w-5 text-primary mb-2" />
          <p className="font-medium text-primary">{profile.quote}</p>
        </div>

        {/* Key Signals */}
        <div>
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Key Indicators
          </h4>
          <div className="flex flex-wrap gap-2">
            {profile.keySignals.map((signal, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {signal}
              </Badge>
            ))}
          </div>
        </div>

        {/* Celebrity Parallel */}
        <div>
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <User className="h-4 w-4" />
            You're in good company
          </h4>
          <p className="text-sm text-muted-foreground">
            Similar journey as <span className="font-medium">{profile.celebrityParallel}</span>
          </p>
        </div>

        {/* Statistics */}
        <div className="bg-accent/20 p-4 rounded-md">
          <p className="text-sm text-muted-foreground">
            <strong>You're not alone:</strong> {profile.youreNotAlone}
          </p>
        </div>

        <Button 
          onClick={onViewDetails} 
          className="w-full hover-elevate"
          data-testid="button-view-details"
        >
          View Detailed Profile & Recommendations
        </Button>
      </CardContent>
    </Card>
  );
}