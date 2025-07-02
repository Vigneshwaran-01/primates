import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-strong-secret-key';

export function generateToken(userId: number): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1d' });
}

export function verifyToken(token: string): { userId: number } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number };
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies(); // Added await here
    const token = cookieStore.get('token')?.value;

    if (!token) return null;

    const decoded = verifyToken(token);
    if (!decoded) return null;

    return await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        address: true,
        addressLine2: true,
        city: true,
        state: true,
        country: true,
        postalCode: true,
        createdAt: true,
        updatedAt: true,
        Cart: {
          select: {
            id: true,
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                imageUrl: true
              }
            },
            quantity: true
          }
        },
        Wishlist: {
          select: {
            id: true,
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                imageUrl: true
              }
            }
          }
        }
      },
    });
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}