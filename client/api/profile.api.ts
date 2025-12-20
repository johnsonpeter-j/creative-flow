import axiosInstance from './axios';

export interface ProfileRequest {
  name: string;
}

export interface ProfileResponse {
  message?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

// Get user profile API
export const getProfileApi = async (): Promise<ProfileResponse> => {
  const response = await axiosInstance.get<ProfileResponse>('/auth/verify');
  return response.data;
};

// Update user profile API
export const updateProfileApi = async (data: ProfileRequest): Promise<ProfileResponse> => {
  const response = await axiosInstance.put<ProfileResponse>('/auth/profile', data);
  return response.data;
};
