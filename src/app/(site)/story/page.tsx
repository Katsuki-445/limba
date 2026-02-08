import { client } from "@/sanity/lib/client";
import StoryClient from "./StoryClient";

export const revalidate = 60;

export default async function StoryPage() {
  const data = await client.fetch(`*[_type == "brandStory"][0]{
    label,
    headline,
    "content": fullStory
  }`);

  return <StoryClient {...data} />;
}
