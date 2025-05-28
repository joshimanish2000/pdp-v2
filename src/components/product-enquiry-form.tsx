
'use client';

import type { ComponentProps } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

const enquiryFormSchema = z.object({
  productName: z.string(),
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  mobile: z.string().min(10, { message: 'Mobile number must be at least 10 digits.' }).regex(/^\+?[0-9\s-()]*$/, { message: 'Invalid mobile number format.' }),
  enquiry: z.string().min(10, { message: 'Enquiry must be at least 10 characters.' }).max(500, { message: 'Enquiry must be less than 500 characters.' }),
});

type EnquiryFormSchemaType = z.infer<typeof enquiryFormSchema>;

// Server action for form submission
async function submitEnquiryAction(data: EnquiryFormSchemaType): Promise<{ success: boolean; message: string }> {
  'use server';
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


interface ProductEnquiryFormProps extends ComponentProps<'form'> {
  productName: string;
}

export default function ProductEnquiryForm({ productName, ...props }: ProductEnquiryFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EnquiryFormSchemaType>({
    resolver: zodResolver(enquiryFormSchema),
    defaultValues: {
      productName: productName,
      name: '',
      email: '',
      mobile: '',
      enquiry: '',
    },
  });

  async function onSubmit(values: EnquiryFormSchemaType) {
    setIsSubmitting(true);
    try {
      const result = await submitEnquiryAction(values);
      if (result.success) {
        toast({
          title: 'Enquiry Sent!',
          description: result.message,
        });
        form.reset();
      } else {
        toast({
          variant: 'destructive',
          title: 'Submission Failed',
          description: result.message || 'An unexpected error occurred.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Client Error',
        description: 'Failed to submit your enquiry. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-card p-6 md:p-8 rounded-lg shadow-lg" {...props}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Jane Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input type="email" placeholder="e.g., jane.doe@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mobile"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mobile Number (Optional)</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="e.g., +1 123 456 7890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="enquiry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Enquiry</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Please tell us more about your interest in this product, any specific questions you have, etc."
                  className="min-h-[120px] resize-y"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? 'Submitting...' : 'Submit Enquiry'}
        </Button>
      </form>
    </Form>
  );
}
