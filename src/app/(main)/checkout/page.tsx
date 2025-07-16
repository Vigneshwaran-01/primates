// CheckoutPage.jsx
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useCart } from '@/providers/CartProvider';
import { createOrder } from '@/actions/order';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import Image from 'next/image';
import Link from 'next/link';
import { loadRazorpay } from '@/lib/razorpay';
import { CheckCircle, AlertTriangle, Lock, User } from 'lucide-react';  // Import icons
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select" // Importing Select Components

export const dynamic = 'force-dynamic';

function CheckoutContent() {
  const { items, total, itemCount } = useCart();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items, router]);

  const handleRazorpayPayment = async () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    setIsProcessing(true);
    setError('');
    try {
      // 1. Create Razorpay order on backend
      const res = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          currency: 'INR',
          receipt: `receipt_${Date.now()}`,
          notes: { userId: user.id }
        })
      });
      const order = await res.json();
      if (!order.id) throw new Error(order.error || 'Failed to create payment order');

      // 2. Load Razorpay script
      const Razorpay = await loadRazorpay();

      // 3. Open Razorpay modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
        amount: order.amount,
        currency: order.currency,
        name: 'Ecommerce Store',
        description: 'Order Payment',
        order_id: order.id,
        handler: async function (response: any) {
          // 4. On payment success, create order in DB
          try {
            const createdOrder = await createOrder({
              userId: user.id,
              items: items.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                imageUrl: item.imageUrl || null,
                color: item.color, // Include color
                size: item.size, // Include size
              })),
              total
            });
            router.push(`/account/orders/${createdOrder.id}?payment_success=true`);
          } catch (err) {
            setError('Order creation failed after payment. Please contact support.');
          }
        },
        prefill: {
          name: user.firstName + ' ' + user.lastName,
          email: user.email,
          contact: user.phoneNumber || ''
        },
        theme: { color: '#6366f1' },
      };
      const rzp = new Razorpay(options);
      rzp.open();
    } catch (err: any) {
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isClient || authLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center h-64">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Checkout</h1>

      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full">
            <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded text-center font-semibold flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Please login to checkout.</span>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center space-x-2">
              <Lock className="h-6 w-6" />
              <span>Login Required</span>
            </h2>
            <p className="mb-6 text-gray-700">You need to login to proceed with checkout.</p>
            <div className="flex flex-col space-y-3">
              <Link
                href={`/login?redirect=/checkout`}
                className="bg-primary text-white py-3 px-4 rounded-md text-center hover:bg-primary-dark transition-colors flex items-center justify-center space-x-2"
              >
                <User className="h-5 w-5" />
                <span>Login</span>
              </Link>
              <Link
                href={`/register?redirect=/checkout`}
                className="border border-primary text-primary py-3 px-4 rounded-md text-center hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
              >
                <CheckCircle className="h-5 w-5" />
                <span>Create Account</span>
              </Link>
              <button
                onClick={() => setShowLoginModal(false)}
                className="text-gray-500 hover:text-gray-700 mt-2"
              >
                Continue as Guest
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Review Your Order ({itemCount} items)</h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 border-b pb-4">
                  <div className="w-20 h-20 relative flex-shrink-0">
                    <Image
                      src={item.imageUrl || '/images/placeholder-product.jpg'}
                      alt={item.name}
                      fill
                      className="object-cover rounded"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{item.name}</h3>
                    <p className="text-gray-600">
                      ${item.price.toFixed(2)} × {item.quantity}
                    </p>

                    {/* Display Size and Color as Select Components */}
                    {item.size && (
                      <Select disabled defaultValue={item.size}>
                        <SelectTrigger className="w-[180px] mt-1">
                          <SelectValue placeholder="Select Size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={item.size}>{item.size}</SelectItem>
                        </SelectContent>
                      </Select>
                    )}

                    {item.color && (
                      <Select disabled defaultValue={item.color}>
                        <SelectTrigger className="w-[180px] mt-1">
                          <SelectValue placeholder="Select Color" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={item.color}>
                            <div className="flex items-center space-x-1">
                              <span
                                className="block w-4 h-4 rounded-full border"
                                style={{ backgroundColor: item.color }}
                              ></span>
                              <span>{item.color}</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}

                  </div>
                  <p className="font-semibold text-gray-800">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border rounded-lg shadow-md p-6 h-fit sticky top-4 bg-white">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Payment Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal ({itemCount} items)</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="border-t pt-4 flex justify-between font-bold text-lg text-gray-800">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            {user ? (
              <>
                <Button
                  onClick={handleRazorpayPayment}
                  className="w-full mt-6 py-3 text-lg"
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Pay with Razorpay'}
                </Button>
                <p className="text-sm text-gray-500 mt-2">
                  Logged in as {user.email}
                </p>
              </>
            ) : (
              <>
                <Button
                  onClick={() => setShowLoginModal(true)}
                  className="w-full mt-6 py-3 text-lg bg-primary text-white hover:bg-primary-dark"
                >
                  Login to Checkout
                </Button>
                <p className="text-sm text-gray-500 mt-2">
                  Already have an account?{' '}
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="text-primary hover:underline"
                  >
                    Login
                  </button>
                </p>
              </>
            )}

            {error && (
              <p className="text-red-500 text-sm mt-2 flex items-center space-x-2"><AlertTriangle className="h-4 w-4" /><span>{error}</span></p>
            )}

            <p className="text-xs text-gray-500 mt-4">
              By completing your purchase, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}