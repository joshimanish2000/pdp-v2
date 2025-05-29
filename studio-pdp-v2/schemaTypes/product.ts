// sanity-schemas/product.ts
import {defineField, defineType} from 'sanity'
import {Package as icon} from 'lucide-react' // Using lucide-react icon for consistency

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  icon, // You can use a React component from lucide-react or react-icons
  fields: [
    defineField({
      name: 'name',
      title: 'Product Name',
      type: 'string',
      validation: (Rule) =>
        Rule.required().min(3).error('Product name must be at least 3 characters.'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      description: 'A brief summary of the product (for cards, meta descriptions, etc.).',
      validation: (Rule) =>
        Rule.max(300).warning('Shorter descriptions are usually better for previews.'),
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true, // Enables hotspot and crop functionality
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility.',
          validation: (Rule) => Rule.required().warning('Alt text is highly recommended.'),
        },
      ],
    }),
    defineField({
      name: 'imageHint',
      title: 'Image AI Hint',
      type: 'string',
      description:
        'Optional. One or two keywords for AI image search if this image is a placeholder (e.g., "laptop computer", "garden plant").',
    }),
    defineField({
      name: 'details',
      title: 'Product Details',
      type: 'array', // Using array of blocks for rich text (Portable Text)
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'Quote', value: 'blockquote'},
          ],
          lists: [
            {title: 'Bullet', value: 'bullet'},
            {title: 'Numbered', value: 'number'},
          ],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
              {title: 'Code', value: 'code'},
              {title: 'Underline', value: 'underline'},
              {title: 'Strike', value: 'strike-through'},
            ],
            // annotations: [ link, internalLink etc. ]
          },
        },
        {
          type: 'image', // Allow images within the details
          options: {hotspot: true},
        },
      ],
      description: 'Full product details, specifications, features, etc.',
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: (Rule) => Rule.min(0).precision(2),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'Product category (e.g., Electronics, Books, Home Goods).',
      // You could convert this to a reference to a 'category' document type later for better management
      // options: {
      //   list: [
      //     {title: 'Electronics', value: 'electronics'},
      //     {title: 'Books', value: 'books'},
      //     // Add more predefined categories or fetch dynamically
      //   ],
      // },
    }),
    defineField({
      name: 'buyNowUrl',
      title: 'Buy Now URL',
      type: 'url',
      description: 'The URL for the "Buy Product" button. If provided, the button will link here.',
      validation: (Rule) =>
        Rule.uri({
          scheme: ['http', 'https'],
        }),
    }),
    // You can add more fields like SKU, stock, variants, etc.
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'category',
      media: 'mainImage',
      price: 'price',
    },
    prepare(selection) {
      const {title, subtitle, media, price} = selection
      const priceString = typeof price === 'number' ? `$${price.toFixed(2)}` : 'Price not set'
      return {
        title: title || 'Untitled Product',
        subtitle: `${subtitle || 'No category'} - ${priceString}`,
        media: media,
      }
    },
  },
  orderings: [
    {
      title: 'Name, A-Z',
      name: 'nameAsc',
      by: [{field: 'name', direction: 'asc'}],
    },
    {
      title: 'Price, Low to High',
      name: 'priceAsc',
      by: [{field: 'price', direction: 'asc'}],
    },
    {
      title: 'Price, High to Low',
      name: 'priceDesc',
      by: [{field: 'price', direction: 'desc'}],
    },
  ],
})
