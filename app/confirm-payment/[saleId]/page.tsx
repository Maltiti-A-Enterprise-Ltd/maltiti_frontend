'use client';

import { JSX, use } from 'react';
import ConfirmPaymentPage from '@/components/checkout/confirm-payment-page';

type ConfirmPaymentProps = {
  params: Promise<{ saleId: string }>;
};

export default function ConfirmPayment({ params }: ConfirmPaymentProps): JSX.Element {
  const { saleId } = use(params);
  return <ConfirmPaymentPage saleId={saleId} />;
}
