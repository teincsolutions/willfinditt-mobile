import type { Category, CategoryField } from "./category";
import type { AdCondition, AdStatus } from "./enums";
import type { City } from "./location";
import type { User } from "./user";

// Core Ad Types
export interface Ad {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  condition?: AdCondition;
  images: string[];
  videos?: string[];
  status?: AdStatus;
  isPromoted?: boolean;
  promotionEnds?: string;
  views: number;
  userId: string;
  categoryId: string;
  cityId?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  contactPhone?: string;
  contactEmail?: string;
  isNegotiable: boolean;
  expiresAt?: string;
  createdAt?: string;
  updatedAt?: string;
  isSaved?: boolean;
  user?: User;
  category?: Category;
  city?: City;
  tagLinks?: string[];
  fieldValues?: AdFieldValue[];
  savedBy?: SavedAd[];
  _count?: {
    savedBy: number;
    comments: number;
  };
}

export interface AdFieldValue {
  id: string;
  adId: string;
  categoryFieldId: string;
  value: string;
  createdAt: string;
  categoryField?: CategoryField;
}

export interface SavedAd {
  id: string;
  userId: string;
  adId: string;
  createdAt: string;
  user?: User;
  ad?: Ad;
}

export interface AdComment {
  id: string;
  adId: string;
  userId: string;
  content: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
  ad?: Ad;
  user?: User;
  parent?: AdComment;
  replies?: AdComment[];
}

// Request Types
export interface CreateAdRequest {
  title: string;
  description: string;
  price?: number;
  currency?: string;
  condition?: AdCondition;
  categoryId: string;
  cityId?: string;
  images?: string[];
  videos?: string[];
  address?: string;
  latitude?: number;
  longitude?: number;
  contactPhone?: string;
  contactEmail?: string;
  isNegotiable?: boolean;
  fieldValues?: {
    categoryFieldId: string;
    value: string;
  }[];
}

export interface UpdateAdRequest {
  title?: string;
  description?: string;
  price?: number;
  condition?: AdCondition;
  status?: AdStatus;
  isNegotiable?: boolean;
  images?: string[];
  videos?: string[];
  address?: string;
  latitude?: number;
  longitude?: number;
  contactPhone?: string;
  contactEmail?: string;
  fieldValues?: {
    categoryFieldId: string;
    value: string;
  }[];
}

export interface CreateCommentRequest {
  adId: string;
  content: string;
  parentId?: string;
}

export interface AdSearchParams {
  page?: number;
  limit?: number;
  query?: string;
  categoryIds?: string[];
  cityIds?: string[];
  userId?: string;
  conditions?: AdCondition[];
  priceMin?: number;
  priceMax?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  latitude?: number;
  longitude?: number;
  radius?: number;
  promotionFilter?: "promoted_only" | "exclude_promoted";
}

export interface AdFacetsParams {
  categories?: boolean;
  cities?: boolean;
  conditions?: boolean;
  priceRanges?: boolean;
  promotions?: boolean;
}

export interface AdSearchRequest {
  search: AdSearchParams;
  facets?: AdFacetsParams;
}

// Legacy Types (for backward compatibility)
export type Picture = {
  thumbnail: string;
  full: string;
};

export type Product = Ad;
export type Comment = AdComment;

export type ProductSpec = {
  id: number;
  name: string;
  field: import("./enums").CategoryFieldType;
  value: string | string[] | number;
};

export type Suggestion = {
  id: string;
  keyword: string;
  product_id: string;
  category_id: string;
  category_field_id: string;
  is_recent?: boolean;
};
