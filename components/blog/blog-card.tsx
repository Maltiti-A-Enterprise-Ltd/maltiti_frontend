'use client';

import { JSX } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import type { BlogPost } from '@/lib/blog-data';

type BlogCardProps = {
  post: BlogPost;
};

export function BlogCard({ post }: BlogCardProps): JSX.Element {
  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <Card className="h-full overflow-hidden border-none shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <div className="relative h-56 overflow-hidden">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>

        <CardHeader className="space-y-3 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="secondary"
              className="bg-[#0F6938]/10 text-[#0F6938] hover:bg-[#0F6938]/20"
            >
              {post.category}
            </Badge>
            <div className="text-muted-foreground flex items-center text-xs">
              <Clock className="mr-1 h-3 w-3" />
              <span>{post.readingTime} min read</span>
            </div>
          </div>

          <h3 className="line-clamp-2 text-xl leading-tight font-bold transition-colors group-hover:text-[#0F6938]">
            {post.title}
          </h3>
        </CardHeader>

        <CardContent className="pb-4">
          <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
            {post.excerpt}
          </p>
        </CardContent>

        <CardFooter className="pt-0 pb-6">
          <div className="text-muted-foreground flex w-full items-center justify-between text-xs">
            <span>{post.author}</span>
            <span>
              {new Date(post.publishDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
