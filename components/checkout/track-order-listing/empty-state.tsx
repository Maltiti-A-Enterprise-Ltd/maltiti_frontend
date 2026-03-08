import { JSX } from 'react';
import { motion } from 'framer-motion';
import { Loader2, PackageSearch, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type EmptyStateProps = {
  type: 'no-search' | 'no-results' | 'loading';
  email?: string;
  onStartShopping?: () => void;
  onTryAnotherEmail?: () => void;
};

export function EmptyState({
  type,
  email,
  onStartShopping,
  onTryAnotherEmail,
}: Readonly<EmptyStateProps>): JSX.Element {
  if (type === 'loading') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center py-20"
      >
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-green-600" />
          <p className="text-gray-600">Searching for your orders...</p>
        </div>
      </motion.div>
    );
  }

  if (type === 'no-search') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-6 rounded-full bg-green-100 p-6">
              <PackageSearch className="h-16 w-16 text-green-600" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900">Start Tracking</h2>
            <p className="mb-6 max-w-md text-gray-600">
              Enter your email address above to view all orders associated with your account
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (type === 'no-results') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="border-yellow-200 bg-yellow-50/50">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-6 rounded-full bg-yellow-100 p-6">
              <AlertCircle className="h-16 w-16 text-yellow-600" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900">No Orders Found</h2>
            <p className="mb-6 max-w-md text-gray-600">
              We couldn&apos;t find any orders associated with{' '}
              <span className="font-medium">{email}</span>
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button onClick={onStartShopping} className="bg-[#0F6938] hover:bg-[#0F6938]/90">
                Start Shopping
              </Button>
              <Button variant="outline" onClick={onTryAnotherEmail}>
                Try Another Email
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return <></>;
}
