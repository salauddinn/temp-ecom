"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Product } from '@/lib/types';
import { calculateDiscountedPrice, formatPrice, formatDiscountPercentage } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
  featured?: boolean;
}

export function ProductCard({ product, featured = false }: ProductCardProps) {
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const isWishlisted = wishlist.includes(product.id);

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const discountedPrice = calculateDiscountedPrice(product.price, product.discountPercentage);

  return (
    <Card className={`overflow-hidden h-full transition-all duration-300 hover:shadow-lg ${featured ? 'lg:flex' : ''}`}>
      <div className={`relative ${featured ? 'lg:w-1/2' : 'w-full'}`}>
        <Link href={`/product/${product.id}`} className="block">
          <div className="relative w-full aspect-square overflow-hidden group">
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {product.discountPercentage > 0 && (
              <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground">
                {formatDiscountPercentage(product.discountPercentage)}
              </Badge>
            )}
            <button
              onClick={handleToggleWishlist}
              className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
            >
              <Heart
                className={`h-5 w-5 ${isWishlisted ? 'fill-destructive text-destructive' : 'text-muted-foreground'}`}
              />
            </button>
          </div>
        </Link>
      </div>
      <div className={`flex flex-col ${featured ? 'lg:w-1/2' : 'w-full'}`}>
        <CardContent className={`flex-grow p-4 ${featured ? 'lg:p-6' : ''}`}>
          <Link href={`/product/${product.id}`} className="block">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-lg hover:text-primary transition-colors line-clamp-1">{product.title}</h3>
                <p className="text-sm text-muted-foreground">{product.brand}</p>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-medium text-lg">
                  {formatPrice(discountedPrice)}
                </span>
                {product.discountPercentage > 0 && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{product.description}</p>
          </Link>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-secondary/50">
              {product.category}
            </Badge>
            <Badge variant="outline" className="bg-secondary/50">
              {product.rating.toFixed(1)} ★
            </Badge>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button onClick={handleAddToCart} className="w-full">
            Add to Cart
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}