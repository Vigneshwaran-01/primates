import prisma from '@/lib/db';
import { notFound } from 'next/navigation';
import EditProductForm from './edit-form';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const productId = Number(id);
  if (isNaN(productId)) notFound();
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id: productId } }),
    prisma.category.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } }),
  ]);
  if (!product) notFound();
  return <EditProductForm product={product} categories={categories} />;
} 