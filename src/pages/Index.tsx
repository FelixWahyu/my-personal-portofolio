import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import HomeSection from "@/components/sections/HomeSection";
import SkillsSection from "@/components/sections/SkillsSection";
import AboutSection from "@/components/sections/AboutSection";
import AchievementsSection from "@/components/sections/AchievementsSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import ContactSection from "@/components/sections/ContactSection";
import StatisticsSection from "@/components/sections/StatisticsSection";
import WhatsappButton from "@/components/WhatsappButton";
import PageTransition from "@/components/PageTransition";
import { usePageTitle } from "@/hooks/usePageTitle";

// Map URL path → section key
const pathToSection: Record<string, string> = {
  "/": "beranda",
  "/tentang": "tentang",
  "/statistik": "statistik",
  "/pencapaian": "pencapaian",
  "/proyek": "proyek",
  "/kontak": "kontak",
};

// Map section key → URL path
const sectionToPath: Record<string, string> = {
  beranda: "/",
  tentang: "/tentang",
  statistik: "/statistik",
  pencapaian: "/pencapaian",
  proyek: "/proyek",
  kontak: "/kontak",
};

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const activeSection = pathToSection[location.pathname] ?? "beranda";

  usePageTitle(activeSection);

  // Redirect unknown paths to home
  useEffect(() => {
    if (!pathToSection[location.pathname]) {
      navigate("/", { replace: true });
    }
  }, [location.pathname, navigate]);

  const handleNavigate = (section: string) => {
    const path = sectionToPath[section] ?? "/";
    navigate(path);
  };

  const renderSection = () => {
    switch (activeSection) {
      case "beranda":
        return (
          <>
            <HomeSection />
            <SkillsSection />
          </>
        );
      case "tentang":
        return <AboutSection />;
      case "statistik":
        return <StatisticsSection />;
      case "pencapaian":
        return <AchievementsSection />;
      case "proyek":
        return <ProjectsSection />;
      case "kontak":
        return <ContactSection />;
      default:
        return <HomeSection />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <MobileNav activeSection={activeSection} onNavigate={handleNavigate} />

      <div className="flex min-w-0">
        <div className="hidden lg:block shrink-0">
          <Sidebar activeSection={activeSection} onNavigate={handleNavigate} />
        </div>

        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-10 pt-20 lg:pt-10 max-w-4xl overflow-x-hidden">
          <PageTransition sectionKey={activeSection}>
            {renderSection()}
          </PageTransition>
        </main>
      </div>
      <WhatsappButton />
    </div>
  );
};

export default Index;
