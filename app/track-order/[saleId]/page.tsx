'use client';

import { JSX, use } from 'react';
import { useSearchParams } from 'next/navigation';
import TrackOrderPage from '@/components/checkout/track-order-page';
import { useAppSelector } from '@/lib/store/hooks';
import { selectUserEmail } from '@/lib/store/features/auth';

type PageProps = {
  params: Promise<{ saleId: string }>;
};

export default function TrackOrder({ params }: Readonly<PageProps>): JSX.Element {
  const userEmail = useAppSelector(selectUserEmail);
  const { saleId } = use(params);
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || userEmail;

  return <TrackOrderPage saleId={saleId} email={email} />;
}
