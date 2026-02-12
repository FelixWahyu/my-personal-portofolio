import { FolderOpen, ExternalLink, Github } from "lucide-react";
import { useLanguage } from "../LanguageProvider";

const techStacks = [
  ["React", "Midtrans API", "TypeScript", "Tailwind CSS"],
  ["JQuery", "HTML5", "CSS3", "JavaScript", "Midtrans API"],
  ["React", "TypeScript", "GitHub API", "Tailwind CSS", "WakaTime API", "Express"],
  ["Laravel", "Tailwind CSS", "Whatsapp API", "Alpine.Js"],
  ["Laravel", "Tailwind CSS", "Gemini API", "JavaScript"],
];

const ProjectsSection = () => {
  const { t } = useLanguage();

  return (
    <section className="animate-fade-in">
      <div className="pb-4 border-b-2 border-dashed mb-6">
        <h2 className="text-3xl font-bold text-foreground">{t.projects.title}</h2>
        <p className="text-muted-foreground mt-1">{t.projects.subtitle}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {t.projects.items.map((project, index) => (
          <div key={index} className="p-5 rounded-lg bg-card border border-border hover:border-primary/50 transition-all hover:-translate-y-1 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
            <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
            <p className="text-muted-foreground text-sm mb-4">{project.description}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {techStacks[index].map((tech) => (
                <span key={tech} className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex gap-3">
              <a href={project.demolink} target="_blank" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                <ExternalLink className="w-4 h-4" />
                {t.projects.demo}
              </a>
              <a href={project.sourcelink} target="_blank" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Github className="w-4 h-4" />
                {t.projects.source}
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;
