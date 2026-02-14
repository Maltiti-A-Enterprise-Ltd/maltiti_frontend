'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { getGuestSessionId } from '@/lib/session-utils';
import { useCart } from '@/lib/store/useCart';
import {
  checkoutControllerInitializeTransaction,
  checkoutControllerGetDeliveryCost,
  checkoutControllerPlaceOrder,
  checkoutControllerGuestInitializeTransaction,
  checkoutControllerGuestPlaceOrder,
  checkoutControllerGetGuestDeliveryCost,
  customerControllerGetMyCustomer,
  InitializeTransaction,
  GetDeliveryCostDto,
  PlaceOrderDto,
  GuestInitializeTransactionDto,
  GuestPlaceOrderDto,
  CustomerResponseDto,
  CartItemDto,
} from '@/app/api';
import { GuestLocationFormValues } from '@/components/checkout/guest-location-form';

export type LocationData = {
  country: string;
  region: string;
  city: string;
  phoneNumber: string;
  extraInfo?: string;
};

export type GuestLocationData = GuestLocationFormValues;

export type UseCheckoutReturn = {
  // State
  isCartLoading: boolean;
  isProcessing: boolean;
  locationData: LocationData | null;
  guestLocationData: GuestLocationData | null;
  deliveryCost: number | null;
  isCalculatingDelivery: boolean;
  isInternationalDelivery: boolean;
  showGuestCheckout: boolean;
  deliveryError: string | null;
  isLoadingCustomerData: boolean;
  customerData: CustomerResponseDto | null;
  checkoutButtonRef: React.RefObject<HTMLButtonElement | null>;
  items: CartItemDto[];
  totalPrice: number;
  isAuthenticated: boolean;

  // Handlers
  handleLocationSubmit: (data: LocationData) => void;
  handleGuestLocationSubmit: (data: GuestLocationData) => void;
  handleContinueAsGuest: () => void;
  handleCheckout: () => Promise<void>;
  handleResetLocation: () => void;
  handleResetGuestLocation: () => void;
  handleRetryDelivery: () => void;
};

export const useCheckout = (): UseCheckoutReturn => {
  const router = useRouter();
  const { items, totalPrice, isLoading, isFetching, isAuthenticated } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [guestLocationData, setGuestLocationData] = useState<GuestLocationData | null>(null);
  const [deliveryCost, setDeliveryCost] = useState<number | null>(null);
  const [isCalculatingDelivery, setIsCalculatingDelivery] = useState(false);
  const [isInternationalDelivery, setIsInternationalDelivery] = useState(false);
  const [showGuestCheckout, setShowGuestCheckout] = useState(false);
  const [deliveryError, setDeliveryError] = useState<string | null>(null);
  const [isLoadingCustomerData, setIsLoadingCustomerData] = useState(false);
  const [customerData, setCustomerData] = useState<CustomerResponseDto | null>(null);

  const checkoutButtonRef = useRef<HTMLButtonElement | null>(null);

  const isCartLoading = isLoading || isFetching;

  // Fetch customer data for logged-in users
  useEffect(() => {
    const fetchCustomerData = async (): Promise<void> => {
      if (!isAuthenticated) {
        return;
      }

      setIsLoadingCustomerData(true);
      try {
        const { data, error } = await customerControllerGetMyCustomer();

        if (error) {
          console.log('No existing customer data found');
          return;
        }

        if (data) {
          setCustomerData(data.data);
        }
      } catch (error) {
        // Silently handle errors - user can still fill in the form manually
        console.error('Error fetching customer data:', error);
      } finally {
        setIsLoadingCustomerData(false);
      }
    };

    void fetchCustomerData();
  }, [isAuthenticated]);

  const scrollToCheckout = (): void => {
    if (window.innerWidth < 1025 && checkoutButtonRef.current) {
      setTimeout(() => {
        checkoutButtonRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 300);
    }
  };

  const calculateDeliveryCost = async (location: LocationData): Promise<void> => {
    setIsCalculatingDelivery(true);
    setIsInternationalDelivery(false);
    setDeliveryError(null);

    try {
      const payload: GetDeliveryCostDto = {
        country: location.country,
        region: location.region,
        city: location.city,
      };

      const response = await checkoutControllerGetDeliveryCost({
        body: payload,
      });

      if (response.error || !response.data) {
        throw new Error('Unable to calculate delivery cost');
      }

      // response.data is already DeliveryResponseDto
      if (typeof response.data.data !== 'number') {
        throw new TypeError('Invalid delivery cost response');
      }

      const cost = response.data.data;

      if (cost === -1) {
        // International delivery - cost will be determined later
        setIsInternationalDelivery(true);
        setDeliveryCost(null);
        toast.info('International Delivery', {
          description:
            'We will contact you regarding delivery costs for international orders. Please proceed to complete your order.',
          duration: 6000,
        });
      } else {
        setDeliveryCost(cost);
        setIsInternationalDelivery(false);
      }
      scrollToCheckout();
    } catch (error) {
      console.error('Delivery cost calculation error:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Unable to calculate delivery cost. Please try again.';
      setDeliveryError(errorMessage);
      toast.error('Delivery Calculation Failed', {
        description: errorMessage,
      });
    } finally {
      setIsCalculatingDelivery(false);
    }
  };

  const handleLocationSubmit = (data: LocationData): void => {
    setLocationData(data);
    // Calculate delivery cost when location is submitted
    void calculateDeliveryCost(data);
  };

  const calculateGuestDeliveryCost = async (location: GuestLocationData): Promise<void> => {
    setIsCalculatingDelivery(true);
    setIsInternationalDelivery(false);
    setDeliveryError(null);

    try {
      const sessionId = getGuestSessionId();

      const response = await checkoutControllerGetGuestDeliveryCost({
        body: {
          sessionId,
          country: location.country,
          region: location.region,
          city: location.city,
        },
      });

      if (response.error || !response.data) {
        throw new Error('Unable to calculate delivery cost');
      }

      if (typeof response.data.data !== 'number') {
        throw new TypeError('Invalid delivery cost response');
      }

      const cost = response.data.data;

      if (cost === -1) {
        setIsInternationalDelivery(true);
        setDeliveryCost(null);
        toast.info('International Delivery', {
          description:
            'We will contact you regarding delivery costs for international orders. Please proceed to complete your order.',
          duration: 6000,
        });
      } else {
        setDeliveryCost(cost);
        setIsInternationalDelivery(false);
      }
      scrollToCheckout();
    } catch (error) {
      console.error('Delivery cost calculation error:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Unable to calculate delivery cost. Please try again.';
      setDeliveryError(errorMessage);
      toast.error('Delivery Calculation Failed', {
        description: errorMessage,
      });
    } finally {
      setIsCalculatingDelivery(false);
    }
  };

  const handleGuestLocationSubmit = (data: GuestLocationData): void => {
    setGuestLocationData(data);
    void calculateGuestDeliveryCost(data);
  };

  const handleContinueAsGuest = (): void => {
    setShowGuestCheckout(true);
    if (window.innerWidth < 1025) {
      window.scroll({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  const handleCheckout = async (): Promise<void> => {
    // Validate location data based on user type
    if (isAuthenticated && !locationData) {
      toast.error('Location Required', {
        description: 'Please fill in your delivery location details.',
      });
      return;
    }

    if (!isAuthenticated && !guestLocationData) {
      toast.error('Information Required', {
        description: 'Please fill in your delivery information.',
      });
      return;
    }

    if (items.length === 0) {
      toast.error('Empty Cart', {
        description: 'Your cart is empty. Please add items to checkout.',
      });
      return;
    }

    setIsProcessing(true);

    try {
      if (isAuthenticated && locationData) {
        // Authenticated user checkout flow
        if (isInternationalDelivery || deliveryCost === null) {
          const payload: PlaceOrderDto = {
            country: locationData.country,
            region: locationData.region,
            city: locationData.city,
            phoneNumber: locationData.phoneNumber,
            extraInfo: locationData.extraInfo,
          };

          const { data, error } = await checkoutControllerPlaceOrder({
            body: payload,
          });

          if (!data || error) {
            throw new Error('Unable to place order. Please try again.');
          }

          toast.success('Order Placed Successfully!', {
            description:
              'Your order has been placed. We will contact you with the delivery cost and you can make payment from your orders page.',
            duration: 8000,
          });

          setTimeout(() => {
            router.push('/track-order');
          }, 2000);
        } else {
          // Normal flow: proceed to payment
          const payload: InitializeTransaction = {
            country: locationData.country,
            region: locationData.region,
            city: locationData.city,
            phoneNumber: locationData.phoneNumber,
            extraInfo: locationData.extraInfo,
          };

          const { data, error } = await checkoutControllerInitializeTransaction({
            body: payload,
          });

          if (!data || error) {
            throw new Error('Unable to initialize payment. Please try again.');
          }

          const paymentLink = data.data.authorization_url;

          if (paymentLink) {
            globalThis.location.href = paymentLink;
          } else {
            throw new Error('Payment link not received');
          }
        }
      } else if (!isAuthenticated && guestLocationData) {
        // Guest checkout flow
        const sessionId = getGuestSessionId();

        if (isInternationalDelivery || deliveryCost === null) {
          const payload: GuestPlaceOrderDto = {
            email: guestLocationData.email,
            sessionId,
            country: guestLocationData.country,
            region: guestLocationData.region,
            city: guestLocationData.city,
            phoneNumber: guestLocationData.phoneNumber,
            extraInfo: guestLocationData.extraInfo,
            name: guestLocationData.name,
          };

          const { data, error } = await checkoutControllerGuestPlaceOrder({
            body: payload,
          });

          if (!data || error) {
            throw new Error('Unable to place order. Please try again.');
          }

          toast.success('Order Placed Successfully!', {
            description:
              'Your order has been placed. We will contact you via email with the delivery cost and payment instructions.',
            duration: 8000,
          });

          // Redirect to order tracking page
          setTimeout(() => {
            router.push(`/track-order/${data.data.id}`);
          }, 2000);
        } else {
          // Normal flow: proceed to payment
          const payload: GuestInitializeTransactionDto = {
            email: guestLocationData.email,
            sessionId,
            country: guestLocationData.country,
            region: guestLocationData.region,
            city: guestLocationData.city,
            phoneNumber: guestLocationData.phoneNumber,
            extraInfo: guestLocationData.extraInfo,
            name: guestLocationData.name,
          };

          const { data, error } = await checkoutControllerGuestInitializeTransaction({
            body: payload,
          });

          if (!data || error) {
            throw new Error('Unable to initialize payment. Please try again.');
          }

          const paymentLink = data.data.authorization_url;

          if (paymentLink) {
            globalThis.location.href = paymentLink;
          } else {
            throw new Error('Payment link not received');
          }
        }
      }
    } catch (error) {
      console.error('Checkout error:', error);

      const getErrorDescription = (error: unknown, isInternationalDelivery: boolean): string => {
        if (error instanceof Error) {
          return error.message;
        }

        return isInternationalDelivery
          ? 'Unable to place order. Please try again.'
          : 'Unable to initialize payment. Please try again.';
      };

      toast.error(
        isInternationalDelivery ? 'Order Placement Failed' : 'Payment Initialization Failed',
        {
          description: getErrorDescription(error, isInternationalDelivery),
        },
      );
      setIsProcessing(false);
    }
  };

  const handleResetLocation = (): void => {
    setLocationData(null);
  };

  const handleResetGuestLocation = (): void => {
    setGuestLocationData(null);
  };

  const handleRetryDelivery = (): void => {
    if (isAuthenticated && locationData) {
      void calculateDeliveryCost(locationData);
    } else if (!isAuthenticated && guestLocationData) {
      void calculateGuestDeliveryCost(guestLocationData);
    }
  };

  return {
    // State
    isCartLoading,
    isProcessing,
    locationData,
    guestLocationData,
    deliveryCost,
    isCalculatingDelivery,
    isInternationalDelivery,
    showGuestCheckout,
    deliveryError,
    isLoadingCustomerData,
    customerData,
    checkoutButtonRef,
    items,
    totalPrice,
    isAuthenticated,

    // Handlers
    handleLocationSubmit,
    handleGuestLocationSubmit,
    handleContinueAsGuest,
    handleCheckout,
    handleResetLocation,
    handleResetGuestLocation,
    handleRetryDelivery,
  };
};
