import { useState, useCallback, useEffect } from 'react';
import {
  OrderStatus,
  PaymentStatus,
  SaleResponseDto,
  salesControllerTrackOrder,
  salesControllerConfirmDelivery,
  salesControllerPayForOrder,
  salesControllerCancelSaleByCustomer,
  salesControllerGenerateInvoice,
  salesControllerGenerateReceipt,
} from '@/app/api';
import { toast } from 'sonner';
import { useAppSelector } from '@/lib/store/hooks';
import { selectIsAuthenticated, selectUser } from '@/lib/store/features/auth';
import { REFUND_TIMELINE } from '@/lib/constants/refund-config';
import { useOrderRealtimeUpdates } from '@/lib/hooks';

export type UseTrackOrderReturn = {
  isLoading: boolean;
  orderDetails: SaleResponseDto | null;
  error: string | null;
  email: string;
  setEmail: (email: string) => void;
  needsEmail: boolean;
  isConfirmingDelivery: boolean;
  isInitializingPayment: boolean;
  isCancellingOrder: boolean;
  isGeneratingDocument: boolean;
  fetchOrderStatus: () => Promise<void>;
  confirmDelivery: () => Promise<void>;
  handlePayNow: () => Promise<void>;
  handleCancelOrder: (reason: string) => Promise<void>;
  handleGenerateInvoice: () => Promise<void>;
  handleGenerateReceipt: () => Promise<void>;
  triedUserEmail: boolean;
  getCancellationStatusMessage: () => string;
  getCancellationDialogMessage: () => string;
};

export const useTrackOrder = (saleId: string, initialEmail?: string): UseTrackOrderReturn => {
  const [isLoading, setIsLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<SaleResponseDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState(initialEmail || '');
  const [needsEmail, setNeedsEmail] = useState(!initialEmail);
  const [triedUserEmail, setTriedUserEmail] = useState(false);
  const [isConfirmingDelivery, setIsConfirmingDelivery] = useState(false);
  const [isInitializingPayment, setIsInitializingPayment] = useState(false);
  const [isCancellingOrder, setIsCancellingOrder] = useState(false);
  const [isGeneratingDocument, setIsGeneratingDocument] = useState(false);

  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);

  const isPaid = orderDetails?.paymentStatus === PaymentStatus.PAID;

  const getCancellationStatusMessage = useCallback((): string => {
    if (!orderDetails) {
      return '';
    }
    const isPending = orderDetails.orderStatus === OrderStatus.PENDING;
    if (isPaid) {
      return isPending
        ? 'You can cancel this order now for a full refund.'
        : 'Cancellation will incur a 10% processing fee as your order is already being prepared.';
    }
    return 'You can cancel this order now.';
  }, [orderDetails, isPaid]);

  const getCancellationDialogMessage = useCallback((): string => {
    if (!orderDetails) {
      return '';
    }
    const isPending = orderDetails.orderStatus === OrderStatus.PENDING;
    if (isPaid) {
      return isPending
        ? `Are you sure you want to cancel? You will receive a full refund to your original payment method (takes ${REFUND_TIMELINE}).`
        : `Are you sure you want to cancel? Since your order is currently being processed, a 10% penalty fee will be deducted from your refund. Refunds take ${REFUND_TIMELINE}.`;
    }
    return 'Are you sure you want to cancel? This action cannot be undone.';
  }, [orderDetails, isPaid]);

  const fetchOrderStatus = useCallback(async (): Promise<void> => {
    if (!email) {
      setNeedsEmail(true);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await salesControllerTrackOrder({
        path: { saleId },
        query: { email },
      });

      if (error || !data) {
        setError('Unable to fetch order details');
        toast.error('Error', {
          description: 'Unable to load order details. Please check your order ID.',
        });
        return;
      }

      setOrderDetails(data.data);
      setNeedsEmail(false);
      setError(null);
    } catch (err) {
      console.error('Error fetching order:', err);
      setError(err instanceof Error ? err.message : 'Failed to load order details');
      toast.error('Error', {
        description: 'Unable to load order details. Please check your order ID.',
      });
      if (isAuthenticated && user?.email && email === user.email && !triedUserEmail) {
        setTriedUserEmail(true);
        setNeedsEmail(true);
      }
    } finally {
      setIsLoading(false);
    }
  }, [saleId, email, isAuthenticated, user, triedUserEmail]);

  const confirmDelivery = useCallback(async (): Promise<void> => {
    try {
      setIsConfirmingDelivery(true);
      const { data, error } = await salesControllerConfirmDelivery({
        path: { id: saleId },
        body: { confirmed: true },
      });

      if (error || !data) {
        toast.error('Confirmation Failed', {
          description: 'Unable to confirm delivery. Please try again.',
        });
        return;
      }

      setOrderDetails(data);
      toast.success('Delivery Confirmed', {
        description: 'Thank you for confirming your delivery!',
      });
    } catch (err) {
      console.error('Error confirming delivery:', err);
      toast.error('Confirmation Failed', {
        description: 'Unable to confirm delivery. Please try again.',
      });
    } finally {
      setIsConfirmingDelivery(false);
    }
  }, [saleId]);

  const handlePayNow = useCallback(async (): Promise<void> => {
    try {
      setIsInitializingPayment(true);
      const { data, error } = await salesControllerPayForOrder({
        path: { saleId },
        query: { email },
      });

      if (error || !data) {
        toast.error('Payment Initialization Failed', {
          description: 'Unable to start payment process. Please try again.',
        });
        return;
      }

      globalThis.location.href = data.data.authorization_url;
    } catch (err) {
      console.error('Error initializing payment:', err);
      toast.error('Payment Initialization Failed', {
        description: 'Unable to start payment process. Please try again.',
      });
    } finally {
      setIsInitializingPayment(false);
    }
  }, [saleId, email]);

  const handleCancelOrder = useCallback(
    async (reason: string): Promise<void> => {
      if (!email) {
        return;
      }

      try {
        setIsCancellingOrder(true);
        const { data, error } = await salesControllerCancelSaleByCustomer({
          path: { id: saleId },
          body: { email, reason: reason || 'Cancelled by customer' },
        });

        if (error || !data) {
          toast.error('Cancellation Failed', {
            description: 'Unable to cancel order. Please try again or contact support.',
          });
          return;
        }

        setOrderDetails(data.sale);
        toast.success('Order Cancelled', {
          description: data.message || 'Your order has been successfully cancelled.',
        });
      } catch (err) {
        console.error('Error cancelling order:', err);
        toast.error('Cancellation Failed', {
          description: 'Unable to cancel order. Please try again or contact support.',
        });
      } finally {
        setIsCancellingOrder(false);
      }
    },
    [saleId, email],
  );

  const downloadBlob = (blob: Blob, filename: string): void => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleGenerateInvoice = useCallback(async (): Promise<void> => {
    try {
      setIsGeneratingDocument(true);
      const { data, error } = await salesControllerGenerateInvoice({
        path: { id: saleId },
        body: {},
        parseAs: 'blob',
      });

      if (error || !data) {
        toast.error('Invoice Generation Failed', {
          description: 'Unable to generate invoice. Please try again.',
        });
        return;
      }

      downloadBlob(data as Blob, `invoice-${saleId}.pdf`);
      toast.success('Invoice Downloaded', {
        description: 'Your invoice has been downloaded successfully.',
      });
    } catch (err) {
      console.error('Error generating invoice:', err);
      toast.error('Invoice Generation Failed', {
        description: 'Unable to generate invoice. Please try again.',
      });
    } finally {
      setIsGeneratingDocument(false);
    }
  }, [saleId]);

  const handleGenerateReceipt = useCallback(async (): Promise<void> => {
    try {
      setIsGeneratingDocument(true);
      const { data, error } = await salesControllerGenerateReceipt({
        path: { id: saleId },
        body: {},
        parseAs: 'blob',
      });

      if (error || !data) {
        toast.error('Receipt Generation Failed', {
          description: 'Unable to generate receipt. Please try again.',
        });
        return;
      }

      downloadBlob(data as Blob, `receipt-${saleId}.pdf`);
      toast.success('Receipt Downloaded', {
        description: 'Your receipt has been downloaded successfully.',
      });
    } catch (err) {
      console.error('Error generating receipt:', err);
      toast.error('Receipt Generation Failed', {
        description: 'Unable to generate receipt. Please try again.',
      });
    } finally {
      setIsGeneratingDocument(false);
    }
  }, [saleId]);

  useEffect(() => {
    if (saleId && !initialEmail && isAuthenticated && user?.email && !triedUserEmail) {
      setEmail(user.email);
      setTriedUserEmail(true);
      void fetchOrderStatus();
    } else if (saleId && initialEmail) {
      void fetchOrderStatus();
    } else if (saleId && !isAuthenticated) {
      setNeedsEmail(true);
      setIsLoading(false);
    }
  }, [saleId, initialEmail, isAuthenticated, user, triedUserEmail, fetchOrderStatus]);

  // Set up real-time order updates
  useOrderRealtimeUpdates({
    saleId,
    enabled: !!orderDetails && !needsEmail,
    onOrderUpdateAction: (payload) => {
      // Refresh order status when we receive an update notification
      void fetchOrderStatus();

      // Show a toast notification based on the update type
      if (payload.status === OrderStatus.PACKAGING) {
        toast.success('Order Update', {
          description: 'Your order is now being processed!',
        });
      } else if (payload.status === OrderStatus.IN_TRANSIT) {
        toast.success('Order Shipped', {
          description: 'Your order has been shipped and is on its way!',
        });
      } else if (payload.status === OrderStatus.DELIVERED) {
        toast.success('Order Delivered', {
          description: 'Your order has been delivered!',
        });
      } else if (payload.status === OrderStatus.CANCELLED) {
        toast.info('Order Cancelled', {
          description: 'Your order has been cancelled.',
        });
      }
    },
  });

  return {
    isLoading,
    orderDetails,
    error,
    email,
    setEmail,
    needsEmail,
    isConfirmingDelivery,
    isInitializingPayment,
    isCancellingOrder,
    isGeneratingDocument,
    fetchOrderStatus,
    confirmDelivery,
    handlePayNow,
    handleCancelOrder,
    handleGenerateInvoice,
    handleGenerateReceipt,
    triedUserEmail,
    getCancellationStatusMessage,
    getCancellationDialogMessage,
  };
};
