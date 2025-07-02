'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProductCard from '@/components/products/ProductCard';
import { cn } from '@/lib/utils';
import Image from 'next/image';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
import { Russo_One, Orbitron, Chakra_Petch } from 'next/font/google';

const russo = Russo_One({ subsets: ['latin'], weight: '400', variable: '--font-russo' });
const orbitron = Orbitron({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-orbitron' });
const chakra = Chakra_Petch({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-chakra' });

// --- Mock Data Interfaces (as per your original code) ---
interface CategoryForPage {
  id: number;
  name: string;
}

interface ProductForPage {
  id: number;
  name: string;
  price: number;
  description?: string | null;
  quantity?: number;
  imageUrl?: string | null;
  // This category field is the recommended long-term solution
  category?: string; 
  Reviews?: { rating: number }[];
  isFeatured?: boolean;
}

interface AnimatedNewArrivalsProps {
  products?: ProductForPage[];
}

// --- Main Component ---
export default function AnimatedNewArrivals({ products: propProducts }: AnimatedNewArrivalsProps) {
  console.log("Products received by component:", propProducts); 
  
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  // --- ⬇️ 1. MODIFICATION: Categories updated to match your product data ---
  // These categories are derived from your product names like "Men's Gym Tank Top" and "Smartphone X".
  const categories = ['all', 'gym', 'smartphone'];
  
  // --- ⬇️ 2. MODIFICATION: Default category is 'all' to show products initially ---
  const [activeCategory, setActiveCategory] = useState(categories[0]); // Default to 'all'

  // --- ⬇️ 3. MODIFICATION: Filtering logic updated to handle the new categories ---
  // This will now correctly filter your products.
  const visibleProducts = (propProducts ?? []).filter(p => {
    // If 'all' is selected, show every product.
    if (activeCategory === 'all') {
      return true;
    }
    // For other categories, check if the product name contains the category keyword.
    return p.name.toLowerCase().includes(activeCategory);
  });
  
  console.log(`Active category: "${activeCategory}". Found ${visibleProducts.length} products to display.`);

  useEffect(() => {
    if (!sectionRef.current || !titleRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });

    gsap.set(titleRef.current, { opacity: 0, y: 30 });
    tl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
    });

    return () => {
      tl.kill();
    };
  }, []);

  if (!propProducts || propProducts.length === 0) {
    return (
      <section className="container mx-auto py-20 bg-[#0e0e0e] text-white text-center rounded-2xl">
        <p className="text-lg text-gray-400">Loading products or none available.</p>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 bg-[#0e0e0e] text-white  shadow-inner shadow-red-900/20 relative overflow-hidden"
    >
      {/* Decorative elements from screenshot */}
      <div className="absolute top-4 left-4 opacity-20">
        <div className="grid grid-cols-4 gap-1">
            {Array.from({ length: 16 }).map((_, i) => <div key={i} className="w-1 h-1 bg-white/50 rounded-full"></div>)}
        </div>
      </div>
      <div className="absolute top-4 right-4 opacity-10 pointer-events-none">
        <svg width="100" height="50" viewBox="0 0 136 67" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M68 28.64C77.4624 28.64 85.024 21.0784 85.024 11.616C85.024 2.1536 77.4624 -5.408 68 -5.408C58.5376 -5.408 50.976 2.1536 50.976 11.616C50.976 21.0784 58.5376 28.64 68 28.64Z" stroke="white" strokeWidth="2"/><path d="M128.831 43.1493C132.831 32.5493 133.691 22.4453 134.191 11.6133L67.999 0.997314L1.80701 11.6133C2.30701 22.4453 3.16701 32.5493 7.16701 43.1493C15.167 64.3493 37.831 71.3333 67.999 66.3333C98.167 71.3333 120.831 64.3493 128.831 43.1493Z" stroke="white" strokeWidth="2"/></svg>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
        {/* Left: Heading */}
       <div className={`max-w-xl text-center ${chakra.variable} md:text-left font-chakra`}>
  <h2
    ref={titleRef}
    className="text-4xl sm:text-5xl font-bold tracking-wider text-white leading-tight"
  >
    We're all about{' '}
    <span className="text-[#D30000] italic font-semibold">fresh styles</span>
    {' & '}
    <span className="italic font-semibold text-white">good vibes.</span>
  </h2>
  <p className="mt-4 text-base sm:text-lg text-gray-400 tracking-wide">
    Our clothes are made to fit your personality.
  </p>
</div>


        {/* Right: Category Filters */}
        <div className="flex flex-wrap gap-2 justify-center md:justify-end shrink-0 mx-auto md:mx-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-4 py-1.5 text-sm font-medium rounded-full border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500/50",
                activeCategory === cat
                  ? 'bg-transparent text-white border-red-600'
                  : 'bg-transparent border-white/20 text-gray-400 hover:text-white hover:border-white/50'
              )}
            >
              {/* Display the category name as is (e.g., 'gym') */}
              {cat} 
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6 lg:gap-6">
        {visibleProducts.length > 0 ? (
            visibleProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    ...product,
                    category: product.category ? { name: product.category } : undefined,
                  }}
                />
            ))
        ) : (
            <div className="col-span-full text-center py-16">
                <p className="text-gray-400">No products found in this collection.</p>
            </div>
        )}
      </div>
    </section>
  );
}