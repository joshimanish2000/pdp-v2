
"use client";

import type { ContentItem } from '@/types/sanity';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Sparkles } from 'lucide-react';
import { useState } from 'react';
import SummarizeDialog from './summarize-dialog';
import { format } from 'date-fns';
import { urlFor } from '@/lib/sanityClientConfig'; // Import urlFor

interface ContentCardProps {
  item: ContentItem;
}

export default function ContentCard({ item }: ContentCardProps) {
  const [isSummarizeDialogOpen, setIsSummarizeDialogOpen] = useState(false);

  const contentToSummarize = `${item.title}\n\n${item.excerpt || ''}`;
  
  const imageUrl = item.mainImage ? urlFor(item.mainImage).width(600).height(400).url() : `https://placehold.co/600x400.png?text=No+Image`;
  const imageAltText = item.title || 'Content image';

  return (
    <>
      <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out bg-card">
        <CardHeader>
          {/* Use a div for aspect ratio if mainImage might be missing */}
          <div className="relative w-full h-48 mb-4 rounded-t-lg overflow-hidden bg-muted">
            <Image
              src={imageUrl}
              alt={imageAltText}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={item.category?.toLowerCase() || "article"} // Use category as a hint or a default
            />
          </div>
          <CardTitle className="text-xl font-semibold leading-tight">{item.title}</CardTitle>
          {item.category && (
            <Badge variant="secondary" className="mt-1 w-fit">{item.category}</Badge>
          )}
        </CardHeader>
        <CardContent className="flex-grow">
          <CardDescription className="text-muted-foreground line-clamp-3">
            {item.excerpt}
          </CardDescription>
          <div className="text-xs text-muted-foreground mt-3 flex items-center">
            <CalendarDays className="h-3.5 w-3.5 mr-1.5" />
            {item._createdAt ? format(new Date(item._createdAt), 'MMM d, yyyy') : 'Date not available'}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            variant="default"
            size="sm"
            onClick={() => setIsSummarizeDialogOpen(true)}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Summarize with AI
          </Button>
        </CardFooter>
      </Card>
      <SummarizeDialog
        isOpen={isSummarizeDialogOpen}
        onOpenChange={setIsSummarizeDialogOpen}
        title={item.title}
        contentToSummarize={contentToSummarize}
      />
    </>
  );
}
