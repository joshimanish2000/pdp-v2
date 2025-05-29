// sanity-schemas/productEnquiry.ts
import {defineField, defineType} from 'sanity'
import {MdMailOutline as icon} from 'react-icons/md' // Example icon, ensure react-icons/md is in your Studio's dependencies

export default defineType({
  name: 'productEnquiry',
  title: 'Product Enquiry',
  type: 'document',
  icon,
  fields: [
    defineField({
      name: 'productName',
      title: 'Product Name',
      type: 'string',
      description: 'The name of the product this enquiry is about.',
      readOnly: true, // Often pre-filled by the system
    }),
    defineField({
      name: 'customerName',
      title: 'Customer Name',
      type: 'string',
      validation: (Rule) => Rule.required().min(2).error('Name must be at least 2 characters.'),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.required().email().error('Please enter a valid email address.'),
    }),
    defineField({
      name: 'mobile',
      title: 'Mobile Number',
      type: 'string',
      description: 'Optional mobile number.',
      validation: (Rule) =>
        Rule.optional().custom((mobile) => {
          if (mobile && !/^\+?[0-9\s-()]*$/.test(mobile)) {
            return 'Invalid mobile number format.'
          }
          if (mobile && mobile.length < 10) {
            return 'Mobile number should be at least 10 digits.'
          }
          return true
        }),
    }),
    defineField({
      name: 'message',
      title: 'Message',
      type: 'text',
      rows: 5,
      validation: (Rule) =>
        Rule.required().min(10).max(5000).error('Message must be between 10 and 5000 characters.'),
    }),
    defineField({
      name: 'submittedAt',
      title: 'Submitted At',
      type: 'datetime',
      readOnly: true,
      options: {
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm',
        calendarTodayLabel: 'Today',
      },
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'New', value: 'new'},
          {title: 'In Progress', value: 'in_progress'},
          {title: 'Resolved', value: 'resolved'},
          {title: 'Closed', value: 'closed'},
        ],
        layout: 'radio', // or 'dropdown'
      },
      initialValue: 'new',
    }),
  ],
  preview: {
    select: {
      title: 'productName',
      customer: 'customerName',
      email: 'email',
      submittedAt: 'submittedAt',
      status: 'status',
    },
    prepare(selection) {
      const {title, customer, email, submittedAt, status} = selection
      const formattedDate = submittedAt ? new Date(submittedAt).toLocaleDateString() : 'No date'
      return {
        title: `${title || 'Enquiry'} from ${customer || 'Unknown'}`,
        subtitle: `${email} - Submitted: ${formattedDate} - Status: ${status || 'New'}`,
      }
    },
  },
  orderings: [
    {
      title: 'Submission Date, Newest First',
      name: 'submittedAtDesc',
      by: [{field: 'submittedAt', direction: 'desc'}],
    },
    {
      title: 'Submission Date, Oldest First',
      name: 'submittedAtAsc',
      by: [{field: 'submittedAt', direction: 'asc'}],
    },
    {
      title: 'Status',
      name: 'statusAsc',
      by: [{field: 'status', direction: 'asc'}],
    },
  ],
})
