import { useState, useEffect, useMemo, useCallback } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { getProjects, Project as DBProject } from "@/services/projectService";
import { Project } from "@/types";

export const useProjectSection = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [dynamicProjects, setDynamicProjects] = useState<DBProject[] | null>(null);
  const itemsPerPage = 4;

  useEffect(() => {
    const fetchDynamicProjects = async () => {
      setLoading(true);
      try {
        const response = await getProjects({ limit: 100 });
        if (response.success && response.data?.projects) {
          setDynamicProjects(response.data.projects);
        }
      } catch (error) {
        console.error("Failed to load dynamic projects, using static fallback:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDynamicProjects();
  }, []);

  useEffect(() => {
    document.body.style.overflow = selectedProject ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedProject]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  const categories = ["All", "Web", "Mobile"];

  const mapProject = useCallback((dbProj: DBProject, lang: "id" | "en"): Project => {
    const isEn = lang === "en";
    return {
      id: dbProj.id,
      title: isEn ? dbProj.titleEn : dbProj.titleId,
      description: isEn ? dbProj.descriptionEn : dbProj.descriptionId,
      role: isEn ? dbProj.roleEn : dbProj.roleId,
      problem: isEn ? dbProj.problemEn : dbProj.problemId,
      impact: isEn ? dbProj.impactEn : dbProj.impactId,
      features: isEn ? dbProj.featuresEn || [] : dbProj.featuresId || [],
      image: dbProj.image,
      category: dbProj.category,
      tech: dbProj.tech || [],
      demolink: dbProj.demolink || undefined,
      sourcelink: dbProj.sourcelink || undefined,
    };
  }, []);

  const projectsListSource = useMemo(() => {
    return dynamicProjects !== null ? dynamicProjects.map((p) => mapProject(p, language)) : t.projects.items;
  }, [dynamicProjects, language, t.projects.items, mapProject]);

  const filteredProjects = useMemo(() => {
    return projectsListSource.filter((project) => {
      if (selectedCategory === "All") return true;
      return project.category?.toLowerCase() === selectedCategory.toLowerCase();
    });
  }, [projectsListSource, selectedCategory]);

  const totalPages = useMemo(() => Math.ceil(filteredProjects.length / itemsPerPage), [filteredProjects.length, itemsPerPage]);

  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProjects.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProjects, currentPage, itemsPerPage]);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return {
    selectedProject,
    setSelectedProject,
    selectedCategory,
    setSelectedCategory,
    currentPage,
    setCurrentPage,
    t,
    language,
    loading,
    dynamicProjects,
    itemsPerPage,
    categories,
    mapProject,
    projectsListSource,
    filteredProjects,
    totalPages,
    paginatedProjects,
    handlePrevPage,
    handleNextPage,
    handleCategoryChange: setSelectedCategory,
  };
};

export const useProjectDetailModal = (project: Project | null, onClose: () => void) => {
  const { t } = useLanguage();
  useEffect(() => {
    if (!project) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, project]);

  return {
    t,
    projectModal: project,
    onCloseModal: onClose,
  };
};
