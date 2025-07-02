import prisma from '@/lib/db';
import { notFound } from 'next/navigation';

export default async function AdminUserDetailsPage({ params }: { params: { id: string } }) {
  const userId = Number(params.id);
  if (isNaN(userId)) notFound();
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      Orders: {
        orderBy: { orderDate: 'desc' },
      },
    },
  });
  if (!user) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">User Details</h1>
      <div className="mb-8 bg-white rounded shadow p-6">
        <div className="mb-2"><span className="font-semibold">Username:</span> {user.username}</div>
        <div className="mb-2"><span className="font-semibold">Email:</span> {user.email}</div>
        <div className="mb-2"><span className="font-semibold">Name:</span> {user.firstName || ''} {user.lastName || ''}</div>
        <div className="mb-2"><span className="font-semibold">Phone:</span> {user.phoneNumber || '-'}</div>
        <div className="mb-2"><span className="font-semibold">Address:</span> {user.address || '-'} {user.city ? `, ${user.city}` : ''} {user.state ? `, ${user.state}` : ''} {user.country ? `, ${user.country}` : ''} {user.postalCode ? `, ${user.postalCode}` : ''}</div>
        <div className="mb-2"><span className="font-semibold">Created:</span> {new Date(user.createdAt).toLocaleDateString()}</div>
      </div>
      <h2 className="text-xl font-bold mb-2 mt-8">Orders</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-2 px-4">Order ID</th>
              <th className="py-2 px-4">Date</th>
              <th className="py-2 px-4">Total</th>
              <th className="py-2 px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {user.Orders.length > 0 ? user.Orders.map(order => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{order.id}</td>
                <td className="py-2 px-4">{new Date(order.orderDate).toLocaleDateString()}</td>
                <td className="py-2 px-4">${order.totalAmount.toFixed(2)}</td>
                <td className="py-2 px-4">{order.status}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} className="py-4 text-center text-gray-500">
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