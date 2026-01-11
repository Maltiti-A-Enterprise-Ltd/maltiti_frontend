'use client';

import { JSX, useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { MapPin, Globe } from 'lucide-react';
import { Country, State, City } from 'country-state-city';
import { lookup } from 'country-data-list';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import CountryDropdown from '@/components/ui/country-dropdown';
import { PhoneInput, phoneSchema } from '@/components/ui/phone-input';

const locationSchema = z.object({
  country: z.string().min(1, 'Country is required'),
  region: z.string().min(1, 'Region/State is required'),
  city: z.string().min(1, 'City is required'),
  phoneNumber: phoneSchema,
  extraInfo: z.string().optional(),
});

type LocationFormValues = z.infer<typeof locationSchema>;

type LocationFormProps = {
  onSubmit: (data: LocationFormValues) => void;
};

const LocationForm = ({ onSubmit }: LocationFormProps): JSX.Element => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('');

  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      country: '',
      region: '',
      city: '',
      phoneNumber: '',
      extraInfo: '',
    },
    mode: 'onTouched',
  });

  const countryIsoCode = useMemo(() => {
    if (!selectedCountry) {
      return '';
    }
    const country = Country.getAllCountries().find((c) => c.name === selectedCountry);
    return country?.isoCode || '';
  }, [selectedCountry]);

  const states = useMemo(() => {
    if (!countryIsoCode) {
      return [];
    }
    return State.getStatesOfCountry(countryIsoCode);
  }, [countryIsoCode]);

  const stateIsoCode = useMemo(() => {
    if (!selectedState || !countryIsoCode) {
      return '';
    }
    const state = states.find((s) => s.name === selectedState);
    return state?.isoCode || '';
  }, [selectedState, countryIsoCode, states]);

  const cities = useMemo(() => {
    if (!countryIsoCode || !stateIsoCode) {
      return [];
    }
    return City.getCitiesOfState(countryIsoCode, stateIsoCode);
  }, [countryIsoCode, stateIsoCode]);

  const handleSubmit = (data: LocationFormValues): void => {
    setIsSubmitted(true);
    onSubmit(data);
  };

  useEffect(() => {
    if (isSubmitted) {
      const subscription = form.watch((value) => {
        if (form.formState.isValid) {
          onSubmit(value as LocationFormValues);
        }
      });
      return (): void => subscription.unsubscribe();
    }
  }, [isSubmitted, form, onSubmit]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Country */}
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <CountryDropdown
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    setSelectedCountry(value);
                    form.setValue('region', '');
                    form.setValue('city', '');
                    setSelectedState('');

                    // Get country calling code and reset phone number
                    const country = Country.getAllCountries().find((c) => c.name === value);
                    if (country?.isoCode) {
                      const countryInfo = lookup.countries({
                        alpha2: country.isoCode.toLowerCase(),
                      })[0];
                      if (countryInfo?.countryCallingCodes?.[0]) {
                        form.setValue('phoneNumber', countryInfo.countryCallingCodes[0]);
                      } else {
                        form.setValue('phoneNumber', '');
                      }
                    } else {
                      form.setValue('phoneNumber', '');
                    }
                  }}
                  placeholder="Select your country"
                />
              </FormControl>
              <FormDescription className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                We ship worldwide, including bulk export orders
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="region"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Region / State / Province</FormLabel>
              {states.length > 0 ? (
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    setSelectedState(value);
                    // Reset city when state changes
                    form.setValue('city', '');
                  }}
                  value={field.value}
                  disabled={!selectedCountry}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select region/state" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="max-h-75">
                    {states.map((state) => (
                      <SelectItem key={state.isoCode} value={state.name}>
                        {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <FormControl>
                  <Input
                    placeholder="e.g., Greater Accra, California, Ontario"
                    {...field}
                    disabled={!selectedCountry}
                  />
                </FormControl>
              )}
              <FormDescription>
                {!selectedCountry
                  ? 'Please select a country first'
                  : states.length > 0
                    ? 'Select your region or state'
                    : 'Enter your region, state, or province'}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* City */}
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City / Town</FormLabel>
              {cities.length > 0 ? (
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={!selectedState}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select city/town" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="max-h-75">
                    {cities.map((city) => (
                      <SelectItem key={city.name} value={city.name}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <FormControl>
                  <div className="relative">
                    <MapPin className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="e.g., Accra, New York, London"
                      className="pl-10"
                      {...field}
                      disabled={!selectedCountry}
                    />
                  </div>
                </FormControl>
              )}
              <FormDescription>
                {!selectedCountry
                  ? 'Please select a country first'
                  : cities.length > 0
                    ? 'Select your city or town'
                    : 'Enter your city or town name'}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Phone Number</FormLabel>
              <FormControl>
                <PhoneInput
                  {...field}
                  defaultCountry={countryIsoCode || undefined}
                  placeholder="Enter phone number"
                />
              </FormControl>
              <FormDescription>
                Include country code for international deliveries (e.g., +233241234567)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Extra Info */}
        <FormField
          control={form.control}
          name="extraInfo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Information (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Street address, house number, landmarks, special delivery instructions..."
                  className="resize-none"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide complete address details for accurate delivery
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {!isSubmitted && (
          <Button type="submit" className="w-full" disabled={!form.formState.isValid}>
            Confirm Delivery Location
          </Button>
        )}

        {isSubmitted && (
          <div className="rounded-lg bg-green-50 p-4 text-center">
            <p className="text-sm font-medium text-green-800">
              ✓ Delivery location confirmed. Proceed to payment when ready.
            </p>
          </div>
        )}
      </form>
    </Form>
  );
};

export default LocationForm;
