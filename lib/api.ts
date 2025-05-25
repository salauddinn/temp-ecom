import { Product, ProductsResponse, PromoCode } from '@/lib/types';

// Base URL for API
const API_BASE_URL = 'https://dummyjson.com';

/**
 * Fetch all products
 */
export async function getProducts(limit = 100, skip = 0): Promise<ProductsResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/products?limit=${limit}&skip=${skip}`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return { products: [], total: 0, skip: 0, limit: 0 };
  }
}

/**
 * Fetch a single product by id
 */
export async function getProductById(id: number): Promise<Product | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) throw new Error(`Failed to fetch product ${id}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
}

/**
 * Search products
 */
export async function searchProducts(query: string): Promise<ProductsResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/search?q=${query}`);
    if (!response.ok) throw new Error('Failed to search products');
    return await response.json();
  } catch (error) {
    console.error('Error searching products:', error);
    return { products: [], total: 0, skip: 0, limit: 0 };
  }
}

/**
 * Fetch products by category
 */
export async function getProductsByCategory(category: string): Promise<ProductsResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/category/${category}`);
    if (!response.ok) throw new Error(`Failed to fetch products for category ${category}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching products for category ${category}:`, error);
    return { products: [], total: 0, skip: 0, limit: 0 };
  }
}

/**
 * Get all categories
 */
export async function getCategories(): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

/**
 * Mock promo codes (since the API doesn't provide them)
 */
export const getPromoCodes = (): PromoCode[] => {
  return [
    { code: 'SUMMER10', discount: 10 },
    { code: 'WELCOME20', discount: 20 },
    { code: 'FLASH50', discount: 50 },
  ];
};

/**
 * Validate promo code
 */
export const validatePromoCode = (code: string): PromoCode | null => {
  const promoCodes = getPromoCodes();
  return promoCodes.find((promo) => promo.code === code) || null;
};