import { createClient } from "next-sanity";
import { NextResponse } from "next/server";
import { apiVersion, dataset, projectId, useCdn } from "@/sanity/env";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const client = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      token: process.env.SANITY_API_TOKEN,
    });

    // Check if already subscribed
    const existing = await client.fetch(`*[_type == "subscriber" && email == $email][0]`, { email });
    
    if (existing) {
        return NextResponse.json({ message: "Already subscribed" });
    }

    await client.create({
      _type: "subscriber",
      email,
      subscribedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Subscription failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
