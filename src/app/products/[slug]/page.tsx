import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Share2, Heart, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductEnquiryForm from "@/components/product-enquiry-form";
import type { Product } from "@/types/sanity";
import { fetchProductBySlug } from "@/lib/sanityClient";
import { urlFor } from "@/lib/sanityClientConfig";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

type ProductPageProps = {
  params: Promise<{
    // params is now a Promise
    slug: string;
  }>;
};

export default async function ProductDetailsPage({
  params: paramsPromise,
}: ProductPageProps) {
  const params = await paramsPromise; // Await the params Promise
  const { slug } = params; // Access slug from the resolved params
  const product = await fetchProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const productImageUrl = product.mainImage
    ? urlFor(product.mainImage).width(800).height(600).url()
    : `https://placehold.co/800x600.png?text=No+Image`;
  const productImageAlt = product.name || "Product image";

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-neutral-900">
      {/* Page-specific Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" passHref>
            <Button variant="outline" size="icon" aria-label="Back to homepage">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              aria-label="Share this product"
            >
              <Share2 className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" aria-label="Add to favorites">
              <Heart className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Left Column: Image and Details */}
          <div className="lg:col-span-3 space-y-8">
            <Card className="overflow-hidden shadow-xl">
              <div className="relative w-full aspect-[4/3] bg-muted">
                <Image
                  src={productImageUrl}
                  alt={productImageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 800px"
                  className="object-cover transition-transform duration-300 hover:scale-105"
                  data-ai-hint={product.imageHint || "product item"}
                  priority
                />
              </div>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">About {product.name}</CardTitle>
                {product.category && (
                  <Badge variant="secondary" className="w-fit mt-1">
                    {product.category}
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="prose prose-sm sm:prose dark:prose-invert max-w-none text-muted-foreground">
                {product.description && (
                  <p className="lead mb-4">{product.description}</p>
                )}
                {/* TODO: Implement Portable Text rendering if product.details is Portable Text */}
                {typeof product.details === "string" ? (
                  <p>{product.details}</p>
                ) : product.details ? (
                  <p>
                    Further details available. (Structured content rendering not
                    yet implemented)
                  </p>
                ) : (
                  <p>No additional details provided for this product.</p>
                )}
                {product.price && (
                  <p className="text-2xl font-bold text-primary mt-4">
                    Price: ${product.price.toFixed(2)}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Enquiry Form */}
          <div className="lg:col-span-2">
            <Card className="sticky top-24 shadow-xl">
              {" "}
              {/* Sticky form for desktop */}
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <Package className="mr-2 h-6 w-6 text-primary" />
                  Enquire about {product.name}
                </CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProductEnquiryForm productName={product.name} />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Page-specific Footer */}
      <footer className="bg-muted/50 border-t text-secondary-foreground py-8 text-center mt-auto">
        <div className="container mx-auto px-4">
          {product.buyNowUrl && (
            <Link
              href={product.buyNowUrl}
              passHref
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                variant="default"
                className="mb-6 shadow-md hover:shadow-lg transition-shadow"
              >
                Buy Product
              </Button>
            </Link>
          )}
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Sanity Stream Inc. All rights
            reserved.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Empowering Your Digital Experience
          </p>
        </div>
      </footer>
    </div>
  );
}

export async function generateMetadata({
  params: paramsPromise,
}: ProductPageProps) {
  const params = await paramsPromise; // Await the params Promise
  const product = await fetchProductBySlug(params.slug); // Use params.slug after awaiting
  if (!product) {
    return {
      title: "Product Not Found",
    };
  }
  return {
    title: `${product.name} | Product Details`,
    description: product.description || `Details about ${product.name}`,
  };
}
