import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, FolderOpen, FileBadge, ChevronRight, User, Settings, LogOut } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";
import profilePhoto from "@/assets/foto-profile.webp";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface AdminSidebarProps {
  onNavItemClick?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  disabled?: boolean;
}

const AdminSidebar = ({ onNavItemClick }: AdminSidebarProps) => {
  const { user, logout } = useAuth();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const navItems: NavItem[] = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" />, path: "/fw-admin/dashboard" },
    { id: "projects", label: "Projects", icon: <FolderOpen className="w-5 h-5" />, path: "/fw-admin/projects" },
    { id: "achievements", label: "Achievements", icon: <FileBadge className="w-5 h-5" />, path: "/fw-admin/achievements" },
  ];

  return (
    <>
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-screen sticky top-0 animate-fade-in">
        <div className="profile-card border-b border-sidebar-border py-8">
          <div className="relative mb-4 flex justify-center">
            <img src={profilePhoto} alt="Admin Profile" className="w-20 h-20 rounded-full object-cover border-2 border-primary/50 shadow-lg" />
          </div>
          <div className="text-center px-4">
            <h2 className="text-md font-semibold text-foreground truncate">{user?.name}</h2>
            <p className="text-xs text-muted-foreground">Administrator</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) =>
            item.disabled ? (
              <div key={item.id} className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground/50 cursor-not-allowed opacity-60" title="Coming Soon">
                {item.icon}
                <span className="flex-1 text-left">{item.label}</span>
                <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded italic">Soon</span>
              </div>
            ) : (
              <NavLink
                key={item.id}
                to={item.path}
                onClick={onNavItemClick}
                className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-accent hover:text-foreground ${isActive ? "bg-accent text-foreground font-medium" : "text-muted-foreground"}`}
              >
                {item.icon}
                <span className="flex-1 text-left">{item.label}</span>
                <ChevronRight className="w-4 h-4 text-primary opacity-50" />
              </NavLink>
            ),
          )}
        </nav>

        <div className="px-4 pt-6 pb-20 lg:pb-4 lg:pt-4 border-t border-sidebar-border flex flex-col gap-3">
          {/* Theme Toggle - Desktop Only */}
          <div className="hidden lg:flex items-center justify-between px-4 py-2 bg-accent/30 rounded-lg">
            <span className="text-xs font-medium text-muted-foreground">Theme</span>
            <ThemeToggle />
          </div>

          {/* Profile Info, Edit, and Logout - Mobile Only */}
          <div className="lg:hidden flex flex-col gap-3">
            <div className="px-2 py-1 bg-accent/20 rounded-lg flex items-center gap-3">
              <span className="rounded-full flex items-center justify-center bg-accent/20 border border-accent/40 p-2">
                <User className="w-5 h-5 text-primary" />
              </span>
              <span className="font-semibold truncate flex flex-col">
                <p className="text-sm text-foreground">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <NavLink
                to="/fw-admin/profile"
                onClick={onNavItemClick}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border border-border bg-card hover:bg-accent text-foreground transition-all duration-200"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Edit</span>
              </NavLink>
              <button
                onClick={() => setShowLogoutDialog(true)}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-destructive/10 hover:bg-destructive/20 text-destructive border border-destructive/20 transition-all duration-200"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <LogOut className="w-5 h-5" />
              Logout?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin logout? Sesi Anda akan berakhir dan Anda perlu login kembali untuk mengakses panel admin.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (onNavItemClick) onNavItemClick();
                logout();
              }}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AdminSidebar;
