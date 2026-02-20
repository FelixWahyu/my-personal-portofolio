import { Code2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "./LanguageProvider";

interface WakaTimeLang {
  name: string;
  percent: number;
}

interface WakaTimeProject {
  name: string;
}

interface WakaTimeStats {
  human_readable_total: string;
  human_readable_daily_average: string;
  languages: WakaTimeLang[];
  projects: WakaTimeProject[];
}

interface statCardProps {
  title: string;
  value: string | number;
}

const WakaTimeStats = () => {
  const [stats, setStats] = useState<WakaTimeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    fetch("https://backend-portofolio-gamma.vercel.app/api/wakatime")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading coding stats...</p>;
  if (!stats) return <p>Failed to load stats</p>;

  return (
    <div className="space-y-6">
      <h2 className="section-title">
        <Code2 className="w-5 h-5 text-primary" />
        {t.statistik.wakatimetitle}
      </h2>
      <p className="text-muted-foreground">{t.statistik.wakatimesubtitle}</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <StatCard title={t.statistik.wakatimecard.total} value={stats.human_readable_total || "0"} />
        <StatCard title={t.statistik.wakatimecard.average} value={stats.human_readable_daily_average || "0"} />
        <StatCard title={t.statistik.wakatimecard.bahasa} value={stats.languages?.length || 0} />
        <StatCard title={t.statistik.wakatimecard.project} value={stats.projects?.length || 0} />
      </div>

      {stats.languages && stats.languages.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold mb-4">{t.statistik.top}</h3>
          <div className="space-y-3">
            {stats.languages.slice(0, 5).map((lang) => (
              <div key={lang.name}>
                <div className="flex justify-between text-sm">
                  <span>{lang.name}</span>
                  <span>{lang.percent?.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 mt-1">
                  <div className="bg-primary h-2 rounded-full" style={{ width: `${lang.percent || 0}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value }: statCardProps) => (
  <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
    <p className="text-muted-foreground text-sm">{title}</p>
    <p className="text-2xl font-bold text-primary mt-2">{value}</p>
  </div>
);

export default WakaTimeStats;
