import { client } from "@/sanity/lib/client";
import LegalPageLayout from "@/components/LegalPageLayout";

export const revalidate = 0;

export default async function ShippingReturnsPage() {
  const settings = await client.fetch(`*[_type == "siteSettings"][0]{
    shippingReturns
  }`);

  return <LegalPageLayout title="Shipping & Returns" content={settings?.shippingReturns} />;
}
