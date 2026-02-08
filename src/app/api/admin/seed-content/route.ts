
import { createClient } from "next-sanity";
import { NextResponse } from "next/server";
import { apiVersion, dataset, projectId, useCdn } from "@/sanity/env";

const blogPosts = [
  {
    title: "Weaving the Future: The Evolution of Smock Artistry",
    slug: { current: "weaving-future" },
    publishedAt: new Date().toISOString(),
    excerpt: "Exploring how traditional techniques are being reimagined for the modern wardrobe while preserving their ancestral significance.",
    body: [
      {
        _type: 'block',
        children: [{ _type: 'span', text: 'Smock artistry has deep roots in Northern Ghana...' }]
      }
    ]
  },
  {
    title: "The Meaning Behind the Patterns",
    slug: { current: "meaning-behind-patterns" },
    publishedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    excerpt: "A deep dive into the cultural stories and proverbs woven into every thread of our heritage textiles.",
    body: [
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Every pattern tells a story...' }]
        }
      ]
  },
  {
    title: "Sustainable Fashion in West Africa",
    slug: { current: "sustainable-fashion" },
    publishedAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    excerpt: "How local sourcing and artisanal production methods are setting new standards for eco-conscious luxury.",
    body: [
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Sustainability is not just a trend, it is our way of life...' }]
        }
      ]
  }
];

const teamMembers = [
    {
        name: "Founder Name",
        role: "Founder & CEO",
        bio: "Visionary leader with a passion for heritage.",
        isFounder: true,
        order: 1
    },
    {
        name: "Lead Designer",
        role: "Creative Director",
        bio: "Blending tradition with modern aesthetics.",
        isFounder: false,
        order: 2
    },
    {
        name: "Head of Operations",
        role: "Operations Manager",
        bio: "Ensuring every piece reaches you in perfect condition.",
        isFounder: false,
        order: 3
    }
];

const categories = [
  {
    title: "HEADWEAR",
    slug: { current: "headwear" },
    description: "The crowning glory of heritage.",
  },
  {
    title: "ARTS & CRAFTS",
    slug: { current: "arts-crafts" },
    description: "Crafted by hands, guided by spirit.",
  },
  {
    title: "APPAREL",
    slug: { current: "apparel" },
    description: "West African Smock Artistry meeting Modern Aesthetics.",
  },
  {
    title: "TEXTILES",
    slug: { current: "textiles" },
    description: "Formatting culture through contemporary lenses.",
  },
  {
    title: "FOOTWEAR",
    slug: { current: "footwear" },
    description: "Steps in tradition.",
  },
  {
    title: "JEWELRY",
    slug: { current: "jewelry" },
    description: "Adornments of the soul.",
  },
];

export async function GET() {
  try {
    const client = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      token: process.env.SANITY_API_TOKEN,
    });

    const results = {
      posts: [] as any[],
      team: [] as any[],
      categories: [] as any[]
    };

    // 1. Create Blog Posts
    for (const post of blogPosts) {
      const existing = await client.fetch(`*[_type == "post" && slug.current == $slug][0]`, { slug: post.slug.current });
      if (!existing) {
        const doc = {
          _type: 'post',
          title: post.title,
          slug: post.slug,
          publishedAt: post.publishedAt,
          body: post.body,
        };
        const res = await client.create(doc);
        results.posts.push({ status: 'created', title: post.title, id: res._id });
      } else {
        results.posts.push({ status: 'skipped (exists)', title: post.title });
      }
    }

    // 2. Create Team Members
    for (const member of teamMembers) {
        const existing = await client.fetch(`*[_type == "teamMember" && name == $name][0]`, { name: member.name });
        if (!existing) {
            const doc = {
                _type: 'teamMember',
                ...member
            };
            const res = await client.create(doc);
            results.team.push({ status: 'created', name: member.name, id: res._id });
        } else {
            results.team.push({ status: 'skipped (exists)', name: member.name });
        }
    }

    // 3. Create Categories
    for (const cat of categories) {
        const existing = await client.fetch(`*[_type == "category" && slug.current == $slug][0]`, { slug: cat.slug.current });
        if (!existing) {
            const doc = {
                _type: 'category',
                ...cat
            };
            const res = await client.create(doc);
            results.categories.push({ status: 'created', title: cat.title, id: res._id });
        } else {
            results.categories.push({ status: 'skipped (exists)', title: cat.title });
        }
    }

    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    console.error("Migration failed:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
