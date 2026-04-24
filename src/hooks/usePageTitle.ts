import { useEffect } from "react";
import { useLanguage } from "@/components/LanguageProvider";

const sectionTitles: Record<string, { id: string; en: string }> = {
  beranda: { id: "Beranda | Felix Portofolio", en: "Home | Felix Portfolio" },
  tentang: { id: "Tentang | Felix Portofolio", en: "About | Felix Portfolio" },
  statistik: { id: "Statistik | Felix Portofolio", en: "Statistics | Felix Portfolio" },
  pencapaian: { id: "Pencapaian | Felix Portofolio", en: "Achievements | Felix Portfolio" },
  proyek: { id: "Proyek | Felix Portofolio", en: "Projects | Felix Portfolio" },
  kontak: { id: "Kontak | Felix Portofolio", en: "Contact | Felix Portfolio" },
};

export function usePageTitle(activeSection: string) {
  const { language } = useLanguage();

  useEffect(() => {
    const titles = sectionTitles[activeSection];
    if (titles) {
      document.title = titles[language];
    } else {
      document.title = language === "id" ? "Felix Portofolio" : "Felix Portfolio";
    }
  }, [activeSection, language]);
}
