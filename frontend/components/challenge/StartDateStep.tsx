"use client";

import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { START_DATE_OPTIONS } from "@/lib/constants";

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
  const [customDate, setCustomDate] = useState("");

  // Today's date in YYYY-MM-DD (for min attribute)
  const today = new Date().toISOString().split("T")[0];

  const isCustomSelected = selectedStartDate === "custom";
  const isValid =
    selectedStartDate &&
    (!isCustomSelected || (customDate && customDate > today));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">When to Start?</h2>
        <p className="text-muted-foreground">
          Choose when the challenge begins
        </p>
      </div>

      <RadioGroup
        value={selectedStartDate}
        onValueChange={(value) => {
          onSelect(value);
          if (value !== "custom") setCustomDate("");
        }}
        className="space-y-3"
      >
        {START_DATE_OPTIONS.map((option) => (
          <div
            key={option.value}
            className="flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer hover:bg-accent transition-colors"
          >
            <RadioGroupItem value={option.value} id={option.value} />
            <Label htmlFor={option.value} className="flex-1 cursor-pointer">
              <div className="font-medium">{option.label}</div>

              {option.value === "today" && (
                <div className="text-xs text-muted-foreground">
                  Challenge begins immediately
                </div>
              )}

              {option.value === "tomorrow" && (
                <div className="text-xs text-muted-foreground">
                  Give everyone time to prepare
                </div>
              )}

              {option.value === "custom" && (
                <div className="text-xs text-muted-foreground">
                  Pick a future date
                </div>
              )}
            </Label>
          </div>
        ))}
      </RadioGroup>

      {/* Custom date picker */}
      {isCustomSelected && (
        <div className="space-y-2">
          <Label htmlFor="custom-date">Select start date</Label>
          <input
            id="custom-date"
            type="date"
            min={today}
            value={customDate}
            onChange={(e) => setCustomDate(e.target.value)}
            className="w-full h-12 rounded-lg border px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
          />
          <p className="text-xs text-muted-foreground">
            Date must be in the future
          </p>
        </div>
      )}

      <div className="flex gap-3">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex-1 h-12 rounded-full"
        >
          Back
        </Button>

        <Button
          onClick={() => {
            if (isCustomSelected) {
              onSelect(customDate);
            }
            onNext();
          }}
          disabled={!isValid}
          className="flex-1 h-12 bg-[#FF6B35] hover:bg-[#FF6B35]/90 rounded-full"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
