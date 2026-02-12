import { ExternalLink, Github } from "lucide-react";
import { useLanguage } from "../LanguageProvider";

const techStacks = [
  ["Laravel", "Tailwind CSS", "Whatsapp API", "Alpine.Js"],
  ["Laravel", "Tailwind CSS", "Gemini API", "JavaScript"],
  ["React", "Midtrans API", "TypeScript", "Tailwind CSS"],
  ["JQuery", "HTML5", "CSS3", "JavaScript", "Midtrans API"],
  ["React", "TypeScript", "GitHub API", "Tailwind CSS", "WakaTime API", "Express"],
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
          <div key={index} className="group rounded-xl bg-card border border-gray-300 hover:border-primary/50 transition-all hover:-translate-y-1 hover:shadow-lg animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
            <div className="relative aspect-[16/9] overflow-hidden rounded-t-lg group">
              <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-4 left-4 right-4 flex gap-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                <a href={project.demolink} target="_blank" className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md bg-primary/80 hover:bg-primary text-primary-foreground">
                  <ExternalLink className="w-4 h-4" />
                  {t.projects.demo}
                </a>
                <a href={project.sourcelink} target="_blank" className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md bg-background/80 text-foreground hover:bg-background">
                  <Github className="w-4 h-4" />
                  {t.projects.source}
                </a>
              </div>
            </div>
            <div className="px-5 pt-5">
              <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
              <p className="text-muted-foreground text-sm mb-4">{project.description}</p>
            </div>
            <div className="flex flex-wrap gap-2 mb-4 px-5">
              {techStacks[index].map((tech) => (
                <span key={tech} className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;
