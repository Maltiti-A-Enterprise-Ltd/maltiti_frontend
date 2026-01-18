'use client';

import { JSX, useState } from 'react';
import { BlogCard } from '@/components/blog';
import { Badge } from '@/components/ui/badge';
import { blogPosts, getAllCategories, type BlogCategory } from '@/lib/blog-data';
import Link from 'next/link';

export function BlogListingPage(): JSX.Element {
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | 'All'>('All');
  const categories = getAllCategories();

  const filteredPosts =
    selectedCategory === 'All'
      ? blogPosts
      : blogPosts.filter((post) => post.category === selectedCategory);

  return (
    <div className="mt-10 min-h-screen bg-linear-to-b from-gray-50 to-white">
      {/* Header Section */}
      <section className="bg-[#0F6938] px-4 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <h1 className="animate-fade-in-up mb-6 text-5xl font-bold md:text-6xl">
              Insights & Stories
            </h1>
            <p className="animate-fade-in-up animation-delay-200 text-xl leading-relaxed text-white/90 md:text-2xl">
              Discover the rich heritage, traditional knowledge, and sustainable practices behind
              our authentic shea butter and organic products from Northern Ghana.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-16">
        {/* Category Filter */}
        <div className="mb-12">
          <h2 className="mb-4 text-sm font-semibold tracking-wider text-gray-600 uppercase">
            Filter by Category
          </h2>
          <div className="flex flex-wrap gap-3">
            <Badge
              variant={selectedCategory === 'All' ? 'default' : 'outline'}
              className={`cursor-pointer px-4 py-2 text-sm transition-all ${
                selectedCategory === 'All'
                  ? 'bg-[#0F6938] hover:bg-[#0F6938]/90'
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => setSelectedCategory('All')}
            >
              All Posts
            </Badge>
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                className={`cursor-pointer px-4 py-2 text-sm transition-all ${
                  selectedCategory === category
                    ? 'bg-[#0F6938] hover:bg-[#0F6938]/90'
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-muted-foreground text-xl">No posts found in this category.</p>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <section className="mt-16 bg-[#0F6938]/5 px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            Experience the Authentic Difference
          </h2>
          <p className="mb-8 text-lg text-gray-700">
            Ready to try our premium organic products? Explore our collection of ethically sourced
            shea butter and natural products.
          </p>
          <Link
            href="/shop"
            className="inline-block rounded-lg bg-[#0F6938] px-8 py-4 font-semibold text-white shadow-lg transition-colors hover:bg-[#0F6938]/90 hover:shadow-xl"
          >
            Shop Our Products
          </Link>
        </div>
      </section>
    </div>
  );
}
