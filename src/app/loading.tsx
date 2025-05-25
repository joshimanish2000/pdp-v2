import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center bg-background text-foreground">
      <Loader2 className="h-16 w-16 animate-spin text-primary" />
      <p className="mt-4 text-lg text-muted-foreground">Loading Sanity Stream...</p>
    </div>
  );
}
