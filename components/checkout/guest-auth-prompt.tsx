import { type JSX } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, UserPlus, ShoppingCart, CheckCircle, Clock, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type GuestAuthPromptProps = {
  onContinueAsGuest: () => void;
};

const GuestAuthPrompt = ({ onContinueAsGuest }: GuestAuthPromptProps): JSX.Element => {
  const router = useRouter();

  const benefits = [
    {
      icon: Clock,
      title: 'Order Tracking',
      description: 'Track your orders anytime from your dashboard',
    },
    {
      icon: Package,
      title: 'Order History',
      description: 'View all your past purchases in one place',
    },
    {
      icon: CheckCircle,
      title: 'Faster Checkout',
      description: 'Save delivery info for quicker future purchases',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <Card className="border-2 border-green-100 bg-gradient-to-br from-white to-green-50/30 shadow-lg">
        <CardContent className="p-8">
          {/* Header */}
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-lg">
              <ShoppingCart className="h-8 w-8 text-white" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900">Ready to Complete Your Order?</h2>
            <p className="text-gray-600">Sign in for the best experience, or continue as a guest</p>
          </div>

          {/* Benefits Grid */}
          <div className="mb-8 grid gap-4 md:grid-cols-3">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="rounded-lg bg-white p-4 text-center shadow-sm"
                >
                  <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                    <Icon className="h-5 w-5 text-green-600" />
                  </div>
                  <h3 className="mb-1 text-sm font-semibold text-gray-900">{benefit.title}</h3>
                  <p className="text-xs text-gray-600">{benefit.description}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Button
              onClick={() => router.push('/auth/login')}
              className="group relative h-12 overflow-hidden bg-gradient-to-r from-green-600 to-green-700 text-base font-semibold shadow-md transition-all hover:from-green-700 hover:to-green-800 hover:shadow-lg"
            >
              <motion.div
                className="absolute inset-0 bg-white opacity-0 transition-opacity group-hover:opacity-10"
                whileHover={{ scale: 1.05 }}
              />
              <User className="mr-2 h-5 w-5" />
              Sign In
            </Button>

            <Button
              onClick={() => router.push('/auth/signup')}
              variant="outline"
              className="h-12 border-2 border-green-600 bg-white text-base font-semibold text-green-700 transition-all hover:bg-green-50 hover:text-green-800"
            >
              <UserPlus className="mr-2 h-5 w-5" />
              Create Account
            </Button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-gradient-to-br from-white to-green-50/30 px-4 text-gray-500">
                or
              </span>
            </div>
          </div>

          {/* Guest Checkout */}
          <div className="text-center">
            <Button
              onClick={onContinueAsGuest}
              variant="ghost"
              className="h-12 w-full text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              Continue as Guest
            </Button>
            <p className="mt-3 text-xs text-gray-500">
              You&apos;ll receive an order tracking link via email
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default GuestAuthPrompt;
