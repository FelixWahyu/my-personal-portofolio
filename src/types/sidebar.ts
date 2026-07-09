export interface SidebarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}
