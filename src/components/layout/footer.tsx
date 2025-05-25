export default function AppFooter() {
  return (
    <footer className="bg-secondary text-secondary-foreground py-6 text-center mt-auto">
      <div className="container mx-auto px-4">
        <p>&copy; {new Date().getFullYear()} Sanity Stream. All rights reserved.</p>
        <p className="text-sm text-muted-foreground mt-1">Powered by Next.js & Sanity</p>
      </div>
    </footer>
  );
}
