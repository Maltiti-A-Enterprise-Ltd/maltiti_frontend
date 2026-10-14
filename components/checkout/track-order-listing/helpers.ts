import { formatOrderAmount } from '@/lib/sale-money';

export const isValidEmail = (emailToValidate: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(emailToValidate);
};

export const formatOrderDate = (date: string | Date): string =>
  new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

/**
 * An order's total, in the currency it was agreed in.
 *
 * `order` is optional only so older callers keep working; without it the
 * amount falls back to cedis, which is what every order used to be.
 */
export const formatPrice = (
  amount: number | null | undefined,
  order?: { currency?: string | null } | null,
): string => {
  if (!amount) {
    return 'Pending';
  }

  return formatOrderAmount(amount, order);
};
