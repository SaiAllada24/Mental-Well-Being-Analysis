import { useState } from "react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RotateCcw, TrendingUp, Users } from "lucide-react";

interface RiskRadarChartProps {
  eriResults: {
    eriScore: number;
    riskLevel: string;
    subScores: {
      stress: number;
      coping: number;
      habit: number;
      mood: number;
      social: number;
      work: number;
    };
  };
  onRetakeAssessment?: () => void;
}

interface RadarDataPoint {
  axis: string;
  userScore: number;
  populationAverage: number;
  userPercentile: number;
  fullName: string;
}

export function RiskRadarChart({ eriResults, onRetakeAssessment }: RiskRadarChartProps) {
  const [showComparison, setShowComparison] = useState(true);

  // Convert ERI sub-scores to 0-100 scale for radar chart
  const normalizeScore = (score: number): number => {
    // Assuming sub-scores are on 0-1 scale, convert to 0-100
    return Math.round(score * 100);
  };

  // Generate population averages (these would come from your backend in real implementation)
  const getPopulationAverage = (category: string): number => {
    const averages: Record<string, number> = {
      "Stress": 45,
      "Coping": 40,
      "Habit": 35,
      "Mood": 42,
      "Social": 38,
      "Work": 41
    };
    return averages[category] || 40;
  };

  // Calculate percentile (mock implementation)
  const calculatePercentile = (userScore: number, popAverage: number): number => {
    // Simple approximation: if above average, you're in higher percentile
    if (userScore > popAverage) {
      const diff = userScore - popAverage;
      return Math.min(95, 50 + (diff / 50) * 45);
    } else {
      const diff = popAverage - userScore;
      return Math.max(5, 50 - (diff / 50) * 45);
    }
  };

  const radarData: RadarDataPoint[] = [
    {
      axis: "Stress",
      fullName: "Stress Level",
      userScore: normalizeScore(eriResults.subScores.stress),
      populationAverage: getPopulationAverage("Stress"),
      userPercentile: 0
    },
    {
      axis: "Coping",
      fullName: "Coping Struggles", 
      userScore: normalizeScore(eriResults.subScores.coping),
      populationAverage: getPopulationAverage("Coping"),
      userPercentile: 0
    },
    {
      axis: "Habits",
      fullName: "Habit Changes",
      userScore: normalizeScore(eriResults.subScores.habit),
      populationAverage: getPopulationAverage("Habit"),
      userPercentile: 0
    },
    {
      axis: "Mood",
      fullName: "Mood Swings",
      userScore: normalizeScore(eriResults.subScores.mood),
      populationAverage: getPopulationAverage("Mood"),
      userPercentile: 0
    },
    {
      axis: "Social",
      fullName: "Social Withdrawal",
      userScore: normalizeScore(eriResults.subScores.social),
      populationAverage: getPopulationAverage("Social"),
      userPercentile: 0
    },
    {
      axis: "Work",
      fullName: "Work Disengagement",
      userScore: normalizeScore(eriResults.subScores.work),
      populationAverage: getPopulationAverage("Work"),
      userPercentile: 0
    }
  ].map(item => ({
    ...item,
    userPercentile: calculatePercentile(item.userScore, item.populationAverage)
  }));

  const getZoneColor = (score: number): string => {
    if (score <= 33) return "text-green-600";
    if (score <= 66) return "text-yellow-600"; 
    return "text-red-600";
  };

  const getZoneLabel = (score: number): string => {
    if (score <= 33) return "Stable";
    if (score <= 66) return "Moderate";
    return "Elevated";
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = radarData.find(item => item.axis === label);
      if (data) {
        return (
          <div className="bg-background border rounded-lg shadow-lg p-3">
            <p className="font-semibold">{data.fullName}</p>
            <p className="text-sm">
              Your Score: <span className={`font-medium ${getZoneColor(data.userScore)}`}>
                {data.userScore}/100 ({getZoneLabel(data.userScore)})
              </span>
            </p>
            {showComparison && (
              <>
                <p className="text-sm text-muted-foreground">
                  Population Average: {data.populationAverage}/100
                </p>
                <p className="text-sm text-muted-foreground">
                  Your Percentile: {Math.round(data.userPercentile)}%
                </p>
              </>
            )}
          </div>
        );
      }
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Risk Radar Chart
            </CardTitle>
            <CardDescription>
              Visual breakdown of your emotional risk factors across key dimensions
            </CardDescription>
          </div>
          {onRetakeAssessment && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRetakeAssessment}
              className="hover-elevate"
              data-testid="button-retake-assessment"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Retake
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Toggle Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="show-comparison"
                checked={showComparison}
                onCheckedChange={setShowComparison}
                data-testid="toggle-comparison"
              />
              <Label htmlFor="show-comparison" className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                Compare with similar users
              </Label>
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Stable (0-33)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Moderate (34-66)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Elevated (67-100)</span>
            </div>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
              <PolarGrid gridType="polygon" />
              <PolarAngleAxis 
                dataKey="axis" 
                tick={{ fontSize: 12, fill: 'hsl(var(--foreground))' }}
                className="text-foreground"
              />
              <PolarRadiusAxis
                domain={[0, 100]}
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                tickCount={4}
                angle={0}
              />
              
              {/* Population Average (dotted outline) */}
              {showComparison && (
                <Radar
                  name="Population Average"
                  dataKey="populationAverage"
                  stroke="hsl(var(--muted-foreground))"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  fill="transparent"
                  dot={{ fill: 'hsl(var(--muted-foreground))', strokeWidth: 2, r: 3 }}
                />
              )}
              
              {/* User Score (filled polygon) */}
              <Radar
                name="Your Score"
                dataKey="userScore"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="hsl(var(--primary))"
                fillOpacity={0.3}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
              />
              
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Score Summary */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
          {radarData.map((item) => (
            <div key={item.axis} className="text-center p-3 border rounded-lg">
              <div className="text-sm font-medium">{item.fullName}</div>
              <div className={`text-lg font-bold ${getZoneColor(item.userScore)}`}>
                {item.userScore}/100
              </div>
              <Badge variant="outline" className="text-xs">
                {getZoneLabel(item.userScore)}
              </Badge>
              {showComparison && (
                <div className="text-xs text-muted-foreground mt-1">
                  {item.userPercentile > 50 ? 'Above' : 'Below'} average
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}