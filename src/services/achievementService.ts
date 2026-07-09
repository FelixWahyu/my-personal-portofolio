import api from "./api";

export interface Achievement {
  id: string;
  titleId: string;
  titleEn: string;
  issuerTextId: string;
  issuerTextEn: string;
  descriptionId?: string | null;
  descriptionEn?: string | null;
  tagsId: string[];
  tagsEn: string[];
  dateId: string;
  dateEn: string;
  image: string;
  type: string;
  credentialCode?: string | null;
  sortOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AchievementListParams {
  search?: string;
  type?: string;
  page?: number;
  limit?: number;
  adminView?: boolean;
}

export interface AchievementListResponse {
  success: boolean;
  message: string;
  data: {
    achievements: Achievement[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AchievementSingleResponse {
  success: boolean;
  message: string;
  data: Achievement;
}

export interface AchievementStatsResponse {
  success: boolean;
  message: string;
  data: {
    totalAchievements: number;
  };
}

export const getAchievements = async (params?: AchievementListParams): Promise<AchievementListResponse> => {
  const response = await api.get<AchievementListResponse>("/api/achievements", { params });
  return response.data;
};

export const getAchievementById = async (id: string): Promise<AchievementSingleResponse> => {
  const response = await api.get<AchievementSingleResponse>(`/api/achievements/${id}`);
  return response.data;
};

export const createAchievement = async (formData: FormData): Promise<AchievementSingleResponse> => {
  const response = await api.post<AchievementSingleResponse>("/api/achievements", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateAchievement = async (id: string, formData: FormData): Promise<AchievementSingleResponse> => {
  const response = await api.put<AchievementSingleResponse>(`/api/achievements/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteAchievement = async (id: string): Promise<{ success: boolean; message: string }> => {
  const response = await api.delete<{ success: boolean; message: string }>(`/api/achievements/${id}`);
  return response.data;
};

export const togglePublishAchievement = async (id: string): Promise<AchievementSingleResponse> => {
  const response = await api.put<AchievementSingleResponse>(`/api/achievements/${id}/toggle-publish`);
  return response.data;
};

export const getAchievementStats = async (): Promise<AchievementStatsResponse> => {
  const response = await api.get<AchievementStatsResponse>("/api/achievements/stats");
  return response.data;
};

export const getAchievementTypes = async (): Promise<{ success: boolean; message: string; data: string[] }> => {
  const response = await api.get<{ success: boolean; message: string; data: string[] }>("/api/achievements/types");
  return response.data;
};
