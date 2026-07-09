import { ChevronRight } from "lucide-react";
import profilePhoto from "@/assets/foto-profile.webp";
import ThemeToggle from "./ThemeToggle";
import LanguageToggle from "./LanguageToggle";
import { useLanguage } from "./LanguageProvider";
import config from "@/config/GitHubUsername";
import { NavItems } from "@/const/nav-item";
import type { SidebarProps } from "@/types";

const Sidebar = ({ activeSection, onNavigate }: SidebarProps) => {
  const { t } = useLanguage();
  const navItems = NavItems();

  return (
    <aside className="w-72 bg-sidebar border-r border-sidebar-border flex flex-col h-screen sticky top-0">
      <div className="profile-card border-b border-sidebar-border">
        <div className="relative mb-4">
          <img src={profilePhoto} alt="Profile" className="w-24 h-24 rounded-full object-cover border-2 border-border" />
        </div>
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-foreground">{config.bio.name}</h2>
        </div>
        <p className="text-muted-foreground text-sm mb-4">{config.bio.username}</p>

        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item, index) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            aria-label={`Navigasi ke ${item.label}`}
            aria-current={activeSection === item.id ? "page" : undefined}
            className={`nav-item w-full animate-slide-in ${activeSection === item.id ? "nav-item-active" : ""}`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {item.icon}
            <span className="flex-1 text-left">{item.label}</span>
            {activeSection === item.id && <ChevronRight className="w-4 h-4 text-primary" />}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <p className="text-xs text-muted-foreground text-center">{t.footer.copyright}</p>
      </div>
    </aside>
  );
};

export default Sidebar;
