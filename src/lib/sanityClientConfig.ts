import { createClient, type ClientConfig } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = '2024-07-15'; // Use a recent API version or your project's creation date

if (!projectId) {
  console.warn("Warning: The Sanity Project ID is not set. Please set NEXT_PUBLIC_SANITY_PROJECT_ID in your .env file for full functionality.");
}
if (!dataset) {
  console.warn("Warning: The Sanity Dataset is not set. Please set NEXT_PUBLIC_SANITY_DATASET in your .env file for full functionality.");
}

export const sanityClientConfig: ClientConfig = {
  projectId: projectId || 'mockProjectId', // Fallback for environments where .env might not be loaded (e.g. build time for some Vercel setups if not exposed)
  dataset: dataset || 'mockDataset',
  apiVersion,
  useCdn: process.env.NODE_ENV === 'production',
};

export const sanityClient = createClient(sanityClientConfig);

export const urlFor = (source: any) => {
  if (!source || !source.asset) {
    // Return a placeholder or null if the source is invalid
    // This helps prevent errors if image data is missing
    return {
      url: () => `https://placehold.co/600x400.png?text=Missing+Image`, // Default placeholder
      width: (w: number) => ({ height: (h: number) => ({ url: () => `https://placehold.co/${w}x${h}.png?text=Missing+Image` }) }),
      // Add other chainable methods if your usage requires them
    };
  }
  return imageUrlBuilder(sanityClient).image(source);
}

// Client for mutations (requires token for write access if dataset is not public)
// Ensure SANITY_API_TOKEN is set in your environment variables for this to work.
const sanityWriteToken = process.env.SANITY_API_TOKEN;

export const sanityWriteClient = sanityWriteToken ? createClient({
  ...sanityClientConfig,
  token: sanityWriteToken,
  useCdn: false, // Mutations should not use CDN
}) : undefined; // If no token, write client is undefined. Handle this in usage.

if (!sanityWriteToken) {
  console.warn("Warning: SANITY_API_TOKEN is not set. Product enquiry submissions to Sanity will not work.");
}
