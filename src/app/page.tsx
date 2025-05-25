
"use client";

import { useEffect, useState, useCallback } from 'react';
import type { ContentItem } from '@/types/sanity';
import { fetchContentItems, fetchCategories, subscribeToContentUpdates } from '@/lib/sanityClient';
import ContentCard from '@/components/content-card';
import FilterControls from '@/components/filter-controls';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function HomePage() {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadContent = useCallback(async (category: string, term: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const items = await fetchContentItems({ category, searchTerm: term });
      setContentItems(items);
    } catch (e) {
      console.error("Failed to fetch content:", e);
      setError("Could not load content. Please try refreshing the page.");
       toast({
        variant: "destructive",
        title: "Error Loading Content",
        description: "There was an issue fetching the latest content.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    async function loadInitialData() {
      try {
        const categories = await fetchCategories();
        setAllCategories(categories);
        await loadContent('all', '');
      } catch (e) {
        setError("Failed to load initial page data.");
      }
    }
    loadInitialData();
  }, [loadContent]);

  useEffect(() => {
    loadContent(selectedCategory, searchTerm);
  }, [selectedCategory, searchTerm, loadContent]);

  useEffect(() => {
    // Toast for initial subscription activation
    toast({
      title: "Real-time Updates Active",
      description: "New content will appear automatically.",
    });

    // Call subscribeToContentUpdates and store its returned unsubscribe function
    const cleanupSubscription = subscribeToContentUpdates((newItem) => {
      // This is the callback for each new item
      console.log("New item received via subscription:", newItem);
      setContentItems(prevItems => {
        // Avoid duplicates if item already exists
        if (prevItems.find(item => item._id === newItem._id)) {
          return prevItems;
        }
        
        const newItemMatchesFilters = 
          (selectedCategory === 'all' || newItem.category === selectedCategory) &&
          (!searchTerm || newItem.title.toLowerCase().includes(searchTerm.toLowerCase()) || (newItem.excerpt && newItem.excerpt.toLowerCase().includes(searchTerm.toLowerCase())));

        if (newItemMatchesFilters) {
            toast({
              title: "New Content Added!",
              description: `"${newItem.title}" is now available.`,
            });
            return [newItem, ...prevItems].sort((a, b) => new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime());
        }
        return prevItems; 
      });
    }); // subscribeToContentUpdates call ends here. cleanupSubscription holds the function to call.

    // Return the actual cleanup function for useEffect
    return () => {
      cleanupSubscription(); 
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, searchTerm, toast]); // Dependencies for useEffect

  useEffect(() => {
    // Simple fade-in animation for page load
    const animationStyles = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fadeIn {
        animation: fadeIn 0.5s ease-out forwards;
      }
    `;

    // Inject animation styles
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = animationStyles;
    document.head.appendChild(styleSheet);

    return () => {
      // Cleanup: remove the stylesheet when the component unmounts
      if (document.head.contains(styleSheet)) {
        document.head.removeChild(styleSheet);
      }
    };
  }, []); // Empty dependency array ensures this runs once on mount


  if (error && contentItems.length === 0) { // Show full page error only if no content is loaded
    return (
      <Alert variant="destructive" className="mt-10">
        <Info className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="animate-fadeIn">
      <FilterControls
        categories={allCategories}
        selectedCategory={selectedCategory}
        searchTerm={searchTerm}
        onCategoryChange={setSelectedCategory}
        onSearchTermChange={setSearchTerm}
      />

      {isLoading && contentItems.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
          <p className="text-lg">Loading content...</p>
        </div>
      )}

      {!isLoading && contentItems.length === 0 && (
         <Alert className="mt-10">
            <Info className="h-4 w-4" />
            <AlertTitle>No Content Found</AlertTitle>
            <AlertDescription>
              There are no items matching your current filters. Try adjusting your search or category.
            </AlertDescription>
          </Alert>
      )}

      {contentItems.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {contentItems.map((item) => (
            <ContentCard key={item._id} item={item} />
          ))}
        </div>
      )}
       {/* Show a subtle loading indicator when re-filtering/loading more but some content is already visible */}
      {isLoading && contentItems.length > 0 && (
        <div className="flex items-center justify-center py-6 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
          <span>Updating content...</span>
        </div>
      )}
    </div>
  );
}
