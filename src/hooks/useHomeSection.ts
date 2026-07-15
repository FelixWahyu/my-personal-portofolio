import { useEffect, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { getActiveResume } from "../services/resumeService";

export const useHomeSection = () => {
  const { t } = useLanguage();
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

  return { resumeUrl, t };
};
