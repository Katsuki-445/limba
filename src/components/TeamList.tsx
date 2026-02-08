"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { User } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";
import sanityLoader from "@/lib/sanityLoader";
import Link from "next/link";

// Types
interface TeamMember {
  _id: string;
  name: string;
  role: string;
  slug: { current: string };
  bio: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image: any;
  isFounder: boolean;
}

export default function TeamList({ members }: { members: TeamMember[] }) {
  const founder = members.find(m => m.isFounder);
  const otherMembers = members.filter(m => !m.isFounder);

  return (
    <main className="min-h-screen text-white pt-24 pb-12">
      {/* Hero Section */}
      <section className="relative py-20 px-6 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-4xl md:text-6xl mb-4"
        >
          THE MINDS BEHIND LIMBA
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-white/60 max-w-2xl mx-auto"
        >
          Weaving the threads of tradition into the fabric of the future.
        </motion.p>
      </section>

      {/* CEO Section */}
      {founder && (
        <section className="max-w-7xl mx-auto px-6 py-12 mb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <Link href={founder.slug?.current ? `/team/${founder.slug.current}` : '#'} className="block">
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="relative aspect-[3/4] md:aspect-square bg-white/5 rounded-lg overflow-hidden border border-white/10 group cursor-pointer"
                >
                    {founder.image ? (
                    <Image 
                        loader={sanityLoader}
                        src={urlFor(founder.image).url()} 
                        alt={founder.name} 
                        fill 
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-white/20">
                        <User size={100} strokeWidth={0.5} />
                    </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                </motion.div>
            </Link>
            
            <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
            >
                <Link href={founder.slug?.current ? `/team/${founder.slug.current}` : '#'} className="block hover:opacity-80 transition-opacity">
                    <div>
                    <h2 className="font-serif text-3xl md:text-5xl mb-2">{founder.name}</h2>
                    <p className="text-[#D4AF37] tracking-widest text-sm uppercase">{founder.role}</p>
                    </div>
                </Link>
                <p className="text-white/80 leading-relaxed text-lg font-light line-clamp-6">
                {founder.bio}
                </p>
                <div className="h-px w-24 bg-white/20" />
            </motion.div>
            </div>
        </section>
      )}

      {/* Team Grid */}
      {otherMembers.length > 0 && (
          <section className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {otherMembers.map((member, index) => (
                    <Link
                        key={member._id}
                        href={member.slug?.current ? `/team/${member.slug.current}` : '#'}
                        className="block h-full"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ delay: Math.min(index * 0.1, 0.3), duration: 0.5 }}
                            className="group flex flex-col bg-white/5 border border-white/10 rounded-lg overflow-hidden h-full hover:bg-white/10 transition-colors"
                        >
                            <div className="aspect-square md:aspect-[3/4] relative overflow-hidden bg-white/5 border-b border-white/10">
                                {member.image ? (
                                    <Image
                                        loader={sanityLoader}
                                        src={urlFor(member.image).url()}
                                        alt={member.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-white/10">
                                        <User size={60} strokeWidth={0.5} />
                                    </div>
                                )}
                            </div>
                            
                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="font-serif text-xl md:text-2xl mb-1">{member.name}</h3>
                                <p className="text-[#D4AF37] text-xs uppercase tracking-wider mb-3">{member.role}</p>
                                <p className="text-white/60 text-sm line-clamp-3">
                                    {member.bio}
                                </p>
                            </div>
                        </motion.div>
                    </Link>
                ))}
            </div>
          </section>
      )}
    </main>
  );
}
