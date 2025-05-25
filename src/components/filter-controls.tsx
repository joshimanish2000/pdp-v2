"use client";

import type { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, ListFilter } from 'lucide-react';

interface FilterControlsProps {
  categories: string[];
  selectedCategory: string;
  searchTerm: string;
  onCategoryChange: (category: string) => void;
  onSearchTermChange: (term: string) => void;
}

export default function FilterControls({
  categories,
  selectedCategory,
  searchTerm,
  onCategoryChange,
  onSearchTermChange,
}: FilterControlsProps) {
  return (
    <div className="mb-8 p-6 bg-card rounded-lg shadow-md flex flex-col md:flex-row gap-6 items-center">
      <div className="flex-1 w-full md:w-auto">
        <Label htmlFor="category-filter" className="mb-2 flex items-center text-muted-foreground">
          <ListFilter className="h-4 w-4 mr-2" />
          Filter by Category
        </Label>
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger id="category-filter" className="w-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1 w-full md:w-auto">
        <Label htmlFor="search-filter" className="mb-2 flex items-center text-muted-foreground">
          <Search className="h-4 w-4 mr-2" />
          Search Content
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            id="search-filter"
            type="text"
            placeholder="Search by title or excerpt..."
            value={searchTerm}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onSearchTermChange(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
      </div>
    </div>
  );
}
