export const ROUTES = {
  CHECKOUT: '/checkout',
  SHOP: '/shop',
} as const;

export type RouteKey = keyof typeof ROUTES;
