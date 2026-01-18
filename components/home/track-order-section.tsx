'use client';

import { JSX, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Package, Search, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type TrackOrderSectionProps = Record<string, never>;

export function TrackOrderSection({}: TrackOrderSectionProps): JSX.Element {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleTrackOrder = async (): Promise<void> => {
    if (!email) {
      return;
    }

    setIsSearching(true);
    // Navigate to track order listing page with email
    router.push(`/track-order?email=${encodeURIComponent(email)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      void handleTrackOrder();
    }
  };

  return (
    <section className="relative overflow-hidden bg-linear-to-br from-green-50 via-white to-amber-50 py-20 lg:py-28">
      {/* Decorative Background Pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 h-full w-full bg-[radial-gradient(#0F6938_1px,transparent_1px)] bg-size-[40px_40px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Content - Text and Description */}
          <motion.div
            className="flex flex-col justify-center space-y-6"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Icon Badge */}
            <motion.div
              className="inline-flex w-fit items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-800"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Package className="h-4 w-4" />
              Order Tracking
            </motion.div>

            {/* Heading */}
            <motion.h2
              className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Track Your{' '}
              <span className="bg-linear-to-r from-green-600 to-amber-600 bg-clip-text text-transparent">
                Order
              </span>
            </motion.h2>

            {/* Description */}
            <motion.p
              className="text-lg leading-relaxed text-gray-600 sm:text-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Stay updated on your order&apos;s journey from our warehouse to your doorstep. Enter
              your email address to view all your orders and track their current status in
              real-time.
            </motion.p>

            {/* Features List */}
            <motion.ul
              className="space-y-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {[
                'Real-time order status updates',
                'Delivery tracking information',
                'Order history at your fingertips',
                'Secure and private tracking',
              ].map((feature, index) => (
                <motion.li
                  key={index}
                  className="flex items-center gap-3 text-gray-700"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100">
                    <div className="h-2 w-2 rounded-full bg-green-600" />
                  </div>
                  <span>{feature}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Right Content - Search Card */}
          <motion.div
            className="flex items-center justify-center"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="w-full max-w-lg border-2 border-green-100 shadow-2xl">
              <CardContent className="space-y-6 p-8 sm:p-10">
                {/* Card Header */}
                <div className="space-y-2 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <Search className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Find Your Orders</h3>
                  <p className="text-sm text-gray-600">
                    Enter the email address used during checkout
                  </p>
                </div>

                {/* Search Form */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="track-email" className="text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <Input
                      id="track-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="h-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
                      disabled={isSearching}
                    />
                  </div>

                  <Button
                    onClick={() => void handleTrackOrder()}
                    disabled={!email || isSearching}
                    className="group h-12 w-full rounded-full bg-linear-to-r from-green-600 to-green-700 text-base font-semibold text-white shadow-lg transition-all hover:scale-105 hover:from-green-700 hover:to-green-800 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {isSearching ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        Track Orders
                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </Button>
                </div>

                {/* Help Text */}
                <div className="rounded-lg bg-blue-50 p-4 text-center">
                  <p className="text-sm text-blue-900">
                    <strong>Tip:</strong> You can track multiple orders with the same email address
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
