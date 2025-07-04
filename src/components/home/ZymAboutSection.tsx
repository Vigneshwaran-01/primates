'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ZymAboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;

    const heading1 = element.querySelector('.heading1');
    const heading2 = element.querySelectorAll('.heading2');
    const testimonial = element.querySelector('.testimonial');

    gsap.fromTo(
      heading1,
      { opacity: 0, y: 50, color: 'black' },
      {
        opacity: 1,
        y: 0,
        color: 'white',
        duration: 1.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 1,
        },
      }
    );

    heading2.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, x: -50, color: 'black' },
        {
          opacity: 1,
          x: 0,
          color: '#D30000',
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            end: 'bottom 30%',
            scrub: 1,
          },
        }
      );
    });

    gsap.fromTo(
      testimonial,
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 1.5,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: testimonial,
          start: 'top 70%',
          end: 'bottom 40%',
          scrub: 1,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-black text-white py-32 px-6 md:px-20 lg:px-40 text-center"
    >
      {/* Hero Text */}
      <div className="mb-20">
        <h2 className="heading1 text-4xl md:text-6xl font-extrabold tracking-tight leading-tight text-white mb-6">
          We make the most advanced activewear in India.
        </h2>
     
      </div>

      {/* Testimonial */}
      <div className="mb-24">
        <h3 className="testimonial text-xl md:text-2xl font-semibold italic text-gray-300">
          From our customers: <br />
          <span className="text-white font-bold">
            "The most comfortable activewear I've ever owned!"
          </span>{' '}
          – A Happy Athlete
        </h3>
      </div>

 

      {/* Subscription Form */}
      <div>
        <h3 className="heading2 text-3xl md:text-4xl font-extrabold text-white mb-6">
          Sign up and save
        </h3>
        <p className="heading2 text-gray-300 text-lg md:text-xl mb-8">
          Subscribe for exclusive offers, giveaways, and once-in-a-lifetime deals.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center max-w-xl mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="bg-gray-800 text-white py-4 px-6 w-full sm:w-auto sm:flex-1 rounded-md sm:rounded-l-md focus:outline-none focus:ring-2 focus:ring-red-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="mt-4 sm:mt-0 sm:ml-2 bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-md sm:rounded-r-md transition-all duration-300">
            Subscribe
          </button>
        </div>

        {/* Social Links */}
        <div className="mt-12 flex items-center justify-center space-x-8 text-sm md:text-base">
          <a href="#" className="text-gray-400 hover:text-white transition">
            Share on Facebook
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition">
            Tweet on Twitter
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition">
            Pin it on Pinterest
          </a>
        </div>
      </div>
    </section>
  );
}
