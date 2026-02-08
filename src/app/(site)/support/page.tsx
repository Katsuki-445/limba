import { client } from "@/sanity/lib/client";
import SupportClient from "./SupportClient";

export const revalidate = 0; // Ensure fresh data

export default async function SupportPage() {
  const settings = await client.fetch(`*[_type == "siteSettings"][0]{
    supportEmail,
    supportPhone,
    whatsappNumber,
    whatsappMessage
  }`) || {};

  const supportEmail = settings.supportEmail || 'basitlimann@yahoo.com';
  const supportPhone = settings.supportPhone || '+233 50 000 0000';
  const whatsappNumber = settings.whatsappNumber || '233500000000';
  const whatsappMessage = settings.whatsappMessage || 'Hello LIMBA, I would like to inquire about...';

  return (
    <SupportClient 
      supportEmail={supportEmail}
      supportPhone={supportPhone}
      whatsappNumber={whatsappNumber}
      whatsappMessage={whatsappMessage}
    />
  );
}
