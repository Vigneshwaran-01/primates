"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

function parseSpecs(specsObj: Record<string, any> | undefined): { name: string; value: string }[] {
  if (!specsObj || typeof specsObj !== 'object') return [{ name: '', value: '' }];
  return Object.entries(specsObj).map(([name, value]) => ({ name, value }));
}

export default function EditProductForm({ product, categories }: { product: any, categories: any[] }) {
  // Parse initial values
  const [form, setForm] = useState({
    name: product.name || '',
    price: product.price?.toString() || '',
    description: product.description || '',
    categoryId: product.categoryId?.toString() || '',
    stockQuantity: product.stockQuantity?.toString() || '',
    sku: product.sku || '',
    imageUrl: product.imageUrl || '',
    additionalImages: product.additionalImages?.join(', ') || '',
    deliveryInfo: product.deliveryInfo || '',
    isFeatured: product.isFeatured || false,
  });
  const [sizes, setSizes] = useState<string[]>(Array.isArray(product.sizes) ? product.sizes.filter(Boolean) : []);
  const [colors, setColors] = useState<string[]>(Array.isArray(product.colors) ? product.colors.filter(Boolean) : []);
  const [specs, setSpecs] = useState<{ name: string; value: string }[]>(parseSpecs(product.specifications));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setForm({ ...form, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Sizes and Colors tag input logic
  const handleAddTag = (setter: (arr: string[]) => void, arr: string[], value: string) => {
    if (value && !arr.includes(value)) setter([...arr, value]);
  };
  const handleRemoveTag = (setter: (arr: string[]) => void, arr: string[], idx: number) => setter(arr.filter((_, i) => i !== idx));

  // Specifications logic
  const handleSpecChange = (idx: number, field: 'name' | 'value', value: string) => {
    setSpecs(specs.map((spec, i) => i === idx ? { ...spec, [field]: value } : spec));
  };
  const handleAddSpec = () => setSpecs([...specs, { name: '', value: '' }]);
  const handleRemoveSpec = (idx: number) => setSpecs(specs.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Convert specs to object
      const specifications: Record<string, string> = {};
      specs.forEach(({ name, value }) => {
        if (name) specifications[name] = value;
      });
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          stockQuantity: parseInt(form.stockQuantity, 10),
          categoryId: parseInt(form.categoryId, 10),
          additionalImages: form.additionalImages.split(',').map((item: string) => item.trim()),
          sizes,
          colors,
          specifications,
        }),
      });
      if (res.ok) {
        router.push('/admin/products');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to update product');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  // Tag input helpers
  const [sizeInput, setSizeInput] = useState('');
  const [colorInput, setColorInput] = useState('');

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input name="name" value={form.name} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block mb-1 font-medium">Price</label>
          <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block mb-1 font-medium">Category</label>
          <select name="categoryId" value={form.categoryId} onChange={handleChange} required className="w-full border rounded px-3 py-2">
            <option value="">Select category</option>
            {categories.map((cat: any) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Stock Quantity</label>
          <input name="stockQuantity" type="number" value={form.stockQuantity} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block mb-1 font-medium">SKU</label>
          <input name="sku" value={form.sku} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block mb-1 font-medium">Image URL</label>
          <input name="imageUrl" value={form.imageUrl} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block mb-1 font-medium">Additional Images (comma-separated)</label>
          <textarea name="additionalImages" value={form.additionalImages} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        {/* Sizes tag input */}
        <div>
          <label className="block mb-1 font-medium">Sizes</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {sizes.map((size, idx) => (
              <span key={idx} className="bg-gray-200 px-2 py-1 rounded flex items-center gap-1">
                {size}
                <button type="button" onClick={() => handleRemoveTag(setSizes, sizes, idx)} className="ml-1 text-red-500">&times;</button>
              </span>
            ))}
          </div>
          <input
            type="text"
            value={sizeInput}
            onChange={e => setSizeInput(e.target.value)}
            onKeyDown={e => {
              if ((e.key === 'Enter' || e.key === ',') && sizeInput.trim()) {
                e.preventDefault();
                handleAddTag(setSizes, sizes, sizeInput.trim());
                setSizeInput('');
              }
            }}
            placeholder="Type a size and press Enter"
            className="w-full border rounded px-3 py-2"
          />
        </div>
        {/* Colors tag input */}
        <div>
          <label className="block mb-1 font-medium">Colors</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {colors.map((color, idx) => (
              <span key={idx} className="bg-gray-200 px-2 py-1 rounded flex items-center gap-1">
                {color}
                <button type="button" onClick={() => handleRemoveTag(setColors, colors, idx)} className="ml-1 text-red-500">&times;</button>
              </span>
            ))}
          </div>
          <input
            type="text"
            value={colorInput}
            onChange={e => setColorInput(e.target.value)}
            onKeyDown={e => {
              if ((e.key === 'Enter' || e.key === ',') && colorInput.trim()) {
                e.preventDefault();
                handleAddTag(setColors, colors, colorInput.trim());
                setColorInput('');
              }
            }}
            placeholder="Type a color and press Enter"
            className="w-full border rounded px-3 py-2"
          />
        </div>
        {/* Specifications dynamic fields */}
        <div>
          <label className="block mb-1 font-medium">Specifications</label>
          {specs.map((spec, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                type="text"
                value={spec.name}
                onChange={e => handleSpecChange(idx, 'name', e.target.value)}
                placeholder="Name"
                className="border rounded px-2 py-1 flex-1"
              />
              <input
                type="text"
                value={spec.value}
                onChange={e => handleSpecChange(idx, 'value', e.target.value)}
                placeholder="Value"
                className="border rounded px-2 py-1 flex-1"
              />
              <button type="button" onClick={() => handleRemoveSpec(idx)} className="text-red-500">&times;</button>
            </div>
          ))}
          <button type="button" onClick={handleAddSpec} className="text-blue-600 hover:underline mt-1">+ Add Specification</button>
        </div>
        <div>
          <label className="block mb-1 font-medium">Trending</label>
          <input
            type="checkbox"
            name="isFeatured"
            checked={form.isFeatured}
            onChange={handleChange}
            className="mr-2"
          />{' '}
          Mark as Trending
        </div>
        <div>
          <label className="block mb-1 font-medium">Delivery Info</label>
          <textarea name="deliveryInfo" value={form.deliveryInfo} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <button type="submit" className="w-full bg-primary text-white py-2 rounded font-semibold" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
} 