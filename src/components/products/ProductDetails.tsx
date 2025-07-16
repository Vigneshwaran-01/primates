'use client';

import { useState, useRef, useEffect, Fragment } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useCart } from '@/providers/CartProvider';
import { cn } from '@/lib/utils';
import { Tab, Dialog, Transition } from '@headlessui/react';
import { Heart, Check, Star } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';

// Define Review interface
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
  additionalImages?: string[];
  sizes?: string[];
  colors?: string[];
  specifications?: Record<string, string | number>;
  deliveryInfo: string;
  Reviews?: Review[];
  category?: { name: string };
}

interface ProductDetailsProps {
  product: Product;
}

const ratingStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  const stars = [];

  for (let i = 0; i < fullStars; i++) {
    stars.push(<Star key={`full_${i}`} fill="gold" className="h-5 w-5 text-gold-500" />);
  }

  if (hasHalfStar) {
    stars.push(<Star key="half" fill="gold" className="h-5 w-5 text-gold-500" />);
  }

  for (let i = 0; i < emptyStars; i++) {
    stars.push(<Star key={`empty_${i}`} className="h-5 w-5 text-gray-400" />);
  }

  return stars;
};

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
  const [reviews, setReviews] = useState<Review[]>(product.Reviews ?? []);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddToCartToast, setShowAddToCartToast] = useState(false);

  const productImages = [product.imageUrl, ...(product.additionalImages || [])].filter(Boolean) as string[];

  const sizeChartData = [
    { size: "XS", chest: "34-36", waist: "28-30", hip: "34-36" },
    { size: "S", chest: "36-38", waist: "30-32", hip: "36-38" },
    { size: "M", chest: "38-40", waist: "32-34", hip: "38-40" },
    { size: "L", chest: "40-42", waist: "34-36", hip: "40-42" },
    { size: "XL", chest: "42-44", waist: "36-38", hip: "40-42" },
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
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      setSelectedSize(product.sizes[0]);
    }
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      setSelectedColor(product.colors[0]);
    }
    if (product.imageUrl && !selectedImage) {
      setSelectedImage(product.imageUrl);
    }
  }, [product.sizes, product.colors, product.imageUrl, selectedSize, selectedColor, selectedImage]);

  // Calculate average rating
  const avgRating = reviews.length ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) : 0;

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`/api/products/${product.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: userRating, comment: userComment, productId: product.id }),
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
    <div className="bg-white text-gray-800 font-sans">
      {showAddToCartToast && (
        <div className="fixed top-6 right-6 z-50 bg-green-500 text-white px-4 py-2 rounded shadow-md">
          Added to cart! <Check className="inline-block w-4 h-4 ml-1" />
        </div>
      )}

      <div className="container mx-auto py-12 px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Thumbnail Gallery */}
            <div className="hidden lg:flex flex-col w-24 space-y-2">
              {productImages.map((img, i) => (
                <div
                  key={i}
                  className={cn(
                    `rounded-md overflow-hidden border border-gray-300 cursor-pointer transition-opacity duration-200`,
                    selectedImage === img ? 'opacity-100 border-blue-500' : 'opacity-70 hover:opacity-100'
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
            <div className="flex-grow">
              <div className="w-full h-0 pb-[100%] relative rounded-md overflow-hidden shadow-md">
                <Image
                  src={selectedImage || product.imageUrl || 'https://via.placeholder.com/500'}
                  alt={product.name}
                  className="absolute w-full h-full object-cover object-center"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Product Info & Actions */}
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-semibold text-gray-900">{product.name}</h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center text-yellow-500">
                {ratingStars(avgRating)}
              </div>
              <span className="text-sm text-gray-500">({reviews.length} ratings)</span>
            </div>
            <p className="text-2xl font-bold text-gray-700">₹{product.price.toFixed(0)}</p>

            {/* Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-700">Select Size</h3>
                <button
                  onClick={() => setIsSizeChartOpen(true)}
                  className="text-blue-500 text-sm cursor-pointer hover:underline"
                >
                  Size Chart
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.sizes?.map((size: string) => (
                  <button
                    key={size}
                    className={cn(
                      `rounded-md px-3 py-2 border text-sm transition-colors duration-200`,
                      selectedSize === size
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500 hover:text-blue-700'
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
              <h3 className="text-sm font-medium text-gray-700 mb-2">Select Color</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors?.map((color: string) => (
                  <button
                    key={color}
                    className={cn(
                      `rounded-full w-8 h-8 border-2 transition-colors duration-200`,
                      selectedColor === color ? 'ring-2 ring-blue-500' : 'border-gray-300 hover:ring-blue-500'
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
              <h3 className="text-sm font-medium text-gray-700 mb-2">Quantity</h3>
              <div className="flex items-center space-x-3">
                <button
                  className="rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 px-3 py-2 transition-colors duration-200"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <span className="text-lg font-medium text-gray-800">{quantity}</span>
                <button
                  className="rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 px-3 py-2 transition-colors duration-200"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Wishlist and Add to Bag */}
            <div className="flex gap-4 mt-4">
              <Button
                className="flex-1 flex items-center justify-center gap-2 border border-gray-300 text-gray-600 bg-white hover:bg-gray-100 transition-colors duration-200"
                onClick={() => setIsWishlisted(!isWishlisted)}
              >
                <Heart className={cn("h-5 w-5 transition-colors duration-200", isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400")} />
                Add to Wishlist
              </Button>
              <Button
                className="flex-1 bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
                onClick={onAddToCart}
                disabled={isAddToCartDisabled}
              >
                Add to Bag
              </Button>
            </div>

            <div className="space-y-3 mt-4">
              <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          </div>
        </div>

        {/* Additional Information Tabs */}
        <div className="mt-12 mb-20">
          <Tab.Group>
            <Tab.List className="flex border-b border-gray-200">
              {['Specifications', 'Delivery Information', `Reviews (${reviews.length})`].map((tab) => (
                <Tab
                  key={tab}
                  className={({ selected }) =>
                    cn(
                      'flex-1 text-center py-2 text-sm font-medium transition-colors duration-200 ease-in-out focus:outline-none',
                      selected
                        ? 'border-b-2 border-blue-500 text-blue-600'
                        : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    )
                  }
                >
                  {tab}
                </Tab>
              ))}
            </Tab.List>

            <Tab.Panels className="mt-6 p-4 bg-gray-50 rounded-md shadow-sm">
              <Tab.Panel>
                <ul className="list-disc pl-6 space-y-2 text-gray-600 text-sm">
                  {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                    <li key={key}><span className="font-medium text-gray-800">{key}:</span> {String(value)}</li>
                  ))}
                </ul>
              </Tab.Panel>

              <Tab.Panel>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {product.deliveryInfo}
                </p>
              </Tab.Panel>

              <Tab.Panel>
                <div className="mt-4">
                  <h2 className="text-lg font-semibold mb-4 text-gray-800">Customer Reviews</h2>
                  {avgRating ? (
                    <div className="flex items-center gap-2 mb-4 text-gray-800">
                      {ratingStars(avgRating)}
                      <span className="font-semibold">{avgRating.toFixed(1)} / 5</span>
                      <span className="text-gray-500">({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
                    </div>
                  ) : (
                    <p className="text-gray-500">No reviews yet.</p>
                  )}
                  {user ? (
                    <form onSubmit={handleReviewSubmit} className="mb-8 p-4 border border-gray-200 rounded-md bg-white">
                      <h3 className="text-md font-medium mb-2 text-gray-700">Leave a Review</h3>
                      <div className="flex items-center gap-2 mb-4">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            type="button"
                            key={star}
                            className={star <= userRating ? 'text-yellow-400 text-2xl' : 'text-gray-300 text-2xl hover:text-gray-500'}
                            onClick={() => setUserRating(star)}
                            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                          >★</button>
                        ))}
                      </div>
                      <textarea
                        className="w-full border border-gray-300 bg-white text-gray-700 rounded p-3 mb-3 focus:ring-blue-500 focus:border-blue-500"
                        rows={4}
                        value={userComment}
                        onChange={e => setUserComment(e.target.value)}
                        placeholder="Share your thoughts on this product..."
                        required={false}
                      />
                      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                      {success && <p className="text-green-500 text-sm mb-2">{success}</p>}
                      <Button type="submit" disabled={submitting || !userRating}
                        className="bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 py-2 px-4 rounded-md">
                        {submitting ? 'Submitting...' : 'Submit Review'}
                      </Button>
                    </form>
                  ) : (
                    <p className="text-gray-500 mb-4">Please log in to submit a review.</p>
                  )}
                  <div className="space-y-4">
                    {reviews.length === 0 && <p className="text-gray-500">No reviews yet. Be the first to share your experience!</p>}
                    {reviews.map((review, idx) => (
                      <div key={review.id || idx} className="pb-4 border-b border-gray-200 last:border-b-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-yellow-400 text-lg">{ratingStars(review.rating)}</span>
                          <span className="text-gray-800 font-medium">{review.user?.username || 'Anonymous'}</span>
                          {review.createdAt && (
                            <span className="text-gray-500 text-xs ml-auto">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        {review.comment && <p className="text-gray-600 mt-1 leading-relaxed">{review.comment}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>

        {/* Sticky Add to Bag Bar (Mobile) */}
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 py-3 px-4 sm:hidden z-40">
          <Button
            onClick={onAddToCart}
            className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
            disabled={isAddToCartDisabled}
          >
            Add to Bag - ₹{product.price.toFixed(0)}
          </Button>
        </div>
      </div>

      {/* Size Chart Modal */}
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
              <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-y-0 right-0 max-w-full flex">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <div className="w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="py-6 px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <h2 className="text-lg font-medium text-gray-900" id="slide-over-title">
                          SIZE CHART
                        </h2>
                        <div className="ml-3 h-7 flex items-center">
                          <button
                            type="button"
                            className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    <div className="border-b border-gray-200">
                      <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                          Measurements
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                          Find your perfect fit! All measurements are in inches.
                        </p>
                      </div>
                    </div>
                    <div className="mt-6 relative flex-1 px-4 sm:px-6">
                      {/* Size Chart Table */}
                      <div className="overflow-x-auto border border-gray-200 rounded-md">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50 text-gray-500">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Size</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Chest (in)</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Waist (in)</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Hip (in)</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {sizeChartData.map((item) => (
                              <tr key={item.size} className="hover:bg-gray-100 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.size}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.chest}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.waist}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.hip}</td>
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