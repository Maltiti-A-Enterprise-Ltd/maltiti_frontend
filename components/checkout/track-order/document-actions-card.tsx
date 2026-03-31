'use client';

import { JSX } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { PaymentStatus, SaleResponseDto } from '@/app/api';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

type DocumentActionsCardProps = {
  orderDetails: SaleResponseDto;
  isGeneratingDocument: boolean;
  onGenerateInvoiceAction: () => void;
  onGenerateReceiptAction: () => void;
  onViewPaymentsAction: () => void;
};

type DocumentConfig = {
  type: 'invoice' | 'receipt';
  title: string;
  description: string;
  badgeLabel: string;
  badgeColorClass: string;
  badgeBgClass: string;
  buttonLabel: string;
  buttonIcon: string;
  accentColorClass: string;
  bgColorClass: string;
  borderColorClass: string;
  iconColorClass: string;
  iconBgClass: string;
  illustrationIcon: string;
};

const getDocumentConfig = (paymentStatus: PaymentStatus): DocumentConfig => {
  const isPaid = paymentStatus === PaymentStatus.PAID || paymentStatus === PaymentStatus.REFUNDED;

  if (isPaid) {
    return {
      type: 'receipt',
      title: 'Payment Receipt',
      description:
        'Your payment has been confirmed. Download your official receipt as proof of purchase for this order.',
      badgeLabel: 'Payment Confirmed',
      badgeColorClass: 'text-green-700',
      badgeBgClass: 'bg-green-100',
      buttonLabel: 'Download Receipt',
      buttonIcon: 'ph:receipt',
      accentColorClass: 'text-green-700',
      bgColorClass: 'bg-gradient-to-br from-green-50 to-emerald-50/60',
      borderColorClass: 'border-green-200',
      iconColorClass: 'text-green-600',
      iconBgClass: 'bg-green-100',
      illustrationIcon: 'ph:receipt-duotone',
    };
  }

  return {
    type: 'invoice',
    title: 'Order Invoice',
    description:
      'Your order is awaiting payment. Download your invoice to review the order details and proceed with payment at your convenience.',
    badgeLabel: 'Payment Pending',
    badgeColorClass: 'text-amber-700',
    badgeBgClass: 'bg-amber-100',
    buttonLabel: 'Download Invoice',
    buttonIcon: 'ph:file-text',
    accentColorClass: 'text-amber-700',
    bgColorClass: 'bg-gradient-to-br from-amber-50 to-orange-50/60',
    borderColorClass: 'border-amber-200',
    iconColorClass: 'text-amber-600',
    iconBgClass: 'bg-amber-100',
    illustrationIcon: 'ph:file-text-duotone',
  };
};

export const DocumentActionsCard = ({
  orderDetails,
  isGeneratingDocument,
  onGenerateInvoiceAction,
  onGenerateReceiptAction,
  onViewPaymentsAction,
}: DocumentActionsCardProps): JSX.Element => {
  const config = getDocumentConfig(orderDetails.paymentStatus);

  const handleAction =
    config.type === 'receipt' ? onGenerateReceiptAction : onGenerateInvoiceAction;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <Card className={`border-2 ${config.borderColorClass} overflow-hidden`}>
        <CardContent className="p-0">
          <div className={`${config.bgColorClass} p-6`}>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              {/* Left: Icon + Text */}
              <div className="flex items-start gap-4">
                <motion.div
                  className={`shrink-0 rounded-xl ${config.iconBgClass} p-3 shadow-sm`}
                  whileHover={{ scale: 1.05, rotate: -3 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Icon
                    icon={config.illustrationIcon}
                    className={`h-7 w-7 ${config.iconColorClass}`}
                  />
                </motion.div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-semibold text-gray-900">{config.title}</h3>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.badgeColorClass} ${config.badgeBgClass}`}
                    >
                      {config.badgeLabel}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-600">{config.description}</p>
                </div>
              </div>

              {/* Right: Action Buttons */}
              <div className="flex shrink-0 flex-col gap-2 pl-0 sm:pl-2">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handleAction}
                    disabled={isGeneratingDocument}
                    className={
                      config.type === 'receipt'
                        ? 'w-full bg-green-600 px-5 font-medium text-white shadow-sm hover:bg-green-700'
                        : 'w-full bg-amber-600 px-5 font-medium text-white shadow-sm hover:bg-amber-700'
                    }
                  >
                    {isGeneratingDocument ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Icon icon={config.buttonIcon} className="mr-2 h-4 w-4" />
                        {config.buttonLabel}
                      </>
                    )}
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="outline"
                    onClick={onViewPaymentsAction}
                    className="w-full border-gray-200 bg-white/70 px-5 font-medium text-gray-700 hover:bg-white hover:text-gray-900"
                  >
                    <Icon icon="ph:list-bullets-duotone" className="mr-2 h-4 w-4 text-gray-500" />
                    View Payments
                  </Button>
                </motion.div>
              </div>
            </div>

            {/* PDF hint */}
            <div className="mt-4 flex items-center gap-1.5 text-xs text-gray-500">
              <Icon icon="ph:file-pdf" className="h-3.5 w-3.5 text-red-400" />
              <span>Downloads as a PDF file · Opens in your default PDF viewer</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
