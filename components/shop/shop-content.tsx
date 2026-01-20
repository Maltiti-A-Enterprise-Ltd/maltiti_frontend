'use client';

import { JSX, useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Icon } from '@iconify/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  ProductFilters,
  ProductsGrid,
  ShopPagination,
  ProductGridSkeleton,
} from '@/components/shop';
import {
  ProductCategory,
  ProductGrade,
  productsControllerGetAllProducts,
  ProductSortBy,
  ProductsPaginationResponse,
  ProductStatus,
  SortOrder,
  UnitOfMeasurement,
} from '@/app/api';
import { toast } from 'sonner';
import Link from 'next/link';

type FilterState = {
  category?: ProductCategory;
  status?: ProductStatus;
  grade?: ProductGrade;
  unitOfMeasurement?: UnitOfMeasurement;
  isFeatured?: boolean;
  isOrganic?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: ProductSortBy;
  sortOrder?: SortOrder;
  page: number;
  limit: number;
};

export function ShopContent(): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [productsData, setProductsData] = useState<ProductsPaginationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Parse filters from URL
  const filters: FilterState = useMemo(
    () => ({
      category: (searchParams.get('category') as ProductCategory) || undefined,
      status: (searchParams.get('status') as ProductStatus) || undefined,
      grade: (searchParams.get('grade') as ProductGrade) || undefined,
      unitOfMeasurement: (searchParams.get('unitOfMeasurement') as UnitOfMeasurement) || undefined,
      isFeatured: searchParams.get('isFeatured') === 'true' ? true : undefined,
      isOrganic: searchParams.get('isOrganic') === 'true' ? true : undefined,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      sortBy: (searchParams.get('sortBy') as ProductSortBy) || 'createdAt',
      sortOrder: (searchParams.get('sortOrder') as SortOrder) || 'DESC',
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 12,
    }),
    [searchParams],
  );

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.category) {
      count++;
    }
    if (filters.status) {
      count++;
    }
    if (filters.grade) {
      count++;
    }
    if (filters.unitOfMeasurement) {
      count++;
    }
    if (filters.isFeatured) {
      count++;
    }
    if (filters.isOrganic) {
      count++;
    }
    if (filters.minPrice || filters.maxPrice) {
      count++;
    }
    return count;
  }, [filters]);

  // Fetch products
  const fetchProducts = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await productsControllerGetAllProducts({
        query: {
          page: filters.page,
          limit: filters.limit,
          category: filters.category,
          status: filters.status,
          grade: filters.grade,
          unitOfMeasurement: filters.unitOfMeasurement,
          isFeatured: filters.isFeatured,
          isOrganic: filters.isOrganic,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          sortBy: filters.sortBy,
          sortOrder: filters.sortOrder,
        },
      });

      if (response.data) {
        setProductsData(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
      toast.error('Failed to load products', {
        description: 'Please check your connection and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  // Fetch on mount and when filters change
  useEffect(() => {
    void fetchProducts();
  }, [searchParams]);

  // Update URL with new filters
  const updateFilters = useCallback(
    (newFilters: Partial<FilterState>): void => {
      const params = new URLSearchParams(searchParams.toString());

      // Reset to page 1 when filters change (except when changing page itself)
      if (!('page' in newFilters)) {
        params.set('page', '1');
      }

      // Update or remove each filter
      Object.entries({ ...filters, ...newFilters }).forEach(([key, value]) => {
        if (value === undefined || value === null) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      router.push(`/shop?${params.toString()}`, { scroll: false });
    },
    [filters, router, searchParams],
  );

  // Clear all filters
  const clearAllFilters = useCallback((): void => {
    router.push('/shop', { scroll: false });
  }, [router]);

  // Handle page change
  const handlePageChange = useCallback(
    (page: number): void => {
      updateFilters({ page });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [updateFilters],
  );

  return (
    <div className="mt-10 min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="border-b bg-white">
        <div className="container mx-auto px-4 pt-12 pb-4 md:pt-16 md:pb-8">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Shop</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Title & Description */}
          <div className="mb-2">
            <h1 className="mb-4 text-3xl leading-tight font-bold text-gray-900 md:text-4xl">
              <span className="bg-linear-to-r from-[#0F6938] to-[#0F6938]/80 bg-clip-text text-transparent">
                Shop Organic Products
              </span>
            </h1>

            <p className="max-w-2xl text-sm leading-relaxed text-gray-600">
              Discover our premium collection of{' '}
              <span className="font-semibold text-[#0F6938]">ethically sourced</span> organic
              products from Northern Ghana
            </p>
          </div>

          {/* Active Filters Display */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Active filters:</span>
              {filters.category && (
                <Badge variant="secondary" className="gap-1.5">
                  Category: {filters.category}
                  <button
                    onClick={() => updateFilters({ category: undefined })}
                    className="hover:text-destructive ml-1"
                  >
                    <Icon icon="ph:x" className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {filters.grade && (
                <Badge variant="secondary" className="gap-1.5">
                  Grade: {filters.grade}
                  <button
                    onClick={() => updateFilters({ grade: undefined })}
                    className="hover:text-destructive ml-1"
                  >
                    <Icon icon="ph:x" className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {filters.isOrganic && (
                <Badge variant="secondary" className="gap-1.5">
                  Organic
                  <button
                    onClick={() => updateFilters({ isOrganic: undefined })}
                    className="hover:text-destructive ml-1"
                  >
                    <Icon icon="ph:x" className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {filters.isFeatured && (
                <Badge variant="secondary" className="gap-1.5">
                  Featured
                  <button
                    onClick={() => updateFilters({ isFeatured: undefined })}
                    className="hover:text-destructive ml-1"
                  >
                    <Icon icon="ph:x" className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {(filters.minPrice || filters.maxPrice) && (
                <Badge variant="secondary" className="gap-1.5">
                  Price: GHS {filters.minPrice || 0} - {filters.maxPrice || '∞'}
                  <button
                    onClick={() => updateFilters({ minPrice: undefined, maxPrice: undefined })}
                    className="hover:text-destructive ml-1"
                  >
                    <Icon icon="ph:x" className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-7">
                Clear all
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="top-24 hidden h-fit w-64 shrink-0 lg:sticky lg:block">
            <ProductFilters filters={filters} onFilterChangeAction={updateFilters} />
          </aside>

          {/* Products Section */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className="mb-6 flex items-center justify-between gap-4">
              {/* Results Count */}
              <div className="text-sm text-gray-600">
                {isLoading ? (
                  <span>Loading products...</span>
                ) : productsData ? (
                  <span>
                    Showing{' '}
                    <strong>
                      {(productsData.currentPage - 1) * filters.limit + 1}–
                      {Math.min(productsData.currentPage * filters.limit, productsData.totalItems)}
                    </strong>{' '}
                    of <strong>{productsData.totalItems}</strong> products
                  </span>
                ) : null}
              </div>

              {/* Mobile Filter Button */}
              <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden">
                    <Icon icon="ph:funnel" className="h-4 w-4" />
                    Filters
                    {activeFilterCount > 0 && (
                      <Badge variant="default" className="ml-1 h-5 min-w-5 px-1">
                        {activeFilterCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-full sm:max-w-md">
                  <SheetHeader>
                    <SheetTitle>Filter Products</SheetTitle>
                    <SheetDescription>
                      Refine your search to find the perfect products
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6">
                    <ProductFilters
                      filters={filters}
                      onFilterChangeAction={(newFilters) => {
                        updateFilters(newFilters);
                        setMobileFiltersOpen(false);
                      }}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Error State */}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
                <Icon icon="ph:warning-circle" className="mx-auto mb-3 h-12 w-12 text-red-500" />
                <h3 className="mb-2 text-lg font-semibold text-red-900">
                  Oops! Something went wrong
                </h3>
                <p className="mb-4 text-red-700">{error}</p>
                <Button onClick={() => fetchProducts()} variant="outline">
                  <Icon icon="ph:arrow-clockwise" className="h-4 w-4" />
                  Try Again
                </Button>
              </div>
            )}

            {/* Loading State */}
            {isLoading && <ProductGridSkeleton count={12} />}

            {/* Empty State */}
            {!isLoading && !error && productsData?.items?.length === 0 && (
              <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
                <Icon icon="ph:shopping-bag" className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                <h3 className="mb-2 text-xl font-semibold text-gray-900">No products found</h3>
                <p className="mb-6 text-gray-600">
                  We couldn&apos;t find any products matching your filters.
                </p>
                {activeFilterCount > 0 && (
                  <Button onClick={clearAllFilters} variant="outline">
                    <Icon icon="ph:x" className="h-4 w-4" />
                    Clear all filters
                  </Button>
                )}
              </div>
            )}

            {/* Products Grid */}
            {!isLoading && !error && productsData && productsData.items?.length > 0 && (
              <>
                <ProductsGrid products={productsData.items} />

                {/* Pagination */}
                {productsData.totalPages > 1 && (
                  <div className="mt-12">
                    <ShopPagination
                      currentPage={productsData.currentPage}
                      totalPages={productsData.totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* CTA Section */}
      <section className="mt-16 bg-[#0F6938] px-4 py-16 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Need Help Finding Something?</h2>
          <p className="mb-8 text-lg text-white/90">
            Our team is here to help you find the perfect organic products for your needs.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="bg-white px-8 font-semibold text-[#0F6938] shadow-lg hover:bg-white/90"
              asChild
            >
              <Link href="/#contact">Contact Us</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white bg-transparent px-8 font-semibold text-white hover:bg-white/10"
              asChild
            >
              <Link href="/blog">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
