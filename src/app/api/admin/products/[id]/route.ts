export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    const productId = Number(id);
    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }
    const body = await request.json();
    // Allow partial update for isFeatured (trending toggle)
    if (Object.keys(body).length === 1 && body.isFeatured !== undefined) {
      const product = await prisma.product.update({
        where: { id: productId },
        data: { isFeatured: body.isFeatured },
      });
      return NextResponse.json({ product });
    }
    // Otherwise, require all fields for full update
    const { name, price, description, categoryId, stockQuantity, sku, imageUrl, additionalImages, sizes, colors, specifications, deliveryInfo } = body;
    if (!name || !price || !categoryId || !stockQuantity || !sku) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        price,
        description: description || null,
        categoryId,
        stockQuantity,
        sku,
        imageUrl: imageUrl || null,
        additionalImages: additionalImages || [],
        sizes: sizes || [],
        colors: colors || [],
        specifications: specifications || {},
        deliveryInfo: deliveryInfo || null,
      },
    });
    return NextResponse.json({ product });
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    const productId = Number(id);
    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }
    // Cascade delete related data
    await prisma.review.deleteMany({ where: { productId } });
    await prisma.cart.deleteMany({ where: { productId } });
    await prisma.wishlist.deleteMany({ where: { productId } });
    await prisma.orderItem.deleteMany({ where: { productId } });
    await prisma.product.delete({ where: { id: productId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
} 