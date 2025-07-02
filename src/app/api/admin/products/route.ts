export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, price, description, categoryId, stockQuantity, sku, imageUrl, additionalImages, sizes, colors, specifications, deliveryInfo } = body;
    if (!name || !price || !categoryId || !stockQuantity || !sku) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const product = await prisma.product.create({
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
    console.error('Create product error:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
} 