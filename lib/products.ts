import { promises as fs } from 'fs';
import path from 'path';

export interface Product {
  id: string;
  name: string;
  description: string;
  url: string;
  repositoryUrl?: string;
  icon: 'code' | 'tool' | 'app' | 'package' | 'api' | 'website';
  category: 'agent' | 'plugin' | 'product' | 'infrastructure';
  date: string;
  featured?: boolean;
}

const productsPath = path.join(process.cwd(), 'content', 'products.json');

/**
 * Get all products from the products.json file
 */
export async function getAllProducts(): Promise<Product[]> {
  try {
    const fileContents = await fs.readFile(productsPath, 'utf8');
    const products: Product[] = JSON.parse(fileContents);
    return products.sort((a, b) => b.date.localeCompare(a.date));
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error loading products:', error);
    }
    return [];
  }
}

/**
 * Get only featured products
 */
export async function getFeaturedProducts(): Promise<Product[]> {
  const products = await getAllProducts();
  return products.filter((product) => product.featured);
}

/**
 * Get a single product by ID
 */
export async function getProductById(id: string): Promise<Product | undefined> {
  const products = await getAllProducts();
  return products.find((product) => product.id === id);
}
