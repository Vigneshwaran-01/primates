"use client";
import { useState } from 'react';

const statuses = [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded',
];

export default function OrderStatusForm({ orderId, status }: { orderId: number, status: string }) {
  const [value, setValue] = useState(status);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: value }),
      });
      if (res.ok) {
        setMessage('Status updated!');
        window.location.reload();
      } else {
        const data = await res.json();
        setMessage(data.error || 'Failed to update status');
      }
    } catch (err) {
      setMessage('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="inline-flex items-center gap-2">
      <select
        value={value}
        onChange={e => setValue(e.target.value)}
        className="border rounded px-2 py-1"
        disabled={loading}
      >
        {statuses.map(s => (
          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
        ))}
      </select>
      <button
        type="submit"
        className="bg-primary text-white px-3 py-1 rounded font-semibold"
        disabled={loading || value === status}
      >
        {loading ? 'Saving...' : 'Save'}
      </button>
      {message && <span className="ml-2 text-sm text-green-600">{message}</span>}
    </form>
  );
} 