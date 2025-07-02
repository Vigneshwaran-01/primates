import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReviewForm from '@/components/products/ReviewForm';
import { type Metadata } from 'next';



// Define the type for OrderItem with product
type OrderItemWithProduct = {
  id: number;
  quantity: number;
  unitPrice: number;
  product: {
    id: number;
    name: string;
    // Add other product fields as needed
  };
};

// Define the type for ShippingDetail
type ShippingDetail = {
  id: number;
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phoneNumber: string;
  email: string;
};

// Define the type for Payment
type Payment = {
  id: number;
  paymentMethod: string;
  amount: number;
  status: string;
  paymentDate: string | Date;
  transactionId: string;
};

export default async function UserOrderDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const metadata: Metadata = {
    title: 'Order Details',
    description: 'View your order details including items, shipping, and payment information.',
  };

  const user = await getCurrentUser();
  if (!user) notFound();
  const orderId = Number(params.id);
  if (isNaN(orderId)) notFound();
  const order = await prisma.order.findUnique({
    where: { id: orderId, userId: user.id },
    include: {
      OrderItems: { include: { product: true } },
      ShippingDetails: true,
      Payments: true,
    },
  });
  if (!order) notFound();

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Order #{order.id}</h1>
      <div className="mb-4">
        <span className="font-semibold">Status:</span> {order.status}
        <br />
        <span className="font-semibold">Payment Status:</span> {order.paymentStatus}
        <br />
        <span className="font-semibold">Order Date:</span> {new Date(order.orderDate).toLocaleDateString()}
        <br />
        <span className="font-semibold">Tracking Number:</span> {order.trackingNumber || '-'}
        <br />
        {(order as any).refundReason && (["refund_requested", "refunded"].includes((order.status as string))) && (
          <>
            <span className="font-semibold">Refund Status:</span> {(order.status as string) === 'refund_requested' ? 'Refund Requested' : 'Refunded'}<br />
            <span className="font-semibold">Refund Reason:</span> <span className="italic">{(order as any).refundReason}</span><br />
          </>
        )}
      </div>
      <h2 className="text-xl font-semibold mb-2">Order Items</h2>
      <ul className="mb-4">
        {order.OrderItems.map((item: OrderItemWithProduct) => (
          <li key={item.id} className="mb-2">
            <span className="font-medium">{item.product.name}</span> &times; {item.quantity} @ ₹{item.unitPrice.toFixed(2)}
            {order.status === 'delivered' && (
              <ReviewForm productId={item.product.id} />
            )}
          </li>
        ))}
      </ul>
      <h2 className="text-xl font-semibold mb-2">Shipping Details</h2>
      {order.ShippingDetails.length > 0 ? (
        <div className="mb-4">
          {order.ShippingDetails.map((detail: ShippingDetail) => (
            <div key={detail.id} className="mb-2">
              <span className="font-semibold">Name:</span> {detail.firstName} {detail.lastName}<br />
              <span className="font-semibold">Address:</span> {detail.addressLine1} {detail.addressLine2 ? `, ${detail.addressLine2}` : ''}, {detail.city}, {detail.state}, {detail.country}, {detail.postalCode}<br />
              <span className="font-semibold">Phone:</span> {detail.phoneNumber}<br />
              <span className="font-semibold">Email:</span> {detail.email}<br />
            </div>
          ))}
        </div>
      ) : <div className="mb-4 text-gray-500">No shipping details found.</div>}
      <h2 className="text-xl font-semibold mb-2">Payments</h2>
      {order.Payments.length > 0 ? (
        <div className="mb-4">
          {order.Payments.map((payment: Payment) => (
            <div key={payment.id} className="mb-2">
              <span className="font-semibold">Method:</span> {payment.paymentMethod}<br />
              <span className="font-semibold">Amount:</span> ₹{payment.amount.toFixed(2)}<br />
              <span className="font-semibold">Status:</span> {payment.status}<br />
              <span className="font-semibold">Date:</span> {new Date(payment.paymentDate).toLocaleDateString()}<br />
              <span className="font-semibold">Transaction ID:</span> {payment.transactionId}<br />
            </div>
          ))}
        </div>
      ) : <div className="mb-4 text-gray-500">No payment records found.</div>}
      <Link href="/account/orders" className="inline-block mt-4 px-4 py-2 bg-primary text-white rounded">Back to Orders</Link>
    </div>
  );
} 