export interface SanityDocument {
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
}

export interface ContentItem extends SanityDocument {
  title: string;
  slug: { current: string };
  excerpt?: string;
  mainImage?: any; // Sanity image asset reference, to be processed by urlFor
  category?: string;
  body?: any; // Represents Portable Text or similar rich text structure
}

export interface Product extends SanityDocument {
  name: string;
  slug: { current: string };
  description?: string;
  mainImage?: any; // Sanity image asset reference
  imageHint?: string; // For data-ai-hint
  details?: any; // Could be Portable Text or markdown string
  price?: number;
  category?: string;
  buyNowUrl?: string; // URL for the "Buy Product" button
}

// Optional: Define a more specific type for Sanity image assets if needed
// export interface SanityImageAssetReference {
//   _type: 'image';
//   asset: {
//     _ref: string;
//     _type: 'reference';
//   };
//   [key: string]: any; // For other image fields like alt, caption, hotspot, crop
// }
