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
