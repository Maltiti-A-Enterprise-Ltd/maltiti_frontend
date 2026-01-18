'use client';

import { JSX, useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { MapPin, Globe, Mail, User } from 'lucide-react';
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

const guestLocationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.email('Please enter a valid email address'),
  country: z.string().min(1, 'Country is required'),
  region: z.string().min(1, 'Region/State is required'),
  city: z.string().min(1, 'City is required'),
  phoneNumber: phoneSchema,
  extraInfo: z.string().optional(),
});

export type GuestLocationFormValues = z.infer<typeof guestLocationSchema>;

type GuestLocationFormProps = {
  onSubmit: (data: GuestLocationFormValues) => void;
  onReset?: () => void;
};

const GuestLocationForm = ({ onSubmit, onReset }: GuestLocationFormProps): JSX.Element => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('');

  const form = useForm<GuestLocationFormValues>({
    resolver: zodResolver(guestLocationSchema),
    defaultValues: {
      name: '',
      email: '',
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

  const handleSubmit = (data: GuestLocationFormValues): void => {
    setIsSubmitted(true);
    onSubmit(data);
  };

  const resetSubmission = (): void => {
    setIsSubmitted(false);
    onReset?.();
  };

  useEffect(() => {
    if (isSubmitted) {
      const subscription = form.watch((value) => {
        if (form.formState.isValid) {
          onSubmit(value as GuestLocationFormValues);
        }
      });
      return (): void => subscription.unsubscribe();
    }
  }, [isSubmitted, form, onSubmit]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Guest Information Section */}
        <div className="space-y-4 rounded-lg bg-blue-50/50 p-4">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <User className="h-4 w-4" />
            Your Information
          </h3>

          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      type="email"
                      placeholder="your.email@example.com"
                      className="pl-10"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  We&apos;ll send your order confirmation and tracking link here
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Delivery Location Section */}
        <div className="space-y-4">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <MapPin className="h-4 w-4" />
            Delivery Location
          </h3>

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

          {/* Region/State */}
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
                      form.setValue('city', '');

                      if (isSubmitted) {
                        resetSubmission();
                      }
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
                      onChange={(e) => {
                        field.onChange(e);
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
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      if (isSubmitted) {
                        resetSubmission();
                      }
                    }}
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
                        onChange={(e) => {
                          field.onChange(e);
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

          {/* Phone Number */}
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
        </div>

        {!isSubmitted && (
          <Button type="submit" className="w-full" disabled={!form.formState.isValid}>
            Confirm Delivery Information
          </Button>
        )}

        {isSubmitted && (
          <div className="rounded-lg bg-green-50 p-4 text-center">
            <p className="text-sm font-medium text-green-800">
              ✓ Delivery information confirmed. Proceed to payment when ready.
            </p>
          </div>
        )}
      </form>
    </Form>
  );
};

export default GuestLocationForm;
