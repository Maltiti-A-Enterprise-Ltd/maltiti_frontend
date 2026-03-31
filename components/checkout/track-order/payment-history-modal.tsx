'use client';

import { JSX, useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  SalePaymentResponseDto,
  SalePaymentSummaryResponseDto,
  StatusEnum2,
  PaymentMethodEnum,
  salePaymentControllerGetPaymentsForSale,
} from '@/app/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

type PaymentHistoryModalProps = {
  saleId: string;
  isOpen: boolean;
  onCloseAction: () => void;
};

type PaymentStatusConfig = {
  label: string;
  colorClass: string;
  bgClass: string;
  icon: string;
};

const paymentStatusConfig: Record<StatusEnum2, PaymentStatusConfig> = {
  [StatusEnum2.CONFIRMED]: {
    label: 'Confirmed',
    colorClass: 'text-green-700',
    bgClass: 'bg-green-100',
    icon: 'ph:check-circle-duotone',
  },
  [StatusEnum2.PENDING]: {
    label: 'Pending',
    colorClass: 'text-amber-700',
    bgClass: 'bg-amber-100',
    icon: 'ph:clock-duotone',
  },
  [StatusEnum2.FAILED]: {
    label: 'Failed',
    colorClass: 'text-red-700',
    bgClass: 'bg-red-100',
    icon: 'ph:x-circle-duotone',
  },
  [StatusEnum2.REFUNDED]: {
    label: 'Refunded',
    colorClass: 'text-purple-700',
    bgClass: 'bg-purple-100',
    icon: 'ph:arrow-counter-clockwise-duotone',
  },
};

const paymentMethodLabels: Record<PaymentMethodEnum, string> = {
  [PaymentMethodEnum.PAYSTACK]: 'Paystack',
  [PaymentMethodEnum.BANK_TRANSFER]: 'Bank Transfer',
  [PaymentMethodEnum.CASH]: 'Cash',
  [PaymentMethodEnum.MOBILE_MONEY]: 'Mobile Money',
  [PaymentMethodEnum.CHEQUE]: 'Cheque',
  [PaymentMethodEnum.OTHER]: 'Other',
};

const paymentMethodIcons: Record<PaymentMethodEnum, string> = {
  [PaymentMethodEnum.PAYSTACK]: 'ph:credit-card-duotone',
  [PaymentMethodEnum.BANK_TRANSFER]: 'ph:bank-duotone',
  [PaymentMethodEnum.CASH]: 'ph:money-duotone',
  [PaymentMethodEnum.MOBILE_MONEY]: 'ph:device-mobile-duotone',
  [PaymentMethodEnum.CHEQUE]: 'ph:note-duotone',
  [PaymentMethodEnum.OTHER]: 'ph:dots-three-circle-duotone',
};

const formatAmount = (amount: number): string =>
  new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(amount);

const formatDate = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const PaymentRow = ({
  payment,
  index,
}: {
  payment: SalePaymentResponseDto;
  index: number;
}): JSX.Element => {
  const statusCfg = paymentStatusConfig[payment.status];
  const methodLabel = paymentMethodLabels[payment.paymentMethod];
  const methodIcon = paymentMethodIcons[payment.paymentMethod];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      className="rounded-xl border border-gray-100 bg-gray-50/60 p-4 transition-colors hover:bg-gray-50"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
            <Icon icon={methodIcon} className="h-5 w-5 text-gray-600" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-gray-900">{methodLabel}</span>
              <Badge
                variant="outline"
                className={`text-xs font-medium ${statusCfg.colorClass} ${statusCfg.bgClass} border-0`}
              >
                <Icon icon={statusCfg.icon} className="mr-1 h-3 w-3" />
                {statusCfg.label}
              </Badge>
              {payment.isCustomerInitiated && (
                <Badge variant="outline" className="border-0 bg-blue-50 text-xs text-blue-600">
                  Online
                </Badge>
              )}
            </div>
            <p className="mt-0.5 text-xs text-gray-500">{formatDate(payment.createdAt)}</p>
            {payment.reference && (
              <p className="mt-1 font-mono text-xs text-gray-400">Ref: {payment.reference}</p>
            )}
            {payment.note && <p className="mt-1 text-xs text-gray-400 italic">{payment.note}</p>}
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-base font-bold text-gray-900">{formatAmount(payment.amount)}</p>
        </div>
      </div>
    </motion.div>
  );
};

export const PaymentHistoryModal = ({
  saleId,
  isOpen,
  onCloseAction,
}: PaymentHistoryModalProps): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<SalePaymentSummaryResponseDto | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const fetchPayments = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const { data, error } = await salePaymentControllerGetPaymentsForSale({
          path: { saleId },
        });

        if (error || !data) {
          toast.error('Failed to load payments', {
            description: 'Unable to fetch payment history. Please try again.',
          });
          return;
        }

        setSummary(data.data);
      } catch (err) {
        console.error('Error fetching payment history:', err);
        toast.error('Failed to load payments', {
          description: 'Unable to fetch payment history. Please try again.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    void fetchPayments();
  }, [isOpen, saleId]);

  const progressPercent =
    summary && summary.saleTotal > 0
      ? Math.min(100, (summary.totalPaid / summary.saleTotal) * 100)
      : 0;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onCloseAction();
        }
      }}
    >
      <DialogContent className="max-h-[90vh] w-full max-w-lg overflow-hidden p-0">
        {/* Header */}
        <DialogHeader className="border-b border-gray-100 px-6 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
              <Icon icon="ph:receipt-duotone" className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold text-gray-900">
                Payment History
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500">
                All payments recorded for this order
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Body */}
        <div className="overflow-y-auto px-6 pt-4 pb-6" style={{ maxHeight: 'calc(90vh - 130px)' }}>
          <AnimatePresence mode="wait">
            {isLoading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-16"
              >
                <Loader2 className="h-8 w-8 animate-spin text-green-500" />
                <p className="mt-3 text-sm text-gray-500">Loading payment history…</p>
              </motion.div>
            )}

            {!isLoading && !summary && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-16"
              >
                <Icon icon="ph:warning-circle-duotone" className="h-12 w-12 text-amber-400" />
                <p className="mt-3 text-sm font-medium text-gray-700">Unable to load payments</p>
                <p className="text-xs text-gray-500">Please close and try again.</p>
              </motion.div>
            )}

            {!isLoading && summary && (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-5"
              >
                {/* Summary cards */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-xl bg-gray-50 p-3 text-center">
                    <p className="text-xs font-medium text-gray-500">Order Total</p>
                    <p className="mt-1 text-sm font-bold text-gray-900">
                      {formatAmount(summary.saleTotal)}
                    </p>
                  </div>
                  <div className="rounded-xl bg-green-50 p-3 text-center">
                    <p className="text-xs font-medium text-green-600">Total Paid</p>
                    <p className="mt-1 text-sm font-bold text-green-700">
                      {formatAmount(summary.totalPaid)}
                    </p>
                  </div>
                  <div
                    className={`rounded-xl p-3 text-center ${summary.balanceRemaining <= 0 ? 'bg-green-50' : 'bg-red-50'}`}
                  >
                    <p
                      className={`text-xs font-medium ${summary.balanceRemaining <= 0 ? 'text-green-600' : 'text-red-500'}`}
                    >
                      Balance
                    </p>
                    <p
                      className={`mt-1 text-sm font-bold ${summary.balanceRemaining <= 0 ? 'text-green-700' : 'text-red-600'}`}
                    >
                      {summary.balanceRemaining <= 0
                        ? 'Fully Paid'
                        : formatAmount(summary.balanceRemaining)}
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between text-xs text-gray-500">
                    <span>Payment progress</span>
                    <span className="font-medium text-gray-700">{progressPercent.toFixed(0)}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.7, ease: 'easeOut' }}
                      className={`h-full rounded-full ${progressPercent >= 100 ? 'bg-green-500' : 'bg-amber-500'}`}
                    />
                  </div>
                </div>

                <Separator />

                {/* Payment list */}
                <div>
                  <h4 className="mb-3 text-xs font-semibold tracking-wide text-gray-400 uppercase">
                    Transactions ({summary.payments.length})
                  </h4>

                  {summary.payments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 py-10">
                      <Icon icon="ph:receipt-x-duotone" className="h-10 w-10 text-gray-300" />
                      <p className="mt-3 text-sm font-medium text-gray-500">No payments recorded</p>
                      <p className="text-xs text-gray-400">
                        Payments will appear here once processed.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {summary.payments.map((payment, index) => (
                        <PaymentRow key={payment.id} payment={payment} index={index} />
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};
