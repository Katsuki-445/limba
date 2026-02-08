import { MetadataRoute } from 'next';
import { client } from '@/sanity/lib/client';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://limba-heritage.vercel.app';

  // Static routes
  const routes = [
    '',
    '/collections',
    '/story',
    '/team',
    '/blog',
    '/shipping-returns',
    '/support',
    '/track-order',
    '/privacy-policy',
    '/terms-of-service',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic routes (Products)
  const products = await client.fetch(`*[_type == "product"]{ "slug": slug.current, _updatedAt }`);
  const teamMembers = await client.fetch(`*[_type == "teamMember"]{ "slug": slug.current, _updatedAt }`);
  const posts = await client.fetch(`*[_type == "post"]{ "slug": slug.current, _updatedAt }`);
  
  const productRoutes = products.map((product: { slug: string; _updatedAt: string }) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: new Date(product._updatedAt),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  const teamRoutes = teamMembers.map((member: { slug: string; _updatedAt: string }) => ({
    url: `${baseUrl}/team/${member.slug}`,
    lastModified: new Date(member._updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const postRoutes = posts.map((post: { slug: string; _updatedAt: string }) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post._updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...routes, ...productRoutes, ...teamRoutes, ...postRoutes];
}
