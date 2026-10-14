/**
 * Showing an order's money in the currency it was actually agreed in.
 *
 * Nearly every order is in cedis and nothing here changes how those look.
 * But Maltiti exports, and an export is negotiated in the buyer's own money —
 * the amounts on such an order are stored in that money. A page that hardcodes
 * "GHS" against them does not get the figure wrong, it gets the *label* wrong,
 * and five thousand of the wrong currency reads as entirely plausible.
 *
 * This is the customer-facing side of it, so getting it wrong is worse here
 * than on an internal screen.
 */

/** What the business banks in, and what every order used to be. */
const BASE_CURRENCY = 'GHS';

/** Enough of an order to know what its money is. */
type WithCurrency = {
  currency?: string | null;
};

/** The currency an order's amounts are in. Cedis for anything unset. */
export const orderCurrency = (order: WithCurrency | null | undefined): string =>
  order?.currency?.trim() || BASE_CURRENCY;

/**
 * An amount with the order's currency in front of it, e.g. `"CAD 5,000.00"`.
 *
 * Always two decimals, so a column of figures lines up.
 */
export const formatOrderAmount = (
  amount: number | string | null | undefined,
  order: WithCurrency | null | undefined,
): string => {
  const value = Number(amount);

  return `${orderCurrency(order)} ${(Number.isFinite(value) ? value : 0).toFixed(2)}`;
};
