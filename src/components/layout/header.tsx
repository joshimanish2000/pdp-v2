import { Zap } from 'lucide-react';
import Link from 'next/link';

export default function AppHeader() {
  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
          <Zap className="h-8 w-8 text-accent" />
          Sanity Stream
        </Link>
        {/* Navigation can be added here if needed */}
      </div>
    </header>
  );
}
