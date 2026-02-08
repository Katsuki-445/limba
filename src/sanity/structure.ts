import { type StructureBuilder } from 'sanity/structure'
import { 
  BasketIcon, 
  TagIcon, 
  ThListIcon, 
  BookIcon, 
  BillIcon, 
  CogIcon,
  UsersIcon,
  TrolleyIcon,
  EditIcon,
  EnvelopeIcon
} from '@sanity/icons'

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Limba Admin')
    .items([
      // 1. Orders
      S.listItem()
        .title('Orders')
        .icon(BasketIcon)
        .child(
          S.documentList()
            .title('Orders')
            .filter('_type == "order"')
            .defaultOrdering([{field: 'createdAt', direction: 'desc'}])
        ),
      
      S.divider(),

      // 2. Products (Group)
      S.listItem()
        .title('Products')
        .icon(TrolleyIcon)
        .child(
          S.list()
            .title('Products')
            .items([
              S.listItem()
                .title('View All Products')
                .icon(TagIcon)
                .child(
                  S.documentList()
                    .title('All Products')
                    .filter('_type == "product"')
                ),
              S.listItem()
                .title('Browse by Collection')
                .icon(ThListIcon)
                .child(
                  S.documentTypeList('category')
                    .title('Browse by Collection')
                    .child(categoryId =>
                      S.documentList()
                        .title('Products in Collection')
                        .filter('_type == "product" && $categoryId in categories[]._ref')
                        .params({categoryId})
                    )
                )
            ])
        ),

      // 3. Collections (Direct List)
      S.documentTypeListItem('category')
        .title('Collections')
        .icon(ThListIcon),

      S.divider(),

      // 4. Our Story (Singleton)
      S.listItem()
        .title('Our Story')
        .icon(BookIcon)
        .child(
          S.document()
            .schemaType('brandStory')
            .documentId('brandStory')
            .title('Our Story')
        ),

      // 5. Journal / Blog
      S.documentTypeListItem('post')
        .title('Journal Posts')
        .icon(EditIcon),

      // 6. Team
      S.documentTypeListItem('teamMember')
        .title('Team Members')
        .icon(UsersIcon),

      // 7. Subscribers
      S.documentTypeListItem('subscriber')
        .title('Subscribers')
        .icon(EnvelopeIcon),

      S.divider(),

      // 8. Receipt Settings (Singleton)
      S.listItem()
        .title('Receipt Settings')
        .icon(BillIcon)
        .child(
          S.document()
            .schemaType('receiptSettings')
            .documentId('receiptSettings')
            .title('Receipt Settings')
        ),

      // 6. Site Settings (Singleton)
      S.listItem()
        .title('Site Settings')
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Site Settings')
        ),
    ])
