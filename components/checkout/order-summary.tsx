'use client';

import { JSX } from 'react';
import Image from 'next/image';
import { Package, Info } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { CartItemDto } from '@/app/api';
import { ProductPlaceholder } from '@/app/assets';

type OrderSummaryProps = {
  items: CartItemDto[];
  totalPrice: number;
  deliveryCost: number | null;
  isCalculatingDelivery: boolean;
  isInternationalDelivery: boolean;
};

const OrderSummary = ({
  items,
  totalPrice,
  deliveryCost,
  isCalculatingDelivery,
  isInternationalDelivery,
}: OrderSummaryProps): JSX.Element => (
  <div className="space-y-4">
    {/* Items List */}
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="flex items-start gap-3">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-gray-100">
            <Image
              src={item.product.image ?? ProductPlaceholder}
              alt={item.product.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 space-y-1">
            <h4 className="font-medium text-gray-900">{item.product.name}</h4>
            <p className="text-sm text-gray-500">
              {item.product.weight}g • Qty: {item.quantity}
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-gray-900">
              GH₵ {(Number(item.product.retail) * item.quantity).toFixed(2)}
            </p>
            <p className="text-xs text-gray-500">
              GH₵ {Number(item.product.retail).toFixed(2)} each
            </p>
          </div>
        </div>
      ))}
    </div>

    <Separator />

    {/* Pricing Breakdown */}
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Subtotal ({items.length} items)</span>
        <span className="font-medium text-gray-900">GH₵ {totalPrice.toFixed(2)}</span>
      </div>

      <div className="flex justify-between text-sm">
        <div className="flex items-center gap-1">
          <span className="text-gray-600">Delivery Fee</span>
          <Info className="h-3 w-3 text-gray-400" />
        </div>
        {isCalculatingDelivery ? (
          <span className="text-sm text-gray-500">Calculating...</span>
        ) : isInternationalDelivery ? (
          <span className="text-sm text-orange-600">TBD</span>
        ) : deliveryCost !== null ? (
          <span className="font-medium text-gray-900">GH₵ {deliveryCost.toFixed(2)}</span>
        ) : (
          <span className="text-sm text-gray-500">Enter location</span>
        )}
      </div>

      {isInternationalDelivery && (
        <Alert className="border-orange-200 bg-orange-50 text-orange-900">
          <Package className="h-4 w-4" />
          <AlertDescription className="text-xs">
            International delivery costs will be determined based on your location. We will contact
            you with the final delivery fee before processing your order.
          </AlertDescription>
        </Alert>
      )}

      {!isInternationalDelivery && deliveryCost === null && !isCalculatingDelivery && (
        <Alert className="border-blue-200 bg-blue-50 text-blue-900">
          <Package className="h-4 w-4" />
          <AlertDescription className="text-xs">
            Please enter your delivery location to calculate the delivery fee.
          </AlertDescription>
        </Alert>
      )}

      {!isInternationalDelivery && deliveryCost !== null && (
        <Alert className="border-green-200 bg-green-50 text-green-900">
          <Package className="h-4 w-4" />
          <AlertDescription className="text-xs">
            Delivery fee has been calculated based on your location and will be added to the total
            amount.
          </AlertDescription>
        </Alert>
      )}
    </div>

    <Separator />

    {/* Total */}
    <div className="flex justify-between text-lg font-bold">
      <span className="text-gray-900">
        {isInternationalDelivery || deliveryCost === null ? 'Estimated Total' : 'Total'}
      </span>
      <span className="text-[#0F6938]">
        GH₵{' '}
        {deliveryCost !== null && !isInternationalDelivery
          ? (totalPrice + deliveryCost).toFixed(2)
          : totalPrice.toFixed(2)}
        {(isInternationalDelivery || deliveryCost === null) && '+'}
      </span>
    </div>

    {(isInternationalDelivery || deliveryCost === null) && (
      <p className="text-xs text-gray-500">
        {isInternationalDelivery
          ? 'Final amount will include delivery fee (to be confirmed)'
          : 'Enter your delivery location to see the final amount'}
      </p>
    )}
  </div>
);

export default OrderSummary;
