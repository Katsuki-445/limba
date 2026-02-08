import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '@/sanity/env'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const client = createClient({
      projectId,
      dataset,
      apiVersion,
      token: process.env.SANITY_API_TOKEN,
      useCdn: false,
    })

    const doc = {
      _id: 'brandStory',
      _type: 'brandStory',
      label: 'Our Heritage',
      headline: 'Weaving the Threads of Ancestral Elegance',
      fullStory: [
        {
          _key: 'p1',
          _type: 'block',
          style: 'normal',
          children: [{ _key: 's1', _type: 'span', text: 'At LIMBA, we believe that true luxury lies in the stories we wear. Our journey began in the heart of Ghana, where the rhythmic clatter of the loom is the heartbeat of the community.' }]
        },
        {
          _key: 'p2',
          _type: 'block',
          style: 'normal',
          children: [{ _key: 's2', _type: 'span', text: "Every smock, every bead, and every pair of Ahenema sandals is handcrafted by master artisans who have inherited their skills through generations. We don't just sell fashion; we preserve a legacy." }]
        },
        {
          _key: 'p3',
          _type: 'block',
          style: 'normal',
          children: [{ _key: 's3', _type: 'span', text: 'Redefining African heritage for the modern world means honoring the past while embracing the future. Welcome to the new standard of cultural luxury.' }]
        }
      ]
    }

    // 1. Unset backgroundImage
    await client.patch('brandStory').unset(['backgroundImage']).commit()
    
    // 2. Update text fields
    await client.createOrReplace(doc)
    
    return NextResponse.json({ success: true, message: 'Story fixed' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
