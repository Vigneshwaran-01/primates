// app/coming-soon/page.tsx
'use client';
import React from 'react';
import Link from 'next/link';
import { Instagram, Facebook, Twitter } from 'lucide-react';
import { motion } from 'framer-motion';

// It's highly recommended to set up these fonts in your layout/globals for consistency.
// For example, in your tailwind.config.js:
// theme: {
//   extend: {
//     fontFamily: {
//       russo: ['"Russo One"', 'sans-serif'], // Bold, impactful headlines
//       chakra: ['"Chakra Petch"', 'sans-serif'], // Techy, readable body text
//     },
//   },
// },

export const metadata = {
  title: 'PRIMATE // LAUNCH IMMINENT',
  description: 'Connection Established... Get ready to unleash your inner beast. PRIMATE is coming.',
};

// A component for the classic cyberpunk grid background
const AnimatedGrid = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 0.3 }}
    transition={{ duration: 1.5, ease: 'easeInOut' }}
    className="absolute inset-0 z-0 h-full w-full"
    style={{
      backgroundImage: `linear-gradient(to right, #db2525 1px, transparent 1px),
                      linear-gradient(to bottom, #db2525 1px, transparent 1px)`,
      backgroundSize: '40px 40px',
      maskImage: 'radial-gradient(ellipse 80% 50% at 50% 50%, black 40%, transparent 100%)',
      animation: 'pan 30s linear infinite',
    }}
  />
);

export default function ComingSoonPage() {
  const brandName = "PRIMATE";
  // Updated color to match your main UI's red accent
  const accentColor = "text-[#db2525]"; 
  const hoverColor = "hover:text-cyan-400"; // Contrasting hover for socials

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-black text-neutral-200 flex flex-col items-center justify-center p-6 font-chakra relative overflow-hidden">
      <AnimatedGrid />
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-0"></div>

      <main className="z-10 flex flex-col items-center text-center max-w-4xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          {/* Glitch Effect Title */}
          <motion.div variants={itemVariants} className="glitch-container font-russo text-6xl md:text-8xl font-bold uppercase tracking-wider mb-4">
            <h1 className="glitch" data-text="COMING SOON">COMING SOON</h1>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-neutral-300 mb-2 max-w-2xl"
          >
            SYSTEM ONLINE // AWAITING DEPLOYMENT
          </motion.p>
          <motion.p
            variants={itemVariants}
            className="text-base md:text-lg text-neutral-400 mb-10 max-w-xl"
          >
            We're forging something incredible. Get ready to unleash your inner beast. Our new platform for peak fitness and unparalleled gear is on its way.
          </motion.p>

          <motion.div variants={itemVariants} className="flex space-x-6">
            <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label={`${brandName} on Instagram`}
              className={`text-neutral-400 ${hoverColor} transition-colors duration-300`}>
              <Instagram size={28} />
            </Link>
            <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label={`${brandName} on Facebook`}
              className={`text-neutral-400 ${hoverColor} transition-colors duration-300`}>
              <Facebook size={28} />
            </Link>
            <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label={`${brandName} on Twitter/X`}
              className={`text-neutral-400 ${hoverColor} transition-colors duration-300`}>
              <Twitter size={28} />
            </Link>
          </motion.div>
        </motion.div>
      </main>

      <footer className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center z-10 font-chakra">
        <p className="text-neutral-600 text-xs tracking-widest uppercase">
          © {new Date().getFullYear()} {brandName} INDUSTRIES. ALL RIGHTS RESERVED.
        </p>
      </footer>

      {/* Global styles for background animation and glitch effect */}
      <style jsx global>{`
        @keyframes pan {
          0% { background-position: 0% 0%; }
          100% { background-position: 100% 0%; }
        }

        /* Pure CSS Glitch Effect */
        .glitch-container {
          position: relative;
        }
        .glitch {
          color: white;
          position: relative;
          display: inline-block;
        }
        .glitch::before,
        .glitch::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: black;
          overflow: hidden;
          clip: rect(0, 900px, 0, 0);
        }
        .glitch::before {
          left: 2px;
          text-shadow: -1px 0 #db2525;
          animation: glitch-anim-1 2s infinite linear alternate-reverse;
        }
        .glitch::after {
          left: -2px;
          text-shadow: -1px 0 #00FFFF, 1px 0 white;
          animation: glitch-anim-2 3s infinite linear alternate-reverse;
        }

        @keyframes glitch-anim-1 {
          0%, 100% { clip: rect(44px, 9999px, 49px, 0); }
          20% { clip: rect(3px, 9999px, 92px, 0); }
          40% { clip: rect(15px, 9999px, 80px, 0); }
          60% { clip: rect(50px, 9999px, 60px, 0); }
          80% { clip: rect(25px, 9999px, 5px, 0); }
        }

        @keyframes glitch-anim-2 {
          0%, 100% { clip: rect(65px, 9999px, 100px, 0); }
          20% { clip: rect(85px, 9999px, 25px, 0); }
          40% { clip: rect(10px, 9999px, 95px, 0); }
          60% { clip: rect(30px, 9999px, 5px, 0); }
          80% { clip: rect(70px, 9999px, 35px, 0); }
        }
      `}</style>
    </div>
  );
}