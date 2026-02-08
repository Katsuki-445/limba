import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'counter',
  title: 'Counter',
  type: 'document',
  fields: [
    defineField({
      name: 'count',
      title: 'Count',
      type: 'number',
      initialValue: 0
    })
  ]
})
