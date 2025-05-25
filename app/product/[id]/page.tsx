import React from 'react';
import { getProductById, getProducts } from '@/lib/api';
import { ProductDetails } from './product-details';
import { Product } from '@/lib/types';
import { notFound } from 'next/navigation';

// Generate static params for the first 30 products
export async function generateStaticParams() {
  const productsResponse = await getProducts(30);
  return productsResponse.products.map((product) => ({
    id: product.id.toString(),
  }));
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const productId = parseInt(params.id);
  const product = await getProductById(productId);
  
  if (!product) {
    return notFound();
  }

  // Fetch similar products from same category
  const similarProductsResponse = await getProducts(6);
  const similarProducts = similarProductsResponse.products
    .filter((p: Product) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return <ProductDetails product={product} similarProducts={similarProducts} />;
}