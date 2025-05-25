import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format price in dollars
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

/**
 * Calculate the discounted price
 */
export function calculateDiscountedPrice(originalPrice: number, discountPercentage: number): number {
  return originalPrice - (originalPrice * discountPercentage) / 100;
}

/**
 * Format discount percentage
 */
export function formatDiscountPercentage(discountPercentage: number): string {
  return `${Math.round(discountPercentage)}% OFF`;
}

/**
 * Generate an array of star ratings (filled and unfilled)
 */
export function generateStarRating(rating: number, max: number = 5): boolean[] {
  return Array(max)
    .fill(null)
    .map((_, index) => index < Math.round(rating));
}

/**
 * Truncate text to a specific length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

/**
 * Group array into chunks of specified size
 */
export function chunkArray<T>(array: T[], size: number): T[][] {
  return array.reduce((acc, _, i) => {
    if (i % size === 0) acc.push(array.slice(i, i + size));
    return acc;
  }, [] as T[][]);
}