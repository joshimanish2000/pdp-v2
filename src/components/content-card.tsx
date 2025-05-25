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

interface ContentCardProps {
  item: ContentItem;
  imageHint?: string;
}

const imageHintsPool = ["abstract texture", "nature landscape", "city scape", "tech device", "art design", "food meal", "travel destination", "office work", "people community", "sports fitness"];


export default function ContentCard({ item }: ContentCardProps) {
  const [isSummarizeDialogOpen, setIsSummarizeDialogOpen] = useState(false);

  const contentToSummarize = `${item.title}\n\n${item.excerpt || ''}`;
  
  // Generate a consistent hint based on item ID or title to vary placeholders
  const getConsistentHint = (itemId: string) => {
    let hash = 0;
    for (let i = 0; i < itemId.length; i++) {
      const char = itemId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0; // Convert to 32bit integer
    }
    return imageHintsPool[Math.abs(hash) % imageHintsPool.length];
  };
  const imageHint = getConsistentHint(item._id);

  return (
    <>
      <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out bg-card">
        <CardHeader>
          {item.mainImage?.asset.url && (
            <div className="relative w-full h-48 mb-4 rounded-t-lg overflow-hidden">
              <Image
                src={`${item.mainImage.asset.url}?txt=${encodeURIComponent(item.title.substring(0,20))}&txtclr=FFFFFF&txtalign=center,middle&w=600&h=400`}
                alt={item.title || 'Content image'}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                data-ai-hint={imageHint}
              />
            </div>
          )}
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
            {format(new Date(item._createdAt), 'MMM d, yyyy')}
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
