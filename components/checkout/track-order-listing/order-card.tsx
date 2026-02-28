import { JSX } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SaleResponseDto } from '@/app/api';
import { statusConfig, paymentStatusConfig } from './constants';
import { formatOrderDate, formatPrice } from './helpers';

type OrderCardProps = {
  order: SaleResponseDto;
  index: number;
  onClick: () => void;
};

export function OrderCard({ order, index, onClick }: Readonly<OrderCardProps>): JSX.Element {
  const statusInfo = statusConfig[order.orderStatus];
  const paymentInfo = paymentStatusConfig[order.paymentStatus];
  const formattedDate = formatOrderDate(order.createdAt);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card
        className="group cursor-pointer transition-all hover:border-green-200 hover:shadow-lg"
        onClick={onClick}
      >
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Left Section - Order Info */}
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <div className={`rounded-full ${statusInfo.bgColor} shrink-0 p-2`}>
                  <div className={statusInfo.color}>{statusInfo.icon}</div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Order ID</p>
                  <p className="font-mono text-sm font-semibold text-gray-900">{order.id}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className={`${statusInfo.color} ${statusInfo.bgColor} text-xs font-medium`}
                >
                  {order.orderStatus.replace('_', ' ')}
                </Badge>
                <Badge
                  variant="outline"
                  className={`${paymentInfo.color} ${paymentInfo.bgColor} text-xs font-medium`}
                >
                  {order.paymentStatus.replace('_', ' ')}
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Ordered on {formattedDate}</span>
              </div>

              <div className="text-sm text-gray-600">
                <span className="font-medium text-gray-900">{order.lineItems.length}</span> item
                {order.lineItems.length === 1 ? '' : 's'}
              </div>
            </div>

            {/* Right Section - Price and Action */}
            <div className="flex items-center gap-4 sm:flex-col sm:items-end">
              <div className="flex-1 sm:flex-none">
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-2xl font-bold text-green-600">{formatPrice(order.amount)}</p>
              </div>
              <ChevronRight className="h-6 w-6 shrink-0 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
