'use client';

import { useEffect, useState } from 'react';
import { X, Gift } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

const OfferPopup = () => {
  const [show, setShow] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const hasSeenOffer = localStorage.getItem('hasSeenOffer');

    if (!token && pathname === '/' && !hasSeenOffer) {
      setIsLoggedIn(false);
      const timer = setTimeout(() => {
        setShow(true);
        localStorage.setItem('hasSeenOffer', 'true');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [pathname]);

  if (isLoggedIn || !show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-2">
      <div className="relative bg-white w-full max-w-[90%] sm:max-w-md md:max-w-xl rounded-xl shadow-lg p-4 sm:p-6 text-center animate-fadeIn border border-red-100 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={() => setShow(false)}
          className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Header */}
        <div className="flex flex-col items-center gap-2 mb-4">
          <Gift className="w-8 h-8 text-red-500" />
          <h2 className="text-lg sm:text-xl font-bold text-red-600 leading-tight">
            🎁 30% OFF - Limited Time!
          </h2>
          <p className="text-xs sm:text-sm text-gray-700 max-w-xs">
            Get a limited-time 30% discount on your first order. Premium fitness gear at the best price!
          </p>
        </div>

        {/* Offer Details */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
          <div className="bg-red-50 p-3 rounded-lg text-left text-xs sm:text-sm">
            <h4 className="font-semibold text-red-600">Why shop now?</h4>
            <ul className="text-gray-700 list-disc pl-4 mt-2 space-y-1">
              <li>New user bonus</li>
              <li>Free delivery over ₹499</li>
              <li>Top-rated items</li>
            </ul>
          </div>

          <div className="bg-yellow-50 p-3 rounded-lg text-left text-xs sm:text-sm">
            <h4 className="font-semibold text-yellow-600">Hurry up!</h4>
            <ul className="text-gray-700 list-disc pl-4 mt-2 space-y-1">
              <li>Offer ends soon</li>
              <li>Limited stock</li>
              <li>Prices may rise</li>
            </ul>
          </div>
        </div>

        {/* CTA Button */}
        <Button
          onClick={() => router.push('/login')}
          className="w-full bg-gradient-to-r from-red-500 to-yellow-400 text-white font-semibold text-sm px-4 py-2 rounded-full hover:scale-105 transition-transform shadow"
        >
          Login to Claim 30% OFF
        </Button>
      </div>
    </div>
  );
};

export default OfferPopup;
