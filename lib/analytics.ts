import type { ProductResponseDto, CartProductDto, SaleDto } from '@/app/api';

export const GA_MEASUREMENT_ID = 'G-FK565TFXKJ';
export const BRAND_NAME = 'Maltiti A. Enterprise';
export const CURRENCY = 'GHS';

// ─── GA4 Item Schema ──────────────────────────────────────────────────────────

export type GA4ProductItem = {
  item_id: string;
  item_name: string;
  item_category: string;
  price: number;
  quantity: number;
  item_brand: string;
  item_variant?: string;
  discount?: number;
};

// ─── Typed GA4 event param shapes ────────────────────────────────────────────

export type GA4ViewItemParams = {
  currency: string;
  value: number;
  items: GA4ProductItem[];
};

export type GA4AddToCartParams = {
  currency: string;
  value: number;
  items: GA4ProductItem[];
};

export type GA4PurchaseParams = {
  transaction_id: string;
  value: number;
  currency: string;
  shipping: number;
  tax: number;
  items: GA4ProductItem[];
};

export type GA4ContactFormParams = {
  event_category: string;
  event_label: string;
  user_type: 'authenticated' | 'guest';
};

// ─── Price strategy ───────────────────────────────────────────────────────────

export type PriceType = 'retail' | 'wholesale';

// ─── GTagConsentMode ─────────────────────────────────────────────────────────

export type GTagConsentMode = {
  analytics_storage: 'granted' | 'denied';
  ad_storage: 'granted' | 'denied';
  ad_user_data: 'granted' | 'denied';
  ad_personalization: 'granted' | 'denied';
};

// ─── Internal param union (avoids `any`) ─────────────────────────────────────

type GTagParamValue = string | number | boolean | undefined | GA4ProductItem[];

// ─── Generic manual event type ────────────────────────────────────────────────

export type GTagEvent = {
  action: string;
  category: string;
  label?: string;
  value?: number;
  [key: string]: GTagParamValue;
};

// ─── Window gtag declaration ──────────────────────────────────────────────────

declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'consent' | 'set',
      targetIdOrAction: string | Date,
      params?: Record<string, GTagParamValue>,
    ) => void;
    dataLayer: Record<string, unknown>[];
  }
}

// ─── Core helpers ─────────────────────────────────────────────────────────────

/** Returns true when gtag is available on the window object. */
export function isGtagReady(): boolean {
  return globalThis.window !== undefined && typeof globalThis.window.gtag === 'function';
}

/**
 * Sends a page_view event to GA4.
 * Called automatically by AnalyticsTracker on every App Router navigation.
 */
export function trackPageView(url: string): void {
  if (!isGtagReady()) {
    return;
  }
  globalThis.window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  });
}

/**
 * Low-level generic event helper.
 * Prefer the domain-specific helpers below for e-commerce events.
 */
export function trackEvent({ action, category, label, value, ...rest }: GTagEvent): void {
  if (!isGtagReady()) {
    return;
  }
  globalThis.window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
    ...rest,
  });
}

/**
 * Updates GA4 Consent Mode in real-time.
 * Called by GoogleAnalytics component when the user changes cookie preferences.
 */
export function updateGtagConsent(granted: boolean): void {
  if (!isGtagReady()) {
    return;
  }
  const consentValue: 'granted' | 'denied' = granted ? 'granted' : 'denied';
  globalThis.window.gtag('consent', 'update', {
    analytics_storage: consentValue,
    ad_storage: consentValue,
    ad_user_data: consentValue,
    ad_personalization: consentValue,
  });
}

/**
 * Returns the GDPR-friendly default-deny consent string.
 * Inlined as a <script> before gtag.js loads.
 */
export function getConsentInitScript(): string {
  return `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      wait_for_update: 500
    });
  `.trim();
}

// ─── Internal factory ─────────────────────────────────────────────────────────

function buildGA4Item(
  product: ProductResponseDto | CartProductDto,
  quantity: number,
  priceType: PriceType,
): GA4ProductItem {
  const price = priceType === 'wholesale' ? product.wholesale : product.retail;
  return {
    item_id: product.id,
    item_name: product.name,
    item_category: String(product.category),
    price,
    quantity,
    item_brand: BRAND_NAME,
  };
}

// ─── E-commerce event trackers ────────────────────────────────────────────────

/**
 * GA4 `view_item` — fire when a product detail page is viewed.
 *
 * @param product  Full product response from the API.
 * @param priceType  Which price to report to GA4 ('retail' by default).
 */
export function trackProductView(
  product: ProductResponseDto,
  priceType: PriceType = 'retail',
): void {
  if (!isGtagReady()) {
    return;
  }
  const item = buildGA4Item(product, 1, priceType);
  globalThis.window.gtag('event', 'view_item', {
    currency: CURRENCY,
    value: item.price,
    items: [item],
  });
}

/**
 * GA4 `add_to_cart` — fire when a product is added to the cart.
 *
 * @param product   Full product or cart-product DTO.
 * @param quantity  Number of units added.
 * @param priceType  Which price to report to GA4 ('retail' by default).
 */
export function trackAddToCart(
  product: ProductResponseDto | CartProductDto,
  quantity: number,
  priceType: PriceType = 'retail',
): void {
  if (!isGtagReady()) {
    return;
  }
  const item = buildGA4Item(product, quantity, priceType);
  globalThis.window.gtag('event', 'add_to_cart', {
    currency: CURRENCY,
    value: item.price * quantity,
    items: [item],
  });
}

/**
 * GA4 `purchase` — fire exactly once after payment is confirmed.
 * Accepts the `SaleDto` returned by the checkout confirm-payment endpoints.
 *
 * @param sale  Sale object from CheckoutResponseDto.data.sale.
 */
export function trackPurchase(sale: SaleDto): void {
  if (!isGtagReady()) {
    return;
  }
  const items: GA4ProductItem[] = sale.lineItems.map((lineItem) => ({
    item_id: lineItem.productId,
    item_name: lineItem.productId, // productName not returned by this endpoint
    item_category: 'Product',
    price: lineItem.finalPrice,
    quantity: lineItem.requestedQuantity,
    item_brand: BRAND_NAME,
  }));
  globalThis.window.gtag('event', 'purchase', {
    transaction_id: sale.id,
    value: sale.total ?? sale.amount ?? 0,
    currency: CURRENCY,
    shipping: sale.deliveryFee ?? 0,
    tax: sale.serviceFee ?? 0,
    items,
  });
}

/**
 * Custom GA4 event for contact form submissions.
 *
 * @param options.subject          Form subject or inquiry type (optional).
 * @param options.isAuthenticated  Whether the user is logged in (optional).
 */
export function trackContactFormSubmit(options?: {
  subject?: string;
  isAuthenticated?: boolean;
}): void {
  if (!isGtagReady()) {
    return;
  }
  globalThis.window.gtag('event', 'contact_form_submit', {
    event_category: 'engagement',
    event_label: options?.subject ?? 'general_inquiry',
    user_type: options?.isAuthenticated ? 'authenticated' : 'guest',
  });
}
