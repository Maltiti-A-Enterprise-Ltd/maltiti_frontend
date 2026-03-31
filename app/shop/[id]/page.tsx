import { JSX, Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  productsControllerGetProduct,
  productsControllerGetAllProducts,
  ProductResponseDto,
} from '@/app/api';
import { ProductDetailContent, ProductDetailSkeleton } from '@/components/products';
import { getProductSchema, getBreadcrumbSchema } from '@/lib/seo/json-ld';

const BASE_URL = 'https://maltitiaenterprise.com';

type ProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const revalidate = 3600;

export async function generateStaticParams(): Promise<{ id: string }[]> {
  try {
    const { data, error } = await productsControllerGetAllProducts({
      query: { page: 1, limit: 100 },
    });
    if (error || !data) {
      return [];
    }
    return (data.data?.items ?? []).map((product) => ({ id: product.id }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  try {
    const { id } = await params;
    const { data, error } = await productsControllerGetProduct({
      path: { id },
    });

    if (error || !data) {
      throw new Error('Product not found');
    }

    const product = data.data;

    return {
      title: `${product.name} | Maltiti A. Enterprise Ltd`,
      description:
        product.description ||
        `Buy ${product.name} from Maltiti A. Enterprise Ltd. Premium organic products from Northern Ghana.`,
      keywords: [
        product.name,
        product.category.replaceAll('_', ' '),
        'organic',
        'Ghana',
        'Northern Ghana',
        'Maltiti',
        ...(product.isOrganic ? ['certified organic'] : []),
      ].join(', '),
      alternates: {
        canonical: `${BASE_URL}/shop/${id}`,
      },
      openGraph: {
        title: `${product.name} | Maltiti A. Enterprise Ltd`,
        description:
          product.description ||
          `Premium ${product.category.replaceAll('_', ' ')} from Northern Ghana`,
        type: 'website',
        url: `${BASE_URL}/shop/${id}`,
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
          `Premium ${product.category.replaceAll('_', ' ')} from Northern Ghana`,
        images: [product.image || product.images?.[0] || '/placeholder-product.svg'],
      },
    };
  } catch {
    return {
      title: 'Product Not Found | Maltiti A. Enterprise Ltd',
      description: 'The product you are looking for could not be found.',
      robots: { index: false, follow: false },
    };
  }
}

async function getProductData(id: string): Promise<{
  product: ProductResponseDto;
  relatedProducts: ProductResponseDto[];
} | null> {
  try {
    const [productResponse, relatedProductsResponse] = await Promise.all([
      productsControllerGetProduct({ path: { id } }),
      productsControllerGetAllProducts({ query: { page: 1, limit: 8 } }),
    ]);

    if (productResponse.error || relatedProductsResponse.error) {
      throw new Error('Error fetching product data');
    }

    const product = productResponse.data?.data;
    const relatedProducts = relatedProductsResponse.data?.data.items;

    if (!product || !relatedProducts) {
      throw new Error('Product or related products not found');
    }

    return { product, relatedProducts };
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export default async function ProductPage({
  params,
}: Readonly<ProductPageProps>): Promise<JSX.Element> {
  const { id } = await params;
  const data = await getProductData(id);

  if (!data?.product) {
    notFound();
  }

  const productSchema = getProductSchema(data.product);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'Shop', url: `${BASE_URL}/shop` },
    { name: data.product.name, url: `${BASE_URL}/shop/${id}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Suspense fallback={<ProductDetailSkeleton />}>
        <ProductDetailContent product={data.product} relatedProducts={data.relatedProducts} />
      </Suspense>
    </>
  );
}
