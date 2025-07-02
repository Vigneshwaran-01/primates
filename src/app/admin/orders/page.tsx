import prisma from '@/lib/db';
import Link from 'next/link';

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { user: true },
    orderBy: { orderDate: 'desc' },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-2 px-4">Order ID</th>
              <th className="py-2 px-4">User</th>
              <th className="py-2 px-4">Date</th>
              <th className="py-2 px-4">Total</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{order.id}</td>
                <td className="py-2 px-4">{order.user?.username || order.user?.email || '-'}</td>
                <td className="py-2 px-4">{new Date(order.orderDate).toLocaleDateString()}</td>
                <td className="py-2 px-4">${order.totalAmount.toFixed(2)}</td>
                <td className="py-2 px-4">{order.status}</td>
                <td className="py-2 px-4">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="py-4 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 