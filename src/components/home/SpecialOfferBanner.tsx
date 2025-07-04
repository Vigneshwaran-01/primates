'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);

const offers = [
  'FRESH ARRIVALS',
  "STEP INTO '25",
  'LIMITED RELEASE',
  'NEW SEASON DROP',
];

export default function SpecialOfferBanner() {
  const tickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = tickerRef.current;
    if (!container) return undefined;

    const totalWidth = container.scrollWidth / 2;

    const animation = gsap.to(container, {
      x: `-=${totalWidth}`,
      duration: 20,
      ease: 'linear',
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x) => parseFloat(x) % totalWidth),
      },
    });

    return () => {
      animation.kill();
    };
  }, []);

  const renderItems = () =>
    [...offers, ...offers].map((text, index) => (
      <div
        key={index}
        className="ticker-item flex items-center gap-3 text-white text-sm font-semibold tracking-widest uppercase px-6 whitespace-nowrap"
      >
        <span className="text-lg">✦</span> {text}
      </div>
    ));

  return (
    <div className="relative overflow-hidden bg-black h-10 w-full border-t border-b border-white/10">
      <div ref={tickerRef} className="flex w-max">
        {renderItems()}
      </div>
    </div>
  );
}
