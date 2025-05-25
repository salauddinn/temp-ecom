"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroBanner() {
  return (
    <section className="relative h-[60vh] min-h-[400px] md:min-h-[500px] lg:min-h-[600px] overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-30 z-10"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/5865196/pexels-photo-5865196.jpeg?auto=compress&cs=tinysrgb&w=1600)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30 z-20" />
      
      {/* Content */}
      <div className="container relative h-full z-30 flex flex-col justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl text-white"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">Summer Collection 2025</h1>
          <p className="text-lg md:text-xl opacity-90 mb-8">
            Discover the latest trends in fashion, electronics, and home decor at unbeatable prices.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" asChild>
              <Link href="/products" className="group">
                Shop Now 
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="bg-white/10 text-white border-white/40 hover:bg-white/20">
              <Link href="/products?category=new-arrivals">
                New Arrivals
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}