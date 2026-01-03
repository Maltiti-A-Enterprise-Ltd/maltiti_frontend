import { UnitOfMeasurement } from '@/app/api';

/**
 * Maps unit of measurement to their short symbols
 */
export const unitSymbols: Record<UnitOfMeasurement, string> = {
  [UnitOfMeasurement.KILOGRAM]: 'kg',
  [UnitOfMeasurement.GRAM]: 'g',
  [UnitOfMeasurement.LITRE]: 'L',
  [UnitOfMeasurement.MILLILITRE]: 'ml',
};

/**
 * Get the symbol for a unit of measurement
 * @param unit - The unit of measurement
 * @returns The short symbol (e.g., 'kg', 'g', 'L', 'ml')
 */
export const getUnitSymbol = (unit: UnitOfMeasurement): string => unitSymbols[unit] || unit;
