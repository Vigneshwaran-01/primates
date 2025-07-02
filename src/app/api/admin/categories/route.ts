import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, parentId, imageUrl, isActive } = body;
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    const category = await prisma.category.create({
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
    console.error('Create category error:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
} 