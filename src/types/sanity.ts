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
  mainImage?: {
    asset: {
      url: string;
      // alt text will be handled in component or derived
    };
  };
  category?: string;
  body?: any; // Represents Portable Text or similar rich text structure
}
