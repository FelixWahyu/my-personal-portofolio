import { ChevronRight, ExternalLink, Github, ChevronLeft, Loader2, Search } from "lucide-react";
import ProjectDetailModal from "../ProjectDetailModal";
import { useProjectSection } from "@/hooks/useProjectSection";

const ProjectsSection = () => {
  const { selectedProject, setSelectedProject, handlePrevPage, handleNextPage, totalPages, paginatedProjects, categories, setSelectedCategory, currentPage, setCurrentPage, dynamicProjects, selectedCategory, language, t, loading } =
    useProjectSection();

  return (
    <section className="animate-fade-in">
      <div className="pb-4 border-b-2 border-dashed mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">{t.projects.title}</h2>
          <p className="text-muted-foreground mt-1">{t.projects.subtitle}</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-10 p-1 rounded-lg w-full md:w-auto overflow-x-auto">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
              selectedCategory === category ? "bg-primary text-primary-foreground" : "text-muted-foreground border border-border hover:bg-muted hover:text-foreground"
            }`}
          >
            {category === "All" ? (language === "id" ? "Semua" : "All") : category}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="text-muted-foreground text-sm">{language === "id" ? "Memuat proyek..." : "Loading projects..."}</span>
        </div>
      ) : paginatedProjects.length > 0 ? (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            {paginatedProjects.map((project, index) => (
              <div key={project.id} className="group rounded-xl bg-card border border-border hover:border-primary/50 transition-all hover:-translate-y-1 hover:shadow-lg animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                <div className="relative aspect-[16/9] overflow-hidden rounded-t-lg group">
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {project.category && (
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                      <span className="px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-black/60 text-white border border-white/20 backdrop-blur-md">{project.category}</span>
                    </div>
                  )}

                  <div className="absolute bottom-4 left-4 right-4 flex gap-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    {project.demolink && (
                      <a href={project.demolink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md bg-primary/80 hover:bg-primary text-primary-foreground">
                        <ExternalLink className="w-4 h-4" />
                        {t.projects.demo}
                      </a>
                    )}
                    {project.sourcelink && (
                      <a href={project.sourcelink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md bg-background/80 text-foreground hover:bg-background">
                        <Github className="w-4 h-4" />
                        {t.projects.source}
                      </a>
                    )}
                  </div>
                </div>
                <div className="px-5 pt-5">
                  <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{project.description}</p>
                </div>

                <div className="mb-6 px-5">
                  <div className="mb-2">
                    <h3 className="font-semibold text-lg">{t.projects.techstack}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <span key={tech} className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <button onClick={() => setSelectedProject(project)} className="px-5 mb-4 text-primary text-sm flex gap-1 items-center">
                  {t.projects.showDetail} <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-left md:justify-center items-center gap-2 mt-8 mb-16 md:mb-0">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="p-2 rounded-full border border-border bg-card text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNumber = idx + 1;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`w-10 h-10 flex items-center justify-center rounded-full border transition-colors ${
                        currentPage === pageNumber ? "bg-primary text-primary-foreground border-primary" : "border-border bg-card text-foreground hover:bg-primary/10 hover:text-primary"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="p-2 rounded-full border border-border bg-card text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      ) : dynamicProjects && dynamicProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">{language === "id" ? "Proyek belum ditambahkan." : "Projects have not been added yet."}</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">{language === "id" ? "Proyek tidak ditemukan" : "No projects found"}</h3>
          <p className="text-muted-foreground mt-1 max-w-sm">{language === "id" ? "Tidak ada proyek yang cocok dengan filter kategori yang dipilih." : "There are no projects matching the selected category filter."}</p>
          <button
            onClick={() => {
              setSelectedCategory("All");
            }}
            className="mt-4 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium"
          >
            {language === "id" ? "Reset Filter" : "Reset Filters"}
          </button>
        </div>
      )}
      <ProjectDetailModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </section>
  );
};

export default ProjectsSection;
