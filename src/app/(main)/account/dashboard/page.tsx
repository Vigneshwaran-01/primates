// app/(main)/account/dashboard/page.tsx
export const dynamic = 'force-dynamic';

import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/db';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import EditAddressForm from '@/components/account/EditAddressForm';
import { cn } from '@/lib/utils';

interface Order {
  id: number;
  totalAmount: number;
  orderDate: Date;
  status: string;
  trackingNumber?: string | null;
  OrderItems: {
    product: {
      id: number;
      name: string;
      price: number;
      imageUrl: string | null;
    };
    quantity: number;
  }[];
}

export default async function DashboardPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please sign in to view your dashboard</h2>
          <Button asChild href="/login">
  Sign In
</Button>
        </div>
      </div>
    );
  }

  const recentOrders: Order[] = await prisma.order.findMany({
    where: { userId: user.id },
    take: 3,
    orderBy: { orderDate: 'desc' },
    select: {
      id: true,
      totalAmount: true,
      orderDate: true,
      status: true,
      trackingNumber: true,
      OrderItems: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              imageUrl: true
            }
          }
        }
      }
    }
  });

  // Simple date formatter since we don't have formatDate in utils
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Your Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Account Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Account Information</h2>
          </div>
          <div className="space-y-2">
            <p><span className="font-medium">Name:</span> {user.firstName} {user.lastName}</p>
            <p><span className="font-medium">Email:</span> {user.email}</p>
            <p><span className="font-medium">Username:</span> {user.username}</p>
            <p><span className="font-medium">Member since:</span> {formatDate(user.createdAt)}</p>
          </div>
        </div>

        {/* Address Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Address Information</h2>
          </div>
          <EditAddressForm user={user} />
          {user.address ? (
            <div className="mt-4 space-y-1">
              <p>{user.address}</p>
              {user.addressLine2 && <p>{user.addressLine2}</p>}
              <p>
                {user.city}, {user.state} {user.postalCode}
              </p>
              <p>{user.country}</p>
              {user.phoneNumber && <p><span className="font-medium">Phone:</span> {user.phoneNumber}</p>}
            </div>
          ) : (
            <p className="text-gray-500 mt-4">No address information saved</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Recent Orders */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Orders</h2>
            <Link href="/account/orders">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
          {recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map(order => (
                <div key={order.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Order #{order.id}</span>
                    <span>{formatDate(order.orderDate)}</span>
                  </div>
                  <div className="text-sm">
                    <p>Status: {order.status}</p>
                    <p>Total: ₹{order.totalAmount.toFixed(2)}</p>
                    {order.trackingNumber && (
                      <p>Tracking Number: <span className="font-mono">{order.trackingNumber}</span></p>
                    )}
                  </div>
                  <div className="mt-2">
                    <Link href={`/account/orders/${order.id}`} className="inline-block px-3 py-1 bg-primary text-white rounded text-sm">View</Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No recent orders</p>
          )}
        </div>

        {/* Wishlist */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Wishlist</h2>
            <Link href="/account/wishlist">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
          {user.Wishlist.length > 0 ? (
            <div className="space-y-2">
              {user.Wishlist.slice(0, 3).map(item => (
                <div key={item.id} className="flex items-center gap-3">
                  {item.product.imageUrl && (
                    <img 
                      src={item.product.imageUrl} 
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm">₹{item.product.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Your wishlist is empty</p>
          )}
        </div>
      </div>
    </div>
  );
}