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
  createdAt: string;
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
  // Rejection and resubmission fields
  closedAt: string | null;
  closureReason: string | null;
  rejectionReason: string | null;
  rejectionRecommendations: string | null;
  rejectedAt: string | null;
  rejectedBy: string | null;
  suspensionReason: string | null;
  suspensionRecommendations: string | null;
  suspendedAt: string | null;
  suspendedBy: string | null;
  submittedAt: string | null;
  resubmissionCount: number;
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
  cityId: string;
  images?: string[];
  videos?: string[];
  address?: string;
  latitude?: number;
  longitude?: number;
  status?: Omit<
    AdStatus,
    AdStatus.SOLD | AdStatus.SUSPENDED | AdStatus.EXPIRED | AdStatus.ACTIVE
  >;
  contactPhone?: string;
  contactEmail?: string;
  isNegotiable?: boolean;
  fieldValues?: {
    categoryFieldId: string;
    value: string;
  }[];
}

export type UpdateAdRequest = Partial<CreateAdRequest> & {
  status?: AdStatus;
};

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
  promotionFilter?: "all" | "promoted_only" | "non_promoted_only";
  statuses?: AdStatus[];
  fieldValues?: {
    categoryFieldId: string;
    value: string;
  }[];
  minimal?: boolean; // For lightweight responses
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

// Search Suggestions Types
export interface AdSearchSuggestionsParams {
  query?: string;
  page?: number;
  limit?: number;
  categoryIds?: string[];
  cityIds?: string[];
  priceMin?: number;
  priceMax?: number;
  conditions?: AdCondition[];
  promotionFilter?: "all" | "promoted_only" | "non_promoted_only";
  sortBy?: "promotionPriority" | "createdAt" | "price" | "views";
  sortOrder?: "asc" | "desc";
  statuses?: AdStatus[];
}

export interface AdSuggestion {
  id: string;
  title: string;
  price: number;
  currency: string;
  thumbnail: string | null;
  cityName: string | null;
  categoryName: string;
  categoryId: string;
  status: AdStatus;
  isPromoted: boolean;
  createdAt: string;
}

export type Product = Ad;
export type RecentSearchAd = Ad;
export type Comment = AdComment;

export type Suggestion = {
  id: string;
  keyword: string;
  productId: string;
  categoryId: string;
  categoryFieldId: string;
  isRecent?: boolean;
};

export interface Promo {
  source?: any;
  image?: string;
  title: string;
  positionRight?: boolean;
  subtitle: string;
  color?: string;
}

// Seller Experience Types
export interface SellerStats {
  totalAds: number;
  activeAds: number;
  pendingAds: number;
  rejectedAds: number;
  suspendedAds: number;
  expiredAds: number;
  draftAds?: number;
  soldAds?: number;
  approvalRate: number;
  averageApprovalTime: number;
}

export interface SellerPendingAd {
  id: string;
  title: string;
  submittedAt: string;
  estimatedApprovalTime: string;
  status: string;
  priority: string;
}

export interface SellerRejectedAd extends Ad {
  rejectedAt: string;
  rejectionReason: string;
  recommendations?: string;
  canResubmit: boolean;
  resubmissionDeadline?: string;
  resubmissionCount: number;
}

export interface CategoryGuidelines {
  category: string;
  categoryId: string;
  requirements: string[];
  tips: string[];
  commonRejectionReasons: string[];
  estimatedApprovalTime: string;
}

export interface ResubmitAdRequest {
  title?: string;
  description?: string;
  price?: number;
  images?: string[];
  condition?: AdCondition;
  fieldValues?: {
    categoryFieldId: string;
    value: string;
  }[];
}
