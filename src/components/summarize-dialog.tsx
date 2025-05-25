"use client";

import { useState, useEffect } from 'react';
import { summarizeContent, type SummarizeContentInput, type SummarizeContentOutput } from '@/ai/flows/summarize-content';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Loader2, AlertTriangle, Sparkles } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface SummarizeDialogProps {
  contentToSummarize: string;
  title: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SummarizeDialog({
  contentToSummarize,
  title,
  isOpen,
  onOpenChange,
}: SummarizeDialogProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && contentToSummarize) {
      fetchSummary();
    } else {
      // Reset state when dialog is closed or content is not available
      setSummary(null);
      setError(null);
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, contentToSummarize]);

  const fetchSummary = async () => {
    setIsLoading(true);
    setError(null);
    setSummary(null);
    try {
      const input: SummarizeContentInput = { content: contentToSummarize };
      const result: SummarizeContentOutput = await summarizeContent(input);
      setSummary(result.summary);
    } catch (e) {
      console.error("Failed to summarize content:", e);
      setError("Failed to generate summary. Please try again later.");
      toast({
        variant: "destructive",
        title: "Summarization Error",
        description: "Could not generate summary for the content.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] bg-card">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Sparkles className="h-6 w-6 mr-2 text-accent" />
            AI Summary for: {title}
          </DialogTitle>
          <DialogDescription>
            A concise AI-generated summary of the content.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 min-h-[150px] max-h-[40vh] overflow-y-auto">
          {isLoading && (
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-3" />
              <p>Generating summary...</p>
            </div>
          )}
          {error && (
            <div className="flex flex-col items-center justify-center text-destructive">
              <AlertTriangle className="h-12 w-12 mb-3" />
              <p>{error}</p>
            </div>
          )}
          {summary && <p className="text-foreground whitespace-pre-wrap">{summary}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {error && !isLoading && (
             <Button onClick={fetchSummary} className="bg-primary hover:bg-primary/90">
                Try Again
             </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
