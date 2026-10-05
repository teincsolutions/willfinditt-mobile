import api from './api';
import { Category, ApiResponse } from '@/types';

export const categoryService = {
  // Get all categories with optional filtering
  getAll: async (params?: { 
    includeFields?: boolean; 
    parentId?: string; 
    isActive?: boolean 
  }): Promise<Category[]> => {
    const response = await api.get<Category[]>('/api/v1/categories', { params });
    return response.data;
  },

  // Get category by ID
  getById: async (id: string): Promise<Category> => {
    const response = await api.get<Category>(`/api/v1/categories/${id}`);
    return response.data;
  },

  // Get categories as tree structure
  getTree: async (): Promise<Category[]> => {
    const response = await api.get<Category[]>('/api/v1/categories/tree');
    return response.data;
  },

  // Get only parent categories (categories with no parent)
  getParents: async (): Promise<Category[]> => {
    const response = await api.get<Category[]>('/api/v1/categories/parents');
    return response.data;
  },

  // Get subcategories by parent ID
  getSubcategories: async (parentId: string): Promise<Category[]> => {
    const response = await api.get<Category[]>(`/api/v1/categories/subcategories/${parentId}`);
    return response.data;
  },

  // Get filter-aware ad counts per category (visible ads only).
  // Omit filters for global totals.
  getCounts: async (params?: {
    cityIds?: string;
    priceMin?: number;
    priceMax?: number;
    conditions?: string;
    query?: string;
    promotedOnly?: boolean;
  }): Promise<Record<string, number>> => {
    const response = await api.get<{ counts: Record<string, number> }>(
      '/api/v1/categories/counts',
      { params }
    );
    return response.data.counts || {};
  },

  // Create category (Admin only)
  create: async (data: {
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    parentId?: string;
    isActive?: boolean;
    sortOrder?: number;
  }): Promise<Category> => {
    const response = await api.post<Category>('/api/v1/categories', data);
    return response.data;
  },
};
