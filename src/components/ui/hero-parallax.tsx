"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
  useAnimation,
  useInView,
  animate,
  useMotionValue,
} from "framer-motion";
import { FaArrowRight } from "react-icons/fa";

// Main component is unchanged
type Product = {
  title: string;
  link: string;
  thumbnail: string;
};

interface HeroParallaxProps {
  products: Product[];
}

export const HeroParallax = ({ products }: HeroParallaxProps) => {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1000]), springConfig);
  const translateXReverse = useSpring(useTransform(scrollYProgress, [0, 1], [0, -1000]), springConfig);
  const rotateX = useSpring(useTransform(scrollYProgress, [0, 0.2], [15, 0]), springConfig);
  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.2], [0.2, 1]), springConfig);
  const rotateZ = useSpring(useTransform(scrollYProgress, [0, 0.2], [20, 0]), springConfig);

  // --- CHANGE #2: Adjust the final vertical position ---
  // The grid now ends at -150px instead of +50px, pulling it up significantly.
  const translateY = useSpring(useTransform(scrollYProgress, [0, 0.2], [-500, -150]), springConfig);

  return (
    <div
      ref={ref}
      // --- CHANGE #1: Reduce the container height ---
      // Changed from h-[280vh] to h-[200vh]. This is the main fix.
      // It shortens the scrollable area, reducing the empty space at the end.
      className="h-[100vh]  overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d] bg-black"
    >
      <Header />
      <motion.div style={{ rotateX, rotateZ, translateY, opacity }}>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20">
          {firstRow.map((product) => (
            <ProductCard product={product} translate={translateX} key={product.title} />
          ))}
        </motion.div>
        <motion.div className="flex flex-row mb-20 space-x-20">
          {secondRow.map((product) => (
            <ProductCard product={product} translate={translateXReverse} key={product.title} />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20">
          {thirdRow.map((product) => (
            <ProductCard product={product} translate={translateX} key={product.title} />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};


interface ScrambleTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  trigger: boolean;
}

const ScrambleText = ({ text, className, style, trigger }: ScrambleTextProps) => {
  // ... (ScrambleText component is unchanged)
  const [displayText, setDisplayText] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scramble = () => {
    let iteration = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((_letter, index) => {
            if (index < iteration) return text[index];
            return String.fromCharCode(33 + Math.random() * 94);
          })
          .join("")
      );
      if (iteration >= text.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
      iteration += 1 / 3;
    }, 40);
  };

  useEffect(() => {
    if (trigger) {
      scramble();
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setDisplayText("");
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [trigger, text]);

  return <div className={className} style={style}>{displayText}</div>;
};

// NEW COMPONENT: Typewriter effect for the info box text
interface TypewriterTextProps {
  text: string;
  trigger: boolean;
}

const TypewriterText = ({ text, trigger }: TypewriterTextProps) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const displayText = useTransform(rounded, (latest) => text.slice(0, latest));
  const [renderedText, setRenderedText] = useState("");

  useEffect(() => {
    const unsubscribe = displayText.on("change", (v) => setRenderedText(v));
    return () => unsubscribe();
  }, [displayText]);

  useEffect(() => {
    let controls;
    if (trigger) {
      // Animate the count from 0 to text.length
      controls = animate(count, text.length, {
        type: "tween",
        duration: 2,
        ease: "easeInOut",
      });
    } else {
        // Reset the count to 0 when not in view
        count.set(0);
    }

    return controls?.stop;
  }, [trigger, text, count]);

  return <p>{renderedText}</p>;
};

// NEW COMPONENT: The redesigned info box panel
const InfoBox = ({ trigger }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const cornerVariants = {
    hidden: { opacity: 0, pathLength: 0 },
    visible: { opacity: 1, pathLength: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const text = "Designed for the relentless. Our performance gear merges cutting-edge style with unmatched durability — built to elevate your grind, from the gym floor to the streets.";

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate={trigger ? "visible" : "hidden"}
      className="absolute top-1/2 right-0 transform -translate-y-1/2 w-full max-w-sm md:max-w-md lg:max-w-lg pr-4 sm:pr-8 md:pr-12 lg:pr-20 pointer-events-auto"
    >
      <div className="relative p-6 backdrop-blur-md bg-cyan-900/10 rounded-lg border border-cyan-400/20">
        {/* Corner Brackets */}
        <motion.svg className="absolute inset-0 w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <motion.path variants={cornerVariants} d="M 10 1 L 1 1 L 1 10" stroke="#06b6d4" strokeWidth="2" />
            <motion.path variants={cornerVariants} d="M calc(100% - 10) 1 L calc(100% - 1) 1 L calc(100% - 1) 10" stroke="#06b6d4" strokeWidth="2" />
            <motion.path variants={cornerVariants} d="M 10 calc(100% - 1) L 1 calc(100% - 1) L 1 calc(100% - 10)" stroke="#06b6d4" strokeWidth="2" />
            <motion.path variants={cornerVariants} d="M calc(100% - 10) calc(100% - 1) L calc(100% - 1) calc(100% - 1) L calc(100% - 1) calc(100% - 10)" stroke="#06b6d4" strokeWidth="2" />
        </motion.svg>
        
        <div className="font-mono text-sm md:text-base text-neutral-300 leading-relaxed tracking-wide">
          <TypewriterText text={text} trigger={trigger} />
           {/* Blinking Cursor */}
           <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="inline-block w-2 h-4 bg-cyan-400 ml-1"
          />
        </div>
      </div>
    </motion.div>
  );
};


export const Header = () => {
  const textStrokeStyle = {
    WebkitTextStroke: "1px rgba(255, 255, 255, 0.8)",
    color: "transparent",
  };
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, amount: 0.4 });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [inView, controls]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <div
      ref={ref}
      className="absolute top-0 left-0 h-screen w-full flex items-center z-40 px-4 sm:px-8 md:px-12 lg:px-20"
    >
      {/* Main Heading on the left */}
      <motion.div
        className="max-w-3xl pointer-events-none"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        <div className="transform -skew-x-12">
          <motion.h1
            variants={itemVariants}
            className="font-russo text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black leading-none tracking-tight"
          >
            <ScrambleText text="THE FUTURE" className="" style={textStrokeStyle} trigger={inView} />
            <ScrambleText text="// OF FITNESS_" className="text-[#db2525] mt-2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl" style={{}} trigger={inView} />
          </motion.h1>
        </div>
      </motion.div>

      {/* NEW: InfoBox on the right */}
      <InfoBox trigger={inView} />
    </div>
  );
};

// ProductCard component is unchanged.
export const ProductCard = ({ product, translate }) => {
  // ... (rest of the ProductCard component is unchanged)
  return (
    <motion.div style={{ x: translate }} whileHover={{ y: -20 }} key={product.title} className="group/product h-96 w-[30rem] relative flex-shrink-0">
      <a href={product.link} className="block group-hover/product:shadow-2xl">
        <img src={product.thumbnail} height="600" width="600" className="object-cover object-left-top absolute h-full w-full inset-0" alt={product.title} />
      </a>
      <div className="absolute inset-0 h-full w-full opacity-0 bg-black pointer-events-none group-hover/product:opacity-60 transition-opacity duration-300"></div>
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-100">
        <div className="absolute inset-0.5 border-2 border-transparent group-hover:border-cyan-400 transition-all duration-300"></div>
        <div className="p-4 h-full flex flex-col justify-end">
          <h2 className="text-white text-2xl font-bold opacity-0 translate-y-4 group-hover/product:opacity-100 group-hover/product:translate-y-0 transition-all duration-300">
            {product.title}
          </h2>
          <div className="flex items-center justify-between mt-2 opacity-0 translate-y-4 group-hover/product:opacity-100 group-hover/product:translate-y-0 transition-all duration-500">
            <p className="text-cyan-400 text-sm">VIEW PRODUCT</p>
            <FaArrowRight className="text-cyan-400" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};