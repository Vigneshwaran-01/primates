"use client";

import Link from 'next/link';
import Image from 'next/image';
import OrderStatus from './OrderStatus';
import { Order } from '@/types/order';
import { useState } from 'react';

interface OrderListProps {
  orders: Order[];
}

export default function OrderList({ orders }: OrderListProps) {
  const [requesting, setRequesting] = useState<number | null>(null);
  const [requested, setRequested] = useState<number | null>(null);
  const [showReasonModal, setShowReasonModal] = useState<number | null>(null);
  const [refundReason, setRefundReason] = useState('');
  const [reasonError, setReasonError] = useState('');

  const handleRefundRequest = async (orderId: number, reason: string) => {
    setRequesting(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}/request-refund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      if (res.ok) {
        setRequested(orderId);
        setShowReasonModal(null);
        setRefundReason('');
      } else {
        alert('Failed to request refund.');
      }
    } catch (e) {
      alert('Error requesting refund.');
    } finally {
      setRequesting(null);
    }
  };

  const openReasonModal = (orderId: number) => {
    setShowReasonModal(orderId);
    setRefundReason('');
    setReasonError('');
  };

  const submitReason = (orderId: number) => {
    if (!refundReason.trim()) {
      setReasonError('Refund reason is required.');
      return;
    }
    handleRefundRequest(orderId, refundReason.trim());
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No orders found</h3>
        <p className="text-gray-500 mt-2">
          You haven't placed any orders yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div key={order.id} className="border rounded-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold">Order #{order.id}</h3>
              <p className="text-sm text-gray-500">
                {new Date(order.orderDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              {order.trackingNumber && (
                <p className="text-xs text-blue-700 mt-1">Tracking Number: <span className="font-mono">{order.trackingNumber}</span></p>
              )}
            </div>
            <OrderStatus status={order.status} orderId={order.id} />
          </div>

          <div className="space-y-4">
            {order.OrderItems.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="w-16 h-16 relative rounded-md overflow-hidden">
                  <Image
                    src={item.product.imageUrl || '/images/placeholder-product.jpg'}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="flex-1">
                  <Link
                    href={`/products/${item.product.id}`}
                    className="font-medium hover:underline line-clamp-2"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-sm text-gray-600 mt-1">
                    {item.quantity} × ${item.unitPrice.toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    ${(item.quantity * item.unitPrice).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t mt-4 pt-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Payment status</p>
              <p className="capitalize">{order.paymentStatus}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total</p>
              <p className="font-bold text-lg">
                ${order.totalAmount.toFixed(2)}
              </p>
              <Link href={`/account/orders/${order.id}`} className="inline-block mt-2 px-3 py-1 bg-primary text-white rounded text-sm">View</Link>
            </div>
          </div>

          {/* Refund Button for delivered orders */}
          {order.status === 'delivered' && !requested && (
            <>
              <button
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                disabled={requesting === order.id}
                onClick={() => openReasonModal(order.id)}
              >
                Request Refund
              </button>
              {showReasonModal === order.id && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                  <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                    <h3 className="text-lg font-bold mb-2">Refund Reason</h3>
                    <textarea
                      className="w-full border rounded p-2 mb-2"
                      rows={3}
                      value={refundReason}
                      onChange={e => setRefundReason(e.target.value)}
                      placeholder="Please provide a reason for your refund request"
                    />
                    {reasonError && <p className="text-red-600 text-sm mb-2">{reasonError}</p>}
                    <div className="flex justify-end gap-2">
                      <button
                        className="px-4 py-2 bg-gray-200 rounded"
                        onClick={() => setShowReasonModal(null)}
                        disabled={requesting === order.id}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                        disabled={requesting === order.id}
                        onClick={() => submitReason(order.id)}
                      >
                        {requesting === order.id ? 'Requesting...' : 'Submit Request'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          {order.status === 'refund_requested' && (
            <p className="mt-2 text-yellow-700 font-semibold">Refund Requested</p>
          )}
        </div>
      ))}
    </div>
  );
}