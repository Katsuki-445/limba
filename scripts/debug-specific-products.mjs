import { createClient } from 'next-sanity'
import dotenv from 'dotenv'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '../.env.local') })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-02-05',
  useCdn: false,
})

async function checkProducts() {
  const products = await client.fetch(`*[_type == "product" && (name match "Sword" || name match "Stool")] {
    name,
    "hasImage": defined(image.asset),
    "imageUrl": image.asset->url,
    "assetId": image.asset._ref
  }`)
  
  console.log('Product Image Check:', JSON.stringify(products, null, 2))
}

checkProducts()
