import prisma from '@/lib/db';
import { notFound } from 'next/navigation';
import OrderStatusForm from './status-form';
import TrackingNumberForm from './tracking-form';
import RefundButton from './RefundButton';
import { FaUser, FaCalendarAlt, FaMoneyBill, FaBoxOpen, FaTruck, FaCreditCard } from 'react-icons/fa';

export default async function AdminOrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const orderId = Number(id);
  if (isNaN(orderId)) notFound();
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: true,
      OrderItems: {
        include: {
          product: true,
        },
      },
      ShippingDetails: true,
      Payments: true,
    },
  });
  if (!order) notFound();

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Order Summary Card */}
      <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <FaUser className="text-gray-400" />
            <span>User:</span>
            <span className="text-primary font-bold">{order.user?.username || order.user?.email || '-'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FaCalendarAlt className="text-gray-400" />
            <span>Date:</span>
            <span>{new Date(order.orderDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FaMoneyBill className="text-gray-400" />
            <span>Total:</span>
            <span className="font-bold text-lg text-green-700">${order.totalAmount.toFixed(2)}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 items-start md:items-end">
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 mb-1`}>Order #{order.id}</span>
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : order.status === 'processing' ? 'bg-blue-100 text-blue-800' : order.status === 'shipped' ? 'bg-purple-100 text-purple-800' : order.status === 'delivered' ? 'bg-green-100 text-green-800' : order.status === 'cancelled' ? 'bg-red-100 text-red-800' : order.status === 'refunded' ? 'bg-gray-200 text-gray-700' : 'bg-gray-100 text-gray-800'}`}>{order.status}</span>
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : order.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>{order.paymentStatus}</span>
        </div>
      </div>

      {/* Tracking and Status Actions */}
      <div className="bg-gray-50 rounded-lg shadow p-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-2">
          <FaTruck className="text-gray-400" />
          <span className="font-semibold">Tracking Number:</span>
          <TrackingNumberForm orderId={order.id} trackingNumber={order.trackingNumber || ''} />
        </div>
        <div className="flex items-center gap-2">
          <FaBoxOpen className="text-gray-400" />
          <span className="font-semibold">Status:</span>
          <OrderStatusForm orderId={order.id} status={order.status} />
        </div>
        <div className="flex items-center gap-2">
          <FaCreditCard className="text-gray-400" />
          <span className="font-semibold">Payment Status:</span>
          <span className="capitalize">{order.paymentStatus}</span>
        </div>
        {((order.status as string) === 'refund_requested' || (order.status as string) === 'refunded') && order.refundReason && (
          <div className="flex items-center gap-2">
            <span className="font-semibold">Refund Reason:</span>
            <span className="italic">{order.refundReason}</span>
          </div>
        )}
      </div>

      {/* Order Items Table */}
      <h2 className="text-xl font-bold mb-4 mt-8">Order Items</h2>
      <div className="overflow-x-auto mb-8">
        <table className="min-w-full bg-white rounded-xl shadow">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-2 px-4">Image</th>
              <th className="py-2 px-4">Product</th>
              <th className="py-2 px-4">Price</th>
              <th className="py-2 px-4">Quantity</th>
              <th className="py-2 px-4">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.OrderItems.map(item => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">
                  {item.product?.imageUrl ? (
                    <img src={item.product.imageUrl} alt={item.product.name} className="w-14 h-14 object-cover rounded" />
                  ) : (
                    <div className="w-14 h-14 bg-gray-200 rounded flex items-center justify-center text-gray-400">-</div>
                  )}
                </td>
                <td className="py-2 px-4">
                  <a href={`/products/${item.product?.id}`} className="text-primary hover:underline font-medium">{item.product?.name || '-'}</a>
                </td>
                <td className="py-2 px-4">${item.unitPrice.toFixed(2)}</td>
                <td className="py-2 px-4">{item.quantity}</td>
                <td className="py-2 px-4">${(item.unitPrice * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Shipping Details */}
      <h2 className="text-xl font-bold mb-4 mt-8">Shipping Details</h2>
      {order.ShippingDetails.length > 0 ? (
        <div className="bg-white rounded-xl shadow p-6 mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {order.ShippingDetails.map(detail => (
            <div key={detail.id} className="mb-4">
              <div><span className="font-semibold">Name:</span> {detail.firstName} {detail.lastName}</div>
              <div><span className="font-semibold">Address:</span> {detail.addressLine1} {detail.addressLine2 ? `, ${detail.addressLine2}` : ''}, {detail.city}, {detail.state}, {detail.country}, {detail.postalCode}</div>
              <div><span className="font-semibold">Phone:</span> {detail.phoneNumber}</div>
              <div><span className="font-semibold">Email:</span> {detail.email}</div>
              <div><span className="font-semibold">Shipping Method:</span> {detail.shippingMethod || '-'}</div>
              <div><span className="font-semibold">Tracking URL:</span> {detail.trackingUrl || '-'}</div>
              <div><span className="font-semibold">Estimated Delivery:</span> {detail.estimatedDelivery ? new Date(detail.estimatedDelivery).toLocaleDateString() : '-'}</div>
              <div><span className="font-semibold">Actual Delivery:</span> {detail.actualDelivery ? new Date(detail.actualDelivery).toLocaleDateString() : '-'}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mb-8 text-gray-500">No shipping details found.</div>
      )}

      {/* Payments */}
      <h2 className="text-xl font-bold mb-4 mt-8">Payments</h2>
      {order.Payments.length > 0 ? (
        <div className="bg-white rounded-xl shadow p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {order.Payments.map(payment => (
            <div key={payment.id} className="mb-4">
              <div><span className="font-semibold">Method:</span> {payment.paymentMethod}</div>
              <div><span className="font-semibold">Amount:</span> ${payment.amount.toFixed(2)}</div>
              <div><span className="font-semibold">Status:</span> {payment.status}</div>
              <div><span className="font-semibold">Date:</span> {new Date(payment.paymentDate).toLocaleDateString()}</div>
              <div><span className="font-semibold">Transaction ID:</span> {payment.transactionId}</div>
              {payment.razorpayOrderId && <div><span className="font-semibold">Razorpay Order ID:</span> {payment.razorpayOrderId}</div>}
              {payment.razorpayPaymentId && <div><span className="font-semibold">Razorpay Payment ID:</span> {payment.razorpayPaymentId}</div>}
              {payment.razorpaySignature && <div><span className="font-semibold">Razorpay Signature:</span> {payment.razorpaySignature}</div>}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-500">No payment records found.</div>
      )}

      {/* Process Refund Button */}
      {(order.status as string) === 'refund_requested' && (
        <div className="mt-8">
          <RefundButton orderId={order.id} />
        </div>
      )}
    </div>
  );
} 