import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const orderId = Number(params.id);
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order || order.userId !== user.id) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    if (order.status !== 'delivered') {
      return NextResponse.json({ error: 'Refund can only be requested for delivered orders' }, { status: 400 });
    }
    const body = await request.json();
    const reason = body.reason?.trim();
    if (!reason) {
      return NextResponse.json({ error: 'Refund reason is required' }, { status: 400 });
    }
    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'refund_requested' as any, refundReason: reason },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to request refund' }, { status: 500 });
  }
} 