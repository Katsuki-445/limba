import { client } from "@/sanity/lib/client";
import CollectionsGrid from "@/components/CollectionsGrid";
import { Suspense } from "react";

async function getProducts() {
  return await client.fetch(`*[_type == "product"]{
    _id,
    name,
    price,
    "slug": slug.current,
    "imageUrl": image.asset->url,
    "lqip": image.asset->metadata.lqip,
    "categoryName": category->title
  }`, {}, { next: { revalidate: 60 } });
}

async function getCategories() {
  return await client.fetch(`*[_type == "category"]{
    _id,
    title
  }`, {}, { next: { revalidate: 60 } });
}

export default async function CollectionsPage() {
  const products = await getProducts();
  const categories = await getCategories();

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <Suspense fallback={<div>Loading collections...</div>}>
        <CollectionsGrid products={products} categories={categories} />
      </Suspense>
    </main>
  );
}