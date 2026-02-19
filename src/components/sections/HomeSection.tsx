import { MapPin, Briefcase, Download } from "lucide-react";
import { useLanguage } from "../LanguageProvider";
import { Button } from "../ui/button";
import config from "@/config/GitHubUsername";

const HomeSection = () => {
  const { t } = useLanguage();

  return (
    <section className="animate-fade-in pb-6 mb-4">
      <h1 className="text-4xl font-bold mb-4 animate-fade-in">
        {t.home.greeting} <span className="text-primary">{config.bio.name}</span>
      </h1>

      <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
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

      <div className="space-y-4 text-muted-foreground leading-relaxed animate-fade-in" style={{ animationDelay: "200ms" }}>
        {t.home.bio.map((bio, index) => (
          <p key={index}>{bio}</p>
        ))}
      </div>

      <div className="flex gap-3 mt-6">
        <Button asChild variant="outline" className="gap-2">
          <a href="/files/CV_Felix_2026.pdf" download>
            <Download className="w-4 h-4" />
            {t.about.downloadResume}
          </a>
        </Button>
      </div>
    </section>
  );
};

export default HomeSection;
