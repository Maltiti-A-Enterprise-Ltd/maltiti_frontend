'use client';

import { JSX } from 'react';
import Image from 'next/image';
import { Package, Info, ShieldCheck } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { CartItemDto } from '@/app/api';
import { ProductPlaceholder } from '@/app/assets';
import {
  calculateServiceFee,
  calculateTotal,
  SERVICE_FEE_TOOLTIP,
} from '@/lib/constants/service-fee';

type OrderSummaryProps = {
  items: CartItemDto[];
  totalPrice: number;
  deliveryCost: number | null;
  isCalculatingDelivery: boolean;
  isInternationalDelivery: boolean;
};

const renderDeliveryAmount = (
  isCalculatingDelivery: boolean,
  isInternationalDelivery: boolean,
  deliveryCost: number | null,
): JSX.Element => {
  if (isCalculatingDelivery) {
    return <span className="text-sm text-gray-500">Calculating...</span>;
  }
  if (isInternationalDelivery) {
    return <span className="text-sm text-orange-600">TBD</span>;
  }
  if (deliveryCost !== null) {
    return <span className="font-medium text-gray-900">GH₵ {deliveryCost.toFixed(2)}</span>;
  }
  return <span className="text-sm text-gray-500">Enter location</span>;
};

const renderServiceFeeAmount = (
  isCalculatingDelivery: boolean,
  isInternationalDelivery: boolean,
  deliveryCost: number | null,
  totalPrice: number,
): JSX.Element => {
  if (isCalculatingDelivery) {
    return <span className="text-sm text-gray-500">Calculating...</span>;
  }
  if (deliveryCost !== null && !isInternationalDelivery) {
    return (
      <span className="font-medium text-gray-900">
        GH₵ {calculateServiceFee(totalPrice, deliveryCost).toFixed(2)}
      </span>
    );
  }
  return (
    <span className="text-sm text-gray-500">
      ~GH₵ {calculateServiceFee(totalPrice).toFixed(2)}+
    </span>
  );
};

const renderDeliveryAlert = (
  isInternationalDelivery: boolean,
  deliveryCost: number | null,
  isCalculatingDelivery: boolean,
): JSX.Element | null => {
  if (isInternationalDelivery) {
    return (
      <Alert className="border-orange-200 bg-orange-50 text-orange-900">
        <Package className="h-4 w-4" />
        <AlertDescription className="text-xs">
          International delivery costs will be determined based on your location. We will contact
          you with the final delivery fee before processing your order.
        </AlertDescription>
      </Alert>
    );
  }
  if (deliveryCost === null && !isCalculatingDelivery) {
    return (
      <Alert className="border-blue-200 bg-blue-50 text-blue-900">
        <Package className="h-4 w-4" />
        <AlertDescription className="text-xs">
          Please enter your delivery location to calculate the delivery fee.
        </AlertDescription>
      </Alert>
    );
  }
  if (deliveryCost !== null) {
    return (
      <Alert className="border-green-200 bg-green-50 text-green-900">
        <Package className="h-4 w-4" />
        <AlertDescription className="text-xs">
          Delivery fee has been calculated based on your location and will be added to the total
          amount.
        </AlertDescription>
      </Alert>
    );
  }
  return null;
};

const OrderSummary = ({
  items,
  totalPrice,
  deliveryCost,
  isCalculatingDelivery,
  isInternationalDelivery,
}: OrderSummaryProps): JSX.Element => {
  const isEstimated = isInternationalDelivery || deliveryCost === null;
  const grandTotal =
    deliveryCost !== null && !isInternationalDelivery
      ? calculateTotal(totalPrice, deliveryCost)
      : calculateTotal(totalPrice);

  return (
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
          {renderDeliveryAmount(isCalculatingDelivery, isInternationalDelivery, deliveryCost)}
        </div>

        {/* Service Processing Fee */}
        <div className="flex justify-between text-sm">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex cursor-help items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-green-600" />
                  <span className="text-gray-600 underline decoration-dotted underline-offset-2">
                    Secure Service Fee
                  </span>
                  <Info className="h-3 w-3 text-gray-400" />
                </div>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="max-w-72 rounded-lg border-green-100 bg-white p-3 shadow-lg"
              >
                <div className="flex gap-2">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                  <p className="text-xs leading-relaxed text-gray-700">{SERVICE_FEE_TOOLTIP}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {renderServiceFeeAmount(
            isCalculatingDelivery,
            isInternationalDelivery,
            deliveryCost,
            totalPrice,
          )}
        </div>

        {renderDeliveryAlert(isInternationalDelivery, deliveryCost, isCalculatingDelivery)}
      </div>

      <Separator />

      {/* Total */}
      <div className="flex justify-between text-lg font-bold">
        <span className="text-gray-900">{isEstimated ? 'Estimated Total' : 'Total'}</span>
        <span className="text-[#0F6938]">
          GH₵ {grandTotal.toFixed(2)}
          {isEstimated && '+'}
        </span>
      </div>

      {isEstimated && (
        <p className="text-xs text-gray-500">
          {isInternationalDelivery
            ? 'Final amount will include delivery fee and secure payment fee (to be confirmed)'
            : 'Enter your delivery location to see the final amount'}
        </p>
      )}
    </div>
  );
};

export default OrderSummary;
