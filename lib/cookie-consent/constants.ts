import { CookieCategoryInfo } from './types';
export const CONSENT_STORAGE_KEY = 'maltiti_cookie_consent';
export const CONSENT_EXPIRY_DURATION = 365 * 24 * 60 * 60 * 1000;
export const COOKIE_CATEGORIES: CookieCategoryInfo[] = [
  {
    id: 'necessary',
    title: 'Strictly Necessary Cookies',
    description:
      'These cookies are essential for the website to function properly. They enable core functionality such as authentication, shopping cart management, and security features. These cookies cannot be disabled.',
    required: true,
    examples: [
      'Authentication tokens',
      'Shopping cart data',
      'Security preferences',
      'Session management',
    ],
  },
  {
    id: 'analytics',
    title: 'Analytics Cookies',
    description:
      'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our website performance and user experience.',
    required: false,
    examples: [
      'Page views',
      'User behavior analysis',
      'Traffic sources',
      'Site performance metrics',
    ],
  },
  {
    id: 'marketing',
    title: 'Marketing / Advertising Cookies',
    description:
      'These cookies are used to track visitors across websites to display relevant advertisements and promotions. They help us measure the effectiveness of our marketing campaigns.',
    required: false,
    examples: [
      'Retargeting ads',
      'Social media integration',
      'Promotional campaigns',
      'Conversion tracking',
    ],
  },
  {
    id: 'preferences',
    title: 'Preference Cookies',
    description:
      'These cookies allow the website to remember your choices (such as language, region, or display preferences) to provide a more personalized experience.',
    required: false,
    examples: ['Language preferences', 'Regional settings', 'Display preferences', 'Theme choices'],
  },
];
