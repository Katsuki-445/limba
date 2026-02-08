import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import GlassCard from "@/components/GlassCard";
import Link from "next/link";
import Image from "next/image";
import sanityLoader from "@/lib/sanityLoader";
import { ArrowLeft, Search } from "lucide-react";

export const revalidate = 0;

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q: string }> }) {
  const resolvedParams = await searchParams;
  const q = resolvedParams.q || "";

  const productsQuery = `*[_type == "product" && name match $q + "*"]{
    _id,
    name,
    price,
    "slug": slug.current,
    "image": images[0],
    "categoryName": category->title
  }`;

  const products = await client.fetch(productsQuery, { q });

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <Link href="/collections" className="inline-flex items-center text-white/50 hover:text-white transition-colors mb-8">
        <ArrowLeft size={16} className="mr-2" />
        Back to Collections
      </Link>

      <div className="mb-12">
        <h1 className="font-serif text-4xl md:text-5xl mb-4">Search Results</h1>
        <p className="text-white/60 text-lg">
          {products.length === 0 
            ? `No results found for "${q}"`
            : `Showing ${products.length} result${products.length === 1 ? '' : 's'} for "${q}"`
          }
        </p>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product: any, index: number) => (
            <Link key={product._id} href={`/product/${product.slug}`} className="block h-full">
              <GlassCard
                className="group aspect-[3/4] flex flex-col relative overflow-hidden cursor-pointer h-full transition-transform hover:-translate-y-2"
              >
                {/* Category Tag */}
                <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
                  <span className="text-xs font-sans tracking-widest text-white/80 uppercase">{product.categoryName}</span>
                </div>

                <div className="absolute inset-0 flex items-center justify-center p-8 transition-transform duration-700 group-hover:scale-105">
                  {product.image && (
                    <Image
                      loader={sanityLoader}
                      src={urlFor(product.image).url()}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  )}
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                  <h3 className="font-serif text-2xl mb-1 text-white">{product.name}</h3>
                  <p className="font-sans text-yellow-400 font-medium">₵{product.price.toFixed(2)}</p>
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm">
            <Search size={48} className="text-white/20 mb-4" />
            <h3 className="text-2xl font-serif mb-2">No matches found</h3>
            <p className="text-white/50 max-w-md">
                We couldn't find any pieces matching "{q}". Try checking for typos or using broader terms.
            </p>
            <Link 
                href="/collections" 
                className="mt-8 inline-block bg-white text-black font-medium py-3 px-8 rounded-full hover:bg-white/90 transition-colors"
            >
                View All Collections
            </Link>
        </div>
      )}
    </main>
  );
}
