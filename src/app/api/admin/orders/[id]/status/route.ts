import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { sendOrderStatusUpdateToUser } from '@/lib/mail';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const orderId = Number(params.id);
    if (isNaN(orderId)) {
      return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 });
    }
    const { status } = await request.json();
    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
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
      console.error('Failed to send order status update email to user:', e);
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Update order status error:', error);
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
  }
} 