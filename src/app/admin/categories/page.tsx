import prisma from '@/lib/db';
import Link from 'next/link';

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { parent: true },
    orderBy: { name: 'asc' },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Categories</h1>
        <Link
          href="/admin/categories/new"
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark font-semibold"
        >
          + New Category
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Description</th>
              <th className="py-2 px-4">Parent</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(category => (
              <tr key={category.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4 font-medium">{category.name}</td>
                <td className="py-2 px-4">{category.description || '-'}</td>
                <td className="py-2 px-4">{category.parent?.name || '-'}</td>
                <td className="py-2 px-4 space-x-2">
                  <Link
                    href={`/admin/categories/${category.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                  {/* Delete action can be added later */}
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={4} className="py-4 text-center text-gray-500">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 