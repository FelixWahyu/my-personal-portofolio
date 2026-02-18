import { createPortal } from "react-dom";
import { ExternalLink, Github, X, Check } from "lucide-react";
import { useLanguage } from "./LanguageProvider";
import { Project } from "./sections/ProjectsSection";
import { useEffect } from "react";

interface Props {
  project: Project | null;
  onClose: () => void;
}

const ProjectDetailModal = ({ project, onClose }: Props) => {
  const { t } = useLanguage();
  useEffect(() => {
    if (!project) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, project]);

  if (!project) return null;

  return createPortal(
    <div onClick={onClose} className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-6xl bg-card rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
        <button onClick={onClose} className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition">
          <X className="w-5 h-5" />
        </button>

        <div className="grid md:grid-cols-2 md:h-[90vh] md:overflow-hidden">
          <div className="relative flex items-center justify-center">
            <img src={project.image} alt={project.title} className="w-full h-auto max-h-full object-contain" />
          </div>

          <div className="p-6 space-y-5 md:overflow-y-auto">
            <div>
              <h2 className="text-xl font-bold">{project.title}</h2>
              <p className="text-muted-foreground">{project.description}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">{t.projects.techstack}</h3>
              <div className="flex flex-wrap gap-2">
                {project.tech?.map((tech) => (
                  <span key={tech} className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold">{t.projects.problemtitle}</h3>
              <p className="text-sm text-muted-foreground">{project.problem}</p>
            </div>

            <div>
              <h3 className="font-semibold">{t.projects.roletitle}</h3>
              <p className="text-sm text-muted-foreground">{project.role}</p>
            </div>

            <div>
              <h3 className="font-semibold">{t.projects.impacttitle}</h3>
              <p className="text-sm text-muted-foreground">{project.impact}</p>
            </div>

            <div>
              <h3 className="font-semibold">{t.projects.featurestitle}</h3>
              <ul className="mt-3 space-y-2 pl-2">
                {project.features.map((featured) => (
                  <li key={featured} className="text-sm text-muted-foreground flex gap-1">
                    <Check className="w-4 h-4" />
                    {featured}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-3 pt-4 flex-wrap">
              {project.demolink && (
                <a href={project.demolink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition">
                  <ExternalLink className="w-4 h-4" />
                  {t.projects.demo}
                </a>
              )}

              {project.sourcelink && (
                <a href={project.sourcelink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition">
                  <Github className="w-4 h-4" />
                  {t.projects.source}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default ProjectDetailModal;
