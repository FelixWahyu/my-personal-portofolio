import { useEffect, useState } from "react";
import { getExperiences } from "../services/experienceService";
import { getActiveResume } from "../services/resumeService";
import type { ExperienceItem } from "@/types";
import { useLanguage } from "../components/LanguageProvider";

export const useAboutSection = () => {
  const { t, language } = useLanguage();
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [resumeUrl, setResumeUrl] = useState<string>("");

  useEffect(() => {
    const fetchActiveResume = async () => {
      try {
        const response = await getActiveResume();
        if (response.success && response.data) {
          setResumeUrl(response.data.fileUrl);
        }
      } catch (error) {
        console.error("Failed to load active resume:", error);
      }
    };
    fetchActiveResume();
  }, []);

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

  return {
    experiences,
    loading,
    resumeUrl,
    t,
    language,
  };
};
