"use client";
import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import { ArrowRight } from "lucide-react"; // Using a different arrow for stylistic choice

// You can use Google Fonts or local fonts. For this example, let's assume you've set them up.
// In your global CSS or layout file:
// @import url('https://fonts.googleapis.com/css2?family=Russo+One&family=Chakra+Petch:wght@400;700&display=swap');
//
// tailwind.config.js
// theme: {
//   extend: {
//     fontFamily: {
//       russo: ['"Russo One"', 'sans-serif'],
//       chakra: ['"Chakra Petch"', 'sans-serif'],
//     },
//   },
// },

export const HeroParallax = ({
  products,
}: {
  products: {
    title: string;
    link: string;
    thumbnail: string;
  }[];
}) => {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-650, -200]),
    springConfig
  );

  return (
    <div
      ref={ref}
      className="h-[300vh] py-40 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d] bg-black"
    >
      {/* The header is now positioned absolutely to allow text on the left */}
      <Header />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className=""
      >
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20">
          {firstRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row mb-20 space-x-20 ">
          {secondRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20">
          {thirdRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Header = ({
  scrollRef,
}: {
  scrollRef: React.RefObject<HTMLDivElement>;
}) => {
  const textStrokeStyle = {
    WebkitTextStroke: "1px rgba(255, 255, 255, 0.8)",
    color: "transparent",
  };

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end start"],
  });

  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.2], [0, 1]), {
    stiffness: 150,
    damping: 20,
  });

  const translateY = useSpring(useTransform(scrollYProgress, [0, 0.2], [50, 0]), {
    stiffness: 200,
    damping: 30,
  });

  const scale = useSpring(useTransform(scrollYProgress, [0, 0.2], [0.95, 1]), {
    stiffness: 200,
    damping: 30,
  });

  return (
    <div className="absolute top-0 left-0 h-screen w-full flex items-center z-40 px-12 sm:px-24 md:px-32 lg:px-40 pointer-events-none">
      <div className="max-w-3xl">
        <div className="transform -skew-x-12">
          <motion.h1
            style={{ opacity, translateY, scale }}
            className="font-russo text-5xl md:text-7xl lg:text-8xl font-black leading-none tracking-tight"
          >
            <div style={textStrokeStyle}>THE FUTURE</div>
            <div className="text-[#db2525] mt-1">// OF FITNESS_</div>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="font-chakra mt-6 text-lg md:text-xl text-neutral-300 max-w-xl leading-relaxed tracking-wide backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10 shadow-md"
          >
            Designed for the relentless. Our performance gear merges{" "}
            <span className="text-[#db2525] font-bold">cutting-edge style</span>{" "}
            with{" "}
            <span className="text-cyan-600 font-bold">unmatched durability</span>{" "}
            — built to elevate your grind, from the gym floor to the streets.
          </motion.p>
        </div>
      </div>
    </div>
  );
}


export const ProductCard = ({
  product,
  translate,
}: {
  product: {
    title: string;
    link: string;
    thumbnail: string;
  };
  translate: MotionValue<number>;
}) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
      }}
      key={product.title}
      className="group/product h-96 w-[30rem] relative flex-shrink-0"
    >
      <a
        href={product.link}
        className="block group-hover/product:shadow-2xl "
      >
        <img
          src={product.thumbnail}
          height="600"
          width="600"
          className="object-cover object-left-top absolute h-full w-full inset-0"
          alt={product.title}
        />
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