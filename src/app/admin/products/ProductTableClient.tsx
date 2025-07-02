'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function ProductTableClient({ products }: { products: any[] }) {
  const [localProducts, setLocalProducts] = useState(products);

  const handleToggleTrending = async (productId: number, current: boolean) => {
    const res = await fetch(`/api/admin/products/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isFeatured: !current }),
    });
    if (res.ok) {
      setLocalProducts((prev: any[]) =>
        prev.map((p) =>
          p.id === productId ? { ...p, isFeatured: !current } : p
        )
      );
    } else {
      alert('Failed to update trending status');
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="py-2 px-4">Name</th>
            <th className="py-2 px-4">Price</th>
            <th className="py-2 px-4">Category</th>
            <th className="py-2 px-4">Trending</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {localProducts.map(product => (
            <tr key={product.id} className="border-b hover:bg-gray-50">
              <td className="py-2 px-4 font-medium">{product.name}</td>
              <td className="py-2 px-4">${product.price.toFixed(2)}</td>
              <td className="py-2 px-4">{product.category?.name || '-'}</td>
              <td className="py-2 px-4">
                <input
                  type="checkbox"
                  checked={!!product.isFeatured}
                  onChange={() => handleToggleTrending(product.id, !!product.isFeatured)}
                  aria-label="Toggle Trending"
                />
              </td>
              <td className="py-2 px-4 space-x-2">
                <Link
                  href={`/admin/products/${product.id}`}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </Link>
                <Link
                  href={`/products/${product.id}`}
                  className="text-green-600 hover:underline"
                  target="_blank"
                >
                  View
                </Link>
                <button
                  className="text-red-600 hover:underline"
                  onClick={async () => {
                    if (confirm('Are you sure you want to delete this product?')) {
                      const res = await fetch(`/api/admin/products/${product.id}`, { method: 'DELETE' });
                      if (res.ok) {
                        window.location.reload();
                      } else {
                        const data = await res.json();
                        alert(data.error || 'Failed to delete product');
                      }
                    }
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {localProducts.length === 0 && (
            <tr>
              <td colSpan={5} className="py-4 text-center text-gray-500">
                No products found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
} 