import { JSX } from 'react';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

type ErrorStateProps = {
  error: string | null;
};

export const ErrorState = ({ error }: ErrorStateProps): JSX.Element => {
  const router = useRouter();
  return (
    <div className="mt-16 min-h-screen bg-linear-to-br from-gray-50 to-green-50/30 px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <Card className="border-red-200">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-6 rounded-full bg-red-100 p-6">
              <XCircle className="h-16 w-16 text-red-600" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900">Order Not Found</h2>
            <p className="mb-6 text-gray-600">
              {error || 'We couldn&apos;t find an order with this ID.'}
            </p>
            <Button onClick={() => router.push('/shop')}>Continue Shopping</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
