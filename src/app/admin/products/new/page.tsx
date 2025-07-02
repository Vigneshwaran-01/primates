import prisma from '@/lib/db';
import NewProductForm from './NewProductForm';

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } });
  return <NewProductForm categories={categories} />;
} 