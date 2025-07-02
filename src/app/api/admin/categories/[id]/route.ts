import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const categoryId = Number(params.id);
    if (isNaN(categoryId)) {
      return NextResponse.json({ error: 'Invalid category ID' }, { status: 400 });
    }
    const body = await request.json();
    const { name, description, parentId, imageUrl, isActive } = body;
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    const category = await prisma.category.update({
      where: { id: categoryId },
      data: {
        name,
        description: description || null,
        parentId: parentId || null,
        imageUrl: imageUrl || null,
        isActive: typeof isActive === 'boolean' ? isActive : true,
      },
    });
    return NextResponse.json({ category });
  } catch (error) {
    console.error('Update category error:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
} 