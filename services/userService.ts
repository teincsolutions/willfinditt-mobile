import { UpdateProfileRequest, User } from '@/types';
import api from './api';

export const userService = {
  // Get current user profile
  getProfile: async (): Promise<User> => {
    const response = await api.get<User>('/api/v1/users/me');
    return response.data;
  },

  // Update user profile
  updateProfile: async (data: UpdateProfileRequest): Promise<User> => {
    const response = await api.patch<User>('/api/v1/users/me', data);
    return response.data;
  },

  // Get public user profile by ID
  getUserById: async (userId: string): Promise<User> => {
    const response = await api.get<User>(`/api/v1/users/${userId}`);
    return response.data;
  },

  // Request email change with verification
  requestEmailChange: async (newEmail: string, currentPassword: string): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>('/api/v1/users/change-email', {
      newEmail,
      password: currentPassword
    });
    return response.data;
  },

  // Verify email change with code
  verifyEmailChange: async (code: string): Promise<User> => {
    const response = await api.post<User>('/api/v1/users/verify-email-change', { code });
    return response.data;
  },

  // Request phone change with verification
  requestPhoneChange: async (newPhone: string, currentPassword: string): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>('/api/v1/users/change-phone', {
      newPhone,
      password: currentPassword
    });
    return response.data;
  },

  // Verify phone change with OTP
  verifyPhoneChange: async (otp: string): Promise<User> => {
    console.log('Verifying phone change with OTP:', otp);
    const response = await api.post<User>('/api/v1/users/verify-phone-change', { code: otp });
    return response.data;
  },

  // Change password
  changePassword: async (currentPassword: string, newPassword: string): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>('/api/v1/users/change-password', {
      currentPassword,
      newPassword
    });
    return response.data;
  },

  // Resend verification for email/phone changes
  resendChangeVerification: async (type: 'email' | 'phone'): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>('/api/v1/users/resend-change-verification', { type });
    return response.data;
  },

  // Request verification for existing unverified email
  requestEmailVerification: async (): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>('/api/v1/users/verify-existing-email');
    return response.data;
  },

  // Request verification for existing unverified phone
  requestPhoneVerification: async (): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>('/api/v1/users/verify-existing-phone');
    return response.data;
  },

  // Verify existing email with code
  verifyExistingEmail: async (code: string): Promise<User> => {
    const response = await api.post<User>('/api/v1/users/verify-existing-email-code', { code });
    return response.data;
  },

  // Verify existing phone with OTP
  verifyExistingPhone: async (otp: string): Promise<User> => {
    const response = await api.post<User>('/api/v1/users/verify-existing-phone-otp', { code: otp });
    return response.data;
  },
};
