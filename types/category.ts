import type { CategoryFieldType } from "./enums";

// Core Category Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  parentId?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  parent?: Category;
  children?: Category[];
  fields?: CategoryField[];
}

export interface CategoryField {
  id: string;
  categoryId: string;
  name: string;
  label: string;
  type: CategoryFieldType;
  isRequired: boolean;
  options?: any; // JSON field from Prisma
  validation?: any; // JSON field from Prisma
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// Legacy Types (for backward compatibility)
export type Field = CategoryFieldType;
