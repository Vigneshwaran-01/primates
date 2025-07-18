'use client';

import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

export default function ZymCyberpunkAbout() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Use a GSAP context for safe cleanup in React
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
          end: 'bottom 80%',
          scrub: 1.5,
        },
      });

      // 1. Animate the background grid
      tl.fromTo(
        '.background-grid',
        { opacity: 0 },
        { opacity: 0.1, duration: 2 },
        0 // Start at the beginning of the timeline
      );

      // 2. Animate the main heading with a clip-path reveal
      tl.fromTo(
        '.heading-reveal',
        { clipPath: 'inset(100% 0 0 0)' },
        { clipPath: 'inset(0% 0 0 0)', duration: 2, ease: 'power3.out' },
        0.2 // Start slightly after the grid
      );
      
      // 3. Animate the red "IN INDIA." text
      tl.fromTo(
        '.sub-heading',
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 1.5, ease: 'power3.out' },
        0.5 // Start after the main heading reveal begins
      );

      // 4. Animate the UI panels on the right
      tl.fromTo(
        '.info-panel',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.5, stagger: 0.3, ease: 'power3.out' },
        0.7 // Stagger their appearance after the headings
      );

      // 5. Animate the testimonial text with a typewriter effect
      gsap.to('.testimonial-text', {
        text: 'The most comfortable activewear I\'ve ever owned!',
        duration: 3,
        ease: 'none',
        scrollTrigger: {
          trigger: '.testimonial-panel',
          start: 'top 70%',
          toggleActions: 'play none none none',
        },
      });

    }, sectionRef);

    // Cleanup function
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-black text-white  sm:py-32 px-4 sm:px-8 md:px-12 lg:px-20 overflow-hidden"
    >
      {/* Background Grid Element */}
      <div className="background-grid absolute inset-0 w-full h-1/2 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-0"></div>

      <div className="relative z-10 flex flex-col lg:flex-row lg:space-x-12">
        {/* === LEFT COLUMN: ABOUT STATEMENT === */}
        <div className="lg:w-1/2 flex flex-col justify-center text-left mb-16 lg:mb-0">
          <div className="heading-reveal overflow-hidden">
             <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter leading-tight text-white mb-2">
                We make the most advanced activewear
              </h2>
          </div>
          <h2 className="sub-heading text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter leading-tight text-[#db2525]">
            in India.
          </h2>
        </div>

        {/* === RIGHT COLUMN: UI PANELS === */}
        <div className="lg:w-1/2 flex flex-col space-y-8">
          
          {/* Testimonial Panel */}
          <div className="info-panel testimonial-panel p-6 relative backdrop-blur-sm bg-white/5 border border-cyan-400/20 rounded-lg">
             <div className="absolute top-2 left-2 w-8 h-8 border-l-2 border-t-2 border-cyan-400/50"></div>
             <div className="absolute bottom-2 right-2 w-8 h-8 border-r-2 border-b-2 border-cyan-400/50"></div>
            <h3 className="font-mono text-sm uppercase text-cyan-400 mb-3 tracking-widest">
              // Incoming Transmission
            </h3>
            <p className="font-mono text-lg md:text-xl text-gray-300 italic">
              "<span className="testimonial-text text-white font-bold"></span>"
              <span className="cursor-blink">|</span>
              <br /> – A Happy Athlete
            </p>
          </div>

          {/* Subscription Form Panel */}
          <div className="info-panel p-6 relative backdrop-blur-sm bg-white/5 border border-red-500/20 rounded-lg">
             <div className="absolute top-2 left-2 w-8 h-8 border-l-2 border-t-2 border-red-500/50"></div>
             <div className="absolute bottom-2 right-2 w-8 h-8 border-r-2 border-b-2 border-red-500/50"></div>
            <h3 className="font-mono text-sm uppercase text-red-500 mb-3 tracking-widest">
              // Secure The Drop
            </h3>
            <p className="font-chakra text-gray-300 mb-6">
              Subscribe for exclusive offers, giveaways, and once-in-a-lifetime deals.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center w-full">
              <input
                type="email"
                placeholder="user@domain.root"
                className="font-mono bg-black/30 text-white py-3 px-5 w-full sm:flex-1 rounded-md sm:rounded-r-none border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all duration-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="subscribe-button mt-4 sm:mt-0 relative overflow-hidden w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-md sm:rounded-l-none transition-all duration-300">
                <span className="relative z-10">Subscribe</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add some CSS for the custom effects directly here or in your global CSS */}
      <style jsx>{`
        .cursor-blink {
          animation: blink 1s step-end infinite;
        }
        @keyframes blink {
          from, to { opacity: 1; }
          50% { opacity: 0; }
        }
        
        .subscribe-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.4s ease;
        }

        .subscribe-button:hover::before {
          left: 100%;
        }
      `}</style>
    </section>
  );
}