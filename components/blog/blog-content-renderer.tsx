'use client';

import { JSX } from 'react';
import Image from 'next/image';
import type { BlogContent } from '@/lib/blog-data';

type BlogContentRendererProps = {
  content: BlogContent[];
};

export function BlogContentRenderer({ content }: BlogContentRendererProps): JSX.Element {
  const renderContentBlock = (block: BlogContent, index: number): JSX.Element => {
    switch (block.type) {
      case 'paragraph':
        return (
          <p key={index} className="mb-6 text-lg leading-relaxed text-gray-700">
            {block.text}
          </p>
        );

      case 'heading':
        const HeadingTag = `h${block.level}` as keyof JSX.IntrinsicElements;
        const headingClasses = {
          2: 'text-3xl font-bold text-gray-900 mt-12 mb-6',
          3: 'text-2xl font-semibold text-gray-900 mt-10 mb-4',
          4: 'text-xl font-semibold text-gray-800 mt-8 mb-3',
        };
        return (
          <HeadingTag key={index} className={headingClasses[block.level]}>
            {block.text}
          </HeadingTag>
        );

      case 'image':
        return (
          <figure key={index} className="my-10">
            <div className="relative h-96 w-full overflow-hidden rounded-lg">
              <Image
                src={block.src}
                alt={block.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>
            {block.caption && (
              <figcaption className="text-muted-foreground mt-3 text-center text-sm italic">
                {block.caption}
              </figcaption>
            )}
          </figure>
        );

      case 'quote':
        return (
          <blockquote
            key={index}
            className="my-8 rounded-r-lg border-l-4 border-[#0F6938] bg-[#0F6938]/5 py-4 pr-6 pl-6"
          >
            <p className="mb-2 text-lg text-gray-700 italic">&#34;{block.text}&#34;</p>
            {block.author && (
              <cite className="text-muted-foreground text-sm not-italic">— {block.author}</cite>
            )}
          </blockquote>
        );

      case 'list':
        const ListTag = block.ordered ? 'ol' : 'ul';
        const listClass = block.ordered
          ? 'list-decimal list-inside space-y-2 mb-6 text-lg text-gray-700'
          : 'list-disc list-inside space-y-2 mb-6 text-lg text-gray-700';
        return (
          <ListTag key={index} className={listClass}>
            {block.items.map((item, i) => (
              <li key={i} className="leading-relaxed">
                {item}
              </li>
            ))}
          </ListTag>
        );

      default:
        return <></>;
    }
  };

  return (
    <article className="prose prose-lg max-w-none">
      {content.map((block, index) => renderContentBlock(block, index))}
    </article>
  );
}
