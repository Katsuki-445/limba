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

async function deleteAll() {
  console.log('Deleting all products...')
  await client.delete({query: '*[_type == "product"]'})
  
  console.log('Deleting all categories...')
  await client.delete({query: '*[_type == "category"]'})
  
  console.log('Done!')
}

deleteAll().catch(console.error)
