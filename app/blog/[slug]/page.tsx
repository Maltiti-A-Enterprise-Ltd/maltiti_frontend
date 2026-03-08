import React, { JSX } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Calendar, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BlogContentRenderer, RelatedPosts, ShareButtons } from '@/components/blog';
import { getBlogPost, getRelatedPosts, blogPosts } from '@/lib/blog-data';

type BlogPostPageProps = {
  params: { slug: string };
};

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  console.log('Post');

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} | Maltiti Blog`,
    description: post.excerpt,
    keywords: post.tags.join(', '),
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishDate,
      authors: [post.author],
      images: [
        {
          url: post.featuredImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps): Promise<JSX.Element> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(slug);
  const postUrl = `https://maltitiaenterprise.com/blog/${slug}`;

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="border-b bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <Link href="/blog">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to All Posts
            </Button>
          </Link>
        </div>
      </div>

      {/* Article Header */}
      <article className="mx-auto max-w-4xl px-4 py-12">
        {/* Category & Reading Time */}
        <div className="mb-6 flex items-center gap-4">
          <Badge className="bg-[#0F6938] text-white hover:bg-[#0F6938]/90">{post.category}</Badge>
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4" />
            <span>{post.readingTime} min read</span>
          </div>
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4" />
            <time dateTime={post.publishDate}>
              {new Date(post.publishDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>
        </div>

        {/* Title & Subtitle */}
        <h1 className="mb-4 text-4xl leading-tight font-bold text-gray-900 md:text-5xl">
          {post.title}
        </h1>

        {post.subtitle && (
          <p className="mb-8 text-xl leading-relaxed text-gray-600">{post.subtitle}</p>
        )}

        {/* Author & Share */}
        <div className="mb-10 flex items-center justify-between">
          <div className="text-muted-foreground text-sm">
            By <span className="font-medium text-gray-900">{post.author}</span>
          </div>
          <ShareButtons title={post.title} url={postUrl} />
        </div>

        <Separator className="mb-10" />

        {/* Featured Image */}
        <div className="relative mb-12 h-100 w-full overflow-hidden rounded-xl md:h-125">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 896px"
          />
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          <BlogContentRenderer content={post.content} />
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mt-12 border-t pt-8">
            <h3 className="mb-3 text-sm font-semibold tracking-wider text-gray-600 uppercase">
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-sm">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Share Again */}
        <div className="mt-12 border-t pt-8">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-600">Found this article helpful?</p>
            <ShareButtons title={post.title} url={postUrl} />
          </div>
        </div>

        {/* Related Posts */}
        <RelatedPosts posts={relatedPosts} />
      </article>

      {/* CTA Section */}
      <section className="mt-16 bg-[#0F6938] px-4 py-16 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Ready to Experience Authentic Shea Butter?
          </h2>
          <p className="mb-8 text-lg text-white/90">
            Explore our collection of premium organic products, ethically sourced from Northern
            Ghana.
          </p>
          <Link href="/shop">
            <Button
              size="lg"
              className="bg-white px-8 font-semibold text-[#0F6938] shadow-lg hover:bg-white/90"
            >
              Shop Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
