import { ArrowRight, Search, Filter } from "lucide-react";
import { useLanguage } from "../LanguageProvider";
import { useEffect, useState, useMemo } from "react";
import AchievementDetailModal from "../AchievementDetailModal";

export interface Achievement {
  id: number;
  title: string;
  issuer: string;
  tags: string[];
  date: string;
  code?: string;
  image: string;
  type?: string;
  description?: string;
}

const AchievementsSection = () => {
  const { t, language } = useLanguage();
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  useEffect(() => {
    if (!selectedAchievement) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedAchievement]);

  const uniqueTypes = useMemo(() => {
    const types = new Set(t.achievements.items.map((item) => item.type).filter(Boolean) as string[]);
    return ["All", ...Array.from(types)];
  }, [t.achievements.items]);

  const filteredAchievements = useMemo(() => {
    return t.achievements.items.filter((achievement) => {
      const matchesSearch =
        achievement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        achievement.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (achievement.description && achievement.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesType = selectedType === "All" || achievement.type === selectedType;

      return matchesSearch && matchesType;
    });
  }, [t.achievements.items, searchQuery, selectedType]);

  return (
    <section className="animate-fade-in">
      <div className="pb-4 border-b-2 border-dashed mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">{t.achievements.title}</h2>
          <p className="text-muted-foreground mt-1">{t.achievements.subtitle}</p>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col mb-10 sm:flex-row gap-6 w-full md:w-auto">
        {/* Search */}
        <div className="relative group w-full sm:w-64">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder={language === "id" ? "Cari pencapaian..." : "Search achievements..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300"
          />
        </div>

        {/* Type Filter */}
        <div className="relative group w-full sm:w-48">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
            <Filter className="h-4 w-4" />
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full bg-card border border-border rounded-lg pl-10 pr-8 py-2 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 cursor-pointer"
          >
            {uniqueTypes.map((type) => (
              <option key={type} value={type}>
                {type === "All" ? (language === "id" ? "Semua Tipe" : "All Types") : type}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-muted-foreground">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {filteredAchievements.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAchievements.map((achievement, index) => (
            <div
              key={achievement.id}
              className="group relative rounded-lg bg-card border border-border overflow-hidden hover:border-primary/50 hover:shadow-lg transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-neutral-900">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <img src={achievement.image} className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105" loading="lazy" alt={achievement.title} />
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <button onClick={() => setSelectedAchievement(achievement)} className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-md hover:scale-105 transition">
                    {t.achievements.viewDetail} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-4 space-y-3">
                {achievement.code && <p className="text-xs text-muted-foreground font-mono truncate">{achievement.code}</p>}
                <h3 className="font-semibold text-sm leading-tight line-clamp-2">{achievement.title}</h3>
                <p className="text-xs text-muted-foreground">{achievement.issuer}</p>
                <div className="flex justify-between items-center pt-1 border-t border-border">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    {t.achievements.issuedOn} {achievement.date}
                  </p>
                  {achievement.type && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {achievement.type}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">{language === "id" ? "Pencapaian tidak ditemukan" : "No achievements found"}</h3>
          <p className="text-muted-foreground mt-1 max-w-sm">
            {language === "id"
              ? "Tidak ada pencapaian yang cocok dengan kata kunci atau filter tipe yang dipilih."
              : "There are no achievements matching your search keywords or selected type filter."}
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedType("All");
            }}
            className="mt-4 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium"
          >
            {language === "id" ? "Reset Filter" : "Reset Filters"}
          </button>
        </div>
      )}
      <AchievementDetailModal achievement={selectedAchievement} onClose={() => setSelectedAchievement(null)} />
    </section>
  );
};

export default AchievementsSection;
