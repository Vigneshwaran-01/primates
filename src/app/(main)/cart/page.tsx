'use client';

import { Button } from '@/components/ui/button';
import { useCart } from '@/providers/CartProvider';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';
import { loadRazorpay } from '@/lib/razorpay';
import { createOrder } from '@/actions/order';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function CartPage() {
  const {
    items,
    total,
    itemCount,
    removeFromCart,
    updateQuantity,
    clearCart,
    isMounted,
  } = useCart();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);

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
                imageUrl: item.imageUrl || null
              })),
              total
            });
            clearCart();
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

  if (!isMounted) return null;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart ({itemCount})</h1>
      
      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg mb-4">Your cart is empty</p>
          <Link href="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="border rounded-lg p-4 flex gap-4">
                <div className="w-24 h-24 relative">
                  <Image
                    src={item.imageUrl || '/images/placeholder-product.jpg'}
                    alt={item.name}
                    fill
                    className="object-cover rounded"
                    sizes="100px"
                  />
                </div>
                <div className="flex-1">
                  <Link href={`/products/${item.id}`} className="hover:underline">
                    <h3 className="font-medium">{item.name}</h3>
                  </Link>
                  <p>${item.price.toFixed(2)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2 border rounded"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2 border rounded"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
            <Button 
              variant="outline" 
              onClick={clearCart}
              className="mt-4"
            >
              Clear Cart
            </Button>
          </div>
          
          <div className="border rounded-lg p-6 h-fit sticky top-4">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-4 flex justify-between font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <Button className="w-full mt-4" onClick={handleRazorpayPayment} disabled={isProcessing}>
                {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
              </Button>
              <Link href="/products">
                <Button variant="outline" className="w-full mt-2">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full">
            <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded text-center font-semibold">
              Please login to checkout.
            </div>
            <h2 className="text-2xl font-bold mb-4">Login Required</h2>
            <p className="mb-6">You need to login to proceed with checkout.</p>
            <div className="flex flex-col space-y-3">
              <Link
                href={`/login?redirect=/cart`}
                className="bg-primary text-white py-2 px-4 rounded-md text-center hover:bg-primary-dark transition-colors"
              >
                Login
              </Link>
              <Link
                href={`/register?redirect=/cart`}
                className="border border-primary text-primary py-2 px-4 rounded-md text-center hover:bg-gray-50 transition-colors"
              >
                Create Account
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
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
}