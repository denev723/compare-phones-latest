"use client";

import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from "@/components/ui/combobox";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

type PhoneOption = { value: string; label: string };

export function PhoneCombobox({
  className,
  order,
  options,
  selectedValue,
}: {
  className?: string;
  order: "primary" | "secondary";
  options: PhoneOption[];
  selectedValue: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const defaultItem = options.find((item) => item.value === selectedValue) ?? options[0];

  return (
    <div className={cn("w-full", className)}>
      <Combobox
        items={options}
        value={defaultItem}
        onValueChange={(currentValue: PhoneOption | null) => {
          const newSearchParams = new URLSearchParams(searchParams.toString());
          if (currentValue?.value) newSearchParams.set(order, currentValue.value);
          else newSearchParams.delete(order);
          router.push(`?${newSearchParams.toString()}`);
        }}
      >
        <ComboboxTrigger
          render={
            <Button variant="outline" className="w-full justify-between font-normal">
              <ComboboxValue />
              <ChevronDownIcon className="pointer-events-none size-4 shrink-0 text-muted-foreground" />
            </Button>
          }
        />
        <ComboboxContent>
          <ComboboxInput showTrigger={false} placeholder="Search" />
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item.value || item.label} value={item}>
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}
