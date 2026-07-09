import { Code2 } from "lucide-react";
import SkillIcon from "../SkillIcon";
import { useLanguage } from "../LanguageProvider";
import { skills } from "../../const/tech-stack";

const SkillsSection = () => {
  const { t } = useLanguage();

  return (
    <section className="animate-fade-in mb-16 md:mb-6 mt-10">
      <h2 className="section-title">
        <Code2 className="w-5 h-5 text-primary" />
        {t.skills.title}
      </h2>
      <p className="text-muted-foreground mb-8">{t.skills.subtitle}</p>

      <div
        className="relative flex overflow-hidden w-full py-8"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        }}
      >
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
          {[...skills, ...skills].map((skill, index) => (
            <div key={`${skill.name}-${index}`} className="flex-shrink-0 mx-4 sm:mx-6">
              <SkillIcon {...skill} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
