import api from './api';
import { CategoryField } from '@/types';

export const categoryFieldService = {
  // Get all category fields
  getAll: async (): Promise<CategoryField[]> => {
    const response = await api.get<CategoryField[]>('/api/v1/category-fields');
    return response.data;
  },

  // Get category field by ID
  getById: async (id: string): Promise<CategoryField> => {
    const response = await api.get<CategoryField>(`/api/v1/category-fields/${id}`);
    return response.data;
  },

  // Get fields by category ID
  getByCategoryId: async (categoryId: string): Promise<CategoryField[]> => {
    const response = await api.get<CategoryField[]>(`/api/v1/category-fields/category/${categoryId}`);
    return response.data;
  },

  // Create category field (Admin only)
  create: async (data: {
    categoryId: string;
    name: string;
    label: string;
    type: string;
    isRequired: boolean;
    options?: any;
    validation?: any;
    sortOrder?: number;
  }): Promise<CategoryField> => {
    const response = await api.post<CategoryField>('/api/v1/category-fields', data);
    return response.data;
  },

  // Update category field (Admin only)
  update: async (id: string, data: Partial<{
    name: string;
    label: string;
    type: string;
    isRequired: boolean;
    options?: any;
    validation?: any;
    sortOrder?: number;
  }>): Promise<CategoryField> => {
    const response = await api.patch<CategoryField>(`/api/v1/category-fields/${id}`, data);
    return response.data;
  },

  // Delete category field (Admin only)
  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/v1/category-fields/${id}`);
  },
};
