"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/ui/product-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ProductFilter } from '@/components/product-filter';
import { Product, FilterOptions, SortOptions } from '@/lib/types';
import { Search } from 'lucide-react';
import { searchProducts } from '@/lib/api';

interface ProductsClientProps {
  initialProducts: Product[];
  categories: string[];
  brands: string[];
  priceRange: {
    min: number;
    max: number;
  };
  searchParams: {
    search?: string;
    category?: string;
    brand?: string;
    sort?: string;
    page?: string;
  };
}

const SORT_OPTIONS: SortOptions = [
  { id: 'relevance', name: 'Relevance' },
  { id: 'price-asc', name: 'Price: Low to High' },
  { id: 'price-desc', name: 'Price: High to Low' },
  { id: 'rating-desc', name: 'Rating: High to Low' },
  { id: 'newest', name: 'Newest First' },
];

const ITEMS_PER_PAGE = 12;

export function ProductsClient({
  initialProducts,
  categories,
  brands,
  priceRange,
  searchParams,
}: ProductsClientProps) {
  const router = useRouter();
  const queryParams = useSearchParams();
  
  // Search state
  const [searchQuery, setSearchQuery] = useState(searchParams.search || '');
  
  // Filter state
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.category ? [searchParams.category] : []
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    searchParams.brand ? [searchParams.brand] : []
  );
  const [selectedPriceRange, setSelectedPriceRange] = useState<[number, number]>([
    priceRange.min,
    priceRange.max,
  ]);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  
  // Sorting state
  const [sortOption, setSortOption] = useState<string>(searchParams.sort || 'relevance');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(searchParams.page ? parseInt(searchParams.page) : 1);
  
  // Filtered and sorted products
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  
  // Filter options object
  const filterOptions: FilterOptions = {
    categories,
    brands,
    priceRange,
    rating: 5,
  };

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...initialProducts];
    
    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
      );
    }
    
    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) =>
        selectedCategories.includes(product.category)
      );
    }
    
    // Filter by brands
    if (selectedBrands.length > 0) {
      filtered = filtered.filter((product) =>
        selectedBrands.includes(product.brand)
      );
    }
    
    // Filter by price range
    filtered = filtered.filter(
      (product) =>
        product.price >= selectedPriceRange[0] && product.price <= selectedPriceRange[1]
    );
    
    // Filter by rating
    if (selectedRating > 0) {
      filtered = filtered.filter((product) => product.rating >= selectedRating);
    }
    
    // Sort products
    switch (sortOption) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => b.id - a.id);
        break;
      default:
        // Relevance is the default
        break;
    }
    
    setFilteredProducts(filtered);
    setTotalPages(Math.ceil(filtered.length / ITEMS_PER_PAGE));
    
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [
    initialProducts,
    searchQuery,
    selectedCategories,
    selectedBrands,
    selectedPriceRange,
    selectedRating,
    sortOption,
  ]);
  
  // Update displayed products based on pagination
  useEffect(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setDisplayedProducts(filteredProducts.slice(startIndex, endIndex));
  }, [filteredProducts, currentPage]);
  
  const handleFilterChange = (
    type: 'categories' | 'brands' | 'priceRange' | 'rating',
    value: string[] | [number, number] | number
  ) => {
    switch (type) {
      case 'categories':
        setSelectedCategories(value as string[]);
        break;
      case 'brands':
        setSelectedBrands(value as string[]);
        break;
      case 'priceRange':
        setSelectedPriceRange(value as [number, number]);
        break;
      case 'rating':
        setSelectedRating(value as number);
        break;
    }
  };
  
  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedPriceRange([priceRange.min, priceRange.max]);
    setSelectedRating(0);
    router.push('/products');
  };
  
  const handleSortChange = (value: string) => {
    setSortOption(value);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchQuery);
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container px-4 mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      
      {/* Mobile Search */}
      <div className="md:hidden mb-6">
        <form onSubmit={handleSearch}>
          <div className="relative">
            <Input
              type="text"
              placeholder="Search products..."
              className="pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters */}
        <ProductFilter
          filterOptions={filterOptions}
          selectedCategories={selectedCategories}
          selectedBrands={selectedBrands}
          selectedPriceRange={selectedPriceRange}
          selectedRating={selectedRating}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />
        
        {/* Product Grid */}
        <div className="flex-1">
          {/* Sort and Results Count */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <p className="text-muted-foreground">
              Showing <span className="font-medium">{filteredProducts.length}</span> results
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <Select value={sortOption} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Relevance" />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Products */}
          {displayedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">No products found.</p>
              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="mt-4"
              >
                Clear Filters
              </Button>
            </div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum = i + 1;
                  
                  // Adjust for more than 5 pages
                  if (totalPages > 5) {
                    if (currentPage > 3 && currentPage < totalPages - 1) {
                      pageNum = currentPage - 2 + i;
                    } else if (currentPage >= totalPages - 1) {
                      pageNum = totalPages - 4 + i;
                    }
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}