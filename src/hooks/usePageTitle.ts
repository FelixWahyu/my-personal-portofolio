import { useEffect } from "react";
import { useLanguage } from "@/components/LanguageProvider";

const sectionTitles: Record<string, { id: string; en: string }> = {
  beranda: { id: "Beranda | Felix - Fullstack Developer", en: "Home | Felix - Fullstack Developer" },
  tentang: { id: "Tentang | Felix - Fullstack Developer", en: "About | Felix - Fullstack Developer" },
  statistik: { id: "Statistik | Felix - Fullstack Developer", en: "Statistics | Felix - Fullstack Developer" },
  pencapaian: { id: "Pencapaian | Felix - Fullstack Developer", en: "Achievements | Felix - Fullstack Developer" },
  proyek: { id: "Proyek | Felix - Fullstack Developer", en: "Projects | Felix - Fullstack Developer" },
  kontak: { id: "Kontak | Felix - Fullstack Developer", en: "Contact | Felix - Fullstack Developer" },
};

export function usePageTitle(activeSection: string) {
  const { language } = useLanguage();

  useEffect(() => {
    const titles = sectionTitles[activeSection];
    if (titles) {
      document.title = titles[language];
    } else {
      document.title = "Felix - Fullstack Developer";
    }
  }, [activeSection, language]);
}
