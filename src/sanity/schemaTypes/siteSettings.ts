import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Site Title',
      type: 'string',
      initialValue: 'Limba'
    }),
    defineField({
      name: 'description',
      title: 'Site Description',
      type: 'text',
      description: 'Default SEO description'
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      description: 'Image displayed when sharing on social media',
      options: {hotspot: true}
    }),
    defineField({
      name: 'supportEmail',
      title: 'Support Email',
      type: 'string',
      description: 'Email address for customer support (e.g. support@limba.com)',
      initialValue: 'basitlimann@yahoo.com'
    }),
    defineField({
      name: 'supportPhone',
      title: 'Support Phone',
      type: 'string',
      description: 'Phone number for calls (e.g. +233 50 000 0000)',
      initialValue: '+233 50 000 0000'
    }),
    defineField({
      name: 'whatsappNumber',
      title: 'WhatsApp Number',
      type: 'string',
      description: 'WhatsApp number in international format without + (e.g. 233500000000)',
      initialValue: '233500000000'
    }),
    defineField({
      name: 'whatsappMessage',
      title: 'WhatsApp Pre-filled Message',
      type: 'text',
      description: 'Default message when user opens WhatsApp',
      initialValue: 'Hello LIMBA, I would like to inquire about...'
    }),
    defineField({
      name: 'shippingReturns',
      title: 'Shipping & Returns',
      type: 'array',
      of: [{type: 'block'}],
      description: 'Content for the Shipping & Returns page'
    }),
    defineField({
      name: 'privacyPolicy',
      title: 'Privacy Policy',
      type: 'array',
      of: [{type: 'block'}],
      description: 'Content for the Privacy Policy page'
    }),
    defineField({
      name: 'termsOfService',
      title: 'Terms of Service',
      type: 'array',
      of: [{type: 'block'}],
      description: 'Content for the Terms of Service page'
    })
  ],
  preview: {
    prepare() {
        return {
            title: 'Site Settings'
        }
    }
  }
})
