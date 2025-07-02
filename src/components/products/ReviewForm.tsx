"use client";
import { useState } from 'react';

export default function ReviewForm({ productId }: { productId: number }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);

  // Check if already reviewed on mount
  // (In a real app, you might want to fetch this from the API)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment }),
      });
      if (res.ok) {
        setSuccess('Review submitted!');
        setAlreadyReviewed(true);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to submit review');
        if (res.status === 409) setAlreadyReviewed(true);
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setSubmitting(false);
    }
  };

  if (alreadyReviewed) {
    return <div className="text-green-600 text-sm mt-2">You have already reviewed this product.</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2 mb-2 p-2 border rounded bg-gray-50">
      <div className="flex items-center gap-2 mb-2">
        {[1,2,3,4,5].map(star => (
          <button
            type="button"
            key={star}
            className={star <= rating ? 'text-yellow-500 text-xl' : 'text-gray-300 text-xl'}
            onClick={() => setRating(star)}
            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
          >★</button>
        ))}
      </div>
      <textarea
        className="w-full border rounded p-2 mb-2"
        rows={2}
        value={comment}
        onChange={e => setComment(e.target.value)}
        placeholder="Write your review (optional)"
        required={false}
      />
      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
      {success && <p className="text-green-600 text-sm mb-2">{success}</p>}
      <button
        type="submit"
        className="px-3 py-1 bg-primary text-white rounded text-sm"
        disabled={submitting || !rating}
      >
        {submitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
} 