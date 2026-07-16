import { useState, useEffect } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { useTheme } from "next-themes";
import { WakaTimeStats, Day } from "@/types";
import config from "@/config/GitHubUsername";

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

export const useGithubContribution = () => {
  const [days, setDays] = useState<Day[]>([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    setLoading(true);
    fetch(`https://github-contributions-api.jogruber.de/v4/${config.github.username}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((json) => {
        setDays(json.contributions || []);
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load GitHub contributions");
      })
      .finally(() => setLoading(false));
  }, []);

  const years = Array.from(new Set(days.map((d) => new Date(d.date).getFullYear()))).sort((a, b) => b - a);
  const filteredDays = days.filter((d) => new Date(d.date).getFullYear() === year);
  const sortedDays = [...filteredDays].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const total = filteredDays.reduce((s, d) => s + d.count, 0);
  const best = Math.max(0, ...filteredDays.map((d) => d.count));
  const avg = Math.round(total / filteredDays.length || 0);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const weekTotal = filteredDays.filter((d) => new Date(d.date) >= sevenDaysAgo).reduce((s, d) => s + d.count, 0);

  const groupByWeeks = (days: Day[]) => {
    const weeks: Day[][] = [];
    let week: Day[] = [];
    days.forEach((day) => {
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
      week.push(day);
    });
    if (week.length) weeks.push(week);
    return weeks;
  };

  const weeks = groupByWeeks(sortedDays);

  const getColor = (level: number) => {
    const lightColors = ["bg-gray-100", "bg-green-200", "bg-green-400", "bg-green-600", "bg-green-700"];
    const darkColors = ["bg-[#161b22]", "bg-[#0e4429]", "bg-[#006d32]", "bg-[#26a641]", "bg-[#39d353]"];
    return theme === "dark" ? darkColors[level] : lightColors[level];
  };

  const getMonthLabel = (day: Day) => {
    const date = new Date(day.date);
    return date.toLocaleString("en-US", { month: "short" });
  };

  return {
    days,
    year,
    setYear,
    t,
    loading,
    error,
    theme,
    years,
    total,
    best,
    avg,
    weekTotal,
    weeks,
    getColor,
    getMonthLabel,
  };
};
