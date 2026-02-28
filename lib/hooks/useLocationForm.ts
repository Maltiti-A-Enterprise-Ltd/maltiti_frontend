import { useState, useMemo } from 'react';
import { Country, State, City } from 'country-state-city';

export type LocationState = {
  selectedCountry: string;
  selectedState: string;
  countryIsoCode: string;
  stateIsoCode: string;
  states: ReturnType<typeof State.getStatesOfCountry>;
  cities: ReturnType<typeof City.getCitiesOfState>;
};

export type UseLocationFormReturn = LocationState & {
  setSelectedCountry: (country: string) => void;
  setSelectedState: (state: string) => void;
  resetLocation: () => void;
};

/**
 * Hook to manage location form state (country, state/region, city)
 * Handles the country-state-city cascade selection logic
 */
export const useLocationForm = (initialCountry = '', initialState = ''): UseLocationFormReturn => {
  const [selectedCountry, setSelectedCountry] = useState<string>(initialCountry);
  const [selectedState, setSelectedState] = useState<string>(initialState);

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

  const resetLocation = (): void => {
    setSelectedCountry('');
    setSelectedState('');
  };

  return {
    selectedCountry,
    selectedState,
    countryIsoCode,
    stateIsoCode,
    states,
    cities,
    setSelectedCountry,
    setSelectedState,
    resetLocation,
  };
};
