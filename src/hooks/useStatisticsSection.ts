import { useState, useEffect } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { useTheme } from "next-themes";
import { WakaTimeStats } from "@/types";

export const useStatisticsSection = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [streakLoaded, setStreakLoaded] = useState(false);

  const githubTheme = theme === "dark" ? "tokyonight" : "github-light";

  return {
    t,
    theme,
    streakLoaded,
    setStreakLoaded,
    githubTheme,
  };
};

export const useWakatimeStats = () => {
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
      const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
      fetch(`${baseUrl}/api/wakatime`)
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

  return {
    stats,
    loading,
    error,
    retryCount,
    t,
    language,
    fetchStats,
  };
};
