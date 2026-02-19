import { useTheme } from "next-themes";
import { useLanguage } from "../LanguageProvider";
import { FaGithub } from "react-icons/fa";
import WakaTimeStats from "../WakatimeSection";
import { GitHubContributions, GithubActivityGraph } from "../GitHubContribution";
import { useState } from "react";
import config from "@/config/GitHubUsername";

const StatisticsSection = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [streakLoaded, setStreakLoaded] = useState(false);
  const [statLoaded, setStatLoaded] = useState(false);

  const githubTheme = theme === "dark" ? "tokyonight" : "github-light";
  return (
    <section className="animate-fade-in">
      <div className="pb-4 border-b-2 border-dashed mb-6">
        <h2 className="text-3xl font-bold text-foreground">{t.statistik.title}</h2>
        <p className="text-muted-foreground mt-1">{t.statistik.subtitle}</p>
      </div>

      <div className="mb-10">
        <WakaTimeStats />
      </div>

      <h3 className="text-2xl font-bold text-foreground flex items-center gap-2 mt-8 mb-2">
        <FaGithub className="w-5 h-5 text-primary" />
        {t.statistik.gitstats}
      </h3>
      <p className="text-muted-foreground">{t.statistik.gitsubstats}</p>

      <div className="mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300">
            {!streakLoaded && <div className="w-full h-48 bg-muted animate-pulse" />}
            <img
              onLoad={() => setStreakLoaded(true)}
              onError={(e) => {
                e.currentTarget.src = "/placeholder-stats.png";
              }}
              className="w-full h-auto"
              src={`https://streak-stats.demolab.com?user=${config.github.username}&theme=${githubTheme}&hide_border=true`}
              alt="GitHub Streak Stats"
            />
          </div>

          <div className="rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300">
            {!statLoaded && <div className="w-full h-48 bg-muted animate-pulse" />}
            <img
              onLoad={() => setStatLoaded(true)}
              onError={(e) => {
                e.currentTarget.src = "/placeholder-stats.png";
              }}
              className="w-full h-auto"
              src={`https://readme-stats.warengonzaga.com/api?username=${config.github.username}&theme=${githubTheme}&hide_border=true`}
              alt="GitHub Stats"
            />
          </div>
        </div>
      </div>

      <div className="mt-10 space-y-6">
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <GithubActivityGraph />
        </div>
        <GitHubContributions />
      </div>
    </section>
  );
};

export default StatisticsSection;
