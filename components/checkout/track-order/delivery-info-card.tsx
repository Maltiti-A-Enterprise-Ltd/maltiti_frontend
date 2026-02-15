import { JSX } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SaleResponseDto } from '@/app/api';
import { motion } from 'framer-motion';

type DeliveryInfoCardProps = {
  orderDetails: SaleResponseDto;
};

export const DeliveryInfoCard = ({ orderDetails }: DeliveryInfoCardProps): JSX.Element => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.4, delay: 0.2 }}
  >
    <Card>
      <CardHeader>
        <CardTitle>Delivery Information</CardTitle>
        <CardDescription>Where your order will be sent</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <Mail className="mt-0.5 h-5 w-5 text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-900">Email</p>
            <p className="text-sm text-gray-600">{orderDetails.customer.email}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Phone className="mt-0.5 h-5 w-5 text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-900">Phone Number</p>
            <p className="text-sm text-gray-600">{orderDetails.customer.phone}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MapPin className="mt-0.5 h-5 w-5 text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-900">Delivery Address</p>
            <p className="text-sm text-gray-600">
              {orderDetails.customer.city}, {orderDetails.customer.region}
              <br />
              {orderDetails.customer.country}
              {orderDetails.customer.extraInfo && (
                <>
                  <br />
                  {orderDetails.customer.extraInfo}
                </>
              )}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card className="mt-6 bg-blue-50/50">
      <CardContent className="p-6">
        <h3 className="mb-2 font-semibold text-gray-900">Need Help?</h3>
        <p className="mb-4 text-sm text-gray-600">
          If you have any questions about your order, please contact our support team.
        </p>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => globalThis.open('mailto:support@maltitiaenterprise.com')}
        >
          Contact Support
        </Button>
      </CardContent>
    </Card>
  </motion.div>
);
