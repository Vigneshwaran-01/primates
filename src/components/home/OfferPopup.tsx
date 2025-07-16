'use client';

import { useEffect, useState } from 'react';
import { X, Gift } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const OfferPopup = () => {
  const [show, setShow] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Default to true to avoid flash
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken'); // 🔑 Replace with your actual auth key
    if (!token) {
      setIsLoggedIn(false);
      const timer = setTimeout(() => setShow(true), 2000); // Delay showing popup
      return () => clearTimeout(timer);
    }
  }, []);

  if (isLoggedIn || !show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="relative bg-white max-w-2xl w-full rounded-3xl shadow-2xl p-10 text-center animate-fadeIn border border-red-100">
        {/* Close Button */}
        <button
          onClick={() => setShow(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Icon & Header */}
        <div className="flex flex-col items-center gap-2 mb-6">
          <Gift className="w-10 h-10 text-red-500" />
          <h2 className="text-4xl font-extrabold text-red-600">30% OFF - Exclusive Deal!</h2>
          <p className="text-lg text-gray-700 max-w-lg">
            Unlock a special limited-time discount on your first order. Boost your fitness game with premium gear at unbeatable prices!
          </p>
        </div>

        {/* Offer Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-red-50 p-4 rounded-xl shadow-sm text-left">
            <h4 className="font-semibold text-red-600">Why shop now?</h4>
            <ul className="text-gray-700 list-disc pl-5 text-sm mt-2 space-y-1">
              <li>First-time user bonus</li>
              <li>Free delivery over ₹499</li>
              <li>Top-rated products</li>
            </ul>
          </div>

          <div className="bg-yellow-50 p-4 rounded-xl shadow-sm text-left">
            <h4 className="font-semibold text-yellow-600">Hurry up!</h4>
            <ul className="text-gray-700 list-disc pl-5 text-sm mt-2 space-y-1">
              <li>Limited time offer</li>
              <li>Only few units left</li>
              <li>Price may go up soon</li>
            </ul>
          </div>
        </div>

        {/* CTA Button */}
        <Button
          onClick={() => router.push('/login')} // 🔁 Redirect to login
          className="bg-gradient-to-r from-red-500 to-yellow-400 text-white font-bold text-lg px-10 py-3 rounded-full hover:scale-105 transition-transform shadow-lg"
        >
          Login to Claim 30% OFF
        </Button>
      </div>
    </div>
  );
};

export default OfferPopup;
