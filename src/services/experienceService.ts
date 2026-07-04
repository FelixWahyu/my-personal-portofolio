import api from "./api";

export interface Experience {
  id: string;
  roleId: string;
  roleEn: string;
  companyId: string;
  companyEn: string;
  locationId: string;
  locationEn: string;
  periodId: string;
  periodEn: string;
  durationId: string;
  durationEn: string;
  typeId: string;
  typeEn: string;
  modeId: string;
  modeEn: string;
  responsibilitiesId: string[];
  responsibilitiesEn: string[];
  insightId: string[];
  insightEn: string[];
  impactId: string[];
  impactEn: string[];
  sortOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ExperienceListParams {
  search?: string;
  page?: number;
  limit?: number;
}

export interface ExperienceListResponse {
  success: boolean;
  message: string;
  data: {
    experiences: Experience[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ExperienceSingleResponse {
  success: boolean;
  message: string;
  data: Experience;
}

export interface ExperienceStatsResponse {
  success: boolean;
  message: string;
  data: {
    totalExperiences: number;
  };
}

export const getExperiences = async (params?: ExperienceListParams): Promise<ExperienceListResponse> => {
  const response = await api.get<ExperienceListResponse>("/api/experiences", { params });
  return response.data;
};

export const getExperienceById = async (id: string): Promise<ExperienceSingleResponse> => {
  const response = await api.get<ExperienceSingleResponse>(`/api/experiences/${id}`);
  return response.data;
};

export const createExperience = async (data: Partial<Experience>): Promise<ExperienceSingleResponse> => {
  const response = await api.post<ExperienceSingleResponse>("/api/experiences", data);
  return response.data;
};

export const updateExperience = async (id: string, data: Partial<Experience>): Promise<ExperienceSingleResponse> => {
  const response = await api.put<ExperienceSingleResponse>(`/api/experiences/${id}`, data);
  return response.data;
};

export const deleteExperience = async (id: string): Promise<{ success: boolean; message: string }> => {
  const response = await api.delete<{ success: boolean; message: string }>(`/api/experiences/${id}`);
  return response.data;
};

export const getExperienceStats = async (): Promise<ExperienceStatsResponse> => {
  const response = await api.get<ExperienceStatsResponse>("/api/experiences/stats");
  return response.data;
};
