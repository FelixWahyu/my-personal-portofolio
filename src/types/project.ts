export interface Project {
  id: string | number;
  title: string;
  image: string;
  description: string;
  demolink?: string;
  sourcelink?: string;
  tech: string[];
  role: string;
  impact: string;
  problem: string;
  features: string[];
  category?: string;
}

export interface Props {
  project: Project | null;
  onClose: () => void;
}
