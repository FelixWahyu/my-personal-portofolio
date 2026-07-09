import { Home, User, FolderOpen, Mail, ChartLine, FileBadge } from "lucide-react";
import { useLanguage } from "../components/LanguageProvider";

export const NavItems = () => {
  const { t } = useLanguage();

  return [
    { id: "beranda", label: t.nav.beranda, icon: <Home className="w-5 h-5" /> },
    { id: "tentang", label: t.nav.tentang, icon: <User className="w-5 h-5" /> },
    { id: "statistik", label: t.nav.statistik, icon: <ChartLine className="w-5 h-5" /> },
    { id: "pencapaian", label: t.nav.pencapaian, icon: <FileBadge className="w-5 h-5" /> },
    { id: "proyek", label: t.nav.proyek, icon: <FolderOpen className="w-5 h-5" /> },
    { id: "kontak", label: t.nav.kontak, icon: <Mail className="w-5 h-5" /> },
  ];
};
