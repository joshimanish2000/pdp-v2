
'use server';

import type { EnquiryFormSchemaType } from './schemas';
import { createProductEnquiry } from '@/lib/sanityClient'; // Import the Sanity save function

// Server action for form submission
export async function submitEnquiryAction(data: EnquiryFormSchemaType): Promise<{ success: boolean; message: string }> {
  console.log('Enquiry submitted on server:', data);
  
  // Attempt to save to Sanity (or simulate if disabled/not configured)
  const sanityResult = await createProductEnquiry({
    productName: data.productName,
    customerName: data.name,
    email: data.email,
    mobile: data.mobile,
    message: data.enquiry,
    // submittedAt will be added by createProductEnquiry or is part of simulation
  });

  // Add a server-side log if the submission was simulated
  if (sanityResult.success && sanityResult.message.toLowerCase().includes("(simulation")) {
    let warningMessage = `[ProductEnquiryAction] Submission for product "${data.productName}" by "${data.name}" was SIMULATED. Data was NOT saved to Sanity.`;
    if (sanityResult.message.toLowerCase().includes("api token not set")) {
      warningMessage += " Reason: SANITY_API_TOKEN is not set.";
    } else if (sanityResult.message.toLowerCase().includes("currently disabled")) {
      warningMessage += " Reason: Saving to Sanity is explicitly disabled in the code.";
    }
    console.warn(warningMessage);
  }

  return sanityResult;
}
