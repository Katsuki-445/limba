import { createClient } from 'next-sanity'
import { readFileSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '../.env.local') })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_TOKEN

if (!projectId || !dataset || !token) {
  console.error('Missing environment variables')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2024-02-05',
  useCdn: false,
})

const categories = [
  { name: "Apparel", image: "smock.png", desc: "Handwoven Excellence", className: "md:col-span-2" },
  { name: "Footwear", image: "sandals.png", desc: "Royal Steps", className: "md:col-span-1" },
  { name: "Jewelry", image: "beads.png", desc: "Adorned in Gold", className: "md:col-span-1" },
  { name: "Arts/Crafts", image: "boutique.png", desc: "Cultural Heritage", className: "md:col-span-2" },
  { name: "Textiles", image: "smock.png", desc: "Kente & Cotton", className: "md:col-span-2" },
  { name: "Headwear", image: "beads.png", desc: "Sacred Rites", className: "md:col-span-1" },
]

const products = [
  { name: "Northern Smock", price: 400, image: "smock.png", category: "Apparel", isFeatured: false },
  { name: "Royal Beads", price: 120, image: "beads.png", category: "Jewelry", isFeatured: false },
  { name: "Ahenema Sandals", price: 250, image: "sandals.png", category: "Footwear", isFeatured: false },
  { name: "Kente Stole", price: 150, image: "smock.png", category: "Textiles", isFeatured: true },
  { name: "Gold Bangle", price: 320, image: "beads.png", category: "Jewelry", isFeatured: true },
  { name: "Ceremonial Hat", price: 95, image: "smock.png", category: "Headwear", isFeatured: true },
  { name: "Velvet Slippers", price: 180, image: "sandals.png", category: "Footwear", isFeatured: true },
  
  // From ProductRunway
  { name: "Gold Jewelry", price: 850, image: "beads.png", category: "Jewelry", isFeatured: false },
  { name: "Ashanti Stool", price: 500, image: "boutique.png", category: "Arts/Crafts", isFeatured: false },
  { name: "Woven Basket", price: 60, image: "beads.png", category: "Arts/Crafts", isFeatured: false },
  { name: "Chief's Staff", price: 1200, image: "smock.png", category: "Arts/Crafts", isFeatured: false },
  { name: "Brass Anklet", price: 80, image: "beads.png", category: "Jewelry", isFeatured: false },
  { name: "Leather Bag", price: 210, image: "smock.png", category: "Apparel", isFeatured: false },
  { name: "Beaded Crown", price: 450, image: "beads.png", category: "Headwear", isFeatured: false },
  { name: "Adinkra Cloth", price: 300, image: "smock.png", category: "Textiles", isFeatured: false },
  { name: "Ceremonial Sword", price: 900, image: "boutique.png", category: "Arts/Crafts", isFeatured: false },
];

async function uploadImage(fileName) {
  const filePath = join(__dirname, '../public', fileName)
  const buffer = readFileSync(filePath)
  const asset = await client.assets.upload('image', buffer, { filename: fileName })
  return asset._id
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

async function seed() {
  console.log('Starting seed...')
  
  const categoryIdMap = {}

  // Upload Categories
  for (const cat of categories) {
    console.log(`Processing category: ${cat.name}`)
    try {
      const imageId = await uploadImage(cat.image)
      await delay(1000) // Wait 1s
      
      const doc = {
        _type: 'category',
        title: cat.name,
        slug: { _type: 'slug', current: cat.name.toLowerCase().replace('/', '-').replace(/\s+/g, '-') },
        description: cat.desc,
        layoutClass: cat.className,
        image: {
          _type: 'image',
          asset: { _ref: imageId }
        }
      }
      
      const created = await client.create(doc)
      categoryIdMap[cat.name] = created._id
      console.log(`Created category: ${created.title}`)
      await delay(500)
    } catch (err) {
      console.error(`Failed to create category ${cat.name}:`, err.message)
    }
  }

  // Upload Products
  for (const prod of products) {
    console.log(`Processing product: ${prod.name}`)
    try {
      const imageId = await uploadImage(prod.image)
      await delay(1000) // Wait 1s
      
      const doc = {
        _type: 'product',
        name: prod.name,
        slug: { _type: 'slug', current: prod.name.toLowerCase().replace(/\s+/g, '-') },
        price: prod.price,
        isFeatured: prod.isFeatured,
        category: {
          _type: 'reference',
          _ref: categoryIdMap[prod.category]
        },
        image: {
          _type: 'image',
          asset: { _ref: imageId }
        }
      }
      
      const created = await client.create(doc)
      console.log(`Created product: ${created.name}`)
      await delay(500)
    } catch (err) {
      console.error(`Failed to create product ${prod.name}:`, err.message)
    }
  }

  console.log('Seed completed successfully!')
}

seed().catch(console.error)
