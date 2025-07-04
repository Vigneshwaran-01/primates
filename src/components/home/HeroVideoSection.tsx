'use client';

import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ChevronDown, ArrowRight } from 'lucide-react';

// --- Font Imports to match your theme ---
import { Russo_One, Chakra_Petch } from 'next/font/google';

const russo = Russo_One({ subsets: ['latin'], weight: '400', variable: '--font-russo' });
const chakra = Chakra_Petch({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-chakra' });

// --- DotMatrix SVG from your CyberCarousel theme ---
const DotMatrix = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
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

const HeroVideoSection = () => {
  const sectionRef = useRef(null);
  const heroContentRef = useRef(null);
  const heroVideoUrl = 'https://res.cloudinary.com/dzldch2cm/video/upload/v1746877370/Fitness_Cinematic_video___Gym_commercial___Cinematic_fitness_film___Fitness_commercial_2K_HD_gbs5gu.webm';
  const heroFallbackImageUrl = '/images/gym-hero-bg.jpg';

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Animate the core theme elements
      tl.from(".sidebar-red", {
        width: 0,
        duration: 1,
        stagger: 0.1,
      })
      .from(".reveal-ui", {
        opacity: 0,
        duration: 0.8,
        stagger: 0.1
      }, "-=0.5");

      // Animate the main content with a slight delay
      tl.from(".reveal-text", {
        y: 50,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
      }, "-=1.2");

      // Animate the scroll cue separately
      gsap.to('.scroll-cue-arrow', {
        y: 8,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        duration: 1.5,
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Global style for text-stroke, same as your carousel */}
      <style jsx global>{`.text-stroke-white{-webkit-text-stroke:1px rgba(255,255,255,0.8);color:transparent;}`}</style>
      
      <section
        ref={sectionRef}
        className={`relative w-full h-screen overflow-hidden text-white bg-black ${russo.variable} ${chakra.variable}`}
      >
        {/* Video Background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={heroFallbackImageUrl}
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        >
          <source src={heroVideoUrl} type="video/webm" />
        </video>

        {/* Themed Overlay - more dramatic gradient */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/70 to-black/40 z-10" />


        <div className="absolute top-8 right-8 sm:right-12 md:right-24 z-30 opacity-40 reveal-ui"><DotMatrix /></div>
        
        {/* Hero Content - Repositioned and Restyled */}
        <div
          ref={heroContentRef}
          className="relative z-30 flex flex-col items-start justify-center h-full px-12 sm:px-24 md:px-32 lg:px-40"
        >
          <div className="transform -skew-x-12  w-1/2">
            <h1 className="font-russo text-5xl md:text-7xl lg:text-8xl font-black leading-none tracking-tight">
              <div className="reveal-text text-stroke-white">ENTER THE</div>
              <div className="reveal-text text-[#D30000] mt-1">NEW ERA</div>
            </h1>

            <p className="reveal-text font-chakra mt-6 text-lg md:text-xl text-neutral-300 max-w-lg leading-relaxed tracking-wider">
              Discover bold, futuristic apparel that fuses high-tech edge with luxury minimalism. Your ideology, defined.
            </p>

            <button
              className="group mt-10 inline-flex items-center gap-4 px-8 py-3 bg-[#D30000] text-white font-russo font-bold text-sm tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300 ease-in-out"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* Scroll Cue - Themed and Repositioned */}
        <div className="reveal-ui absolute bottom-8 right-8 sm:right-12 md:right-24 z-30 flex items-center gap-4">
          <span className="font-chakra text-sm uppercase tracking-[0.2em] [writing-mode:vertical-rl] text-white/60">Scroll</span>
          <ChevronDown className="scroll-cue-arrow w-6 h-6 text-white/60" />
        </div>
      </section>
    </>
  );
};

export default HeroVideoSection;