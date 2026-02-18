import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useEffect } from "react";
import { useLanguage } from "./LanguageProvider";
import { Achievements } from "./sections/AchievementsSection";

interface PropsAchievement {
  achievement: Achievements | null;
  onClose: () => void;
}

interface PropsInfo {
  label: string;
  value: string;
}

const AchievementDetailModal = ({ achievement, onClose }: PropsAchievement) => {
  const { t } = useLanguage();

  useEffect(() => {
    if (!achievement) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [achievement, onClose]);

  if (!achievement) return null;

  return createPortal(
    <div onClick={onClose} className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-6xl bg-card rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
        <button onClick={onClose} className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition">
          <X className="w-5 h-5" />
        </button>

        <div className="grid md:grid-cols-2 md:h-[90vh] md:overflow-hidden">
          <div className="relative flex items-center justify-center">
            <img src={achievement.image} alt={achievement.title} className="w-full h-full object-contain" />
          </div>

          <div className="p-6 my-auto space-y-5 md:overflow-y-auto">
            <div>
              <h2 className="text-2xl font-semibold leading-tight">{achievement.title}</h2>
              <p className="text-muted-foreground mt-1">{achievement.issuer}</p>
            </div>

            <InfoItem label={t.achievements.codetitle} value={achievement.code} />
            <InfoItem label={t.achievements.typetitle} value={achievement.type} />
            <InfoItem label={t.achievements.issuedOn} value={achievement.date} />

            {achievement.tags?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2">{t.achievements.categorytitle}</h3>
                <div className="flex flex-wrap gap-2">
                  {achievement.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 text-xs rounded-full bg-gray-600/10 border border-border">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {achievement.description && (
              <div>
                <h3 className="text-sm font-semibold mb-1">{t.achievements.descriptiontitle}</h3>
                <p className="text-sm text-muted-foreground">{achievement.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

const InfoItem = ({ label, value }: PropsInfo) => (
  <div>
    <p className="text-sm font-semibold">{label}</p>
    <p className="text-sm text-muted-foreground">{value}</p>
  </div>
);

export default AchievementDetailModal;
