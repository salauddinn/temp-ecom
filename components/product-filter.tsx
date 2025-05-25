"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { X, Filter, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { FilterOptions } from '@/lib/types';

interface ProductFilterProps {
  filterOptions: FilterOptions;
  selectedCategories: string[];
  selectedBrands: string[];
  selectedPriceRange: [number, number];
  selectedRating: number;
  onFilterChange: (
    type: 'categories' | 'brands' | 'priceRange' | 'rating',
    value: string[] | [number, number] | number
  ) => void;
  onClearFilters: () => void;
}

export function ProductFilter({
  filterOptions,
  selectedCategories,
  selectedBrands,
  selectedPriceRange,
  selectedRating,
  onFilterChange,
  onClearFilters,
}: ProductFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);
  
  const totalFiltersApplied = selectedCategories.length + 
    selectedBrands.length + 
    (selectedPriceRange[0] > filterOptions.priceRange.min || 
     selectedPriceRange[1] < filterOptions.priceRange.max ? 1 : 0) + 
    (selectedRating > 0 ? 1 : 0);
  
  const FilterContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Filters</h3>
        {totalFiltersApplied > 0 && (
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            Clear all
          </Button>
        )}
      </div>
      
      <ScrollArea className="flex-1 pr-4">
        {/* Categories Filter */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium">Categories</h4>
            <ChevronDown className="h-4 w-4" />
          </div>
          <div className="space-y-2">
            {filterOptions.categories.map((category) => {
              // Handle both string and object category types
              const categoryId = typeof category === 'string' ? category : category.id;
              const categoryName = typeof category === 'string' ? category : category.name;
              const displayName = categoryName.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ');
              
              return (
                <div key={categoryId} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${categoryId}`}
                    checked={selectedCategories.includes(categoryId)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        onFilterChange('categories', [...selectedCategories, categoryId]);
                      } else {
                        onFilterChange(
                          'categories',
                          selectedCategories.filter((c) => c !== categoryId)
                        );
                      }
                    }}
                  />
                  <Label
                    htmlFor={`category-${categoryId}`}
                    className="text-sm capitalize cursor-pointer"
                  >
                    {displayName}
                  </Label>
                </div>
              );
            })}
          </div>
        </div>
        
        <Separator className="my-4" />
        
        {/* Brands Filter */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium">Brands</h4>
            <ChevronDown className="h-4 w-4" />
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {filterOptions.brands.map((brand) => (
              <div key={brand} className="flex items-center space-x-2">
                <Checkbox
                  id={`brand-${brand}`}
                  checked={selectedBrands.includes(brand)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onFilterChange('brands', [...selectedBrands, brand]);
                    } else {
                      onFilterChange(
                        'brands',
                        selectedBrands.filter((b) => b !== brand)
                      );
                    }
                  }}
                />
                <Label
                  htmlFor={`brand-${brand}`}
                  className="text-sm cursor-pointer"
                >
                  {brand}
                </Label>
              </div>
            ))}
          </div>
        </div>
        
        <Separator className="my-4" />
        
        {/* Price Range Filter */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium">Price Range</h4>
          </div>
          <div className="px-2 pt-6 pb-2">
            <Slider
              defaultValue={[filterOptions.priceRange.min, filterOptions.priceRange.max]}
              min={filterOptions.priceRange.min}
              max={filterOptions.priceRange.max}
              step={10}
              value={[selectedPriceRange[0], selectedPriceRange[1]]}
              onValueChange={(value) => onFilterChange('priceRange', [value[0], value[1]])}
              className="mb-4"
            />
            <div className="flex items-center justify-between">
              <span className="text-sm">${selectedPriceRange[0]}</span>
              <span className="text-sm">${selectedPriceRange[1]}</span>
            </div>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        {/* Rating Filter */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium">Rating</h4>
          </div>
          <div className="space-y-2">
            {[4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <Checkbox
                  id={`rating-${rating}`}
                  checked={selectedRating === rating}
                  onCheckedChange={(checked) => {
                    onFilterChange('rating', checked ? rating : 0);
                  }}
                />
                <Label
                  htmlFor={`rating-${rating}`}
                  className="text-sm flex items-center cursor-pointer"
                >
                  {rating}+ {Array(rating).fill('★').join('')}
                  {Array(5 - rating).fill('☆').join('')}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
      
      {isMobile && (
        <div className="mt-auto pt-4 border-t">
          <Button 
            className="w-full" 
            onClick={() => setIsOpen(false)}
          >
            Apply Filters ({totalFiltersApplied})
          </Button>
        </div>
      )}
    </div>
  );

  // Mobile view uses a sheet
  if (isMobile) {
    return (
      <div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="mb-4">
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {totalFiltersApplied > 0 && (
                <span className="ml-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {totalFiltersApplied}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <FilterContent />
          </SheetContent>
        </Sheet>
      </div>
    );
  }
  
  // Desktop view shows the filters in the sidebar
  return (
    <aside className="w-full md:w-64">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <Filter className="h-5 w-5 mr-2" /> Filters
        {totalFiltersApplied > 0 && (
          <span className="ml-2 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
            {totalFiltersApplied}
          </span>
        )}
      </h2>
      <FilterContent />
    </aside>
  );
}