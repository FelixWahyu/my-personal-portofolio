import { MapPin, Briefcase } from "lucide-react";
import { useLanguage } from "../LanguageProvider";

const HomeSection = () => {
  const { t } = useLanguage();

  return (
    <section className="animate-fade-in pb-6 mb-6 border-b">
      <h1 className="text-4xl font-bold mb-4">
        {t.home.greeting} <span className="text-primary">Felix Wahyu Sejati</span>
      </h1>

      <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <span>{t.home.location}</span>
        </div>
        <span className="hidden sm:inline">•</span>
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4" />
          <span>{t.home.status}</span>
        </div>
      </div>

      <div className="space-y-4 text-muted-foreground leading-relaxed">
        <p>{t.home.bio1}</p>
        <p>{t.home.bio2}</p>
      </div>
    </section>
  );
};

export default HomeSection;
