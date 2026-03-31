import { JSX } from 'react';
import { BlogListingPage } from '@/components/blog/blog-listing-page';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata({
  title: 'Blog & Insights | Maltiti A. Enterprise Ltd',
  description:
    'Explore articles about shea butter, traditional processing methods, organic products, and the stories of empowerment from Northern Ghana.',
  keywords:
    'shea butter blog, organic products, traditional knowledge, Ghana, borututu, yellow shea butter, women empowerment, shea butter processing',
  path: '/blog',
  ogImageAlt: 'Maltiti A. Enterprise Ltd Blog',
});

export default function BlogPage(): JSX.Element {
  return <BlogListingPage />;
}
