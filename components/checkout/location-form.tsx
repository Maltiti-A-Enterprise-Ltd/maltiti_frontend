'use client';

import { JSX, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { phoneSchema } from '@/components/ui/phone-input';
import { useLocationForm } from '@/lib/hooks/useLocationForm';
import {
  CountryField,
  RegionField,
  CityField,
  PhoneField,
  ExtraInfoField,
} from '@/components/checkout/location-form-fields';

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

  const locationState = useLocationForm(initialData?.country || '', initialData?.region || '');

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
        form.setValue('country', initialData.country, { shouldValidate: true });
        locationState.setSelectedCountry(initialData.country);
      }
      if (initialData.region) {
        form.setValue('region', initialData.region, { shouldValidate: true });
        locationState.setSelectedState(initialData.region);
      }
      if (initialData.city) {
        form.setValue('city', initialData.city, { shouldValidate: true });
      }
      if (initialData.phoneNumber) {
        form.setValue('phoneNumber', initialData.phoneNumber, { shouldValidate: true });
      }
      if (initialData.extraInfo) {
        form.setValue('extraInfo', initialData.extraInfo, { shouldValidate: true });
      }
    }
  }, [initialData]);

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

        <CountryField
          control={form.control}
          locationState={locationState}
          setValue={form.setValue}
          isSubmitted={isSubmitted}
          onResetSubmission={resetSubmission}
          countryFieldName="country"
          regionFieldName="region"
          cityFieldName="city"
          phoneFieldName="phoneNumber"
        />

        <RegionField
          control={form.control}
          locationState={locationState}
          setValue={form.setValue}
          isSubmitted={isSubmitted}
          onResetSubmission={resetSubmission}
          regionFieldName="region"
          cityFieldName="city"
        />

        <CityField
          control={form.control}
          locationState={locationState}
          isSubmitted={isSubmitted}
          onResetSubmission={resetSubmission}
          cityFieldName="city"
        />

        <PhoneField
          control={form.control}
          phoneFieldName="phoneNumber"
          countryIsoCode={locationState.countryIsoCode}
        />

        <ExtraInfoField control={form.control} extraInfoFieldName="extraInfo" />

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
