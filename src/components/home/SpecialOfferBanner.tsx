'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

// The offers list
const offers = [
  'FRESH ARRIVALS',
  "STEP INTO '25",
  'LIMITED RELEASE',
  'NEW SEASON DROP',
  'EXCLUSIVE ACCESS',
  'GEAR UP NOW',
];

export default function HoloTicker() {
  const tickerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const ticker = tickerRef.current;
    if (!container || !ticker) return;

    // --- 1. HORIZONTAL SCROLL ANIMATION ---
    const totalWidth = ticker.scrollWidth / 2;
    gsap.to(ticker, {
      x: `-=${totalWidth}`,
      duration: 30,
      ease: 'linear',
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x) => parseFloat(x) % totalWidth),
      },
    });

    // --- 2. INTERACTIVE MOUSE DISTORTION ---
    // Use quickTo for high-performance animation on mouse move
    const skewTo = gsap.quickTo(ticker, 'skewX', { duration: 0.5, ease: 'power2.out' });
    const blurTo = gsap.quickTo(ticker, 'filter', { duration: 0.5, ease: 'power2.out' });

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, currentTarget } = e;
      const rect = (currentTarget as HTMLElement).getBoundingClientRect();
      const move = (clientX - rect.left) / rect.width; // 0 to 1
      const skew = gsap.utils.mapRange(0, 1, -10, 10, move); // map mouse pos to skew
      const blur = gsap.utils.mapRange(0, 0.5, 2, 0, Math.abs(move - 0.5)); // blur at edges
      skewTo(skew);
      blurTo(`blur(${blur}px)`);
    };

    const handleMouseLeave = () => {
      skewTo(0);
      blurTo('blur(1px)');
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    // Cleanup function
    return () => {
      gsap.killTweensOf(ticker);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const renderItems = () =>
    [...offers, ...offers].map((text, index) => (
      <div
        key={index}
        className="ticker-item flex items-center gap-4 text-neutral-300 text-sm font-mono tracking-wider uppercase px-8 whitespace-nowrap"
      >
        <span className="text-base text-[#db2525] font-bold">//</span>
        
        <span>{text}</span>
        <span className="text-white">✦</span>
      </div>
    ));

  return (
    // Main container with perspective for the 3D effect
    <div
      ref={containerRef}
      className="holo-ticker-container relative h-12 w-full bg-black overflow-hidden"
      style={{ perspective: '300px' }}
    >
      {/* The wrapper that is tilted in 3D space */}
      <div
        className="absolute w-full h-full"
        style={{ transform: 'rotateX(15deg) scale(1.2)' }}
      >
        <div ref={tickerRef} className="flex w-max items-center h-full">
          {renderItems()}
        </div>
      </div>

      {/* Fade overlays for the infinite effect */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>

      {/* Add the CSS for the pulsing container glow */}
      <style jsx>{`
        .holo-ticker-container {
          box-shadow: 0 0 15px 0px rgba(219, 37, 37, 0.2);
          animation: pulse-glow 3s infinite ease-in-out;
        }

        @keyframes pulse-glow {
          0% { box-shadow: 0 0 15px 0px rgba(219, 37, 37, 0.2); }
          50% { box-shadow: 0 0 25px 5px rgba(219, 37, 37, 0.4); }
          100% { box-shadow: 0 0 15px 0px rgba(219, 37, 37, 0.2); }
        }
      `}</style>
    </div>
  );
}