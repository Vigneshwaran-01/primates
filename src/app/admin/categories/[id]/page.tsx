import prisma from '@/lib/db';
import { notFound } from 'next/navigation';
import EditCategoryForm from './edit-form';

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
  const categoryId = Number(params.id);
  if (isNaN(categoryId)) notFound();
  const [category, categories] = await Promise.all([
    prisma.category.findUnique({ where: { id: categoryId } }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ]);
  if (!category) notFound();
  return <EditCategoryForm category={category} categories={categories} />;
} 