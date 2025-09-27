import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Brain, TrendingUp, AlertTriangle } from "lucide-react";

interface LandingPageProps {
  onStartAssessment: () => void;
}

export function LandingPage({ onStartAssessment }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/10 text-[20px] font-medium">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-16">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">
              Mental Health Risk
              <span className="text-primary block">Profiling</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-[16px]">Assessment tool that evaluates key indicators to provide personalized risk profiles and wellness recommendations.</p>
          </div>
          
          <Button 
            size="lg" 
            onClick={onStartAssessment}
            className="text-lg px-8 py-6 hover-elevate font-bold"
            data-testid="button-start-assessment"
          >
            Begin Assessment
          </Button>
          
          <p className="text-sm text-muted-foreground">
            <Shield className="inline h-4 w-4 mr-1" />
            Confidential and secure • Takes 5-8 minutes
          </p>
        </div>

        {/* Important Notice */}
        <div className="mb-16 text-center">
          <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <h3 className="font-semibold text-amber-800 dark:text-amber-200">Important Notice</h3>
              </div>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Results are for informational purposes and should not replace professional mental health care.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold text-center">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover-elevate">
              <CardHeader className="text-center">
                <Brain className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Complete Assessment</CardTitle>
                <CardDescription>
                  Answer 16 research-based questions about your mental health indicators
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="hover-elevate">
              <CardHeader className="text-center">
                <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Get Your Profile</CardTitle>
                <CardDescription>
                  Receive one of 10 evidence-based risk profiles with personalized insights
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="hover-elevate">
              <CardHeader className="text-center">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Take Action</CardTitle>
                <CardDescription>
                  Access tailored recommendations and support resources for your wellness journey
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Trust & Privacy */}
        <div className="mt-16 text-center">
          <Card className="bg-card/50 border-primary/20">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">Your Privacy Matters</h3>
              <p className="text-sm text-muted-foreground">This assessment is completely anonymous. No personal information is stored or shared.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}