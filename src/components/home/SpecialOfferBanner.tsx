'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import modifiers from 'gsap/all';

gsap.registerPlugin(modifiers);

const offers = [
  'FRESH ARRIVALS',
  'STEP INTO \'25',
  'LIMITED RELEASE',
  'NEW SEASON DROP',
];

export default function SpecialOfferBanner() {
  const tickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = tickerRef.current;
    if (!container) return undefined;

    const items = container.querySelectorAll('.ticker-item');
    const itemCount = items.length;
    const totalWidth = container.scrollWidth;

    // GSAP Infinite Loop Animation
    const animation = gsap.to(container, {
      x: `-=${totalWidth / 2}`, // only scroll half (we duplicated items)
      duration: 20,
      ease: 'linear',
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x) => parseFloat(x) % (totalWidth / 2)), // wrap
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
        className="ticker-item flex items-center gap-2 text-white text-sm font-semibold tracking-wide uppercase px-4 whitespace-nowrap"
      >
        <span className="text-lg">*</span> {text}
      </div>
    ));

  return (
    <div className="relative overflow-hidden bg-black h-10 w-full">
      <div
        ref={tickerRef}
        className="flex w-max"
      >
        {renderItems()}
      </div>
    </div>
  );
}
