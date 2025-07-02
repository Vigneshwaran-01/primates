import prisma from '@/lib/db';
import Link from 'next/link';

export default async function AdminDashboard() {
  // Fetch analytics
  const [orderCount, totalSales, recentOrders] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { totalAmount: true } }),
    prisma.order.findMany({
      orderBy: { orderDate: 'desc' },
      take: 5,
      include: { user: true },
    }),
  ]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded shadow text-center">
          <div className="text-2xl font-bold">{orderCount}</div>
          <div className="text-gray-600">Total Orders</div>
        </div>
        <div className="bg-white p-6 rounded shadow text-center">
          <div className="text-2xl font-bold">${(totalSales._sum.totalAmount || 0).toFixed(2)}</div>
          <div className="text-gray-600">Total Sales</div>
        </div>
        <div className="bg-white p-6 rounded shadow text-center">
          <div className="text-2xl font-bold">{recentOrders.length}</div>
          <div className="text-gray-600">Recent Orders</div>
        </div>
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="py-2 px-4">Order ID</th>
                <th className="py-2 px-4">User</th>
                <th className="py-2 px-4">Date</th>
                <th className="py-2 px-4">Total</th>
                <th className="py-2 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{order.id}</td>
                  <td className="py-2 px-4">{order.user?.username || order.user?.email || '-'}</td>
                  <td className="py-2 px-4">{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td className="py-2 px-4">${order.totalAmount.toFixed(2)}</td>
                  <td className="py-2 px-4">{order.status}</td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-gray-500">
                    No recent orders.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <a href="/admin/products" className="block p-6 bg-white rounded shadow hover:bg-primary hover:text-white transition-colors">
          <h2 className="text-xl font-semibold mb-2">Manage Products</h2>
          <p>Add, edit, or remove products from your store.</p>
        </a>
        <a href="/admin/categories" className="block p-6 bg-white rounded shadow hover:bg-primary hover:text-white transition-colors">
          <h2 className="text-xl font-semibold mb-2">Manage Categories</h2>
          <p>Organize your products into categories.</p>
        </a>
        <a href="/admin/users" className="block p-6 bg-white rounded shadow hover:bg-primary hover:text-white transition-colors">
          <h2 className="text-xl font-semibold mb-2">View Users</h2>
          <p>See all registered users and their details.</p>
        </a>
        <a href="/admin/orders" className="block p-6 bg-white rounded shadow hover:bg-primary hover:text-white transition-colors">
          <h2 className="text-xl font-semibold mb-2">View Orders</h2>
          <p>Track and manage customer orders.</p>
        </a>
      </div>
    </div>
  );
} 