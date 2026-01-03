'use client';

import { JSX, useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProductResponseDto } from '@/app/api';
import { getUnitSymbol } from '@/lib/product-utils';
import { useCart } from '@/lib/store/useCart';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

type ProductInfoSectionProps = {
  product: ProductResponseDto;
};

export function ProductInfoSection({ product }: ProductInfoSectionProps): JSX.Element {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const { addItem, isAdding } = useCart();

  // Check product availability
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

  // Handle quantity changes
  const handleQuantityChange = (newQuantity: number): void => {
    if (newQuantity >= 1 && newQuantity <= 999) {
      setQuantity(newQuantity);
    }
  };

  const incrementQuantity = (): void => handleQuantityChange(quantity + 1);
  const decrementQuantity = (): void => handleQuantityChange(quantity - 1);

  // Handle add to cart
  const handleAddToCart = async (): Promise<void> => {
    if (isUnavailable) {
      return;
    }

    try {
      await addItem(product, quantity);
      toast.success('Added to cart', {
        description: `${quantity} × ${product.name} added to your cart`,
        duration: 3000,
      });
    } catch (error) {
      toast.error('Failed to add to cart', {
        description: error instanceof Error ? error.message : 'Something went wrong',
        duration: 4000,
      });
    }
  };

  // Render star rating
  const renderStars = (): JSX.Element[] => {
    const stars: JSX.Element[] = [];
    const fullStars = Math.floor(product.rating);
    const hasHalfStar = product.rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Icon key={i} icon="ph:star-fill" className="h-5 w-5 text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Icon key={i} icon="ph:star-half-fill" className="h-5 w-5 text-yellow-400" />);
      } else {
        stars.push(<Icon key={i} icon="ph:star" className="h-5 w-5 text-gray-300" />);
      }
    }
    return stars;
  };

  // Get status badge
  const getStatusBadge = (): JSX.Element | null => {
    if (isOutOfStock) {
      return (
        <Badge variant="destructive" className="gap-1.5">
          <Icon icon="ph:x-circle-fill" className="h-4 w-4" />
          Out of Stock
        </Badge>
      );
    }
    if (isDiscontinued) {
      return (
        <Badge variant="secondary" className="gap-1.5">
          <Icon icon="ph:warning-fill" className="h-4 w-4" />
          Discontinued
        </Badge>
      );
    }
    if (isInactive) {
      return (
        <Badge variant="secondary" className="gap-1.5">
          <Icon icon="ph:pause-circle-fill" className="h-4 w-4" />
          Unavailable
        </Badge>
      );
    }
    return (
      <Badge variant="default" className="gap-1.5 bg-green-500">
        <Icon icon="ph:check-circle-fill" className="h-4 w-4" />
        In Stock
      </Badge>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-6"
    >
      {/* Badges Section */}
      <div className="flex flex-wrap gap-2">
        {/* Category Badge */}
        <Badge variant="outline" className="gap-1.5">
          <Icon icon="ph:tag" className="h-4 w-4" />
          {product.category.replace(/_/g, ' ')}
        </Badge>

        {/* Status Badge */}
        {getStatusBadge()}

        {/* Feature Badges */}
        {product.isFeatured && (
          <Badge className="bg-primary gap-1.5">
            <Icon icon="ph:star-fill" className="h-4 w-4" />
            Featured
          </Badge>
        )}
        {product.isOrganic && (
          <Badge className="gap-1.5 bg-green-500">
            <Icon icon="ph:leaf-fill" className="h-4 w-4" />
            Organic
          </Badge>
        )}
        {product.grade === 'premium' && (
          <Badge className="gap-1.5 bg-purple-500">
            <Icon icon="ph:crown-fill" className="h-4 w-4" />
            Premium
          </Badge>
        )}
        {product.grade === 'A' && <Badge className="gap-1.5 bg-blue-500">Grade A</Badge>}
      </div>

      {/* Product Name */}
      <div>
        <h1 className="text-foreground text-3xl font-bold tracking-tight md:text-4xl">
          {product.name}
        </h1>
        {product.weight && (
          <p className="text-muted-foreground mt-2 text-lg">
            {product.weight} {getUnitSymbol(product.unitOfMeasurement)}
          </p>
        )}
      </div>

      {/* Rating & Reviews */}
      <div className="flex items-center gap-3">
        <div className="flex gap-1">{renderStars()}</div>
        <span className="text-foreground font-medium">{product.rating}</span>
        <span className="text-muted-foreground">
          ({product.reviews} {product.reviews === 1 ? 'review' : 'reviews'})
        </span>
      </div>

      {/* Price Section */}
      <div className="border-border bg-muted/30 rounded-xl border p-6">
        <div className="space-y-3">
          <div>
            <p className="text-muted-foreground mb-1 text-sm font-medium">Retail Price</p>
            <p className="text-primary text-4xl font-bold">{formatPrice(product.retail)}</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1 text-sm font-medium">Wholesale Price</p>
            <p className="text-foreground text-2xl font-semibold">
              {formatPrice(product.wholesale)}
            </p>
            <p className="text-muted-foreground mt-1 text-xs">
              Min. order: {product.minOrderQuantity} units
            </p>
          </div>
        </div>
      </div>

      {/* Short Description / Tagline */}
      {product.description && (
        <p className="text-muted-foreground leading-relaxed">
          {product.description.split('\n')[0]}
        </p>
      )}

      {/* Quantity & Add to Cart */}
      <div className="space-y-4 pt-4">
        <div>
          <label htmlFor="quantity" className="text-foreground mb-2 block text-sm font-medium">
            Quantity
          </label>
          <div className="flex items-center gap-3">
            <div className="border-border bg-background flex items-center overflow-hidden rounded-lg border">
              <button
                onClick={decrementQuantity}
                disabled={quantity <= 1 || isUnavailable}
                className="hover:bg-muted h-12 w-12 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Decrease quantity"
              >
                <Icon icon="ph:minus-bold" className="mx-auto h-5 w-5" />
              </button>
              <input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                disabled={isUnavailable}
                className="text-foreground h-12 w-20 border-none bg-transparent text-center text-lg font-medium focus:outline-none disabled:cursor-not-allowed"
                min="1"
                max="999"
              />
              <button
                onClick={incrementQuantity}
                disabled={quantity >= 999 || isUnavailable}
                className="hover:bg-muted h-12 w-12 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Increase quantity"
              >
                <Icon icon="ph:plus-bold" className="mx-auto h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            size="lg"
            onClick={handleAddToCart}
            disabled={isUnavailable || isAdding}
            className={cn(
              'gap-2 text-base font-semibold',
              isUnavailable && 'cursor-not-allowed opacity-50',
            )}
          >
            {isAdding ? (
              <>
                <Icon icon="ph:circle-notch" className="h-5 w-5 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Icon icon="ph:shopping-cart-fill" className="h-5 w-5" />
                Add to Cart
              </>
            )}
          </Button>

          <Button
            onClick={() => router.push('/#contactus')}
            size="lg"
            variant="outline"
            className="gap-2 text-base font-semibold sm:w-auto"
          >
            <Icon icon="ph:chat-circle-text-fill" className="h-5 w-5" />
            Contact Us
          </Button>
        </div>

        {/* Bulk Order CTA */}
        <Button variant="link" className="text-primary h-auto p-0 text-sm font-medium">
          <Icon icon="ph:package-fill" className="mr-2 h-4 w-4" />
          Interested in bulk orders? Request a quotation
        </Button>
      </div>

      {/* Additional Product Info */}
      <div className="border-border space-y-3 border-t pt-6">
        <div className="flex items-center gap-3">
          <Icon icon="ph:barcode" className="text-muted-foreground h-5 w-5" />
          <div className="flex-1">
            <p className="text-muted-foreground text-sm">SKU</p>
            <p className="text-foreground font-medium">{product.sku}</p>
          </div>
        </div>
        {product.supplierReference && (
          <div className="flex items-center gap-3">
            <Icon icon="ph:buildings" className="text-muted-foreground h-5 w-5" />
            <div className="flex-1">
              <p className="text-muted-foreground text-sm">Supplier Reference</p>
              <p className="text-foreground font-medium">{product.supplierReference}</p>
            </div>
          </div>
        )}
        <div className="flex items-center gap-3">
          <Icon icon="ph:package" className="text-muted-foreground h-5 w-5" />
          <div className="flex-1">
            <p className="text-muted-foreground text-sm">Unit of Measurement</p>
            <p className="text-foreground font-medium">{product.unitOfMeasurement.toUpperCase()}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
