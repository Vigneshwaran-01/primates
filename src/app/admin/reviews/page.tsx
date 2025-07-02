import prisma from '@/lib/db';

// Top-level server action for approving/rejecting reviews
export async function handleReviewAction(formData: FormData) {
  'use server';
  const id = Number(formData.get('id'));
  const approve = formData.get('approve') === 'true';
  await prisma.review.update({
    where: { id },
    data: { isApproved: approve },
  });
}

export default async function AdminReviewsPage() {
  interface Product {
    name: string;
  }

  interface User {
    username: string;
  }

  interface Review {
    id: number;
    product?: Product | null;
    user?: User | null;
    rating: number;
    comment: string;
    isApproved: boolean;
    reviewDate: Date;
  }

  const reviews: Review[] = await prisma.review.findMany({
    where: { isApproved: true },
    include: {
      product: { select: { name: true } },
      user: { select: { username: true } },
    },
    orderBy: { reviewDate: 'desc' },
  });

  const reviewCount: number = reviews.length;
  const averageRating: number = reviewCount
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
    : 0;
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Product Reviews</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-2 px-4">Product</th>
              <th className="py-2 px-4">User</th>
              <th className="py-2 px-4">Rating</th>
              <th className="py-2 px-4">Comment</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map(review => (
              <tr key={review.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{review.product?.name}</td>
                <td className="py-2 px-4">{review.user?.username}</td>
                <td className="py-2 px-4">{'★'.repeat(review.rating)}</td>
                <td className="py-2 px-4">{review.comment}</td>
                <td className="py-2 px-4">{review.isApproved ? 'Approved' : 'Pending'}</td>
                <td className="py-2 px-4 space-x-2">
                  {!review.isApproved && (
                    <form action={handleReviewAction}>
                      <input type="hidden" name="id" value={review.id} />
                      <input type="hidden" name="approve" value="true" />
                      <button type="submit" className="px-2 py-1 bg-green-600 text-white rounded">Approve</button>
                    </form>
                  )}
                  {review.isApproved && (
                    <form action={handleReviewAction}>
                      <input type="hidden" name="id" value={review.id} />
                      <input type="hidden" name="approve" value="false" />
                      <button type="submit" className="px-2 py-1 bg-red-600 text-white rounded">Reject</button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
            {reviews.length === 0 && (
              <tr>
                <td colSpan={6} className="py-4 text-center text-gray-500">
                  No reviews found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 