import { JSX, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar } from 'lucide-react';
import { SaleResponseDto } from '@/app/api';
import { motion } from 'framer-motion';

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

  const total = useMemo(
    () => Number(orderDetails.amount ?? 0) + deliveryFee,
    [deliveryFee, orderDetails.amount],
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
              <span className="font-medium text-gray-900">GHS {orderDetails.amount}</span>
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
            <Separator />
            <div className="flex justify-between">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="text-lg font-bold text-green-600">
                {total ? `GHS ${total}` : 'Pending'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
