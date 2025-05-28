
import type { ContentItem, Product } from '@/types/sanity';
import { sanityClient, sanityWriteClient, urlFor, sanityClientConfig } from './sanityClientConfig';

// GROQ queries
const contentItemFields = `
  _id,
  _type,
  _createdAt,
  _updatedAt,
  title,
  slug,
  excerpt,
  mainImage, // Fetches the image asset reference
  category,
  body
`;

const productFields = `
  _id,
  _type,
  _createdAt,
  _updatedAt,
  name,
  slug,
  description,
  mainImage, // Fetches the image asset reference
  imageHint,
  details,
  price,
  category
`;

export async function fetchContentItems(filter?: { category?: string; searchTerm?: string }): Promise<ContentItem[]> {
  if (!sanityClientConfig.projectId || sanityClientConfig.projectId === 'mockProjectId') {
    console.warn("Sanity client not fully configured, returning empty array for fetchContentItems.");
    return [];
  }
  try {
    let query = `*[_type == "post"]`;
    const params: Record<string, any> = {};

    if (filter?.category && filter.category !== 'all') {
      query += `[category == $category]`;
      params.category = filter.category;
    }

    if (filter?.searchTerm) {
      query += `[title match $searchTerm + "*" || excerpt match $searchTerm + "*"]`;
      params.searchTerm = filter.searchTerm;
    }

    query += `{${contentItemFields}} | order(_createdAt desc)`;
    
    const items = await sanityClient.fetch<ContentItem[]>(query, params);
    return items;
  } catch (error) {
    console.error("Failed to fetch content items from Sanity:", error);
    throw new Error(`Sanity API request for content items failed. ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function fetchCategories(): Promise<string[]> {
   if (!sanityClientConfig.projectId || sanityClientConfig.projectId === 'mockProjectId') {
    console.warn("Sanity client not fully configured, returning default categories.");
    return ['all', 'Technology', 'Science']; // Basic fallback
  }
  try {
    const query = `array::unique(*[_type == "post" && defined(category)].category)`;
    const categories = await sanityClient.fetch<string[]>(query);
    return ['all', ...(categories || [])];
  } catch (error) {
    console.error("Failed to fetch categories from Sanity:", error);
    throw new Error(`Sanity API request for categories failed. ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  if (!sanityClientConfig.projectId || sanityClientConfig.projectId === 'mockProjectId') {
    console.warn("Sanity client not fully configured, returning null for fetchProductBySlug.");
    return null;
  }
  try {
    const query = `*[_type == "product" && slug.current == $slug][0]{${productFields}}`;
    const product = await sanityClient.fetch<Product | null>(query, { slug });
    return product;
  } catch (error) {
    console.error(`Failed to fetch product with slug "${slug}" from Sanity:`, error);
    throw new Error(`Sanity API request for product "${slug}" failed. ${error instanceof Error ? error.message : String(error)}`);
  }
}

export function subscribeToContentUpdates(callback: (item: ContentItem) => void): () => void {
  if (typeof window === 'undefined' || !sanityClientConfig.projectId || sanityClientConfig.projectId === 'mockProjectId') {
    // Sanity listen only works client-side and if client is configured
    return () => {}; // No-op
  }

  const query = '*[_type == "post"]'; // Listen to 'post' type documents
  
  try {
    const subscription = sanityClient.listen<ContentItem>(query).subscribe(update => {
      // Handle new or updated documents
      if (update.result && (update.transition === 'appear' || update.transition === 'update')) {
        // The 'as ContentItem' cast assumes the fetched document matches the ContentItem structure.
        // You might need more robust mapping if your Sanity schema differs significantly.
        callback(update.result as ContentItem);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  } catch (error) {
    console.error("Failed to subscribe to content updates:", error);
    return () => {}; // No-op on error
  }
}

// Example of how an enquiry might be saved to Sanity (used in actions.ts)
export async function createProductEnquiry(data: any): Promise<{ success: boolean; message: string }> {
  if (!sanityWriteClient) {
    console.warn("Sanity write client is not configured. Enquiry not saved to Sanity.");
    // Simulate success for UI purposes if token is missing for local dev
    return { success: true, message: "Enquiry (simulated) submitted! Real submission requires SANITY_API_TOKEN." };
  }
  try {
    await sanityWriteClient.create({
      _type: 'productEnquiry', // Ensure this type exists in your Sanity Studio
      ...data,
      submittedAt: new Date().toISOString()
    });
    return { success: true, message: 'Enquiry submitted successfully to Sanity! We will get back to you soon.' };
  } catch (error) {
    console.error('Failed to save enquiry to Sanity:', error);
    return { success: false, message: 'Server error: Could not submit enquiry to Sanity.' };
  }
}
