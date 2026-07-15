import { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { useTheme } from "next-themes";

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
