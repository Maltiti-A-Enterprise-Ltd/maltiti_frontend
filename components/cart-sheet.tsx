'use client';
import { JSX, useEffect, useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShoppingCartIcon, ShoppingCart, Minus, Plus, Trash2, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '@/lib/store/useCart';
import { ProductPlaceholder } from '@/app/assets';

type CartSheetProps = Record<string, never>;

const CartSheet = ({}: CartSheetProps): JSX.Element => {
  const router = useRouter();
  const {
    items,
    totalItems,
    totalPrice,
    getCart,
    updateQuantity,
    removeItem,
    isLoading,
    isFetching,
  } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [optimisticQuantities, setOptimisticQuantities] = useState<Record<string, number>>({});
  const debounceTimers = useRef<Record<string, NodeJS.Timeout>>({});

  const isCartLoading = isLoading || isFetching;

  const toggleCart = (): void => setIsCartOpen(!isCartOpen);

  const handleCheckout = (): void => {
    setIsCartOpen(false);
    router.push('/checkout');
  };

  // Debounced update function
  const debouncedUpdateQuantity = useCallback(
    (itemId: string, newQuantity: number): void => {
      // Clear existing timer for this item
      if (debounceTimers.current[itemId]) {
        clearTimeout(debounceTimers.current[itemId]);
      }

      // Set new timer
      debounceTimers.current[itemId] = setTimeout(() => {
        updateQuantity(itemId, newQuantity);
        delete debounceTimers.current[itemId];
      }, 500); // 500ms delay
    },
    [updateQuantity],
  );

  const handleIncrement = (itemId: string, currentQuantity: number): void => {
    const newQuantity = currentQuantity + 1;
    setOptimisticQuantities((prev) => ({ ...prev, [itemId]: newQuantity }));
    debouncedUpdateQuantity(itemId, newQuantity);
  };

  const handleDecrement = (itemId: string, currentQuantity: number): void => {
    if (currentQuantity > 1) {
      const newQuantity = currentQuantity - 1;
      setOptimisticQuantities((prev) => ({ ...prev, [itemId]: newQuantity }));
      debouncedUpdateQuantity(itemId, newQuantity);
    }
  };

  const handleRemove = async (itemId: string): Promise<void> => {
    // Clear any pending debounce timer for this item
    if (debounceTimers.current[itemId]) {
      clearTimeout(debounceTimers.current[itemId]);
      delete debounceTimers.current[itemId];
    }
    await removeItem(itemId);
  };

  // Get the display quantity (optimistic or actual)
  const getDisplayQuantity = (itemId: string, actualQuantity: number): number =>
    optimisticQuantities[itemId] ?? actualQuantity;

  // Cleanup timers on unmount
  useEffect(
    () => (): void => {
      Object.values(debounceTimers.current).forEach((timer) => clearTimeout(timer));
    },
    [],
  );

  useEffect(() => {
    getCart();
  }, []);

  return (
    <>
      {/* Cart Icon Button */}
      <button
        className="relative w-fit cursor-pointer border-none bg-transparent"
        onClick={toggleCart}
      >
        <Avatar className="size-9 rounded-sm">
          <AvatarFallback className="rounded-full">
            <ShoppingCartIcon className="size-5" />
          </AvatarFallback>
        </Avatar>
        {totalItems > 0 && (
          <Badge className="absolute -top-2.5 -right-2.5 h-5 min-w-5 px-1 tabular-nums">
            {totalItems}
          </Badge>
        )}
      </button>

      {/* Cart Sheet */}
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent side="right" className="w-96 bg-green-50 p-4">
          <SheetHeader>
            <SheetTitle>Your Cart</SheetTitle>
          </SheetHeader>
          <div>
            {isCartLoading ? (
              // Loading state
              <div className="space-y-4 py-4">
                <div className="flex items-center justify-center gap-2 py-8 text-gray-600">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="text-sm">Loading your cart...</span>
                </div>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-3 rounded-md bg-gray-200 p-4">
                      <Skeleton className="h-20 w-20 rounded-md" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-3 w-16" />
                        <div className="flex gap-2 pt-1">
                          <Skeleton className="h-8 w-8" />
                          <Skeleton className="h-8 w-12" />
                          <Skeleton className="h-8 w-8" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : items.length === 0 ? (
              // Empty cart state
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="animate-bounce">
                  <ShoppingCart className="h-24 w-24 text-gray-400" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Your cart is empty</h3>
                <p className="mt-2 text-sm text-gray-500">Add some items to get started!</p>
                <Button
                  className="mt-4"
                  onClick={() => {
                    router.push('/shop');
                    setIsCartOpen(false);
                  }}
                >
                  Continue Shopping
                </Button>
              </div>
            ) : (
              // Cart with items
              <>
                <div className="mb-4 flex justify-between">
                  <span className="font-bold">Subtotal</span>
                  <span className="font-bold">GH₵ {totalPrice}</span>
                </div>
                <div className="mb-4 text-xs text-red-600">
                  Shipping or delivery fees will be calculated during checkout
                </div>
                <div className="mb-4 flex justify-between">
                  <span className="self-center text-sm text-gray-700">
                    {totalItems} Products in your cart
                  </span>
                  <Button
                    onClick={handleCheckout}
                    className="cursor-pointer bg-[#0F6938] hover:bg-[#0F6938]/90"
                  >
                    Checkout
                  </Button>
                </div>
                <ul className="space-y-4">
                  {items.map((item) => (
                    <li key={item.id} className="flex rounded-md bg-gray-200 p-4">
                      <Image
                        src={item.product.image ?? ProductPlaceholder}
                        alt={item.product.name}
                        width={80}
                        height={80}
                        className="rounded-md"
                      />
                      <div className="ml-4 flex-1">
                        <h3 className="font-medium">{item.product.name}</h3>
                        <p className="text-sm text-gray-500">{item.product.weight}g</p>
                        <p className="text-sm">GH₵ {item.product.retail}</p>
                        <div className="mt-2 flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleDecrement(item.id, getDisplayQuantity(item.id, item.quantity))
                            }
                            disabled={getDisplayQuantity(item.id, item.quantity) <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="min-w-8 text-center">
                            {getDisplayQuantity(item.id, item.quantity)}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleIncrement(item.id, getDisplayQuantity(item.id, item.quantity))
                            }
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRemove(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default CartSheet;
