
'use client';

import type { ComponentProps } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { submitEnquiryAction } from '@/app/actions';
import { enquiryFormSchema, type EnquiryFormSchemaType } from '@/app/schemas';


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
