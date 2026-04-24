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

  const githubTheme = theme === "dark" ? "tokyonight" : "github-light";

  return (
    <section className="animate-fade-in">
      {/* Heading */}
      <div className="pb-4 border-b-2 border-dashed mb-6">
        <h2 className="text-3xl font-bold text-foreground">{t.statistik.title}</h2>
        <p className="text-muted-foreground mt-1">{t.statistik.subtitle}</p>
      </div>

      {/* WakaTime */}
      <div className="mb-10">
        <WakaTimeStats />
      </div>

      {/* GitHub Section Heading */}
      <h3 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2 mt-8 mb-2">
        <FaGithub className="w-5 h-5 text-primary shrink-0" />
        <span className="break-words">{t.statistik.gitstats}</span>
      </h3>
      <p className="text-muted-foreground text-sm sm:text-base">{t.statistik.gitsubstats}</p>

      {/* Streak Stats — scrollable on mobile */}
      <div className="mt-8">
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          {!streakLoaded && <div className="w-full h-36 bg-muted animate-pulse rounded-xl" />}
          <div className="overflow-x-auto w-full">
            <img
              onLoad={() => setStreakLoaded(true)}
              onError={(e) => { e.currentTarget.style.display = "none"; }}
              className="w-full min-w-[320px] h-auto block"
              src={`https://streak-stats.demolab.com?user=${config.github.username}&theme=${githubTheme}&hide_border=true`}
              alt="GitHub Streak Stats"
            />
          </div>
        </div>
      </div>

      {/* Contribution Heatmap + Activity Graph */}
      <div className="mt-8 space-y-6">
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <GitHubContributions />
        </div>
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <GithubActivityGraph />
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;
