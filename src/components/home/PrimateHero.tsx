'use client';

import { useState, useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform
} from 'framer-motion';

// A simple typewriter component for the tagline - unchanged
const TypewriterText = ({ text }) => {
    const textToShow = text.split("").map((char, index) => (
        <motion.span
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.05, delay: index * 0.05 }}
        >
            {char}
        </motion.span>
    ));
    return <div>{textToShow}</div>;
}

// NEW COMPONENT: A letter that performs the kinetic animation based on scroll
const KineticScrollLetter = ({ children, scrollYProgress, index }) => {
  // Define the input range for the animation.
  // It starts when the section enters and finishes by the time it's 40% scrolled through.
  // The 'index * 0.03' staggers each letter's animation start time.
  const start = index * 0.03;
  const end = 0.4 + index * 0.03;

  // Map scroll progress to each property
  const y = useTransform(scrollYProgress, [start, end], ['100%', '0%']);
  const rotateX = useTransform(scrollYProgress, [start, end], [90, 0]);
  const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);

  return (
    // This span applies the scroll-driven transformations
    <motion.span
      style={{ y, rotateX, opacity, transformStyle: 'preserve-3d' }}
      className="inline-block"
    >
      {children}
    </motion.span>
  );
};


export default function PrimateKineticMaskHero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const letters = "PRIMATE".split('');

  // --- INTERACTION STATE --- (Unchanged)
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: -999, y: -999 });

  // --- SCROLL ANIMATION HOOKS ---
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end center"] // Trigger animation as it enters the screen
  });

  // --- MOUSE HANDLERS --- (Unchanged)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (sectionRef.current) {
      const rect = sectionRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePos({ x, y });
    }
  };

  // --- MASK & HOVER STYLES --- (Unchanged)
  const maskStyle = {
    maskImage: `radial-gradient(circle 300px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`,
    WebkitMaskImage: `radial-gradient(circle 300px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`,
    transition: 'mask-image 0.1s ease-out',
  };
  
  const wireframeVariants = {
    idle: { WebkitTextStroke: '2px rgba(255, 255, 255, 0.15)', transition: { duration: 0.4 } },
    hover: { WebkitTextStroke: '2px #db2525', transition: { duration: 0.2 } }
  };

  // --- HUD ENTRANCE ANIMATION VARIANTS --- (Unchanged)
  const hudContainerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delayChildren: 0.8, staggerChildren: 0.3 } },
  };
  const hudItemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: -999, y: -999 });
      }}
      className="relative bg-black min-h-[80vh] px-4 sm:px-8 md:px-12 py-4 flex flex-col items-center justify-start pt-[10vh] overflow-hidden"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1517057011472-6f92b7c44961?auto=format&fit=crop&w=2000&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        perspective: '1000px' // Crucial for the 3D rotation effect
      }}
    >
      <div className="absolute inset-0 bg-black/80"></div>

      {/* Main container for the text. No longer needs its own motion component. */}
      <div className="relative z-10 flex items-center justify-center">
        
        {/* Layer 1: The Wireframe Text */}
        <motion.h1
          variants={wireframeVariants}
          animate={isHovered ? "hover" : "idle"}
          className="text-[14vw] md:text-[15vw] lg:text-[16vw] font-extrabold tracking-tighter leading-none"
          style={{ color: 'transparent' }}
        >
          {letters.map((letter, index) => (
            <KineticScrollLetter key={index} index={index} scrollYProgress={scrollYProgress}>
                {letter}
            </KineticScrollLetter>
          ))}
        </motion.h1>
        
        {/* Layer 2: The Masked Video Text */}
        <h1
          className="absolute top-0 left-0 w-full h-full text-[14vw] md:text-[15vw] lg:text-[16vw] font-extrabold tracking-tighter leading-none pointer-events-none"
          style={{ ...maskStyle, color: 'white' }}
        >
           {letters.map((letter, index) => (
            <KineticScrollLetter key={index} index={index} scrollYProgress={scrollYProgress}>
                {letter}
            </KineticScrollLetter>
          ))}
          <video
            src="https://videos.pexels.com/video-files/5319934/5319934-uhd_2560_1440_25fps.mp4"
            className="absolute top-0 left-0 w-full h-full object-cover -z-10"
            autoPlay
            loop
            muted
            playsInline
          ></video>
        </h1>
      </div>
      
      {/* HUD Elements Container (starts hidden, animates in) */}
      <motion.div
        className="absolute inset-0 z-20 pointer-events-none"
        variants={hudContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div variants={hudItemVariants} className="absolute top-8 left-8 font-mono text-sm text-neutral-400 flex items-center space-x-2">
            <motion.div 
                className="w-2 h-2 bg-green-400 rounded-full"
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span>// STATUS: ONLINE</span>
        </motion.div>
        <motion.div variants={hudItemVariants} className="absolute bottom-8 left-8 font-mono text-sm text-neutral-300 max-w-xs">
            <TypewriterText text="Engineered for the apex predator of the urban jungle. Unmatched performance. Uncompromising style." />
        </motion.div>
        <motion.div variants={hudItemVariants} className="absolute bottom-8 right-8">
            <a href="#collection" className="group font-mono text-base text-white border-2 border-white/50 px-6 py-3 rounded-md transition-all duration-300 hover:bg-white hover:text-black pointer-events-auto">
                <span className="group-hover:tracking-widest transition-all duration-300">[ EXPLORE THE COLLECTION ]</span>
            </a>
        </motion.div>
      </motion.div>
    </section>
  );
}