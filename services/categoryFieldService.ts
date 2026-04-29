import { CategoryField } from "@/types";
import api from "./api";

export const categoryFieldService = {
  // Get all category fields
  getAll: async (): Promise<CategoryField[]> => {
    const response = await api.get<CategoryField[]>("/api/v1/category-fields");
    return response.data;
  },

  // Get category field by ID
  getById: async (id: string): Promise<CategoryField> => {
    const response = await api.get<CategoryField>(
      `/api/v1/category-fields/${id}`,
    );
    return response.data;
  },

  // Get fields by category ID
  getByCategoryId: async (categoryId: string): Promise<CategoryField[]> => {
    const response = await api.get<CategoryField[]>(
      `/api/v1/category-fields/category/${categoryId}`,
    );
    return response.data;
  },
};
