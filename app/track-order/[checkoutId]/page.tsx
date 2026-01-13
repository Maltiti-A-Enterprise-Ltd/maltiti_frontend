'use client';

import { JSX, use } from 'react';
import { useSearchParams } from 'next/navigation';
import TrackOrderPage from '@/components/checkout/track-order-page';

type PageProps = {
  params: Promise<{ checkoutId: string }>;
};

export default function TrackOrder({ params }: PageProps): JSX.Element {
  const { checkoutId } = use(params);
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || undefined;

  return <TrackOrderPage checkoutId={checkoutId} email={email} />;
}
