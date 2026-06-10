"use client";

import { RadioGroup } from "@ark-ui/react/radio-group";
import { cn } from "@/lib/utils";

interface RadioGroupCardItem<T extends string> {
  value: T;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface RadioGroupCardsProps<T extends string> {
  items: RadioGroupCardItem<T>[];
  value: T;
  onValueChange: (value: T) => void;
  columns?: 2 | 3 | 4;
  className?: string;
}

const colsClass = { 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4" };

export function RadioGroupCards<T extends string>({
  items,
  value,
  onValueChange,
  columns = 2,
  className,
}: RadioGroupCardsProps<T>) {
  return (
    <RadioGroup.Root
      className={cn("grid gap-2", colsClass[columns], className)}
      value={value}
      onValueChange={(e) => onValueChange(e.value as T)}
    >
      {items.map((item) => (
        <RadioGroup.Item
          key={item.value}
          value={item.value}
          className="relative flex flex-col items-start gap-2 p-3 bg-white border border-[#e2e8f0] rounded-lg cursor-pointer hover:border-[#c4c4c4] hover:bg-slate-50 data-[state=checked]:border-foreground data-[state=checked]:bg-accent transition-all duration-150"
        >
          <div className="flex w-full justify-between items-start">
            {item.icon && (
              <item.icon className="size-4 text-muted-foreground" />
            )}
            <RadioGroup.ItemControl className="group size-4 bg-white border-2 border-[#d1d1d1] rounded-full data-[state=checked]:bg-foreground data-[state=checked]:border-foreground transition-all duration-150 flex items-center justify-center text-white ml-auto">
              <svg
                width="6"
                height="6"
                viewBox="0 0 6 6"
                fill="currentcolor"
                xmlns="http://www.w3.org/2000/svg"
                className="opacity-0 group-data-[state=checked]:opacity-100 transition-opacity"
              >
                <circle cx="3" cy="3" r="3" />
              </svg>
            </RadioGroup.ItemControl>
          </div>
          <RadioGroup.ItemText className="text-[13px] font-medium text-[#333]">
            {item.label}
          </RadioGroup.ItemText>
          <RadioGroup.ItemHiddenInput />
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  );
}
