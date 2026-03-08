'use client';

import { JSX } from 'react';
import { BlogCard } from './blog-card';
import type { BlogPost } from '@/lib/blog-data';

type RelatedPostsProps = {
  posts: BlogPost[];
};

export function RelatedPosts({ posts }: RelatedPostsProps): JSX.Element {
  if (posts.length === 0) {
    return <></>;
  }

  return (
    <section className="mt-16 border-t pt-12">
      <h2 className="mb-8 text-3xl font-bold text-gray-900">Related Articles</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
