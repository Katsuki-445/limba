import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import sanityLoader from "@/lib/sanityLoader";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Calendar, User } from "lucide-react";

async function getPosts() {
  try {
    return await client.fetch(`*[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      publishedAt,
      "image": mainImage,
      excerpt,
      "authorName": author->name
    }`, {}, { next: { revalidate: 60 } });
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return [];
  }
}

// Fallback/Placeholder posts if none exist in Sanity yet
const placeholderPosts = [
  {
    _id: "placeholder-1",
    title: "Weaving the Future: The Evolution of Smock Artistry",
    slug: { current: "weaving-future" },
    publishedAt: new Date().toISOString(),
    excerpt: "Exploring how traditional techniques are being reimagined for the modern wardrobe while preserving their ancestral significance.",
    authorName: "Limba Editorial",
    imageUrl: "/smock.png" 
  },
  {
    _id: "placeholder-2",
    title: "The Meaning Behind the Patterns",
    slug: { current: "meaning-behind-patterns" },
    publishedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    excerpt: "A deep dive into the cultural stories and proverbs woven into every thread of our heritage textiles.",
    authorName: "Limba Editorial",
    imageUrl: "/beads.png"
  },
    {
    _id: "placeholder-3",
    title: "Sustainable Fashion in West Africa",
    slug: { current: "sustainable-fashion" },
    publishedAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    excerpt: "How local sourcing and artisanal production methods are setting new standards for eco-conscious luxury.",
    authorName: "Limba Editorial",
    imageUrl: "/sandals.png"
  }
];

export default async function BlogPage() {
  const sanityPosts = await getPosts();
  const posts = sanityPosts.length > 0 ? sanityPosts : placeholderPosts;

  return (
    <main className="min-h-screen text-white pt-24 pb-12">
      <section className="relative py-20 px-6 text-center">
        <h1 className="font-serif text-4xl md:text-6xl mb-4 text-white">
          THE JOURNAL
        </h1>
        <p className="text-white/60 max-w-2xl mx-auto">
          Stories of heritage, craft, and culture.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post: any) => (
            <Link 
              key={post._id} 
              href={`/blog/${post.slug?.current || '#'}`}
              className="group block bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:bg-white/10 transition-all duration-300"
            >
              <div className="aspect-[16/9] relative overflow-hidden">
                {post.image ? (
                   <Image
                    loader={sanityLoader}
                    src={urlFor(post.image).url()}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : post.imageUrl ? (
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/5">
                    <BookOpen size={40} className="text-white/20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />
              </div>

              <div className="p-6">
                <div className="flex items-center gap-4 text-xs text-[#D4AF37] mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(post.publishedAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                  {post.authorName && (
                    <span className="flex items-center gap-1">
                      <User size={12} />
                      {post.authorName}
                    </span>
                  )}
                </div>
                
                <h2 className="font-serif text-xl md:text-2xl mb-3 group-hover:text-[#D4AF37] transition-colors line-clamp-2">
                  {post.title}
                </h2>
                
                <p className="text-white/60 text-sm line-clamp-3 mb-4">
                  {post.excerpt}
                </p>

                <div className="text-sm font-medium underline decoration-white/30 underline-offset-4 group-hover:decoration-[#D4AF37] transition-all">
                  Read Article
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
