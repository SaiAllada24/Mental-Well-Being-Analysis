import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { assessmentSchema, AssessmentData } from "@shared/schema";
import { ProgressIndicator } from "./ProgressIndicator";

interface AssessmentFormProps {
  onSubmit: (data: AssessmentData) => void;
  onBack: () => void;
}

const TOTAL_STEPS = 4;

export function AssessmentForm({ onSubmit, onBack }: AssessmentFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  
  const form = useForm<AssessmentData>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      gender: undefined,
      country: "",
      occupation: undefined,
      self_employed: undefined,
      family_history: undefined,
      treatment: undefined,
      days_indoors: undefined,
      growing_stress: undefined,
      changes_habits: undefined,
      mental_health_history: undefined,
      mood_swings: undefined,
      coping_struggles: undefined,
      work_interest: undefined,
      social_weakness: undefined,
      mental_health_interview: undefined,
      care_options: undefined
    }
  });

  const handleNext = async () => {
    // Validate current step before proceeding
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isStepValid = await form.trigger(fieldsToValidate);
    
    if (isStepValid && currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const getFieldsForStep = (step: number): (keyof AssessmentData)[] => {
    switch (step) {
      case 1:
        return ['gender', 'country', 'occupation', 'self_employed'];
      case 2:
        return ['family_history', 'treatment', 'mental_health_history'];
      case 3:
        return ['days_indoors', 'growing_stress', 'changes_habits', 'mood_swings'];
      case 4:
        return ['coping_struggles', 'work_interest', 'social_weakness', 'mental_health_interview', 'care_options'];
      default:
        return [];
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (data: AssessmentData) => {
    console.log('Assessment submitted:', data);
    console.log('Form validation errors:', form.formState.errors);
    
    // Final validation of all fields
    const isValid = await form.trigger();
    if (isValid) {
      onSubmit(data);
    } else {
      console.error('Form validation failed on final submission:', form.formState.errors);
    }
  };

  const handleFormError = (errors: any) => {
    console.error('Form validation failed:', errors);
    console.log('Current form values:', form.getValues());
  };

  const handleFormSubmit = () => {
    console.log('Form submission triggered');
    console.log('Current form values:', form.getValues());
    console.log('Form validation errors:', form.formState.errors);
    console.log('Form is valid:', form.formState.isValid);
    form.handleSubmit(handleSubmit)();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-gender">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country of Residence</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., United States" {...field} data-testid="input-country" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="occupation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Occupation Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-occupation">
                            <SelectValue placeholder="Select occupation" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Corporate">Corporate</SelectItem>
                          <SelectItem value="Business">Business</SelectItem>
                          <SelectItem value="Student">Student</SelectItem>
                          <SelectItem value="Homemaker">Homemaker</SelectItem>
                          <SelectItem value="Others">Others</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="self_employed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Are you self-employed?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-wrap gap-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Yes" id="self-employed-yes" data-testid="radio-self-employed-yes" />
                            <Label htmlFor="self-employed-yes">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="No" id="self-employed-no" data-testid="radio-self-employed-no" />
                            <Label htmlFor="self-employed-no">No</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="NaN" id="self-employed-na" data-testid="radio-self-employed-na" />
                            <Label htmlFor="self-employed-na">Not applicable</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Mental Health History</h3>
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="family_history"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Family history of mental illness</FormLabel>
                      <FormDescription>Has anyone in your immediate family been diagnosed with a mental health condition?</FormDescription>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex gap-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Yes" id="family-history-yes" data-testid="radio-family-history-yes" />
                            <Label htmlFor="family-history-yes">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="No" id="family-history-no" data-testid="radio-family-history-no" />
                            <Label htmlFor="family-history-no">No</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="treatment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Have you sought treatment for mental health?</FormLabel>
                      <FormDescription>This includes therapy, counseling, medication, or other professional help</FormDescription>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex gap-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Yes" id="treatment-yes" data-testid="radio-treatment-yes" />
                            <Label htmlFor="treatment-yes">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="No" id="treatment-no" data-testid="radio-treatment-no" />
                            <Label htmlFor="treatment-no">No</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mental_health_history"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prior mental health history</FormLabel>
                      <FormDescription>Have you been previously diagnosed with any mental health condition?</FormDescription>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex gap-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Yes" id="mh-history-yes" data-testid="radio-mh-history-yes" />
                            <Label htmlFor="mh-history-yes">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="No" id="mh-history-no" data-testid="radio-mh-history-no" />
                            <Label htmlFor="mh-history-no">No</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Current Wellbeing</h3>
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="days_indoors"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time spent indoors recently</FormLabel>
                      <FormDescription>How many days have you spent mostly indoors in the past 2 months?</FormDescription>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-days-indoors">
                            <SelectValue placeholder="Select time range" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Go out every day">Go out every day</SelectItem>
                          <SelectItem value="1-14 days">1-14 days</SelectItem>
                          <SelectItem value="15-30 days">15-30 days</SelectItem>
                          <SelectItem value="31-60 days">31-60 days</SelectItem>
                          <SelectItem value="60+ days">60+ days</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="growing_stress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Growing stress levels</FormLabel>
                      <FormDescription>Have you noticed your stress levels increasing recently?</FormDescription>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex gap-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Yes" id="stress-yes" data-testid="radio-stress-yes" />
                            <Label htmlFor="stress-yes">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="No" id="stress-no" data-testid="radio-stress-no" />
                            <Label htmlFor="stress-no">No</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="changes_habits"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lifestyle/habit changes</FormLabel>
                      <FormDescription>Have your daily habits or routines changed significantly recently?</FormDescription>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex gap-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Yes" id="habits-yes" data-testid="radio-habits-yes" />
                            <Label htmlFor="habits-yes">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="No" id="habits-no" data-testid="radio-habits-no" />
                            <Label htmlFor="habits-no">No</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mood_swings"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mood swings intensity</FormLabel>
                      <FormDescription>How would you rate the intensity of your mood changes recently?</FormDescription>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-mood-swings">
                            <SelectValue placeholder="Select intensity" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Social & Professional Wellbeing</h3>
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="coping_struggles"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Difficulty coping with stress</FormLabel>
                      <FormDescription>Are you finding it hard to cope with daily stress?</FormDescription>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex gap-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Yes" id="coping-yes" data-testid="radio-coping-yes" />
                            <Label htmlFor="coping-yes">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="No" id="coping-no" data-testid="radio-coping-no" />
                            <Label htmlFor="coping-no">No</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="work_interest"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loss of interest in work</FormLabel>
                      <FormDescription>Have you lost interest or motivation in your work/studies?</FormDescription>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex gap-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Yes" id="work-interest-yes" data-testid="radio-work-interest-yes" />
                            <Label htmlFor="work-interest-yes">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="No" id="work-interest-no" data-testid="radio-work-interest-no" />
                            <Label htmlFor="work-interest-no">No</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="social_weakness"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Difficulty in social situations</FormLabel>
                      <FormDescription>Do you find social interactions challenging or overwhelming?</FormDescription>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex gap-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Yes" id="social-yes" data-testid="radio-social-yes" />
                            <Label htmlFor="social-yes">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="No" id="social-no" data-testid="radio-social-no" />
                            <Label htmlFor="social-no">No</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mental_health_interview"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comfort discussing mental health</FormLabel>
                      <FormDescription>Would you be comfortable discussing your mental health in an interview or conversation?</FormDescription>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex gap-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Yes" id="interview-yes" data-testid="radio-interview-yes" />
                            <Label htmlFor="interview-yes">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="No" id="interview-no" data-testid="radio-interview-no" />
                            <Label htmlFor="interview-no">No</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="care_options"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Awareness of available care</FormLabel>
                      <FormDescription>Are you aware of mental health care options available to you?</FormDescription>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex gap-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Yes" id="care-yes" data-testid="radio-care-yes" />
                            <Label htmlFor="care-yes">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="No" id="care-no" data-testid="radio-care-no" />
                            <Label htmlFor="care-no">No</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Not sure" id="care-unsure" data-testid="radio-care-unsure" />
                            <Label htmlFor="care-unsure">Not sure</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mb-4 hover-elevate"
            data-testid="button-back-to-landing"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          
          <ProgressIndicator 
            currentStep={currentStep} 
            totalSteps={TOTAL_STEPS} 
            className="mb-6"
          />
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit, handleFormError)}>
            <Card>
              <CardHeader>
                <CardTitle>Mental Health Assessment</CardTitle>
                <CardDescription>
                  Your responses are confidential and will help us provide you with a personalized risk profile.
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {renderStep()}
                
                {/* Navigation */}
                <div className="flex justify-between mt-8 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                    className="hover-elevate"
                    data-testid="button-previous"
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  
                  {currentStep < TOTAL_STEPS ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      className="hover-elevate"
                      data-testid="button-next"
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="hover-elevate"
                      data-testid="button-submit-assessment"
                    >
                      Complete Assessment
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
}