import api from './api';
import { Ad, CreateAdRequest, UpdateAdRequest, PaginatedResponse, AdStatus, AdCondition, AdSearchRequest, AdSearchParams, AdFacetsParams } from '@/types';

export const adService = {
  // Create a new ad
  create: async (data: CreateAdRequest): Promise<Ad> => {
    const response = await api.post<Ad>('/api/v1/ads', data);
    return response.data;
  },

  // Get all ads with filtering and pagination
  getAll: async (params?: {
    page?: number;
    limit?: number;
    categoryId?: string;
    cityId?: string;
    minPrice?: number;
    maxPrice?: number;
    condition?: AdCondition;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<PaginatedResponse<Ad>> => {
    try {
      const response = await api.get<PaginatedResponse<Ad>>('/api/v1/ads', { params });
      // Ensure we have a valid response structure
      if (!response.data) {
        return {
          data: [],
          meta: {
            page: 1,
            limit: 20,
            total: 0,
            totalPages: 0
          }
        };
      }
      return response.data;
    } catch (error) {
      // Return empty result on error to prevent crashes
      return {
        data: [],
        meta: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0
        }
      };
    }
  },

  // Search ads with advanced filtering and facets
  search: async (params: AdSearchRequest): Promise<PaginatedResponse<Ad>> => {
    try {
      const response = await api.post<PaginatedResponse<Ad>>('/api/v1/ads/search', params);
      return response.data;
    } catch (error) {
      // Return empty result on error to prevent crashes
      return {
        data: [],
        meta: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0
        }
      };
    }
  },

  // Get ad by ID
  getById: async (id: string): Promise<Ad> => {
    const response = await api.get<Ad>(`/api/v1/ads/${id}`);
    return response.data;
  },

  // Update an existing ad
  update: async (id: string, data: UpdateAdRequest): Promise<Ad> => {
    const response = await api.patch<Ad>(`/api/v1/ads/${id}`, data);
    return response.data;
  },

  // Delete an ad (soft delete)
  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/v1/ads/${id}`);
  },

  // Get current user's ads
  getMyAds: async (params?: {
    page?: number;
    limit?: number;
    status?: AdStatus;
  }): Promise<PaginatedResponse<Ad>> => {
    const response = await api.get<PaginatedResponse<Ad>>('/api/v1/ads/my-ads', { params });
    return response.data;
  },

  // Get user's saved/bookmarked ads
  getSavedAds: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Ad>> => {
    const response = await api.get<PaginatedResponse<Ad>>('/api/v1/ads/saved', { params });
    return response.data;
  },

  // Save ad to favorites
  saveAd: async (adId: string): Promise<void> => {
    await api.post(`/api/v1/ads/${adId}/save`);
  },

  // Remove ad from favorites
  unsaveAd: async (adId: string): Promise<void> => {
    await api.delete(`/api/v1/ads/${adId}/save`);
  },

  // Get trending ads
  getTrendingAds: async (params?: {
    limit?: number;
  }): Promise<Ad[]> => {
    try {
      const response = await api.get<Ad[]>('/api/v1/ads/trending', { params });
      return response.data || [];
    } catch (error) {
      // Return empty result on error to prevent crashes
      return [];
    }
  },
};
