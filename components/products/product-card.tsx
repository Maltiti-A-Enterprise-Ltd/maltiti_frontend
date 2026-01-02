'use client';

import { JSX, memo, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';
import { ProductResponseDto } from '@/app/api';
import { getUnitSymbol } from '@/lib/product-utils';
import { useCart } from '@/lib/store/useCart';
import { toast } from 'sonner';

interface ProductCardProps {
  product: ProductResponseDto;
  className?: string;
}

const ProductCard = memo(function ProductCard({
  product,
  className,
}: ProductCardProps): JSX.Element {
  const [imageError, setImageError] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Cart functionality
  const { addItem, isAdding } = useCart();

  // Get primary image
  const primaryImage = product.image || product.images?.[0] || '/placeholder-product.svg';

  // Check if product is available
  const isOutOfStock = product.status === 'out_of_stock';
  const isDiscontinued = product.status === 'discontinued';
  const isInactive = product.status === 'inactive';
  const isUnavailable = isOutOfStock || isDiscontinued || isInactive;

  // Format currency
  const formatPrice = (price: number): string =>
    new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 2,
    }).format(price);

  /**
   * Handle add to cart
   * Shows loading state and success/error toasts
   */
  const handleAddToCart = async (e: React.MouseEvent): Promise<void> => {
    e.preventDefault();

    if (isUnavailable) {
      return;
    }

    try {
      await addItem(product, 1);

      // Show success toast
      toast.success('Added to cart', {
        description: `${product.name} has been added to your cart`,
        duration: 3000,
      });
    } catch (error) {
      // Show error toast
      toast.error('Failed to add to cart', {
        description: error instanceof Error ? error.message : 'Something went wrong',
        duration: 4000,
      });
      console.error('Add to cart error:', error);
    }
  };

  // Render star rating
  const renderStars = (): JSX.Element[] => {
    const stars: JSX.Element[] = [];
    const fullStars = Math.floor(product.rating);
    const hasHalfStar = product.rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Icon key={i} icon="ph:star-fill" className="h-4 w-4 text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Icon key={i} icon="ph:star-half-fill" className="h-4 w-4 text-yellow-400" />);
      } else {
        stars.push(<Icon key={i} icon="ph:star" className="h-4 w-4 text-gray-300" />);
      }
    }
    return stars;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={cn(
        'group border-border bg-card hover:shadow-primary/5 relative flex flex-col overflow-hidden rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-xl',
        isUnavailable && 'opacity-75',
        className,
      )}
    >
      {/* Image Container - Fixed aspect ratio */}
      <div className="bg-muted relative aspect-4/5 w-full overflow-hidden">
        {/* Image with zoom effect on hover */}
        <div className="relative h-full w-full transition-transform duration-500 group-hover:scale-110">
          <Image
            src={imageError ? '/placeholder-product.svg' : primaryImage}
            alt={product.name}
            fill
            className={cn(
              'object-cover object-center transition-opacity duration-300',
              !isImageLoaded && 'opacity-0',
            )}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onError={() => setImageError(true)}
            onLoad={() => setIsImageLoaded(true)}
            priority={false}
            loading="lazy"
          />
        </div>

        {/* Overlay gradient on hover */}
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Badge Overlays */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isFeatured && (
            <Badge variant="default" className="bg-primary text-primary-foreground shadow-md">
              <Icon icon="ph:star-fill" className="h-3 w-3" />
              Featured
            </Badge>
          )}
          {product.isOrganic && (
            <Badge variant="secondary" className="bg-green-500 text-white shadow-md">
              <Icon icon="ph:leaf-fill" className="h-3 w-3" />
              Organic
            </Badge>
          )}
          {product.grade === 'premium' && (
            <Badge className="bg-purple-500 text-white shadow-md">
              <Icon icon="ph:crown-fill" className="h-3 w-3" />
              Premium
            </Badge>
          )}
          {product.grade === 'A' && (
            <Badge className="bg-blue-500 text-white shadow-md">Grade A</Badge>
          )}
        </div>

        {/* Out of Stock Badge */}
        {isOutOfStock && (
          <div className="absolute top-3 right-3">
            <Badge variant="destructive" className="shadow-md">
              Out of Stock
            </Badge>
          </div>
        )}
        {isDiscontinued && (
          <div className="absolute top-3 right-3">
            <Badge variant="destructive" className="shadow-md">
              Discontinued
            </Badge>
          </div>
        )}

        {/* Favorite Icon */}
        <button
          className="focus:ring-primary absolute right-3 bottom-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white focus:ring-2 focus:ring-offset-2 focus:outline-none"
          aria-label="Add to favorites"
          onClick={(e) => {
            e.preventDefault();
            // TODO: Implement favorite functionality
          }}
        >
          <Icon
            icon={product.favorite ? 'ph:heart-fill' : 'ph:heart'}
            className={cn(
              'h-5 w-5 transition-colors',
              product.favorite ? 'text-red-500' : 'text-gray-600',
            )}
          />
        </button>
      </div>

      {/* Content Container */}
      <div className="flex flex-1 flex-col p-4">
        {/* Category Badge */}
        <div className="mb-2">
          <Badge variant="outline" className="text-xs">
            {product.category}
          </Badge>
        </div>

        {/* Product Name */}
        <h3 className="text-foreground group-hover:text-primary mb-2 line-clamp-2 text-lg font-semibold transition-colors">
          {product.name}
        </h3>

        {/* Weight */}
        <div className="text-muted-foreground mb-3 flex items-center gap-1.5 text-sm">
          <Icon icon="ph:package" className="h-4 w-4" />
          <span>
            {product.weight} {getUnitSymbol(product.unitOfMeasurement)}
          </span>
        </div>

        {/* Rating & Reviews */}
        {product.rating > 0 && (
          <div className="mb-4 flex items-center gap-2">
            <div className="flex items-center gap-0.5">{renderStars()}</div>
            <span className="text-muted-foreground text-sm">
              ({product.reviews} {product.reviews === 1 ? 'review' : 'reviews'})
            </span>
          </div>
        )}

        {/* Certifications */}
        {product.certifications && product.certifications.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {product.certifications.slice(0, 3).map((cert, index) => (
              <div
                key={index}
                className="bg-muted text-muted-foreground flex items-center gap-1 rounded-full px-2 py-1 text-xs"
              >
                <Icon icon="ph:seal-check-fill" className="h-3 w-3 text-green-600" />
                {cert}
              </div>
            ))}
          </div>
        )}

        {/* Spacer to push pricing and button to bottom */}
        <div className="flex-1" />

        {/* Pricing */}
        <div className="mb-4 space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="text-foreground text-2xl font-bold">
              {formatPrice(product.retail)}
            </span>
            <span className="text-muted-foreground text-sm line-through">
              {product.wholesale < product.retail && formatPrice(product.wholesale)}
            </span>
          </div>
          {product.inBoxPrice && (
            <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
              <Icon icon="ph:package-fill" className="h-3.5 w-3.5" />
              <span>
                Box of {product.quantityInBox}: {formatPrice(product.inBoxPrice)}
              </span>
            </div>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          className="w-full transition-all duration-300 hover:scale-[1.02]"
          disabled={isUnavailable || isAdding}
          onClick={handleAddToCart}
        >
          {isAdding ? (
            <>
              <Icon icon="ph:circle-notch" className="h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <Icon icon="ph:shopping-cart" className="h-4 w-4" />
              {isUnavailable ? 'Unavailable' : 'Add to Cart'}
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
});

export default ProductCard;
