import { JSX, Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { productsControllerGetProduct, productsControllerGetAllProducts } from '@/app/api';
import { ProductDetailContent, ProductDetailSkeleton } from '@/components/products';

type ProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  try {
    const { id } = await params;
    const response = await productsControllerGetProduct({
      path: { id },
    });

    const product = response.data.data;

    return {
      title: `${product.name} | Maltiti A. Enterprise Ltd`,
      description:
        product.description ||
        `Buy ${product.name} from Maltiti A. Enterprise Ltd. Premium organic products from Northern Ghana.`,
      keywords: [
        product.name,
        product.category.replace(/_/g, ' '),
        'organic',
        'Ghana',
        'Northern Ghana',
        'Maltiti',
        ...(product.isOrganic ? ['certified organic'] : []),
      ].join(', '),
      openGraph: {
        title: `${product.name} | Maltiti A. Enterprise Ltd`,
        description:
          product.description ||
          `Premium ${product.category.replace(/_/g, ' ')} from Northern Ghana`,
        type: 'website',
        images: [
          {
            url: product.image || product.images?.[0] || '/placeholder-product.svg',
            width: 1200,
            height: 630,
            alt: product.name,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${product.name} | Maltiti A. Enterprise Ltd`,
        description:
          product.description ||
          `Premium ${product.category.replace(/_/g, ' ')} from Northern Ghana`,
        images: [product.image || product.images?.[0] || '/placeholder-product.svg'],
      },
    };
  } catch (error) {
    return {
      title: 'Product Not Found | Maltiti A. Enterprise Ltd',
      description: 'The product you are looking for could not be found.',
    };
  }
}

// Fetch product data
async function getProductData(id: string) {
  try {
    const [productResponse, relatedProductsResponse] = await Promise.all([
      productsControllerGetProduct({
        path: { id },
      }),
      productsControllerGetAllProducts({
        query: {
          page: 1,
          limit: 8,
        },
      }),
    ]);

    return {
      product: productResponse.data.data,
      relatedProducts: relatedProductsResponse.data.data.items,
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export default async function ProductPage({ params }: ProductPageProps): Promise<JSX.Element> {
  const { id } = await params;
  const data = await getProductData(id);

  if (!data || !data.product) {
    notFound();
  }

  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductDetailContent product={data.product} relatedProducts={data.relatedProducts} />
    </Suspense>
  );
}
