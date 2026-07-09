export interface WakaTimeLang {
  name: string;
  percent: number;
}

export interface WakaTimeProject {
  name: string;
}

export interface WakaTimeStats {
  human_readable_total: string;
  human_readable_daily_average: string;
  languages: WakaTimeLang[];
  projects: WakaTimeProject[];
}

export interface statCardProps {
  title: string;
  value: string | number;
}
