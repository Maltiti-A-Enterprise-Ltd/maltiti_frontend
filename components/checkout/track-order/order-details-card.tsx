import { JSX, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar, ShieldCheck, Info } from 'lucide-react';
import { SaleResponseDto } from '@/app/api';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  calculateServiceFee,
  calculateTotal,
  SERVICE_FEE_TOOLTIP,
} from '@/lib/constants/service-fee';

type OrderDetailsCardProps = {
  orderDetails: SaleResponseDto;
};

export const OrderDetailsCard = ({ orderDetails }: OrderDetailsCardProps): JSX.Element => {
  const formattedDate = new Date(orderDetails.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const deliveryFee = useMemo(
    () => Number(orderDetails.deliveryFee ?? 0),
    [orderDetails.deliveryFee],
  );

  const subtotal = useMemo(() => Number(orderDetails.amount ?? 0), [orderDetails.amount]);

  // Use backend serviceFee if available, else calculate it from our frontend constant
  const serviceFee = useMemo(
    () =>
      orderDetails.serviceFee === undefined || orderDetails.serviceFee === null
        ? calculateServiceFee(subtotal, deliveryFee)
        : Number(orderDetails.serviceFee),
    [orderDetails.serviceFee, subtotal, deliveryFee],
  );

  // Use backend total if available, else compute it
  const total = useMemo(
    () =>
      orderDetails.total === undefined || orderDetails.total === null
        ? calculateTotal(subtotal, deliveryFee)
        : Number(orderDetails.total),
    [orderDetails.total, subtotal, deliveryFee],
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
          <CardDescription>Information about your purchase</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <Calendar className="mt-0.5 h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">Order Date</p>
              <p className="text-sm text-gray-600">{formattedDate}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Items Ordered</h3>
            {orderDetails.lineItems.map((item, index) => (
              <div key={`${index}-${item.productId}`} className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {item.productName} x{item.requestedQuantity}
                </span>
                <span className="font-medium text-gray-900">
                  GHS {(item.finalPrice * item.requestedQuantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium text-gray-900">GHS {subtotal.toFixed(2)}</span>
            </div>
            {orderDetails.deliveryFee == null ? (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery</span>
                <span className="text-xs text-blue-600">To be determined</span>
              </div>
            ) : (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery</span>
                <span className="font-medium text-gray-900">GHS {deliveryFee.toFixed(2)}</span>
              </div>
            )}

            {/* Service Processing Fee */}
            <div className="flex justify-between text-sm">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex cursor-help items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5 text-green-600" />
                      <span className="text-gray-600 underline decoration-dotted underline-offset-2">
                        Secure Processing Fee
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
              <span className="font-medium text-gray-900">GHS {serviceFee.toFixed(2)}</span>
            </div>

            <Separator />
            <div className="flex justify-between">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="text-lg font-bold text-green-600">
                {subtotal ? `GHS ${total.toFixed(2)}` : 'Pending'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
