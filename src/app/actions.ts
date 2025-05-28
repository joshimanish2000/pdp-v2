
'use server';

import { z } from 'zod';

export const enquiryFormSchema = z.object({
  productName: z.string(),
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  mobile: z.string().min(10, { message: 'Mobile number must be at least 10 digits.' }).regex(/^\+?[0-9\s-()]*$/, { message: 'Invalid mobile number format.' }),
  enquiry: z.string().min(10, { message: 'Enquiry must be at least 10 characters.' }).max(500, { message: 'Enquiry must be less than 500 characters.' }),
});

export type EnquiryFormSchemaType = z.infer<typeof enquiryFormSchema>;

// Server action for form submission
export async function submitEnquiryAction(data: EnquiryFormSchemaType): Promise<{ success: boolean; message: string }> {
  console.log('Enquiry submitted on server:', data);
  // Simulate API call / database interaction
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Example: Save to Sanity (pseudo-code, actual implementation would need Sanity client)
  /*
  try {
    // import { sanityClient } from '@/lib/sanityClientConfig'; // Assuming you have a configured client
    // await sanityClient.create({ 
    //   _type: 'productEnquiry', 
    //   productName: data.productName,
    //   customerName: data.name,
    //   email: data.email,
    //   mobile: data.mobile,
    //   message: data.enquiry,
    //   submittedAt: new Date().toISOString() 
    // });
    return { success: true, message: 'Enquiry submitted successfully! We will get back to you soon.' };
  } catch (error) {
    console.error('Failed to save enquiry:', error);
    return { success: false, message: 'Server error: Could not submit enquiry.' };
  }
  */

  // For now, always return success
  return { success: true, message: 'Enquiry submitted successfully! We will get back to you soon.' };
}
