"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DURATION_OPTIONS } from "@/lib/constants";

interface DurationStepProps {
  selectedDuration: number | null;
  onSelect: (duration: number) => void;
  onNext: () => void;
}

export function DurationStep({
  selectedDuration,
  onSelect,
  onNext,
}: DurationStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Choose Duration</h2>
        <p className="text-muted-foreground">
          How long will the challenge last?
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {DURATION_OPTIONS.map((option) => (
          <Card
            key={option.value}
            className={`p-8 cursor-pointer transition-all hover:shadow-md ${
              selectedDuration === option.value
                ? "border-2 border-primary bg-primary/5"
                : "border-2 border-transparent"
            }`}
            onClick={() => onSelect(option.value)}
          >
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{option.value}</div>
              <div className="text-sm text-muted-foreground">
                {option.label.split(" ")[1]}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <div className="text-center">
          <p className="text-sm font-medium mb-2">Custom Duration</p>
          <p className="text-xs text-muted-foreground">
            Choose custom duration for challenge
          </p>
        </div>
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              if (selectedDuration && selectedDuration > 1) {
                onSelect(selectedDuration - 1);
              }
            }}
            className="h-12 w-12 rounded-full"
          >
            -
          </Button>
          <div className="text-center min-w-[80px]">
            <div className="text-3xl font-bold">{selectedDuration || 0}</div>
            <div className="text-xs text-muted-foreground">Days</div>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              onSelect((selectedDuration || 0) + 1);
            }}
            className="h-12 w-12 rounded-full"
          >
            +
          </Button>
        </div>
      </div>

      <Button
        onClick={onNext}
        disabled={!selectedDuration}
        className="w-full h-12 bg-[#FF6B35] hover:bg-[#FF6B35]/90 rounded-full"
      >
        Continue
      </Button>
    </div>
  );
}
