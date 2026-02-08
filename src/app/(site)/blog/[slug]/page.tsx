import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import sanityLoader from "@/lib/sanityLoader";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Calendar, User, ArrowLeft } from "lucide-react";
import Link from "next/link";

// Define types
interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  mainImage: any;
  authorName: string;
  body: any;
}

const components: PortableTextComponents = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset?._ref) {
        return null;
      }
      return (
        <div className="relative w-full aspect-video my-8 rounded-lg overflow-hidden bg-white/5">
          <Image
            loader={sanityLoader}
            src={urlFor(value).url()}
            alt={value.alt || "Post image"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 60vw"
          />
        </div>
      );
    },
  },
  block: {
    h3: ({ children }) => <h3 className="text-2xl font-serif text-[#D4AF37] mt-8 mb-4">{children}</h3>,
    normal: ({ children }) => <p className="mb-6 leading-relaxed text-white/80">{children}</p>,
  },
};

// Full content for placeholder posts
const placeholderPosts = [
  {
    _id: "placeholder-1",
    title: "Weaving the Future: The Evolution of Smock Artistry",
    slug: { current: "weaving-future" },
    publishedAt: new Date().toISOString(),
    authorName: "Limba Editorial",
    mainImage: "/smock.png", // Local path for placeholder
    isPlaceholder: true,
    body: [
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "The traditional smock, known locally as the 'fugu', has long been a symbol of strength and identity in Northern Ghana. Historically worn by kings and warriors, this heavy, hand-woven fabric carries the weight of centuries of tradition.",
          },
        ],
      },
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "At Limba, we believe that heritage is not static. It breathes, evolves, and adapts. Our latest collection takes the robust, structured nature of the fugu and reimagines it for the contemporary wardrobe. By deconstructing the classic silhouette and introducing lighter, breathable weaves, we are creating garments that honor the past while embracing the future.",
          },
        ],
      },
      {
        _type: "block",
        style: "h3",
        children: [{ _type: "span", text: "A Modern Interpretation" }],
      },
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "We are not just replicating old styles; we are innovating. Our artisans are experimenting with new dyeing techniques that maintain the vibrancy of natural indigo while reducing water usage. The result is a collection that feels familiar yet distinctly new—a bridge between the ancestral and the avant-garde.",
          },
        ],
      },
    ],
  },
  {
    _id: "placeholder-2",
    title: "The Meaning Behind the Patterns",
    slug: { current: "meaning-behind-patterns" },
    publishedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    authorName: "Limba Editorial",
    mainImage: "/beads.png",
    isPlaceholder: true,
    body: [
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "Every thread in a Limba garment tells a story. In traditional West African weaving, patterns are never random; they are a language. They speak of proverbs, historical events, and social status.",
          },
        ],
      },
      {
        _type: "block",
        style: "h3",
        children: [{ _type: "span", text: "Decoding the Symbols" }],
      },
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "The 'Nkyinkyim' pattern, representing the twisting journey of life, reminds us that resilience is key to survival. The 'Dame-Dame', or checkerboard, symbolizes duality—good and evil, dawn and dusk, ignorance and wisdom. When you wear these patterns, you are not just wearing clothes; you are wrapping yourself in wisdom.",
          },
        ],
      },
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "We work closely with elder master weavers to ensure that these meanings are preserved even as we adapt the designs. It is a delicate balance of respect and reinvention.",
          },
        ],
      },
    ],
  },
  {
    _id: "placeholder-3",
    title: "Sustainable Fashion in West Africa",
    slug: { current: "sustainable-fashion" },
    publishedAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    authorName: "Limba Editorial",
    mainImage: "/sandals.png",
    isPlaceholder: true,
    body: [
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "Sustainability is often a buzzword in the fashion industry, but for us, it is a way of life. Our production process is rooted in circularity and respect for the earth.",
          },
        ],
      },
      {
        _type: "block",
        style: "h3",
        children: [{ _type: "span", text: "From Soil to Studio" }],
      },
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "Our cotton is locally grown, supporting smallholder farmers in the region. We use natural dyes derived from roots, bark, and leaves, ensuring that no toxic chemicals leach into the soil. Because our garments are hand-woven, our carbon footprint is minimal compared to industrial textile production.",
          },
        ],
      },
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "By choosing Limba, you are investing in a future where luxury and responsibility go hand in hand.",
          },
        ],
      },
    ],
  },
];

async function getPost(slug: string) {
  try {
    const post = await client.fetch(
      `*[_type == "post" && slug.current == $slug][0] {
        _id,
        title,
        slug,
        publishedAt,
        mainImage,
        "authorName": author->name,
        body
      }`,
      { slug },
      { next: { revalidate: 60 } }
    );
    return post;
  } catch (error) {
    console.error("Failed to fetch post:", error);
    return null;
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sanityPost = await getPost(slug);
  
  // Check placeholders if not found in Sanity
  const post = sanityPost || placeholderPosts.find(p => p.slug.current === slug);

  if (!post) {
    notFound();
  }

  const isPlaceholder = (post as any).isPlaceholder;
  const imageUrl = isPlaceholder ? post.mainImage : (post.mainImage ? urlFor(post.mainImage).url() : null);

  return (
    <main className="min-h-screen text-white pt-24 pb-20">
      <article className="max-w-4xl mx-auto px-6">
        {/* Back Link */}
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-white/60 hover:text-[#D4AF37] transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          <span>Back to Journal</span>
        </Link>

        {/* Header */}
        <header className="mb-12 text-center">
          <div className="flex items-center justify-center gap-4 text-sm text-[#D4AF37] mb-6">
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {new Date(post.publishedAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
            {post.authorName && (
              <span className="flex items-center gap-1">
                <User size={14} />
                {post.authorName}
              </span>
            )}
          </div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight mb-8">
            {post.title}
          </h1>
        </header>

        {/* Main Image */}
        {imageUrl && (
          <div className="relative w-full aspect-video mb-16 rounded-xl overflow-hidden border border-white/10">
            <Image
              src={imageUrl}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-invert prose-lg max-w-none mx-auto prose-headings:font-serif prose-headings:text-white prose-a:text-[#D4AF37] prose-img:rounded-lg">
          <PortableText value={post.body} components={components} />
        </div>
      </article>
    </main>
  );
}
