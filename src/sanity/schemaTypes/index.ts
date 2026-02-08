import { type SchemaTypeDefinition } from 'sanity'
import category from './category'
import product from './product'
import order from './order'
import brandStory from './brandStory'
import receiptSettings from './receiptSettings'
import siteSettings from './siteSettings'
import counter from './counter'
import post from './post'
import teamMember from './teamMember'
import subscriber from './subscriber'
import inquiry from './inquiry'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [category, product, order, brandStory, receiptSettings, siteSettings, counter, post, teamMember, subscriber, inquiry],
}
