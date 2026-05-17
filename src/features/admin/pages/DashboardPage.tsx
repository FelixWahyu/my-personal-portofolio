import React, { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, FolderOpen, FileBadge, User, CheckCircle } from "lucide-react";
import { getDashboardStats } from "../../../services/projectService";

const DashboardPage = () => {
  const { user } = useAuth();
  const [totalProjects, setTotalProjects] = useState<number>(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getDashboardStats();
        if (response.success && response.data) {
          setTotalProjects(response.data.totalProjects);
        }
      } catch (error) {
        console.error("Failed to load dashboard stats:", error);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    {
      title: "Total Projects",
      value: totalProjects.toString(),
      icon: <FolderOpen className="h-4 w-4 text-primary" />,
      description: "Proyek yang ditampilkan",
    },
    {
      title: "Total Achievements",
      value: "0",
      icon: <FileBadge className="h-4 w-4 text-primary" />,
      description: "Sertifikat & pencapaian",
    },
    {
      title: "User Role",
      value: user?.role || "Admin",
      icon: <User className="h-4 w-4 text-primary" />,
      description: "Hak akses saat ini",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Selamat datang kembali, {user?.name || "Admin"}! Senang melihat Anda lagi.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-card border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-card border-border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5 text-primary" />
            Ringkasan Panel Admin
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Ini adalah panel admin untuk mengelola data website portfolio Anda. Semua fitur manajemen konten dirancang dengan performa optimal dan keamanan tinggi.
          </p>
          <div className="rounded-md bg-muted p-4">
            <h4 className="mb-2 font-medium flex items-center gap-1.5 text-sm">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              Fitur yang Telah Selesai:
            </h4>
            <ul className="list-inside list-disc space-y-1 text-xs text-muted-foreground ml-1">
              <li>Sistem Autentikasi Admin & Guard Route aman</li>
              <li>Manajemen data Proyek / Projects (Tambah, Edit, Hapus, Cari, Filter & Pagination)</li>
              <li>Integrasi upload dan hapus media secara otomatis di Cloudinary Cloud</li>
              <li>Dukungan konten Bilingual penuh (Bahasa Indonesia & English)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;

