import React from 'react';
import Link from 'next/link';
import { Category } from '@/lib/types';

// Featured categories with images
const FEATURED_CATEGORIES: Category[] = [
  {
    id: 'smartphones',
    name: 'Smartphones',
    image: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 'laptops',
    name: 'Laptops',
    image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 'fragrances',
    name: 'Fragrances',
    image: 'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 'skincare',
    name: 'Skincare',
    image: 'https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 'home-decoration',
    name: 'Home Decoration',
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 'furniture',
    name: 'Furniture',
    image: 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

export function FeaturedCategories() {
  return (
    <section className="py-12">
      <div className="container px-4 mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {FEATURED_CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.id}`}
              className="group block"
            >
              <div className="relative rounded-lg overflow-hidden">
                <div 
                  className="aspect-square w-full bg-center bg-cover transition-transform duration-300 group-hover:scale-105"
                  style={{ backgroundImage: `url(${category.image})` }}
                >
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-4 transition-opacity group-hover:bg-opacity-30">
                  <h3 className="text-white font-semibold">{category.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}