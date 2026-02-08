import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import sanityLoader from "@/lib/sanityLoader";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, User } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export const revalidate = 60;

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  slug: { current: string };
  bio: string;
  image: any;
}

async function getTeamMember(slug: string) {
  try {
    const member = await client.fetch(
      `*[_type == "teamMember" && slug.current == $slug][0] {
        _id,
        name,
        role,
        slug,
        bio,
        image
      }`,
      { slug },
      { next: { revalidate: 60 } }
    );
    return member;
  } catch (error) {
    console.error("Failed to fetch team member:", error);
    return null;
  }
}

export default async function TeamMemberPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const member = await getTeamMember(slug);

  if (!member) {
    return notFound();
  }

  return (
    <main className="min-h-screen text-white pt-32 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        <Link 
          href="/team" 
          className="inline-flex items-center gap-2 text-white/60 hover:text-[#D4AF37] transition-colors mb-12"
        >
          <ArrowLeft size={20} />
          <span>Back to Team</span>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Image */}
          <div 
            className="relative aspect-[3/4] bg-white/5 rounded-lg overflow-hidden border border-white/10"
          >
            {member.image ? (
              <Image 
                loader={sanityLoader}
                src={urlFor(member.image).url()} 
                alt={member.name} 
                fill 
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-white/20">
                <User size={100} strokeWidth={0.5} />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
          </div>

          {/* Content */}
          <div className="space-y-8">
            <div>
              <h1 className="font-serif text-4xl md:text-6xl mb-2">{member.name}</h1>
              <p className="text-[#D4AF37] tracking-widest text-sm md:text-base uppercase">{member.role}</p>
            </div>

            <div className="h-px w-full bg-white/10" />

            <div className="prose prose-invert prose-lg text-white/80 font-light leading-relaxed whitespace-pre-line">
              {member.bio}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
