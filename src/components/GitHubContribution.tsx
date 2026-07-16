import { useTheme } from "next-themes";
import config from "@/config/GitHubUsername";
import type { StatProps } from "@/types";
import { useGithubContribution } from "@/hooks/useStatisticsSection";

export const GitHubContributions = () => {
  const { loading, error, days, year, setYear, t, years, total, best, avg, weekTotal, weeks, getColor, getMonthLabel } = useGithubContribution();

  if (loading) return <div className="p-6 text-center">Loading contributions...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;
  if (!days.length) return null;

  return (
    <div className="p-4 sm:p-6 rounded-md text-foreground">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Stat label={t.statistik.githubcard.total} value={total} />
        <Stat label={t.statistik.githubcard.minggu} value={weekTotal} />
        <Stat label={t.statistik.githubcard.best} value={best} />
        <Stat label={t.statistik.githubcard.average} value={`${avg} /${t.statistik.githubcard.hari}`} />
      </div>

      {/* Header + Year Selector */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-semibold text-muted-foreground">{t.statistik.githubcont}</h3>
        <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="bg-card border border-border text-foreground text-sm rounded px-2 py-1" aria-label="Pilih tahun kontribusi">
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* Contribution Grid — scrollable container */}
      <div className="p-3 border border-border shadow-sm rounded-md bg-card overflow-hidden">
        <div className="overflow-x-auto w-full">
          <div className="min-w-max">
            {/* Month labels */}
            <div className="flex gap-[3px] text-[10px] text-muted-foreground mb-1 pl-[2px]">
              {weeks.map((week, i) => {
                const firstDay = week[0];
                if (!firstDay) return <div key={i} className="w-[11px]" />;
                const date = new Date(firstDay.date);
                const isNewMonth = date.getDate() <= 7;
                return (
                  <div key={i} className="w-[11px] text-left shrink-0">
                    {isNewMonth ? getMonthLabel(firstDay) : ""}
                  </div>
                );
              })}
            </div>

            {/* Grid squares */}
            <div className="flex gap-[3px]">
              {weeks.map((week, i) => (
                <div key={i} className="flex flex-col gap-[3px] shrink-0">
                  {week.map((day, j) => (
                    <div key={j} title={`${day.date} • ${day.count} contributions`} className={`w-[11px] h-[11px] rounded-sm ${getColor(day.level)}`} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-3 px-1">
          <span>{t.statistik.gitcontribution.sedikit}</span>
          {[0, 1, 2, 3, 4].map((lvl) => (
            <div key={lvl} className={`w-3 h-3 rounded-sm shrink-0 ${getColor(lvl)}`} />
          ))}
          <span>{t.statistik.gitcontribution.banyak}</span>
        </div>
      </div>
    </div>
  );
};

const Stat = ({ label, value }: StatProps) => (
  <div className="p-3 sm:p-4 rounded-lg text-center bg-card border border-border shadow-sm">
    <p className="text-muted-foreground text-xs sm:text-sm leading-tight">{label}</p>
    <p className="text-yellow-400 text-xl sm:text-2xl font-bold mt-1 break-words">{value}</p>
  </div>
);

export const GithubActivityGraph = () => {
  const { theme } = useTheme();
  const graphTheme = theme === "dark" ? "github-dark" : "github-light";

  return (
    <div className="w-full overflow-x-auto">
      <img
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
        className="w-full min-w-[320px] rounded-md"
        src={`https://github-readme-activity-graph.vercel.app/graph?username=${config.github.username}&theme=${graphTheme}&hide_border=true`}
        alt="GitHub Activity Graph"
        loading="lazy"
      />
    </div>
  );
};
