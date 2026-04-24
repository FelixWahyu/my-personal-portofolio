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
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const { t, language } = useLanguage();

  const fetchStats = () => {
    setLoading(true);
    setError(false);
    
    // Auto-retry up to 3 times for Koyeb cold starts
    const maxRetries = 3;

    const attemptFetch = (attempt: number) => {
      fetch("https://sudden-ptarmigan-surabya20-26c51e5b.koyeb.app/api/wakatime")
        .then((res) => {
          if (!res.ok) throw new Error("Server error");
          return res.json();
        })
        .then((data) => {
          setStats(data);
          setLoading(false);
          setError(false);
        })
        .catch((err) => {
          console.error(`WakaTime fetch failed (Attempt ${attempt}):`, err);
          if (attempt < maxRetries) {
            // Wait 5 seconds before retrying to give Koyeb time to wake up
            setTimeout(() => {
              setRetryCount(attempt);
              attemptFetch(attempt + 1);
            }, 5000);
          } else {
            setLoading(false);
            setError(true);
          }
        });
    };

    attemptFetch(1);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-6 border border-border rounded-xl bg-card text-center space-y-3">
        <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
        <p className="text-muted-foreground text-sm">
          {language === "id" 
            ? "Sedang mengambil data statistik WakaTime..." 
            : "Fetching WakaTime statistics..."}
        </p>
        {retryCount > 0 && (
          <p className="text-xs text-yellow-500">
            {language === "id"
              ? `Server sedang dibangunkan (Mencoba ulang ${retryCount}/3)... Ini mungkin memakan waktu hingga 15 detik.`
              : `Waking up server (Retry ${retryCount}/3)... This may take up to 15 seconds.`}
          </p>
        )}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-6 border border-border rounded-xl bg-card text-center space-y-3">
        <p className="text-destructive font-semibold">
          {language === "id" ? "Gagal memuat statistik WakaTime." : "Failed to load WakaTime stats."}
        </p>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          {language === "id" 
            ? "Server backend mungkin sedang tidak aktif atau terjadi batas waktu permintaan (timeout)." 
            : "The backend server might be inactive or a request timeout occurred."}
        </p>
        <button 
          onClick={fetchStats}
          className="mt-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary text-sm rounded-md transition-colors"
        >
          {language === "id" ? "Coba Lagi" : "Try Again"}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="section-title">
        <Code2 className="w-5 h-5 text-primary" />
        {t.statistik.wakatimetitle}
      </h2>
      <p className="text-muted-foreground">{t.statistik.wakatimesubtitle}</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
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
  <div className="bg-card border border-border rounded-xl p-3 sm:p-5 shadow-sm">
    <p className="text-muted-foreground text-xs sm:text-sm leading-tight">{title}</p>
    <p className="text-lg sm:text-2xl font-bold text-primary mt-2 break-words leading-tight">{value}</p>
  </div>
);

export default WakaTimeStats;
