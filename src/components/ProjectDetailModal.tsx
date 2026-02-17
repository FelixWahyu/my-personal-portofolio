import { createPortal } from "react-dom";
import { ExternalLink, Github } from "lucide-react";
import { useLanguage } from "./LanguageProvider";
import { X } from "lucide-react";

const ProjectDetailModal = ({ project, onClose }) => {
  const { t } = useLanguage();
  if (!project) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-6xl bg-card rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition">
          <X className="w-5 h-5" />
        </button>

        <div className="grid md:grid-cols-2">
          {/* Image */}
          <div className="h-full">
            <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
          </div>

          {/* Content */}
          <div className="p-6 space-y-5">
            <div>
              <h2 className="text-xl font-bold">{project.title}</h2>
              <p className="text-muted-foreground">{project.description}</p>
            </div>

            {/* Tech Stack */}
            <div>
              <h3 className="font-semibold mb-2">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {project.teck?.map((tech) => (
                  <span key={tech} className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold">Problem</h3>
              <p className="text-sm text-muted-foreground">{project.problem}</p>
            </div>

            <div>
              <h3 className="font-semibold">Role</h3>
              <p className="text-sm text-muted-foreground">{project.role}</p>
            </div>

            <div>
              <h3 className="font-semibold">Impact</h3>
              <p className="text-sm text-muted-foreground">{project.impact}</p>
            </div>

            <div className="flex gap-3 pt-4 flex-wrap">
              {project.demolink && (
                <a href={project.demolink} target="_blank" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition">
                  <ExternalLink className="w-4 h-4" />
                  {t.projects.demo}
                </a>
              )}

              {project.sourcelink && (
                <a href={project.sourcelink} target="_blank" className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition">
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
