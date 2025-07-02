// app/api/account/update-address/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { 
      phoneNumber, 
      address, 
      addressLine2, 
      city, 
      state, 
      country, 
      postalCode 
    } = await request.json();

    // Validate required fields
    if (!address || !city || !state || !country || !postalCode) {
      return NextResponse.json(
        { error: 'Address, city, state, country, and postal code are required' },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        phoneNumber,
        address,
        addressLine2,
        city,
        state,
        country,
        postalCode,
      },
      select: {
        id: true,
        phoneNumber: true,
        address: true,
        addressLine2: true,
        city: true,
        state: true,
        country: true,
        postalCode: true
      }
    });

    return NextResponse.json({
      success: true,
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating address:', error);
    return NextResponse.json(
      { error: 'Failed to update address' },
      { status: 500 }
    );
  }
}