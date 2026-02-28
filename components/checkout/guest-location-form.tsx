'use client';

import { JSX, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, User, MapPin } from 'lucide-react';
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
import { phoneSchema } from '@/components/ui/phone-input';
import { useLocationForm } from '@/lib/hooks/useLocationForm';
import {
  CountryField,
  RegionField,
  CityField,
  PhoneField,
  ExtraInfoField,
} from '@/components/checkout/location-form-fields';

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

  const locationState = useLocationForm();

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
