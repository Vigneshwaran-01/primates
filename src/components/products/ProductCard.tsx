'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useCart } from '@/providers/CartProvider';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import gsap from 'gsap';

type ProductCardProps = {
  product: {
    id: number;
    name: string;
    price: number;
    imageUrl?: string | null;
    quantity?: number;
    sizes?: string[];
    category?: { name: string };
  };
  className?: string;
};

export default function ProductCard({ product, className }: ProductCardProps) {
  const { addToCart } = useCart();

  const sizeOverlayRef = useRef<HTMLDivElement | null>(null);
  // Removed addBtnRef as we are no longer applying a continuous GSAP animation to it.

  useEffect(() => {
    const sizeOverlay = sizeOverlayRef.current;
    // Ensure both ref.current and its closest parent exist
    const imageWrapper = sizeOverlay?.closest('.image-wrapper');
    if (!sizeOverlay || !imageWrapper) return;

    gsap.set(sizeOverlay, { opacity: 0, y: 30, display: 'none' });

    const handleEnter = () => {
      gsap.killTweensOf(sizeOverlay);
      gsap.fromTo(
        sizeOverlay,
        { opacity: 0, y: 30, display: 'flex' },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      );
    };

    const handleLeave = () => {
      gsap.killTweensOf(sizeOverlay);
      gsap.to(sizeOverlay, {
        opacity: 0,
        y: 30,
        duration: 0.4,
        ease: 'power3.in',
        onComplete: () => { gsap.set(sizeOverlay, { display: 'none' }); },
      });
    };

    imageWrapper.addEventListener('mouseenter', handleEnter);
    imageWrapper.addEventListener('mouseleave', handleLeave);

    return () => {
      imageWrapper.removeEventListener('mouseenter', handleEnter);
      imageWrapper.removeEventListener('mouseleave', handleLeave);
      gsap.killTweensOf(sizeOverlay);
    };
  }, []);

  // Removed the useEffect for addBtnRef as it's no longer needed for the continuous bounce animation.
  // The hover effect is handled by Tailwind's transition-transform hover:scale-110.

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Crucial to prevent Link navigation when clicking the button

    addToCart(product, 1);
  };

  const getImagePath = (imageUrl: string | null | undefined) => {
    if (!imageUrl) return '/placeholder.png';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${imageUrl}`;
  };

  return (
    // This is now the single root div for the ProductCard component.
    // It is `relative` for the absolutely positioned `Plus` button.
    <div
      className={cn(
        "group relative flex flex-col h-full w-full overflow-hidden rounded-2xl p-3 transition-all",
        "bg-[#1A1A1A] hover:bg-[#2A0A0A] border border-transparent hover:border-red-800/50",
        className
      )}
    >
      {/* The Link wraps the product image and text info for navigation to the product page */}
      {/* It should NOT wrap the "Add to Cart" button, as that button has its own action */}
      <Link href={`/products/${product.id}`} className="flex-grow flex flex-col">
        <div className="relative w-full aspect-square overflow-hidden rounded-md mx-auto image-wrapper">
          {/* Wishlist Icon */}
          <div className="absolute top-2 right-2 z-10 flex gap-2">
            <button
              className="bg-black/70 text-white p-1.5 rounded-full hover:bg-red-600 transition-all"
              aria-label="Add to Wishlist"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0 6.75-9 12.75-9 12.75S3 15 3 8.25a5.25 5.25 0 0110.5 0A5.25 5.25 0 0121 8.25z" />
              </svg>
            </button>
          </div>

          {/* Sizes Overlay */}
          {product.sizes && product.sizes.length > 0 && (
            <div
              ref={sizeOverlayRef}
              className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap justify-center gap-2 bg-black/60 backdrop-blur-md rounded-md py-2 px-2"
              style={{ display: 'none' }}
            >
              <div className="p-2 bg-black/30 rounded-lg border border-red-800  flex gap-2 flex-wrap justify-center">
                {product.sizes.map((size, i) => (
                  <span
                    key={i}
                    className="text-xs font-bold tracking-wide px-3 py-1 rounded-md border border-red-500 text-red-300 hover:bg-red-600 hover:text-white transition-all duration-150"
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>
          )}

          <Image
            src={getImagePath(product.imageUrl)}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover object-center transition-transform duration-500 ease-in-out group-hover:scale-110"
          />
        </div>

        {/* Product Name and Price */}
        <div className="text-center mt-3">
          <h3 className="text-sm px-4 font-semibold tracking-wide text-white">
            {product.name.toUpperCase()}
          </h3>
          <p className="text-white/70 mt-1 text-xs">${product.price.toFixed(2)}</p>
        </div>
      </Link> {/* End of Link wrapping image and text */}

      {/* 🪄 Add-to-Cart Button - Positioned absolutely at the bottom-right of the whole card */}
      <Button
        // Removed ref as no GSAP animation is applied to it
        onClick={handleAddToCart}
        // These classes position it relative to the main `ProductCard` div
        className="absolute bottom-2 right-2 z-10 bg-red-600 text-white w-10 h-10 rounded-full p-0 flex items-center justify-center shadow-md transition-transform duration-200 hover:scale-110 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
        aria-label={`Add ${product.name} to cart`}
      >
        <Plus size={20} />
      </Button>
    </div>
  );
}