import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines multiple class names into a single string
 * @param inputs
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Generates a UUID (Universally Unique Identifier) in the format `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`.
 * This function uses random values to generate a unique identifier.
 *
 * @returns {string} A randomly generated UUID.
 */
export const generateUUID = (): string =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replaceAll(/[xy]/g, (char) => {
    const random = Math.trunc(Math.random() * 16);
    const value = char === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });

/**
 * Creates a debounced function that delays invoking the provided function
 * until after the specified delay has elapsed since the last time it was invoked.
 *
 * @template T - The type of the function to debounce
 * @param {T} func - The function to debounce
 * @param {number} delay - The delay in milliseconds
 * @returns {(...args: Parameters<T>) => void} A debounced version of the function
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>): void => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

/**
 * Extracts the error message from an error object or returns a fallback message if the error is not an Error instance.
 * @param error - The error object, which could be of any type.
 * @param fallBackMessage - The message to return if the error is not an Error instance.
 * @returns The error message or the fallback message.
 */
export function getErrorMessage(error: unknown, fallBackMessage: string): string {
  return error instanceof Error ? error.message : fallBackMessage;
}
