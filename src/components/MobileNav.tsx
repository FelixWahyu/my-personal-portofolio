import { useState } from "react";
import { Menu, X, Home, User, FileText, Trophy, FolderOpen, Mail } from "lucide-react";
import profilePhoto from "@/assets/foto-profile.webp";
import ThemeToggle from "./ThemeToggle";
import LanguageToggle from "./LanguageToggle";
import { useLanguage } from "./LanguageProvider";

interface MobileNavProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

const MobileNav = ({ activeSection, onNavigate }: MobileNavProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  const navItems = [
    { id: "beranda", label: t.nav.beranda, icon: <Home className="w-5 h-5" /> },
    { id: "tentang", label: t.nav.tentang, icon: <User className="w-5 h-5" /> },
    { id: "statistik", label: t.nav.statistik, icon: <FileText className="w-5 h-5" /> },
    { id: "pencapaian", label: t.nav.pencapaian, icon: <Trophy className="w-5 h-5" /> },
    { id: "proyek", label: t.nav.proyek, icon: <FolderOpen className="w-5 h-5" /> },
    { id: "kontak", label: t.nav.kontak, icon: <Mail className="w-5 h-5" /> },
  ];

  const handleNavigate = (section: string) => {
    onNavigate(section);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-sidebar border-b border-sidebar-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={profilePhoto} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
            <div>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-sm">Felix Wahyu Sejati</span>
              </div>
              <span className="text-xs text-muted-foreground">@felixwahyusejati</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle compact />
            <ThemeToggle compact />
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-lg hover:bg-accent transition-colors">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
          <nav className="absolute top-16 left-0 right-0 bg-sidebar border-b border-sidebar-border p-4" onClick={(e) => e.stopPropagation()}>
            {navItems.map((item) => (
              <button key={item.id} onClick={() => handleNavigate(item.id)} className={`nav-item w-full ${activeSection === item.id ? "nav-item-active" : ""}`}>
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      )}
    </>
  );
};

export default MobileNav;
