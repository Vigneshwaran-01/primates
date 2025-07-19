'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProductCard from '@/components/products/ProductCard';
import { cn } from '@/lib/utils';
import Image from 'next/image';
// import { useSearchStore } from '@/stores/useSearchStore';

// --- Import new font: Catamaran for the Tamil glyph ---
import { Russo_One, Orbitron, Chakra_Petch, Catamaran } from 'next/font/google';
import { useSearchStore } from '../stores/useSearchStore';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const russo = Russo_One({ subsets: ['latin'], weight: '400', variable: '--font-russo' });
const orbitron = Orbitron({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-orbitron' });
const chakra = Chakra_Petch({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-chakra' });
const catamaran = Catamaran({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-catamaran' });

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
  category?: string; 
  Reviews?: { rating: number }[];
  isFeatured?: boolean;
}

interface AnimatedNewArrivalsProps {
  products?: ProductForPage[];
}

// --- Main Component ---ENTER THE
export default function AnimatedNewArrivals({ products: propProducts }: AnimatedNewArrivalsProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const categories = ['All', 'TOP', 'BOTTOM'];
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const { query } = useSearchStore();

  const visibleProducts = (propProducts ?? []).filter((product) => {
  const matchCategory =
    activeCategory === 'All' || product.name.toLowerCase().includes(activeCategory.toLowerCase());

  const matchSearch =
    query.trim() === '' || product.name.toLowerCase().includes(query.toLowerCase());

  return matchCategory && matchSearch;
});

  
  const tamilGlyphs = ['●', '◆', '⬤', '■', '△', '✦', '✕'];

  // 🔥 NEW: Pre-defined positions for controlled, aesthetic placement in corners and edges
  const glyphPositions = [
    { top: '5%',   left: '5%',   fontSize: '120px', transform: 'rotate(-10deg)' }, // Top-left corner
    { top: '15%',  right: '10%',  fontSize: '80px',  transform: 'rotate(15deg)' },  // Top-right corner
    { top: '50%',  left: '2%',   fontSize: '70px',  transform: 'rotate(-25deg)' }, // Mid-left edge
    { bottom: '5%', right: '5%',   fontSize: '110px', transform: 'rotate(8deg)' },   // Bottom-right corner
    { bottom: '10%',left: '15%',  fontSize: '90px',  transform: 'rotate(5deg)' },   // Bottom-left corner
    { top: '60%',  right: '2%',  fontSize: '85px',  transform: 'rotate(45deg)' },  // Mid-right edge
    { top: '2%',   left: '40%',  fontSize: '60px',  transform: 'rotate(20deg)' },   // Top-center-ish
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current || !titleRef.current) return;

      gsap.fromTo(titleRef.current, 
        { opacity: 0, y: 30 },
        { 
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      gsap.utils.toArray<HTMLElement>('.tamil-fx-letter').forEach((el, i) => {
        gsap.to(el, {
          y: `+=${15 + Math.random() * 20}`,
          x: `+=${10 + Math.random() * 10}`,
          duration: 4 + Math.random() * 3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.2,
        });
      });
    }, sectionRef);

    return () => ctx.revert();
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
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 bg-[#0e0e0e] text-white shadow-inner shadow-red-900/20 relative overflow-hidden"
    >
      {/* 🔥 MODIFIED: Tamil Glyph Matrix with controlled positions */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none z-0"
        style={{ fontFamily: 'Catamaran, Noto Sans Tamil, sans-serif', lineHeight: 1 }}
      >
        {tamilGlyphs.map((char, i) => {
          // Use the pre-defined position for each glyph
          const position = glyphPositions[i];
          if (!position) return null; // Safety check

          return (
            <span
              key={i}
              className={`tamil-fx-letter absolute text-white text-opacity-10 blur-[2px] select-none`}
              style={position} // Apply the entire position object as inline styles
            >
              {char}
            </span>
          );
        })}
      </div>
      
      {/* Decorative elements (z-10) */}
      <div className="absolute top-4 left-4 opacity-20 z-10">
        <div className="grid grid-cols-4 gap-1">
          {Array.from({ length: 16 }).map((_, i) => <div key={i} className="w-1 h-1 bg-white/50 rounded-full"></div>)}
        </div>
      </div>
      <div className="absolute top-4 right-4 opacity-10 pointer-events-none z-10">
        <svg width="100" height="50" viewBox="0 0 136 67" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M68 28.64C77.4624 28.64 85.024 21.0784 85.024 11.616C85.024 2.1536 77.4624 -5.408 68 -5.408C58.5376 -5.408 50.976 2.1536 50.976 11.616C50.976 21.0784 58.5376 28.64 68 28.64Z" stroke="white" strokeWidth="2"/><path d="M128.831 43.1493C132.831 32.5493 133.691 22.4453 134.191 11.6133L67.999 0.997314L1.80701 11.6133C2.30701 22.4453 3.16701 32.5493 7.16701 43.1493C15.167 64.3493 37.831 71.3333 67.999 66.3333C98.167 71.3333 120.831 64.3493 128.831 43.1493Z" stroke="white" strokeWidth="2"/></svg>
      </div>

      {/* Main Content Wrapper (z-20) */}
      <div className={`relative z-20 `}> 
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
        <div className={`relative z-20 ${chakra.variable} `}>
  <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
    {/* ⬇️ Styled Hero Heading */}
    <div className="max-w-xl text-left transform -skew-x-6">
      <h2
        ref={titleRef}
        className="text-4xl sm:text-5xl lg:text-5xl font-black uppercase italic leading-tight "
      >
        <span className=" font-bold text-white">WE’RE ALL ABOUT</span>
        <span className="block text-[#D30000]  mt-1">
          FRESH STYLES
        </span>
      </h2>

      <p className="mt-6 text-gray-400 text-base sm:text-lg tracking-wider">
        Our clothes are made to fit your personality.
      </p>
    </div>
  </div>
</div>


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
                {cat} 
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6 lg:gap-6">
          {visibleProducts.length > 0 ? (
            visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={{ ...product, category: product.category ? { name: product.category } : undefined }}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <p className="text-gray-400">No products found in this collection.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}