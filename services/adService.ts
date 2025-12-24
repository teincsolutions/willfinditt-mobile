import {
  Ad,
  AdCondition,
  AdSearchRequest,
  AdSearchSuggestionsParams,
  AdStatus,
  AdSuggestion,
  CreateAdRequest,
  PaginatedResponse,
  UpdateAdRequest,
} from "@/types";
import api from "./api";

const baseUrl = "/api/v1/ads";

export const adService = {
  // Create a new ad
  create: async (data: CreateAdRequest): Promise<Ad> => {
    const response = await api.post<Ad>(`${baseUrl}/`, data);
    return response.data;
  },

  // Get all ads with filtering and pagination (basic endpoint)
  getAll: async (params?: {
    page?: number;
    limit?: number;
    categoryId?: string;
    cityId?: string;
    userId?: string;
    minPrice?: number;
    maxPrice?: number;
    condition?: AdCondition;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<PaginatedResponse<Ad>> => {
    console.log("Get all ads with params:", params);
    const response = await api.get<PaginatedResponse<Ad>>(`${baseUrl}`, {
      params,
    });
    return response.data;
  },

  // Search ads with advanced filtering and facets (graph-like request)
  search: async (params: AdSearchRequest): Promise<PaginatedResponse<Ad>> => {
    console.log("Search params:", params);
    const response = await api.post<PaginatedResponse<Ad>>(
      `${baseUrl}/search`,
      params
    );
    return response.data;
  },

  // Search suggestions - lightweight endpoint for autocomplete and quick previews
  searchSuggestions: async (
    params: AdSearchSuggestionsParams
  )=> {
    console.log("Search suggestions params:", params);
    const response = await api.post<PaginatedResponse<AdSuggestion>>(
      `${baseUrl}/search/suggestions`,
      params
    );
    return response.data.data;
  },

  // Get ad by ID
  getById: async (id: string): Promise<Ad> => {
    const response = await api.get<Ad>(`${baseUrl}/${id}`);
    return response.data;
  },

  // Update an existing ad
  update: async (id: string, data: UpdateAdRequest): Promise<Ad> => {
    const response = await api.patch<Ad>(`${baseUrl}/${id}`, data);
    return response.data;
  },

  // Delete an ad (soft delete)
  delete: async (id: string): Promise<void> => {
    await api.delete(`${baseUrl}/${id}`);
  },

  // Get current user's ads
  getMyAds: async (params?: {
    page?: number;
    limit?: number;
    status?: AdStatus;
  }) => {
    const response = await api.get<PaginatedResponse<Ad>>(`${baseUrl}/my-ads`, {
      params,
    });
    return response.data;
  },

  // Save ad to favorites
  saveAd: async (adId: string): Promise<void> => {
    await api.post(`${baseUrl}/${adId}/save`);
  },

  // Remove ad from favorites
  unsaveAd: async (adId: string): Promise<void> => {
    await api.delete(`${baseUrl}/${adId}/save`);
  },

  // Get saved ads
  getSavedAds: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Ad>> => {
    const response = await api.get<PaginatedResponse<Ad>>(`${baseUrl}/saved`, {
      params,
    });
    return response.data;
  },
};
