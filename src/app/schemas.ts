
import { z } from 'zod';

export const enquiryFormSchema = z.object({
  productName: z.string(),
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  mobile: z.string().min(10, { message: 'Mobile number must be at least 10 digits.' }).regex(/^\+?[0-9\s-()]*$/, { message: 'Invalid mobile number format.' }),
  enquiry: z.string().min(10, { message: 'Enquiry must be at least 10 characters.' }).max(500, { message: 'Enquiry must be less than 500 characters.' }),
});

export type EnquiryFormSchemaType = z.infer<typeof enquiryFormSchema>;
