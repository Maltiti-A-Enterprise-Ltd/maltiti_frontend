'use client';

import { JSX, use } from 'react';
import { useSearchParams } from 'next/navigation';
import TrackOrderPage from '@/components/checkout/track-order-page';

type PageProps = {
  params: Promise<{ saleId: string }>;
};

export default function TrackOrder({ params }: PageProps): JSX.Element {
  const { saleId } = use(params);
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || undefined;

  return <TrackOrderPage saleId={saleId} email={email} />;
}
