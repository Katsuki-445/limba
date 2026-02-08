import { client } from "@/sanity/lib/client";
import Image from "next/image";
import GlassCard from "@/components/GlassCard";
import { notFound } from "next/navigation";
import ProductActions from "@/components/ProductActions";
import sanityLoader from "@/lib/sanityLoader";
import { Metadata } from "next";
import Link from "next/link";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string) {
  return await client.fetch(`*[_type == "product" && slug.current == $slug][0]{
    _id,
    name,
    price,
    description,
    "slug": slug.current,
    "imageUrl": image.asset->url,
    "lqip": image.asset->metadata.lqip,
    "categoryName": category->title
  }`, { slug }, { next: { revalidate: 60 } });
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: "Product Not Found | LIMBA",
    };
  }

  return {
    title: `${product.name} | LIMBA`,
    description: product.description || `Discover ${product.name} at LIMBA.`,
    openGraph: {
      images: product.imageUrl ? [product.imageUrl] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto flex items-center justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full">
        {/* Image Section */}
        <GlassCard className="relative aspect-square md:aspect-[3/4] flex items-center justify-center p-8 overflow-hidden">
             {product.imageUrl && (
                <Image
                  loader={sanityLoader}
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-contain drop-shadow-2xl p-8"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  placeholder={product.lqip ? "blur" : "empty"}
                  blurDataURL={product.lqip}
                />
              )}
        </GlassCard>

        {/* Details Section */}
        <div className="flex flex-col justify-center space-y-8">
            <div>
                {product.categoryName && (
                    <Link 
                        href={`/collections?category=${encodeURIComponent(product.categoryName)}`}
                        className="text-yellow-400 text-sm tracking-widest uppercase font-medium mb-2 inline-block hover:underline"
                    >
                        {product.categoryName}
                    </Link>
                )}
                <h1 className="font-serif text-5xl md:text-6xl mb-4">{product.name}</h1>
                <p className="font-serif text-3xl text-white/80">₵{product.price}</p>
            </div>

            <div className="text-white/70 leading-relaxed font-light text-lg">
                {product.description || "No description available for this masterpiece."}
            </div>

            <ProductActions product={product} />
            
            <div className="pt-8 border-t border-white/10 text-xs text-white/40 space-y-2 font-sans uppercase tracking-widest">
                <p>Authentic Ghanaian Heritage</p>
                <p>Handcrafted Excellence</p>
                <p>Worldwide Shipping Available</p>
            </div>
        </div>
      </div>
    </main>
  );
}
