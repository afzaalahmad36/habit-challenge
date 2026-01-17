'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HABITS } from '@/lib/constants';
import { SelectedHabit } from '@/types';
import { Check, Info } from 'lucide-react';

interface HabitSelectionStepProps {
  selectedHabits: SelectedHabit[];
  onToggleHabit: (habitId: string, requirement: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function HabitSelectionStep({
  selectedHabits,
  onToggleHabit,
  onNext,
  onBack,
}: HabitSelectionStepProps) {
  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-bold mb-2'>Select Habits</h2>
        <p className='text-muted-foreground'>
          All 7 habits included (customize with Shebrew*)
        </p>
      </div>

      <div className='space-y-4 max-h-[60vh] overflow-y-auto'>
        {HABITS.map((habit) => {
          const isSelected = selectedHabits.some((h) => h.habitId === habit.id);
          const selectedRequirement = selectedHabits.find(
            (h) => h.habitId === habit.id,
          )?.requirement;

          return (
            <Card key={habit.id} className='p-4'>
              <div className='flex items-center justify-between mb-3'>
                <div className='flex items-center gap-3'>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-2xl ${
                      isSelected ? 'bg-green-100' : 'bg-gray-100'
                    }`}
                  >
                    {isSelected ? (
                      <Check className='text-green-600' />
                    ) : (
                      habit.icon
                    )}
                  </div>
                  <div>
                    <h3 className='font-semibold'>{habit.name}</h3>
                    <p className='text-sm text-muted-foreground'>
                      {habit.description}
                    </p>
                  </div>
                </div>
                <Button variant='ghost' size='icon'>
                  <Info className='h-4 w-4' />
                </Button>
              </div>

              <div className='flex gap-2'>
                {habit.requirements.map((req: any) => (
                  <Button
                    key={req.value}
                    variant={
                      selectedRequirement === req.value ? 'default' : 'outline'
                    }
                    size='sm'
                    className={`flex-1 rounded-full ${
                      selectedRequirement === req.value
                        ? 'bg-primary text-primary-foreground'
                        : ''
                    }`}
                    onClick={() => onToggleHabit(habit.id, req.value)}
                  >
                    {req.label}
                  </Button>
                ))}
              </div>
            </Card>
          );
        })}
      </div>

      <div className='flex gap-3'>
        <Button
          onClick={onBack}
          variant='outline'
          className='flex-1 h-12 rounded-full'
        >
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={selectedHabits.length === 0}
          className='flex-1 h-12 bg-[#FF6B35] hover:bg-[#FF6B35]/90 rounded-full'
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
