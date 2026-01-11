import { JSX } from 'react';
import { Metadata } from 'next';
import { BlogListingPage } from '@/components/blog/blog-listing-page';

export const metadata: Metadata = {
  title: 'Blog & Insights | Maltiti A. Enterprise Ltd',
  description:
    'Explore articles about shea butter, traditional processing methods, organic products, and the stories of empowerment from Northern Ghana.',
  keywords:
    'shea butter blog, organic products, traditional knowledge, Ghana, borututu, yellow shea butter, women empowerment',
  openGraph: {
    title: 'Blog & Insights | Maltiti A. Enterprise Ltd',
    description:
      'Learn about shea butter, traditional processing, and the heritage behind our authentic products.',
    type: 'website',
  },
};

export default function BlogPage(): JSX.Element {
  return <BlogListingPage />;
}
