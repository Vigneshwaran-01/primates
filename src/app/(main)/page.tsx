import ProductCard from '@/components/products/ProductCard';
import prisma from '@/lib/db';

// import { HoverBorderGradientDemo } from '@/components/hover-button';
import { Bebas_Neue } from 'next/font/google';
import AnimatedNewArrivals from '@/components/home/AnimatedNewArrivals';
// import { TypewriterEffect } from '@/components/ui/text-hover';
import CyberCarousel from '@/components/home/CyberCarousel';
import SpecialOfferBanner from '@/components/home/SpecialOfferBanner';
import HeroVideoSection from '@/components/home/HeroVideoSection';
import PrimateHero from '@/components/home/PrimateHero';
import ZymAboutSection from '@/components/home/ZymAboutSection';
import CardRow from '@/components/home/SmartCard';
import { HeroParallaxDemo } from '@/components/home/HeroParallaxDemo';

const bebas = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
});

export interface CategoryForPage {
  id: number;
  name: string;
}

export interface ProductForPage {
  id: number;
  name: string;
  price: number;
  description?: string | null;
  quantity?: number;
  imageUrl?: string | null;
  category?: CategoryForPage;
  Reviews: { rating: number }[];
  isFeatured?: boolean;
  sizes?: string[];               // ✅ New
  colors?: string[];              // ✅ New
  specifications?: object;        // ✅ New
  deliveryInfo?: string | null;   // ✅ New
}


const getGymImageUrl = (productName: string, index: number): string => {
  const keywords = productName.toLowerCase().split(' ').join(',');
  let query = "gym,fitness";
  if (keywords.includes('protein') || keywords.includes('powder')) query = "protein,supplement";
  else if (keywords.includes('dumbbell') || keywords.includes('weight')) query = "dumbbell,weights";
  else if (keywords.includes('leggings') || keywords.includes('tank') || keywords.includes('apparel')) query = "gym,apparel";
  else if (keywords.includes('band') || keywords.includes('resistance')) query = "resistance,band";
  else if (keywords.includes('bottle') || keywords.includes('shaker')) query = "shaker,bottle";
  return `https://source.unsplash.com/400x400/?${query},${keywords}&sig=${index}`;
};

async function getNewArrivalProducts(): Promise<ProductForPage[]> {
const productsFromDb = await prisma.product.findMany({
  orderBy: {
    createdAt: 'desc',
  },
  include: {
    category: true, // ✅ this is a relation field
    Reviews: {
      where: { isApproved: true },
      select: { rating: true },
    },
  },
});



interface ProductFromDb {
  id: number;
  name: string;
  price: number;
  description?: string | null;
  quantity?: number;
  imageUrl?: string | null;
  category?: CategoryForPage | null;
  Reviews: { rating: number }[];
  isFeatured?: boolean;
  sizes?: string[] | null;
  colors?: string[] | null;
  specifications?: object;
  deliveryInfo?: string | null;
}

return productsFromDb.map((product: ProductFromDb, index: number): ProductForPage => ({
  id: product.id,
  name: product.name,
  price: product.price,
  description: product.description,
  quantity: 1,
  imageUrl: product.imageUrl || getGymImageUrl(product.name, index),
  category: product.category
    ? {
        id: product.category.id,
        name: product.category.name
      }
    : undefined,
  Reviews: product.Reviews || [],
  isFeatured: product.isFeatured,

sizes: product.sizes && Array.isArray(product.sizes) ? product.sizes.filter(Boolean) : [],
colors: product.colors && Array.isArray(product.colors) ? product.colors.filter(Boolean) : [],

  specifications: product.specifications || {},
  deliveryInfo: product.deliveryInfo || null,
}));

}

export default async function HomePage() {
  const newArrivalProducts = await getNewArrivalProducts();

 

  return (
    <>
    <HeroVideoSection />
     <SpecialOfferBanner />
      <CyberCarousel />
      <AnimatedNewArrivals
        products={newArrivalProducts.map(product => ({
          ...product,
          category: product.category?.name
        }))}
      />
      <HeroParallaxDemo />

       <ZymAboutSection />

 <PrimateHero />
 <CardRow />

     
      
    </>
  );
}