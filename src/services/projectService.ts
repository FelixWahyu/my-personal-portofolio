import api from "./api";

export interface Project {
  id: string;
  titleId: string;
  titleEn: string;
  descriptionId: string;
  descriptionEn: string;
  roleId: string;
  roleEn: string;
  problemId: string;
  problemEn: string;
  impactId: string;
  impactEn: string;
  featuresId: string[];
  featuresEn: string[];
  image: string;
  category: string;
  tech: string[];
  demolink?: string | null;
  sourcelink?: string | null;
  sortOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectListParams {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
  adminView?: boolean;
}

export interface ProjectListResponse {
  success: boolean;
  message: string;
  data: {
    projects: Project[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ProjectSingleResponse {
  success: boolean;
  message: string;
  data: Project;
}

export interface DashboardStatsResponse {
  success: boolean;
  message: string;
  data: {
    totalProjects: number;
  };
}

export const getProjects = async (params?: ProjectListParams): Promise<ProjectListResponse> => {
  const response = await api.get<ProjectListResponse>("/api/projects", { params });
  return response.data;
};

export const getProjectById = async (id: string): Promise<ProjectSingleResponse> => {
  const response = await api.get<ProjectSingleResponse>(`/api/projects/${id}`);
  return response.data;
};

export const createProject = async (formData: FormData): Promise<ProjectSingleResponse> => {
  const response = await api.post<ProjectSingleResponse>("/api/projects", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateProject = async (id: string, formData: FormData): Promise<ProjectSingleResponse> => {
  const response = await api.put<ProjectSingleResponse>(`/api/projects/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteProject = async (id: string): Promise<{ success: boolean; message: string }> => {
  const response = await api.delete<{ success: boolean; message: string }>(`/api/projects/${id}`);
  return response.data;
};

export const togglePublishProject = async (id: string): Promise<ProjectSingleResponse> => {
  const response = await api.put<ProjectSingleResponse>(`/api/projects/${id}/toggle-publish`);
  return response.data;
};

export const getDashboardStats = async (): Promise<DashboardStatsResponse> => {
  const response = await api.get<DashboardStatsResponse>("/api/projects/stats");
  return response.data;
};
