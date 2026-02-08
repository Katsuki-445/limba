export default {
  name: 'order',
  title: 'Order',
  type: 'document',
  fields: [
    {
      name: 'orderNumber',
      title: 'Order Number',
      type: 'string',
      description: 'Unique order identifier (e.g. LB-1001)',
      readOnly: true,
    },
    {
      name: 'paymentReference',
      title: 'Payment Reference',
      type: 'string',
      description: 'Reference ID from payment provider',
      readOnly: true,
    },
    {
      name: 'customerName',
      title: 'Customer Name',
      type: 'string',
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
    },
    {
      name: 'phone',
      title: 'Phone',
      type: 'string',
    },
    {
      name: 'address',
      title: 'Address',
      type: 'text',
    },
    {
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', type: 'string' },
            { name: 'quantity', type: 'number' },
            { name: 'price', type: 'number' },
            { name: 'imageUrl', type: 'string' },
            { name: 'product', type: 'reference', to: [{ type: 'product' }] },
          ],
          preview: {
            select: {
              title: 'name',
              subtitle: 'quantity',
              imageUrl: 'imageUrl', 
              productMedia: 'product.image',
            },
            prepare({ title, subtitle, productMedia }: any) {
              return {
                title: title,
                subtitle: `Qty: ${subtitle}`,
                // If we have a product reference, use its image. 
                // If imageUrl is a string (URL), Sanity Studio preview 'media' expects an object or component, or an image asset.
                // Displaying an external URL image in Sanity preview requires a custom component or just relying on the product ref.
                media: productMedia, 
              }
            },
          },
        },
      ],
    },
    {
      name: 'totalAmount',
      title: 'Total Amount',
      type: 'number',
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Paid', value: 'paid' },
          { title: 'Queued', value: 'queued' },
          { title: 'Quality Check', value: 'quality_check' },
          { title: 'In Transit', value: 'in_transit' },
          { title: 'Delivered', value: 'delivered' },
          { title: 'Cancelled', value: 'cancelled' },
        ],
      },
      initialValue: 'paid',
    },
    {
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    },
  ],
  preview: {
    select: {
      title: 'orderNumber',
      subtitle: 'customerName',
      status: 'status',
    },
    prepare({ title, subtitle, status }: any) {
      return {
        title: title || 'New Order',
        subtitle: `${subtitle || 'Unknown'} - ${status?.toUpperCase() || 'PENDING'}`,
      }
    },
  },
}
