import { JSX } from 'react';
import { Control, FieldValues, Path, UseFormSetValue } from 'react-hook-form';
import { MapPin, Globe } from 'lucide-react';
import { Country } from 'country-state-city';
import { lookup } from 'country-data-list';
import {
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
import { PhoneInput } from '@/components/ui/phone-input';
import { UseLocationFormReturn } from '@/lib/hooks/useLocationForm';

type BaseFormFieldProps<T extends FieldValues> = {
  control: Control<T>;
  isSubmitted: boolean;
  onResetSubmission: () => void;
};

type CountryFieldProps<T extends FieldValues> = BaseFormFieldProps<T> & {
  locationState: UseLocationFormReturn;
  setValue: UseFormSetValue<T>;
  countryFieldName: Path<T>;
  regionFieldName: Path<T>;
  cityFieldName: Path<T>;
  phoneFieldName: Path<T>;
};

export const CountryField = <T extends FieldValues>({
  control,
  locationState,
  setValue,
  isSubmitted,
  onResetSubmission,
  countryFieldName,
  regionFieldName,
  cityFieldName,
  phoneFieldName,
}: CountryFieldProps<T>): JSX.Element => {
  const handleCountryChange = (value: string): void => {
    locationState.setSelectedCountry(value);
    setValue(regionFieldName, '' as T[Path<T>]);
    setValue(cityFieldName, '' as T[Path<T>]);
    locationState.setSelectedState('');

    // Get country calling code and reset phone number
    const country = Country.getAllCountries().find((c) => c.name === value);
    if (country?.isoCode) {
      const countryInfo = lookup.countries({
        alpha2: country.isoCode.toLowerCase(),
      })[0];
      if (countryInfo?.countryCallingCodes?.[0]) {
        setValue(phoneFieldName, countryInfo.countryCallingCodes[0] as T[Path<T>]);
      } else {
        setValue(phoneFieldName, '' as T[Path<T>]);
      }
    } else {
      setValue(phoneFieldName, '' as T[Path<T>]);
    }

    if (isSubmitted) {
      onResetSubmission();
    }
  };

  return (
    <FormField
      control={control}
      name={countryFieldName}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Country</FormLabel>
          <FormControl>
            <CountryDropdown
              value={field.value as string}
              onValueChange={(value) => {
                field.onChange(value);
                handleCountryChange(value);
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
  );
};

type RegionFieldProps<T extends FieldValues> = BaseFormFieldProps<T> & {
  locationState: UseLocationFormReturn;
  setValue: UseFormSetValue<T>;
  regionFieldName: Path<T>;
  cityFieldName: Path<T>;
};

export const RegionField = <T extends FieldValues>({
  control,
  locationState,
  setValue,
  isSubmitted,
  onResetSubmission,
  regionFieldName,
  cityFieldName,
}: RegionFieldProps<T>): JSX.Element => {
  const handleRegionChange = (value: string): void => {
    locationState.setSelectedState(value);
    setValue(cityFieldName, '' as T[Path<T>]);

    if (isSubmitted) {
      onResetSubmission();
    }
  };

  const getRegionDescription = (): string => {
    if (!locationState.selectedCountry) {
      return 'Please select a country first';
    }

    if (locationState.states.length > 0) {
      return 'Select your region or state';
    }

    return 'Enter your region, state, or province';
  };

  return (
    <FormField
      control={control}
      name={regionFieldName}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Region / State / Province</FormLabel>
          {locationState.states.length > 0 ? (
            <FormControl>
              <SelectDropdown
                options={locationState.states.map((state) => ({
                  label: state.name,
                  value: state.name,
                }))}
                placeholder="Select region/state"
                value={field.value as string}
                onValueChange={(value) => {
                  field.onChange(value);
                  handleRegionChange(value);
                }}
                disabled={!locationState.selectedCountry}
              />
            </FormControl>
          ) : (
            <FormControl>
              <Input
                placeholder="e.g., Greater Accra, California, Ontario"
                {...field}
                value={field.value as string}
                onChange={(e) => {
                  field.onChange(e);
                  if (isSubmitted) {
                    onResetSubmission();
                  }
                }}
                disabled={!locationState.selectedCountry}
              />
            </FormControl>
          )}
          <FormDescription>{getRegionDescription()}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

type CityFieldProps<T extends FieldValues> = BaseFormFieldProps<T> & {
  locationState: UseLocationFormReturn;
  cityFieldName: Path<T>;
};

export const CityField = <T extends FieldValues>({
  control,
  locationState,
  isSubmitted,
  onResetSubmission,
  cityFieldName,
}: CityFieldProps<T>): JSX.Element => {
  const handleCityChange = (): void => {
    if (isSubmitted) {
      onResetSubmission();
    }
  };

  const getCityDescription = (): string => {
    if (!locationState.selectedCountry) {
      return 'Please select a country first';
    }

    if (locationState.cities.length > 0) {
      return 'Select your city or town';
    }

    return 'Enter your city or town name';
  };

  return (
    <FormField
      control={control}
      name={cityFieldName}
      render={({ field }) => (
        <FormItem>
          <FormLabel>City / Town</FormLabel>
          {locationState.cities.length > 0 ? (
            <FormControl>
              <SelectDropdown
                options={locationState.cities.map((city) => ({
                  label: city.name,
                  value: city.name,
                }))}
                placeholder="Select city/town"
                value={field.value as string}
                onValueChange={(value) => {
                  field.onChange(value);
                  handleCityChange();
                }}
                disabled={!locationState.selectedState}
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
                  value={field.value as string}
                  onChange={(e) => {
                    field.onChange(e);
                    handleCityChange();
                  }}
                  disabled={!locationState.selectedCountry}
                />
              </div>
            </FormControl>
          )}
          <FormDescription>{getCityDescription()}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

type PhoneFieldProps<T extends FieldValues> = {
  control: Control<T>;
  phoneFieldName: Path<T>;
  countryIsoCode: string;
};

export const PhoneField = <T extends FieldValues>({
  control,
  phoneFieldName,
  countryIsoCode,
}: PhoneFieldProps<T>): JSX.Element => (
  <FormField
    control={control}
    name={phoneFieldName}
    render={({ field }) => (
      <FormItem>
        <FormLabel>Contact Phone Number</FormLabel>
        <FormControl>
          <PhoneInput
            {...field}
            value={field.value as string}
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
);

type ExtraInfoFieldProps<T extends FieldValues> = {
  control: Control<T>;
  extraInfoFieldName: Path<T>;
};

export const ExtraInfoField = <T extends FieldValues>({
  control,
  extraInfoFieldName,
}: ExtraInfoFieldProps<T>): JSX.Element => (
  <FormField
    control={control}
    name={extraInfoFieldName}
    render={({ field }) => (
      <FormItem>
        <FormLabel>Additional Information (Optional)</FormLabel>
        <FormControl>
          <Textarea
            placeholder="Street address, house number, landmarks, special delivery instructions..."
            className="resize-none"
            rows={4}
            {...field}
            value={field.value as string}
          />
        </FormControl>
        <FormDescription>Provide complete address details for accurate delivery</FormDescription>
        <FormMessage />
      </FormItem>
    )}
  />
);
