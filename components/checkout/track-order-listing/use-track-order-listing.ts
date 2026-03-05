import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  OrderStatus,
  PaymentStatus,
  SaleResponseDto,
  salesControllerListSalesByEmail,
  SalesControllerListSalesByEmailData,
  TopicEnum,
} from '@/app/api';
import { toast } from 'sonner';
import { useAppSelector } from '@/lib/store/hooks';
import { selectIsAuthenticated, selectUser, selectUserEmail } from '@/lib/store/features/auth';
import { isValidEmail } from './helpers';
import { useNotificationTopic } from '@/lib/hooks';

type UseTrackOrderListingReturn = {
  email: string;
  setEmail: (email: string) => void;
  searchInput: string;
  setSearchInput: (input: string) => void;
  isLoading: boolean;
  orders: SaleResponseDto[];
  hasSearched: boolean;
  showSearchCard: boolean;
  setShowSearchCard: (show: boolean) => void;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  filters: Pick<SalesControllerListSalesByEmailData['query'], 'paymentStatus' | 'orderStatus'>;
  setFilters: (
    filters: Pick<SalesControllerListSalesByEmailData['query'], 'paymentStatus' | 'orderStatus'>,
  ) => void;
  activeFilterCount: number;
  handleSearch: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleApplyFilters: () => void;
  handleClearFilters: () => void;
  handleViewOrder: (saleId: string) => void;
  handlePageChange: (newPage: number) => void;
  handleRemoveStatusFilter: () => void;
  handleRemovePaymentFilter: () => void;
  handleResetSearch: () => void;
};

export const useTrackOrderListing = (): UseTrackOrderListingReturn => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get('email');

  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const userEmail = useAppSelector(selectUserEmail);
  const user = useAppSelector(selectUser);

  const [email, setEmail] = useState(emailFromQuery || userEmail || '');
  const [searchInput, setSearchInput] = useState(emailFromQuery || userEmail || '');
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState<SaleResponseDto[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [showSearchCard, setShowSearchCard] = useState(!isAuthenticated || !user?.email);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState<
    Pick<SalesControllerListSalesByEmailData['query'], 'paymentStatus' | 'orderStatus'>
  >({
    orderStatus: (searchParams.get('status') as OrderStatus) || undefined,
    paymentStatus: (searchParams.get('paymentStatus') as PaymentStatus) || undefined,
  });

  const activeFilterCount = (): number => {
    let count = 0;
    if (filters.orderStatus) {
      count++;
    }
    if (filters.paymentStatus) {
      count++;
    }
    return count;
  };

  const fetchOrders = useCallback(
    async (
      emailToSearch: string,
      page: number = 1,
      filterOverrides?: Pick<
        SalesControllerListSalesByEmailData['query'],
        'paymentStatus' | 'orderStatus'
      >,
    ): Promise<void> => {
      if (!emailToSearch) {
        toast.error('Please enter an email address');
        return;
      }

      setIsLoading(true);
      setHasSearched(true);

      const filtersToUse = filterOverrides || filters;

      try {
        const { data, error } = await salesControllerListSalesByEmail({
          query: {
            email: emailToSearch,
            page,
            limit: 10,
            orderStatus: filtersToUse.orderStatus,
            paymentStatus: filtersToUse.paymentStatus,
          },
        });

        if (error || !data) {
          console.error('Error fetching orders:', error);
          toast.error('Error', {
            description: 'Unable to load orders. Please try again.',
          });
          setOrders([]);
          setTotalPages(1);
          setTotalItems(0);
          return;
        }

        setOrders(data.data.items);
        setCurrentPage(data.data.currentPage || page);
        setTotalPages(data.data.totalPages || 1);
        setTotalItems(data.data.totalItems || data.data.items.length);

        if (data.data.items.length === 0) {
          toast.info('No orders found', {
            description: `No orders found for ${emailToSearch}`,
          });
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        toast.error('Error', {
          description: 'Unable to load orders. Please try again.',
        });
        setOrders([]);
        setTotalPages(1);
        setTotalItems(0);
      } finally {
        setIsLoading(false);
      }
    },
    [filters],
  );

  useNotificationTopic(Object.values(TopicEnum), (notification) => {
    if (notification.topic === TopicEnum.ORDER_STATUS_UPDATED) {
      void fetchOrders(email);
    }
  });

  useEffect(() => {
    if (emailFromQuery) {
      void fetchOrders(emailFromQuery);
    } else if (isAuthenticated && user?.email && !hasSearched) {
      setEmail(user.email);
      void fetchOrders(user.email);
    }
  }, [emailFromQuery, isAuthenticated, user, hasSearched]);

  const handleSearch = (): void => {
    const trimmedInput = searchInput.trim();

    if (!trimmedInput) {
      toast.error('Please enter an email address');
      return;
    }

    if (!isValidEmail(trimmedInput)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setEmail(trimmedInput);
    setCurrentPage(1);
    router.push(`/track-order?email=${encodeURIComponent(trimmedInput)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleApplyFilters = (): void => {
    if (!email) {
      toast.error('Please search for orders first');
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    if (filters.orderStatus) {
      params.set('status', filters.orderStatus);
    } else {
      params.delete('status');
    }
    if (filters.paymentStatus) {
      params.set('paymentStatus', filters.paymentStatus);
    } else {
      params.delete('paymentStatus');
    }

    if (email) {
      params.set('email', email);
    }

    router.push(`/track-order?${params.toString()}`);
    setCurrentPage(1);
    // Pass current filters explicitly to fetchOrders
    void fetchOrders(email, 1, filters);
  };

  const handleClearFilters = (): void => {
    if (!email) {
      return;
    }

    const clearedFilters = {
      orderStatus: undefined,
      paymentStatus: undefined,
    };

    setFilters(clearedFilters);

    const params = new URLSearchParams();
    if (email) {
      params.set('email', email);
    }
    router.push(`/track-order?${params.toString()}`);

    setCurrentPage(1);
    // Pass cleared filters explicitly
    void fetchOrders(email, 1, clearedFilters);
  };

  const handleRemoveStatusFilter = (): void => {
    const updatedFilters = { ...filters, orderStatus: undefined };
    setFilters(updatedFilters);

    const params = new URLSearchParams(searchParams.toString());
    params.delete('status');
    if (email) {
      params.set('email', email);
    }
    router.push(`/track-order?${params.toString()}`);
    void fetchOrders(email, 1, updatedFilters);
  };

  const handleRemovePaymentFilter = (): void => {
    const updatedFilters = { ...filters, paymentStatus: undefined };
    setFilters(updatedFilters);

    const params = new URLSearchParams(searchParams.toString());
    params.delete('paymentStatus');
    if (email) {
      params.set('email', email);
    }
    router.push(`/track-order?${params.toString()}`);
    void fetchOrders(email, 1, updatedFilters);
  };

  const handleViewOrder = (saleId: string): void => {
    router.push(`/track-order/${saleId}?email=${encodeURIComponent(email)}`);
  };

  const handlePageChange = (newPage: number): void => {
    if (newPage < 1 || newPage > totalPages || isLoading) {
      return;
    }
    setCurrentPage(newPage);
    void fetchOrders(email, newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetSearch = (): void => {
    setSearchInput('');
    setEmail('');
    setHasSearched(false);
    setOrders([]);
  };

  return {
    email,
    setEmail,
    searchInput,
    setSearchInput,
    isLoading,
    orders,
    hasSearched,
    showSearchCard,
    setShowSearchCard,
    currentPage,
    totalPages,
    totalItems,
    filters,
    setFilters,
    activeFilterCount: activeFilterCount(),
    handleSearch,
    handleKeyDown,
    handleApplyFilters,
    handleClearFilters,
    handleViewOrder,
    handlePageChange,
    handleRemoveStatusFilter,
    handleRemovePaymentFilter,
    handleResetSearch,
  };
};
