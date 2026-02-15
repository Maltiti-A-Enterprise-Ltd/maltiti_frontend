import { JSX } from 'react';
import { OrderStatus, PaymentStatus } from '@/app/api';

export type TrackOrderPageProps = {
  saleId: string;
  email?: string;
};

export type StatusConfigItem = {
  label: string;
  color: string;
  bgColor: string;
  icon: JSX.Element;
  description: string;
};

export type StatusConfig = Record<OrderStatus, StatusConfigItem>;
export type PaymentStatusConfig = Record<PaymentStatus, StatusConfigItem>;
