"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCart } from "@/providers/CartProvider";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import gsap from "gsap";

type ProductCardProps = {
  product: {
    id: number;
    name: string;
    price: number;
    imageUrl?: string | null;
    additionalImages?: string | string[];
    quantity?: number;
    sizes?: string[];
    category?: { name: string };
  };
  className?: string;
};

export default function ProductCard({ product, className }: ProductCardProps) {
  const { addToCart } = useCart();
  const sizeOverlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sizeOverlay = sizeOverlayRef.current;
    const imageWrapper = sizeOverlay?.closest(".image-wrapper");
    if (!sizeOverlay || !imageWrapper) return;

    gsap.set(sizeOverlay, { opacity: 0, y: 30, display: "none" });

    const handleEnter = () => {
      gsap.killTweensOf(sizeOverlay);
      gsap.fromTo(
        sizeOverlay,
        { opacity: 0, y: 30, display: "flex" },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
      );
    };

    const handleLeave = () => {
      gsap.killTweensOf(sizeOverlay);
      gsap.to(sizeOverlay, {
        opacity: 0,
        y: 30,
        duration: 0.3,
        ease: "power3.in",
        onComplete: () => {
          gsap.set(sizeOverlay, { display: "none" });
        },
      });
    };

    imageWrapper?.addEventListener("mouseenter", handleEnter);
    imageWrapper?.addEventListener("mouseleave", handleLeave);

    return () => {
      imageWrapper?.removeEventListener("mouseenter", handleEnter);
      imageWrapper?.removeEventListener("mouseleave", handleLeave);
      gsap.killTweensOf(sizeOverlay);
    };
  }, []);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const getImagePath = (url: string | null | undefined) => {
    if (!url) return "/placeholder.png";
    return url.startsWith("http") ? url : `${url}`;
  };

  const additionalImages: string[] = (() => {
    if (Array.isArray(product.additionalImages)) return product.additionalImages;
    if (typeof product.additionalImages === "string") {
      try {
        const parsed = JSON.parse(product.additionalImages);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  })();

  const hoverImage = additionalImages[0] || product.imageUrl;

  return (
    <div
      className={cn(
        "group relative flex flex-col h-[550px] w-full overflow-hidden rounded-xl bg-[#1A1A1A] transition-all",
        className
      )}
    >
      <Link href={`/products/${product.id}`} className="flex-grow flex flex-col">
        <div className="relative w-full h-[75%] overflow-hidden image-wrapper rounded-t-xl">
          {/* Main Image */}
          <Image
            src={getImagePath(product.imageUrl)}
            alt={product.name}
            fill
            className="object-cover object-center transition-transform duration-500 ease-in-out group-hover:scale-125"
          />

          {/* Hover Image */}
          {hoverImage && (
            <Image
              src={getImagePath(hoverImage)}
              alt={`${product.name} Hover`}
              fill
              className="absolute inset-0 object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out group-hover:scale-125"
            />
          )}

          {/* Sizes Overlay - Bottom 25% */}
          {product.sizes && product.sizes.length > 0 && (
            <div
              ref={sizeOverlayRef}
              className="absolute bottom-0 left-0 right-0 h-[25%] z-30 flex items-center justify-center bg-black/70 backdrop-blur-md text-white"
              style={{ display: "none" }}
            >
              <div className="flex gap-2 flex-wrap justify-center w-full px-4">
                {product.sizes.map((size, i) => (
                  <span
                    key={i}
                    className="flex-1 text-xs text-center font-bold tracking-wide py-2 rounded-md border border-white hover:bg-white hover:text-black transition-all duration-150"
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="h-[25%] px-4 py-3 text-center flex flex-col justify-center">
          <h3 className="text-sm font-semibold text-white leading-tight line-clamp-2">{product.name.toUpperCase()}</h3>
          <p className="text-white/70 text-xs mt-1">₹{product.price.toFixed(0)}</p>
        </div>
      </Link>

      <Button
        onClick={handleAddToCart}
        className="absolute bottom-3 right-3 z-40 bg-red-600 text-white w-10 h-10 rounded-full p-0 flex items-center justify-center shadow-md transition-transform duration-200 hover:scale-110 hover:bg-red-700 focus:outline-none"
        aria-label={`Add ${product.name} to cart`}
      >
        <Plus size={20} />
      </Button>
    </div>
  );
}
