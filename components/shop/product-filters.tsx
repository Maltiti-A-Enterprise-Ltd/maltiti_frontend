'use client';

import { JSX, useState } from 'react';
import { Icon } from '@iconify/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  ProductCategory,
  ProductGrade,
  ProductSortBy,
  ProductStatus,
  SortOrder,
  UnitOfMeasurement,
} from '@/app/api';

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
};

type ProductFiltersProps = {
  filters: FilterState;
  onFilterChangeAction: (filters: Partial<FilterState>) => void;
};

export function ProductFilters({
  filters,
  onFilterChangeAction,
}: ProductFiltersProps): JSX.Element {
  const [localMinPrice, setLocalMinPrice] = useState<string>(filters.minPrice?.toString() || '');
  const [localMaxPrice, setLocalMaxPrice] = useState<string>(filters.maxPrice?.toString() || '');

  // Category options
  const categories: ProductCategory[] = Object.values(ProductCategory);

  // Grade options
  const grades = [
    { value: ProductGrade.A, label: 'Grade A' },
    { value: ProductGrade.B, label: 'Grade B' },
    { value: ProductGrade.PREMIUM, label: 'Premium' },
    { value: ProductGrade.STANDARD, label: 'Standard' },
    { value: ProductGrade.ORGANIC, label: 'Organic Grade' },
  ];

  // Status options
  const statusOptions = [
    { value: ProductStatus.ACTIVE, label: 'In Stock', icon: 'ph:check-circle' },
    { value: ProductStatus.OUT_OF_STOCK, label: 'Out of Stock', icon: 'ph:x-circle' },
  ];

  // Sort options
  const sortOptions = [
    { value: 'createdAt-DESC', label: 'Newest First', icon: 'ph:sparkle' },
    { value: 'retail-ASC', label: 'Price: Low to High', icon: 'ph:arrow-up' },
    { value: 'retail-DESC', label: 'Price: High to Low', icon: 'ph:arrow-down' },
    { value: 'name-ASC', label: 'Name: A to Z', icon: 'ph:sort-ascending' },
    { value: 'rating-DESC', label: 'Highest Rated', icon: 'ph:star' },
  ];

  // Handle sort change
  const handleSortChange = (value: string): void => {
    const [sortBy, sortOrder] = value.split('-');
    onFilterChangeAction({ sortBy: sortBy as ProductSortBy, sortOrder: sortOrder as SortOrder });
  };

  // Handle price filter apply
  const handlePriceApply = (): void => {
    onFilterChangeAction({
      minPrice: localMinPrice ? Number(localMinPrice) : undefined,
      maxPrice: localMaxPrice ? Number(localMaxPrice) : undefined,
    });
  };

  // Current sort value
  const currentSort = `${filters.sortBy || 'createdAt'}-${filters.sortOrder || 'DESC'}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        <p className="text-muted-foreground text-sm">Refine your product search</p>
      </div>

      <Separator />

      {/* Accordion for filter sections */}
      <Accordion type="multiple" defaultValue={['sort', 'category', 'features']} className="w-full">
        {/* Sort */}
        <AccordionItem value="sort">
          <AccordionTrigger className="text-sm font-semibold hover:no-underline">
            <div className="flex items-center gap-2">
              <Icon icon="ph:sort-ascending" className="h-4 w-4" />
              Sort By
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSortChange(option.value)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                    currentSort === option.value ? 'bg-[#0F6938] text-white' : 'hover:bg-gray-100'
                  }`}
                >
                  <Icon icon={option.icon} className="h-4 w-4 shrink-0" />
                  <span className="flex-1">{option.label}</span>
                  {currentSort === option.value && (
                    <Icon icon="ph:check" className="h-4 w-4 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Category */}
        <AccordionItem value="category">
          <AccordionTrigger className="text-sm font-semibold hover:no-underline">
            <div className="flex items-center gap-2">
              <Icon icon="ph:tag" className="h-4 w-4" />
              Category
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() =>
                    onFilterChangeAction({
                      category: filters.category === category ? undefined : category,
                    })
                  }
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                    filters.category === category ? 'bg-[#0F6938] text-white' : 'hover:bg-gray-100'
                  }`}
                >
                  <div
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                      filters.category === category ? 'border-white bg-white' : 'border-gray-300'
                    }`}
                  >
                    {filters.category === category && (
                      <Icon icon="ph:check" className="h-3 w-3 text-[#0F6938]" />
                    )}
                  </div>
                  <span className="flex-1">{category}</span>
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Features */}
        <AccordionItem value="features">
          <AccordionTrigger className="text-sm font-semibold hover:no-underline">
            <div className="flex items-center gap-2">
              <Icon icon="ph:seal-check" className="h-4 w-4" />
              Product Features
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {/* Organic */}
              <label className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-gray-100">
                <input
                  type="checkbox"
                  checked={filters.isOrganic || false}
                  onChange={(e) =>
                    onFilterChangeAction({ isOrganic: e.target.checked || undefined })
                  }
                  className="h-4 w-4 rounded border-gray-300 text-[#0F6938] focus:ring-[#0F6938]"
                />
                <div className="flex flex-1 items-center gap-2">
                  <Icon icon="ph:leaf-fill" className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Organic Certified</span>
                </div>
              </label>

              {/* Featured */}
              <label className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-gray-100">
                <input
                  type="checkbox"
                  checked={filters.isFeatured || false}
                  onChange={(e) =>
                    onFilterChangeAction({ isFeatured: e.target.checked || undefined })
                  }
                  className="h-4 w-4 rounded border-gray-300 text-[#0F6938] focus:ring-[#0F6938]"
                />
                <div className="flex flex-1 items-center gap-2">
                  <Icon icon="ph:star-fill" className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">Featured Products</span>
                </div>
              </label>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Grade */}
        <AccordionItem value="grade">
          <AccordionTrigger className="text-sm font-semibold hover:no-underline">
            <div className="flex items-center gap-2">
              <Icon icon="ph:medal" className="h-4 w-4" />
              Product Grade
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              {grades.map((grade) => (
                <button
                  key={grade.value}
                  onClick={() =>
                    onFilterChangeAction({
                      grade: filters.grade === grade.value ? undefined : grade.value,
                    })
                  }
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                    filters.grade === grade.value ? 'bg-[#0F6938] text-white' : 'hover:bg-gray-100'
                  }`}
                >
                  <div
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                      filters.grade === grade.value ? 'border-white bg-white' : 'border-gray-300'
                    }`}
                  >
                    {filters.grade === grade.value && (
                      <div className="h-2 w-2 rounded-full bg-[#0F6938]" />
                    )}
                  </div>
                  <span className="flex-1">{grade.label}</span>
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Availability */}
        <AccordionItem value="availability">
          <AccordionTrigger className="text-sm font-semibold hover:no-underline">
            <div className="flex items-center gap-2">
              <Icon icon="ph:package" className="h-4 w-4" />
              Availability
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              {statusOptions.map((status) => (
                <button
                  key={status.value}
                  onClick={() =>
                    onFilterChangeAction({
                      status: filters.status === status.value ? undefined : status.value,
                    })
                  }
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                    filters.status === status.value
                      ? 'bg-[#0F6938] text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <Icon
                    icon={status.icon}
                    className={`h-4 w-4 shrink-0 ${
                      filters.status === status.value
                        ? 'text-white'
                        : status.value === 'active'
                          ? 'text-green-600'
                          : 'text-red-600'
                    }`}
                  />
                  <span className="flex-1">{status.label}</span>
                  {filters.status === status.value && (
                    <Icon icon="ph:check" className="h-4 w-4 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price Range */}
        <AccordionItem value="price">
          <AccordionTrigger className="text-sm font-semibold hover:no-underline">
            <div className="flex items-center gap-2">
              <Icon icon="ph:currency-circle-dollar" className="h-4 w-4" />
              Price Range (GHS)
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="minPrice" className="text-xs text-gray-600">
                    Min Price
                  </Label>
                  <Input
                    id="minPrice"
                    type="number"
                    placeholder="0"
                    value={localMinPrice}
                    onChange={(e) => setLocalMinPrice(e.target.value)}
                    className="mt-1"
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="maxPrice" className="text-xs text-gray-600">
                    Max Price
                  </Label>
                  <Input
                    id="maxPrice"
                    type="number"
                    placeholder="Any"
                    value={localMaxPrice}
                    onChange={(e) => setLocalMaxPrice(e.target.value)}
                    className="mt-1"
                    min="0"
                  />
                </div>
              </div>
              <Button onClick={handlePriceApply} className="w-full" size="sm">
                Apply Price Filter
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
