import { JSX } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type HelpSectionProps = {
  onContactSupport: () => void;
  onContinueShopping: () => void;
};

export function HelpSection({
  onContactSupport,
  onContinueShopping,
}: Readonly<HelpSectionProps>): JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="mt-8"
    >
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="text-lg">Need Help?</CardTitle>
          <CardDescription>
            If you have any questions about your orders or need assistance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="outline" onClick={onContactSupport}>
              Contact Support
            </Button>
            <Button variant="outline" onClick={onContinueShopping}>
              Continue Shopping
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
