'use client';

import { useState, useLayoutEffect, useRef, useEffect } from 'react';
import Head from 'next/head';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { ChevronDown, Plus } from 'lucide-react';
import Image from 'next/image';
import AnimatedNewArrivals from '@/components/home/AnimatedNewArrivals';

gsap.registerPlugin(TextPlugin);

// Data
const products = [
  { name: 'Theory of Ideology Jacket', price: '200.00', img: '/black-t-shirt.png' },
  { name: 'Guerilla-Group Vest', price: '185.00', img: '/white-t-shirt.png' },
  { name: 'Acronym Cargo Pants', price: '250.00', img: '/blue-t-shirt.png' },
];

// SVG Component
const DotMatrix = () => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="hidden sm:block">
        <circle cx="4" cy="4" r="2" fill="white" fillOpacity="0.2"/>
        <circle cx="4" cy="16" r="2" fill="white" fillOpacity="0.2"/>
        <circle cx="4" cy="28" r="2" fill="white" fillOpacity="0.2"/>
        <circle cx="4" cy="40" r="2" fill="white" fillOpacity="0.2"/>
        <circle cx="16" cy="4" r="2" fill="white" fillOpacity="0.2"/>
        <circle cx="16" cy="16" r="2" fill="white" fillOpacity="0.2"/>
        <circle cx="16" cy="28" r="2" fill="white" fillOpacity="0.2"/>
        <circle cx="16" cy="40" r="2" fill="white" fillOpacity="0.2"/>
        <circle cx="28" cy="4" r="2" fill="white" fillOpacity="0.2"/>
        <circle cx="28" cy="16" r="2" fill="white" fillOpacity="0.2"/>
        <circle cx="28" cy="28" r="2" fill="white" fillOpacity="0.2"/>
        <circle cx="28" cy="40" r="2" fill="white" fillOpacity="0.2"/>
        <circle cx="40" cy="4" r="2" fill="white" fillOpacity="0.2"/>
        <circle cx="40" cy="16" r="2" fill="white" fillOpacity="0.2"/>
        <circle cx="40" cy="28" r="2" fill="white" fillOpacity="0.2"/>
        <circle cx="40" cy="40" r="2" fill="white" fillOpacity="0.2"/>
    </svg>
);

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

export default function CyberCarousel() {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  const [active, setActive] = useState(0);
  const prevActive = usePrevious<number>(active);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const textRefs = useRef<{ title: HTMLHeadingElement | null; price: HTMLParagraphElement | null }[]>([]);
  
  const isAnimating = useRef(false);

  products.forEach((_, i) => {
    if (!textRefs.current[i]) textRefs.current[i] = { title: null, price: null };
  });

  const slide = (dir: 'left' | 'right') => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    const next = dir === 'left' ? (active - 1 + products.length) % products.length : (active + 1) % products.length;
    setActive(next);
    setTimeout(() => { isAnimating.current = false; }, 1200);
  };

  useLayoutEffect(() => {
    if (!hasMounted) return;
    const firstItem = itemRefs.current[0];
    const firstTitle = textRefs.current[0]?.title;

    const ctx = gsap.context(() => {
      gsap.from(".reveal-element", { y: 30, opacity: 0, stagger: 0.1, duration: 1.2, ease: 'expo.out', delay: 0.5 });
      gsap.from(".sidebar-red", { width: 0, stagger: 0.1, duration: 1, ease: 'power3.inOut' });
      if (firstItem && firstTitle) {
        gsap.fromTo(firstItem, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.2, ease: 'expo.out', delay: 0.3 });
        gsap.from(firstTitle, { text: "", duration: 1, ease: 'none', delay: 0.8 });
      }
    }, containerRef);
    return () => ctx.revert();
  }, [hasMounted]);

  useLayoutEffect(() => {
    if (typeof prevActive !== 'number' || prevActive === active || !hasMounted) return;
    const ctx = gsap.context(() => {
      const direction = active > prevActive ? 1 : -1;
      const exitingItem = itemRefs.current[prevActive];
      const enteringItem = itemRefs.current[active];
      if (exitingItem) {
        gsap.to(exitingItem, { xPercent: -100 * direction, opacity: 0, scale: 0.8, duration: 1, ease: 'power3.inOut' });
      }
      if (enteringItem) {
        const enteringTitle = textRefs.current[active]?.title;
        const enteringPrice = textRefs.current[active]?.price;
        gsap.fromTo(enteringItem, { xPercent: 100 * direction, opacity: 0, scale: 0.8 }, { xPercent: 0, opacity: 1, scale: 1, duration: 1, ease: 'power3.inOut' });
        if (enteringTitle) gsap.fromTo(enteringTitle, { text: "" }, { text: products[active].name, duration: 0.8, ease: 'none', delay: 0.4 });
        if (enteringPrice) gsap.fromTo(enteringPrice, { text: "" }, { text: `$ ${products[active].price}`, duration: 0.8, ease: 'none', delay: 0.5 });
      }
    }, containerRef);
    return () => ctx.revert();
  }, [active, prevActive, hasMounted]);

  if (!hasMounted) return null;

  return (
    <>
      <Head>
        <title>Theory of Ideology</title>
        {/* ✅ BONUS: Added meta viewport for correct mobile scaling */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Russo+One&display=swap" rel="stylesheet" />
      </Head>
      
      <style jsx global>{`.text-stroke-white{-webkit-text-stroke:1px rgba(255,255,255,0.8);color:transparent;}`}</style>

      <section
        ref={containerRef}
        className="relative h-screen bg-black text-white overflow-hidden flex items-center justify-center font-['Russo_One',_sans-serif]"
      >
        {/* Responsive Sidebars */}
        <div className="sidebar-red absolute left-0 top-0 h-full w-12 sm:w-20 md:w-32 bg-[#D30000] transform -skew-x-12 origin-top-left z-0"></div>
        <div className="sidebar-red absolute right-0 top-0 h-full w-12 sm:w-20 md:w-32 bg-[#D30000] transform skew-x-12 origin-top-right z-0"></div>
        
        {/* ✅ Responsive Title Block */}
        <div className="absolute top-24 left-4 sm:left-12 md:left-24 lg:left-32 z-30 transform -skew-x-12 max-w-[80%]">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black leading-tight sm:leading-none">
            <div className="reveal-element text-stroke-white">THEORY OF IDEOLOGY</div>
            <div className="reveal-element text-[#D30000] mt-1">COLLECTION</div>
            <div className="reveal-element text-stroke-white mt-1">AVAILABLE</div>
          </h1>
        </div>
        
        {/* ✅ Responsive Left Paginator */}
        <div className="absolute top-1/2 -translate-y-1/2 left-2 sm:left-4 md:left-12 z-40 flex flex-col items-center gap-8">
            <div className="[writing-mode:vertical-rl] text-xs sm:text-sm tracking-[0.3em] uppercase opacity-70 reveal-element">
              BUY NOW
            </div>
            <div className="flex flex-col items-center gap-2 reveal-element">
              {products.map((_, i) => (
                <div key={i} className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full transition-all duration-500 ${active === i ? 'bg-white shadow-[0_0_10px_white]' : 'border-2 border-white/50'}`}></div>
              ))}
              <ChevronDown className="mt-2 text-white/80 w-5 h-5 sm:w-6 sm:h-6" />
            </div>
        </div>

        {/* Carousel Container */}
        <div className="relative w-full h-full flex items-center justify-center [perspective:1500px]">
          {products.map((product, i) => (
            <div
              key={product.name}
              ref={el => { itemRefs.current[i] = el; }}
              className="absolute w-full h-full flex items-center justify-center will-change-transform"
              style={{ zIndex: i === active ? 30 : i === prevActive ? 20 : 10, pointerEvents: i === active ? 'auto' : 'none', visibility: i === active || i === prevActive ? 'visible' : 'hidden' }}
            >
              {/* ✅ Responsive Product Image Container */}
              <div className="w-[280px] h-[350px] sm:w-[320px] sm:h-[420px] md:w-[400px] md:h-[500px] lg:w-[500px] lg:h-[600px] relative mt-16 z-20">
                 <Image
                  src={product.img} alt={product.name} fill
                  sizes="(max-width: 640px) 280px, (max-width: 768px) 320px, (max-width: 1024px) 400px, 500px"
                  priority={i === 0}
                  className="product-image object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.7)]"
                />
              </div>

              {/* ✅ Responsive Info Card */}
              <div className="info-card absolute bottom-[15%] sm:bottom-[20%] w-[90%] sm:w-auto left-1/2 -translate-x-1/2 z-30 flex flex-col sm:flex-row items-center gap-2 sm:gap-4 bg-black/40 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/10">
                <div className="text-center sm:text-left">
                  <h3 className="font-semibold text-base sm:text-lg" ref={el => { textRefs.current[i].title = el; }}>
                    {i === active ? product.name : ''}
                  </h3>
                  <p className="text-white/70 text-sm sm:text-base" ref={el => { textRefs.current[i].price = el; }}>
                    {i === active ? `$ ${product.price}` : ''}
                  </p>
                </div>
                <button className="w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 flex items-center justify-center bg-[#D30000] rounded-full hover:scale-110 transition-transform">
                  <Plus size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* ✅ Responsive Right Controls */}
        <div className="absolute top-1/2 -translate-y-1/2 right-2 sm:right-4 md:right-12 z-40 flex flex-col items-end gap-16">
            <div className="flex flex-col items-center gap-4 reveal-element">
              
              <button onClick={() => slide('right')} className="bg-white/80 text-black rounded-full p-2 sm:p-3 hover:scale-110 hover:bg-white transition-all">
                <ChevronDown className="-rotate-90 w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
              </button>
            </div>
            {/* Hiding Japanese text on small screens to reduce clutter */}
            <div className="hidden md:block text-right text-white/70 max-w-[280px] text-sm leading-relaxed reveal-element">
                猫の献身と他の世界とのつながりを結びこ付ける方法が発見されました. すべての伝説はここから始まり、動機覚行為を助けるために悪
            </div>
        </div>
        
        {/* ✅ Responsive Bottom Elements */}
        <div className="absolute bottom-6 right-4 sm:bottom-12 sm:right-12 md:right-24 lg:right-32 z-30 text-right">
            <div className="reveal-element">
              <div className="h-0.5 w-12 sm:w-16 bg-[#D30000] ml-auto mb-2"></div>
              <div className="text-4xl sm:text-5xl md:text-6xl font-black tracking-widest mb-8">2025</div>
            </div>
        </div>
        
        <div className="absolute bottom-4 left-4 z-30 opacity-50 reveal-element"><DotMatrix /></div>
        <div className="absolute bottom-4 right-4 z-30 opacity-50 reveal-element"><DotMatrix /></div>
      </section>
      
    </>
  );
}