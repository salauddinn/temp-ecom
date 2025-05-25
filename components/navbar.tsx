"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, ShoppingCart, Heart, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';

export function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { getTotalItems, wishlist } = useCart();
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled ? 'bg-background/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="font-bold text-xl md:text-2xl">
            ShopVista
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className={`text-sm font-medium hover:text-primary transition-colors ${
                pathname === '/' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/products" 
              className={`text-sm font-medium hover:text-primary transition-colors ${
                pathname === '/products' || pathname.startsWith('/product/') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Products
            </Link>
            <Link 
              href="/categories" 
              className={`text-sm font-medium hover:text-primary transition-colors ${
                pathname === '/categories' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Categories
            </Link>
          </nav>
          
          {/* Desktop Search */}
          <div className="hidden md:flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative w-full max-w-sm">
              <Input
                type="text"
                placeholder="Search products..."
                className="pr-8"
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
            </form>
          </div>
          
          {/* Icons */}
          <div className="flex items-center space-x-4">
            <Link href="/wishlist" className="relative">
              <Heart className="h-6 w-6" />
              {wishlist.length > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {wishlist.length}
                </Badge>
              )}
            </Link>
            <Link href="/cart" className="relative">
              <ShoppingCart className="h-6 w-6" />
              {getTotalItems() > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {getTotalItems()}
                </Badge>
              )}
            </Link>
            
            {/* Mobile Menu Trigger */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80vw] max-w-md p-0">
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-semibold text-lg">Menu</h2>
                    </div>
                    <form onSubmit={handleSearch} className="relative w-full">
                      <Input
                        type="text"
                        placeholder="Search products..."
                        className="pr-8"
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
                    </form>
                  </div>
                  <div className="flex-1 overflow-auto py-4">
                    <nav className="flex flex-col space-y-4 px-4">
                      <Link 
                        href="/"
                        className={`text-lg font-medium py-2 hover:text-primary transition-colors ${
                          pathname === '/' ? 'text-primary' : 'text-muted-foreground'
                        }`}
                      >
                        Home
                      </Link>
                      <Link 
                        href="/products"
                        className={`text-lg font-medium py-2 hover:text-primary transition-colors ${
                          pathname === '/products' || pathname.startsWith('/product/') ? 'text-primary' : 'text-muted-foreground'
                        }`}
                      >
                        Products
                      </Link>
                      <Link 
                        href="/categories"
                        className={`text-lg font-medium py-2 hover:text-primary transition-colors ${
                          pathname === '/categories' ? 'text-primary' : 'text-muted-foreground'
                        }`}
                      >
                        Categories
                      </Link>
                      <Link 
                        href="/wishlist"
                        className={`text-lg font-medium py-2 hover:text-primary transition-colors ${
                          pathname === '/wishlist' ? 'text-primary' : 'text-muted-foreground'
                        }`}
                      >
                        Wishlist
                      </Link>
                      <Link 
                        href="/cart"
                        className={`text-lg font-medium py-2 hover:text-primary transition-colors ${
                          pathname === '/cart' ? 'text-primary' : 'text-muted-foreground'
                        }`}
                      >
                        Cart
                      </Link>
                    </nav>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}