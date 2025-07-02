import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { sendOrderStatusUpdateToUser } from '@/lib/mail';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const orderId = Number(params.id);
    if (isNaN(orderId)) {
      return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 });
    }
    const { trackingNumber } = await request.json();
    if (typeof trackingNumber !== 'string') {
      return NextResponse.json({ error: 'Tracking number is required' }, { status: 400 });
    }
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { trackingNumber },
    });

    // Notify user by email
    try {
      const user = await prisma.user.findUnique({
        where: { id: order.userId },
        select: { email: true, username: true, id: true },
      });
      if (user) {
        await sendOrderStatusUpdateToUser(order, user);
      }
    } catch (e) {
      console.error('Failed to send tracking update email to user:', e);
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Update tracking number error:', error);
    return NextResponse.json({ error: 'Failed to update tracking number' }, { status: 500 });
  }
} 