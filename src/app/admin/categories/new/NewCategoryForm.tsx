"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewCategoryForm({ categories }: { categories: any[] }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    parentId: '',
    imageUrl: '',
    isActive: true,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          parentId: form.parentId ? parseInt(form.parentId, 10) : null,
        }),
      });
      if (res.ok) {
        router.push('/admin/categories');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to create category');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Add New Category</h1>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input name="name" value={form.name} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block mb-1 font-medium">Parent Category</label>
          <select name="parentId" value={form.parentId} onChange={handleChange} className="w-full border rounded px-3 py-2">
            <option value="">None</option>
            {categories.map((cat: any) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Image URL</label>
          <input name="imageUrl" value={form.imageUrl} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div className="flex items-center">
          <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} id="isActive" className="mr-2" />
          <label htmlFor="isActive" className="font-medium">Active</label>
        </div>
        <button type="submit" className="w-full bg-primary text-white py-2 rounded font-semibold" disabled={loading}>
          {loading ? 'Creating...' : 'Create Category'}
        </button>
      </form>
    </div>
  );
} 