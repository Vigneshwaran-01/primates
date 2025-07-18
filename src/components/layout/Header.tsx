'use client';

import Link from 'next/link';
import { ShoppingCart, User, LogOut, Search, Menu, X, Heart, ChevronDown, Hexagon, MoreHorizontal, Command } from 'lucide-react';
import { useCart } from '@/providers/CartProvider';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { gsap } from 'gsap';
import {  Montserrat, Bebas_Neue, Inter } from 'next/font/google';
import localFont from 'next/font/local';
import { useSearchStore } from '../stores/useSearchStore';
import { useRouter } from 'next/navigation';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const bebas = Bebas_Neue({
    weight: '400',
    subsets: ['latin'],
    variable: '--font-bebas',
    display: 'swap',
});

const montserrat_nav_font = Montserrat({
    weight: ['500'],
    subsets: ['latin'],
    variable: '--font-montserrat-nav',
    display: 'swap',
});
interface Category {
    id: string;
    name: string;
}

const topCategories: Category[] = [
    { id: 'tshirt', name: 'Tshirt' },
    { id: 'biggie-t', name: 'Biggie-t' },
    { id: 'tank-tops', name: 'Tank-tops' },
];

const bottomCategories: Category[] = [
    { id: 'tracks', name: 'Tracks' },
    { id: 'shorts', name: 'Shorts' },
];

const mobileMenuCategories: Category[] = [
    ...topCategories,
    ...bottomCategories,
];

const bebasNeue = localFont({
  src: [
    {
      path: '../../fonts/BebasNeue-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-bebas-neue',
})

interface Suggestion {
    id: number;
    name: string;
}

export default function Header() {
    const { itemCount } = useCart();
    const { user, logout } = useAuth();
    const [allCategoriesForMobile, setAllCategoriesForMobile] = useState<Category[]>(mobileMenuCategories);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const wishlistCount = 2;
    const [isAuthReady, setIsAuthReady] = useState(false);
    const logoRef = useRef<HTMLDivElement>(null);
    const topDropdownRef = useRef(null);
    const bottomDropdownRef = useRef(null);
    const topIconRef = useRef(null);
    const bottomIconRef = useRef(null);

    const tlTop = useRef<gsap.core.Timeline | null>(null);
    const tlBottom = useRef<gsap.core.Timeline | null>(null);
    const { setQuery, query } = useSearchStore();
    const searchInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]); // State for suggestions


    useEffect(() => {
  const logoElement = logoRef.current;
  if (!logoElement) return;

  const handleMouseEnter = () => {
    gsap.to(logoElement, { scale: 1.05, duration: 0.3, ease: 'power1.out' });
  };

  const handleMouseLeave = () => {
    gsap.to(logoElement, { scale: 1,  duration: 0.3, ease: 'power1.out' });
  };

  logoElement.addEventListener('mouseenter', handleMouseEnter);
  logoElement.addEventListener('mouseleave', handleMouseLeave);

  return () => {
    logoElement.removeEventListener('mouseenter', handleMouseEnter);
    logoElement.removeEventListener('mouseleave', handleMouseLeave);
  };
}, []);


    useEffect(() => {
        // TOP DROPDOWN TIMELINE
        tlTop.current = gsap.timeline({ paused: true })
            .to(topDropdownRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.2,
                ease: 'power2.out',
                pointerEvents: 'auto',
            })
            .to(topIconRef.current, { rotate: 180, duration: 0.2, ease: 'power2.out' }, "<")
            .to(gsap.utils.toArray('.top-dropdown-item'), {
                opacity: 1,
                x: 0,
                duration: 0.2,
                stagger: 0.05,
                ease: 'power2.out',
            }, "-=0.1");

        // BOTTOM DROPDOWN TIMELINE
        tlBottom.current = gsap.timeline({ paused: true })
            .to(bottomDropdownRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.2,
                ease: 'power2.out',
                pointerEvents: 'auto',
            })
            .to(bottomIconRef.current, { rotate: 180, duration: 0.2, ease: 'power2.out' }, "<")
            .to(gsap.utils.toArray('.bottom-dropdown-item'), {
                opacity: 1,
                x: 0,
                duration: 0.2,
                stagger: 0.05,
                ease: 'power2.out',
            }, "-=0.1");

    }, []);

    const openDropdown = (key: 'top' | 'bottom') => {
        if (key === 'top' && tlTop.current) tlTop.current.play();
        if (key === 'bottom' && tlBottom.current) tlBottom.current.play();
    };

    const closeDropdown = (key: 'top' | 'bottom') => {
        if (key === 'top' && tlTop.current) tlTop.current.reverse();
        if (key === 'bottom' && tlBottom.current) tlBottom.current.reverse();
    };

    useEffect(() => {
        const logoElement = logoRef.current;
        if (logoElement) {
            const handleMouseEnter = () => gsap.to(logoElement, { scale: 1.05, duration: 0.3, ease: 'power1.out' });
            const handleMouseLeave = () => gsap.to(logoElement, { scale: 1, duration: 0.3, ease: 'power1.out' });
            logoElement.addEventListener('mouseenter', handleMouseEnter);
            logoElement.addEventListener('mouseleave', handleMouseLeave);
            return () => {
                logoElement.removeEventListener('mouseenter', handleMouseEnter);
                logoElement.removeEventListener('mouseleave', handleMouseLeave);
            };
        }
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    useEffect(() => {
        const checkAuth = async () => {
            setIsAuthReady(true);
        };
        checkAuth();
    }, []);

    const handleLogout = () => {
        logout();
        setIsProfileOpen(false);
        setIsMobileMenuOpen(false);
    };

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query) {
            router.push(`/products?search=${query}`);
        }
    };

      useEffect(() => {
        // Fetch suggestions from the API
        const fetchSuggestions = async () => {
            if (!query) {
                setSuggestions([]); // Clear suggestions if query is empty
                return;
            }

            try {
                const response = await fetch(`/api/suggestions?q=${query}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data: Suggestion[] = await response.json();
                setSuggestions(data);
            } catch (error) {
                console.error("Could not fetch suggestions:", error);
                setSuggestions([]); // Clear suggestions on error
            }
        };

        fetchSuggestions();
    }, [query]);
    
    const headerBgClass = isScrolled ? 'bg-black backdrop-blur-md ' : 'bg-black/80 backdrop-blur-md';
    const logoHoverTextColorClass = 'hover:text-[#db2525]';
    const navLinkBaseStyle = "px-3 py-2 rounded-md transition-all duration-200 ease-in-out inline-block text-sm relative";
    
    const getNavLinkClasses = (scrolled: boolean) => {
        const fontClass = "font-montserrat_nav";
        const underlineEffect = "after:block after:h-[2px] after:bg-[#db2525] after:scale-x-0 after:transition-transform after:duration-300 after:origin-left group-hover:after:scale-x-100";
        return `${navLinkBaseStyle} ${fontClass} ${underlineEffect} text-white hover:text-[#db2525]`;
    };
    
    const specialOffersLinkClasses = `relative inline-block px-4 py-2 rounded-md text-sm font-montserrat_nav font-medium transition-all duration-300 ease-in-out transform group bg-[#db2525] text-black shadow-lg hover:bg-red-400 hover:scale-105`;


    return (
        <>
            <style jsx global>{`.text-stroke-white{-webkit-text-stroke:1px rgba(255,255,255,0.6);color:transparent;}`}</style>

            <header className={`sticky top-0 z-50 transition-colors bg-black/100 backdrop-blur-md duration-300 ease-in-out  ${bebas.variable} ${montserrat_nav_font.variable} border-b border-white/5`}>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
                    {/* Logo with GSAP animation */}
                    <div ref={logoRef}>
                      <Link
                href="/"
                className={`${bebasNeue.variable} font-bebas-neue text-4xl lg:text-6xl text-white font-bebas font-bold transition-colors tracking-[0.1em] duration-300 ease-in-out italic  ${logoHoverTextColorClass}`}
                >
                PRIMATE
                </Link>
                    </div>

                       {/* Desktop Navigation */}
                    <nav className={`hidden md:flex items-center md:gap-1 lg:gap-2 font-montserrat_nav`}>
                        {/* "Top" Link with GSAP */}
                        <div
                            className="relative"
                            onMouseEnter={() => openDropdown('top')}
                            onMouseLeave={() => closeDropdown('top')}
                        >
                   <button className="group flex items-center gap-1 px-3 py-2 text-sm text-white hover:text-[#db2525] transition-all duration-300">
  Top
  <Command
    size={16}
    className="text-[#db2525] group-hover:scale-125 transition-transform duration-300"
  />
</button>
                            {/* 🔥 Cyberpunk Dropdown Menu */}
                            <div
                                ref={topDropdownRef}
                                className="absolute top-full mt-2  z-50 w-48 rounded-lg bg-[#0f0f0f]/90 backdrop-blur-md border border-white/10 p-2 opacity-0 pointer-events-none -translate-y-2"
                            >
                                {topCategories.map((cat) => (
                                    <Link
                                        href={`/category/top/${cat.id}`}
                                        key={cat.id}
                                        className="top-dropdown-item block px-4 py-2 text-sm text-white/80 tracking-wide hover:bg-[#db2525]/20 hover:text-[#db2525] transition-all duration-200 rounded-md opacity-0 -translate-x-2"
                                    >
                                        {cat.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* "Bottom" Link with GSAP */}
                        <div
                            className="relative"
                            onMouseEnter={() => openDropdown('bottom')}
                            onMouseLeave={() => closeDropdown('bottom')}
                        >
                                 <button className="group flex items-center gap-1 px-3 py-2 text-sm text-white hover:text-[#db2525] transition-all duration-300">
  Bottom
  <Command
    size={16}
    className="text-[#db2525] group-hover:scale-125 transition-transform duration-300"
  />
</button>
                            {/* 🔥 Cyberpunk Dropdown Menu */}
                            <div
                                ref={bottomDropdownRef}
                                className="absolute top-full mt-2 z-50 w-48 rounded-lg bg-[#0f0f0f]/90 backdrop-blur-md border border-white/10  p-2 opacity-0 pointer-events-none -translate-y-2"
                            >
                                {bottomCategories.map((cat) => (
                                    <Link
                                        href={`/category/bottom/${cat.id}`}
                                        key={cat.id}
                                        className="bottom-dropdown-item block px-4 py-2 text-sm text-white/80 tracking-wide hover:bg-[#db2525]/20 hover:text-[#db2525] transition-all duration-200 rounded-md opacity-0 -translate-x-2"
                                    >
                                        {cat.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* The rest of the nav remains the same */}

                    </nav>

                    {/* Icons and Auth Section */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Default Search Input */}
                        <div className="relative hidden md:block">
                          <form onSubmit={handleSubmit} className="relative flex items-center">
                            <Search className="absolute left-2 h-4 w-4 text-white/50" />
                            <input
                                type="text"
                                placeholder="What are you looking for..."
                                ref={searchInputRef}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="w-full pl-8 pr-3 py-1.5 text-white bg-transparent border border-white/20 rounded-md placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-[#db2525] text-sm"
                            />
                                                      {suggestions.length > 0 && (
                            <ul className="absolute left-0 top-full mt-1 w-full bg-black/90 border border-white/20 rounded-md shadow-md z-10">
                                {suggestions.map((suggestion) => (
                                    <li key={suggestion.id} className="px-3 py-2 text-white hover:bg-[#db2525]/20 cursor-pointer">
                                        <Link href={`/products/${suggestion.id}`}>
                                            {suggestion.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                          </form>
                        </div>
                        <div className="hidden md:block">
                            {user ? (
                                <div className="relative">
                                    <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="p-2 rounded-full text-white hover:bg-[#db2525]/20 hover:text-[#db2525] transition-colors duration-200" aria-label="User account">
                                        <User className="h-5 w-5" />
                                    </button>
                                    {isProfileOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-[#0a0a0a] rounded-md shadow-lg py-1 z-[60] border border-white/10 text-sm">
                                            <Link href="/account/dashboard" className="block px-4 py-2 text-white/80 hover:bg-[#db2525]/20 hover:text-[#db2525]" onClick={() => setIsProfileOpen(false)}>My Account</Link>
                                            <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-500/20 hover:text-red-400 flex items-center">
                                                <LogOut className="mr-2 h-4 w-4" />
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <Link href="/login">
                                        <Button variant="outline" size="sm" className="text-xs px-3 py-1.5 border-white/50 text-white/80 hover:border-[#db2525] hover:bg-[#db2525]/20 hover:text-[#db2525]">Login</Button>
                                    </Link>
                                    <Link href="/register">
                                        <Button size="sm" className="text-xs px-3 py-1.5 bg-[#db2525] text-white hover:bg-red-400">Register</Button>
                                    </Link>
                                </div>
                            )}
                        </div>

                        <Link href="/wishlist" className="relative p-2 rounded-full text-white hover:bg-[#db2525]/20 hover:text-[#db2525] transition-colors duration-200" aria-label="Wishlist">
                            <Heart className="h-5 w-5" />
                            {wishlistCount > 0 && (<span className="absolute -top-1 -right-1 text-[0.65rem] font-bold rounded-full h-4 w-4 flex items-center justify-center bg-[#db2525] text-black">{wishlistCount}</span>)}
                        </Link>

                        <Link href="/cart" className="relative p-2 rounded-full text-white hover:bg-[#db2525]/20 hover:text-[#db2525] transition-colors duration-200" aria-label="Shopping cart">
                            <ShoppingCart className="h-5 w-5" />
                            {itemCount > 0 && (<span className="absolute -top-1 -right-1 text-[0.65rem] font-bold rounded-full h-4 w-4 flex items-center justify-center bg-[#db2525] text-black">{itemCount}</span>)}
                        </Link>

                        <button onClick={toggleMobileMenu} className="md:hidden p-2 rounded-full text-white hover:bg-[#db2525]/20 hover:text-[#db2525] transition-colors duration-200" aria-label="Toggle menu">
                            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 right-0 bg-black/90 backdrop-blur-md z-40 border-t border-white/10 pb-4">
                       <nav className="flex flex-col gap-1 px-4 pt-4 text-white font-montserrat_nav">
                            <div className="mb-3">
                                <input type="search" placeholder="What are you looking for..." className="w-full p-3 border border-white/20 rounded-md text-white text-base bg-white/5 focus:ring-[#db2525] focus:border-[#db2525] placeholder:text-white/40" autoFocus />
                            </div>

                            <Link href="/products" className="block py-2.5 px-3 text-base hover:bg-[#db2525]/20 hover:text-[#db2525] rounded-md" onClick={toggleMobileMenu}>Shop All</Link>

                            <span className="px-3 py-2 text-white/40 text-xs font-semibold uppercase tracking-wider">Categories</span>
                            {allCategoriesForMobile.map((category) => (
                                <Link key={category.id} href={`/category/${category.id}`} className="block py-2.5 px-3 text-base hover:bg-[#db2525]/20 hover:text-[#db2525] rounded-md pl-6" onClick={toggleMobileMenu}>
                                    {category.name}
                                </Link>
                            ))}
                            
                            <hr className="my-3 border-white/10" />

                            <Link href="/special-offers" className="block py-2.5 px-3 text-base font-medium text-[#db2525] hover:bg-[#db2525]/20 rounded-md relative group" onClick={toggleMobileMenu}>
                                Special Offers
                            </Link>
                            <Link href="/blog" className="block py-2.5 px-3 text-base hover:bg-[#db2525]/20 hover:text-[#db2525] rounded-md" onClick={toggleMobileMenu}>Blog</Link>
                            <Link href="/about" className="block py-2.5 px-3 text-base hover:bg-[#db2525]/20 hover:text-[#db2525] rounded-md" onClick={toggleMobileMenu}>Our Story</Link>

                            <hr className="my-3 border-white/10" />

                            {user ? (
                                <>
                                    <Link href="/account/dashboard" className="block py-2.5 px-3 text-base hover:bg-[#db2525]/20 hover:text-[#db2525] rounded-md" onClick={toggleMobileMenu}>My Account</Link>
                                    <button onClick={handleLogout} className="block py-2.5 px-3 text-base text-red-500 hover:bg-red-500/20 text-left w-full rounded-md">
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login" className="block py-2.5 px-3 text-base hover:bg-[#db2525]/20 hover:text-[#db2525] rounded-md" onClick={toggleMobileMenu}>Login</Link>
                                    <Link href="/register" className="block py-2.5 px-3 text-base hover:bg-[#db2525]/20 hover:text-[#db2525] rounded-md" onClick={toggleMobileMenu}>Register</Link>
                                </>
                            )}
                        </nav>
                    </div>
                )}
            </header>
        </>
    );
}