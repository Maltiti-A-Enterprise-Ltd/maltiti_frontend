import { JSX } from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingState = (): JSX.Element => (
  <div className="mt-16 flex min-h-screen items-center justify-center bg-linear-to-br from-gray-50 to-green-50/30">
    <div className="text-center">
      <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-green-600" />
      <p className="text-gray-600">Loading order details...</p>
    </div>
  </div>
);
