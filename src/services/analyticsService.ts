import api from "./api";

export interface AnalyticsResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const getPageviews = async (period: string = "7d"): Promise<AnalyticsResponse<any>> => {
  const response = await api.get(`/api/analytics/pageviews?period=${period}`);
  return response.data;
};

export const getReferrers = async (period: string = "30d", limit: number = 10): Promise<AnalyticsResponse<any>> => {
  const response = await api.get(`/api/analytics/referrers?period=${period}&limit=${limit}`);
  return response.data;
};

export const getDevices = async (period: string = "30d"): Promise<AnalyticsResponse<any>> => {
  const response = await api.get(`/api/analytics/devices?period=${period}`);
  return response.data;
};
