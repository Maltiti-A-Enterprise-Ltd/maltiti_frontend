/**
 * Product utility functions and constants
 */

export type UnitOfMeasurement = 'kilogram' | 'gram' | 'litre' | 'millilitre';

/**
 * Maps unit of measurement to their short symbols
 */
export const unitSymbols: Record<UnitOfMeasurement, string> = {
  kilogram: 'kg',
  gram: 'g',
  litre: 'L',
  millilitre: 'ml',
};

/**
 * Get the symbol for a unit of measurement
 * @param unit - The unit of measurement
 * @returns The short symbol (e.g., 'kg', 'g', 'L', 'ml')
 */
export const getUnitSymbol = (unit: UnitOfMeasurement): string => unitSymbols[unit] || unit;
