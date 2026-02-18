import { ArrowRight } from "lucide-react";
import { useLanguage } from "../LanguageProvider";
import { useEffect, useState } from "react";
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
  const { t } = useLanguage();
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  useEffect(() => {
    if (!selectedAchievement) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedAchievement]);

  return (
    <section className="animate-fade-in">
      <div className="pb-4 border-b-2 border-dashed mb-6">
        <h2 className="text-3xl font-bold text-foreground">{t.achievements.title}</h2>
        <p className="text-muted-foreground mt-1">{t.achievements.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {t.achievements.items.map((achievement, index) => (
          <div
            key={achievement.id}
            className="group relative rounded-lg bg-card border border-border overflow-hidden hover:border-primary/50 hover:shadow-lg transition-all duration-300 animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
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
              <p className="text-xs text-muted-foreground uppercase tracking-wider pt-1 border-t border-border">
                {t.achievements.issuedOn} {achievement.date}
              </p>
            </div>
          </div>
        ))}
      </div>
      <AchievementDetailModal achievement={selectedAchievement} onClose={() => setSelectedAchievement(null)} />
    </section>
  );
};

export default AchievementsSection;
