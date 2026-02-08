import Hero from "@/components/Hero";
import ProductRunway from "@/components/ProductRunway";
import AtelierVideo from "@/components/AtelierVideo";
import CuratedEdit from "@/components/CuratedEdit";
import InnerCircle from "@/components/InnerCircle";
import Image from "next/image";
import { client } from "@/sanity/lib/client";

async function getRunwayProducts() {
  try {
    return await client.fetch(`*[_type == "product" && isFeatured == true] | order(_createdAt asc) {
      _id,
      name,
      price,
      "slug": slug.current,
      "imageUrl": image.asset->url,
      "lqip": image.asset->metadata.lqip
    }`, {}, { next: { revalidate: 0 } });
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

async function getCategories() {
  try {
    return await client.fetch(`*[_type == "category"] | order(title asc) {
      _id,
      title,
      "slug": slug.current,
      description,
      "imageUrl": image.asset->url
    }`, {}, { next: { revalidate: 0 } });
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

export default async function Home() {
  const runwayProducts = await getRunwayProducts();
  const categories = await getCategories();

  return (
    <main className="relative min-h-screen w-full text-white selection:bg-white/20">
      <div className="relative z-10">
        <Hero />
        <ProductRunway products={runwayProducts} />
        <AtelierVideo />
        <CuratedEdit categories={categories} />
        <InnerCircle />
      </div>
    </main>
  );
}
