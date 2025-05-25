import React from 'react';
import { getProducts, getCategories } from '@/lib/api';
import { ProductsClient } from './products-client';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { 
    search?: string;
    category?: string;
    brand?: string;
    sort?: string;
    page?: string;
  };
}) {
  // Get all products and categories
  const productsResponse = await getProducts(100);
  const categories = await getCategories();
  
  // Extract unique brands from products
  const brands = Array.from(
    new Set(productsResponse.products.map(product => product.brand))
  );
  
  // Get min and max prices
  const prices = productsResponse.products.map(product => product.price);
  const minPrice = Math.floor(Math.min(...prices));
  const maxPrice = Math.ceil(Math.max(...prices));
  
  return (
    <ProductsClient
      initialProducts={productsResponse.products}
      categories={categories}
      brands={brands}
      priceRange={{ min: minPrice, max: maxPrice }}
      searchParams={searchParams}
    />
  );
}