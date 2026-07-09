export interface Achievement {
  id: number | string;
  title: string;
  issuer: string;
  tags: string[];
  date: string;
  code?: string;
  image: string;
  type?: string;
  description?: string;
}

export interface PropsAchievement {
  achievement: Achievement | null;
  onClose: () => void;
}

export interface PropsInfo {
  label: string;
  value?: string;
}
