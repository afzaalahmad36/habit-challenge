'use client';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { CHALLENGE_MODES } from '@/lib/constants';
import { ChallengeMode } from '@/types';

interface ChallengeModeStepProps {
  selectedMode: ChallengeMode | null;
  onSelect: (mode: ChallengeMode) => void;
  onSubmit: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

export function ChallengeModeStep({
  selectedMode,
  onSelect,
  onSubmit,
  onBack,
  isLoading = false,
}: ChallengeModeStepProps) {
  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-bold mb-2'>Challenge Mode</h2>
        <p className='text-muted-foreground'>How do you want to play?</p>
      </div>

      <RadioGroup
        value={selectedMode || ''}
        onValueChange={(value) => onSelect(value as ChallengeMode)}
        className='space-y-3'
      >
        {CHALLENGE_MODES.map((mode) => (
          <Card
            key={mode.value}
            className={`cursor-pointer transition-all ${
              selectedMode === mode.value
                ? 'border-2 border-primary bg-primary/5'
                : 'border-2 border-transparent hover:border-gray-200'
            }`}
          >
            <div className='flex items-center space-x-4 p-4'>
              <RadioGroupItem value={mode.value} id={mode.value} />
              <Label htmlFor={mode.value} className='flex-1 cursor-pointer'>
                <div className='flex items-center gap-3'>
                  <span className='text-2xl'>{mode.icon}</span>
                  <div>
                    <div className='font-semibold'>{mode.label}</div>
                    <div className='text-sm text-muted-foreground'>
                      {mode.description}
                    </div>
                  </div>
                </div>
              </Label>
            </div>
          </Card>
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
          onClick={onSubmit}
          disabled={!selectedMode || isLoading}
          className='flex-1 h-12 bg-[#FF6B35] hover:bg-[#FF6B35]/90 rounded-full'
        >
          {isLoading ? 'Creating...' : 'Continue'}
        </Button>
      </div>
    </div>
  );
}
