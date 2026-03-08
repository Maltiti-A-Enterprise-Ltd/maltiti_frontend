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

export const formatPrice = (amount: number | null | undefined): string => {
  if (!amount) {
    return 'Pending';
  }
  return `GHS ${Number(amount).toFixed(2)}`;
};
