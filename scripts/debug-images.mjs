
import { createClient } from 'next-sanity'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

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

async function checkData() {
  const products = await client.fetch(`*[_type == "product"]{
    name,
    "hasImage": defined(image.asset),
    "imageUrl": image.asset->url
  }`)
  
  console.log('--- DEBUG START ---')
  products.forEach(p => {
    console.log(`${p.name}: hasImage=${p.hasImage}, url=${p.imageUrl ? 'YES' : 'NO'}`)
  })
  console.log('--- DEBUG END ---')
}

checkData().catch(console.error)
