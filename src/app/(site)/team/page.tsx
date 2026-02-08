import { client } from "@/sanity/lib/client";
import TeamList from "@/components/TeamList";

// Ensure fresh data on each request (or use revalidate)
export const revalidate = 60;

export default async function TeamPage() {
  const members = await client.fetch(`
    *[_type == "teamMember"] | order(order asc) {
      _id,
      name,
      role,
      slug,
      bio,
      image,
      isFounder
    }
  `);

  if (!members || members.length === 0) {
    return (
        <main className="min-h-screen text-white pt-24 flex items-center justify-center">
            <p className="text-white/60">No team members found.</p>
        </main>
    )
  }

  return <TeamList members={members} />;
}
