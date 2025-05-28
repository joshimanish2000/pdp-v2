
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
  const [sanityConnectionFailed, setSanityConnectionFailed] = useState<boolean>(false);
  const { toast } = useToast();

  const loadContent = useCallback(async (category: string, term: string) => {
    setIsLoading(true);
    setError(null); // Clear previous errors for this specific load attempt
    try {
      const items = await fetchContentItems({ category, searchTerm: term });
      setContentItems(items);
    } catch (e) {
      console.error("Failed to fetch content:", e);
      const errorMessage = e instanceof Error ? e.message : "Could not load content. Please try refreshing the page.";
      setError(errorMessage);
       toast({
        variant: "destructive",
        title: "Error Loading Content",
        description: "There was an issue fetching the latest content. Check Sanity configuration and network.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    async function loadInitialData() {
      setIsLoading(true);
      setError(null);
      setSanityConnectionFailed(false); // Assume connection is fine initially
      try {
        const categories = await fetchCategories();
        setAllCategories(categories);
        await loadContent('all', ''); // Load initial content
        // If we reach here, initial load was successful
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "Failed to load initial page data.";
        setError(`${errorMessage} Please check your Sanity configuration (Project ID, Dataset, CORS) and network connection.`);
        setSanityConnectionFailed(true); // Mark connection as failed
        toast({
            variant: "destructive",
            title: "Error Loading Page Data",
            description: "Could not load essential data. Check Sanity setup and network.",
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadInitialData();
  }, [loadContent, toast]); // loadContent and toast are stable due to useCallback/hook

  useEffect(() => {
    if (!sanityConnectionFailed) { // Only load if initial connection didn't fail
      loadContent(selectedCategory, searchTerm);
    }
  }, [selectedCategory, searchTerm, loadContent, sanityConnectionFailed]);

  const handleNewItem = useCallback((newItem: ContentItem) => {
    console.log("New item received via subscription:", newItem);
    setContentItems(prevItems => {
      if (prevItems.find(item => item._id === newItem._id)) {
        return prevItems;
      }

      const newItemMatchesFilters =
        (selectedCategory === 'all' || (newItem.category && newItem.category.toLowerCase() === selectedCategory.toLowerCase())) &&
        (!searchTerm ||
          newItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (newItem.excerpt && newItem.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
        );

      if (newItemMatchesFilters) {
        setTimeout(() => {
          toast({
            title: "New Content Added!",
            description: `"${newItem.title}" is now available.`,
          });
        }, 0);
        return [newItem, ...prevItems].sort((a, b) => new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime());
      }
      return prevItems;
    });
  }, [selectedCategory, searchTerm, toast]); // setContentItems is stable

  useEffect(() => {
    if (sanityConnectionFailed) { // Do not subscribe if initial connection failed
      return;
    }

    const isSanityConfigured = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== 'mockProjectId';
    if (isSanityConfigured) {
      // Toast for initial subscription activation only once
      // This toast could be moved to loadInitialData success if preferred
    }

    const unsubscribe = subscribeToContentUpdates(handleNewItem);

    return () => {
      unsubscribe();
    };
  }, [sanityConnectionFailed, toast, handleNewItem]);


  useEffect(() => {
    const animationStyles = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fadeIn {
        animation: fadeIn 0.5s ease-out forwards;
      }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = animationStyles;
    document.head.appendChild(styleSheet);

    return () => {
      if (document.head.contains(styleSheet)) {
        document.head.removeChild(styleSheet);
      }
    };
  }, []);


  if (error && contentItems.length === 0 && !isLoading) {
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
        disabled={sanityConnectionFailed} // Optionally disable filter controls
      />

      {isLoading && contentItems.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
          <p className="text-lg">Loading content...</p>
        </div>
      )}

      {error && (contentItems.length > 0 || isLoading) && ( // Inline error if some content is shown or still loading
         <Alert variant="destructive" className="my-4">
            <Info className="h-4 w-4" />
            <AlertTitle>Update Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
      )}

      {!isLoading && !error && contentItems.length === 0 && !sanityConnectionFailed && (
         <Alert className="mt-10">
            <Info className="h-4 w-4" />
            <AlertTitle>No Content Found</AlertTitle>
            <AlertDescription>
              There are no items matching your current filters. Try adjusting your search or category.
            </AlertDescription>
          </Alert>
      )}
      
      {/* Message if connection failed and no items loaded */}
      {sanityConnectionFailed && contentItems.length === 0 && !isLoading && (
           <Alert variant="destructive" className="mt-10">
           <Info className="h-4 w-4" />
           <AlertTitle>Connection Failed</AlertTitle>
           <AlertDescription>
             Could not connect to Sanity to load content. Please check your setup and try refreshing.
             Filtering and real-time updates are currently disabled.
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

      {isLoading && contentItems.length > 0 && (
        <div className="flex items-center justify-center py-6 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
          <span>Updating content...</span>
        </div>
      )}
    </div>
  );
}
