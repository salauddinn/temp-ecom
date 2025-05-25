"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ArrowLeft, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { CheckoutModal } from '@/components/checkout-modal';

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    promoCode,
    applyPromoCode,
    removePromoCode,
    getSubtotal,
    getDiscount,
    getTax,
    getTotal,
  } = useCart();
  
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  
  const handleApplyPromoCode = () => {
    if (!promoInput.trim()) {
      setPromoError('Please enter a promo code');
      return;
    }
    
    setPromoError('');
    const success = applyPromoCode(promoInput);
    
    if (success) {
      setPromoInput('');
    } else {
      setPromoError('Invalid promo code');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container px-4 mx-auto py-16">
        <div className="max-w-md mx-auto text-center">
          <ShoppingCart className="w-16 h-16 mx-auto mb-6 text-muted-foreground" />
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">
            Looks like you haven't added anything to your cart yet.
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
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg shadow-sm p-6">
            <div className="flex justify-between mb-6">
              <h2 className="font-semibold text-lg">
                Cart Items ({cart.length})
              </h2>
              <Button variant="ghost" size="sm" onClick={clearCart}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Cart
              </Button>
            </div>
            
            <div className="space-y-6">
              {cart.map((item) => (
                <div key={`${item.id}-${item.selectedColor}-${item.selectedSize}`} className="flex flex-col sm:flex-row gap-4 py-4 border-b">
                  {/* Product Image */}
                  <div className="relative w-full sm:w-24 h-24 sm:h-24 rounded-md overflow-hidden">
                    <Image
                      src={item.thumbnail}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  {/* Product Details */}
                  <div className="flex-grow">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-start">
                      <div>
                        <h3 className="font-medium">
                          <Link href={`/product/${item.id}`} className="hover:text-primary transition-colors">
                            {item.title}
                          </Link>
                        </h3>
                        <p className="text-muted-foreground text-sm">{item.brand}</p>
                        
                        {/* Variants */}
                        <div className="flex flex-wrap gap-2 my-1 text-sm">
                          {item.selectedColor && (
                            <div className="flex items-center">
                              <span className="text-muted-foreground mr-1">Color:</span>
                              <div
                                className="w-4 h-4 rounded-full inline-block"
                                style={{ backgroundColor: item.selectedColor }}
                              />
                            </div>
                          )}
                          {item.selectedSize && (
                            <div className="flex items-center">
                              <span className="text-muted-foreground mr-1">Size:</span>
                              {item.selectedSize}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end mt-2 sm:mt-0">
                        <span className="font-medium">
                          {formatPrice(
                            calculateDiscountedPrice(
                              item.price,
                              item.discountPercentage
                            ) * item.quantity
                          )}
                        </span>
                        {item.discountPercentage > 0 && (
                          <span className="text-sm text-muted-foreground line-through">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Quantity Control */}
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-12 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div>
          <div className="bg-card rounded-lg shadow-sm p-6 sticky top-20">
            <h2 className="font-semibold text-lg mb-6">Order Summary</h2>
            
            {/* Promo Code */}
            <div className="mb-6">
              {promoCode ? (
                <div className="bg-muted p-3 rounded-md flex justify-between items-center">
                  <div>
                    <span className="font-medium block">{promoCode}</span>
                    <span className="text-sm text-muted-foreground">Applied successfully</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removePromoCode}
                    className="hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Promo Code"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="flex-grow"
                    />
                    <Button
                      variant="outline"
                      onClick={handleApplyPromoCode}
                    >
                      Apply
                    </Button>
                  </div>
                  {promoError && (
                    <p className="text-destructive text-sm mt-1">{promoError}</p>
                  )}
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(getSubtotal())}</span>
              </div>
              {promoCode && (
                <div className="flex justify-between text-destructive">
                  <span>Discount</span>
                  <span>-{formatPrice(getDiscount())}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (10%)</span>
                <span>{formatPrice(getTax())}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-medium text-lg">
                <span>Total</span>
                <span>{formatPrice(getTotal())}</span>
              </div>
            </div>
            
            <div className="mt-6 space-y-3">
              <CheckoutModal />
              <Button variant="outline" asChild className="w-full">
                <Link href="/products">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Continue Shopping
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// This is a client component importing module that doesn't exist in the filesystem
// But we need to include it for the 'ShoppingCart' icon
import { ShoppingCart } from 'lucide-react';

function calculateDiscountedPrice(price: number, discountPercentage: number): number {
  return price - (price * discountPercentage) / 100;
}