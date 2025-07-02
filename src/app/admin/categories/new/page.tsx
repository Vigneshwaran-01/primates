import prisma from '@/lib/db';
import NewCategoryForm from './NewCategoryForm';

export default async function NewCategoryPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  return <NewCategoryForm categories={categories} />;
} 