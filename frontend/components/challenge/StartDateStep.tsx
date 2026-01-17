'use client';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { START_DATE_OPTIONS } from '@/lib/constants';

interface StartDateStepProps {
  selectedStartDate: string;
  onSelect: (date: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StartDateStep({
  selectedStartDate,
  onSelect,
  onNext,
  onBack,
}: StartDateStepProps) {
  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-bold mb-2'>When to Start?</h2>
        <p className='text-muted-foreground'>
          Choose when the challenge begins
        </p>
      </div>

      <RadioGroup
        value={selectedStartDate}
        onValueChange={onSelect}
        className='space-y-3'
      >
        {START_DATE_OPTIONS.map((option) => (
          <div
            key={option.value}
            className='flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer hover:bg-accent transition-colors'
          >
            <RadioGroupItem value={option.value} id={option.value} />
            <Label htmlFor={option.value} className='flex-1 cursor-pointer'>
              <div className='font-medium'>{option.label}</div>
              {option.value === 'today' && (
                <div className='text-xs text-muted-foreground'>
                  Challenge begins immediately
                </div>
              )}
              {option.value === 'tomorrow' && (
                <div className='text-xs text-muted-foreground'>
                  Give everyone time to prepare
                </div>
              )}
              {option.value === 'custom' && (
                <div className='text-xs text-muted-foreground'>
                  Pick a future date
                </div>
              )}
            </Label>
          </div>
        ))}
      </RadioGroup>

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
          disabled={!selectedStartDate}
          className='flex-1 h-12 bg-[#FF6B35] hover:bg-[#FF6B35]/90 rounded-full'
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
