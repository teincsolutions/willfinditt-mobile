import api from './api';
import { PaginatedResponse } from '@/types';

export interface PromotionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration: number; // in days
  features: {
    featured?: boolean;
    priority?: string;
    boostViews?: number;
    socialMediaPromotion?: boolean;
    emailMarketing?: boolean;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PromotionUsage {
  id: string;
  userId: string;
  promotionId: string;
  planId: string;
  adId: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  orderId?: string;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
  promotion?: Promotion;
  plan?: PromotionPlan;
  ad?: any;
}

export interface Promotion {
  id: string;
  planId: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  plan?: PromotionPlan;
}

export interface PurchasePromotionRequest {
  planId: string;
  adId: string;
  paymentMethod?: string;
  metadata?: any;
}

export const promotionService = {
  // Get all promotion plans
  getPlans: async (params?: {
    isActive?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<PromotionPlan>> => {
    try {
      const response = await api.get<PaginatedResponse<PromotionPlan>>('/api/v1/promotions/plans', { params });
      return response.data;
    } catch (error) {
      return {
        data: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0
        }
      };
    }
  },

  // Get promotion plan by ID
  getPlanById: async (planId: string): Promise<PromotionPlan> => {
    const response = await api.get<PromotionPlan>(`/api/v1/promotions/plans/${planId}`);
    return response.data;
  },

  // Purchase a promotion for an ad
  purchasePromotion: async (data: PurchasePromotionRequest): Promise<PromotionUsage> => {
    const response = await api.post<PromotionUsage>('/api/v1/promotions/purchase', data);
    return response.data;
  },

  // Get user's promotion usages
  getMyPromotions: async (params?: {
    isActive?: boolean;
    current?: boolean;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<PromotionUsage>> => {
    try {
      const response = await api.get<PaginatedResponse<PromotionUsage>>('/api/v1/promotions/usages/my', { params });
      return response.data;
    } catch (error) {
      return {
        data: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0
        }
      };
    }
  },

  // Get user's active promotions
  getMyActivePromotions: async (): Promise<PromotionUsage[]> => {
    try {
      const response = await api.get<PromotionUsage[]>('/api/v1/promotions/usages/my/active');
      return response.data;
    } catch (error) {
      return [];
    }
  },

  // Get promotion usage by ID
  getPromotionUsageById: async (usageId: string): Promise<PromotionUsage> => {
    const response = await api.get<PromotionUsage>(`/api/v1/promotions/usages/${usageId}`);
    return response.data;
  },

  // Get current promotions
  getCurrentPromotions: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Promotion>> => {
    try {
      const response = await api.get<PaginatedResponse<Promotion>>('/api/v1/promotions/current', { params });
      return response.data;
    } catch (error) {
      return {
        data: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0
        }
      };
    }
  },
};
