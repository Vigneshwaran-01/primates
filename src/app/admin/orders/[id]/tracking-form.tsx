"use client";
import { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';

export default function TrackingNumberForm({ orderId, trackingNumber }: { orderId: number, trackingNumber: string }) {
  const [value, setValue] = useState(trackingNumber);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/tracking`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackingNumber: value }),
      });
      if (res.ok) {
        setMessage('Tracking number updated!');
        window.location.reload();
      } else {
        const data = await res.json();
        setMessage(data.error || 'Failed to update tracking number');
      }
    } catch (err) {
      setMessage('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="inline-flex items-center gap-2">
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        className="border rounded px-2 py-1"
        placeholder="Enter tracking number"
        disabled={loading}
      />
      <button
        type="submit"
        className="bg-primary text-white px-3 py-1 rounded font-semibold"
        disabled={loading || value === trackingNumber}
      >
        {loading ? 'Saving...' : 'Save'}
      </button>
      {message && <span className="ml-2 text-sm text-green-600">{message}</span>}
    </form>
  );
} 