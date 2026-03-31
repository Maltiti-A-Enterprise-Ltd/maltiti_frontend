import { ProductResponseDto, ProductStatus } from '@/app/api';
import { BlogPost } from '@/lib/blog-data';

const BASE_URL = 'https://maltitiaenterprise.com';

type BreadcrumbItem = {
  name: string;
  url: string;
};

type WithContext<T extends Record<string, unknown>> = T & {
  '@context': 'https://schema.org';
};

type OrganizationSchema = WithContext<{
  '@type': 'Organization';
  name: string;
  url: string;
  logo: string;
  description: string;
  foundingLocation: string;
  sameAs: string[];
  address: {
    '@type': 'PostalAddress';
    addressCountry: string;
    addressRegion: string;
    addressLocality: string;
  };
  contactPoint: {
    '@type': 'ContactPoint';
    contactType: string;
    availableLanguage: string;
  };
}>;

type WebSiteSchema = WithContext<{
  '@type': 'WebSite';
  name: string;
  url: string;
  potentialAction: {
    '@type': 'SearchAction';
    target: {
      '@type': 'EntryPoint';
      urlTemplate: string;
    };
    'query-input': string;
  };
}>;

type ProductAvailability =
  | 'https://schema.org/InStock'
  | 'https://schema.org/OutOfStock'
  | 'https://schema.org/Discontinued';

type ProductSchema = WithContext<{
  '@type': 'Product';
  name: string;
  description: string;
  sku: string;
  image: string[];
  brand: {
    '@type': 'Brand';
    name: string;
  };
  offers: {
    '@type': 'Offer';
    priceCurrency: string;
    price: number;
    availability: ProductAvailability;
    url: string;
    seller: {
      '@type': 'Organization';
      name: string;
    };
  };
  aggregateRating?: {
    '@type': 'AggregateRating';
    ratingValue: number;
    reviewCount: number;
    bestRating: number;
    worstRating: number;
  };
}>;

type BlogPostingSchema = WithContext<{
  '@type': 'BlogPosting';
  headline: string;
  description: string;
  image: string;
  author: {
    '@type': 'Person';
    name: string;
  };
  publisher: {
    '@type': 'Organization';
    name: string;
    logo: {
      '@type': 'ImageObject';
      url: string;
    };
  };
  datePublished: string;
  dateModified: string;
  mainEntityOfPage: {
    '@type': 'WebPage';
    '@id': string;
  };
  keywords: string;
  articleSection: string;
  url: string;
}>;

type BreadcrumbListSchema = WithContext<{
  '@type': 'BreadcrumbList';
  itemListElement: {
    '@type': 'ListItem';
    position: number;
    name: string;
    item: string;
  }[];
}>;

export function getOrganizationSchema(): OrganizationSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Maltiti A. Enterprise Ltd',
    url: BASE_URL,
    logo: `${BASE_URL}/logo.svg`,
    description:
      'Authentic unrefined shea butter, essential oils, and natural products ethically produced in Northern Ghana.',
    foundingLocation: 'Northern Ghana',
    sameAs: [
      'https://www.facebook.com/maltitiaenterprise',
      'https://www.instagram.com/maltitiaenterprise',
      'https://twitter.com/maltitienterprise',
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'GH',
      addressRegion: 'Northern Region',
      addressLocality: 'Tamale',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: 'English',
    },
  };
}

export function getWebSiteSchema(): WebSiteSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Maltiti A. Enterprise Ltd',
    url: BASE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/shop?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

function mapStatusToAvailability(status: ProductStatus): ProductAvailability {
  if (status === ProductStatus.ACTIVE) {
    return 'https://schema.org/InStock';
  }
  if (status === ProductStatus.OUT_OF_STOCK) {
    return 'https://schema.org/OutOfStock';
  }
  return 'https://schema.org/Discontinued';
}

export function getProductSchema(product: ProductResponseDto): ProductSchema {
  const productUrl = `${BASE_URL}/shop/${product.id}`;
  const images = [product.image, ...(product.images ?? [])].filter(Boolean);

  const schema: ProductSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description:
      product.description ||
      `Premium ${product.category.replaceAll('_', ' ')} from Northern Ghana by Maltiti A. Enterprise Ltd.`,
    sku: product.sku,
    image: images.length > 0 ? images : [`${BASE_URL}/placeholder-product.svg`],
    brand: {
      '@type': 'Brand',
      name: 'Maltiti A. Enterprise Ltd',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'GHS',
      price: product.retail,
      availability: mapStatusToAvailability(product.status),
      url: productUrl,
      seller: {
        '@type': 'Organization',
        name: 'Maltiti A. Enterprise Ltd',
      },
    },
  };

  if (product.reviews > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviews,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return schema;
}

export function getBlogPostingSchema(post: BlogPost, url: string): BlogPostingSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage.startsWith('http')
      ? post.featuredImage
      : `${BASE_URL}${post.featuredImage}`,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Maltiti A. Enterprise Ltd',
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/logo.svg`,
      },
    },
    datePublished: post.publishDate,
    dateModified: post.publishDate,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    keywords: post.tags.join(', '),
    articleSection: post.category,
    url,
  };
}

export function getBreadcrumbSchema(items: BreadcrumbItem[]): BreadcrumbListSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
