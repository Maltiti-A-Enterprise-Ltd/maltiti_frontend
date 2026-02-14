'use client';

import { JSX } from 'react';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type EmptyCartProps = {
  onContinueShopping: () => void;
};

const EmptyCart = ({ onContinueShopping }: EmptyCartProps): JSX.Element => (
  <div className="min-h-screen bg-linear-to-br from-gray-50 to-green-50/30 px-4 py-12">
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-6 rounded-full bg-gray-100 p-6">
            <ShoppingBag className="h-16 w-16 text-gray-400" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-gray-900">Your cart is empty</h2>
          <p className="mb-6 text-gray-600">Add some products to get started with checkout</p>
          <Button onClick={onContinueShopping}>Continue Shopping</Button>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default EmptyCart;
