'use client';

import { JSX, use } from 'react';
import ConfirmPaymentPage from '@/components/checkout/confirm-payment-page';

type ConfirmPaymentProps = {
  params: Promise<{ checkoutId: string }>;
};

export default function ConfirmPayment({ params }: ConfirmPaymentProps): JSX.Element {
  const { checkoutId } = use(params);
  return <ConfirmPaymentPage checkoutId={checkoutId} />;
}
