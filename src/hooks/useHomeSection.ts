import { useEffect, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { getActiveResume } from "../services/resumeService";

export const useHomeSection = () => {
  const { t } = useLanguage();
  const [resumeUrl, setResumeUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveResume = async () => {
      setLoading(true);
      try {
        const response = await getActiveResume();
        if (response.success && response.data) {
          setResumeUrl(response.data.fileUrl);
        }
      } catch (error) {
        console.error("Failed to load active resume:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchActiveResume();
  }, []);

  return { resumeUrl, t, loading };
};
