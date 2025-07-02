import prisma from '@/lib/db';
import { notFound } from 'next/navigation';
import ProductDetails from '@/components/products/ProductDetails';
import { Product } from '@/types/product';

// Create a compatible type for the ProductDetails component
type ProductDetailsCompatible = Omit<Product, 'description' | 'imageUrl'> & {
  description?: string;
  imageUrl?: string;
};

async function getProduct(id: number) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      Reviews: {
        where: { isApproved: true },
        include: {
          user: {
            select: {
              username: true,
            },
          },
        },
      },
    },
    // Ensure all scalar fields including 'quantity' are selected
  });

  if (!product) notFound();
  
  return product;
}

export default async function ProductPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const productId = Number(id);
  
  if (isNaN(productId)) notFound();
  
  const product = await getProduct(productId);

  return (
    <div className="container mx-auto py-8">
      <ProductDetails product={product as any} />
    </div>
  );
}