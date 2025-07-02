import prisma from '@/lib/db';
import Link from 'next/link';
import ProductTableClient from './ProductTableClient';

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Products</h1>
        <Link
          href="/admin/products/new"
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark font-semibold"
        >
          + New Product
        </Link>
      </div>
      <ProductTableClient products={products} />
    </div>
  );
} 