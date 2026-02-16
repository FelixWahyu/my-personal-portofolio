import { Home, User, FolderOpen, Mail, ChevronRight, ChartLine, FileBadge } from "lucide-react";
import profilePhoto from "@/assets/foto-profile.jpg";
import ThemeToggle from "./ThemeToggle";
import LanguageToggle from "./LanguageToggle";
import { useLanguage } from "./LanguageProvider";

interface SidebarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

const Sidebar = ({ activeSection, onNavigate }: SidebarProps) => {
  const { t } = useLanguage();

  const navItems = [
    { id: "beranda", label: t.nav.beranda, icon: <Home className="w-5 h-5" /> },
    { id: "tentang", label: t.nav.tentang, icon: <User className="w-5 h-5" /> },
    { id: "statistik", label: t.nav.statistik, icon: <ChartLine className="w-5 h-5" /> },
    { id: "pencapaian", label: t.nav.pencapaian, icon: <FileBadge className="w-5 h-5" /> },
    { id: "proyek", label: t.nav.proyek, icon: <FolderOpen className="w-5 h-5" /> },
    { id: "kontak", label: t.nav.kontak, icon: <Mail className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-72 bg-sidebar border-r border-sidebar-border flex flex-col h-screen sticky top-0">
      {/* Profile Section */}
      <div className="profile-card border-b border-sidebar-border">
        <div className="relative mb-4">
          <img src={profilePhoto} alt="Profile" className="w-24 h-24 rounded-full object-cover border-2 border-border" />
        </div>
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-foreground">Felix Wahyu Sejati</h2>
        </div>
        <p className="text-muted-foreground text-sm mb-4">@felixwahyusejati</p>

        {/* Language & Theme Toggles */}
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item, index) => (
          <button key={item.id} onClick={() => onNavigate(item.id)} className={`nav-item w-full animate-slide-in ${activeSection === item.id ? "nav-item-active" : ""}`} style={{ animationDelay: `${index * 50}ms` }}>
            {item.icon}
            <span className="flex-1 text-left">{item.label}</span>
            {activeSection === item.id && <ChevronRight className="w-4 h-4 text-primary" />}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <p className="text-xs text-muted-foreground text-center">{t.footer.copyright}</p>
      </div>
    </aside>
  );
};

export default Sidebar;
