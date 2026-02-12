import { useTheme } from "next-themes";
import { useLanguage } from "../LanguageProvider";
import { FaGithub } from "react-icons/fa";
import WakaTimeStats from "../WakatimeSection";
import { GitHubContributions, GithubActivityGraph } from "../GitHubContribution";

const StatisticsSection = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();

  const githubTheme = theme === "dark" ? "tokyonight" : "light";
  return (
    <section className="animate-fade-in">
      <div className="pb-4 border-b-2 border-dashed mb-6">
        <h2 className="text-3xl font-bold text-foreground">{t.statistik.title}</h2>
        <p className="text-muted-foreground mt-1">{t.statistik.subtitle}</p>
      </div>

      <div className="mb-8">
        <WakaTimeStats />
      </div>

      <h2 className="section-title">
        <FaGithub className="w-5 h-5 text-primary" />
        {t.statistik.gitstats}
      </h2>
      <p className="text-muted-foreground">{t.statistik.gitsubstats}</p>

      <div className="mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300">
            <img className="w-full h-auto" src={`https://streak-stats.demolab.com?user=FelixWahyu&theme=${githubTheme}&hide_border=true`} alt="GitHub Streak Stats" />
          </div>

          <div className="rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300">
            <img className="w-full h-auto" src={`https://readme-stats.warengonzaga.com/api?username=FelixWahyu&theme=${githubTheme}&hide_border=true&cache_seconds=7200`} alt="GitHub Stats" />
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <GithubActivityGraph />
        </div>
        <GitHubContributions />
      </div>
    </section>
  );
};

export default StatisticsSection;
