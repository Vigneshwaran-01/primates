'use client';

import { useState, useRef, useEffect, Fragment } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useCart } from '@/providers/CartProvider';
import { cn } from '@/lib/utils';
import { Tab, Dialog, Transition } from '@headlessui/react';
import { Heart, Check } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';

// Importing gsap for potential future use or if any element requires it
// import { gsap } from 'gsap';

// Define Review interface - assuming this is from your backend data
interface Review {
  id: number;
  rating: number;
  comment?: string;
  user?: {
    username: string;
  };
  createdAt: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  additionalImages?: string[]; // Make it string[] and optional
  sizes?: string[]; // Make it optional
  colors?: string[]; // Make it optional
  specifications?: Record<string, string | number>; // More specific type for specs
  deliveryInfo: string;
  Reviews?: Review[];
  category?: { name: string };
}

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(product.imageUrl || null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const isAddToCartDisabled = !selectedSize || !selectedColor;
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>(product.Reviews ?? []); // Explicitly type reviews state
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddToCartToast, setShowAddToCartToast] = useState(false);

  // Filter out null/undefined images more robustly
  const productImages = [product.imageUrl, ...(product.additionalImages || [])].filter(Boolean) as string[];

  const sizeChartData = [
    { size: "XS", chest: "34-36", waist: "28-30", hip: "34-36" },
    { size: "S", chest: "36-38", waist: "30-32", hip: "36-38" },
    { size: "M", chest: "38-40", waist: "32-34", hip: "38-40" },
    { size: "L", chest: "40-42", waist: "34-36", hip: "40-42" },
    { size: "XL", chest: "42-44", waist: "36-38", hip: "42-44" },
    { size: "2XL", chest: "44-46", waist: "38-40", hip: "44-46" },
    { size: "3XL", chest: "46-48", waist: "40-42", hip: "46-48" },
  ];

  const onAddToCart = () => {
    if (isAddToCartDisabled) {
      alert('Please select both size and color before adding to bag.');
      return;
    }
    const cartProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      category: product.category ? { name: product.category.name } : undefined,
    };
    addToCart(cartProduct, quantity, selectedSize, selectedColor);
    setShowAddToCartToast(true);
    setTimeout(() => setShowAddToCartToast(false), 2000);
  };

  useEffect(() => {
    if (isSizeChartOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isSizeChartOpen]);

  useEffect(() => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) { // Only set if not already set
      setSelectedSize(product.sizes[0]);
    }
    if (product.colors && product.colors.length > 0 && !selectedColor) { // Only set if not already set
      setSelectedColor(product.colors[0]);
    }
    if (product.imageUrl && !selectedImage) { // Only set if not already set
      setSelectedImage(product.imageUrl);
    }
  }, [product.sizes, product.colors, product.imageUrl, selectedSize, selectedColor, selectedImage]);

  // Calculate average rating
  const avgRating = reviews.length ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : null;

  // Submit review handler
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      // Assuming 'api/reviews' endpoint expects product ID in the body or params
      const res = await fetch(`/api/products/${product.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: userRating, comment: userComment, productId: product.id }), // Include productId
      });
      if (res.ok) {
        const newReview = await res.json();
        setReviews([newReview, ...reviews]);
        setUserRating(0);
        setUserComment('');
        setSuccess('Review submitted!');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to submit review');
      }
    } catch (err) {
      console.error("Review submission error:", err);
      setError('Network error or server unavailable');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    // Apply global font and dark background
    <div className="bg-black text-white font-['Russo_One',_sans-serif]">
      {/* Global style for text stroke */}
      <style jsx global>{`
        .text-stroke-white {
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.8);
          color: transparent;
        }
        .shadow-red-glow {
          box-shadow: 0 0 15px #ff003c;
        }
        .shadow-red-glow-subtle {
          box-shadow: 0 0 8px rgba(255, 0, 60, 0.5);
        }
      `}</style>

      {/* Toast notification */}
      {showAddToCartToast && (
        <div className="fixed top-6 right-6 z-50 bg-green-600 text-white px-4 py-2 rounded shadow-lg transition-all duration-300 ease-out">
          Added to cart! <Check className="inline-block w-4 h-4 ml-1" />
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-12 px-6 md:px-12 lg:px-20">
        {/* LEFT: Product Images */}
        <div className="flex gap-4">
          {/* Thumbnail Gallery */}
          <div className="flex flex-col h-[500px] md:h-[600px] lg:h-[700px] space-y-1 justify-between">
            {productImages.map((img, i) => (
              <div
                key={i}
                className={cn(
                  `flex-1 min-h-0 rounded overflow-hidden border border-white/20 cursor-pointer transition-all duration-200`,
                  selectedImage === img ? 'ring-2 ring-red-500 shadow-red-glow-subtle' : 'hover:border-red-500'
                )}
                onClick={() => setSelectedImage(img)}
              >
                <Image
                  src={img}
                  alt={`Product Thumbnail ${i}`}
                  className="w-full h-full object-cover"
                  width={100}
                  height={100}
                />
              </div>
            ))}
          </div>

          {/* Main Image */}
          <div className="flex-grow h-[500px] md:h-[600px] lg:h-[700px]">
            <div className="w-full h-full rounded-lg overflow-hidden border border-white/20">
              <Image
                src={
                  selectedImage ||
                  product.imageUrl ||
                  'https://source.unsplash.com/random/500x600?techwear'
                }
                alt={product.name}
                className="w-full h-full object-cover object-center"
                width={700} // Increased width for better quality on large screens
                height={800} // Increased height for better quality on large screens
                priority
              />
            </div>
          </div>
        </div>

        {/* RIGHT: Product Info & Actions */}
        <div className="flex flex-col gap-6 p-4 md:p-0">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white uppercase text-stroke-white">
            {product.name}
          </h1>
          {/* Product Rating and Price */}
          <div className="flex items-center gap-2">
            <div className="flex items-center text-red-500">
              <span className="text-xl">★</span>
              <span className="text-lg">4.0</span>
            </div>
            <span className="text-sm text-white/70">Based on 121 ratings</span>
          </div>
          <p className="text-3xl font-medium text-red-500 shadow-red-glow">₹{product.price.toFixed(0)}</p>

          {/* Size Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-medium text-white">Select Size</h3>
              <button
                onClick={() => setIsSizeChartOpen(true)}
                className="text-red-500 text-sm cursor-pointer hover:underline"
              >
                Size Chart
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {product.sizes?.map((size: string) => (
                <button
                  key={size}
                  className={cn(
                    `rounded-md px-4 py-2 border text-sm transition-all duration-200`,
                    selectedSize === size
                      ? 'bg-red-600 text-white border-red-600 shadow-red-glow-subtle'
                      : 'bg-black/40 text-white/70 border-white/20 hover:border-red-500 hover:text-white'
                  )}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <h3 className="text-base font-medium text-white mb-2">Select Color</h3>
            <div className="flex flex-wrap gap-2">
              {product.colors?.map((color: string) => (
                <button
                  key={color}
                  className={cn(
                    `rounded-full w-8 h-8 border-2 transition-all duration-200`,
                    selectedColor === color ? 'ring-2 ring-red-500 shadow-red-glow-subtle' : 'border-white/20 hover:ring-red-500'
                  )}
                  onClick={() => setSelectedColor(color)}
                  style={{ backgroundColor: color }}
                  aria-label={`Color: ${color}`}
                />
              ))}
            </div>
          </div>

          {/* Quantity Selection */}
          <div>
            <h3 className="text-base font-medium text-white mb-2">Quantity</h3>
            <div className="flex items-center space-x-3">
              <button
                className="rounded-full bg-black/40 text-white/70 border border-white/20 hover:bg-black/60 px-4 py-2 transition-all duration-200"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <span className="text-lg font-medium text-white">{quantity}</span>
              <button
                className="rounded-full bg-black/40 text-white/70 border border-white/20 hover:bg-black/60 px-4 py-2 transition-all duration-200"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Wishlist and Add to Bag */}
          <div className="flex gap-4 mt-4">
            <Button
              // Tailwind's `group` utility with `group-hover:` on parent `div` would allow this
              // but for direct application, let's just make the button itself transform on hover.
              className="flex-1 flex items-center justify-center gap-2 border border-red-500 text-red-300 bg-black/40 hover:bg-red-800 hover:text-white shadow-red-glow-subtle transition-all duration-200"
              onClick={() => setIsWishlisted(!isWishlisted)}
            >
              <Heart className={cn("h-5 w-5 transition-all duration-200", isWishlisted ? "fill-red-500 text-red-500" : "text-white/70")} />
              Add to Wishlist
            </Button>
            <Button
              className="flex-1 bg-red-600 text-white hover:bg-red-700 shadow-red-glow transition-all duration-200"
              onClick={onAddToCart}
              disabled={isAddToCartDisabled}
            >
              Add to Bag
            </Button>
          </div>

          <div className="space-y-6 mt-4">
            <p className="text-base text-white/80 leading-relaxed">{product.description}</p>
          </div>
        </div>
      </div>

      {/* Additional Information Tabs */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 mt-12 mb-20">
        <Tab.Group>
          <Tab.List className="flex border-b border-white/20">
            {['Specifications', 'Delivery Information', `Reviews (${reviews.length})`].map((tab) => (
              <Tab
                key={tab}
                className={({ selected }) =>
                  cn(
                    'flex-1 text-center py-3 text-base font-medium transition-all duration-200 ease-in-out focus:outline-none',
                    selected
                      ? 'border-b-2 border-red-600 text-red-600' // Highlighted tab
                      : 'border-b-2 border-transparent text-white/70 hover:text-white hover:border-white/50' // Unselected tab
                  )
                }
              >
                {tab}
              </Tab>
            ))}
          </Tab.List>

          <Tab.Panels className="mt-6 p-4 bg-black/40 backdrop-blur-md rounded-lg border border-white/10">
            <Tab.Panel>
              <ul className="list-disc pl-6 space-y-2 text-white/80 text-sm">
                {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                  <li key={key}><span className="font-medium text-white">{key}:</span> {String(value)}</li>
                ))}
              </ul>
            </Tab.Panel>

            <Tab.Panel>
              <p className="text-white/80 text-sm leading-relaxed">
                {product.deliveryInfo}
              </p>
            </Tab.Panel>

            <Tab.Panel>
              <div className="mt-4">
                <h2 className="text-xl font-semibold mb-4 text-white">Customer Reviews</h2>
                {avgRating && (
                  <div className="flex items-center gap-2 mb-4 text-white">
                    <span className="text-yellow-400 text-xl">{'★'.repeat(Math.round(Number(avgRating)))}</span>
                    <span className="font-semibold">{avgRating} / 5</span>
                    <span className="text-white/70">({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
                  </div>
                )}
                {user ? (
                  <form onSubmit={handleReviewSubmit} className="mb-8 p-4 border border-white/10 rounded-md bg-black/50">
                    <h3 className="text-lg font-medium mb-2 text-white">Leave a Review</h3>
                    <div className="flex items-center gap-2 mb-4">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          type="button"
                          key={star}
                          className={star <= userRating ? 'text-yellow-400 text-3xl' : 'text-white/30 text-3xl hover:text-white/60'}
                          onClick={() => setUserRating(star)}
                          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                        >★</button>
                      ))}
                    </div>
                    <textarea
                      className="w-full border border-white/20 bg-black/20 text-white rounded p-3 mb-3 focus:ring-1 focus:ring-red-500 focus:border-red-500"
                      rows={4}
                      value={userComment}
                      onChange={e => setUserComment(e.target.value)}
                      placeholder="Share your thoughts on this product..."
                      required={false}
                    />
                    {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                    {success && <p className="text-green-500 text-sm mb-2">{success}</p>}
                    <Button type="submit" disabled={submitting || !userRating}
                            className="bg-red-600 text-white hover:bg-red-700 shadow-red-glow transition-all duration-200 py-2 px-6 rounded-md">
                      {submitting ? 'Submitting...' : 'Submit Review'}
                    </Button>
                  </form>
                ) : (
                  <p className="text-white/70 mb-4">Please log in to submit a review.</p>
                )}
                <div className="space-y-6">
                  {reviews.length === 0 && <p className="text-white/70">No reviews yet. Be the first to share your experience!</p>}
                  {reviews.map((review, idx) => (
                    <div key={review.id || idx} className="pb-4 border-b border-white/10 last:border-b-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-yellow-400 text-lg">{'★'.repeat(review.rating)}</span>
                        <span className="text-white font-medium">{review.user?.username || 'Anonymous'}</span>
                        {review.createdAt && (
                          <span className="text-white/50 text-xs ml-auto">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      {review.comment && <p className="text-white/80 mt-1 leading-relaxed">{review.comment}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>

      {/* Sticky Add to Bag Bar (Mobile) - adjusted styles */}
      <div className="fixed bottom-0 left-0 w-full bg-black/90 backdrop-blur-md border-t border-red-800 py-4 px-4 sm:hidden z-40">
        <Button
          onClick={onAddToCart}
          className="w-full bg-red-600 text-white hover:bg-red-700 shadow-red-glow transition-all duration-200"
          disabled={isAddToCartDisabled}
        >
          Add to Bag - ₹{product.price.toFixed(0)}
        </Button>
      </div>

      {/* Size Chart Modal (using Headless UI) - styled for cyberpunk theme */}
      <Transition.Root show={isSizeChartOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 overflow-hidden z-50" onClose={setIsSizeChartOpen}>
          <div className="absolute inset-0 overflow-hidden">
            <Transition.Child
              as={Fragment}
              enter="ease-in-out duration-500"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in-out duration-500"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-y-0 right-0 max-w-full flex"> {/* Changed to slide from right */}
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full" // Slide in from right
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full" // Slide out to right
              >
                <div className="w-screen max-w-md bg-black border-l border-red-800 shadow-lg">
                  <div className="flex h-full flex-col overflow-y-scroll bg-black text-white shadow-xl">
                    <div className="py-6 px-4 sm:px-6 border-b border-red-800">
                      <div className="flex items-start justify-between">
                        <h2 className="text-xl font-medium text-red-500 shadow-red-glow-subtle" id="slide-over-title">
                          SIZE CHART
                        </h2>
                        <div className="ml-3 h-7 flex items-center">
                          <button
                            type="button"
                            className="bg-black/60 rounded-full text-white/70 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500 p-1"
                            onClick={() => setIsSizeChartOpen(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="border-b border-red-800">
                      <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg font-medium leading-6 text-white">
                          Measurements
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-white/70">
                          Find your perfect fit! All measurements are in inches.
                        </p>
                      </div>
                    </div>
                    <div className="mt-6 relative flex-1 px-4 sm:px-6">
                      {/* Size Chart Table */}
                      <div className="overflow-x-auto border border-red-800 rounded-md">
                        <table className="min-w-full divide-y divide-red-800">
                          <thead className="bg-red-900/30 text-red-300">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Size</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Chest (in)</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Waist (in)</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Hip (in)</th>
                            </tr>
                          </thead>
                          <tbody className="bg-black/60 divide-y divide-red-900">
                            {sizeChartData.map((item) => (
                              <tr key={item.size} className="text-white/80 hover:bg-black/80 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{item.size}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{item.chest}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{item.waist}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{item.hip}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}