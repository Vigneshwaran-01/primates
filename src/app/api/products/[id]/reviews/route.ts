import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// GET: Fetch all reviews for a product
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const productId = Number(params.id);
  if (isNaN(productId)) return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
  const reviews = await prisma.review.findMany({
    where: { productId, isApproved: true },
    include: { user: { select: { username: true, firstName: true, lastName: true } } },
    orderBy: { reviewDate: 'desc' },
  });
  return NextResponse.json(reviews);
}

// POST: Submit a review for a product (user must have purchased the product)
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const productId = Number(params.id);
  if (isNaN(productId)) return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
  const { rating, comment } = await request.json();
  if (!rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
  }
  // Check if user has purchased this product
  const hasPurchased = await prisma.orderItem.findFirst({
    where: {
      productId,
      order: { userId: user.id, status: { in: ['delivered', 'processing', 'shipped'] } },
    },
  });
  if (!hasPurchased) {
    return NextResponse.json({ error: 'You can only review products you have purchased.' }, { status: 403 });
  }
  // Check if user already reviewed this product
  const alreadyReviewed = await prisma.review.findFirst({
    where: { productId, userId: user.id },
  });
  if (alreadyReviewed) {
    return NextResponse.json({ error: 'You have already reviewed this product.' }, { status: 409 });
  }
  const review = await prisma.review.create({
    data: {
      productId,
      userId: user.id,
      rating,
      comment,
      isApproved: true, // auto-approve for now
    },
  });
  return NextResponse.json(review);
} 