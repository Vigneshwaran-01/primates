import prisma from '@/lib/db';
import ProductFilters from '@/components/products/ProductFilters';
import ProductCard from '@/components/products/ProductCard';

export default async function ProductsPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;

  const safeParams = {
    category: typeof searchParams.category === 'string' 
      ? searchParams.category 
      : undefined,
    minPrice: typeof searchParams.minPrice === 'string' 
      ? Number(searchParams.minPrice) 
      : undefined,
    maxPrice: typeof searchParams.maxPrice === 'string' 
      ? Number(searchParams.maxPrice) 
      : undefined,
    sort: typeof searchParams.sort === 'string' 
      ? searchParams.sort 
      : undefined,
  };

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: {
        categoryId: safeParams.category && safeParams.category !== 'all' 
          ? Number(safeParams.category) 
          : undefined,
        price: {
          gte: safeParams.minPrice,
          lte: safeParams.maxPrice,
        },
      },
      orderBy: {
        price: safeParams.sort === 'price-asc' 
          ? 'asc' 
          : safeParams.sort === 'price-desc' 
          ? 'desc' 
          : undefined,
      },
      include: {
        category: true,
        Reviews: {
          where: { isApproved: true },
          select: { rating: true },
        },
      },
    }),
    prisma.category.findMany(),
  ]);

  return (
    <div className="  backdrop-blur-sm bg-white/10 min-h-screen py-10">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        
        {/* Page Title */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-800 uppercase font-bebas">
            Explore Our Collection
          </h1>
          <p className="text-gray-500 text-base mt-2">
            Discover premium styles curated just for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Sidebar Filters */}
          <aside className="md:col-span-1 sticky top-28 self-start bg-white p-6 rounded-3xl shadow-md border border-gray-200">
            <h2 className="text-lg font-semibold mb-6 text-gray-800 tracking-wide">
              Filter by
            </h2>
            <ProductFilters categories={categories} />
          </aside>

          {/* Product Grid */}
          <section className="md:col-span-3">
            {products.length === 0 ? (
              <div className="text-center py-24 text-gray-500 text-lg">
                No products found. Try adjusting your filters.
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}