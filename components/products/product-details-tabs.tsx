'use client';

import { JSX } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ProductCategory, ProductResponseDto } from '@/app/api';
import { getUnitSymbol } from '@/lib/product-utils';

type ProductDetailsTabsProps = {
  product: ProductResponseDto;
};

export function ProductDetailsTabs({ product }: ProductDetailsTabsProps): JSX.Element {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="mt-16"
    >
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="description" className="gap-2">
            <Icon icon="ph:text-align-left" className="h-4 w-4" />
            Description
          </TabsTrigger>
          <TabsTrigger value="specifications" className="gap-2">
            <Icon icon="ph:list-bullets" className="h-4 w-4" />
            Specifications
          </TabsTrigger>
          <TabsTrigger value="benefits" className="gap-2">
            <Icon icon="ph:star" className="h-4 w-4" />
            Benefits & Usage
          </TabsTrigger>
          <TabsTrigger value="certifications" className="gap-2">
            <Icon icon="ph:seal-check" className="h-4 w-4" />
            Quality & Certifications
          </TabsTrigger>
        </TabsList>

        {/* Description Tab */}
        <TabsContent value="description" className="space-y-4">
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <h3 className="text-foreground text-xl font-semibold">Product Description</h3>
            <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {product.description || 'No description available for this product.'}
            </div>
          </div>

          {product.ingredients && product.ingredients.length > 0 && (
            <div className="border-border bg-muted/30 rounded-lg border p-6">
              <h4 className="text-foreground mb-3 flex items-center gap-2 text-lg font-semibold">
                <Icon icon="ph:list" className="h-5 w-5" />
                Ingredients
              </h4>
              <div className="flex flex-wrap gap-2">
                {product.ingredients.map((ingredient, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {ingredient}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        {/* Specifications Tab */}
        <TabsContent value="specifications" className="space-y-4">
          <h3 className="text-foreground text-xl font-semibold">Product Specifications</h3>

          <div className="border-border divide-border divide-y overflow-hidden rounded-lg border">
            <div className="bg-muted/50 grid grid-cols-2 gap-4 p-4">
              <span className="text-muted-foreground font-medium">Property</span>
              <span className="text-muted-foreground font-medium">Value</span>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4">
              <span className="text-muted-foreground">SKU</span>
              <span className="text-foreground font-medium">{product.sku}</span>
            </div>

            {product.weight && (
              <div className="grid grid-cols-2 gap-4 p-4">
                <span className="text-muted-foreground">Weight</span>
                <span className="text-foreground font-medium">
                  {product.weight} {getUnitSymbol(product.unitOfMeasurement)}
                </span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 p-4">
              <span className="text-muted-foreground">Category</span>
              <span className="text-foreground font-medium">
                {product.category.replace(/_/g, ' ')}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4">
              <span className="text-muted-foreground">Grade</span>
              <span className="text-foreground font-medium">
                {product.grade === 'premium' ? 'Premium' : product.grade}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4">
              <span className="text-muted-foreground">Organic Certified</span>
              <span className="text-foreground font-medium">
                {product.isOrganic ? (
                  <Badge className="bg-green-500">
                    <Icon icon="ph:check-circle-fill" className="mr-1 h-4 w-4" />
                    Yes
                  </Badge>
                ) : (
                  'No'
                )}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4">
              <span className="text-muted-foreground">Min. Order Quantity</span>
              <span className="text-foreground font-medium">{product.minOrderQuantity} units</span>
            </div>

            {product.quantityInBox && (
              <div className="grid grid-cols-2 gap-4 p-4">
                <span className="text-muted-foreground">Quantity per Box</span>
                <span className="text-foreground font-medium">{product.quantityInBox} units</span>
              </div>
            )}

            {product.inBoxPrice && (
              <div className="grid grid-cols-2 gap-4 p-4">
                <span className="text-muted-foreground">Box Price</span>
                <span className="text-foreground font-medium">
                  {new Intl.NumberFormat('en-GH', {
                    style: 'currency',
                    currency: 'GHS',
                  }).format(product.inBoxPrice)}
                </span>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Benefits & Usage Tab */}
        <TabsContent value="benefits" className="space-y-4">
          <h3 className="text-foreground text-xl font-semibold">Benefits & Usage</h3>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="benefits">
              <AccordionTrigger>
                <span className="flex items-center gap-2">
                  <Icon icon="ph:heart-fill" className="text-primary h-5 w-5" />
                  Key Benefits
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="text-muted-foreground ml-6 list-disc space-y-2">
                  <li>100% natural and ethically sourced from Northern Ghana</li>
                  <li>Rich in nutrients and beneficial properties</li>
                  {product.isOrganic && <li>Certified organic - free from harmful chemicals</li>}
                  <li>Suitable for various applications (cosmetic, food, industrial)</li>
                  <li>Long shelf life when stored properly</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="usage">
              <AccordionTrigger>
                <span className="flex items-center gap-2">
                  <Icon icon="ph:lightbulb-fill" className="text-primary h-5 w-5" />
                  How to Use
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="text-muted-foreground space-y-3">
                  {product.category === ProductCategory.SHEA_BUTTER && (
                    <div>
                      <p className="font-medium">Shea Butter can be used for:</p>
                      <ul className="mt-2 ml-6 list-disc space-y-1">
                        <li>Skin moisturizing and healing</li>
                        <li>Hair care and conditioning</li>
                        <li>Cosmetic and soap making</li>
                        <li>Cooking (refined variants)</li>
                      </ul>
                    </div>
                  )}
                  {product.category === ProductCategory.ESSENTIAL_OILS && (
                    <div>
                      <p className="font-medium">Essential Oils can be used for:</p>
                      <ul className="mt-2 ml-6 list-disc space-y-1">
                        <li>Aromatherapy and diffusion</li>
                        <li>Topical application (diluted)</li>
                        <li>Natural wellness products</li>
                        <li>Personal care formulations</li>
                      </ul>
                    </div>
                  )}
                  <p className="text-sm italic">
                    For specific usage instructions, please refer to the product packaging or
                    contact our support team.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="storage">
              <AccordionTrigger>
                <span className="flex items-center gap-2">
                  <Icon icon="ph:package-fill" className="text-primary h-5 w-5" />
                  Storage & Handling
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="text-muted-foreground space-y-2">
                  <p>To maintain product quality:</p>
                  <ul className="ml-6 list-disc space-y-1">
                    <li>Store in a cool, dry place away from direct sunlight</li>
                    <li>Keep container tightly closed when not in use</li>
                    <li>Avoid contamination - use clean utensils</li>
                    <li>Check expiration date on packaging</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>

        {/* Quality & Certifications Tab */}
        <TabsContent value="certifications" className="space-y-6">
          <h3 className="text-foreground text-xl font-semibold">
            Quality Assurance & Certifications
          </h3>

          {/* Quality Assurance */}
          <div className="border-border bg-muted/30 rounded-lg border p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
                <Icon icon="ph:seal-check-fill" className="text-primary h-6 w-6" />
              </div>
              <div>
                <h4 className="text-foreground text-lg font-semibold">Quality Guarantee</h4>
                <p className="text-muted-foreground text-sm">
                  Ethically sourced from Northern Ghana
                </p>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              All our products undergo rigorous quality control checks to ensure they meet
              international standards. We work directly with local farmers and suppliers to maintain
              traceability and authenticity.
            </p>
          </div>

          {/* Certifications */}
          {product.certifications && product.certifications.length > 0 && (
            <div>
              <h4 className="text-foreground mb-3 text-lg font-semibold">Certifications</h4>
              <div className="grid gap-4 sm:grid-cols-2">
                {product.certifications.map((cert, index) => (
                  <div
                    key={index}
                    className="border-border flex items-center gap-3 rounded-lg border p-4"
                  >
                    <Icon icon="ph:certificate-fill" className="text-primary h-8 w-8" />
                    <span className="text-foreground font-medium">{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Trust Signals */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="border-border flex items-start gap-3 rounded-lg border p-4">
              <Icon icon="ph:shield-check-fill" className="text-primary mt-1 h-6 w-6 shrink-0" />
              <div>
                <h5 className="text-foreground mb-1 font-semibold">Food Safety Certified</h5>
                <p className="text-muted-foreground text-sm">
                  Meets international food safety standards
                </p>
              </div>
            </div>

            <div className="border-border flex items-start gap-3 rounded-lg border p-4">
              <Icon icon="ph:truck-fill" className="text-primary mt-1 h-6 w-6 shrink-0" />
              <div>
                <h5 className="text-foreground mb-1 font-semibold">Reliable Shipping</h5>
                <p className="text-muted-foreground text-sm">
                  Fast and secure delivery within Ghana and internationally
                </p>
              </div>
            </div>

            <div className="border-border flex items-start gap-3 rounded-lg border p-4">
              <Icon icon="ph:recycle-fill" className="text-primary mt-1 h-6 w-6 shrink-0" />
              <div>
                <h5 className="text-foreground mb-1 font-semibold">Sustainable Sourcing</h5>
                <p className="text-muted-foreground text-sm">
                  Supporting local communities and sustainable practices
                </p>
              </div>
            </div>

            <div className="border-border flex items-start gap-3 rounded-lg border p-4">
              <Icon icon="ph:handshake-fill" className="text-primary mt-1 h-6 w-6 shrink-0" />
              <div>
                <h5 className="text-foreground mb-1 font-semibold">Direct Trade</h5>
                <p className="text-muted-foreground text-sm">
                  Working directly with producers for fair prices
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </motion.section>
  );
}
