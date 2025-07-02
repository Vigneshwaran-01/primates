import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
// TODO: Add admin authentication/authorization as needed

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const orderId = Number(params.id);
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    if ((order.status as string) !== 'refund_requested') {
      return NextResponse.json({ error: 'Refund can only be processed for refund requested orders' }, { status: 400 });
    }
    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'refunded' as any },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process refund' }, { status: 500 });
  }
} 