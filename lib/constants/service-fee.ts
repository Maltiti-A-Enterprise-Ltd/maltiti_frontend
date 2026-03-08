/**
 * Service Processing Fee Rate
 *
 * This fee covers the cost of our secure payment infrastructure powered by Paystack.
 * It is calculated as a percentage of the order subtotal + delivery fee.
 *
 * Current rate: 1.95% (as charged by Paystack)
 */
export const SERVICE_FEE_RATE = 0.0195;

/**
 * Calculates the service processing fee for a given subtotal + delivery cost.
 * @param subtotal - Product subtotal in GHS
 * @param deliveryCost - Delivery fee in GHS (0 if not yet determined)
 */
export const calculateServiceFee = (subtotal: number, deliveryCost: number = 0): number =>
  Number.parseFloat(((subtotal + deliveryCost) * SERVICE_FEE_RATE).toFixed(2));

/**
 * Calculates the grand total including the service fee.
 * @param subtotal - Product subtotal in GHS
 * @param deliveryCost - Delivery fee in GHS (0 if not yet determined)
 */
export const calculateTotal = (subtotal: number, deliveryCost: number = 0): number => {
  const serviceFee = calculateServiceFee(subtotal, deliveryCost);
  return Number.parseFloat((subtotal + deliveryCost + serviceFee).toFixed(2));
};

export const SERVICE_FEE_TOOLTIP =
  'Secure payment processing fee is applied to keep your transactions ' +
  'protected end-to-end. This covers bank-grade encryption, fraud prevention, and ' +
  'secure payment routing — so your card details and money are always safe.';
