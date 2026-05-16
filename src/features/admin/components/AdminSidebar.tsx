import React from "react";
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  FolderOpen, 
  FileBadge, 
  ChevronRight,
  User
} from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";
import profilePhoto from "@/assets/foto-profile.webp";

const AdminSidebar = () => {
  const { user } = useAuth();

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" />, path: "/fw-admin/dashboard" },
    { id: "projects", label: "Projects", icon: <FolderOpen className="w-5 h-5" />, path: "/fw-admin/projects", disabled: true },
    { id: "achievements", label: "Achievements", icon: <FileBadge className="w-5 h-5" />, path: "/fw-admin/achievements", disabled: true },
  ];

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-screen sticky top-0 animate-fade-in">
      <div className="profile-card border-b border-sidebar-border py-8">
        <div className="relative mb-4 flex justify-center">
          <img 
            src={profilePhoto} 
            alt="Admin Profile" 
            className="w-20 h-20 rounded-full object-cover border-2 border-primary/50 shadow-lg" 
          />
        </div>
        <div className="text-center px-4">
          <h2 className="text-md font-semibold text-foreground truncate">{user?.name}</h2>
          <p className="text-xs text-muted-foreground mb-4">Administrator</p>
          <div className="flex justify-center">
            <ThemeToggle />
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          item.disabled ? (
            <div
              key={item.id}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground/50 cursor-not-allowed opacity-60"
              title="Coming Soon"
            >
              {item.icon}
              <span className="flex-1 text-left">{item.label}</span>
              <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded italic">Soon</span>
            </div>
          ) : (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-accent hover:text-foreground ${
                  isActive ? "bg-accent text-foreground font-medium" : "text-muted-foreground"
                }`
              }
            >
              {item.icon}
              <span className="flex-1 text-left">{item.label}</span>
              <ChevronRight className="w-4 h-4 text-primary opacity-50" />
            </NavLink>
          )
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
