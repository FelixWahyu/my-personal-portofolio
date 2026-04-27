import { Code2 } from "lucide-react";
import SkillIcon from "../SkillIcon";
import { useLanguage } from "../LanguageProvider";
import { FaHtml5, FaCss3Alt, FaJs, FaReact, FaNodeJs, FaGitAlt, FaGithub, FaBootstrap, FaPhp } from "react-icons/fa";
import { SiTypescript, SiNextdotjs, SiTailwindcss, SiMongodb, SiMysql, SiLaravel, SiExpress, SiVite, SiNpm } from "react-icons/si";

const skills = [
  { name: "HTML5", color: "#E34F26", icon: <FaHtml5 /> },
  { name: "CSS3", color: "#1572B6", icon: <FaCss3Alt /> },
  { name: "JavaScript", color: "#F7DF1E", icon: <FaJs /> },
  { name: "TypeScript", color: "#3178C6", icon: <SiTypescript /> },
  { name: "React", color: "#61DAFB", icon: <FaReact /> },
  { name: "Next.js", color: "#000000", icon: <SiNextdotjs /> },
  { name: "Node.js", color: "#339933", icon: <FaNodeJs /> },
  { name: "Express", color: "#000000", icon: <SiExpress /> },
  { name: "Vite", color: "#646CFF", icon: <SiVite /> },
  { name: "NPM", color: "#CB3837", icon: <SiNpm /> },
  { name: "Tailwind CSS", color: "#06B6D4", icon: <SiTailwindcss /> },
  { name: "Git", color: "#F05032", icon: <FaGitAlt /> },
  { name: "MongoDB", color: "#47A248", icon: <SiMongodb /> },
  { name: "MySQL", color: "#4169E1", icon: <SiMysql /> },
  { name: "PHP", color: "#777BB4", icon: <FaPhp /> },
  { name: "Laravel", color: "#FF2D20", icon: <SiLaravel /> },
  { name: "GitHub", color: "#000000", icon: <FaGithub /> },
  { name: "Bootstrap", color: "#7952B3", icon: <FaBootstrap /> },
];

const SkillsSection = () => {
  const { t } = useLanguage();

  return (
    <section className="animate-fade-in mb-6 mt-10">
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
