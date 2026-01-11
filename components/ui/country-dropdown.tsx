'use client';

import * as React from 'react';
import { ChevronsUpDown, Check } from 'lucide-react';
import { Country } from 'country-state-city';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { polyfillCountryFlagEmojis } from 'country-flag-emoji-polyfill';

type CountryDropdownProps = {
  value?: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
};

const CountryDropdown = ({
  value,
  onValueChange,
  disabled,
  placeholder = 'Select country...',
}: CountryDropdownProps): React.JSX.Element => {
  polyfillCountryFlagEmojis();
  const [open, setOpen] = React.useState(false);

  const countries = React.useMemo(
    () =>
      Country.getAllCountries().map((country) => ({
        value: country.name,
        label: country.name,
        flag: country.flag,
        isoCode: country.isoCode,
      })),
    [],
  );

  const selectedCountry = countries.find((country) => country.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn('w-full justify-between', !value && 'text-muted-foreground')}
        >
          {selectedCountry ? (
            <span className="flex items-center gap-2">
              <span className="emoji-flag text-lg">{selectedCountry.flag}</span>
              <span>{selectedCountry.label}</span>
            </span>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Search country..." className="h-9" />
          <CommandList>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {countries.map((country) => (
                <CommandItem
                  key={country.isoCode}
                  value={country.value}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? '' : currentValue);
                    setOpen(false);
                  }}
                >
                  <span className="flex items-center gap-2">
                    <span className="emoji-flag text-lg">{country.flag}</span>
                    <span>{country.label}</span>
                  </span>
                  <Check
                    className={cn(
                      'ml-auto h-4 w-4',
                      value === country.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CountryDropdown;
