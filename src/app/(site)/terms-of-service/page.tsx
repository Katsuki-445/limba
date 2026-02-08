import { client } from "@/sanity/lib/client";
import LegalPageLayout from "@/components/LegalPageLayout";

export const revalidate = 0;

export default async function TermsOfServicePage() {
  const settings = await client.fetch(`*[_type == "siteSettings"][0]{
    termsOfService
  }`);

  return <LegalPageLayout title="Terms of Service" content={settings?.termsOfService} />;
}
