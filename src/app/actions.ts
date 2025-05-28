
'use server';

import type { EnquiryFormSchemaType } from './schemas';
import { createProductEnquiry } from '@/lib/sanityClient'; // Import the Sanity save function

// Server action for form submission
export async function submitEnquiryAction(data: EnquiryFormSchemaType): Promise<{ success: boolean; message: string }> {
  console.log('Enquiry submitted on server:', data);
  
  // Attempt to save to Sanity
  const sanityResult = await createProductEnquiry({
    productName: data.productName,
    customerName: data.name,
    email: data.email,
    mobile: data.mobile,
    message: data.enquiry,
    // submittedAt will be added by createProductEnquiry
  });

  return sanityResult;
}
