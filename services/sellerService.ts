import {
  CreateSellerProfileRequest,
  PaginatedResponse,
  SellerProfile,
  SellerReview,
  SellerStats,
  SellerVerification,
  UpdateSellerProfileRequest,
} from "@/types";
import api from "./api";

export const sellerService = {
  // Get current user's seller profile
  getMySellerProfile: async (): Promise<SellerProfile> => {
    const response = await api.get<SellerProfile>("/api/v1/sellers/my-profile");
    return response.data;
  },

  getMySellerStats: async () => {
    const response = await api.get<SellerStats>(`/api/v1/sellers/my-stats`);
    return response.data;
  },

  // Get seller profile by ID
  getSellerProfile: async (sellerId: string): Promise<SellerProfile> => {
    const response = await api.get<SellerProfile>(
      `/api/v1/sellers/${sellerId}`
    );
    return response.data;
  },

  // Create seller profile
  createSellerProfile: async (
    data: CreateSellerProfileRequest
  ): Promise<SellerProfile> => {
    const response = await api.post<SellerProfile>("/api/v1/sellers", data);
    return response.data;
  },

  // Update seller profile
  updateSellerProfile: async (
    sellerId: string,
    data: UpdateSellerProfileRequest
  ): Promise<SellerProfile> => {
    const response = await api.patch<SellerProfile>(
      `/api/v1/sellers/${sellerId}`,
      data
    );
    return response.data;
  },

  // Delete seller profile
  deleteSellerProfile: async (
    sellerId: string
  ): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(
      `/api/v1/sellers/${sellerId}`
    );
    return response.data;
  },

  // Get seller statistics
  getSellerStats: async (
    sellerId: string
  ): Promise<{
    totalAds: number;
    activeAds: number;
    totalViews: number;
    totalMessages: number;
    averageRating: number;
    totalReviews: number;
  }> => {
    const response = await api.get(`/api/v1/sellers/${sellerId}/stats`);
    return response.data;
  },

  // Seller Reviews
  createSellerReview: async (data: {
    sellerId: string;
    rating: number;
    comment?: string;
    orderId?: string;
  }): Promise<SellerReview> => {
    const response = await api.post<SellerReview>(
      "/api/v1/seller-reviews",
      data
    );
    return response.data;
  },

  // Get reviews for specific seller
  getSellerReviews: async (
    sellerId: string,
    page = 1,
    limit = 20
  ): Promise<PaginatedResponse<SellerReview>> => {
    const response = await api.get<PaginatedResponse<SellerReview>>(
      `/api/v1/seller-reviews/seller/${sellerId}`,
      { params: { page, limit } }
    );
    return response.data;
  },

  // Get seller review by ID
  getSellerReviewById: async (reviewId: string): Promise<SellerReview> => {
    const response = await api.get<SellerReview>(
      `/api/v1/seller-reviews/${reviewId}`
    );
    return response.data;
  },

  // Update seller review
  updateSellerReview: async (
    reviewId: string,
    data: {
      rating?: number;
      comment?: string;
    }
  ): Promise<SellerReview> => {
    const response = await api.patch<SellerReview>(
      `/api/v1/seller-reviews/${reviewId}`,
      data
    );
    return response.data;
  },

  // Delete seller review
  deleteSellerReview: async (
    reviewId: string
  ): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(
      `/api/v1/seller-reviews/${reviewId}`
    );
    return response.data;
  },

  // Get seller review statistics
  getSellerReviewStats: async (
    sellerId: string
  ): Promise<{
    averageRating: number;
    totalReviews: number;
    ratingDistribution: { [key: number]: number };
  }> => {
    const response = await api.get(`/api/v1/seller-reviews/stats/${sellerId}`);
    return response.data;
  },

  // Seller Verification (KYC)
  submitVerification: async (
    data: Partial<SellerVerification>
  ): Promise<SellerVerification> => {
    const response = await api.post<SellerVerification>(
      "/api/v1/seller-verification",
      data
    );
    return response.data;
  },

  // Update Selller Verification (KYC)
  updateMyVerification: async (
    id: string,
    data: Partial<SellerVerification>
  ): Promise<SellerVerification> => {
    const response = await api.patch<SellerVerification>(
      `/api/v1/seller-verification/${id}`,
      data
    );
    return response.data;
  },

  // Get current user's verification
  getMyVerification: async (): Promise<SellerVerification> => {
    const response = await api.get<SellerVerification>(
      "/api/v1/seller-verification/my-verification"
    );
    return response.data;
  },

  // Delete verification
  deleteVerification: async (
    verificationId: string
  ): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(
      `/api/v1/seller-verification/${verificationId}`
    );
    return response.data;
  },
};
