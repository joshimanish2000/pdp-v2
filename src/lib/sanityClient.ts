import type { ContentItem } from '@/types/sanity';

export const MOCK_CATEGORIES = ['Technology', 'Science', 'Art', 'Lifestyle', 'Travel', 'Business', 'Health'];

const MOCK_CONTENT_ITEMS_STORE: ContentItem[] = Array.from({ length: 12 }, (_, i) => ({
  _id: `mock-${i + 1}`,
  _type: 'post',
  _createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
  _updatedAt: new Date(Date.now() - Math.random() * 1000000000).toISOString(),
  _rev: `rev-${i + 1}`,
  title: `Exploring ${MOCK_CATEGORIES[i % MOCK_CATEGORIES.length]} Trends ${i + 1}`,
  slug: { current: `exploring-${MOCK_CATEGORIES[i % MOCK_CATEGORIES.length].toLowerCase()}-trends-${i + 1}` },
  excerpt: `This is a short excerpt for the content item about ${MOCK_CATEGORIES[i % MOCK_CATEGORIES.length]} trends, number ${i + 1}. It gives a brief overview of what the content is about, perfect for a quick read.`,
  mainImage: {
    asset: {
      url: `https://placehold.co/600x400.png`, // Generic placeholder, specific text will be added by component or varied based on content
    },
  },
  category: MOCK_CATEGORIES[i % MOCK_CATEGORIES.length],
  body: [
    { _type: 'block', children: [{ _type: 'span', text: `Full body content for mock item ${i + 1} focusing on ${MOCK_CATEGORIES[i % MOCK_CATEGORIES.length]}. This section would typically contain rich text, images, and other embedded content managed in Sanity.` }] },
    { _type: 'block', children: [{ _type: 'span', text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.` }] }
  ],
}));

export async function fetchContentItems(filter?: { category?: string; searchTerm?: string }): Promise<ContentItem[]> {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay

  let items = [...MOCK_CONTENT_ITEMS_STORE];

  if (filter?.category && filter.category !== 'all') {
    items = items.filter(item => item.category === filter.category);
  }

  if (filter?.searchTerm) {
    const searchTermLower = filter.searchTerm.toLowerCase();
    items = items.filter(item =>
      item.title.toLowerCase().includes(searchTermLower) ||
      (item.excerpt && item.excerpt.toLowerCase().includes(searchTermLower))
    );
  }
  
  return items.sort((a, b) => new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime());
}

export async function fetchCategories(): Promise<string[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return ['all', ...MOCK_CATEGORIES];
}

// Simulate real-time updates
export function subscribeToContentUpdates(callback: (newItem: ContentItem) => void): () => void {
  const intervalId = setInterval(() => {
    const newIdSuffix = MOCK_CONTENT_ITEMS_STORE.length + 1 + Math.floor(Math.random() * 100);
    const newCategoryIndex = Math.floor(Math.random() * MOCK_CATEGORIES.length);
    const newCategory = MOCK_CATEGORIES[newCategoryIndex];
    const newItem: ContentItem = {
      _id: `mock-new-${newIdSuffix}`,
      _type: 'post',
      _createdAt: new Date().toISOString(),
      _updatedAt: new Date().toISOString(),
      _rev: `rev-new-${newIdSuffix}`,
      title: `Real-time Update: ${newCategory} News ${newIdSuffix}`,
      slug: { current: `real-time-update-${newCategory.toLowerCase()}-news-${newIdSuffix}` },
      excerpt: `This brand new item about ${newCategory} was just added in real-time, showcasing dynamic content updates.`,
      mainImage: {
        asset: {
          url: `https://placehold.co/600x400.png`,
        },
      },
      category: newCategory,
      body: [{ _type: 'block', children: [{ _type: 'span', text: `This is the full body content for the newly added item ${newIdSuffix}.` }] }],
    };
    
    MOCK_CONTENT_ITEMS_STORE.unshift(newItem); // Add to the "database"
    callback(newItem); // Notify subscribers
  }, 15000); // Add a new item every 15 seconds

  return () => clearInterval(intervalId);
}
