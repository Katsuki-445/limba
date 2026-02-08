import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'brandStory',
  title: 'Our Story',
  type: 'document',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'Small text above the headline (e.g., "Our Heritage")',
      initialValue: 'Our Heritage'
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      description: 'Main headline',
      initialValue: 'Weaving the Threads of Ancestral Elegance'
    }),
    defineField({
        name: 'fullStory',
        title: 'Story Content',
        type: 'array',
        of: [{type: 'block'}],
        description: 'The main story content displayed on the Our Story page.'
    })
  ],
  preview: {
    prepare() {
        return {
            title: 'Our Story'
        }
    }
  }
})
