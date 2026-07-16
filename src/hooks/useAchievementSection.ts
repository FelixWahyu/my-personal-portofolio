import { useEffect, useState, useMemo } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { Achievement } from "@/types";
import { getAchievements } from "@/services/achievementService";

const ITEMS_PER_PAGE = 6;

export const useAchievementSection = () => {
  const { t, language } = useLanguage();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasAchievementsInDB, setHasAchievementsInDB] = useState<boolean | null>(null);

  useEffect(() => {
    if (!selectedAchievement) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedAchievement]);

  useEffect(() => {
    const loadAchievements = async () => {
      setLoading(true);
      try {
        const res = await getAchievements({ limit: 100 });
        if (res.success && res.data && res.data.achievements) {
          const mapped = res.data.achievements.map((item) => ({
            id: item.id,
            title: language === "id" ? item.titleId : item.titleEn,
            issuer: language === "id" ? item.issuerTextId : item.issuerTextEn,
            tags: language === "id" ? item.tagsId || [] : item.tagsEn || [],
            date: language === "id" ? item.dateId : item.dateEn,
            code: item.credentialCode || undefined,
            image: item.image,
            type: item.type,
            description: language === "id" ? item.descriptionId || undefined : item.descriptionEn || undefined,
          }));
          setAchievements(mapped);
          setHasAchievementsInDB(mapped.length > 0);
        } else {
          setAchievements(t.achievements.items);
          setHasAchievementsInDB(true);
        }
      } catch (error) {
        console.error("Failed to load achievements from API, using fallback static data:", error);
        setAchievements(t.achievements.items);
        setHasAchievementsInDB(true);
      } finally {
        setLoading(false);
      }
    };

    loadAchievements();
  }, [language, t.achievements.items]);

  const uniqueTypes = useMemo(() => {
    const types = new Set(achievements.map((item) => item.type).filter(Boolean) as string[]);
    return ["All", ...Array.from(types)];
  }, [achievements]);

  const filteredAchievements = useMemo(() => {
    return achievements.filter((achievement) => {
      const matchesSearch =
        achievement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        achievement.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (achievement.description && achievement.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesType = selectedType === "All" || achievement.type === selectedType;

      return matchesSearch && matchesType;
    });
  }, [achievements, searchQuery, selectedType]);

  const totalPages = Math.ceil(filteredAchievements.length / ITEMS_PER_PAGE);

  const paginatedAchievements = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAchievements.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAchievements, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedType]);

  return {
    t,
    language,
    achievements,
    loading,
    selectedAchievement,
    searchQuery,
    selectedType,
    currentPage,
    hasAchievementsInDB,
    uniqueTypes,
    filteredAchievements,
    totalPages,
    paginatedAchievements,
    setAchievements,
    setLoading,
    setSelectedAchievement,
    setSearchQuery,
    setSelectedType,
    setCurrentPage,
    setHasAchievementsInDB,
  };
};
