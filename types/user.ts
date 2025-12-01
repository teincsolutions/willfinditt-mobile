import type {
  AuthProvider,
  DocumentType,
  UserRole,
  VerificationStatus,
} from "./enums";
import type { City } from "./location";

// Core User Types
export interface User {
  id: string;
  email?: string;
  username: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  countryId?: string;
  isActive: boolean;
  isVerified: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  role?: UserRole;
  provider?: AuthProvider;
  providerId?: string;
  createdAt: string;
  updatedAt: string;
  sellerProfile?: SellerProfile;
}

export interface SellerProfile {
  id: string;
  userId: string;
  businessName: string;
  businessType: string;
  description?: string | null;
  address?: string | null;
  cityId?: string;
  city?: City;
  isVerified: boolean;
  rating: number;
  totalReviews: number;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  } | null;
  website?: string | null;
  createdAt?: string;
  updatedAt?: string;
  user?: User;
  verification?: SellerVerification | null;
}

export interface SellerReview {
  id: string;
  sellerId: string;
  reviewerId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
  seller?: User;
  reviewer?: User;
}

export interface SellerVerification {
  id: string;
  documentType: DocumentType;
  documentNumber: string;
  address: string;
  sellerProfileId: string;
  documents: string[];
  facePhoto: string[];
  status: VerificationStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  notes?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

// Request Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email?: string;
  phone?: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  avatar?: string;
  phone?: string;
  countryId?: string | null;
}

export interface CreateSellerProfileRequest {
  businessName: string;
  businessType: string;
  description?: string;
  contactPhone?: string;
  contactEmail?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode?: string;
  };
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
}

export interface UpdateSellerProfileRequest {
  businessName?: string;
  businessType?: string;
  description?: string;
  contactPhone?: string;
  contactEmail?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
}

// Response Types
export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface SocialData {
  provider: "GOOGLE" | "FACEBOOK";
  accessToken: string | null;
}

// Legacy Types (for backward compatibility)
export type AccountProvider = AuthProvider;
