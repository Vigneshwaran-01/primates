'use server';

import prisma from '@/lib/db';
import { sendOrderNotification, sendOrderConfirmationToUser } from '@/lib/mail';

export async function createOrder({
  userId,
  items,
  total,
  paymentMethod = 'razorpay',
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}: {
  userId: number;
  items: Array<{
    id: number;
    price: number;
    quantity: number;
    name: string;
    imageUrl?: string | null;
  }>;
  total: number;
  paymentMethod?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
}) {
  // Check all product IDs exist
  const productIds = items.map(item => item.id);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true }
  });
  const existingIds = new Set(products.map(p => p.id));
  const missing = productIds.filter(id => !existingIds.has(id));
  if (missing.length > 0) {
    throw new Error(`Some products in your cart are no longer available. Please refresh your cart.`);
  }

  // Create order in database
  const order = await prisma.order.create({
    data: {
      userId,
      totalAmount: total,
      status: 'pending',
      paymentStatus: paymentMethod === 'razorpay' ? 'paid' : 'pending',
      OrderItems: {
        create: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          unitPrice: item.price,
        })),
      },
      Payments: {
        create: {
          paymentMethod,
          amount: total,
          currency: 'INR',
          status: paymentMethod === 'razorpay' ? 'paid' : 'pending',
          transactionId: razorpayPaymentId || `cash_${Date.now()}`,
          razorpayOrderId,
          razorpayPaymentId,
          razorpaySignature,
        },
      },
    },
  });

  // Fetch order with OrderItems (including product) and user details for email
  try {
    const fullOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        OrderItems: { include: { product: true } },
      },
    });
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });
    if (fullOrder && user) {
      await sendOrderNotification(fullOrder, user);
      try {
        await sendOrderConfirmationToUser(fullOrder, user);
      } catch (e) {
        console.error('Failed to send order confirmation to user:', e);
      }
    }
  } catch (e) {
    // Log but do not block order creation
    console.error('Failed to send order notification email:', e);
  }

  return order;
}