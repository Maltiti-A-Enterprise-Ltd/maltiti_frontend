'use client';
import { JSX, useState } from 'react';
import Image from 'next/image';
import { ShoppingCartIcon, ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useCart } from '@/lib/store/useCart';
import { ProductPlaceholder } from '@/app/assets';

type CartSheetProps = Record<string, never>;

const CartSheet = ({}: CartSheetProps): JSX.Element => {
  const { items, totalItems, totalPrice } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const toggleCart = (): void => setIsCartOpen(!isCartOpen);

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
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="animate-bounce">
                  <ShoppingCart className="h-24 w-24 text-gray-400" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Your cart is empty</h3>
                <p className="mt-2 text-sm text-gray-500">Add some items to get started!</p>
                <Button className="mt-4" onClick={() => setIsCartOpen(false)}>
                  Continue Shopping
                </Button>
              </div>
            ) : (
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
                  <Button>Checkout</Button>
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
                          <Button size="sm" variant="outline" onClick={() => {}}>
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span>{item.quantity}</span>
                          <Button size="sm" variant="outline" onClick={() => {}}>
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => {}}>
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
