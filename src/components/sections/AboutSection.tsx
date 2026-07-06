import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Briefcase, GraduationCap, Download, Check, ListCheck, Rocket, Brain, Loader2 } from "lucide-react";
import { useLanguage } from "../LanguageProvider";
import { Button } from "@/components/ui/button";
import type { ExperienceItem, EducationItem } from "@/types";
import { getExperiences } from "../../services/experienceService";

const ExperienceCard = ({ item }: { item: ExperienceItem }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="p-5 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground">{item.role}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {item.company} • {item.location}
          </p>
          <p className="text-sm text-muted-foreground">{item.period}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary">{item.duration}</span>
            <span className="px-2 py-0.5 text-xs rounded-full bg-accent text-accent-foreground">{item.type}</span>
            <span className="px-2 py-0.5 text-xs rounded-full bg-accent text-accent-foreground">{item.mode}</span>
          </div>
        </div>
      </div>

      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-1 my-3 text-sm text-primary hover:text-primary/80 transition-colors">
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        {isOpen ? t.about.hideResponsibilities : t.about.showResponsibilities}
      </button>
      <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-4 px-3">
        {item.responsibilities.length > 0 && (
          <>
            {isOpen && (
              <div>
                <h3 className="tex-sm text-primary flex items-center gap-2">
                  <ListCheck className="w-5 h-5" />
                  {t.about.job}
                </h3>
                <ul className="mt-3 space-y-2 pl-4 border-l-2 border-primary/20 animate-fade-in">
                  {item.responsibilities.map((resp, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex gap-2">
                      <Check className="w-5 h-5" />
                      {resp}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        {item.insight.length > 0 && (
          <>
            {isOpen && (
              <div>
                <h3 className="tex-sm text-primary flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  {t.about.learn}
                </h3>
                <ul className="mt-3 space-y-2 pl-4 border-l-2 border-primary/20 animate-fade-in">
                  {item.insight.map((resp, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex gap-2">
                      <Check className="w-5 h-5" />
                      {resp}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        {item.impact.length > 0 && (
          <>
            {isOpen && (
              <div>
                <h3 className="tex-sm text-primary flex items-center gap-2">
                  <Rocket className="w-5 h-5" />
                  {t.about.dampak}
                </h3>
                <ul className="mt-3 space-y-2 pl-4 border-l-2 border-primary/20 animate-fade-in">
                  {item.impact.map((resp, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex gap-2">
                      <Check className="w-5 h-5" />
                      {resp}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const EducationCard = ({ item }: { item: EducationItem }) => {
  return (
    <div className="p-5 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors">
      <h3 className="font-semibold text-foreground">{item.institution}</h3>
      <p className="text-sm text-muted-foreground mt-1">
        {item.degree} • {item.prodi}
      </p>
      <p className="text-sm text-muted-foreground">{item.gpa}</p>
      <p className="text-sm text-muted-foreground">
        {item.period} • {item.location}
      </p>
    </div>
  );
};

const AboutSection = () => {
  const { t, language } = useLanguage();
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      setLoading(true);
      try {
        const response = await getExperiences();
        if (response.success && response.data?.experiences) {
          const mapped = response.data.experiences.map((exp) => ({
            role: language === "id" ? exp.roleId : exp.roleEn,
            company: language === "id" ? exp.companyId : exp.companyEn,
            location: language === "id" ? exp.locationId : exp.locationEn,
            period: language === "id" ? exp.periodId : exp.periodEn,
            duration: language === "id" ? exp.durationId : exp.durationEn,
            type: language === "id" ? exp.typeId : exp.typeEn,
            mode: language === "id" ? exp.modeId : exp.modeEn,
            responsibilities: language === "id" ? exp.responsibilitiesId : exp.responsibilitiesEn,
            insight: language === "id" ? exp.insightId : exp.insightEn,
            impact: language === "id" ? exp.impactId : exp.impactEn,
          }));
          setExperiences(mapped);
        } else {
          // Fallback to translations if API fails
          setExperiences(t.about.experiences);
        }
      } catch (error) {
        console.error("Failed to load experiences:", error);
        setExperiences(t.about.experiences);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, [language, t.about.experiences]);

  return (
    <section className="animate-fade-in space-y-10 mb-16 md:mb-0">
      <div className="pb-4 border-b-2 border-dashed">
        <h2 className="text-3xl font-bold text-foreground">{t.about.title}</h2>
        <p className="text-muted-foreground mt-1">{t.about.subtitle}</p>
      </div>

      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">{t.about.description}</p>
        <p className="text-muted-foreground leading-relaxed">{t.about.description2}</p>
        <p className="text-muted-foreground leading-relaxed">{t.about.description3}</p>
        <p className="text-muted-foreground leading-relaxed">{t.about.funfact}</p>
      </div>

      <div className="flex flex-wrap gap-3 mt-6">
        <Button asChild variant="outline" className="gap-2">
          <a href="/files/Resume-06072026.pdf" download>
            <Download className="w-4 h-4" />
            {t.about.downloadResume}
          </a>
        </Button>
      </div>

      <div>
        <h3 className="text-xl font-semibold flex items-center gap-2 mb-2">
          <Briefcase className="w-5 h-5 text-primary" />
          {t.about.careerTitle}
        </h3>
        <p className="text-lg text-muted-foreground mb-4">{t.about.careerSubtitle}</p>
        <div className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="p-5 rounded-lg bg-card border border-border animate-pulse flex flex-col gap-3">
                  <div className="h-4 bg-muted rounded w-1/3" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                  <div className="flex gap-2">
                    <div className="h-5 bg-muted rounded-full w-16" />
                    <div className="h-5 bg-muted rounded-full w-20" />
                    <div className="h-5 bg-muted rounded-full w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            experiences.map((item, index) => (
              <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <ExperienceCard item={item} />
              </div>
            ))
          )}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold flex items-center gap-2 mb-4">
          <GraduationCap className="w-5 h-5 text-primary" />
          {t.about.educationTitle}
        </h3>
        <div className="space-y-4">
          {t.about.educations.map((item, index) => (
            <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <EducationCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
