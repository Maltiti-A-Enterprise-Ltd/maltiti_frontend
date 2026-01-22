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
import { SelectDropdown } from '@/components/ui/select';
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
  onReset?: () => void;
  initialData?: Partial<LocationFormValues>;
  isLoading?: boolean;
};

const LocationForm = ({
  onSubmit,
  onReset,
  initialData,
  isLoading = false,
}: LocationFormProps): JSX.Element => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>(initialData?.country || '');
  const [selectedState, setSelectedState] = useState<string>(initialData?.region || '');

  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      country: initialData?.country || '',
      region: initialData?.region || '',
      city: initialData?.city || '',
      phoneNumber: initialData?.phoneNumber || '',
      extraInfo: initialData?.extraInfo || '',
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

  const resetSubmission = (): void => {
    setIsSubmitted(false);
    onReset?.();
  };

  // Update form values when initialData changes
  useEffect(() => {
    if (initialData) {
      if (initialData.country) {
        form.setValue('country', initialData.country);
        setSelectedCountry(initialData.country);
      }
      if (initialData.region) {
        form.setValue('region', initialData.region);
        setSelectedState(initialData.region);
      }
      if (initialData.city) {
        form.setValue('city', initialData.city);
      }
      if (initialData.phoneNumber) {
        form.setValue('phoneNumber', initialData.phoneNumber);
      }
      if (initialData.extraInfo) {
        form.setValue('extraInfo', initialData.extraInfo);
      }
    }
  }, [initialData, form]);

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
        {/* Show info message if data was prefilled */}
        {initialData && Object.keys(initialData).length > 0 && (
          <div className="rounded-lg bg-blue-50 p-4">
            <p className="text-sm font-medium text-blue-900">
              ✓ Your details have been prefilled from your previous order
            </p>
            <p className="mt-1 text-xs text-blue-700">
              You can review and update any information before proceeding
            </p>
          </div>
        )}

        {/* Show loading state */}
        {isLoading && (
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-gray-600">Loading your information...</p>
          </div>
        )}

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

                    // Reset confirmation if location fields change
                    if (isSubmitted) {
                      resetSubmission();
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
                <FormControl>
                  <SelectDropdown
                    options={states.map((state) => ({ label: state.name, value: state.name }))}
                    placeholder="Select region/state"
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedState(value);
                      // Reset city when state changes
                      form.setValue('city', '');
                      // Reset confirmation if location fields change
                      if (isSubmitted) {
                        resetSubmission();
                      }
                    }}
                    disabled={!selectedCountry}
                  />
                </FormControl>
              ) : (
                <FormControl>
                  <Input
                    placeholder="e.g., Greater Accra, California, Ontario"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);

                      // Reset confirmation if location fields change
                      if (isSubmitted) {
                        resetSubmission();
                      }
                    }}
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
                <FormControl>
                  <SelectDropdown
                    options={cities.map((city) => ({ label: city.name, value: city.name }))}
                    placeholder="Select city/town"
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      // Reset confirmation if location fields change
                      if (isSubmitted) {
                        resetSubmission();
                      }
                    }}
                    disabled={!selectedState}
                  />
                </FormControl>
              ) : (
                <FormControl>
                  <div className="relative">
                    <MapPin className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="e.g., Accra, New York, London"
                      className="pl-10"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);

                        // Reset confirmation if location fields change
                        if (isSubmitted) {
                          resetSubmission();
                        }
                      }}
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
