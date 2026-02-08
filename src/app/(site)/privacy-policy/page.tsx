import { client } from "@/sanity/lib/client";
import LegalPageLayout from "@/components/LegalPageLayout";

export const revalidate = 0;

export default async function PrivacyPolicyPage() {
  const settings = await client.fetch(`*[_type == "siteSettings"][0]{
    privacyPolicy
  }`);

  return <LegalPageLayout title="Privacy Policy" content={settings?.privacyPolicy} />;
}
