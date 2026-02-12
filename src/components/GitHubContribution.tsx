import { useEffect, useState } from "react";
import { useLanguage } from "./LanguageProvider";

interface Day {
  date: string;
  count: number;
  level: number;
}

interface StatProps {
  label: string;
  value: string | number;
}

const GitHubContributions = () => {
  const [days, setDays] = useState<Day[]>([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const { t } = useLanguage();

  useEffect(() => {
    fetch("https://github-contributions-api.jogruber.de/v4/FelixWahyu")
      .then((res) => res.json())
      .then((json) => setDays(json.contributions || []))
      .catch(console.error);
  }, []);

  const years = Array.from(new Set(days.map((d) => new Date(d.date).getFullYear()))).sort((a, b) => b - a);

  const filteredDays = days.filter((d) => new Date(d.date).getFullYear() === year);

  const sortedDays = [...filteredDays].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (!days.length) return null;

  const total = filteredDays.reduce((s, d) => s + d.count, 0);
  const best = Math.max(0, ...filteredDays.map((d) => d.count));
  const avg = Math.round(total / filteredDays.length || 0);

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekTotal = filteredDays.slice(-7).reduce((s, d) => s + d.count, 0);

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
    return ["bg-[#161b22]", "bg-[#0e4429]", "bg-[#006d32]", "bg-[#26a641]", "bg-[#39d353]"][level] || "bg-[#161b22]";
  };

  const getMonthLabel = (day: Day) => {
    const date = new Date(day.date);
    return date.toLocaleString("en-US", { month: "short" });
  };

  return (
    <div className="p-6 rounded-md text-white">
      {/* Statistik */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Stat label={t.statistik.githubcard.total} value={total} />
        <Stat label={t.statistik.githubcard.minggu} value={weekTotal} />
        <Stat label={t.statistik.githubcard.best} value={best} />
        <Stat label={t.statistik.githubcard.average} value={`${avg} /${t.statistik.githubcard.hari}`} />
      </div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-gray-500">{t.statistik.githubcont}</h3>

        <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="dark:bg-[#161b22] border border-gray-800 text-sm text-gray-900 dark:text-white rounded px-2 py-1">
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <div className="p-3 border border-gray-800 rounded-md bg-transparent dark:bg-[#0d1117]">
        {/* Bulan */}
        <div className="flex gap-[3px] text-xs text-gray-600 mb-2 pl-[2px]">
          {weeks.map((week, i) => {
            const firstDay = week[0];
            if (!firstDay) return <div key={i} className="w-[11px]" />;

            const date = new Date(firstDay.date);
            const isNewMonth = date.getDate() <= 7;

            return (
              <div key={i} className="w-[11px] text-left">
                {isNewMonth ? getMonthLabel(firstDay) : ""}
              </div>
            );
          })}
        </div>
        {/* Heatmap */}
        <div className="overflow-x-auto">
          <div className="inline-flex gap-[3px]">
            {weeks.map((week, i) => (
              <div key={i} className="flex flex-col gap-[3px]">
                {week.map((day, j) => (
                  <div key={j} title={`${day.date} • ${day.count} contributions`} className={`w-[11px] h-[11px] rounded-sm ${getColor(day.level)}`} />
                ))}
              </div>
            ))}
          </div>
        </div>
        {/* Legend */}
        <div className="flex items-center gap-2 text-xs text-gray-600 mt-4 px-2">
          <span>{t.statistik.gitcontribution.sedikit}</span>
          {[0, 1, 2, 3, 4].map((lvl) => (
            <div key={lvl} className={`w-3 h-3 rounded-sm ${getColor(lvl)}`} />
          ))}
          <span>{t.statistik.gitcontribution.banyak}</span>
        </div>
      </div>
    </div>
  );
};

const Stat = ({ label, value }: StatProps) => (
  <div className="p-4 rounded-lg text-center border border-gray-800">
    <p className="text-gray-600 text-sm">{label}</p>
    <p className="text-yellow-400 text-2xl font-bold mt-1">{value}</p>
  </div>
);

export default GitHubContributions;
