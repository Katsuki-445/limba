import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'receiptSettings',
  title: 'Receipt Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'brandName',
      title: 'Brand Name',
      type: 'string',
      initialValue: 'Limba'
    }),
    defineField({
      name: 'logo',
      title: 'Receipt Logo',
      type: 'image',
      description: 'Logo used in email receipts',
      options: {hotspot: true}
    }),
    defineField({
        name: 'contactEmail',
        title: 'Contact Email',
        type: 'string',
        initialValue: 'support@limba.com'
    }),
    defineField({
        name: 'introText',
        title: 'Intro Text',
        type: 'text',
        description: 'Text to display after "Dear Customer,"',
        initialValue: 'Thank you for your order. We are honored to craft this piece of heritage for you.'
    }),
    defineField({
        name: 'footerText',
        title: 'Footer Text',
        type: 'text',
        description: 'Text to display at the bottom of the receipt',
        initialValue: 'Thank you for your patronage.'
    })
  ],
  preview: {
    prepare() {
        return {
            title: 'Receipt Settings'
        }
    }
  }
})
