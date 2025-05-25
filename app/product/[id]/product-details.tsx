"use client";

import React, { useState } from 'react';
import { Heart, ShoppingBag, Truck, Shield, CornerDownLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Carousel } from '@/components/carousel';
import { ProductCard } from '@/components/ui/product-card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';
import { Product } from '@/lib/types';
import { AVAILABLE_SIZES, AVAILABLE_COLORS } from '@/lib/types';
import { formatPrice, calculateDiscountedPrice, formatDiscountPercentage } from '@/lib/utils';

interface ProductDetailsProps {
  product: Product;
  similarProducts: Product[];
}

export function ProductDetails({ product, similarProducts }: ProductDetailsProps) {
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [quantity, setQuantity] = useState(1);
  
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const isWishlisted = wishlist.includes(product.id);
  
  const discountedPrice = calculateDiscountedPrice(
    product.price,
    product.discountPercentage
  );
  
  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
  };
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= product.stock) {
      setQuantity(value);
    }
  };
  
  return (
    <div className="container px-4 mx-auto py-8">
      <div className="mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="relative">
            <Carousel 
              images={product.images} 
              className="rounded-lg overflow-hidden aspect-square md:aspect-[4/3] lg:aspect-square"
            />
          </div>
          
          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-4">
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge variant="outline" className="capitalize">
                  {product.category}
                </Badge>
                <Badge variant="outline">
                  {product.brand}
                </Badge>
                {product.stock < 10 && (
                  <Badge variant="destructive">
                    Only {product.stock} left
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold mb-1">{product.title}</h1>
              <div className="flex items-center mb-4">
                <div className="flex items-center text-yellow-500 mr-2">
                  {Array(5)
                    .fill(null)
                    .map((_, i) => (
                      <span key={i} className="text-lg">
                        {i < Math.round(product.rating) ? '★' : '☆'}
                      </span>
                    ))}
                </div>
                <span className="text-muted-foreground">
                  {product.rating.toFixed(1)} ({Math.round(product.rating * 20)} reviews)
                </span>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <span className="text-3xl font-bold">{formatPrice(discountedPrice)}</span>
                {product.discountPercentage > 0 && (
                  <>
                    <span className="text-xl text-muted-foreground line-through ml-2">
                      {formatPrice(product.price)}
                    </span>
                    <Badge className="ml-2 bg-destructive text-destructive-foreground">
                      {formatDiscountPercentage(product.discountPercentage)}
                    </Badge>
                  </>
                )}
              </div>
              <p className="text-muted-foreground mb-6">{product.description}</p>
            </div>
            
            <div className="space-y-6">
              {/* Color Selection */}
              <div>
                <h3 className="text-sm font-medium mb-3">Color</h3>
                <div className="flex flex-wrap gap-3">
                  {AVAILABLE_COLORS.map((color) => (
                    <button
                      key={color.value}
                      className={`w-8 h-8 rounded-full border-2 ${
                        selectedColor === color.value
                          ? 'border-primary'
                          : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => setSelectedColor(color.value)}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
              
              {/* Size Selection */}
              <div>
                <h3 className="text-sm font-medium mb-3">Size</h3>
                <div className="grid grid-cols-6 gap-2">
                  {AVAILABLE_SIZES.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? 'default' : 'outline'}
                      className="h-10"
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Quantity */}
              <div>
                <h3 className="text-sm font-medium mb-3">Quantity</h3>
                <div className="flex items-center w-32">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <Input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="h-10 text-center mx-1"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => quantity < product.stock && setQuantity(quantity + 1)}
                    disabled={quantity >= product.stock}
                  >
                    +
                  </Button>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button className="flex-1" onClick={handleAddToCart}>
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => toggleWishlist(product.id)}
                >
                  <Heart
                    className={`mr-2 h-4 w-4 ${isWishlisted ? 'fill-destructive text-destructive' : ''}`}
                  />
                  {isWishlisted ? 'Added to Wishlist' : 'Add to Wishlist'}
                </Button>
              </div>
            </div>
            
            {/* Shipping Info */}
            <div className="mt-8 pt-8 border-t">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <Truck className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span className="text-sm">Free shipping over $50</span>
                </div>
                <div className="flex items-center">
                  <CornerDownLeft className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span className="text-sm">30-day returns</span>
                </div>
                <div className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span className="text-sm">2 year warranty</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Details Tabs */}
        <Tabs defaultValue="description">
          <TabsList className="w-full justify-start border-b rounded-none">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="py-4">
            <p>{product.description}</p>
            <p className="mt-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam 
              auctor, nisl eget ultricies aliquam, nunc nisl aliquet nunc, 
              eget aliquam nisl nunc eget nisl. Nullam auctor, nisl eget 
              ultricies aliquam, nunc nisl aliquet nunc, eget aliquam nisl 
              nunc eget nisl.
            </p>
          </TabsContent>
          <TabsContent value="specifications" className="py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-muted rounded-lg p-4">
                <h3 className="font-medium mb-2">Basic Information</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Brand</span>
                    <span>{product.brand}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Category</span>
                    <span className="capitalize">{product.category.replace('-', ' ')}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Rating</span>
                    <span>{product.rating.toFixed(1)} out of 5</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Stock</span>
                    <span>{product.stock} units</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-muted rounded-lg p-4">
                <h3 className="font-medium mb-2">Additional Features</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Material</span>
                    <span>Premium Quality</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Color Options</span>
                    <span>{AVAILABLE_COLORS.length} Colors</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Size Options</span>
                    <span>{AVAILABLE_SIZES.length} Sizes</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Warranty</span>
                    <span>2 Years</span>
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="py-4">
            <p className="text-center py-8 text-muted-foreground">
              Reviews are coming soon!
            </p>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Similar Products */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Similar Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {similarProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}