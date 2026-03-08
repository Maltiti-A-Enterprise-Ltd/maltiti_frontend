'use client';

import { JSX, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent } from '@/components/ui/dialog';

type ProductImageGalleryProps = {
  images: string[];
  productName: string;
  className?: string;
};

export function ProductImageGallery({
  images,
  productName,
  className,
}: ProductImageGalleryProps): JSX.Element {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Ensure we have at least one image
  const displayImages = images.length > 0 ? images : ['/placeholder-product.svg'];

  return (
    <>
      <div className={cn('space-y-4', className)}>
        {/* Main Image */}
        <motion.div
          className="bg-muted relative aspect-square w-full overflow-hidden rounded-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative h-full w-full"
            >
              <Image
                src={imageError ? '/placeholder-product.svg' : displayImages[selectedImage]}
                alt={`${productName} - View ${selectedImage + 1}`}
                fill
                className={cn(
                  'object-cover object-center transition-opacity duration-300',
                  !isImageLoaded && 'opacity-0',
                )}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
                priority
                onError={() => setImageError(true)}
                onLoad={() => setIsImageLoaded(true)}
              />
            </motion.div>
          </AnimatePresence>

          {/* Zoom Button */}
          <button
            onClick={() => setIsLightboxOpen(true)}
            className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-white"
            aria-label="Zoom image"
          >
            <Icon icon="ph:magnifying-glass-plus" className="h-5 w-5 text-gray-700" />
          </button>

          {/* Navigation Arrows (if multiple images) */}
          {displayImages.length > 1 && (
            <>
              <button
                onClick={() =>
                  setSelectedImage((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1))
                }
                className="absolute top-1/2 left-4 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-white"
                aria-label="Previous image"
              >
                <Icon icon="ph:caret-left-bold" className="h-5 w-5 text-gray-700" />
              </button>
              <button
                onClick={() =>
                  setSelectedImage((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1))
                }
                className="absolute top-1/2 right-4 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-white"
                aria-label="Next image"
              >
                <Icon icon="ph:caret-right-bold" className="h-5 w-5 text-gray-700" />
              </button>
            </>
          )}
        </motion.div>

        {/* Thumbnail Gallery */}
        {displayImages.length > 1 && (
          <div className="scrollbar-thin flex gap-2 overflow-x-auto pb-2">
            {displayImages.map((image, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedImage(index);
                  setIsImageLoaded(false);
                  setImageError(false);
                }}
                className={cn(
                  'bg-muted relative aspect-square w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all hover:scale-105',
                  selectedImage === index
                    ? 'border-primary ring-primary/20 ring-2'
                    : 'border-transparent hover:border-gray-300',
                )}
                aria-label={`View image ${index + 1}`}
              >
                <Image
                  src={image}
                  alt={`${productName} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-4xl p-0">
          <div className="relative aspect-square w-full">
            <Image
              src={imageError ? '/placeholder-product.svg' : displayImages[selectedImage]}
              alt={`${productName} - Enlarged view`}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 1024px"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
