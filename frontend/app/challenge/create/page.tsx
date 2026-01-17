'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { DurationStep } from '@/components/challenge/DurationStep';
import { StartDateStep } from '@/components/challenge/StartDateStep';
import { HabitSelectionStep } from '@/components/challenge/HabitSelectionStep';
import { ChallengeModeStep } from '@/components/challenge/ChallengeModeStep';
import { challengeAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { SelectedHabit, ChallengeMode, HabitType } from '@/types';
import { HABITS } from '@/lib/constants';

export default function CreateChallengePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [selectedStartDate, setSelectedStartDate] = useState<string>('today');
  const [selectedHabits, setSelectedHabits] = useState<SelectedHabit[]>([]);
  const [selectedMode, setSelectedMode] = useState<ChallengeMode | null>(null);

  const totalSteps = 4;

  const handleToggleHabit = (habitId: string, requirement: string) => {
    const habit = HABITS.find((h) => h.id === habitId);
    if (!habit) return;

    const existingIndex = selectedHabits.findIndex(
      (h) => h.habitId === habitId,
    );

    if (existingIndex >= 0) {
      // Update requirement if habit already selected
      const updated = [...selectedHabits];
      updated[existingIndex] = {
        habitId,
        habitType: habit.type,
        requirement,
      };
      setSelectedHabits(updated);
    } else {
      // Add new habit
      setSelectedHabits([
        ...selectedHabits,
        {
          habitId,
          habitType: habit.type,
          requirement,
        },
      ]);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Calculate start date
      let startDate = new Date();
      if (selectedStartDate === 'tomorrow') {
        startDate.setDate(startDate.getDate() + 1);
      }
      // Set to start of day
      startDate.setHours(0, 0, 0, 0);

      // Convert frontend habits to backend format
      const backendHabits = selectedHabits.map((habit) => {
        const habitInfo = HABITS.find((h) => h.id === habit.habitId);
        if (!habitInfo) throw new Error(`Habit not found: ${habit.habitId}`);

        return {
          habitId: habit.habitType, // Use habitType (e.g., 'sleep') as habitId for backend
          requirement: {
            type: habitInfo.requirementType, // 'hours', 'glasses', 'meals', 'minutes'
            value: Number(habit.requirement), // Convert string to number
          },
        };
      });

      const challengeData = {
        duration: selectedDuration!,
        startDate: startDate.toISOString(),
        mode: selectedMode!,
        habits: backendHabits,
      };

      console.log('Submitting challenge data:', challengeData);

      const response = await challengeAPI.createChallenge(challengeData);

      // Save challenge ID for later use
      if (response.data?.id) {
        localStorage.setItem('currentChallengeId', response.data.id);
      }

      toast({
        title: 'Success!',
        description: 'Your challenge has been created.',
      });

      // Redirect to dashboard or challenge detail page
      router.push(`/dashboard`);
    } catch (error: any) {
      console.error('Error creating challenge:', error);
      toast({
        title: 'Error',
        description:
          error.response?.data?.message ||
          'Failed to create challenge. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-background'>
      {/* Header */}
      <div className='border-b'>
        <div className='container max-w-2xl mx-auto px-4 py-4'>
          <div className='flex items-center gap-4'>
            <button
              onClick={() => {
                if (currentStep > 1) {
                  setCurrentStep(currentStep - 1);
                } else {
                  router.back();
                }
              }}
              className='p-2 hover:bg-accent rounded-full transition-colors'
            >
              <ArrowLeft className='h-5 w-5' />
            </button>
            <h1 className='text-xl font-bold'>Create Challenge</h1>
          </div>

          {/* Progress Bar */}
          <div className='mt-4 flex gap-1'>
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  index < currentStep ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='container max-w-2xl mx-auto px-4 py-8'>
        {currentStep === 1 && (
          <DurationStep
            selectedDuration={selectedDuration}
            onSelect={setSelectedDuration}
            onNext={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 2 && (
          <StartDateStep
            selectedStartDate={selectedStartDate}
            onSelect={setSelectedStartDate}
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
          />
        )}

        {currentStep === 3 && (
          <HabitSelectionStep
            selectedHabits={selectedHabits}
            onToggleHabit={handleToggleHabit}
            onNext={() => setCurrentStep(4)}
            onBack={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 4 && (
          <ChallengeModeStep
            selectedMode={selectedMode}
            onSelect={setSelectedMode}
            onSubmit={handleSubmit}
            onBack={() => setCurrentStep(3)}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
}
