"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ui/product-card';
import { useCart } from '@/context/CartContext';
import { Product } from '@/lib/types';
import { getProductById } from '@/lib/api';

export default function WishlistPage() {
  const { wishlist, toggleWishlist } = useCart();
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch wishlist products
  useEffect(() => {
    const fetchWishlistProducts = async () => {
      setLoading(true);
      
      try {
        const products = await Promise.all(
          wishlist.map((id) => getProductById(id))
        );
        
        // Filter out null products (in case some failed to fetch)
        setWishlistProducts(products.filter((p): p is Product => p !== null));
      } catch (error) {
        console.error('Error fetching wishlist products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (wishlist.length > 0) {
      fetchWishlistProducts();
    } else {
      setWishlistProducts([]);
      setLoading(false);
    }
  }, [wishlist]);
  
  if (loading) {
    return (
      <div className="container px-4 mx-auto py-16 text-center">
        <p>Loading your wishlist...</p>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="container px-4 mx-auto py-16">
        <div className="max-w-md mx-auto text-center">
          <Heart className="w-16 h-16 mx-auto mb-6 text-muted-foreground" />
          <h1 className="text-3xl font-bold mb-4">Your wishlist is empty</h1>
          <p className="text-muted-foreground mb-8">
            You haven't added any products to your wishlist yet.
          </p>
          <Button asChild>
            <Link href="/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Your Wishlist</h1>
      
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">
            {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              wishlist.forEach((id) => toggleWishlist(id));
            }}
          >
            Clear All
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <Button asChild>
          <Link href="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Link>
        </Button>
      </div>
    </div>
  );
}