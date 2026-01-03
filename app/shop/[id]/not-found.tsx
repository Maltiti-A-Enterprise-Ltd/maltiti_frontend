import { JSX } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { Button } from '@/components/ui/button';

export default function ProductNotFound(): JSX.Element {
  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="bg-muted/50 mb-6 flex h-24 w-24 items-center justify-center rounded-full">
        <Icon icon="ph:package-x" className="text-muted-foreground h-12 w-12" />
      </div>

      <h1 className="text-foreground mb-4 text-3xl font-bold md:text-4xl">Product Not Found</h1>

      <p className="text-muted-foreground mb-8 max-w-md text-lg">
        Sorry, the product you&apos;re looking for doesn&apos;t exist or may have been removed.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg" className="gap-2">
          <Link href="/shop">
            <Icon icon="ph:storefront" className="h-5 w-5" />
            Browse All Products
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="gap-2">
          <Link href="/">
            <Icon icon="ph:house" className="h-5 w-5" />
            Back to Home
          </Link>
        </Button>
      </div>

      <div className="text-muted-foreground mt-12 text-sm">
        <p>
          Need help?{' '}
          <Link href="/#contact" className="text-primary hover:underline">
            Contact our support team
          </Link>
        </p>
      </div>
    </div>
  );
}
