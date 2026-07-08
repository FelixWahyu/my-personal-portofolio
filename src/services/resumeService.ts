import api from "./api";

export interface Resume {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ResumeListParams {
  search?: string;
  page?: number;
  limit?: number;
}

export interface ResumeListResponse {
  success: boolean;
  message: string;
  data: {
    resumes: Resume[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ResumeSingleResponse {
  success: boolean;
  message: string;
  data: Resume;
}

export interface ResumeStatsResponse {
  success: boolean;
  message: string;
  data: {
    totalResumes: number;
  };
}

export const getResumes = async (params?: ResumeListParams): Promise<ResumeListResponse> => {
  const response = await api.get<ResumeListResponse>("/api/resumes", { params });
  return response.data;
};

export const getResumeById = async (id: string): Promise<ResumeSingleResponse> => {
  const response = await api.get<ResumeSingleResponse>(`/api/resumes/${id}`);
  return response.data;
};

export const getActiveResume = async (): Promise<ResumeSingleResponse> => {
  const response = await api.get<ResumeSingleResponse>("/api/resumes/active");
  return response.data;
};

export const createResume = async (formData: FormData): Promise<ResumeSingleResponse> => {
  const response = await api.post<ResumeSingleResponse>("/api/resumes", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateResume = async (id: string, formData: FormData): Promise<ResumeSingleResponse> => {
  const response = await api.put<ResumeSingleResponse>(`/api/resumes/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteResume = async (id: string): Promise<{ success: boolean; message: string }> => {
  const response = await api.delete<{ success: boolean; message: string }>(`/api/resumes/${id}`);
  return response.data;
};

export const activateResume = async (id: string): Promise<{ success: boolean; message: string }> => {
  const response = await api.put<{ success: boolean; message: string }>(`/api/resumes/${id}/activate`);
  return response.data;
};

export const getResumeStats = async (): Promise<ResumeStatsResponse> => {
  const response = await api.get<ResumeStatsResponse>("/api/resumes/stats");
  return response.data;
};
