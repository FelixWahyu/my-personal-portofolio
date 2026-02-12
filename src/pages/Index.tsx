import { useState } from "react";
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

const Index = () => {
  const [activeSection, setActiveSection] = useState("beranda");

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
      {/* Mobile Navigation */}
      <MobileNav activeSection={activeSection} onNavigate={setActiveSection} />

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar activeSection={activeSection} onNavigate={setActiveSection} />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-10 pt-20 lg:pt-10 max-w-4xl">{renderSection()}</main>
      </div>
      <WhatsappButton />
    </div>
  );
};

export default Index;
